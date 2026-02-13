import { useState, useEffect } from "react"
import { FiSave, FiX, FiAlertCircle, FiThermometer, FiDroplet, FiZap, FiSun, FiWind } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useNavigate, useParams } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const AdminDefiForm = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { id } = useParams() // Pour l'édition
  const isEditing = !!id

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    explanation: "",
    max_points_per_month: "",
    energy_savings: "",
    icon: "thermometer",
    is_active: false,
    target_value: "",
    target_unit: "",
    daily_points: 100,
    weekly_bonus: 500
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingChallenge, setLoadingChallenge] = useState(false)

  const icons = [
    { value: "thermometer", label: "Thermomètre", icon: <FiThermometer className="w-5 h-5" /> },
    { value: "droplet", label: "Goutte", icon: <FiDroplet className="w-5 h-5" /> },
    { value: "zap", label: "Éclair", icon: <FiZap className="w-5 h-5" /> },
    { value: "sun", label: "Soleil", icon: <FiSun className="w-5 h-5" /> },
    { value: "wind", label: "Vent", icon: <FiWind className="w-5 h-5" /> }
  ]

  // Charger le défi si on est en mode édition
  useEffect(() => {
    if (isEditing) {
      fetchChallenge()
    }
  }, [id])

  const fetchChallenge = async () => {
    try {
      setLoadingChallenge(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/admin/challenges/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })

      if (response.status === 401 || response.status === 403) {
        navigate("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Défi non trouvé")
      }

      const challenge = await response.json()
      
      setFormData({
        slug: challenge.slug || "",
        title: challenge.title || "",
        description: challenge.description || "",
        explanation: challenge.explanation || "",
        max_points_per_month: challenge.max_points_per_month || "",
        energy_savings: challenge.energy_savings || "",
        icon: challenge.icon || "thermometer",
        is_active: challenge.is_active || false,
        target_value: challenge.target_value || "",
        target_unit: challenge.target_unit || "",
        daily_points: challenge.daily_points || 100,
        weekly_bonus: challenge.weekly_bonus || 500
      })
    } catch (err) {
      console.error("Error fetching challenge:", err)
      alert("Erreur lors du chargement du défi")
      navigate("/adminspace/defis")
    } finally {
      setLoadingChallenge(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est requis"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    }

    if (!formData.title.trim()) newErrors.title = "Le titre est requis"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.explanation.trim()) newErrors.explanation = "L'explication est requise"
    if (!formData.max_points_per_month || formData.max_points_per_month <= 0) {
      newErrors.max_points_per_month = "Les points maximum doivent être supérieurs à 0"
    }
    if (!formData.energy_savings.trim()) newErrors.energy_savings = "Les économies d'énergie sont requises"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        navigate("/login")
        return
      }

      const url = isEditing 
        ? `${API_URL}/api/admin/challenges/${id}`
        : `${API_URL}/api/admin/challenges/`

      const method = isEditing ? "PUT" : "POST"

      // Préparer les données (convertir les strings vides en null pour les champs optionnels)
      const payload = {
        ...formData,
        max_points_per_month: parseInt(formData.max_points_per_month),
        daily_points: parseInt(formData.daily_points),
        weekly_bonus: parseInt(formData.weekly_bonus),
        target_value: formData.target_value ? parseFloat(formData.target_value) : null,
        target_unit: formData.target_unit || null
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erreur lors de la sauvegarde")
      }

      // Rediriger vers la liste
      navigate("/adminspace/defis")
    } catch (err) {
      console.error("Error saving challenge:", err)
      alert(err.message || "Erreur lors de la sauvegarde du défi")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/adminspace/defis")
  }

  const selectedIcon = icons.find(i => i.value === formData.icon)

  if (loadingChallenge) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            theme === 'dark' ? 'border-white' : 'border-gray-900'
          }`}></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Chargement du défi...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className={`flex items-center gap-2 text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiX className="w-4 h-4" />
            Retour à la liste
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isEditing ? 'Modifier le défi' : 'Créer un nouveau défi'}
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {isEditing 
              ? 'Modifiez les paramètres de votre défi de sobriété énergétique'
              : 'Configurez un nouveau défi de sobriété énergétique pour vos utilisateurs'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informations de base */}
          <div className={`rounded-lg p-6 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Informations de base
            </h2>

            <div className="space-y-4">
              {/* Slug */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Slug (identifiant unique) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="ex: temperature, chrono-douche"
                  disabled={isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.slug
                      ? 'border-red-500 focus:border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.slug && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.slug}
                  </p>
                )}
                {!isEditing && (
                  <p className={`mt-1.5 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Utilisé dans les URLs. Lettres minuscules, chiffres et tirets uniquement.
                  </p>
                )}
                {isEditing && (
                  <p className={`mt-1.5 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Le slug ne peut pas être modifié après la création.
                  </p>
                )}
              </div>

              {/* Titre */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Titre du défi *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ex: Défi Température"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.title
                      ? 'border-red-500 focus:border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description courte *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="ex: Maintenez votre logement à 19°C pendant 7 jours consécutifs"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Explication */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Explication détaillée *
                </label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  rows="3"
                  placeholder="ex: En réduisant la température de chauffage à 19°C..."
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${
                    errors.explanation
                      ? 'border-red-500 focus:border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.explanation && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.explanation}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Icône */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Icône *
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  >
                    {icons.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                  <div className={`mt-2 flex items-center gap-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Aperçu: 
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedIcon?.icon}
                    </div>
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Statut *
                  </label>
                  <div className="flex items-center gap-3 h-11">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actif (visible par les utilisateurs)
                      </span>
                    </label>
                  </div>
                  <p className={`mt-1.5 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Les défis inactifs ne sont pas visibles par les utilisateurs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration du défi */}
          <div className={`rounded-lg p-6 border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Configuration du défi
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Points maximum */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Points maximum par mois *
                  </label>
                  <input
                    type="number"
                    name="max_points_per_month"
                    value={formData.max_points_per_month}
                    onChange={handleChange}
                    min="0"
                    step="10"
                    placeholder="ex: 500"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      errors.max_points_per_month
                        ? 'border-red-500 focus:border-red-500'
                        : theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.max_points_per_month && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.max_points_per_month}
                    </p>
                  )}
                </div>

                {/* Économies d'énergie */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Économies d'énergie estimées *
                  </label>
                  <input
                    type="text"
                    name="energy_savings"
                    value={formData.energy_savings}
                    onChange={handleChange}
                    placeholder="ex: 20 kWh/mois"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      errors.energy_savings
                        ? 'border-red-500 focus:border-red-500'
                        : theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.energy_savings && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.energy_savings}
                    </p>
                  )}
                </div>

                {/* Points quotidiens */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Points par validation quotidienne
                  </label>
                  <input
                    type="number"
                    name="daily_points"
                    value={formData.daily_points}
                    onChange={handleChange}
                    min="0"
                    step="10"
                    placeholder="ex: 100"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Bonus hebdomadaire */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Bonus pour 7 jours consécutifs
                  </label>
                  <input
                    type="number"
                    name="weekly_bonus"
                    value={formData.weekly_bonus}
                    onChange={handleChange}
                    min="0"
                    step="50"
                    placeholder="ex: 500"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <FiSave className="w-4 h-4" />
              {loading 
                ? 'Enregistrement...' 
                : isEditing ? 'Enregistrer les modifications' : 'Créer le défi'
              }
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Annuler
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default AdminDefiForm