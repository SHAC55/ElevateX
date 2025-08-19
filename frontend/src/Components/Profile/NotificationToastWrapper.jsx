
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FaBell, FaTimes, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const NotificationToast = ({ notification, onClose }) => {
  if (!notification) return null;

  const iconMap = {
    friend_request: <FaUserPlus className="text-blue-500" />,
    friend_accept: <FaUserCheck className="text-green-500" />,
    default: <IoIosNotifications className="text-purple-500" />
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-4 w-full flex items-start gap-3 pointer-events-auto relative overflow-hidden"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Notification icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
        className="mt-1"
      >
        {iconMap[notification.type] || iconMap.default}
      </motion.div>

      {/* Message content */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {notification.type === "friend_request" &&
            `${notification.fromUser?.username || "Someone"} sent you a friend request`}
          {notification.type === "friend_accept" &&
            `${notification.fromUser?.username || "Someone"} accepted your friend request`}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {notification.createdAt
    ? new Date(notification.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""}
</p>
      </div>

      {/* Close button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.2, color: "#ef4444" }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-400 hover:text-red-500 text-lg font-bold transition-colors"
      >
        <FaTimes />
      </motion.button>
    </motion.div>
  );
};

const NotificationToastWrapper = ({ latestNotification, clearToast, bellRef }) => {
  const [toastQueue, setToastQueue] = useState([]);
  const containerRef = useRef(document.createElement("div"));

  // Create portal container
  useEffect(() => {
    const notificationRoot = document.getElementById("notification-root");
    if (!notificationRoot) {
      const newRoot = document.createElement("div");
      newRoot.id = "notification-root";
      Object.assign(newRoot.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "2147483647",
        overflow: "hidden"
      });
      document.body.appendChild(newRoot);
    }

    const currentRef = containerRef.current;
    Object.assign(currentRef.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      overflow: "visible"
    });

    const root = document.getElementById("notification-root");
    root.appendChild(currentRef);

    return () => {
      root?.removeChild(currentRef);
    };
  }, []);

  // Add new notifications
  useEffect(() => {
    if (latestNotification) {
      setToastQueue((prev) => [...prev, latestNotification]);
      
      const timer = setTimeout(() => {
        setToastQueue((prev) => prev.filter((t) => t._id !== latestNotification._id));
        clearToast?.(latestNotification._id);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [latestNotification, clearToast]);

  const getBellPosition = () => {
    if (!bellRef?.current) return { 
      x: window.innerWidth - 50, 
      y: 70, 
      width: 24, 
      height: 24 
    };
    
    const bellRect = bellRef.current.getBoundingClientRect();
    return {
      x: bellRect.left + bellRect.width / 2,
      y: bellRect.top + bellRect.height,
      width: bellRect.width,
      height: bellRect.height,
    };
  };

  return createPortal(
    <AnimatePresence>
      {toastQueue.map((toast, index) => {
        const bellPos = getBellPosition();
        const bubbleWidth = 320;
        const bubbleHeight = 90;
        const spacing = 15;

        const targetX = Math.min(
          Math.max(bellPos.x - bubbleWidth / 2, 20),
          window.innerWidth - bubbleWidth - 20
        );
        const targetY = bellPos.y + index * (bubbleHeight + spacing);

        return (
          <motion.div
            key={toast._id}
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              x: bellPos.x, 
              y: bellPos.y,
              rotate: -5
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: targetX,
              y: targetY,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 20,
                delay: index * 0.15,
                duration: 0.6
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              x: bellPos.x,
              y: bellPos.y,
              rotate: 5,
              transition: { 
                duration: 0.4,
                ease: "backIn"
              },
            }}
            className="absolute pointer-events-auto"
            style={{ 
              width: bubbleWidth, 
              minHeight: bubbleHeight,
              zIndex: 2147483646 - index
            }}
          >
            {/* Speech bubble tip */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.15 + 0.2 }
              }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "15px solid white",
                filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.1))",
              }}
            />
            
            <NotificationToast
              notification={toast}
              onClose={() => {
                setToastQueue((prev) => prev.filter((t) => t._id !== toast._id));
                clearToast?.(toast._id);
              }}
            />
          </motion.div>
        );
      })}
    </AnimatePresence>,
    containerRef.current
  );
};

export default NotificationToastWrapper;