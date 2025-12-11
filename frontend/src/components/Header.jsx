"use client"

import { useState, useRef, useEffect } from "react"
import { FiBell, FiSearch, FiUser, FiMenu, FiSun, FiMoon } from "react-icons/fi"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProfileDropdown from "./DropDown/ProfileDropdown"
import NotificationsDropdown from "./DropDown/NotificationsDropdown"

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.darkModePreference || false
  })
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)

  // Mapping des routes vers leurs titres
  const pageNames = {
    "/dashboard": "Tableau de bord",
    "/defis": "Défis disponibles",
    "/chrono-douche": "Chrono Douche",
    "/analyses": "Analyses détaillées",
    "/alertes": "Alertes & Recommandations",
    "/defi-temperature": "Défi Température",
    "/cuisine-maligne": "Cuisine Maligne",
    "/economie-eclair": "Économie Éclair",
    "/classement": "Classement",
    "/actualites": "Fil d'actualité",
    "/evenements": "Événements",
    "/recompenses": "Récompenses",
    "/profile": "Profil",
  }

  const getCurrentPageName = () => {
    return pageNames[location.pathname] || "Tableau de bord"
  }

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    const names = user.full_name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  // Fonction pour obtenir le prénom ou nom complet
  const getUserDisplayName = () => {
    if (!user?.full_name) return "Utilisateur"
    const names = user.full_name.split(" ")
    return names[0] // Retourne juste le prénom
  }

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    window.darkModePreference = isDarkMode
  }, [isDarkMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left side - Mobile: Menu button only, Desktop: Toggle + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="text-gray-600 dark:text-gray-300 text-lg" />
          </button>

          <div className="hidden sm:block min-w-0">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white truncate">
              {getCurrentPageName()}
            </h1>
            <nav className="hidden md:flex text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>Accueil</span>
              <span className="mx-2">›</span>
              <span className="text-blue-600 dark:text-blue-400">{getCurrentPageName()}</span>
            </nav>
          </div>
        </div>

        {/* Right side - Search and Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:block relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 w-32 lg:w-40"
            />
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative flex-shrink-0" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="text-lg" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
          </div>

          {/* Profile Dropdown */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {getUserDisplayName()}
              </span>
            </button>

            <ProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
              user={user || { full_name: "Utilisateur", email: "" }} 
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header