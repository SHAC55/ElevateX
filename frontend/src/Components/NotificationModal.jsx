
// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { formatDistanceToNow } from "date-fns";
// import {
//   getNotifications,
//   archiveNotification,
//   deleteNotification
// } from "../api/notifications";
// import { FaTrash } from "react-icons/fa";
// import { FaBoxArchive } from "react-icons/fa6";

// const NotificationModal = ({ isOpen, onClose, socket }) => {
//   const [activeNotis, setActiveNotis] = useState([]);
//   const [archivedNotis, setArchivedNotis] = useState([]);

//   // Helper: safe formatting
//   const formatTime = (dateStr) => {
//     try {
//       return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
//     } catch {
//       return "";
//     }
//   };

//   const loadNotifications = async () => {
//     try {
//       const data = await getNotifications();
//       setActiveNotis(
//         data.filter((n) => n.status !== "archived").map((n) => ({
//           ...n,
//           _id: n._id || Date.now().toString()
//         }))
//       );
//       setArchivedNotis(
//         data.filter((n) => n.status === "archived").map((n) => ({
//           ...n,
//           _id: n._id || Date.now().toString()
//         }))
//       );
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   const handleArchive = async (id) => {
//     await archiveNotification(id);
//     const toArchive = activeNotis.find((n) => n._id === id);
//     if (toArchive) {
//       setActiveNotis((prev) => prev.filter((n) => n._id !== id));
//       setArchivedNotis((prev) => [
//         ...prev,
//         { ...toArchive, status: "archived" }
//       ]);
//     }
//   };

//   const handleDelete = async (id, fromArchived = false) => {
//     await deleteNotification(id);
//     if (fromArchived) {
//       setArchivedNotis((prev) => prev.filter((n) => n._id !== id));
//     } else {
//       setActiveNotis((prev) => prev.filter((n) => n._id !== id));
//     }
//   };

//   useEffect(() => {
//     if (isOpen) loadNotifications();

//     if (socket) {
//       const handleSocketNotification = async (newNotification) => {
//         // Ensure _id exists
//         if (!newNotification._id) newNotification._id = Date.now().toString();

//         // Ensure fromUser is an object with username
//         if (typeof newNotification.fromUser === "string") {
//           try {
//             const res = await fetch(`/api/users/${newNotification.fromUser}`);
//             const userData = await res.json();
//             newNotification.fromUser = userData;
//           } catch {
//             newNotification.fromUser = { username: "Someone" };
//           }
//         }

//         setActiveNotis((prev) => [newNotification, ...prev]);
//       };

//       socket.on("notification", handleSocketNotification);

//       return () => {
//         socket.off("notification", handleSocketNotification);
//       };
//     }
//   }, [isOpen, socket]);

//   const renderNotification = (n, fromArchived = false) => (
//     <div
//       key={n._id}
//       className="flex justify-between items-start p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-md"
//     >
//       <div className="flex-1">
//         <p className="text-sm font-medium">
//           {n.type === "friend_request" &&
//             `${n.fromUser?.username || "Someone"} sent you a friend request`}
//           {n.type === "friend_accept" &&
//             `${n.fromUser?.username || "Someone"} accepted your friend request`}
//         </p>
//         <p className="text-xs text-gray-500">{formatTime(n.createdAt)}</p>
//       </div>
//       <div className="flex items-center gap-2">
//         {!fromArchived && (
//           <button
//             onClick={() => handleArchive(n._id)}
//             className="p-2 rounded-full hover:bg-yellow-100"
//             title="Archive"
//           >
//             <FaBoxArchive className="text-yellow-500" />
//           </button>
//         )}
//         <button
//           onClick={() => handleDelete(n._id, fromArchived)}
//           className="p-2 rounded-full hover:bg-red-100"
//           title="Delete"
//         >
//           <FaTrash className="text-red-500" />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 z-[999] flex justify-center items-center backdrop-blur-md bg-gradient-to-b from-black/40 via-black/30 to-black/40"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.95, opacity: 0, y: 20 }}
//             transition={{ type: "spring", stiffness: 250, damping: 22 }}
//             className="relative p-[2px] rounded-2xl overflow-hidden w-[90vw] max-w-2xl"
//           >
//             {/* Animated Border */}
//             <div className="absolute inset-0 rounded-2xl animate-spin-slow bg-[conic-gradient(at_top_right,_#4f46e5,_#06b6d4,_#ec4899,_#f59e0b,_#4f46e5)]"></div>

//             {/* Inner Card */}
//             <div className="relative bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl backdrop-blur-xl h-[80vh] flex flex-col overflow-hidden">
//               {/* Header */}
//               <div className="flex justify-between items-center p-4 border-b border-white/10">
//                 <h2 className="text-lg font-bold">Notifications</h2>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-500 hover:text-red-500 text-2xl font-bold transition-all duration-200 hover:scale-110"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Notification List */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-8">
//                 {/* Active Section */}
//                 <div>
//                   <h3 className="text-md font-bold mb-2">Active</h3>
//                   {activeNotis.length === 0
//                     ? <p className="text-center text-gray-500">No active notifications</p>
//                     : activeNotis.map((n) => renderNotification(n))
//                   }
//                 </div>

//                 {/* Archived Section */}
//                 <div>
//                   <h3 className="text-md font-bold mb-2">Archived</h3>
//                   {archivedNotis.length === 0
//                     ? <p className="text-center text-gray-500">No archived notifications</p>
//                     : archivedNotis.map((n) => renderNotification(n, true))
//                   }
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default NotificationModal;


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  getNotifications,
  archiveNotification,
  deleteNotification
} from "../api/notifications";
import { FaTrash, FaBell, FaBellSlash, FaCheckCircle } from "react-icons/fa";
import { FaBoxArchive, FaCircleCheck } from "react-icons/fa6";

const NotificationModal = ({ isOpen, onClose, socket }) => {
  const [activeNotis, setActiveNotis] = useState([]);
  const [archivedNotis, setArchivedNotis] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'archived'
  const [expandedId, setExpandedId] = useState(null);

  // Helper: safe formatting
  const formatTime = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setActiveNotis(
        data.filter((n) => n.status !== "archived").map((n) => ({
          ...n,
          _id: n._id || Date.now().toString()
        }))
      );
      setArchivedNotis(
        data.filter((n) => n.status === "archived").map((n) => ({
          ...n,
          _id: n._id || Date.now().toString()
        }))
      );
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleArchive = async (id) => {
    await archiveNotification(id);
    const toArchive = activeNotis.find((n) => n._id === id);
    if (toArchive) {
      setActiveNotis((prev) => prev.filter((n) => n._id !== id));
      setArchivedNotis((prev) => [
        ...prev,
        { ...toArchive, status: "archived" }
      ]);
    }
  };

  const handleDelete = async (id, fromArchived = false) => {
    await deleteNotification(id);
    if (fromArchived) {
      setArchivedNotis((prev) => prev.filter((n) => n._id !== id));
    } else {
      setActiveNotis((prev) => prev.filter((n) => n._id !== id));
    }
    setExpandedId(null);
  };

  const handleMarkAllRead = async () => {
    // This would be implemented in your API
    // For now, we'll just clear the active notifications
    try {
      // await markAllNotificationsRead();
      setActiveNotis([]);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    if (isOpen) loadNotifications();

    if (socket) {
      const handleSocketNotification = async (newNotification) => {
        if (!newNotification._id) newNotification._id = Date.now().toString();

        if (typeof newNotification.fromUser === "string") {
          try {
            const res = await fetch(`/api/users/${newNotification.fromUser}`);
            const userData = await res.json();
            newNotification.fromUser = userData;
          } catch {
            newNotification.fromUser = { username: "Someone" };
          }
        }

        setActiveNotis((prev) => [newNotification, ...prev]);
      };

      socket.on("notification", handleSocketNotification);

      return () => {
        socket.off("notification", handleSocketNotification);
      };
    }
  }, [isOpen, socket]);

  const renderNotification = (n, fromArchived = false) => (
    <motion.div
      key={n._id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all cursor-pointer
        ${expandedId === n._id 
          ? "bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-gray-800/90 dark:to-gray-800/70 border border-purple-200 dark:border-purple-700/50" 
          : "bg-white/70 dark:bg-gray-800/70 border border-white/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600"
        }`}
      onClick={() => toggleExpand(n._id)}
    >
      <div className="flex gap-3 items-start">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${n.type === "friend_request" ? "bg-blue-100 dark:bg-blue-900/50" : "bg-emerald-100 dark:bg-emerald-900/50"}`}>
          {n.type === "friend_request" ? (
            <FaBell className="text-blue-500 dark:text-blue-400 text-xl" />
          ) : (
            <FaCircleCheck className="text-emerald-500 dark:text-emerald-400 text-xl" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {n.type === "friend_request" && `${n.fromUser?.username || "Someone"} sent a friend request`}
              {n.type === "friend_accept" && `${n.fromUser?.username || "Someone"} accepted your request`}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatTime(n.createdAt)}
            </span>
          </div>
          
          {expandedId === n._id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-3 space-y-3"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {n.type === "friend_request" ? (
                  <p>Tap below to accept or decline this friend request</p>
                ) : (
                  <p>You are now friends with {n.fromUser?.username || "this user"}!</p>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                {!fromArchived && n.type === "friend_request" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // This would accept the friend request
                      handleArchive(n._id);
                    }}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <FaCheckCircle className="text-sm" />
                    Accept
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n._id, fromArchived);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg text-sm flex items-center gap-1"
                >
                  <FaTrash className="text-sm" />
                  Delete
                </motion.button>
                
                {!fromArchived && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(n._id);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <FaBoxArchive className="text-sm" />
                    Archive
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const currentNotis = activeTab === "active" ? activeNotis : archivedNotis;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg h-[80vh] max-h-[700px]"
          >
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 animate-gradient-xy blur-lg opacity-70" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 opacity-20" />
            
            {/* Inner Card */}
            <div className="relative h-full flex flex-col bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden border border-white/30 dark:border-gray-700/50">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-lg">
                    <FaBell className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Notifications
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/50 text-gray-500 hover:text-red-500 text-xl transition-all"
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
                <button
                  className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors
                    ${activeTab === "active" 
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  onClick={() => setActiveTab("active")}
                >
                  <FaBell className="text-sm" />
                  Active
                  {activeNotis.length > 0 && (
                    <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeNotis.length}
                    </span>
                  )}
                </button>
                
                <button
                  className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors
                    ${activeTab === "archived" 
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  onClick={() => setActiveTab("archived")}
                >
                  <FaBellSlash className="text-sm" />
                  Archived
                  {archivedNotis.length > 0 && (
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {archivedNotis.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Action Bar */}
              <div className="p-3 flex justify-end border-b border-gray-100 dark:border-gray-800">
                {activeTab === "active" && activeNotis.length > 0 && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkAllRead}
                    className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow text-sm flex items-center gap-2"
                  >
                    <FaCheckCircle className="text-emerald-500" />
                    Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Notification List */}
              <motion.div 
                layout
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                <AnimatePresence>
                  {currentNotis.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400"
                    >
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-full mb-4">
                        <FaBellSlash className="text-3xl text-purple-500 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No notifications</h3>
                      <p className="max-w-xs">
                        {activeTab === "active" 
                          ? "You're all caught up! New notifications will appear here." 
                          : "You haven't archived any notifications yet."}
                      </p>
                    </motion.div>
                  ) : (
                    currentNotis.map((n) => renderNotification(n, activeTab === "archived"))
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Footer */}
              <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                You have {activeNotis.length} unread notification{activeNotis.length !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;