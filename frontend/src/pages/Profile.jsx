"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiMail, FiCalendar, FiAward, FiTarget, FiLoader, FiShield } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const Profile = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    joinDate: "",
    avatar: "",
    profilePicture: null,
    role: "user",
  })

  const [editData, setEditData] = useState(profileData)

  // Déterminer si c'est un admin
  const isAdmin = user?.role === "admin" || profileData.role === "admin"

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken")
        
        if (!token) {
          navigate("/login")
          return
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          const avatarLetter = userData.full_name?.charAt(0).toUpperCase() || "U"
          
          setProfileData({
            fullName: userData.full_name || "",
            email: userData.email || "",
            joinDate: userData.created_at || new Date().toISOString(),
            avatar: avatarLetter,
            profilePicture: userData.profile_picture || null,
            role: userData.role || "user",
          })
          setLoading(false)
        } else if (response.status === 401) {
          localStorage.removeItem("authToken")
          navigate("/login")
        } else {
          setError("Erreur lors du chargement du profil")
          setLoading(false)
        }
      } catch (err) {
        setError("Erreur de connexion au serveur")
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profileData)
  }

  const handleSave = async () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Chargement du profil...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className={`px-6 py-4 rounded-lg ${
            theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
          }`}>
            {error}
          </div>
          <button
            onClick={() => navigate(isAdmin ? "/adminspace" : "/dashboard")}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-950" : "bg-gray-50"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className="flex flex-col items-center">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.fullName}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                    isAdmin 
                      ? "bg-gradient-to-br from-red-500 to-orange-500" 
                      : "bg-gradient-to-br from-blue-500 to-green-500"
                  }`}>
                    <span className="text-4xl font-bold text-white">{profileData.avatar}</span>
                  </div>
                )}
                <h2 className={`text-xl font-semibold text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {profileData.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {isAdmin ? "Administrateur" : "Utilisateur"}
                  </p>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full flex items-center gap-1">
                      <FiShield className="text-xs" />
                      ADMIN
                    </span>
                  )}
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FiEdit2 className="text-lg" />
                    Modifier le profil
                  </button>
                )}
              </div>
            </div>

            {/* Stats - Seulement pour utilisateurs normaux */}
            {!isAdmin && (
              <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
                theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}>
                <h3 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Statistiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"}`}>
                      <FiAward className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm`}>Défis complétés</p>
                      <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-green-900/30" : "bg-green-100"}`}>
                      <FiTarget className={`${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                    </div>
                    <div>
                      <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm`}>Économies réalisées</p>
                      <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>€0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Informations personnelles
                </h3>
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className={`px-4 py-2 rounded-lg border transition-colors font-medium ${
                        theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                        theme === "dark" ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                      }`}
                    />
                  ) : (
                    <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{profileData.fullName}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    <FiMail className="text-lg" />
                    Email
                  </label>
                  <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{profileData.email}</p>
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs mt-1`}>
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    <FiCalendar className="text-lg" />
                    Date d'inscription
                  </label>
                  <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {new Date(profileData.joinDate).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>

                {isAdmin && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <FiShield className="text-lg" />
                      Rôle
                    </label>
                    <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Administrateur</p>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs mt-1`}>
                      Accès complet à la plateforme d'administration
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Sécurité
              </h3>
              <div className="space-y-3">
                <button className={`w-full px-4 py-3 text-left rounded-lg border transition-colors font-medium ${
                  theme === "dark" ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>
                  Modifier le mot de passe
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile