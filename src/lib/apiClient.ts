/**
 * Typed fetch wrapper. Every hook goes through this, never through fetch().
 *
 *  - Adds the JWT as `Authorization: Bearer …`
 *  - Converts error responses into GroundPulseError (API spec section 8)
 *  - Logs the user out on 401
 *  - In mock mode, hands the request to the in-browser mock server instead
 */
import { config } from "./config";
import { GroundPulseError, type GroundPulseErrorCode } from "./errors";
import { useAuthStore } from "@/stores/authStore";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

let refreshing: Promise<string | null> | null = null;

/** POST /auth/refresh with the refresh token. Concurrent 401s share one refresh. */
function refreshAccessToken(): Promise<string | null> {
  refreshing ??= (async () => {
    const { refreshToken, setSession } = useAuthStore.getState();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${config.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      setSession(data);
      return data.accessToken as string;
    } catch {
      return null;
    } finally {
      setTimeout(() => (refreshing = null), 0);
    }
  })();
  return refreshing;
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  if (config.useMockApi) {
    const { handleMockRequest } = await import("./mock/server");
    try {
      return await handleMockRequest<T>(method, path, body, token);
    } catch (err) {
      if (err instanceof GroundPulseError && err.statusCode === 401) useAuthStore.getState().logout();
      throw err;
    }
  }

  const send = (accessToken: string | null) =>
    fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  let res: Response;
  try {
    res = await send(token);
    // Access tokens are short-lived (15 min): refresh once and retry.
    if (res.status === 401 && token && !path.startsWith("/auth/")) {
      const fresh = await refreshAccessToken();
      if (fresh) res = await send(fresh);
    }
  } catch (err) {
    throw new GroundPulseError("NETWORK_ERROR", "Couldn't reach the server. Check your connection.", 0, err);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && !path.startsWith("/auth/login")) useAuthStore.getState().logout();
    const message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    throw new GroundPulseError(
      (data.code as GroundPulseErrorCode) ?? "UNKNOWN",
      message || res.statusText || "Request failed",
      res.status,
      data
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body ?? {}),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body ?? {}),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
