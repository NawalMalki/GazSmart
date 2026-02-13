import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { FiThermometer, FiDroplet, FiZap, FiAward, FiUsers, FiEye, FiClock, FiShield, FiTarget, FiCheck } from "react-icons/fi"
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getAllChallenges, getMyParticipations, getUserChallengeStats, joinChallenge } from "../services/challengesApi"

const DefisDisponibles = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  
  const [challenges, setChallenges] = useState([])
  const [participations, setParticipations] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joiningChallenge, setJoiningChallenge] = useState(null)

  // Map des icones par slug
  const iconMap = {
    'temperature': <FiThermometer className="w-7 h-7" />,
    'chrono-douche': <FiDroplet className="w-7 h-7" />,
    'cuisine-maligne': <FiZap className="w-7 h-7" />,
  }

  // Map des paths par slug
  const pathMap = {
    'temperature': '/defi-temperature',
    'chrono-douche': '/chrono-douche',
    'cuisine-maligne': '/cuisine-maligne',
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Charger les défis
        const challengesData = await getAllChallenges()
        setChallenges(challengesData)
        
        // Si connecté, charger les participations et stats
        if (user) {
          const [participationsData, statsData] = await Promise.all([
            getMyParticipations(),
            getUserChallengeStats()
          ])
          setParticipations(participationsData)
          setUserStats(statsData)
        }
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const handleJoinChallenge = async (slug) => {
    if (!user) return
    
    setJoiningChallenge(slug)
    try {
      await joinChallenge(slug)
      // Recharger les participations
      const participationsData = await getMyParticipations()
      setParticipations(participationsData)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setJoiningChallenge(null)
    }
  }

  const isParticipating = (challengeSlug) => {
    return participations.some(p => p.challenge_slug === challengeSlug && p.is_active)
  }

  const getParticipationStats = (challengeSlug) => {
    return participations.find(p => p.challenge_slug === challengeSlug)
  }

  const badges = [
    { 
      icon: <FaAward className="text-5xl text-orange-500" />, 
      title: "Bronze", 
      points: "1 500 points", 
      conditions: "2 défis actifs - 1 mois après observation",
      reward: "Bon d'achat 15",
      description: "Engagement initial vérifié"
    },
    { 
      icon: <FaMedal className="text-5xl text-slate-400" />, 
      title: "Argent", 
      points: "3 000 points", 
      conditions: "3 défis actifs - Régularité 1 mois",
      reward: "Bon d'achat 30",
      description: "Sobriété installée"
    },
    { 
      icon: <FaTrophy className={`text-5xl ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />, 
      title: "Or", 
      points: "5 000 points", 
      conditions: "3 défis actifs - Régularité 2 mois",
      reward: "Bon d'achat 50",
      description: "Excellence énergétique"
    }
  ]

  if (loading) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* User Stats Banner */}
        {user && userStats && (
          <div className={`rounded-xl p-5 border transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-gray-800' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Bonjour, {user.full_name}!
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userStats.observation_days_remaining > 0 
                    ? `${userStats.observation_days_remaining} jours restants en phase d'observation`
                    : 'Phase d\'observation terminée - Badges disponibles!'
                  }
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userStats.total_points}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Points</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userStats.active_challenges}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Défis actifs</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userStats.badges.length}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Badges</div>
                </div>
              </div>
            </div>
          </div>
        )}


        
        {/* Hero Section */}
        <div className={`rounded-xl p-7 border transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-base max-w-3xl leading-relaxed mb-6`}>
            Ensemble, par le biais de la sobriété énergétique, réduisons la consommation d'énergie 
            dans nos bâtiments tout en gagnant des récompenses pour nos efforts collectifs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className={`rounded-lg p-5 border transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
            }`}>
              <h4 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                <FiAward className="w-4 h-4" />
                Comment ça marche ?
              </h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Relevez des défis pour accumuler des points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Suivez votre progression en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Débloquez des badges après la phase d'observation</span>
                </li>
              </ul>
            </div>

            <div className={`rounded-lg p-5 border transition-colors duration-200 ${
              theme === 'dark' ? 'bg-amber-500/5 border-amber-900/30' : 'bg-amber-50/50 border-amber-200/50'
            }`}>
              <h4 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${
                theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
              }`}>
                <FiEye className="w-4 h-4" />
                Phase d'observation (3 mois)
              </h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-amber-300/80' : 'text-amber-800/80'}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span><strong>Aucun badge</strong> débloquable pendant cette période</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Les points s'accumulent normalement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  <span>Après 3 mois : déblocage des récompenses</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={`flex flex-wrap items-center gap-5 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <FiTarget className="w-4 h-4" />
              <span className="font-medium">Jusqu'à 66 kWh/mois économisés</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4" />
              <span className="font-medium">Maturité énergétique récompensée</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              <span className="font-medium">Impact collectif mesuré</span>
            </div>
          </div>
        </div>

         <div className={`mt-6 rounded-lg p-5 border ${
            theme === 'dark' ? 'bg-blue-500/5 border-blue-900/30' : 'bg-blue-50/50 border-blue-200/50'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 text-sm ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
            }`}>
              <FiShield className="w-4 h-4" />
              Pourquoi une phase d'observation ?
            </h4>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-blue-300/70' : 'text-blue-800/80'}`}>
              Cette période de 3 mois permet de <strong>valider un changement de comportement durable</strong>, 
              pas simplement une participation ponctuelle. Elle garantit que les badges récompensent 
              une véritable maturité énergétique et un engagement authentique dans la sobriété.
            </p>
          </div>


        {/* Challenges Section */}
        <div>
          <h2 className={`text-lg font-semibold mb-5 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Relevez un défi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((challenge) => {
              const participating = isParticipating(challenge.slug)
              const stats = getParticipationStats(challenge.slug)
              
              return (
                <div
                  key={challenge.id}
                  className={`group rounded-lg p-5 border transition-all duration-200 hover:shadow-md ${
                    participating
                      ? theme === 'dark'
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-green-50 border-green-300'
                      : theme === 'dark' 
                        ? 'bg-gray-900/60 border-gray-800 hover:border-gray-700' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {participating && (
                    <div className={`mb-3 flex items-center gap-2 text-xs font-medium ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      <FiCheck className="w-4 h-4" />
                      Vous participez - {stats?.total_points || 0} pts
                    </div>
                  )}
                  
                  <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {iconMap[challenge.slug] || <FiZap className="w-7 h-7" />}
                  </div>
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base font-semibold mb-2`}>
                    {challenge.title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                    {challenge.description}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-xs mb-4 leading-relaxed`}>
                    {challenge.explanation}
                  </p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-semibold block`}>
                        {challenge.max_points_per_month} pts/mois max
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                        {challenge.energy_savings}
                      </span>
                    </div>
                  </div>
                  
                  {user ? (
                    participating ? (
                      <Link to={pathMap[challenge.slug] || '#'}>
                        <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          theme === 'dark'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}>
                          Continuer le défi
                        </button>
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleJoinChallenge(challenge.slug)}
                        disabled={joiningChallenge === challenge.slug}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        } ${joiningChallenge === challenge.slug ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {joiningChallenge === challenge.slug ? 'Inscription...' : 'Relever le défi'}
                      </button>
                    )
                  ) : (
                    <Link to="/login">
                      <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}>
                        Connectez-vous pour participer
                      </button>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges & Rewards Section */}
        <div className={`rounded-xl p-7 border transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <div className="text-center mb-7">
            <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-semibold mb-2`}>
              Système de badges & récompenses
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm max-w-3xl mx-auto mb-4`}>
              Les badges GazSmart ne récompensent pas un volume de points, mais un <strong>niveau de maturité énergétique</strong>. 
              Ils valorisent l'impact réel, la diversité des écogestes et la régularité dans le temps.
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
              theme === 'dark' ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100 text-amber-700'
            }`}>
              <FiClock className="w-3.5 h-3.5" />
              Déblocage après 3 mois d'observation
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 text-center border transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800/40 border-gray-700'
                    : 'bg-gray-50/80 border-gray-200'
                }`}
              >
                <div className="mb-3 flex justify-center">{badge.icon}</div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-2`}>
                  {badge.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-sm mb-2 font-semibold`}>
                  {badge.points}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-xs mb-3 leading-relaxed`}>
                  {badge.conditions}
                </p>
                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-1`}>
                    {badge.reward}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

         
        </div>

      </div>
    </div>
  )
}

export default DefisDisponibles
