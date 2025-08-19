import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
export const SocketContext = createContext();

export const SocketProvider = ({ children, profile }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("📡 Connecting to socket server...");

    const token = localStorage.getItem("token"); // or from cookies or context

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token, // 👈 send token here
      },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.onAny((event, ...args) => {
      console.log("📥 Socket Event:", event, args);
    });

    setSocket(newSocket);

    return () => {
      console.log("❌ Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && profile?._id) {
      socket.emit("addUser", profile._id);
      console.log("👤 addUser emitted with ID:", profile._id);
    }
  }, [socket, profile]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
