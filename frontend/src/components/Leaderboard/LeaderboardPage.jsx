// src/components/Leaderboard/LeaderboardPage.jsx
import React, { useState } from "react";
import { leaderboardData, currentUser } from "./leaderboardData";
import TopThree from "./TopThree";
import LeaderboardTable from "./LeaderboardTable";
import MyRankCard from "./MyRankCard";

const LeaderboardPage = () => {
  const topThree = leaderboardData.slice(0, 3);
  const [timeFilter, setTimeFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                🏆 Classement Communautaire
              </h1>
              <p className="text-gray-600 text-lg">
                Suivez votre progression parmi les habitants de votre quartier
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="inline-flex rounded-xl bg-white p-1 shadow-sm border border-gray-200">
                {["all", "week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${timeFilter === filter 
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-md" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {filter === "all" && "Tous les temps"}
                    {filter === "week" && "Cette semaine"}
                    {filter === "month" && "Ce mois"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Participants total</div>
              <div className="text-2xl font-bold text-gray-900">{leaderboardData.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Points moyens</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(leaderboardData.reduce((acc, user) => acc + user.points, 0) / leaderboardData.length)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Top 1</div>
              <div className="text-2xl font-bold text-yellow-500">{leaderboardData[0].points} pts</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Votre progression</div>
              <div className="text-2xl font-bold text-emerald-500">
                {currentUser.trend === "up" ? "+" : ""}{currentUser.change}
              </div>
            </div>
          </div>
        </div>

        {/* Top Three Podium */}
        <TopThree top={topThree} />

        {/* Full Leaderboard */}
        <LeaderboardTable data={leaderboardData} currentUserId={currentUser.id} />

        {/* Current User Card */}
        <MyRankCard user={currentUser} />

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-200">
          <p>© 2025 GusSmart. Tous droits réservés.</p>
          <p className="mt-1">Le classement est mis à jour quotidiennement à 00:00</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;