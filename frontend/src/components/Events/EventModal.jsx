import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiX } from "react-icons/fi"

const EventModal = ({ event, onClose, onAttendToggle }) => {
  const { theme } = useTheme()
  
  if (!event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-lg border transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <h2 className={`text-xl font-semibold pr-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className={`space-y-3 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center gap-3">
              <FiCalendar className="w-4 h-4 flex-shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="w-4 h-4 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="w-4 h-4 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className={`mt-4 text-sm leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {event.description}
          </p>

          <div className={`mt-4 flex items-center gap-2 text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <FiUsers className="w-3.5 h-3.5" />
            <span>{event.participants}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onAttendToggle(event.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                event.attending
                  ? theme === 'dark'
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                  : theme === 'dark'
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {event.attending ? "Annuler ma participation" : "Participer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal