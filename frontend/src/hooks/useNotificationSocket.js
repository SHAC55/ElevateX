import { useEffect, useRef, useState } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "../context/AuthContext"; // assuming this gives you user._id
import { syncLearningNotifications } from "../api/notifications";

export const useNotificationSocket = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);
  const hasSyncedLearningRef = useRef(false);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNotification = (notification) => {
      const normalizedNotification = {
        ...notification,
        _id:
          notification?._id ||
          notification?.id ||
          `${notification?.type || "notification"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      console.log("🔔 Notification received via socket:", notification);
      setNotificationsCount((prev) => prev + 1);
      setLatestNotification(normalizedNotification);
    };

    socket.on("notification", handleNotification);
    socket.emit("joinRoom", user._id); // 🚨 important
    console.log("👤 Joining room:", user._id);

    if (!hasSyncedLearningRef.current) {
      hasSyncedLearningRef.current = true;
      syncLearningNotifications().catch((err) => {
        console.error("Failed to sync learning notifications", err);
      });
    }

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
