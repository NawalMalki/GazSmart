import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa"

const TopThree = ({ top }) => {
  const { theme } = useTheme()

  return (
    <div className="mb-8">
      <h2 className={`text-base font-semibold mb-6 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
         Podium d'Excellence
      </h2>

      <div className="flex items-end justify-center gap-4 max-w-3xl mx-auto">
        {/* 2ème place - GAUCHE */}
        <div className="flex-1 max-w-[200px]">
          <div className={`rounded-t-lg p-4 border-t-4 transition-all transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-slate-800/40 border-slate-500' 
              : 'bg-gradient-to-b from-slate-50 to-slate-100 border-slate-400'
          }`}>
            <div className="text-center mb-2">
              <div className={`w-14 h-14 mx-auto rounded-full ${top[1].avatarColor} flex items-center justify-center text-white font-bold text-xl mb-2 ring-4 ${
                theme === 'dark' ? 'ring-slate-700' : 'ring-white'
              } shadow-lg`}>
                {top[1].name.charAt(0).toUpperCase()}
              </div>
              <FaMedal className="text-4xl mx-auto mb-1 text-slate-400" />
              <div className={`text-sm font-semibold mb-1 truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {top[1].name}
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {top[1].points}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                points
              </div>
            </div>
          </div>
          {/* Base du podium */}
          <div className={`h-20 rounded-b-lg flex items-center justify-center text-4xl font-bold ${
            theme === 'dark' 
              ? 'bg-slate-700/30 text-slate-500' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            2
          </div>
        </div>

        {/* 1ère place - CENTRE (PLUS HAUT) */}
        <div className="flex-1 max-w-[220px]">
          <div className={`rounded-t-lg p-5 border-t-4 transition-all transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-yellow-500/10 border-yellow-600 shadow-xl' 
              : 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-400 shadow-xl'
          }`}>
            <div className="text-center mb-2">
              <div className={`w-16 h-16 mx-auto rounded-full ${top[0].avatarColor} flex items-center justify-center text-white font-bold text-2xl mb-2 ring-4 ${
                theme === 'dark' ? 'ring-yellow-600' : 'ring-white'
              } shadow-xl`}>
                {top[0].name.charAt(0).toUpperCase()}
              </div>
              <FaTrophy className={`text-5xl mx-auto mb-1 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <div className={`text-sm font-bold mb-1 truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {top[0].name}
              </div>
              <div className={`text-2xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {top[0].points}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                points
              </div>
            </div>
          </div>
          {/* Base du podium - PLUS HAUTE */}
          <div className={`h-28 rounded-b-lg flex items-center justify-center text-5xl font-bold ${
            theme === 'dark' 
              ? 'bg-yellow-600/20 text-yellow-500' 
              : 'bg-yellow-300 text-yellow-700'
          }`}>
            1
          </div>
        </div>

        {/* 3ème place - DROITE */}
        <div className="flex-1 max-w-[200px]">
          <div className={`rounded-t-lg p-4 border-t-4 transition-all transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-orange-900/30 border-orange-600' 
              : 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-500'
          }`}>
            <div className="text-center mb-2">
              <div className={`w-14 h-14 mx-auto rounded-full ${top[2].avatarColor} flex items-center justify-center text-white font-bold text-xl mb-2 ring-4 ${
                theme === 'dark' ? 'ring-orange-700' : 'ring-white'
              } shadow-lg`}>
                {top[2].name.charAt(0).toUpperCase()}
              </div>
              <FaAward className="text-4xl mx-auto mb-1 text-orange-500" />
              <div className={`text-sm font-semibold mb-1 truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {top[2].name}
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-orange-300' : 'text-orange-600'
              }`}>
                {top[2].points}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                points
              </div>
            </div>
          </div>
          {/* Base du podium */}
          <div className={`h-16 rounded-b-lg flex items-center justify-center text-4xl font-bold ${
            theme === 'dark' 
              ? 'bg-orange-700/30 text-orange-500' 
              : 'bg-orange-200 text-orange-600'
          }`}>
            3
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopThree