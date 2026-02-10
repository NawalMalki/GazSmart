import { useState, useEffect } from "react"
import { FiThermometer, FiAward, FiTrendingDown, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { getParticipationDetails, validateTemperatureDay, joinChallenge } from "../services/challengesApi"
import { useNavigate } from "react-router-dom"

const DefiTemperature = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // État du défi
  const [currentTemp, setCurrentTemp] = useState(19)
  const [challenge, setChallenge] = useState(null)
  const [participation, setParticipation] = useState(null)
  const [weeklyLogs, setWeeklyLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const CHALLENGE_SLUG = "temperature"
  const TARGET_TEMP = 19
  const DAILY_POINTS = 70
  const WEEKLY_BONUS = 500

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        const data = await getParticipationDetails(CHALLENGE_SLUG)
        setChallenge(data.challenge)
        setParticipation(data.participation)
        setWeeklyLogs(data.weekly_logs || [])
        
        // Si pas encore participant, joindre automatiquement
        if (!data.is_participating) {
          await joinChallenge(CHALLENGE_SLUG)
          const updatedData = await getParticipationDetails(CHALLENGE_SLUG)
          setParticipation(updatedData.participation)
        }
      } catch (err) {
        console.error("Erreur:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  // Générer les jours de la semaine à partir des logs
  const getWeekProgress = () => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = dimanche
    
    return days.map((day, index) => {
      // Calculer la date de ce jour de la semaine
      const adjustedIndex = index // Lun = 0, Dim = 6
      const currentDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Lun = 0
      const diff = adjustedIndex - currentDayIndex
      const date = new Date(today)
      date.setDate(date.getDate() + diff)
      const dateStr = date.toISOString().split('T')[0]
      
      // Chercher dans les logs
      const log = weeklyLogs.find(l => {
        const logDate = new Date(l.log_date).toISOString().split('T')[0]
        return logDate === dateStr
      })
      
      return {
        day,
        validated: log?.is_validated || false,
        temp: log?.value_recorded || null,
        hasLog: !!log
      }
    })
  }

  const weekProgress = getWeekProgress()
  const validatedDays = weekProgress.filter(d => d.validated).length

  // Vérifier si déjà validé aujourd'hui
  const hasValidatedToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return weeklyLogs.some(log => {
      const logDate = new Date(log.log_date).toISOString().split('T')[0]
      return logDate === today
    })
  }

  // Valider la journée
  const validateDay = async () => {
    if (!user || !participation || validating) return
    
    setValidating(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const result = await validateTemperatureDay(CHALLENGE_SLUG, currentTemp)
      
      setSuccessMessage(
        result.is_validated 
          ? `Journée validée! +${result.points_earned} points${result.bonus_earned > 0 ? ` (bonus +${result.bonus_earned})` : ''}`
          : "Journée enregistrée mais non validée (température incorrecte)"
      )
      
      // Recharger les données
      const data = await getParticipationDetails(CHALLENGE_SLUG)
      setParticipation(data.participation)
      setWeeklyLogs(data.weekly_logs || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setValidating(false)
    }
  }

  const getAdvice = () => {
    if (currentTemp < 19) {
      return {
        text: "Température trop basse! Augmentez le chauffage pour atteindre 19°C.",
        color: theme === "dark" ? "text-blue-300" : "text-blue-700",
        bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50/50"
      }
    } else if (currentTemp > 19) {
      return {
        text: "Température trop élevée! Réduisez le chauffage à 19°C pour économiser.",
        color: theme === "dark" ? "text-red-300" : "text-red-700",
        bg: theme === "dark" ? "bg-red-500/10" : "bg-red-50/50"
      }
    } else {
      return {
        text: "Parfait! Température idéale pour le confort et l'économie d'énergie.",
        color: theme === "dark" ? "text-green-300" : "text-green-700",
        bg: theme === "dark" ? "bg-green-500/10" : "bg-green-50/50"
      }
    }
  }

  const advice = getAdvice()
  const alreadyValidatedToday = hasValidatedToday()

  if (!user) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <FiAlertCircle className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Connexion requise
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Connectez-vous pour participer au défi température.
          </p>
          <button
            onClick={() => navigate('/login')}
            className={`px-6 py-2 rounded-lg font-medium ${
              theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Messages */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className={`mb-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-green-900/20 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {successMessage}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Temperature Control */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg p-6 border h-full flex flex-col justify-center transition-colors duration-200 ${
              theme === "dark" 
                ? "bg-gray-900/60 backdrop-blur-sm border-gray-800" 
                : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {currentTemp}°C
                </div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                  Température actuelle
                </p>
              </div>

              {/* Temperature Slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min="16"
                  max="22"
                  value={currentTemp}
                  onChange={(e) => setCurrentTemp(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: currentTemp === 19 
                      ? theme === "dark" ? "#22c55e" : "#16a34a"
                      : currentTemp < 19 
                      ? theme === "dark" ? "#3b82f6" : "#2563eb"
                      : theme === "dark" ? "#ef4444" : "#dc2626"
                  }}
                />
                <div className="flex justify-between mt-2 text-xs">
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>16°C</span>
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"} style={{ fontWeight: 600 }}>19°C</span>
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>22°C</span>
                </div>
              </div>

              {/* Advice Box */}
              <div className={`rounded-lg p-4 mb-6 border ${advice.bg} ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}>
                <p className={`text-sm ${advice.color} leading-relaxed`}>
                  {advice.text}
                </p>
              </div>

              {/* Validate Button */}
              <button
                onClick={validateDay}
                disabled={currentTemp !== TARGET_TEMP || validating || alreadyValidatedToday}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-150 ${
                  alreadyValidatedToday
                    ? theme === "dark"
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : currentTemp === TARGET_TEMP
                    ? theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                {validating 
                  ? "Validation..." 
                  : alreadyValidatedToday 
                    ? "Déjà validé aujourd'hui" 
                    : currentTemp === TARGET_TEMP 
                      ? "Valider la journée" 
                      : "Ajustez à 19°C pour valider"
                }
              </button>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg p-6 border h-full transition-colors duration-200 ${
              theme === "dark" ? "bg-gray-900/60 backdrop-blur-sm border-gray-800" : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`rounded-lg p-4 text-center border ${
                  theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                }`}>
                  <div className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {validatedDays}/7
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Cette semaine</div>
                </div>
                <div className={`rounded-lg p-4 text-center border ${
                  theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                }`}>
                  <div className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {participation?.current_streak || 0}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Série en cours</div>
                </div>
                <div className={`rounded-lg p-4 text-center border ${
                  theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                }`}>
                  <div className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {participation?.total_points || 0}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Points totaux</div>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiCalendar className="w-4 h-4" />
                  Progression de la semaine
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {weekProgress.map((day, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 text-center transition-all duration-150 border ${
                        day.validated
                          ? theme === "dark"
                            ? "bg-green-500/10 border-green-600"
                            : "bg-green-50 border-green-400"
                          : day.hasLog
                          ? theme === "dark"
                            ? "bg-red-500/10 border-red-600"
                            : "bg-red-50 border-red-400"
                          : theme === "dark"
                          ? "bg-gray-800/40 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {day.day}
                      </div>
                      {day.validated ? (
                        <FiCheckCircle className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                      ) : day.hasLog ? (
                        <FiXCircle className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                      ) : (
                        <FiClock className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiTrendingDown className="w-4 h-4" />
                  Historique récent
                </h3>
                <div className="space-y-2">
                  {weeklyLogs.length === 0 ? (
                    <p className={`text-sm text-center py-4 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                      Aucune journée validée pour l'instant
                    </p>
                  ) : (
                    weeklyLogs.slice(0, 7).map((log, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center rounded-lg px-4 py-3 border transition-colors duration-150 ${
                          theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {log.is_validated ? (
                            <FiCheckCircle className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                          ) : (
                            <FiXCircle className={`w-4 h-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                          )}
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {new Date(log.log_date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold tabular-nums ${
                            log.value_recorded === TARGET_TEMP
                              ? theme === "dark" ? "text-green-400" : "text-green-600"
                              : theme === "dark" ? "text-red-400" : "text-red-600"
                          }`}>
                            {log.value_recorded}°C
                          </span>
                          <span className={`text-xs font-semibold tabular-nums ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {log.points_earned} pts
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Points System */}
              <div className={`mt-6 rounded-lg p-4 border ${
                theme === "dark" ? "bg-blue-500/5 border-blue-900/30" : "bg-blue-50/50 border-blue-200/50"
              }`}>
                <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-blue-300" : "text-blue-900"}`}>
                  Système de points
                </h4>
                <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-blue-300/70" : "text-blue-800/80"}`}>
                  <li>Journée à 19°C : <strong>{DAILY_POINTS} points</strong></li>
                  <li>Série de 7 jours : <strong>Bonus de {WEEKLY_BONUS} points</strong></li>
                  <li>Maximum mensuel : <strong>500 points</strong></li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DefiTemperature
