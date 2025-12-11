"use client"

import { useState } from "react"
import { FiBell, FiMessageSquare, FiAlertTriangle, FiCheck, FiX } from "react-icons/fi"

const NotificationsDropdown = ({ isOpen, onClose }) => {
  // Données d'exemple pour les notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "Nouveau message",
      message: "Vous avez reçu un message de Jean Dupont",
      time: "Il y a 5 min",
      read: false,
      icon: FiMessageSquare,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "energy",
      title: "Alerte consommation",
      message: "Consommation énergétique élevée détectée",
      time: "Il y a 15 min",
      read: false,
      icon: FiAlertTriangle,
      color: "text-orange-500",
    },
    {
      id: 3,
      type: "system",
      title: "Mise à jour système",
      message: "Votre système a été mis à jour avec succès",
      time: "Il y a 1 heure",
      read: true,
      icon: FiCheck,
      color: "text-green-500",
    },
  ])

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id, e) => {
    e.stopPropagation()
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group relative transition-colors ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <button
                  onClick={(e) => deleteNotification(notification.id, e)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                >
                  <FiX className="text-gray-400 dark:text-gray-500 text-xs" />
                </button>

                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${notification.color}`}>
                    <IconComponent className="text-sm" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</h4>
                      {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">{notification.time}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FiBell className="mx-auto text-2xl text-gray-300 dark:text-gray-600 mb-2" />
            <p>Aucune notification</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
          Voir toutes les notifications
        </button>
      </div>
    </div>
  )
}

export default NotificationsDropdown
