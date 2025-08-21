import React, { useEffect, useMemo, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaLightbulb,
  FaMap,
  FaTasks,
  FaBook,
  FaUsers,
  FaChartLine,
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile } from "../../api/profile";
import ProfileModal from "../ProfileModal";
import NotificationModal from "../NotificationModal";
import NotificationToastWrapper from "../Profile/NotificationToastWrapper";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

// Simple classNames utility
const cn = (...classes) => classes.filter(Boolean).join(" ");

const HEADER_HEIGHT = 72; // Slightly increased for premium look

const LearningNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    socket,
    notificationsCount,
    latestNotification,
    clearToast,
    resetNotifications,
  } = useNotificationSocket();

  const bellRef = useRef(null);

  const toggleMenu = () => setIsOpen(v => !v);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getProfile("me");
        if (alive) setProfile(res);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();

    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    return () => {
      alive = false;
    };
  }, []);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const profileImage = useMemo(
    () =>
      profile?.profilePicture?.trim() ||
      "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    [profile]
  );

  const navItems = useMemo(
    () => [
      { to: "/career/plan/skills", label: "Skills", icon: <FaLightbulb /> },
      { to: "/career/plan/roadmap", label: "Roadmap", icon: <FaMap /> },
      { to: "/career/plan/projects", label: "Projects", icon: <FaTasks /> },
      { to: "/career/plan/resources", label: "Resources", icon: <FaBook /> },
      { to: "/career/plan/communities", label: "Communities", icon: <FaUsers /> },
      { to: "/career/plan/outlook", label: "Outlook", icon: <FaChartLine /> },
      { to: "/home", label: "Home", icon: <FaHome /> },
    ],
    []
  );

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Spacer so content isn't hidden under fixed header */}
      <div style={{ height: HEADER_HEIGHT }} aria-hidden="true" />

      <header
        className={cn(
          "w-full fixed top-0 left-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50" 
            : "bg-white/80 backdrop-blur-md border-b border-gray-200/30"
        )}
        role="banner"
      >
        <div
          className=" mx-auto px-4 h-full flex items-center justify-between"
          style={{ height: HEADER_HEIGHT }}
        >
          {/* Brand - Left */}
          <button
            className="flex items-center text-xl font-bold tracking-tight transition hover:opacity-90 group"
            onClick={() => navigate("/career/plan")}
            aria-label="Go to ElevateX Learning home"
          >
            <div className="relative p-1.5 mr-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
              <FaGraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              ElevateX <span className="text-indigo-600">Learning</span>
            </span>
          </button>

          {/* Desktop Nav - Center */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2" aria-label="Primary">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg mx-1",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    isActive
                      ? "text-indigo-700 bg-indigo-50/80"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              ref={bellRef}
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2.5 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Notifications"
              aria-haspopup="dialog"
              aria-expanded={isNotificationOpen ? "true" : "false"}
            >
              <FaBell className="w-5 h-5" />
              <AnimatePresence>
                {notificationsCount > 0 && (
                  <motion.span
                    key={notificationsCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
                    aria-label={`${notificationsCount} unread notifications`}
                  >
                    {notificationsCount > 9 ? '9+' : notificationsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {profile && user && (
              <button
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsProfileOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isProfileOpen ? "true" : "false"}
              >
                <div className="relative">
                  <img
                    src={profileImage}
                    alt={`${user?.username || "User"} avatar`}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen ? "true" : "false"}
              aria-controls="mobile-nav"
            >
              {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-xl"
            >
              <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
                {navItems.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 text-sm px-4 py-3 rounded-xl transition-all duration-300",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100/50"
                      )
                    }
                  >
                    <span className="text-indigo-600">{icon}</span>
                    {label}
                  </NavLink>
                ))}
                
                {/* Mobile notification and profile */}
                <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center justify-between px-4">
                  <button
                    onClick={() => setIsNotificationOpen(true)}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-3 py-2 hover:bg-gray-100/50"
                  >
                    <div className="relative">
                      <FaBell className="w-5 h-5" />
                      {notificationsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rose-500 text-white text-[10px] px-1">
                          {notificationsCount > 9 ? '9+' : notificationsCount}
                        </span>
                      )}
                    </div>
                    Notifications
                  </button>

                  {profile && user && (
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-3 py-2 hover:bg-gray-100/50"
                    >
                      <img
                        src={profileImage}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover border border-gray-300"
                      />
                      <span className="font-medium">{user?.username}</span>
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
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
        notifications={[]}
        latestNotification={latestNotification}
        clearToast={clearToast}
      />
    </>
  );
};

export default LearningNavbar;