import { useState, useEffect } from "react"
import { FiThermometer, FiAward, FiTrendingDown, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"

const DefiTemperature = () => {
  const { theme } = useTheme()
  
  // État du défi
  const [currentTemp, setCurrentTemp] = useState(19)
  const [dailyLogs, setDailyLogs] = useState([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [weekProgress, setWeekProgress] = useState([
    { day: "Lun", validated: false, temp: null },
    { day: "Mar", validated: false, temp: null },
    { day: "Mer", validated: false, temp: null },
    { day: "Jeu", validated: false, temp: null },
    { day: "Ven", validated: false, temp: null },
    { day: "Sam", validated: false, temp: null },
    { day: "Dim", validated: false, temp: null },
  ])

  const TARGET_TEMP = 19
  const DAILY_POINTS = 70
  const WEEKLY_BONUS = 500

  // Valider la journée
  const validateDay = () => {
    const isValid = currentTemp === TARGET_TEMP
    const today = new Date().toLocaleDateString("fr-FR", { weekday: "short" })
    
    // Mettre à jour les logs
    const newLog = {
      date: new Date().toLocaleDateString("fr-FR"),
      temp: currentTemp,
      validated: isValid,
      points: isValid ? DAILY_POINTS : 0
    }
    setDailyLogs(prev => [newLog, ...prev].slice(0, 7))

    // Mettre à jour la semaine
    const dayIndex = new Date().getDay()
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1
    
    const updatedWeek = [...weekProgress]
    updatedWeek[adjustedIndex] = {
      ...updatedWeek[adjustedIndex],
      validated: isValid,
      temp: currentTemp
    }
    setWeekProgress(updatedWeek)

    // Calculer les points
    if (isValid) {
      setTotalPoints(prev => prev + DAILY_POINTS)
      setCurrentStreak(prev => prev + 1)
      
      // Bonus si 7 jours consécutifs
      if (currentStreak + 1 >= 7) {
        setTotalPoints(prev => prev + WEEKLY_BONUS)
        setCurrentStreak(0)
      }
    } else {
      setCurrentStreak(0)
    }
  }

  // Conseils selon la température
  const getAdvice = () => {
    if (currentTemp < 19) {
      return {
        icon: "🥶",
        text: "Température trop basse ! Augmentez le chauffage pour atteindre 19°C.",
        color: theme === "dark" ? "text-blue-400" : "text-blue-600",
        bg: theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
      }
    } else if (currentTemp > 19) {
      return {
        icon: "🔥",
        text: "Température trop élevée ! Réduisez le chauffage à 19°C pour économiser.",
        color: theme === "dark" ? "text-red-400" : "text-red-600",
        bg: theme === "dark" ? "bg-red-900/20" : "bg-red-50"
      }
    } else {
      return {
        icon: "✅",
        text: "Parfait ! Température idéale pour le confort et l'économie d'énergie.",
        color: theme === "dark" ? "text-green-400" : "text-green-600",
        bg: theme === "dark" ? "bg-green-900/20" : "bg-green-50"
      }
    }
  }

  const advice = getAdvice()
  const validatedDays = weekProgress.filter(d => d.validated).length

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"}`}>
            <FiThermometer className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Défi Température</h1>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Maintenez 19°C pendant 7 jours pour maximiser vos économies
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Temperature Control */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 shadow-md border h-full flex flex-col justify-center transition-colors ${
              theme === "dark" 
                ? "bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800" 
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
            }`}>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {currentTemp}°C
                </div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
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
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: currentTemp === 19 
                      ? "linear-gradient(to right, #10b981, #10b981)" 
                      : currentTemp < 19 
                      ? "linear-gradient(to right, #3b82f6, #3b82f6)"
                      : "linear-gradient(to right, #ef4444, #ef4444)"
                  }}
                />
                <div className="flex justify-between mt-2 text-xs">
                  <span className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>16°C</span>
                  <span className={theme === "dark" ? "text-green-400" : "text-green-600"} style={{ fontWeight: "bold" }}>19°C</span>
                  <span className={theme === "dark" ? "text-red-400" : "text-red-600"}>22°C</span>
                </div>
              </div>

              {/* Advice Box */}
              <div className={`rounded-lg p-4 mb-6 ${advice.bg}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{advice.icon}</span>
                  <p className={`text-sm ${advice.color} leading-relaxed`}>
                    {advice.text}
                  </p>
                </div>
              </div>

              {/* Validate Button */}
              <button
                onClick={validateDay}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentTemp === TARGET_TEMP
                    ? theme === "dark"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={currentTemp !== TARGET_TEMP}
              >
                {currentTemp === TARGET_TEMP ? "Valider la journée" : "Ajustez à 19°C pour valider"}
              </button>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-6 shadow-md border h-full transition-colors ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`rounded-lg p-4 text-center ${theme === "dark" ? "bg-blue-900/20" : "bg-gradient-to-br from-blue-50 to-cyan-50"}`}>
                  <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {validatedDays}/7
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cette semaine</div>
                </div>
                <div className={`rounded-lg p-4 text-center ${theme === "dark" ? "bg-orange-900/20" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
                  <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                    {currentStreak}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Série en cours</div>
                </div>
                <div className={`rounded-lg p-4 text-center ${theme === "dark" ? "bg-green-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50"}`}>
                  <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    {totalPoints}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Points totaux</div>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="mb-6">
                <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiCalendar className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                  Progression de la semaine
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {weekProgress.map((day, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 text-center transition-all ${
                        day.validated
                          ? theme === "dark"
                            ? "bg-green-900/30 border-2 border-green-600"
                            : "bg-green-50 border-2 border-green-400"
                          : day.temp !== null
                          ? theme === "dark"
                            ? "bg-red-900/30 border-2 border-red-600"
                            : "bg-red-50 border-2 border-red-400"
                          : theme === "dark"
                          ? "bg-gray-700 border-2 border-gray-600"
                          : "bg-gray-100 border-2 border-gray-300"
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {day.day}
                      </div>
                      {day.validated ? (
                        <FiCheckCircle className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                      ) : day.temp !== null ? (
                        <FiXCircle className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                      ) : (
                        <FiClock className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiTrendingDown className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                  Historique récent
                </h3>
                <div className="space-y-2">
                  {dailyLogs.length === 0 ? (
                    <p className={`text-sm text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Aucune journée validée pour l'instant
                    </p>
                  ) : (
                    dailyLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center rounded-lg px-4 py-3 transition-colors ${
                          theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {log.validated ? (
                            <FiCheckCircle className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                          ) : (
                            <FiXCircle className={`w-4 h-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                          )}
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {log.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold ${
                            log.temp === TARGET_TEMP
                              ? theme === "dark" ? "text-green-400" : "text-green-600"
                              : theme === "dark" ? "text-red-400" : "text-red-600"
                          }`}>
                            {log.temp}°C
                          </span>
                          <span className={`text-xs font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                            {log.points} pts
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Points System */}
              <div className={`mt-6 rounded-lg p-4 ${theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"}`}>
                <h4 className={`text-sm font-bold mb-2 ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
                  Système de points
                </h4>
                <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`}>
                  <li>• Journée à 19°C : <strong>{DAILY_POINTS} points</strong></li>
                  <li>• Série de 7 jours : <strong>Bonus de {WEEKLY_BONUS} points</strong></li>
                  <li>• Maximum mensuel : <strong>500 points</strong></li>
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