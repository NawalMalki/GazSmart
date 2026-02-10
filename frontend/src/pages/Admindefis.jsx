import { useState } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiThermometer, FiDroplet, FiZap, FiUsers, FiTrendingUp } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { Link } from "react-router-dom"

const AdminDefis = () => {
  const { theme } = useTheme()
  
  // Mock data - normalement viendrait du back
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      slug: "temperature",
      title: "Défi Température",
      description: "Maintenez votre logement à 19°C pendant 7 jours consécutifs",
      status: "active",
      max_points: 500,
      participants: 247,
      energy_savings: "20 kWh/mois",
      created_at: "2024-01-15",
      icon: "thermometer"
    },
    {
      id: 2,
      slug: "chrono-douche",
      title: "Chrono Douche",
      description: "Réduisez votre temps de douche et économisez l'eau chaude",
      status: "active",
      max_points: 700,
      participants: 189,
      energy_savings: "26 kWh/mois",
      created_at: "2024-01-20",
      icon: "droplet"
    },
    {
      id: 3,
      slug: "cuisine-maligne",
      title: "Cuisine Maligne",
      description: "Adoptez des gestes pour réduire la consommation d'énergie en cuisine",
      status: "active",
      max_points: 1000,
      participants: 156,
      energy_savings: "20 kWh/mois",
      created_at: "2024-01-25",
      icon: "zap"
    },
    {
      id: 4,
      slug: "eco-lavage",
      title: "Éco-Lavage",
      description: "Optimisez vos cycles de lave-linge et lave-vaisselle",
      status: "draft",
      max_points: 600,
      participants: 0,
      energy_savings: "15 kWh/mois",
      created_at: "2024-02-01",
      icon: "zap"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [challengeToDelete, setChallengeToDelete] = useState(null)

  // Icones mapping
  const iconComponents = {
    thermometer: <FiThermometer className="w-5 h-5" />,
    droplet: <FiDroplet className="w-5 h-5" />,
    zap: <FiZap className="w-5 h-5" />
  }

  // Filtrage des défis
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistiques globales
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => c.status === "active").length,
    draft: challenges.filter(c => c.status === "draft").length,
    totalParticipants: challenges.reduce((sum, c) => sum + c.participants, 0)
  }

  const handleDelete = (challenge) => {
    setChallengeToDelete(challenge)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (challengeToDelete) {
      setChallenges(challenges.filter(c => c.id !== challengeToDelete.id))
      setShowDeleteModal(false)
      setChallengeToDelete(null)
    }
  }

  const toggleStatus = (id) => {
    setChallenges(challenges.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "active" ? "draft" : "active" }
        : c
    ))
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Gestion des Défis
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Créez et gérez les défis de sobriété énergétique
            </p>
          </div>
          <Link to="/adminspace/defis/nouveau">
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-150 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}>
              <FiPlus className="w-4 h-4" />
              Nouveau défi
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total défis
              </span>
              <FiTrendingUp className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Défis actifs
              </span>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.active}
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Brouillons
              </span>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.draft}
            </div>
          </div>

          <div className={`rounded-lg p-5 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Participants
              </span>
              <FiUsers className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.totalParticipants}
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className={`rounded-lg p-4 border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Rechercher un défi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Table */}
        <div className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Défi
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Statut
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Points max
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Participants
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Économies
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Créé le
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                {filteredChallenges.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Aucun défi trouvé
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredChallenges.map((challenge) => (
                    <tr key={challenge.id} className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {iconComponents[challenge.icon]}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {challenge.title}
                            </div>
                            <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {challenge.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(challenge.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            challenge.status === 'active'
                              ? theme === 'dark'
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                              : theme === 'dark'
                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            challenge.status === 'active'
                              ? theme === 'dark' ? 'bg-green-400' : 'bg-green-600'
                              : theme === 'dark' ? 'bg-gray-500' : 'bg-gray-500'
                          }`} />
                          {challenge.status === 'active' ? 'Actif' : 'Brouillon'}
                        </button>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {challenge.max_points} pts
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {challenge.participants}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {challenge.energy_savings}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(challenge.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/adminspace/defis/${challenge.id}`}>
                            <button className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                            }`}>
                              <FiEye className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link to={`/adminspace/defis/${challenge.id}/modifier`}>
                            <button className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-400 hover:text-yellow-400'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-yellow-600'
                            }`}>
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(challenge)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-400 hover:text-red-400'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
                            }`}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                Êtes-vous sûr de vouloir supprimer le défi "{challengeToDelete?.title}" ? 
                Cette action est irréversible et supprimera toutes les données associées.
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

export default AdminDefis