"use client"
import { FiUser, FiSettings, FiLogOut, FiHelpCircle } from "react-icons/fi"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = ({ isOpen, onClose, user = { name: "Admin" } }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const menuItems = [
    {
      icon: FiUser,
      label: "Mon profil",
      onClick: () => navigate("/profile"),
    },
    { icon: FiSettings, label: "Paramètres", onClick: () => console.log("Paramètres cliqué") },
    { icon: FiHelpCircle, label: "Aide & Support", onClick: () => console.log("Aide cliqué") },
  ]

  const handleMenuItemClick = (onClick) => {
    onClick()
    onClose()
  }

  const handleLogout = async () => {
    logout()
    onClose()
    navigate("/login")
  }

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      

      {/* Menu items */}
      <div className="p-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.onClick)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <IconComponent className="text-gray-400 dark:text-gray-500 text-base" />
              <span>{item.label}</span>
            </button>
          )
        })}

        {/* Séparateur */}
        <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <FiLogOut className="text-red-400 dark:text-red-500 text-base" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default ProfileDropdown
