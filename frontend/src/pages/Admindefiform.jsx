import { useState } from "react"
import { FiSave, FiX, FiAlertCircle, FiThermometer, FiDroplet, FiZap, FiSun, FiWind } from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import { useNavigate, useParams } from "react-router-dom"

const AdminDefiForm = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { id } = useParams() // Pour l'édition
  const isEditing = !!id

  // Mock data pour l'édition
  const existingChallenge = isEditing ? {
    slug: "temperature",
    title: "Défi Température",
    description: "Maintenez votre logement à 19°C pendant 7 jours consécutifs",
    explanation: "En réduisant la température de chauffage à 19°C, vous économisez jusqu'à 7% d'énergie par degré en moins.",
    max_points: 500,
    energy_savings: "20 kWh/mois",
    icon: "thermometer",
    status: "active",
    challenge_type: "weekly",
    validation_rules: {
      target_value: 19,
      tolerance: 0,
      min_days: 7
    }
  } : null

  const [formData, setFormData] = useState({
    slug: existingChallenge?.slug || "",
    title: existingChallenge?.title || "",
    description: existingChallenge?.description || "",
    explanation: existingChallenge?.explanation || "",
    max_points: existingChallenge?.max_points || "",
    energy_savings: existingChallenge?.energy_savings || "",
    icon: existingChallenge?.icon || "thermometer",
    status: existingChallenge?.status || "draft",
    challenge_type: existingChallenge?.challenge_type || "daily",
    validation_rules: existingChallenge?.validation_rules || {}
  })

  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  const icons = [
    { value: "thermometer", label: "Thermomètre", icon: <FiThermometer className="w-5 h-5" /> },
    { value: "droplet", label: "Goutte", icon: <FiDroplet className="w-5 h-5" /> },
    { value: "zap", label: "Éclair", icon: <FiZap className="w-5 h-5" /> },
    { value: "sun", label: "Soleil", icon: <FiSun className="w-5 h-5" /> },
    { value: "wind", label: "Vent", icon: <FiWind className="w-5 h-5" /> }
  ]

  const challengeTypes = [
    { value: "daily", label: "Quotidien - Validation jour par jour" },
    { value: "weekly", label: "Hebdomadaire - Validation par semaine" },
    { value: "monthly", label: "Mensuel - Validation par mois" },
    { value: "continuous", label: "Continu - Suivi permanent" }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (!formData.max_points || formData.max_points <= 0) {
      newErrors.max_points = "Les points maximum doivent être supérieurs à 0"
    }
    if (!formData.energy_savings.trim()) newErrors.energy_savings = "Les économies d'énergie sont requises"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Simuler la sauvegarde
    console.log("Sauvegarde du défi:", formData)
    
    // Rediriger vers la liste
    navigate("/adminspace/defis")
  }

  const handleCancel = () => {
    navigate("/adminspace/defis")
  }

  const selectedIcon = icons.find(i => i.value === formData.icon)

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
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.slug
                      ? 'border-red-500 focus:border-red-500'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.slug && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.slug}
                  </p>
                )}
                <p className={`mt-1.5 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Utilisé dans les URLs. Lettres minuscules, chiffres et tirets uniquement.
                </p>
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

              {/* Description courte */}
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
                  placeholder="Une description concise du défi (1-2 lignes)"
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

              {/* Explication détaillée */}
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
                  placeholder="Expliquez pourquoi ce défi est important et comment il aide à économiser l'énergie"
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

              {/* Grid pour les champs courts */}
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
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                  </select>
                  <p className={`mt-1.5 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Les défis en brouillon ne sont pas visibles par les utilisateurs
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
              {/* Type de défi */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type de défi *
                </label>
                <select
                  name="challenge_type"
                  value={formData.challenge_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                >
                  {challengeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

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
                    name="max_points"
                    value={formData.max_points}
                    onChange={handleChange}
                    min="0"
                    step="10"
                    placeholder="ex: 500"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      errors.max_points
                        ? 'border-red-500 focus:border-red-500'
                        : theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.max_points && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.max_points}
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
              </div>
            </div>
          </div>

        
          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FiSave className="w-4 h-4" />
              {isEditing ? 'Enregistrer les modifications' : 'Créer le défi'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
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