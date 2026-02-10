import { useState } from "react"
import { FiArrowLeft, FiEdit2, FiTrash2, FiUsers, FiTrendingUp, FiAward, FiCalendar, FiThermometer, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useNavigate, useParams, Link } from "react-router-dom"

const AdminDefiDetail = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - normalement depuis le back
  const challenge = {
    id: 1,
    slug: "temperature",
    title: "Défi Température",
    description: "Maintenez votre logement à 19°C pendant 7 jours consécutifs",
    explanation: "En réduisant la température de chauffage à 19°C, vous économisez jusqu'à 7% d'énergie par degré en moins.",
    status: "active",
    max_points: 500,
    energy_savings: "20 kWh/mois",
    created_at: "2024-01-15",
    icon: "thermometer",
    challenge_type: "weekly",
    participants: 247,
    total_validations: 1523,
    total_points_awarded: 89450,
    avg_completion_rate: 68,
    validation_rules: {
      target_value: 19,
      tolerance: 0,
      min_days: 7,
      daily_points: 70,
      weekly_bonus: 500
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock stats
  const stats = {
    activeParticipants: 247,
    completedChallenges: 156,
    avgDaysCompleted: 4.8,
    topUsers: [
      { id: 1, name: "Marie Dupont", points: 850, days: 12 },
      { id: 2, name: "Jean Martin", points: 780, points: 11 },
      { id: 3, name: "Sophie Bernard", points: 720, days: 10 },
      { id: 4, name: "Pierre Dubois", points: 690, days: 9 },
      { id: 5, name: "Claire Lefebvre", points: 650, days: 9 }
    ]
  }

  // Mock recent activity
  const recentActivity = [
    { id: 1, user: "Marie D.", action: "validated", value: "19°C", points: 70, date: "2024-02-07 14:30" },
    { id: 2, user: "Jean M.", action: "validated", value: "19°C", points: 70, date: "2024-02-07 13:15" },
    { id: 3, user: "Sophie B.", action: "failed", value: "20°C", points: 0, date: "2024-02-07 12:45" },
    { id: 4, user: "Pierre D.", action: "validated", value: "19°C", points: 70, date: "2024-02-07 11:20" },
    { id: 5, user: "Claire L.", action: "validated", value: "19°C", points: 140, date: "2024-02-07 10:00" },
    { id: 6, user: "Thomas R.", action: "failed", value: "21°C", points: 0, date: "2024-02-07 09:30" },
    { id: 7, user: "Emma W.", action: "validated", value: "19°C", points: 70, date: "2024-02-07 08:15" },
  ]

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    console.log("Suppression du défi", id)
    navigate("/adminspace/defis")
  }

  const toggleStatus = () => {
    console.log("Toggle status")
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate("/adminspace/defis")}
              className={`flex items-center gap-2 text-sm mb-3 ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              Retour à la liste
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <FiThermometer className="w-6 h-6" />
              </div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {challenge.title}
              </h1>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Créé le {new Date(challenge.created_at).toLocaleDateString('fr-FR')} • Slug: {challenge.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                challenge.status === 'active'
                  ? theme === 'dark'
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                challenge.status === 'active'
                  ? theme === 'dark' ? 'bg-green-400' : 'bg-green-600'
                  : theme === 'dark' ? 'bg-gray-500' : 'bg-gray-500'
              }`} />
              {challenge.status === 'active' ? 'Actif' : 'Brouillon'}
            </button>
            <Link to={`/adminspace/defis/${id}/modifier`}>
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <FiEdit2 className="w-4 h-4" />
              </button>
            </Link>
            <button 
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                  : 'bg-red-50 hover:bg-red-100 text-red-600'
              }`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informations du défi */}
        <div className={`rounded-lg p-6 border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Informations du défi
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Description
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {challenge.description}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Explication
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {challenge.explanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div>
              <h3 className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Points max/mois
              </h3>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {challenge.max_points}
              </p>
            </div>
            <div>
              <h3 className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Économies
              </h3>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {challenge.energy_savings}
              </p>
            </div>
            <div>
              <h3 className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Type
              </h3>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {challenge.challenge_type === 'weekly' ? 'Hebdo' : challenge.challenge_type === 'daily' ? 'Quotidien' : 'Mensuel'}
              </p>
            </div>
            <div>
              <h3 className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Température cible
              </h3>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {challenge.validation_rules.target_value}°C
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Participants
              </span>
              <FiUsers className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {challenge.participants}
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {stats.activeParticipants} actifs
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Validations
              </span>
              <FiCheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {challenge.total_validations}
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {stats.completedChallenges} complétés
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Points distribués
              </span>
              <FiAward className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {challenge.total_points_awarded.toLocaleString()}
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {Math.round(challenge.total_points_awarded / challenge.participants)} pts/user
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Taux de réussite
              </span>
              <FiTrendingUp className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {challenge.avg_completion_rate}%
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {stats.avgDaysCompleted} jours moy.
            </div>
          </div>
        </div>

        {/* Top participants & Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top participants */}
          <div className={`rounded-lg p-6 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiAward className="w-5 h-5" />
              Top 5 participants
            </h2>
            <div className="space-y-3">
              {stats.topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        : index === 1
                        ? theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-200 text-gray-700'
                        : index === 2
                        ? theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {user.days} jours validés
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {user.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className={`rounded-lg p-6 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiClock className="w-5 h-5" />
              Activité récente
            </h2>
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                    theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {activity.action === 'validated' ? (
                      <FiCheckCircle className={`w-4 h-4 flex-shrink-0 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                    ) : (
                      <FiXCircle className={`w-4 h-4 flex-shrink-0 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`} />
                    )}
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {activity.user} - {activity.value}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(activity.date).toLocaleString('fr-FR', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${
                    activity.points > 0
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {activity.points > 0 ? `+${activity.points}` : activity.points}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full rounded-xl p-6 border ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Confirmer la suppression
              </h3>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Êtes-vous sûr de vouloir supprimer le défi "{challenge.title}" ? 
                Cette action est irréversible et supprimera toutes les données de {challenge.participants} participants.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDefiDetail