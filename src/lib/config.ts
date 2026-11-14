/**
 * Runtime configuration read from NEXT_PUBLIC_* env vars.
 *
 * NEXT_PUBLIC_USE_MOCK_API (default "true") routes every API call to the
 * in-browser mock server in src/lib/mock/. Set it to "false" once the NestJS
 * backend is running and every call goes over HTTP to NEXT_PUBLIC_API_BASE_URL
 * instead. No component changes are needed when switching.
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",
};
