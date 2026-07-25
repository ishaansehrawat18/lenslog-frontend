import { useContext } from "react";
import { SocketContext } from "../context/SocketContext.jsx";

// Returns the current socket connection, or null if not connected yet
// (e.g. logged out, or the connection is still being established).
// Unlike our other hooks, this doesn't throw if used outside the
// provider being "ready" — components should handle a null socket
// gracefully (e.g. skip emitting events until it's available).
export function useSocket() {
  return useContext(SocketContext);
}