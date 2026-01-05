// src/components/Leaderboard/LeaderboardTable.jsx
import React from "react";

const LeaderboardTable = ({ data, currentUserId }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-400";
    if (rank === 2) return "bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-100 to-amber-50 border-l-4 border-amber-600";
    return "border-l-4 border-transparent";
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
        <h2 className="text-xl font-bold text-white">Classement Complet</h2>
        <p className="text-gray-300 text-sm mt-1">
          {data.length} participants • Mis à jour aujourd'hui
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-6 text-left text-gray-600 font-semibold">Rang</th>
              <th className="p-6 text-left text-gray-600 font-semibold">Habitant</th>
              <th className="p-6 text-left text-gray-600 font-semibold">Points</th>
              <th className="p-6 text-left text-gray-600 font-semibold">Évolution</th>
              <th className="p-6 text-left text-gray-600 font-semibold">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              const isCurrentUser = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className={`
                    border-t border-gray-100
                    transition-all duration-300
                    hover:bg-gray-50
                    ${getRankColor(index + 1)}
                    ${isCurrentUser ? "bg-gradient-to-r from-emerald-50 to-teal-50" : ""}
                  `}
                >
                  <td className="p-6">
                    <div className="flex items-center">
                      <span className={`
                        font-bold text-lg
                        ${index < 3 ? "text-2xl" : "text-gray-700"}
                        ${index === 0 ? "text-yellow-500" : ""}
                        ${index === 1 ? "text-gray-500" : ""}
                        ${index === 2 ? "text-amber-700" : ""}
                      `}>
                        #{index + 1}
                      </span>
                      {isCurrentUser && (
                        <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                          Vous
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold mr-4`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">Participant actif</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-gray-800 text-lg">{user.points}</div>
                    <div className="text-sm text-gray-500">pts</div>
                  </td>
                  <td className="p-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {user.trend === "up" ? "↗" : "↘"} {user.change}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className={`w-24 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${user.trend === "up" ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
                          style={{ width: `${(user.points / 1000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {Math.round((user.points / 1000) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="text-center text-gray-500 text-sm">
          Classement mis à jour en temps réel • Prochaine mise à jour: 24h
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;