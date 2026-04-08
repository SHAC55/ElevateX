import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBook,
  FaChartLine,
  FaChevronRight,
  FaCompass,
  FaGraduationCap,
  FaHome,
  FaProjectDiagram,
  FaRegClock,
  FaTimes,
  FaUsers,
  FaBars,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { getProfile } from "../../api/profile";
import ProfileModal from "../ProfileModal";
import NotificationModal from "../NotificationModal";
import NotificationToastWrapper from "../Profile/NotificationToastWrapper";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const HEADER_HEIGHT = 88;

const NAV_ITEMS = [
  { to: "/career/plan/today", label: "Today", icon: <FaRegClock /> },
  { to: "/career/plan", label: "Plan", icon: <FaCompass /> },
  { to: "/career/plan/skills", label: "Skills", icon: <FaGraduationCap /> },
  { to: "/career/plan/projects", label: "Projects", icon: <FaProjectDiagram /> },
  { to: "/career/plan/resources", label: "Resources", icon: <FaBook /> },
  { to: "/career/plan/progress", label: "Progress", icon: <FaChartLine /> },
  { to: "/career/plan/communities", label: "Community", icon: <FaUsers /> },
  { to: "/home", label: "Dashboard", icon: <FaHome /> },
];

const routeMeta = (pathname) => {
  if (pathname.startsWith("/career/plan/today")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Today",
      detail: "Your daily learning, review, build, and interview loop.",
    };
  }

  if (pathname.startsWith("/career/plan/skills")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Skills",
      detail: "Pick what to study next and move immediately.",
    };
  }

  if (pathname.startsWith("/career/plan/projects")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Projects",
      detail: "Turn progress into visible proof.",
    };
  }

  if (pathname.startsWith("/career/plan/resources")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Resources",
      detail: "Use curated material instead of searching from scratch.",
    };
  }

  if (pathname.startsWith("/career/plan/progress")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Progress",
      detail: "Track compounding effort and weak spots.",
    };
  }

  if (pathname.startsWith("/career/plan/communities")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Community",
      detail: "Find peers, feedback, and accountability.",
    };
  }

  if (pathname.startsWith("/career/plan/outlook")) {
    return {
      eyebrow: "Learning Workspace",
      title: "Outlook",
      detail: "See where the path is heading.",
    };
  }

  return {
    eyebrow: "Learning Workspace",
    title: "Plan",
    detail: "Your path, priorities, and next moves in one place.",
  };
};

const LearningNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const bellRef = useRef(null);

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
      } catch (error) {
        console.error("Failed to load profile", error);
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

  const profileImage = useMemo(
    () =>
      profile?.profilePicture?.trim() ||
      "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    [profile],
  );

  return (
    <>
      <div style={{ height: HEADER_HEIGHT }} aria-hidden="true" />

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
          style={{ height: HEADER_HEIGHT }}
        >
          <button
            type="button"
            onClick={() => navigate("/career/plan")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Go to learning plan"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1f2937,#0f172a)] text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
              <FaGraduationCap className="text-lg" />
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
                end={to === "/career/plan"}
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
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#1f160f]">{user?.username || "Profile"}</div>
                  <div className="text-xs text-[#7a6550]">Account</div>
                </div>
              </button>
            ) : null}

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
                      end={to === "/career/plan"}
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
                      <FaChevronRight className="text-xs" />
                    </NavLink>
                  ))}
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
        notifications={[]}
        latestNotification={latestNotification}
        clearToast={clearToast}
      />
    </>
  );
};

export default LearningNavbar;
