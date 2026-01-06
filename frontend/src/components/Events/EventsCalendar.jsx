import React, { useState } from "react"
import { useTheme } from "../../context/ThemeContext"
import { eventsData } from "./eventsData.js"
import EventModal from "./EventModal"
import { FiCalendar, FiCheckCircle } from "react-icons/fi"

const EventsCalendar = () => {
  const { theme } = useTheme()
  const [events, setEvents] = useState(
    eventsData.map(event => ({ ...event, attending: false }))
  )
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleAttendToggle = (eventId) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, attending: !event.attending }
          : event
      )
    )

    setSelectedEvent(prev =>
      prev ? { ...prev, attending: !prev.attending } : prev
    )
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      
      {/* Container centré */}
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-2xl font-semibold mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Participez aux événements de votre communauté
          </h1>
          
        </div>

        {/* Events cards */}
        <div className="space-y-4">
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`cursor-pointer rounded-lg p-6 transition-all duration-150 border ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800 hover:border-green-700'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {event.title}
                  </h2>

                  <div className={`flex items-center gap-2 text-sm ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }`}>
                    <FiCalendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                </div>

                {event.attending && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-green-500/10 text-green-400 border border-green-800' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Je participe
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state si besoin plus tard */}
        {events.length === 0 && (
          <div className={`text-center py-16 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <p className="text-sm">Aucun événement à venir pour le moment</p>
          </div>
        )}

      </div>

      {/* Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onAttendToggle={handleAttendToggle}
      />
    </div>
  )
}

export default EventsCalendar