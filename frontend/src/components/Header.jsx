"use client"

import { useState, useRef, useEffect } from "react"
import { FiBell, FiSearch, FiMenu, FiSun, FiMoon } from "react-icons/fi"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import ProfileDropdown from "./DropDown/ProfileDropdown"
import NotificationsDropdown from "./DropDown/NotificationsDropdown"

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)

  const pageNames = {
    "/dashboard": "Tableau de bord",
    "/defis": "Défis disponibles",
    "/chrono-douche": "Chrono Douche",
    "/alertes": "Alertes & Recommandations",
    "/defi-temperature": "Défi Température",
    "/cuisine-maligne": "Cuisine Maligne",
    "/economie-eclair": "Économie Éclair",
    "/classement": "Classement",
    "/feed": "Fil d'actualité",
    "/events": "Événements",
    "/recompenses": "Récompenses",
    "/profile": "Profil",
  }

  const getCurrentPageName = () => pageNames[location.pathname] || "Tableau de bord"

  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    const names = user.full_name.split(" ")
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase()
  }

  const getUserDisplayName = () => {
    if (!user?.full_name) return "Utilisateur"
    return user.full_name.split(" ")[0]
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false)
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setIsNotificationsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    if (isProfileOpen) setIsProfileOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-40 shadow-sm
        ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg border flex-shrink-0
              ${theme === "dark"
                ? "hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900"}`}
            aria-label="Toggle sidebar"
          >
            <FiMenu className="text-lg" />
          </button>

          <div className="hidden sm:block min-w-0">
            <h1 className={`text-lg sm:text-2xl font-semibold truncate ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {getCurrentPageName()}
            </h1>

            <nav className={`hidden md:flex text-xs sm:text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <span>Accueil</span>
              <span className="mx-2">›</span>
              <span className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>
                {getCurrentPageName()}
              </span>
            </nav>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors flex-shrink-0
              ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            title={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>

          {/* Notifications */}
          <div className="relative flex-shrink-0" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className={`relative p-2 rounded-lg transition-colors
                ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
              aria-label="Notifications"
            >
              <FiBell className="text-lg" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
          </div>

          {/* Profile */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors
                ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              aria-label="User menu"
            >
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                </div>
              )}
              <span className={`hidden sm:inline text-sm font-medium truncate ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                {getUserDisplayName()}
              </span>
            </button>
            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user || { full_name: "Utilisateur", email: "" }} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
