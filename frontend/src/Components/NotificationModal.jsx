import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  Bell,
  BellOff,
  CheckCheck,
  Compass,
  Loader2,
  Trash2,
  UserPlus,
  UserRoundCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  archiveNotification,
  deleteNotification,
  getNotifications,
  markAsRead,
  markManyAsRead,
} from "../api/notifications";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
} from "../api/profile";

const shellTransition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

const formatTime = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
};

const statusTone = (status) => {
  if (status === "unread") return "bg-[#fff1dc] text-[#9a5313]";
  if (status === "archived") return "bg-slate-100 text-slate-600";
  return "bg-[#eef5ff] text-[#1e5a83]";
};

const NotificationModal = ({ isOpen, onClose, socket }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [expandedId, setExpandedId] = useState("");

  const pendingRequestMap = useMemo(
    () => new Map(pendingRequests.map((request) => [String(request.requesterId), request])),
    [pendingRequests],
  );

  const activeNotis = useMemo(
    () => notifications.filter((item) => item.status !== "archived"),
    [notifications],
  );
  const archivedNotis = useMemo(
    () => notifications.filter((item) => item.status === "archived"),
    [notifications],
  );
  const currentNotis = activeTab === "active" ? activeNotis : archivedNotis;
  const unreadIds = useMemo(
    () => activeNotis.filter((item) => item.status === "unread").map((item) => item._id),
    [activeNotis],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [notificationData, pendingData] = await Promise.all([
        getNotifications(),
        getPendingFriendRequests().catch(() => []),
      ]);
      setNotifications(notificationData);
      setPendingRequests(pendingData);
    } catch (err) {
      console.error("Failed to load notifications", err);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    loadData();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleSocketNotification = (notification) => {
      setNotifications((prev) => {
        const id = notification._id || notification.id;
        if (!id) return prev;
        if (prev.some((item) => String(item._id) === String(id))) return prev;
        return [
          {
            ...notification,
            _id: id,
            status: notification.status || "unread",
          },
          ...prev,
        ];
      });
    };

    socket.on("notification", handleSocketNotification);
    return () => socket.off("notification", handleSocketNotification);
  }, [socket]);

  const getCopy = (notification) => {
    if (notification.type === "friend_request") {
      return {
        eyebrow: "Connection",
        title: `${notification.fromUser?.username || "Someone"} sent a friend request`,
        body: "Respond here or archive it for later.",
      };
    }

    if (notification.type === "friend_accept") {
      return {
        eyebrow: "Connection",
        title: `${notification.fromUser?.username || "Someone"} accepted your request`,
        body: "You are connected now. Open profile and keep the relationship warm.",
      };
    }

    return {
      eyebrow: "Learning",
      title: notification.data?.title || "Learning nudge",
      body: notification.data?.message || "A new learning prompt is ready.",
    };
  };

  const markLocalRead = (ids = []) => {
    const idSet = new Set(ids.map(String));
    setNotifications((prev) =>
      prev.map((item) =>
        idSet.has(String(item._id)) && item.status !== "archived"
          ? { ...item, status: "read" }
          : item,
      ),
    );
  };

  const handleModalClose = async () => {
    if (unreadIds.length) {
      try {
        await markManyAsRead(unreadIds);
        markLocalRead(unreadIds);
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }

    setExpandedId("");
    onClose();
  };

  const handleMarkAllRead = async () => {
    if (!unreadIds.length) return;
    try {
      await markManyAsRead(unreadIds);
      markLocalRead(unreadIds);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Could not mark all as read");
    }
  };

  const handleArchive = async (id) => {
    try {
      setBusyId(id);
      await archiveNotification(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: "archived" } : item)),
      );
      setExpandedId("");
    } catch (err) {
      console.error("Failed to archive notification", err);
      toast.error("Could not archive notification");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      setExpandedId("");
    } catch (err) {
      console.error("Failed to delete notification", err);
      toast.error("Could not delete notification");
    } finally {
      setBusyId("");
    }
  };

  const handleOpenLearningLink = async (notification) => {
    try {
      if (notification.status === "unread") {
        await markAsRead(notification._id);
        markLocalRead([notification._id]);
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }

    if (notification.data?.link) {
      handleModalClose();
      navigate(notification.data.link);
    }
  };

  const handleAcceptRequest = async (notification) => {
    const requesterId = String(notification.data?.requesterId || notification.fromUser?._id || "");
    const request = pendingRequestMap.get(requesterId);

    if (!request?._id) {
      toast.error("Friend request is no longer available");
      return;
    }

    try {
      setBusyId(notification._id);
      await acceptFriendRequest(request._id);
      setPendingRequests((prev) => prev.filter((item) => item._id !== request._id));
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, status: "archived" } : item,
        ),
      );
      setExpandedId("");
      toast.success("Friend request accepted");
    } catch (err) {
      console.error("Failed to accept friend request", err);
      toast.error("Could not accept friend request");
    } finally {
      setBusyId("");
    }
  };

  const handleDeclineRequest = async (notification) => {
    const requesterId = String(notification.data?.requesterId || notification.fromUser?._id || "");
    const request = pendingRequestMap.get(requesterId);

    if (!request?._id) {
      toast.error("Friend request is no longer available");
      return;
    }

    try {
      setBusyId(notification._id);
      await declineFriendRequest(request._id);
      setPendingRequests((prev) => prev.filter((item) => item._id !== request._id));
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, status: "archived" } : item,
        ),
      );
      setExpandedId("");
      toast.success("Friend request declined");
    } catch (err) {
      console.error("Failed to decline friend request", err);
      toast.error("Could not decline friend request");
    } finally {
      setBusyId("");
    }
  };

  const renderNotification = (notification, archived = false) => {
    const copy = getCopy(notification);
    const isExpanded = expandedId === notification._id;
    const requesterId = String(notification.data?.requesterId || notification.fromUser?._id || "");
    const pendingRequest = requesterId ? pendingRequestMap.get(requesterId) : null;

    return (
      <motion.div
        key={notification._id}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`rounded-[24px] border p-4 transition ${
          isExpanded
            ? "border-[#d7c2a4] bg-[#fffaf4] shadow-[0_18px_40px_rgba(89,60,27,0.08)]"
            : "border-[#eadfce] bg-white/90"
        }`}
      >
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#1f160f] text-white">
            {notification.type === "friend_request" ? (
              <UserPlus size={18} />
            ) : notification.type === "friend_accept" ? (
              <UserRoundCheck size={18} />
            ) : (
              <Compass size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? "" : notification._id)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e775c]">
                  {copy.eyebrow}
                </div>
                <div className="mt-1 text-base font-semibold text-[#1f160f]">{copy.title}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone(notification.status)}`}>
                    {archived ? "Archived" : notification.status === "unread" ? "Unread" : "Read"}
                  </span>
                  <span className="text-xs text-[#8e775c]">{formatTime(notification.createdAt)}</span>
                </div>
              </button>

              {!archived ? (
                <button
                  type="button"
                  onClick={() => handleArchive(notification._id)}
                  disabled={busyId === notification._id}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#eadfce] bg-white text-[#6b5844] transition hover:bg-[#f6eee1] disabled:opacity-60"
                  aria-label="Archive notification"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>

            <AnimatePresence>
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-sm leading-7 text-[#6b5844]">{copy.body}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!archived && notification.type === "friend_request" && pendingRequest ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(notification)}
                          disabled={busyId === notification._id}
                          className="rounded-full bg-[#1f160f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(notification)}
                          disabled={busyId === notification._id}
                          className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#5f4c39] disabled:opacity-60"
                        >
                          Decline
                        </button>
                      </>
                    ) : null}

                    {!archived && notification.type === "learning_nudge" && notification.data?.link ? (
                      <button
                        type="button"
                        onClick={() => handleOpenLearningLink(notification)}
                        disabled={busyId === notification._id}
                        className="rounded-full bg-[#1f160f] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open
                      </button>
                    ) : null}

                    {!archived ? (
                      <button
                        type="button"
                        onClick={() => handleArchive(notification._id)}
                        disabled={busyId === notification._id}
                        className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#5f4c39]"
                      >
                        <Archive size={14} />
                        Archive
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDelete(notification._id)}
                      disabled={busyId === notification._id}
                      className="inline-flex items-center gap-2 rounded-full border border-[#f2cbc7] bg-[#fff2f1] px-4 py-2 text-sm font-semibold text-[#b33f35]"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_22%),rgba(15,23,42,0.58)] backdrop-blur-md"
            onClick={handleModalClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: shellTransition }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            className="relative flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[34px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_40px_120px_rgba(15,23,42,0.32)]"
          >
            <div className="border-b border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,247,238,0.92))] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1f160f] text-white">
                    <Bell size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e775c]">
                      Inbox
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-[#1f160f]">Notifications</h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#eadfce] bg-white text-[#5f4c39] transition hover:bg-[#f6eee1]"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="border-b border-[#eadfce] bg-white/80 px-5 py-4 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-[#eadfce] bg-[#fff8ef] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Active</div>
                  <div className="mt-2 text-2xl font-semibold text-[#1f160f]">{activeNotis.length}</div>
                </div>
                <div className="rounded-[20px] border border-[#eadfce] bg-[#fff8ef] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Unread</div>
                  <div className="mt-2 text-2xl font-semibold text-[#1f160f]">{unreadIds.length}</div>
                </div>
                <div className="rounded-[20px] border border-[#eadfce] bg-[#fff8ef] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Archived</div>
                  <div className="mt-2 text-2xl font-semibold text-[#1f160f]">{archivedNotis.length}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-[#eadfce] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "active" ? "bg-[#1f160f] text-white" : "text-[#6b5844]"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("archived")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "archived" ? "bg-[#1f160f] text-white" : "text-[#6b5844]"
                    }`}
                  >
                    Archived
                  </button>
                </div>

                {activeTab === "active" && unreadIds.length ? (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#5f4c39]"
                  >
                    <CheckCheck size={16} />
                    Mark all read
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fffaf4_0%,#f8eee0_100%)] px-5 py-4 sm:px-6">
              {loading ? (
                <div className="grid h-full place-items-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#c56c19]" />
                    <div className="mt-4 text-sm text-[#6b5844]">Loading notifications...</div>
                  </div>
                </div>
              ) : currentNotis.length ? (
                <div className="space-y-3">
                  <AnimatePresence>{currentNotis.map((item) => renderNotification(item, activeTab === "archived"))}</AnimatePresence>
                </div>
              ) : (
                <div className="grid h-full place-items-center py-12">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1dc] text-[#9a5313]">
                      {activeTab === "active" ? <BellOff size={24} /> : <Archive size={24} />}
                    </div>
                    <div className="mt-4 text-xl font-semibold text-[#1f160f]">
                      {activeTab === "active" ? "You are all caught up" : "No archived notifications"}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                      {activeTab === "active"
                        ? "New activity, learning nudges, and connection updates will appear here."
                        : "Archived items will appear here when you clear them from the active list."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default NotificationModal;
