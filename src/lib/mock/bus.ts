/**
 * Tiny event bus that stands in for the Socket.IO gateway while the backend
 * doesn't exist. The mock server emits to "user:{id}" rooms exactly like the
 * NestJS gateway will; src/lib/socket.ts subscribes to the current user's room.
 */
type Listener = (event: string, payload: unknown) => void;

const rooms = new Map<string, Set<Listener>>();

export const mockBus = {
  join(room: string, listener: Listener) {
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room)!.add(listener);
    return () => rooms.get(room)?.delete(listener);
  },
  emit(room: string, event: string, payload: unknown) {
    rooms.get(room)?.forEach((l) => {
      // async, like a real network push
      setTimeout(() => l(event, payload), 50);
    });
  },
};
