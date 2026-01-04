import { useState, useEffect } from "react"
import { FiClock, FiAward, FiTrendingDown, FiCheck } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"

const CuisineMaligne = () => {
  const { theme } = useTheme()
  
  // État des gestes (checkboxes)
  const [gestures, setGestures] = useState([
    { id: 1, text: "Utiliser un couvercle sur les casseroles", economy: "25%", checked: false },
    { id: 2, text: "Éteindre le gaz 2-3 min avant la fin", economy: "10%", checked: false },
    { id: 3, text: "Adapter la taille du feu à la casserole", economy: "15%", checked: false },
    { id: 4, text: "Cuisiner plusieurs plats en même temps", economy: "20%", checked: false },
    { id: 5, text: "Utiliser la cocotte-minute", economy: "30%", checked: false },
  ])

  const [currentDay, setCurrentDay] = useState(1)
  const [totalDays] = useState(14)
  const [totalPoints, setTotalPoints] = useState(0)
  const [daysCompleted, setDaysCompleted] = useState(0)

  // Points selon nombre de gestes
  const pointsThresholds = [
    { gestures: 2, points: 20, label: "1-2 gestes/jour" },
    { gestures: 4, points: 50, label: "3-4 gestes/jour" },
    { gestures: 5, points: 100, label: "5 gestes/jour" },
    { gestures: 7, points: 200, label: "Série de 7 jours" },
  ]

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
    return 100
  }

  // Valider la journée
  const validateDay = () => {
    const points = getDailyPoints()
    setTotalPoints(prev => prev + points)
    setDaysCompleted(prev => prev + 1)
    setCurrentDay(prev => prev + 1)
    
    // Reset les checkboxes pour le lendemain
    setGestures(prev => prev.map(g => ({ ...g, checked: false })))
  }

  // Progression en pourcentage
  const progressPercentage = (currentDay / totalDays) * 100

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-orange-900/30" : "bg-orange-100"}`}>
            <FiClock className={`w-6 h-6 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Cuisine Maligne</h1>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              5 gestes quotidiens pour économiser 20-30% de gaz en cuisine
            </p>
          </div>
        </div>

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
                {currentDay}/{totalDays}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Progression
              </span>
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {daysCompleted}/14 jours
              </span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>

          {/* Gestes Section */}
          <div className="mb-6">
            <h3 className={`text-base font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Gestes d'aujourd'hui
            </h3>
            <div className="space-y-3">
              {gestures.map((gesture) => (
                <div
                  key={gesture.id}
                  onClick={() => toggleGesture(gesture.id)}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
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
                      Économie: {gesture.economy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validate Button */}
          <button
            onClick={validateDay}
            disabled={checkedCount === 0 || currentDay > totalDays}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              checkedCount === 0 || currentDay > totalDays
                ? theme === "dark"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
            }`}
          >
            Valider la journée ({checkedCount} gestes)
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