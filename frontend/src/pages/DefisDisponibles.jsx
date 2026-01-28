import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { FiThermometer, FiDroplet, FiZap, FiAward, FiUsers, FiEye, FiClock, FiShield, FiTarget, FiCheck, FiLoader } from "react-icons/fi"
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const iconMap = {
  thermometer: <FiThermometer className="w-7 h-7" />,
  droplet: <FiDroplet className="w-7 h-7" />,
  zap: <FiZap className="w-7 h-7" />,
}

const pathMap = {
  temperature: "/defi-temperature",
  "chrono-douche": "/chrono-douche",
  "cuisine-maligne": "/cuisine-maligne",
}

const DefisDisponibles = () => {
  const { theme } = useTheme()
  const [challenges, setChallenges] = useState([])
  const [userParticipations, setUserParticipations] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joiningChallenge, setJoiningChallenge] = useState(null)
  const [error, setError] = useState("")

  // Fetch challenges from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        // Fetch all challenges
        const challengesRes = await fetch(`${API_URL}/api/challenges/`, { headers })
        if (challengesRes.ok) {
          const challengesData = await challengesRes.json()
          setChallenges(challengesData)
        }

        // Fetch user participations if logged in
        if (token) {
          const participationsRes = await fetch(`${API_URL}/api/challenges/user/participations`, { headers })
          if (participationsRes.ok) {
            const participationsData = await participationsRes.json()
            setUserParticipations(participationsData)
          }

          const statsRes = await fetch(`${API_URL}/api/challenges/user/stats`, { headers })
          if (statsRes.ok) {
            const statsData = await statsRes.json()
            setUserStats(statsData)
          }
        }
      } catch (err) {
        console.error("Error fetching challenges:", err)
        setError("Erreur lors du chargement des défis")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleJoinChallenge = async (slug) => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setError("Veuillez vous connecter pour rejoindre un défi")
      return
    }

    setJoiningChallenge(slug)
    try {
      const response = await fetch(`${API_URL}/api/challenges/${slug}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Refresh participations
        const participationsRes = await fetch(`${API_URL}/api/challenges/user/participations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (participationsRes.ok) {
          const participationsData = await participationsRes.json()
          setUserParticipations(participationsData)
        }
      } else {
        const data = await response.json()
        setError(data.detail || "Erreur lors de l'inscription au défi")
      }
    } catch (err) {
      console.error("Error joining challenge:", err)
      setError("Erreur lors de l'inscription au défi")
    } finally {
      setJoiningChallenge(null)
    }
  }

  const isParticipating = (slug) => {
    return userParticipations.some((p) => p.challenge_slug === slug)
  }

  const getParticipation = (slug) => {
    return userParticipations.find((p) => p.challenge_slug === slug)
  }

  const badges = [
    {
      icon: <FaAward className="text-5xl text-orange-500" />,
      title: "Bronze",
      points: "1 500 points",
      conditions: "2 defis actifs - 1 mois apres observation",
      reward: "Bon d'achat 15",
      description: "Engagement initial verifie",
      earned: userStats?.badges?.includes("bronze"),
    },
    {
      icon: <FaMedal className="text-5xl text-slate-400" />,
      title: "Argent",
      points: "3 000 points",
      conditions: "3 defis actifs - Regularite 1 mois",
      reward: "Bon d'achat 30",
      description: "Sobriete installee",
      earned: userStats?.badges?.includes("silver"),
    },
    {
      icon: <FaTrophy className={`text-5xl ${theme === "dark" ? "text-yellow-400" : "text-yellow-500"}`} />,
      title: "Or",
      points: "5 000 points",
      conditions: "3 defis actifs - Regularite 2 mois",
      reward: "Bon d'achat 50",
      description: "Excellence energetique",
      earned: userStats?.badges?.includes("gold"),
    },
  ]

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Chargement des defis...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Error Message */}
        {error && (
          <div
            className={`rounded-lg p-4 ${theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"}`}
          >
            {error}
            <button className="ml-4 underline" onClick={() => setError("")}>
              Fermer
            </button>
          </div>
        )}

        {/* User Stats Banner */}
        {userStats && (
          <div
            className={`rounded-xl p-5 border transition-colors duration-200 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-900/40 to-green-900/40 border-gray-800"
                : "bg-gradient-to-r from-blue-50 to-green-50 border-gray-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Votre progression
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Continuez vos efforts pour debloquer des recompenses
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {userStats.total_points}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Points totaux</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {userStats.active_challenges}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Defis actifs</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {userStats.best_streak}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Meilleure serie</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div
          className={`rounded-xl p-7 border transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-900/60 backdrop-blur-sm border-gray-800"
              : "bg-white/80 backdrop-blur-sm border-gray-200"
          }`}
        >
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-base max-w-3xl leading-relaxed mb-6`}
          >
            Ensemble, par le biais de la sobriete energetique, reduisons la consommation d'energie dans nos batiments
            tout en gagnant des recompenses pour nos efforts collectifs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div
              className={`rounded-lg p-5 border transition-colors duration-200 ${
                theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
              }`}
            >
              <h4
                className={`font-semibold mb-3 flex items-center gap-2 text-sm ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                <FiAward className="w-4 h-4" />
                Comment ca marche ?
              </h4>
              <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Relevez des defis pour accumuler des points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Suivez votre progression en temps reel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Debloquez des badges apres la phase d'observation</span>
                </li>
              </ul>
            </div>

            <div
              className={`rounded-lg p-5 border transition-colors duration-200 ${
                theme === "dark" ? "bg-amber-500/5 border-amber-900/30" : "bg-amber-50/50 border-amber-200/50"
              }`}
            >
              <h4
                className={`font-semibold mb-3 flex items-center gap-2 text-sm ${
                  theme === "dark" ? "text-amber-200" : "text-amber-900"
                }`}
              >
                <FiEye className="w-4 h-4" />
                Phase d'observation (3 mois)
              </h4>
              <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-amber-300/80" : "text-amber-800/80"}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>
                    <strong>Aucun badge</strong> deblocable pendant cette periode
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Les points s'accumulent normalement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Apres 3 mois : deblocage des recompenses</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center gap-5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            <div className="flex items-center gap-2">
              <FiTarget className="w-4 h-4" />
              <span className="font-medium">Jusqu'a 66 kWh/mois economises</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4" />
              <span className="font-medium">Maturite energetique recompensee</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              <span className="font-medium">Impact collectif mesure</span>
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div>
          <h2
            className={`text-lg font-semibold mb-5 flex items-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Relevez un defi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((challenge) => {
              const participating = isParticipating(challenge.slug)
              const participation = getParticipation(challenge.slug)

              return (
                <div
                  key={challenge.id}
                  className={`group rounded-lg p-5 border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-gray-900/60 border-gray-800 hover:border-gray-700"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } ${participating ? (theme === "dark" ? "ring-1 ring-green-500/30" : "ring-1 ring-green-500/20") : ""}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {iconMap[challenge.icon] || <FiAward className="w-7 h-7" />}
                    </div>
                    {participating && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          theme === "dark" ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
                        }`}
                      >
                        <FiCheck className="w-3 h-3" />
                        Inscrit
                      </span>
                    )}
                  </div>
                  <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-base font-semibold mb-2`}>
                    {challenge.title}
                  </h3>
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mb-3`}>
                    {challenge.description}
                  </p>
                  <p
                    className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs mb-4 leading-relaxed`}
                  >
                    {challenge.explanation}
                  </p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div>
                      <span
                        className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-sm font-semibold block`}
                      >
                        {challenge.max_points_per_month} pts/mois max
                      </span>
                      <span className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs`}>
                        {challenge.energy_savings}
                      </span>
                    </div>
                    {participation && (
                      <div className="text-right">
                        <span
                          className={`${theme === "dark" ? "text-green-400" : "text-green-600"} text-sm font-semibold block`}
                        >
                          {participation.total_points} pts
                        </span>
                        <span className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs`}>
                          Serie: {participation.current_streak}j
                        </span>
                      </div>
                    )}
                  </div>

                  {participating ? (
                    <Link to={pathMap[challenge.slug] || `/defi/${challenge.slug}`}>
                      <button
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          theme === "dark"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        Continuer le defi
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(challenge.slug)}
                      disabled={joiningChallenge === challenge.slug}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {joiningChallenge === challenge.slug ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Inscription...
                        </span>
                      ) : (
                        "Relever le defi"
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges & Rewards Section */}
        <div
          className={`rounded-xl p-7 border transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-900/60 backdrop-blur-sm border-gray-800"
              : "bg-white/80 backdrop-blur-sm border-gray-200"
          }`}
        >
          <div className="text-center mb-7">
            <h2 className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-2xl font-semibold mb-2`}>
              Systeme de badges et recompenses
            </h2>
            <p
              className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm max-w-3xl mx-auto mb-4`}
            >
              Les badges GazSmart ne recompensent pas un volume de points, mais un{" "}
              <strong>niveau de maturite energetique</strong>. Ils valorisent l'impact reel, la diversite des ecogestes
              et la regularite dans le temps.
            </p>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
                theme === "dark" ? "bg-amber-500/10 text-amber-300" : "bg-amber-100 text-amber-700"
              }`}
            >
              <FiClock className="w-3.5 h-3.5" />
              Deblocage apres 3 mois d'observation
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 text-center border transition-colors duration-200 ${
                  badge.earned
                    ? theme === "dark"
                      ? "bg-green-900/20 border-green-600"
                      : "bg-green-50 border-green-400"
                    : theme === "dark"
                      ? "bg-gray-800/40 border-gray-700"
                      : "bg-gray-50/80 border-gray-200"
                }`}
              >
                <div className="mb-3 flex justify-center relative">
                  {badge.icon}
                  {badge.earned && (
                    <div
                      className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        theme === "dark" ? "bg-green-500" : "bg-green-500"
                      }`}
                    >
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg font-semibold mb-2`}>
                  {badge.title}
                </h3>
                <p className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"} text-sm mb-2 font-semibold`}>
                  {badge.points}
                </p>
                <p
                  className={`${theme === "dark" ? "text-gray-500" : "text-gray-600"} text-xs mb-3 leading-relaxed`}
                >
                  {badge.conditions}
                </p>
                <div className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} text-sm font-semibold mb-1`}>
                    {badge.reward}
                  </p>
                  <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-6 rounded-lg p-5 border ${
              theme === "dark" ? "bg-blue-500/5 border-blue-900/30" : "bg-blue-50/50 border-blue-200/50"
            }`}
          >
            <h4
              className={`font-semibold mb-2 flex items-center gap-2 text-sm ${
                theme === "dark" ? "text-blue-300" : "text-blue-900"
              }`}
            >
              <FiShield className="w-4 h-4" />
              Pourquoi une phase d'observation ?
            </h4>
            <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-blue-300/70" : "text-blue-800/80"}`}>
              Cette periode de 3 mois permet de <strong>valider un changement de comportement durable</strong>, pas
              simplement une participation ponctuelle. Elle garantit que les badges recompensent une veritable maturite
              energetique et un engagement authentique dans la sobriete.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefisDisponibles
