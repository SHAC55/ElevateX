import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogOut, RefreshCcw, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profile";
import Profile from "./Profile/Index";

const shellTransition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

const ProfileModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProfile = async ({ refresh = false } = {}) => {
    try {
      setError("");
      if (!refresh) setLoading(true);
      if (refresh) setIsRefreshing(true);
      const response = await getProfile("me");
      setProfile(response);
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Could not load your profile right now.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = "hidden";
    loadProfile();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showLogoutConfirm) {
          setShowLogoutConfirm(false);
          return;
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, showLogoutConfirm]);

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
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.2),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_20%),rgba(15,23,42,0.58)] backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: shellTransition }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_40px_120px_rgba(15,23,42,0.32)]"
          >
            <div className="border-b border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,247,238,0.92))] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e775c]">
                    Profile
                  </div>
                  <h2 className="mt-1 text-2xl font-semibold text-[#1f160f]">
                    Account and connections
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadProfile({ refresh: true })}
                    disabled={loading || isRefreshing}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#5f4c39] transition hover:bg-[#f6eee1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#f2cbc7] bg-[#fff2f1] px-4 py-2 text-sm font-semibold text-[#b33f35] transition hover:bg-[#ffe5e2]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#eadfce] bg-white text-[#5f4c39] transition hover:bg-[#f6eee1]"
                    aria-label="Close profile modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fffaf4_0%,#f8eee0_100%)]">
              {loading ? (
                <div className="grid h-full place-items-center p-8">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#c56c19]" />
                    <div className="mt-4 text-sm text-[#6b5844]">Loading your profile...</div>
                  </div>
                </div>
              ) : error ? (
                <div className="grid h-full place-items-center p-8">
                  <div className="max-w-md rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
                    <div className="text-xl font-semibold text-[#1f160f]">Profile unavailable</div>
                    <p className="mt-3 text-sm leading-7 text-[#6b5844]">{error}</p>
                    <button
                      type="button"
                      onClick={() => loadProfile()}
                      className="mt-6 rounded-full bg-[#1f160f] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <Profile
                    initialProfile={profile}
                    reloadProfile={() => loadProfile({ refresh: true })}
                    isRefreshing={isRefreshing}
                  />
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showLogoutConfirm ? (
              <motion.div
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                  onClick={() => setShowLogoutConfirm(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: shellTransition }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  className="relative w-full max-w-md rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e775c]">
                    Confirm action
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-[#1f160f]">Log out of ElevateX?</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                    You will be signed out on this device and returned to the login flow.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 rounded-full border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#5f4c39]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex-1 rounded-full bg-[#b33f35] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ProfileModal;
