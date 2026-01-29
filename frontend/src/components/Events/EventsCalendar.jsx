import React, { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { eventsService } from "../../services/eventsService"
import EventModal from "./EventModal"
import { FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi"

const EventsCalendar = () => {
  const { theme } = useTheme()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Récupérer les événements depuis l'API
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError("")
      
      const result = await eventsService.getAllEvents()
      
      if (result.success) {
        // Transformer les données de l'API pour correspondre au format attendu
        const formattedEvents = result.data.map(event => ({
          id: event.id,
          title: event.title,
          date: formatDateForDisplay(event.date), // Formatage de la date
          time: event.time,
          location: event.location,
          description: event.description,
          attending: false // Par défaut, l'utilisateur ne participe pas
        }))
        
        setEvents(formattedEvents)
      } else {
        setError(result.error || "Erreur lors du chargement des événements")
      }
    } catch (err) {
      console.error("Erreur fetchEvents:", err)
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour formater la date (AAAA-MM-JJ → Mercredi 22 Novembre)
  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString)
      const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }
      return date.toLocaleDateString('fr-FR', options)
    } catch {
      return dateString
    }
  }

  const handleAttendToggle = async (eventId) => {
    try {
      // Mettre à jour l'état local immédiatement pour un feedback instantané
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

      // Appeler l'API pour enregistrer la participation
      // Note: Vous devez créer ces endpoints dans votre backend
      // if (events.find(e => e.id === eventId)?.attending) {
      //   await eventsService.cancelAttendance(eventId)
      // } else {
      //   await eventsService.attendEvent(eventId)
      // }
      
    } catch (error) {
      console.error("Erreur participation:", error)
      // Revenir à l'état précédent en cas d'erreur
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, attending: !event.attending } // Annuler le changement
            : event
        )
      )
    }
  }

  // État de chargement
  if (loading) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            theme === 'dark' ? 'border-green-500' : 'border-green-600'
          }`}></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Chargement des événements...
          </p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className={`p-6 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-red-900/20 border-red-800' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <FiAlertCircle className={`w-5 h-5 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-red-300' : 'text-red-800'
                }`}>
                  Erreur de chargement
                </h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {error}
                </p>
                <button
                  onClick={fetchEvents}
                  className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-red-700 hover:bg-red-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {events.length} événement{events.length > 1 ? 's' : ''} disponible{events.length > 1 ? 's' : ''}
          </p>
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
                    <span className="mx-1">•</span>
                    <span>{event.time}</span>
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

        {/* Message si aucun événement */}
        {events.length === 0 && (
          <div className={`text-center py-16 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Aucun événement à venir pour le moment</p>
            <button
              onClick={fetchEvents}
              className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Actualiser
            </button>
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