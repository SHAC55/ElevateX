import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaStore,
  FaComments,
  FaFileAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) return null;

  const navItems = [
    {
      to: "/home",
      label: "Dashboard",
      icon: <FaHome />,
    },
    {
      to: "/career-os",
      label: "CareerOS",
      icon: <FaBriefcase />,
    },
    {
      to: "/marketplace",
      label: "Marketplace",
      icon: <FaStore />,
    },
    {
      to: "/mock-interview",
      label: "Mock Interview",
      icon: <FaComments />,
    },
    {
      to: "/resume-tools",
      label: "Resume & Cover Letter",
      icon: <FaFileAlt />,
    },
    {
      to: "/portfolio",
      label: "Portfolio",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <>
      {/* Hamburger only when sidebar is closed on mobile */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-200 rounded-md"
          onClick={toggleSidebar}
          aria-label="Open Sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[75%] sm:w-[50%] lg:w-[18%] bg-[#fefefe] p-4 z-40 transform transition-transform duration-300 ease-in-out flex justify-between flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        {/* Close button inside sidebar */}
        <div className="flex justify-end lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2"
            aria-label="Close Sidebar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {/* Logo Header */}
          <div className="font-serif rounded-md p-2">
            <h1 className="text-3xl font-semibold text-black">ElevateX</h1>
          </div>

          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 mt-4 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-black text-white font-semibold"
                    : "text-gray-500 hover:bg-gray-200 hover:text-black"
                }`
              }
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <footer className="flex items-center gap-3 p-3 rounded-md mb-6 border border-gray-300">
         <img src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" className="w-10" alt="" srcSet="" />
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-base font-semibold truncate max-w-[160px]">
              {user.username}
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[160px]">
              {user.email}
            </p>
          </div>
          <button className="ml-6" onClick={handleLogout}>
            <FaSignOutAlt className="w-6 h-6 text-black hover:text-red-500" />
          </button>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SidebarNav;
