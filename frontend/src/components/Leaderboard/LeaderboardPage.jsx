import React, { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import TopThree from "./TopThree"
import LeaderboardTable from "./LeaderboardTable"
import MyRankCard from "./MyRankCard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LeaderboardPage = () => {
  const { theme } = useTheme()
  const [timeFilter, setTimeFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchLeaderboard()
    }
  }, [timeFilter, currentUser])

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
      }
    } catch (err) {
      console.error("Erreur utilisateur:", err)
      setError("Erreur de chargement du profil")
    }
  }

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      
      const response = await fetch(
        `${API_URL}/api/challenges/leaderboard/full?period=${timeFilter}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      )

      if (!response.ok) throw new Error("Erreur chargement classement")
      
      const data = await response.json()
      setLeaderboardData(data.leaderboard)
    } catch (err) {
      console.error("Erreur leaderboard:", err)
      setError("Impossible de charger le classement")
    } finally {
      setLoading(false)
    }
  }

  const topThree = leaderboardData.slice(0, 3)
  
  // Trouver l'utilisateur connecté dans le classement
  const currentUserRank = leaderboardData.findIndex(u => u.email === currentUser?.email) + 1
  const currentUserData = leaderboardData.find(u => u.email === currentUser?.email)

  // Stats globales
  const totalParticipants = leaderboardData.length
  const averagePoints = totalParticipants > 0 
    ? Math.round(leaderboardData.reduce((acc, u) => acc + u.points, 0) / totalParticipants)
    : 0
  const topPoints = leaderboardData[0]?.points || 0

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Chargement du classement...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
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
              <h1 className={`text-2xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Classement des Éco-Guerriers
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Suivez votre progression parmi les habitants de votre quartier
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex rounded-lg p-1 border ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                {["all", "week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                {totalParticipants}
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
                {averagePoints}
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
                {topPoints} pts
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
                {currentUserData?.change || "0"}
              </div>
            </div>
          </div>
        </div>

        {/* Top Three Podium - Seulement si assez de participants */}
        {topThree.length >= 3 && <TopThree top={topThree} />}

        {/* Full Leaderboard */}
        {leaderboardData.length > 0 ? (
          <LeaderboardTable 
            data={leaderboardData} 
            currentUserEmail={currentUser?.email}
          />
        ) : (
          <div className={`text-center py-12 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Aucun participant pour le moment. Commencez un défi pour apparaître dans le classement !
            </p>
          </div>
        )}

        {/* Current User Card */}
        {currentUser && currentUserData && currentUserRank > 3 && (
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