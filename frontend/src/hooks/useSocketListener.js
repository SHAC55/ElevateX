// src/hooks/useSocketListener.js
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useSocketListener = (event, callback) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }, [socket, event, callback]);
};
