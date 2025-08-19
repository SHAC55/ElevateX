import {
  getFriendsList,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
  searchUsers
} from "../../api/profile";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUserPlus, 
  FiUserX, 
  FiCheck, 
  FiX, 
  FiSearch, 
  FiArrowLeft,
  FiUsers,
  FiClock,
  FiLink
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

const platformIcons = {
  github: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
  twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  website: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
};

const FriendsTab = ({ type, onClose, onCountsChange, socket }) => {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const { theme } = useTheme();
  const { on, emit } = socket || {};

  const loadData = async () => {
    setLoading(true);
    try {
      if (type === "friends") {
        const list = await getFriendsList();
        setFriends(list);
      } else if (type === "pending") {
        const list = await getPendingFriendRequests();
        setPending(list);
      }
      onCountsChange && onCountsChange();
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  useEffect(() => {
    if (!on) return;

    const handleNewRequest = async (data) => {
      if (type === "pending") await loadData();
      toast.success(`New friend request from ${data.sender.username}`);
      onCountsChange && onCountsChange();
    };

    const handleRequestAccepted = async (data) => {
      if (type === "friends") await loadData();
      if (type === "pending") setPending(prev => prev.filter(req => req._id !== data.requesterId));
      toast.success(`${data.recipient.username} accepted your friend request!`);
      onCountsChange && onCountsChange();
    };

    const handleRequestDeclined = (data) => {
      if (type === "pending") setPending(prev => prev.filter(req => req._id !== data.requesterId));
      onCountsChange && onCountsChange();
    };

    const handleFriendRemoved = (data) => {
      if (type === "friends") setFriends(prev => prev.filter(f => f._id !== data.friendId));
      onCountsChange && onCountsChange();
    };

    on('friend_request_received', handleNewRequest);
    on('friend_request_accepted', handleRequestAccepted);
    on('friend_request_declined', handleRequestDeclined);
    on('friend_removed', handleFriendRemoved);

    return () => {};
  }, [on, type, onCountsChange]);

  useEffect(() => {
    if (type !== "find" || searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        toast.error("Search failed");
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, type]);

  const handleAccept = async (userId) => {
    try {
      await acceptFriendRequest(userId);
      setPending(pending.filter(req => req._id !== userId));
      toast.success("Friend request accepted");
      onCountsChange && onCountsChange();
      emit && emit('friend_request_accepted', { recipientId: userId });
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  const handleDecline = async (userId) => {
    try {
      await declineFriendRequest(userId);
      setPending(pending.filter(req => req._id !== userId));
      toast("Request declined", { icon: "✋" });
      onCountsChange && onCountsChange();
      emit && emit('friend_request_declined', { recipientId: userId });
    } catch (err) {
      toast.error("Failed to decline request");
    }
  };

  const handleUnfriend = async (userId) => {
    const friend = friends.find(f => f._id === userId);
    const tempFriends = friends.filter(f => f._id !== userId);
    setFriends(tempFriends);

    toast(
      (t) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span>Removed {friend.username}</span>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              setFriends(friends);
            }}
            className="text-blue-500 hover:underline font-medium"
          >
            Undo
          </button>
        </motion.div>
      ),
      { duration: 5000 }
    );

    try {
      await removeFriend(userId);
      onCountsChange && onCountsChange();
      emit && emit('friend_removed', { friendId: userId });
    } catch (err) {
      setFriends(friends);
      toast.error("Failed to unfriend");
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      setSentRequests(prev => [...prev, userId]);
      toast.success("Friend request sent");
      emit && emit('friend_request_sent', { recipientId: userId });
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  const openImageModal = (imageUrl, username) => {
    setEnlargedImage({ url: imageUrl, username });
  };

  const closeImageModal = () => {
    setEnlargedImage(null);
  };

  return (
    <>
      <div className="relative">
        {/* Loading Skeleton */}
        {loading && type !== "find" && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-white/30 to-white/50 dark:from-gray-800/30 dark:to-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton circle width={40} height={40} />
                  <Skeleton width={120} height={20} />
                </div>
                <Skeleton width={80} height={32} borderRadius={16} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Friends Tab */}
        {type === "friends" && !loading && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-6 rounded-full" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Friends ({friends.length})
              </h3>
            </div>
            
            {friends.length > 0 ? (
              <motion.ul className="space-y-3">
                <AnimatePresence>
                  {friends.map((f) => (
                    <motion.li
                      key={f._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 rounded-xl backdrop-blur-sm ${
                        theme === "dark" 
                          ? "bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/60 hover:to-gray-800/40" 
                          : "bg-gradient-to-br from-white/60 to-white/40 hover:from-white/80 hover:to-white/60"
                      } border border-white/20 dark:border-gray-700/30 shadow-sm transition-all`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 relative">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative cursor-pointer"
                            onClick={() => openImageModal(f.profilePicture || "/default-profile.png", f.username)}
                          >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/30 to-purple-400/30 blur-sm" />
                            <img
                              src={f.profilePicture || "/default-profile.png"}
                              className="w-12 h-12 rounded-full border-2 border-white/30 dark:border-gray-800/50 object-cover relative z-10"
                              alt={`${f.username}'s profile`}
                            />
                          </motion.div>
                          <div className="absolute -bottom-1 -right-1 bg-green-400 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 z-20"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{f.username}</h4>
                              {f.mutualFriends > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {f.mutualFriends} mutual friends
                                </p>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUnfriend(f._id)}
                              className="p-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-500 dark:text-red-400 rounded-lg transition-all"
                            >
                              <FiUserX size={18} />
                            </motion.button>
                          </div>

                          {f.links && f.links.length > 0 && (
                            <div className="mt-3 flex gap-3">
                              {f.links.map((link, idx) => {
                                const iconSrc = platformIcons[link.platform.toLowerCase()] || platformIcons.website;
                                return (
                                  <motion.a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className={`w-8 h-8 flex items-center justify-center rounded-xl backdrop-blur-sm ${
                                      theme === "dark" 
                                        ? "bg-gray-700/50 hover:bg-gray-700/80" 
                                        : "bg-gray-200/60 hover:bg-gray-200"
                                    } border border-white/30 dark:border-gray-700/50 shadow-sm`}
                                    title={link.platform}
                                  >
                                    <img
                                      src={iconSrc}
                                      alt={link.platform}
                                      className={`w-5 h-5 object-contain ${
                                        theme === "dark" ? "brightness-90" : ""
                                      }`}
                                    />
                                  </motion.a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/50 dark:from-gray-800/30 dark:to-gray-800/50 border border-white/20 dark:border-gray-700/30 shadow-sm"
              >
                <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-10"
                  />
                  <FiUserPlus className="text-5xl text-gray-400 relative z-10" />
                </div>
                <h4 className="text-lg font-medium mb-2">No friends yet</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Connect with others to see them here
                </p>
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onClose("find")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Find Friends
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Pending Requests Tab */}
        {type === "pending" && !loading && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-2 h-6 rounded-full" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Pending Requests ({pending.length})
              </h3>
            </div>
            
            {pending.length > 0 ? (
              <motion.ul className="space-y-3">
                {pending.map((p) => (
                  <motion.li
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl backdrop-blur-sm ${
                      theme === "dark" 
                        ? "bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/60 hover:to-gray-800/40" 
                        : "bg-gradient-to-br from-white/60 to-white/40 hover:from-white/80 hover:to-white/60"
                    } border border-white/20 dark:border-gray-700/30 shadow-sm transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative cursor-pointer"
                          onClick={() => openImageModal(p.profilePicture || "/default-profile.png", p.username)}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 to-orange-400/30 blur-sm" />
                          <img
                            src={p.profilePicture || "/default-profile.png"}
                            className="w-12 h-12 rounded-full border-2 border-white/30 dark:border-gray-800/50 object-cover relative z-10"
                            alt={`${p.username}'s profile`}
                          />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-lg">{p.username}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Sent {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAccept(p._id)}
                          className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                          <FiCheck size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecline(p._id)}
                          className="p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                          <FiX size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/50 dark:from-gray-800/30 dark:to-gray-800/50 border border-white/20 dark:border-gray-700/30 shadow-sm"
              >
                <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-10"
                  />
                  <FiClock className="text-5xl text-gray-400 relative z-10" />
                </div>
                <h4 className="text-lg font-medium mb-2">No pending requests</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  When someone sends you a request, it will appear here
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Find Friends Tab */}
        {type === "find" && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 w-2 h-6 rounded-full" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Find Friends
              </h3>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, or platform..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  theme === "dark" 
                    ? "bg-gray-800/40 border-gray-700/30 text-white" 
                    : "bg-white/60 border-gray-200 text-gray-800"
                } border`}
              />
            </div>

            {searchResults.length > 0 ? (
              <motion.ul className="space-y-3">
                {searchResults.map((u) => (
                  <motion.li
                    key={u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl backdrop-blur-sm ${
                      theme === "dark" 
                        ? "bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/60 hover:to-gray-800/40" 
                        : "bg-gradient-to-br from-white/60 to-white/40 hover:from-white/80 hover:to-white/60"
                    } border border-white/20 dark:border-gray-700/30 shadow-sm transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative cursor-pointer"
                          onClick={() => openImageModal(u.profilePicture || "/default-profile.png", u.username)}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400/30 to-teal-400/30 blur-sm" />
                          <img
                            src={u.profilePicture || "/default-profile.png"}
                            className="w-12 h-12 rounded-full border-2 border-white/30 dark:border-gray-800/50 object-cover relative z-10"
                            alt={`${u.username}'s profile`}
                          />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-lg">{u.username}</h4>
                          {u.mutualFriends > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {u.mutualFriends} mutual friends
                            </p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={sentRequests.includes(u._id)}
                        onClick={() => handleSendRequest(u._id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
                          sentRequests.includes(u._id)
                            ? "bg-gradient-to-r from-gray-300/80 to-gray-400/80 dark:from-gray-600/80 dark:to-gray-700/80 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                        }`}
                      >
                        {sentRequests.includes(u._id) ? "Request Sent" : "Add Friend"}
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : searchQuery ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/50 dark:from-gray-800/30 dark:to-gray-800/50 border border-white/20 dark:border-gray-700/30 shadow-sm"
              >
                <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 opacity-10"
                  />
                  <FiSearch className="text-5xl text-gray-400 relative z-10" />
                </div>
                <h4 className="text-lg font-medium mb-2">No users found</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  No results for "{searchQuery}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/50 dark:from-gray-800/30 dark:to-gray-800/50 border border-white/20 dark:border-gray-700/30 shadow-sm"
              >
                <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-teal-500 opacity-10"
                  />
                  <FiUserPlus className="text-5xl text-gray-400 relative z-10" />
                </div>
                <h4 className="text-lg font-medium mb-2">Find your friends</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Search by name, username, or platform
                </p>
                <div className="flex justify-center gap-3">
                  {Object.entries(platformIcons).slice(0, 5).map(([platform, icon]) => (
                    <motion.div
                      key={platform}
                      whileHover={{ y: -5, scale: 1.1 }}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-sm ${
                        theme === "dark" 
                          ? "bg-gray-700/50 hover:bg-gray-700/80" 
                          : "bg-gray-200/60 hover:bg-gray-200"
                      } border border-white/30 dark:border-gray-700/50 shadow-sm`}
                    >
                      <img
                        src={icon}
                        alt={platform}
                        className={`w-6 h-6 object-contain ${
                          theme === "dark" ? "brightness-90" : ""
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Premium Image Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeImageModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/30 backdrop-blur-sm"
              >
                <FiX size={24} />
              </motion.button>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Glowing border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 animate-gradient-xy blur-md opacity-80" />
                
                <div className="relative bg-gradient-to-br from-gray-900 to-black p-1">
                  <img
                    src={enlargedImage.url}
                    alt={`${enlargedImage.username}'s profile`}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="font-medium text-white text-center text-lg">
                    {enlargedImage.username}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FriendsTab;