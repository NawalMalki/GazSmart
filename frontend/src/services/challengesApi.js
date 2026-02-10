/**
 * Service API pour les défis (challenges)
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

/**
 * Récupérer tous les défis disponibles
 */
export const getAllChallenges = async () => {
  const response = await fetch(`${API_URL}/api/challenges/`, {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des défis")
  }
  
  return response.json()
}

/**
 * Récupérer les participations de l'utilisateur
 */
export const getMyParticipations = async () => {
  const response = await fetch(`${API_URL}/api/challenges/my-participations`, {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des participations")
  }
  
  return response.json()
}

/**
 * Rejoindre un défi
 */
export const joinChallenge = async (challengeSlug) => {
  const response = await fetch(`${API_URL}/api/challenges/join/${challengeSlug}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Erreur lors de l'inscription au défi")
  }
  
  return response.json()
}

/**
 * Récupérer les détails de participation à un défi
 */
export const getParticipationDetails = async (challengeSlug) => {
  const response = await fetch(`${API_URL}/api/challenges/participation/${challengeSlug}`, {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des détails")
  }
  
  return response.json()
}

/**
 * Valider une journée pour le défi température
 */
export const validateTemperatureDay = async (challengeSlug, temperature) => {
  const response = await fetch(`${API_URL}/api/challenges/validate/${challengeSlug}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ value_recorded: temperature }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Erreur lors de la validation")
  }
  
  return response.json()
}

/**
 * Valider une douche pour le défi chrono-douche
 */
export const validateShower = async (challengeSlug, durationSeconds) => {
  const response = await fetch(`${API_URL}/api/challenges/validate-shower/${challengeSlug}?shower_duration_seconds=${durationSeconds}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Erreur lors de la validation")
  }
  
  return response.json()
}

/**
 * Valider une journée pour le défi cuisine maligne
 */
export const validateCuisine = async (challengeSlug, gesturesCompleted) => {
  const response = await fetch(`${API_URL}/api/challenges/validate-cuisine/${challengeSlug}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ gestures_completed: gesturesCompleted }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Erreur lors de la validation")
  }
  
  return response.json()
}

/**
 * Récupérer les statistiques globales de l'utilisateur
 */
export const getUserChallengeStats = async () => {
  const response = await fetch(`${API_URL}/api/challenges/stats`, {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des statistiques")
  }
  
  return response.json()
}

/**
 * Récupérer le classement
 */
export const getLeaderboard = async (limit = 10) => {
  const response = await fetch(`${API_URL}/api/challenges/leaderboard?limit=${limit}`, {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du classement")
  }
  
  return response.json()
}
