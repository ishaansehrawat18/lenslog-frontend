import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth.js";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect once we have a logged-in user with a token available.
    const token = localStorage.getItem("lenslog_token");
    if (!user || !token) {
      // If we had a previous connection (e.g. user just logged out),
      // clean it up.
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const newSocket = io(socketUrl, {
      auth: { token },
    });

    setSocket(newSocket);

    // Clean up the connection when the component unmounts or the
    // user changes (e.g. logs out then a different user logs in).
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}