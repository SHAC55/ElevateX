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
} from "react-icons/fa";

const TopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

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
    { to: "/home", label: "Dashboard", icon: <FaHome /> },
    { to: "/career-os", label: "CareerOS", icon: <FaBriefcase /> },
    { to: "/marketplace", label: "Marketplace", icon: <FaStore /> },
    { to: "/mock-interview", label: "Mock Interview", icon: <FaComments /> },
    { to: "/resume-tools", label: "Resume Tools", icon: <FaFileAlt /> },
    { to: "/portfolio", label: "Portfolio", icon: <FaUserCircle /> },
  ];

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="ml-4 mr-4 mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <h1 className="text-2xl font-serif font-bold text-black">ElevateX</h1>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6">
          {navItems.map(({ to, label }) => (
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
          ))}
        </nav>

        {/* User Info */}
        <div className="hidden lg:flex items-center gap-4 border p-1 rounded-md">
          <img
            src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <h3 className="text-sm font-semibold truncate max-w-[140px]">
              {user.username}
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[140px]">
              {user.email}
            </p>
          </div>
          <button onClick={handleLogout} title="Logout">
            <FaSignOutAlt className="w-5 h-5 text-black hover:text-red-500" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-black"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-4 py-2">
          <nav className="flex flex-col gap-4">
            {navItems.map(({ to, label }) => (
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
            ))}
            <div className="flex items-center gap-3 border-t pt-4 mt-2">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col text-xs">
                <span className="font-semibold truncate max-w-[160px]">
                  {user.username}
                </span>
                <span className="text-gray-400 truncate max-w-[160px]">
                  {user.email}
                </span>
              </div>
              <button onClick={handleLogout} className="ml-auto">
                <FaSignOutAlt className="w-5 h-5 text-black hover:text-red-500" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
