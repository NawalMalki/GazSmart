// src/components/Leaderboard/TopThree.jsx
import React from "react";

const TopThree = ({ top }) => {
  const medals = ["🥇", "🥈", "🥉"];
  const heights = ["h-64", "h-56", "h-48"]; // Different heights for visual hierarchy

  return (
    <div className="relative mb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl -z-10"></div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-2 rounded-xl mr-3">
          🏆
        </span>
        Podium d'Excellence
      </h2>

      <div className="flex items-end justify-center gap-4 md:gap-8 px-4">
        {top.map((user, index) => (
          <div
            key={user.id}
            className={`
              relative
              rounded-2xl
              p-6
              w-full max-w-xs
              ${heights[index]}
              ${user.avatarColor}
              text-white
              shadow-xl
              transform hover:-translate-y-2
              transition-all duration-300
              ${index === 1 ? "order-first" : ""}
              ${index === 0 ? "order-2 z-10" : ""}
              ${index === 2 ? "order-last" : ""}
            `}
          >
            {/* Medal */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-5xl animate-bounce">{medals[index]}</div>
            </div>
            
            {/* Crown for first place */}
            {index === 0 && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">
                👑
              </div>
            )}
            
            {/* Content */}
            <div className="flex flex-col h-full justify-end">
              <div className="mb-4">
                <div className="text-4xl font-bold mb-2">{user.points}</div>
                <div className="text-sm opacity-90">points</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Rang #{index + 1}</span>
                  <span className={`text-sm font-semibold ${user.trend === "up" ? "text-green-200" : "text-red-200"}`}>
                    {user.trend === "up" ? "↗" : "↘"} {user.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopThree;