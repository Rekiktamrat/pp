import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiKey, FiMoon, FiSun, FiMenu, FiBell } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { changeDarkMode } from "../store/auth/authSlices";
import { useDispatch } from "react-redux";

const Navbar = (props) => {
  const navigate = useNavigate();
  const isDarkMode = document.body.classList.contains("dark");
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    const adminData = JSON.parse(localStorage.getItem("Admin"));
    if (adminData) {
      const newMode = adminData.preference === "dark" ? "light" : "dark";
      const data = {
        preference: newMode,
      };
      dispatch(changeDarkMode(data))
        .unwrap()
        .then(() => {
          adminData.preference = newMode;
          localStorage.setItem("manager", JSON.stringify(adminData));
          document.body.classList.toggle("dark", newMode === "dark");
        })
        .catch((error) => {
          console.error("Failed to update dark mode:", error);
        });
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };
  const handleChangePassword = () => {
    navigate("change-password");
    setShowDropdown(false);
  }

  const handleProfile = () => {
    navigate("profile");
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const { setSidebarOpen } = props;

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between md:justify-end h-16 px-4 md:px-6">
        {/* Hamburger Menu for Mobile */}
        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 dark:text-gray-400">
          <FiMenu className="w-6 h-6" />
        </button>
      {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors">
            <FiBell className="w-5 h-5" />
          {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

        {/* Profile Section */}
          <div className="relative">
            <button onClick={toggleDropdown} className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <MdAccountCircle className="text-2xl" />
            </button>

          {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-white">Signed in as</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">admin@primeproperty.com</p>
              </div>
              
                <div className="py-1">
                  <button
                    onClick={handleProfile}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <MdAccountCircle className="mr-3 text-lg text-gray-400" />
                    View Profile
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <FiKey className="mr-3 text-lg text-gray-400" />
                    Change Password
                  </button>
                </div>

                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FiLogOut className="mr-3 text-lg" />
                    Logout
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};

export default Navbar;