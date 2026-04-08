import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaBriefcase,
  FaComments,
  FaFileAlt,
  FaHome,
  FaStore,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { getProfile } from "../api/profile";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import NotificationToastWrapper from "./Profile/NotificationToastWrapper";
import { useNotificationSocket } from "../hooks/useNotificationSocket";
import { useAuth } from "../context/AuthContext";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const APP_NAVBAR_HEIGHT = 88;

const NAV_ITEMS = [
  { to: "/home", label: "Dashboard", icon: <FaHome /> },
  { to: "/career-os", label: "CareerOS", icon: <FaBriefcase /> },
  { to: "/marketplace", label: "Marketplace", icon: <FaStore /> },
  { to: "/mock-interview", label: "Mock Interview", icon: <FaComments /> },
  { to: "/resume-tools", label: "Resume Tools", icon: <FaFileAlt /> },
  { to: "/portfolio", label: "Portfolio", icon: <FaUserCircle /> },
];

const routeMeta = (pathname) => {
  if (pathname.startsWith("/career-os")) {
    return {
      eyebrow: "Career Workspace",
      title: "CareerOS",
      detail: "Choose direction, generate plans, and manage your path.",
    };
  }

  if (pathname.startsWith("/marketplace")) {
    return {
      eyebrow: "Career Workspace",
      title: "Marketplace",
      detail: "Buy, sell, and explore assets that support your growth.",
    };
  }

  if (pathname.startsWith("/mock-interview")) {
    return {
      eyebrow: "Career Workspace",
      title: "Mock Interview",
      detail: "Practice under pressure and tighten your feedback loop.",
    };
  }

  if (pathname.startsWith("/resume-tools")) {
    return {
      eyebrow: "Career Workspace",
      title: "Resume Tools",
      detail: "Refine the document that earns the first yes.",
    };
  }

  if (pathname.startsWith("/portfolio")) {
    return {
      eyebrow: "Career Workspace",
      title: "Portfolio",
      detail: "Turn work into proof you can point to.",
    };
  }

  return {
    eyebrow: "Career Workspace",
    title: "Dashboard",
    detail: "Signals, priorities, and next actions in one place.",
  };
};

const SidebarNav = ({ notificationsFromDB = [] }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const bellRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    socket,
    notificationsCount,
    latestNotification,
    clearToast,
    resetNotifications,
  } = useNotificationSocket();

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const page = useMemo(() => routeMeta(location.pathname), [location.pathname]);

  const profileImage =
    profile?.profilePicture?.trim() ||
    "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";

  return (
    <>
      <div style={{ height: APP_NAVBAR_HEIGHT }} aria-hidden="true" />

      <header
        className={cn(
          "fixed left-0 top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-[#e7dac8] bg-[#fffaf2]/95 shadow-[0_18px_50px_rgba(76,54,28,0.12)] backdrop-blur-xl"
            : "border-b border-[#eadfce]/70 bg-[#fffaf2]/88 backdrop-blur-lg",
        )}
      >
        <div
          className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
          style={{ height: APP_NAVBAR_HEIGHT }}
        >
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Go to dashboard"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1f2937,#0f172a)] text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
              <FaHome className="text-lg" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e775c]">
                {page.eyebrow}
              </div>
              <div className="truncate text-lg font-semibold text-[#1f160f]">
                ElevateX {page.title}
              </div>
              <div className="truncate text-sm text-[#6c5945]">{page.detail}</div>
            </div>
          </button>

          <nav className="hidden xl:flex items-center rounded-full border border-[#e7dac8] bg-white/80 px-2 py-2 shadow-sm">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/home"}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-[#1f160f] text-white shadow-sm"
                      : "text-[#6c5945] hover:bg-[#f6eee1] hover:text-[#1f160f]",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              ref={bellRef}
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="relative rounded-full border border-[#e7dac8] bg-white/80 p-3 text-[#5f4c39] transition hover:bg-[#f6eee1] hover:text-[#1f160f]"
              aria-label="Notifications"
            >
              <FaBell className="text-base" />
              <AnimatePresence>
                {notificationsCount > 0 ? (
                  <motion.span
                    key={notificationsCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#dc4c3f] px-1 text-[10px] font-semibold text-white"
                  >
                    {notificationsCount > 9 ? "9+" : notificationsCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>

            {profile && user ? (
              <button
                type="button"
                className="hidden items-center gap-3 rounded-full border border-[#e7dac8] bg-white/80 py-1 pl-1 pr-3 transition hover:bg-[#f6eee1] md:flex"
                onClick={() => setIsProfileOpen(true)}
              >
                <img
                  src={profileImage}
                  alt={`${user?.username || "User"} avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#1f160f]">
                    {user?.username || "Profile"}
                  </div>
                  <div className="max-w-[180px] truncate text-xs text-[#7a6550]">
                    {user?.email}
                  </div>
                </div>
              </button>
            ) : null}

            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full bg-[#1f160f] px-4 py-3 text-sm font-semibold text-white lg:inline-flex"
            >
              Logout
            </button>

            <button
              type="button"
              className="rounded-full border border-[#e7dac8] bg-white/80 p-3 text-[#5f4c39] transition hover:bg-[#f6eee1] hover:text-[#1f160f] xl:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#e7dac8] bg-[#fffaf2] xl:hidden"
            >
              <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid gap-2">
                  {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/home"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
                          isActive
                            ? "border-[#1f160f] bg-[#1f160f] text-white"
                            : "border-[#eadfce] bg-white text-[#5f4c39]",
                        )
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span>{icon}</span>
                        {label}
                      </span>
                    </NavLink>
                  ))}

                  <button
                    type="button"
                    onClick={logout}
                    className="mt-2 rounded-2xl bg-[#1f160f] px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

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

      <NotificationToastWrapper
        bellRef={bellRef}
        notifications={notificationsFromDB}
        latestNotification={latestNotification}
        clearToast={clearToast}
      />
    </>
  );
};

export default SidebarNav;
