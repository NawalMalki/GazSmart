"use client"

import { useState } from "react"
import { FiArrowLeft, FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiAward, FiTarget } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Admin User",
    email: "admin@gazsmart.com",
    phone: "+33 6 12 34 56 78",
    address: "Paris, France",
    joinDate: "2024-01-15",
    avatar: "A",
  })

  const [editData, setEditData] = useState(profileData)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profileData)
  }

  const handleSave = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 h-[75px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft className="text-gray-600 dark:text-gray-400 text-xl" />
            </button>
            <h1 className="text-2xl sm:text-2xl font-bold text-gray-600 dark:text-white">Mon Profil</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{profileData.avatar}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                  {profileData.fullName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administrateur</p>

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

            {/* Stats */}
            <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiAward className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Défis complétés</p>
                    <p className="font-semibold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiTarget className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Économies réalisées</p>
                    <p className="font-semibold text-gray-900 dark:text-white">€247.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h3>
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiMail className="text-lg" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiPhone className="text-lg" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiMapPin className="text-lg" />
                    Adresse
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.address}</p>
                  )}
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiCalendar className="text-lg" />
                    Date d'inscription
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(profileData.joinDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sécurité</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                  Modifier le mot de passe
                </button>
                <button className="w-full px-4 py-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                  Authentification à deux facteurs
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
