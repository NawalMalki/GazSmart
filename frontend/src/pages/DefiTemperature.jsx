import { useState, useEffect } from "react"
import { FiThermometer, FiTrendingDown, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiLoader, FiAlertCircle } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const DefiTemperature = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  // State
  const [currentTemp, setCurrentTemp] = useState(19)
  const [participation, setParticipation] = useState(null)
  const [weekProgress, setWeekProgress] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [challengeInfo, setChallengeInfo] = useState(null)

  const TARGET_TEMP = 19

  // Fetch challenge data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/login")
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      try {
        // Get challenge info
        const challengeRes = await fetch(`${API_URL}/api/challenges/temperature`, { headers })
        if (challengeRes.ok) {
          const challengeData = await challengeRes.json()
          setChallengeInfo(challengeData)
        }

        // Get participation
        const participationRes = await fetch(`${API_URL}/api/challenges/temperature/participation`, { headers })
        if (participationRes.ok) {
          const participationData = await participationRes.json()
          setParticipation(participationData)
        }

        // Get week progress
        const weekRes = await fetch(`${API_URL}/api/challenges/temperature/week-progress`, { headers })
        if (weekRes.ok) {
          const weekData = await weekRes.json()
          setWeekProgress(weekData.days || [])
        }

        // Get recent logs
        const logsRes = await fetch(`${API_URL}/api/challenges/temperature/logs?days=7`, { headers })
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          setRecentLogs(logsData)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Erreur lors du chargement des donnees")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  // Join challenge if not participating
  const handleJoinChallenge = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    setValidating(true)
    try {
      const response = await fetch(`${API_URL}/api/challenges/temperature/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        // Refresh data
        window.location.reload()
      } else {
        const data = await response.json()
        setError(data.detail || "Erreur lors de l'inscription")
      }
    } catch (err) {
      setError("Erreur lors de l'inscription au defi")
    } finally {
      setValidating(false)
    }
  }

  // Validate today
  const validateDay = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    setValidating(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch(`${API_URL}/api/challenges/temperature/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: currentTemp }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.validated) {
          setSuccessMessage(
            `Journee validee ! +${data.points_earned} points${data.bonus_points > 0 ? ` (dont ${data.bonus_points} bonus serie)` : ""}`
          )
        } else {
          setError("Temperature non conforme. Maintenez 19C pour valider.")
        }

        // Update participation
        setParticipation((prev) => ({
          ...prev,
          current_streak: data.current_streak,
          best_streak: data.best_streak,
          total_points: data.total_points,
        }))

        // Refresh week progress
        const weekRes = await fetch(`${API_URL}/api/challenges/temperature/week-progress`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (weekRes.ok) {
          const weekData = await weekRes.json()
          setWeekProgress(weekData.days || [])
        }

        // Refresh logs
        const logsRes = await fetch(`${API_URL}/api/challenges/temperature/logs?days=7`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          setRecentLogs(logsData)
        }
      } else {
        setError(data.detail || "Erreur lors de la validation")
      }
    } catch (err) {
      console.error("Error validating:", err)
      setError("Erreur lors de la validation")
    } finally {
      setValidating(false)
    }
  }

  const getAdvice = () => {
    if (currentTemp < 19) {
      return {
        text: "Temperature trop basse ! Augmentez le chauffage pour atteindre 19C.",
        color: theme === "dark" ? "text-blue-300" : "text-blue-700",
        bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50/50",
      }
    } else if (currentTemp > 19) {
      return {
        text: "Temperature trop elevee ! Reduisez le chauffage a 19C pour economiser.",
        color: theme === "dark" ? "text-red-300" : "text-red-700",
        bg: theme === "dark" ? "bg-red-500/10" : "bg-red-50/50",
      }
    } else {
      return {
        text: "Parfait ! Temperature ideale pour le confort et l'economie d'energie.",
        color: theme === "dark" ? "text-green-300" : "text-green-700",
        bg: theme === "dark" ? "bg-green-500/10" : "bg-green-50/50",
      }
    }
  }

  const advice = getAdvice()
  const validatedDays = weekProgress.filter((d) => d.validated).length
  const DAILY_POINTS = challengeInfo?.daily_points || 70
  const WEEKLY_BONUS = challengeInfo?.weekly_bonus || 500

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Chargement du defi...</p>
        </div>
      </div>
    )
  }

  // Not participating yet
  if (!participation) {
    return (
      <div
        className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`rounded-lg p-8 border text-center transition-colors duration-200 ${
              theme === "dark"
                ? "bg-gray-900/60 backdrop-blur-sm border-gray-800"
                : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}
          >
            <FiThermometer
              className={`w-16 h-16 mx-auto mb-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
            />
            <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Defi Temperature
            </h2>
            <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Maintenez votre chauffage a 19C pendant 7 jours consecutifs pour gagner des points et des bonus.
            </p>
            <button
              onClick={handleJoinChallenge}
              disabled={validating}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {validating ? "Inscription..." : "Rejoindre le defi"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Messages */}
        {error && (
          <div
            className={`mb-4 rounded-lg p-4 flex items-center gap-3 ${
              theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
            }`}
          >
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button className="ml-auto underline text-sm" onClick={() => setError("")}>
              Fermer
            </button>
          </div>
        )}

        {successMessage && (
          <div
            className={`mb-4 rounded-lg p-4 flex items-center gap-3 ${
              theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
            }`}
          >
            <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMessage}
            <button className="ml-auto underline text-sm" onClick={() => setSuccessMessage("")}>
              Fermer
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Temperature Control */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-lg p-6 border h-full flex flex-col justify-center transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-900/60 backdrop-blur-sm border-gray-800"
                  : "bg-white/80 backdrop-blur-sm border-gray-200"
              }`}
            >
              <div className="text-center mb-6">
                <div
                  className={`text-6xl font-bold mb-2 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {currentTemp}C
                </div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Temperature actuelle</p>
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
                    background:
                      currentTemp === 19
                        ? theme === "dark"
                          ? "#22c55e"
                          : "#16a34a"
                        : currentTemp < 19
                          ? theme === "dark"
                            ? "#3b82f6"
                            : "#2563eb"
                          : theme === "dark"
                            ? "#ef4444"
                            : "#dc2626",
                  }}
                />
                <div className="flex justify-between mt-2 text-xs">
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>16C</span>
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"} style={{ fontWeight: 600 }}>
                    19C
                  </span>
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>22C</span>
                </div>
              </div>

              {/* Advice Box */}
              <div
                className={`rounded-lg p-4 mb-6 border ${advice.bg} ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${advice.color} leading-relaxed`}>{advice.text}</p>
              </div>

              {/* Validate Button */}
              <button
                onClick={validateDay}
                disabled={currentTemp !== TARGET_TEMP || validating}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-150 ${
                  currentTemp === TARGET_TEMP
                    ? theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    : theme === "dark"
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                } disabled:opacity-50`}
              >
                {validating ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Validation...
                  </span>
                ) : currentTemp === TARGET_TEMP ? (
                  "Valider la journee"
                ) : (
                  "Ajustez a 19C pour valider"
                )}
              </button>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-lg p-6 border h-full transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-900/60 backdrop-blur-sm border-gray-800"
                  : "bg-white/80 backdrop-blur-sm border-gray-200"
              }`}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                  className={`rounded-lg p-4 text-center border ${
                    theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {validatedDays}/7
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Cette semaine</div>
                </div>
                <div
                  className={`rounded-lg p-4 text-center border ${
                    theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {participation.current_streak}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Serie en cours</div>
                </div>
                <div
                  className={`rounded-lg p-4 text-center border ${
                    theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {participation.total_points}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Points totaux</div>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="mb-6">
                <h3
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  <FiCalendar className="w-4 h-4" />
                  Progression de la semaine
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {weekProgress.length > 0 ? (
                    weekProgress.map((day, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 text-center transition-all duration-150 border ${
                          day.validated
                            ? theme === "dark"
                              ? "bg-green-500/10 border-green-600"
                              : "bg-green-50 border-green-400"
                            : day.value !== null
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
                          <FiCheckCircle
                            className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                          />
                        ) : day.value !== null ? (
                          <FiXCircle className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                        ) : (
                          <FiClock className={`w-5 h-5 mx-auto ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-7 text-center py-4">
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        Aucune donnee pour cette semaine
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  <FiTrendingDown className="w-4 h-4" />
                  Historique recent
                </h3>
                <div className="space-y-2">
                  {recentLogs.length === 0 ? (
                    <p className={`text-sm text-center py-4 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                      Aucune journee validee pour l'instant
                    </p>
                  ) : (
                    recentLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center rounded-lg px-4 py-3 border transition-colors duration-150 ${
                          theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {log.is_validated ? (
                            <FiCheckCircle
                              className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                            />
                          ) : (
                            <FiXCircle className={`w-4 h-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                          )}
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {new Date(log.log_date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              log.value_recorded === TARGET_TEMP
                                ? theme === "dark"
                                  ? "text-green-400"
                                  : "text-green-600"
                                : theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                            }`}
                          >
                            {log.value_recorded}C
                          </span>
                          <span
                            className={`text-xs font-semibold tabular-nums ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {log.points_earned} pts
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Points System */}
              <div
                className={`mt-6 rounded-lg p-4 border ${
                  theme === "dark" ? "bg-blue-500/5 border-blue-900/30" : "bg-blue-50/50 border-blue-200/50"
                }`}
              >
                <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-blue-300" : "text-blue-900"}`}>
                  Systeme de points
                </h4>
                <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-blue-300/70" : "text-blue-800/80"}`}>
                  <li>
                    Journee a 19C : <strong>{DAILY_POINTS} points</strong>
                  </li>
                  <li>
                    Serie de 7 jours : <strong>Bonus de {WEEKLY_BONUS} points</strong>
                  </li>
                  <li>
                    Maximum mensuel : <strong>{challengeInfo?.max_points_per_month || 500} points</strong>
                  </li>
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
