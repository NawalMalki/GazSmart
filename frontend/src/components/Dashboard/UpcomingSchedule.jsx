import { useTheme } from "../../context/ThemeContext"

const UpcomingSchedule = () => {
  const { theme } = useTheme()

  const events = [
    {
      date: 'Mer, 22 Nov',
      time: '18:30',
      title: 'Lancement Défi Éco-Quartier',
      description: 'Début du challenge mensuel : -15% de gaz pour gagner des bons d’achat +25 foyers'
    },
    {
      date: 'Ven, 24 Nov',
      time: '12:00',
      title: 'Atelier Dashboard Personnalisé',
      description: 'Apprendre à lire vos données de consommation en direct +18 inscrits'
    },
    {
      date: 'Mar, 28 Nov',
      time: '20:00',
      title: 'Soirée Classement & Récompenses',
      description: 'Annonce des gagnants du défi et remise des prix écoresponsables'
    }
  ]

  return (
    <div
      className={`rounded-lg shadow-sm border p-4 sm:p-6 h-full transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
        }`}
    >
      <h3 className={`text-base sm:text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Programme à venir
      </h3>

      <div className="space-y-2 sm:space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors
              ${theme === 'dark'
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-50'
              }`}
          >
            <input
              type="checkbox"
              className={`mt-1 rounded flex-shrink-0
                ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                <span className={`text-xs sm:text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {event.date}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{event.time}</span>
              </div>
              <h4 className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {event.title}
              </h4>
              <p className={`text-xs mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingSchedule
