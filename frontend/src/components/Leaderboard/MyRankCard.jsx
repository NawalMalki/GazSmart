// src/components/Leaderboard/MyRankCard.jsx
import React from "react";

const MyRankCard = ({ user }) => {
  const progress = (user.points / 1000) * 100;
  
  return (
    <div className="
      sticky bottom-6
      bg-gradient-to-r from-emerald-500 to-teal-600
      text-white
      rounded-3xl
      p-6
      shadow-2xl
      mt-10
      transform hover:-translate-y-1
      transition-all duration-300
      border border-emerald-400
      backdrop-blur-sm bg-opacity-95
      z-50
    ">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={`w-12 h-12 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold text-xl mr-4`}>
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Votre position</p>
              <h3 className="text-2xl font-bold mt-1">
                #{user.rank} — {user.name}
              </h3>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression vers le prochain rang</span>
              <span className="font-semibold">{user.points} / 1000 pts</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm opacity-90">
            <span className="font-semibold">💡 Conseil:</span> Complétez 3 défis aujourd'hui pour gagner +50 pts
          </p>
        </div>
        
        <div className="ml-6 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{user.points}</div>
            <div className="text-sm opacity-90">Points</div>
            <div className={`mt-2 text-sm font-semibold ${user.trend === "up" ? "text-green-200" : "text-red-200"}`}>
              {user.trend === "up" ? "↗" : "↘"} {user.change} cette semaine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRankCard;