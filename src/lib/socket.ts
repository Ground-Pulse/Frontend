/**
 * Socket.IO client singleton (API spec section 7).
 *
 * One shared connection per session. The server puts each client in its own
 * `user:{userId}` room, so a client can never receive another user's events.
 * In mock mode the same events come from the in-browser bus instead.
 */
import { io, type Socket } from "socket.io-client";
import { config } from "./config";
import type { ConnectionState } from "@/stores/realtimeStore";

export type RealtimeHandler = (event: string, payload: unknown) => void;

export const REALTIME_EVENTS = [
  "repair.status.updated",
  "issue.flagged",
  "report.ready",
  "notification.new",
  "inspection.updated",
  "dashboard.changed",
] as const;

let socket: Socket | null = null;

export function connectRealtime(
  userId: string,
  token: string,
  onEvent: RealtimeHandler,
  onConnection: (state: ConnectionState) => void
): () => void {
  if (config.useMockApi) {
    let off: (() => void) | null = null;
    onConnection("connecting");
    const t = setTimeout(async () => {
      const { mockBus } = await import("./mock/bus");
      off = mockBus.join(`user:${userId}`, onEvent);
      onConnection("connected");
    }, 300);
    return () => {
      clearTimeout(t);
      off?.();
      onConnection("offline");
    };
  }

  socket?.disconnect();
  socket = io(config.wsUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    auth: { token },
    transports: ["websocket", "polling"],
  });
  onConnection("connecting");
  socket.on("connect", () => onConnection("connected"));
  socket.on("disconnect", () => onConnection("reconnecting"));
  socket.io.on("reconnect_attempt", () => onConnection("reconnecting"));
  socket.on("connect_error", () => onConnection("reconnecting"));
  REALTIME_EVENTS.forEach((evt) => socket!.on(evt, (payload: unknown) => onEvent(evt, payload)));
  socket.connect();

  return () => {
    socket?.disconnect();
    socket = null;
    onConnection("offline");
  };
}
