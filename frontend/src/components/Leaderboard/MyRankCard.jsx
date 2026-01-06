import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { FiTrendingUp } from "react-icons/fi"

const MyRankCard = ({ rank, fullName, points, trend, change, avatarColor }) => {
  const { theme } = useTheme()
  const progress = (points / 1000) * 100
  
  return (
    <div className={`sticky bottom-6 z-40 mt-6 rounded-lg p-5 border transition-colors ${
      theme === 'dark' 
        ? 'bg-green-900/30 border-green-800' 
        : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold mr-3 ring-2 ${
              theme === 'dark' ? 'ring-green-600' : 'ring-white'
            } shadow-md`}>
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>
                Votre position
              </p>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                #{rank} — {fullName}
              </h3>
            </div>
          </div>
          
          <div className="mb-3">
            <div className={`flex justify-between text-xs mb-1.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Progression vers le prochain rang</span>
              <span className="font-semibold tabular-nums">{points} / 1000 pts</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white/60'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  theme === 'dark' ? 'bg-green-500' : 'bg-green-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          
        </div>
        
        <div className="text-center">
          <div className={`rounded-lg p-3 border ${
            theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className={`text-2xl font-bold tabular-nums ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {points}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Points
            </div>
            <div className={`mt-2 text-xs font-semibold flex items-center justify-center gap-1 ${
              trend === "up" 
                ? theme === 'dark' ? "text-green-400" : "text-green-600"
                : theme === 'dark' ? "text-red-400" : "text-red-600"
            }`}>
              <FiTrendingUp className={`w-3 h-3 ${trend === "down" ? "rotate-180" : ""}`} />
              {change} cette semaine
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyRankCard