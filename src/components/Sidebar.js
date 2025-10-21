import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaCog,
  FaHome,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaMoneyBill,
  FaKey,
  FaMapMarkerAlt,
  FaChartLine,
  FaCogs,
  FaComments,
  FaBell,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, setSidebarOpen, collapsed, setCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommDropdownOpen, setIsCommDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const location = useLocation();
  
  // Sync with the current theme in localStorage
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    setIsDarkMode(currentTheme === 'dark');
  }, []);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleCommDropdown = () => {
    setIsCommDropdownOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path) => {
    const baseClasses = "flex items-center p-3 my-1 text-sm rounded-lg transition-all duration-200";
    const activeClasses = isDarkMode 
      ? "bg-blue-600 text-white shadow-md" 
      : "bg-blue-50 text-blue-700 font-semibold";
    const inactiveClasses = isDarkMode 
      ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const getDropdownItemClassName = (path) => {
    const baseClasses = "flex items-center p-2 pl-8 text-sm rounded transition-all duration-200";
    const activeClasses = isDarkMode 
      ? "bg-blue-700 text-white" 
      : "bg-blue-50 text-blue-700 font-semibold";
    const inactiveClasses = isDarkMode 
      ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-screen flex flex-col z-50
        ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'} 
        ${collapsed ? 'w-20' : 'w-64'} 
        transition-transform duration-300 ease-in-out shadow-lg
        md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className={`flex items-center h-16 ${collapsed ? 'justify-center' : 'justify-between px-4'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          {!collapsed && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                PP
              </div>
              <div>
                <h2 className="text-lg font-bold">Prime Property</h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              PP
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-full hidden md:block ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {collapsed ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1 rounded-full md:hidden ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {/* Dashboard */}
          <NavLink to="/admin/dashboard" className={getNavClassName('/admin/dashboard')}>
            <FaHome className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {/* Property Management */}
          <NavLink to="/admin/property-management" className={getNavClassName('/admin/property-management')}>
            <FaBuilding className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Property Management</span>}
          </NavLink>

          {/* Property Type */}
          <NavLink to="/admin/property-type" className={getNavClassName('/admin/property-type')}>
            <FaCogs className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Property Type</span>}
          </NavLink>

          {/* User Management */}
          <NavLink to="/admin/user-management" className={getNavClassName('/admin/user-management')}>
            <FaUser className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>User Management</span>}
          </NavLink>

          {/* Manager Management */}
          <NavLink to="/admin/manager-management" className={getNavClassName('/admin/manager-management')}>
            <FaUser className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Manager Management</span>}
          </NavLink>

          {/* Rental Transaction */}
          <NavLink to="/admin/rental" className={getNavClassName('/admin/rental')}>
            <FaKey className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Rental Transaction</span>}
          </NavLink>

          {/* Notification */}
          <NavLink to="/admin/scheduled-notifications" className={getNavClassName('/admin/scheduled-notifications')}>
            <FaBell className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Notifications</span>}
          </NavLink>

          {/* Communications Dropdown */}
          <div className="mt-2">
            <button onClick={toggleCommDropdown} className={getNavClassName('/admin/communications')}>
              <FaComments className={collapsed ? 'mx-auto' : 'mr-3'} />
              {!collapsed && <span className="flex-1 text-left">Communications</span>}
              {!collapsed && (isCommDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />)}
            </button>
            {!collapsed && isCommDropdownOpen && (
              <div className="mt-1 space-y-1">
                <NavLink to="/admin/communications/messages" className={getDropdownItemClassName('/admin/communications/messages')}>Messages</NavLink>
                <NavLink to="/admin/communications/announcements" className={getDropdownItemClassName('/admin/communications/announcements')}>Announcements</NavLink>
                <NavLink to="/admin/communications/templates" className={getDropdownItemClassName('/admin/communications/templates')}>Templates</NavLink>
                <NavLink to="/admin/communications/notifications" className={getDropdownItemClassName('/admin/communications/notifications')}>Notifications</NavLink>
              </div>
            )}
          </div>

          {/* Address Management Dropdown */}
          <div className="mt-2">
            <button onClick={toggleDropdown} className={getNavClassName('/admin/address')}>
              <FaMapMarkerAlt className={collapsed ? 'mx-auto' : 'mr-3'} />
              {!collapsed && <span className="flex-1 text-left">Address Management</span>}
              {!collapsed && (isDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />)}
            </button>
            {!collapsed && isDropdownOpen && (
              <div className="mt-1 space-y-1">
                <NavLink to="/admin/region" className={getDropdownItemClassName('/admin/region')}>Region</NavLink>
                <NavLink to="/admin/subregion" className={getDropdownItemClassName('/admin/subregion')}>SubRegion</NavLink>
                <NavLink to="/admin/location" className={getDropdownItemClassName('/admin/location')}>Location</NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Settings at bottom */}
        <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <NavLink to="/admin/system" className={getNavClassName('/admin/system')}>
            <FaCog className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;