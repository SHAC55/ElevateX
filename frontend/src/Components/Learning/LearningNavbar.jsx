

// // src/components/Learning/LearningNavbar.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaLightbulb,
//   FaMap,
//   FaTasks,
//   FaBook,
//   FaUsers,
//   FaChartLine,
//   FaBars,
//   FaTimes,
//   FaBell,
//   FaUserCircle,
// } from "react-icons/fa";
// import { getProfile } from "../../api/profile";
// import ProfileModal from "../ProfileModal";
// import NotificationModal from "../NotificationModal";
// import NotificationToastWrapper from "../Profile/NotificationToastWrapper";
// import { useNotificationSocket } from "../../hooks/useNotificationSocket";
// import { motion, AnimatePresence } from "framer-motion";

// const LearningNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const navigate = useNavigate();

//   const {
//     socket,
//     notificationsCount,
//     latestNotification,
//     clearToast,
//     resetNotifications,
//   } = useNotificationSocket();

//   const bellRef = useRef(null);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const res = await getProfile("me");
//         setProfile(res);
//       } catch (err) {
//         console.error("Failed to load profile", err);
//       }
//     };
//     loadProfile();

//     const userData = localStorage.getItem("user");
//     if (userData) setUser(JSON.parse(userData));
//   }, []);

//   const profileImage =
//     profile?.profilePicture?.trim() || "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";

//   const navItems = [
//     { to: "/career/plan/skills", label: "Skills", icon: <FaLightbulb /> },
//     { to: "/career/plan/roadmap", label: "Roadmap", icon: <FaMap /> },
//     { to: "/career/plan/projects", label: "Projects", icon: <FaTasks /> },
//     { to: "/career/plan/resources", label: "Resources", icon: <FaBook /> },
//     { to: "/career/plan/communities", label: "Communities", icon: <FaUsers /> },
//     { to: "/career/plan/outlook", label: "Career Outlook", icon: <FaChartLine /> },
//     { to: "/home", label: "Home", icon: <FaHome /> },
//     {
//       label: "Profile",
//       icon: <FaUserCircle />,
//       onClick: () => setIsProfileOpen(true),
//     },
//   ];

//   return (
//     <>
//       <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
//         <div className="ml-4 mr-4 mx-auto px-4 py-3 flex items-center justify-between">
//           {/* Brand */}
//           <h1
//             className="text-2xl font-serif font-bold text-purple-700 cursor-pointer"
//             onClick={() => navigate("/career/plan")}
//           >
//             🚀 Learning Journey
//           </h1>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex gap-6">
//             {navItems.map(({ to, label, onClick }) =>
//               to ? (
//                 <NavLink
//                   key={to}
//                   to={to}
//                   className={({ isActive }) =>
//                     `text-sm font-medium transition-colors ${
//                       isActive
//                         ? "text-purple-700 border-b-2 border-purple-700"
//                         : "text-gray-500 hover:text-purple-700"
//                     }`
//                   }
//                 >
//                   {label}
//                 </NavLink>
//               ) : (
//                 <button
//                   key={label}
//                   onClick={onClick}
//                   className="text-sm font-medium text-gray-500 hover:text-purple-700"
//                 >
//                   {label}
//                 </button>
//               )
//             )}
//           </nav>

//           {/* Right Icons */}
//           <div className="hidden lg:flex items-center gap-4">
//             <button
//               ref={bellRef}
//               onClick={() => setIsNotificationOpen(true)}
//               className="relative text-gray-600 hover:text-purple-700 transition"
//               aria-label="Notifications"
//             >
//               <FaBell className="w-6 h-6" />

//               {/* Bouncing notification count */}
//               <AnimatePresence>
//                 {notificationsCount > 0 && (
//                   <motion.span
//                     key={notificationsCount}
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1.3 }}
//                     exit={{ scale: 0 }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 500,
//                       damping: 15,
//                     }}
//                     className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
//                   >
//                     {notificationsCount}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </button>

//             {profile && user && (
//               <div
//                 className="flex items-center gap-4 border p-1 rounded-md cursor-pointer border-purple-200"
//                 onClick={() => setIsProfileOpen(true)}
//               >
//                 <img
//                   src={profileImage}
//                   alt="avatar"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="text-right">
//                   <h3 className="text-sm font-semibold truncate max-w-[140px]">
//                     {user?.username}
//                   </h3>
//                   <p className="text-xs text-gray-400 truncate max-w-[140px]">
//                     {user?.email}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="lg:hidden text-purple-700"
//             onClick={toggleMenu}
//             aria-label="Toggle Menu"
//           >
//             {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Nav */}
//         {isOpen && (
//           <div className="lg:hidden bg-white shadow-md px-4 py-2">
//             <nav className="flex flex-col gap-4">
//               {navItems.map(({ to, label, icon, onClick }) =>
//                 to ? (
//                   <NavLink
//                     key={to}
//                     to={to}
//                     onClick={() => setIsOpen(false)}
//                     className={({ isActive }) =>
//                       `flex items-center gap-2 text-sm ${
//                         isActive
//                           ? "text-purple-700 font-semibold"
//                           : "text-gray-600 hover:text-purple-700"
//                       }`
//                     }
//                   >
//                     {icon}
//                     {label}
//                   </NavLink>
//                 ) : (
//                   <button
//                     key={label}
//                     onClick={() => {
//                       setIsOpen(false);
//                       onClick();
//                     }}
//                     className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700"
//                   >
//                     {icon}
//                     {label}
//                   </button>
//                 )
//               )}
//             </nav>
//           </div>
//         )}
//       </header>

//       {/* Modals */}
//       <ProfileModal
//         isOpen={isProfileOpen}
//         onClose={() => setIsProfileOpen(false)}
//         profile={profile || user}
//         reloadProfile={async () => {
//           try {
//             const res = await getProfile("me");
//             setProfile(res);
//           } catch {}
//         }}
//         onLogout={null}
//       />

//       <NotificationModal
//         isOpen={isNotificationOpen}
//         onClose={() => {
//           setIsNotificationOpen(false);
//           resetNotifications();
//         }}
//         socket={socket}
//       />

//       {/* Toast Wrapper */}
//       <NotificationToastWrapper
//         bellRef={bellRef}
//         notifications={[]} // You can pass initial notifications if needed
//         latestNotification={latestNotification}
//         clearToast={clearToast}
//       />
//     </>
//   );
// };

// export default LearningNavbar;


// src/components/Learning/LearningNavbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { getProfile } from "../../api/profile";
import ProfileModal from "../ProfileModal";
import NotificationModal from "../NotificationModal";
import NotificationToastWrapper from "../Profile/NotificationToastWrapper";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";
import { motion, AnimatePresence } from "framer-motion";

const LearningNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

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
    profile?.profilePicture?.trim() || "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";

  const navItems = [
    { to: "/career/plan/skills", label: "SkillsToLearn", icon: <FaLightbulb /> },
    { to: "/career/plan/roadmap", label: "Roadmap", icon: <FaMap /> },
    { to: "/career/plan/projects", label: "Projects", icon: <FaTasks /> },
    { to: "/career/plan/resources", label: "Resources", icon: <FaBook /> },
    { to: "/career/plan/communities", label: "Communities", icon: <FaUsers /> },
    { to: "/career/plan/outlook", label: "Career Outlook", icon: <FaChartLine /> },
    { to: "/home", label: "Home", icon: <FaHome /> },
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
          {/* Brand */}
          <h1
            className="text-2xl font-serif font-bold text-black cursor-pointer"
            onClick={() => navigate("/career/plan")}
          >
            ElevateX Learning
          </h1>

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
                className="flex items-center gap-4 border p-1 rounded-md cursor-pointer border-gray-200"
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
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-black"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden bg-white shadow-md px-4 py-2">
            <nav className="flex flex-col gap-4">
              {navItems.map(({ to, label, icon, onClick }) =>
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
                    {icon}
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
                    {icon}
                    {label}
                  </button>
                )
              )}
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
        notifications={[]}
        latestNotification={latestNotification}
        clearToast={clearToast}
      />
    </>
  );
};

export default LearningNavbar;