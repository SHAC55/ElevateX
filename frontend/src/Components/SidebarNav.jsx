// src/components/TopNavbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaStore,
  FaComments,
  FaFileAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";
import { getProfile } from "../api/profile";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import NotificationToastWrapper from "./Profile/NotificationToastWrapper";
import { useNotificationSocket } from "../hooks/useNotificationSocket";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const TopNavbar = ({ notificationsFromDB = [] }) => {
  // ✅ fixed useAuth usage
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const {
    socket,
    notificationsCount,
    latestNotification,
    clearToast,
    resetNotifications,
  } = useNotificationSocket();

  const bellRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile("me");
        setProfile(res);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    loadProfile();

    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const profileImage =
    profile?.profilePicture?.trim() ||
    "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";

  const navItems = [
    { to: "/home", label: "Dashboard", icon: <FaHome /> },
    { to: "/career-os", label: "CareerOS", icon: <FaBriefcase /> },
    { to: "/marketplace", label: "Marketplace", icon: <FaStore /> },
    { to: "/mock-interview", label: "Mock Interview", icon: <FaComments /> },
    { to: "/industry-insights", label: "Insights", icon: <FaComments /> },
    { to: "/resume-tools", label: "Resume Tools", icon: <FaFileAlt /> },
    {
      label: "Profile",
      icon: <FaUserCircle />,
      onClick: () => setIsProfileOpen(true),
    },
  ];

  return (
    <>
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="ml-4 mr-4 mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-black">ElevateX</h1>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6">
            {navItems.map(({ to, label, onClick }) =>
              to ? (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-black"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ) : (
                <button
                  key={label}
                  onClick={onClick}
                  className="text-sm font-medium text-gray-500 hover:text-black"
                >
                  {label}
                </button>
              )
            )}
          </nav>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              ref={bellRef}
              onClick={() => setIsNotificationOpen(true)}
              className="relative text-gray-600 hover:text-black transition"
              aria-label="Notifications"
            >
              <FaBell className="w-6 h-6" />

              {/* Bouncing notification count */}
              <AnimatePresence>
                {notificationsCount > 0 && (
                  <motion.span
                    key={notificationsCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.3 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                  >
                    {notificationsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {profile && user && (
              <div
                className="flex items-center gap-4 border p-1 rounded-md cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <img
                  src={profileImage}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-right">
                  <h3 className="text-sm font-semibold truncate max-w-[140px]">
                    {user?.username}
                  </h3>
                  <p className="text-xs text-gray-400 truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* 🚀 Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-black"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden bg-white shadow-md px-4 py-2">
            <nav className="flex flex-col gap-4">
              {navItems.map(({ to, label, onClick }) =>
                to ? (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm ${
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-600 hover:text-black"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ) : (
                  <button
                    key={label}
                    onClick={() => {
                      setIsOpen(false);
                      onClick();
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                  >
                    {label}
                  </button>
                )
              )}

              {/* 🚀 Logout Button (Mobile) */}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile || user}
        reloadProfile={async () => {
          try {
            const res = await getProfile("me");
            setProfile(res);
          } catch {}
        }}
        onLogout={null}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => {
          setIsNotificationOpen(false);
          resetNotifications();
        }}
        socket={socket}
      />

      {/* Toast Wrapper */}
      <NotificationToastWrapper
        bellRef={bellRef}
        notifications={notificationsFromDB} // Initial notifications from DB
        latestNotification={latestNotification}
        clearToast={clearToast}
      />
    </>
  );
};

export default TopNavbar;
