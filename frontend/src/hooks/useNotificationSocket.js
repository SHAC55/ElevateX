import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "../context/AuthContext"; // assuming this gives you user._id

export const useNotificationSocket = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("joinRoom", user._id); // 🚨 important
    console.log("👤 Joining room:", user._id);

    const handleNotification = (notification) => {
      console.log("🔔 Notification received via socket:", notification);
      setNotificationsCount((prev) => prev + 1);
        setLatestNotification(notification);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, user]);

  return {
    socket,
    notificationsCount,
    latestNotification,
    clearToast: () => setLatestNotification(null),
    resetNotifications: () => setNotificationsCount(0),
  };
};
