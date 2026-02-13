import { useState, useEffect } from "react"
import { FiClock, FiAward, FiTrendingDown, FiCheck, FiZap, FiAlertCircle } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { getParticipationDetails, validateCuisine, joinChallenge } from "../services/challengesApi"
import { useNavigate } from "react-router-dom"

const CuisineMaligne = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // État des gestes (checkboxes)
  const [gestures, setGestures] = useState([
    { id: 1, text: "Utiliser un couvercle sur les casseroles", economy: "25%", type: "cuisson", checked: false },
    { id: 2, text: "Éteindre la plaque 2-3 min avant la fin (chaleur résiduelle)", economy: "10%", type: "cuisson", checked: false },
    { id: 3, text: "Adapter la taille du feu/plaque à la casserole", economy: "15%", type: "cuisson", checked: false },
    { id: 4, text: "Cuisiner plusieurs plats en même temps", economy: "20%", type: "cuisson", checked: false },
    { id: 5, text: "Utiliser la cocotte-minute ou autocuiseur", economy: "30%", type: "cuisson", checked: false },
    { id: 6, text: "Dégivrer le réfrigérateur (si besoin)", economy: "30%", type: "frigo", checked: false },
    { id: 7, text: "Ne pas mettre de plats chauds au frigo", economy: "15%", type: "frigo", checked: false },
    { id: 8, text: "Utiliser les bons modes de cuisson (four ventilé, micro-ondes)", economy: "20%", type: "electrique", checked: false },
  ])

  const [participation, setParticipation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [alreadyValidatedToday, setAlreadyValidatedToday] = useState(false)

  const CHALLENGE_SLUG = "cuisine-maligne"
  const TOTAL_DAYS = 14

  // Points selon nombre de gestes
  const pointsThresholds = [
    { gestures: 2, points: 20, label: "1-2 gestes/jour" },
    { gestures: 4, points: 50, label: "3-4 gestes/jour" },
    { gestures: 6, points: 80, label: "5-6 gestes/jour" },
    { gestures: 8, points: 120, label: "7-8 gestes/jour" },
    { gestures: 10, points: 200, label: "Série de 7 jours" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        const data = await getParticipationDetails(CHALLENGE_SLUG)
        setParticipation(data.participation)
        
        // Si pas encore participant, joindre automatiquement
        if (!data.is_participating) {
          await joinChallenge(CHALLENGE_SLUG)
          const updatedData = await getParticipationDetails(CHALLENGE_SLUG)
          setParticipation(updatedData.participation)
        }
        
        // Vérifier si déjà validé aujourd'hui
        const today = new Date().toISOString().split('T')[0]
        const validatedToday = (data.weekly_logs || []).some(log => {
          const logDate = new Date(log.log_date).toISOString().split('T')[0]
          return logDate === today
        })
        setAlreadyValidatedToday(validatedToday)
        
      } catch (err) {
        console.error("Erreur:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  // Toggle checkbox
  const toggleGesture = (id) => {
    setGestures(prev => 
      prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g)
    )
  }

  // Compter les gestes cochés
  const checkedCount = gestures.filter(g => g.checked).length

  // Calculer les points pour la journée actuelle
  const getDailyPoints = () => {
    if (checkedCount === 0) return 0
    if (checkedCount <= 2) return 20
    if (checkedCount <= 4) return 50
    if (checkedCount <= 6) return 80
    return 120
  }

  // Valider la journée
  const validateDay = async () => {
    if (!user || validating || checkedCount === 0) return
    
    setValidating(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const result = await validateCuisine(CHALLENGE_SLUG, checkedCount)
      
      setSuccessMessage(
        `Journée validée! +${result.points_earned} points (${result.gestures_completed} gestes)${result.bonus_earned > 0 ? ` + Bonus ${result.bonus_earned} pts!` : ''}`
      )
      
      // Mettre à jour les stats localement
      setParticipation(prev => ({
        ...prev,
        total_points: result.total_points,
        total_days_validated: result.current_day,
        current_streak: result.current_streak
      }))
      
      setAlreadyValidatedToday(true)
      
      // Reset les checkboxes pour le lendemain
      setGestures(prev => prev.map(g => ({ ...g, checked: false })))
      
    } catch (err) {
      setError(err.message)
    } finally {
      setValidating(false)
    }
  }

  // Progression en pourcentage
  const currentDay = (participation?.total_days_validated || 0) + 1
  const daysCompleted = participation?.total_days_validated || 0
  const totalPoints = participation?.total_points || 0
  const progressPercentage = (currentDay / TOTAL_DAYS) * 100

  // Grouper les gestes par catégorie
  const gesturesByCategory = {
    cuisson: gestures.filter(g => g.type === "cuisson"),
    frigo: gestures.filter(g => g.type === "frigo"),
    electrique: gestures.filter(g => g.type === "electrique")
  }

  const CategorySection = ({ title, gestures, color }) => (
    <div className="mb-6">
      <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        <span className={color}><FiZap className="w-4 h-4" /></span>
        {title}
      </h4>
      <div className="space-y-2">
        {gestures.map((gesture) => (
          <div
            key={gesture.id}
            onClick={() => !alreadyValidatedToday && toggleGesture(gesture.id)}
            className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
              alreadyValidatedToday ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            } ${
              gesture.checked
                ? theme === "dark"
                  ? "bg-orange-900/20 border-orange-600"
                  : "bg-orange-50 border-orange-400"
                : theme === "dark"
                ? "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              gesture.checked
                ? theme === "dark"
                  ? "bg-orange-500 border-orange-500"
                  : "bg-orange-600 border-orange-600"
                : theme === "dark"
                ? "border-gray-500"
                : "border-gray-300"
            }`}>
              {gesture.checked && <FiCheck className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {gesture.text}
              </p>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Économie d'énergie: {gesture.economy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <FiAlertCircle className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Connexion requise
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Connectez-vous pour participer au défi cuisine maligne.
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
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
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

        {/* Main Card */}
        <div className={`rounded-xl p-6 shadow-lg border transition-colors ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          
          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Jour actuel
              </span>
              <span className={`text-lg font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                {currentDay}/{TOTAL_DAYS}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Progression
              </span>
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {daysCompleted}/{TOTAL_DAYS} jours
              </span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }} 
              />
            </div>
          </div>

            {/* Info Box */}
          <div className={`mb-6 rounded-lg p-4 border ${
            theme === "dark" ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
          }`}>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`}>
              <strong>Bon à savoir :</strong> Ces gestes fonctionnent que vous utilisiez le gaz, des plaques électriques, 
              ou l'induction. L'important est d'optimiser chaque usage d'énergie en cuisine!
            </p>
          </div>

          {/* Gestes Section - Par catégorie */}
          <div className="mb-6">
            <h3 className={`text-base font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {alreadyValidatedToday ? "Gestes validés aujourd'hui" : "Gestes d'aujourd'hui"}
            </h3>
            
            <CategorySection 
              title="Cuisson (Gaz & Électrique)"
              gestures={gesturesByCategory.cuisson}
              color="text-orange-500"
            />
            
            <CategorySection 
              title="Réfrigérateur & Conservation"
              gestures={gesturesByCategory.frigo}
              color="text-cyan-500"
            />
            
            <CategorySection 
              title="Électroménager & Modes de cuisson"
              gestures={gesturesByCategory.electrique}
              color="text-yellow-500"
            />
          </div>

        

          {/* Validate Button */}
          <button
            onClick={validateDay}
            disabled={checkedCount === 0 || validating || alreadyValidatedToday}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              checkedCount === 0 || alreadyValidatedToday
                ? theme === "dark"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
            } ${validating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {validating 
              ? "Validation..." 
              : alreadyValidatedToday 
                ? "Déjà validé aujourd'hui - Revenez demain!" 
                : `Valider la journée (${checkedCount} gestes = ${getDailyPoints()} pts)`
            }
          </button>

          {/* Points Section */}
          <div className="mt-6 space-y-4">
            <div className={`rounded-lg p-4 flex items-center justify-between transition-colors ${
              theme === "dark" ? "bg-green-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50"
            }`}>
              <div>
                <div className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Points gagnés
                </div>
                <div className={`text-3xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                  {totalPoints}
                </div>
              </div>
              <FiAward className={`w-10 h-10 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
            </div>

            {/* Points System */}
            <div>
              <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                <FiTrendingDown className={`w-4 h-4 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                Système de points
              </h3>
              <div className="space-y-2">
                {pointsThresholds.map((threshold, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center rounded-lg px-3 py-2 transition-colors ${
                      theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"
                    }`}
                  >
                    <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {threshold.label}
                    </span>
                    <span className={`text-xs font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                      {threshold.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CuisineMaligne
