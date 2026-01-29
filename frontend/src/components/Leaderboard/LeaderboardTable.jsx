import React from "react";
import { useTheme } from "../../context/ThemeContext"

const LeaderboardTable = ({ data, currentUserEmail }) => {
  const { theme } = useTheme()

  const getRankColor = (rank, isCurrentUser) => {
    if (isCurrentUser) {
      return theme === 'dark' 
        ? "bg-blue-900/40 border-l-4 border-blue-500" 
        : "bg-blue-50 border-l-4 border-blue-500";
    }
    
    if (rank === 1) {
      return theme === 'dark'
        ? "bg-yellow-900/20 border-l-4 border-yellow-600"
        : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500";
    }
    if (rank === 2) {
      return theme === 'dark'
        ? "bg-slate-800/20 border-l-4 border-slate-500"
        : "bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-400";
    }
    if (rank === 3) {
      return theme === 'dark'
        ? "bg-orange-900/20 border-l-4 border-orange-600"
        : "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500";
    }
    return "";
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden border transition-colors ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className={`px-6 py-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-900'
      }`}>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          🏆 Classement
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {data.length} participant{data.length > 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <tr>
              <th className={`px-6 py-3 text-left text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Rang</th>
              <th className={`px-6 py-3 text-left text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Habitant</th>
              <th className={`px-6 py-3 text-left text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Points</th>
              <th className={`px-6 py-3 text-left text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Évolution</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              const isCurrentUser = user.email === currentUserEmail;
              const rank = index + 1;
              
              return (
                <tr
                  key={user.id}
                  className={`
                    border-b last:border-0 transition-all duration-200
                    ${theme === 'dark' 
                      ? 'border-gray-800 hover:bg-gray-800/50' 
                      : 'border-gray-100 hover:bg-gray-50'
                    }
                    ${getRankColor(rank, isCurrentUser)}
                    ${isCurrentUser ? (theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100') : ''}
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`
                        font-semibold flex items-center gap-1
                        ${rank <= 3 ? "text-xl" : "text-base"}
                        ${rank === 1 ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : ""}
                        ${rank === 2 ? (theme === 'dark' ? 'text-slate-400' : 'text-slate-500') : ""}
                        ${rank === 3 ? (theme === 'dark' ? 'text-orange-400' : 'text-orange-600') : ""}
                        ${rank > 3 ? (theme === 'dark' ? 'text-gray-400' : 'text-gray-700') : ""}
                      `}>
                        {getRankBadge(rank)}
                        #{rank}
                      </span>
                      {isCurrentUser && (
                        <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                          Vous
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full ${user.avatarColor} 
                        flex items-center justify-center text-white font-semibold text-sm
                        shadow-md
                        ${isCurrentUser ? "ring-2 ring-blue-500" : ""}
                      `}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-medium ${
                          isCurrentUser 
                            ? 'text-blue-600 font-semibold' 
                            : (theme === 'dark' ? 'text-gray-200' : 'text-gray-800')
                        }`}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs text-blue-600">Votre profil</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-semibold ${
                        isCurrentUser 
                          ? 'text-blue-600 text-lg' 
                          : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                      }`}>
                        {user.points.toLocaleString('fr-FR')}
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>pts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center text-sm font-medium px-2 py-1 rounded
                      ${user.trend === "up" 
                        ? (theme === 'dark' ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-50')
                        : (theme === 'dark' ? 'text-red-400 bg-red-900/30' : 'text-red-700 bg-red-50')
                      }
                    `}>
                      {user.trend === "up" ? "↑" : "↓"} {user.change}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
            Aucun participant pour le moment
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;