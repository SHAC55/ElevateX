import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa";
import Profile from "../Components/Profile/Index";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profile";
import { Loader2 } from "lucide-react";

/* ------------------------------- Spinner UI ------------------------------- */
function Spinner({ label = "Loading your profile...", className = "h-10 w-10 text-blue-500" }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`${className} animate-spin`} aria-hidden="true" />
      {label ? (
        <motion.p
          initial={{ y: 6, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-gray-600 dark:text-gray-300"
        >
          {label}
        </motion.p>
      ) : null}
    </div>
  );
}

const ProfileModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      loadProfile();
      return () => {
        document.body.style.overflow = "unset";
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProfile("me");
      setProfile(res);
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfile();
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Loading state
  if (loading && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex flex-col items-center justify-center">
              <Spinner />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Error state
  if (error && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-yellow-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Failed to Load Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex justify-center items-center"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(12px)",
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Animated overlay gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/20"
          />

          {/* Main modal container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 },
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 20,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
            }}
            className="relative w-[95vw] max-w-4xl h-[85vh] rounded-2xl overflow-hidden"
          >
            {/* Animated border gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
              className="absolute inset-0 rounded-2xl overflow-hidden p-[2px]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 animate-gradient-xy" />
            </motion.div>

            {/* Modal content */}
            <div className="relative h-full w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 dark:border-gray-800/50 flex flex-col">
              {/* Premium header with actions */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-md border-b border-white/20 dark:border-gray-800/50">
                <motion.button
                  onClick={handleRefresh}
                  whileHover={{ scale: 1.05, rotate: 30 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="Refresh profile"
                  disabled={isRefreshing}
                >
                  <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                </motion.button>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setShowLogoutConfirm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 flex items-center space-x-1 text-sm rounded-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>

                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Close modal"
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                  className="p-6 sm:p-8"
                >
                  {profile ? (
                    <Profile profile={profile} reloadProfile={handleRefresh} isRefreshing={isRefreshing} />
                  ) : (
                    <div className="py-16">
                      <Spinner />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Logout Confirmation Modal */}
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={cancelLogout} />
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 max-w-md w-full mx-4 shadow-2xl z-10"
                >
                  <h3 className="text-xl font-bold text-center mb-4 text-white">Confirm Logout</h3>
                  <p className="text-gray-300 text-center mb-8">Are you sure you want to log out?</p>
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelLogout}
                      className="px-5 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmLogout}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                    >
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
