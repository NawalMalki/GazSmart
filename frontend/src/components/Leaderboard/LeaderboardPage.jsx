import React, { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { leaderboardData } from "./leaderboardData"
import TopThree from "./TopThree"
import LeaderboardTable from "./LeaderboardTable"
import MyRankCard from "./MyRankCard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LeaderboardPage = () => {
  const { theme } = useTheme()
  const [timeFilter, setTimeFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
      } finally {
        setLoading(false)
      }
    };

    fetchCurrentUser();
  }, []);

  // REMPLACER l'utilisateur ID 4 par le vrai utilisateur connecté
  const updatedLeaderboardData = currentUser 
    ? leaderboardData.map(user => 
        user.id === 4 
          ? { ...user, name: currentUser.full_name, email: currentUser.email }
          : user
      )
    : leaderboardData;

  const topThree = updatedLeaderboardData.slice(0, 3)

  // L'utilisateur connecté est en position 4 (index 3)
  const currentUserRank = 4;
  const currentUserData = updatedLeaderboardData.find(u => u.id === 4);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Chargement...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen px-6 py-8 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className={`text-1xl font-semibold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Suivez votre progression parmi les habitants de votre quartier
              </h1>
              
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex rounded-lg p-1 border ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                {["all", "week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      timeFilter === filter 
                        ? theme === 'dark'
                          ? "bg-gray-800 text-white"
                          : "bg-gray-900 text-white"
                        : theme === 'dark'
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-900"
                    }`}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className={`rounded-lg p-4 border transition-colors ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Participants total
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {updatedLeaderboardData.length}
              </div>
            </div>
            <div className={`rounded-lg p-4 border transition-colors ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Points moyens
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round(updatedLeaderboardData.reduce((acc, user) => acc + user.points, 0) / updatedLeaderboardData.length)}
              </div>
            </div>
            <div className={`rounded-lg p-4 border transition-colors ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Top 1
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {updatedLeaderboardData[0].points} pts
              </div>
            </div>
            <div className={`rounded-lg p-4 border transition-colors ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Votre progression
              </div>
              <div className={`text-xl font-bold tabular-nums ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {currentUserData?.change || "+15"}
              </div>
            </div>
          </div>
        </div>

        {/* Top Three Podium */}
        <TopThree top={topThree} />

        {/* Full Leaderboard */}
        <LeaderboardTable 
          data={updatedLeaderboardData} 
          currentUserEmail={currentUser?.email}
        />

        {/* Current User Card - Sticky en bas */}
        {currentUser && currentUserData && (
          <MyRankCard 
            rank={currentUserRank}
            fullName={currentUser.full_name}
            points={currentUserData.points}
            trend={currentUserData.trend}
            change={currentUserData.change}
            avatarColor={currentUserData.avatarColor}
          />
        )}
      </div>
    </div>
  )
}

export default LeaderboardPage