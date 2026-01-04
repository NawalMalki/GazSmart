import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)
  const navigate = useNavigate()

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token invalide, on le supprime
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error)
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
        }
      }
      setIsInitializing(false)
    }

    initAuth()
  }, [])

  const signup = async (email, password, fullName) => {
    setLoading(true)
    setAuthError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setAuthError(data.detail || "Erreur lors de l'inscription")
        setLoading(false)
        return { success: false } 
      }

      // Ne pas sauvegarder le token ni l'utilisateur après signup
      // L'utilisateur doit vérifier son email d'abord
      setLoading(false)
      return { success: true, user: data.user } 
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      setAuthError("Erreur de connexion au serveur")
      setLoading(false)
      return { success: false } 
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setAuthError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          setAuthError("Email non vérifié. Veuillez vérifier votre boîte de réception.")
        } else {
          setAuthError(data.detail || "Email ou mot de passe incorrect")
        }
        setLoading(false)
        return { success: false } 
      }

      // Sauvegarder le token et l'utilisateur
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      setLoading(false)
      return { success: true, user: data.user } 
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setAuthError("Erreur de connexion au serveur")
      setLoading(false)
      return { success: false } 
    }
  }

  const loginWithGoogle = async (credential) => {
    setLoading(true)
    setAuthError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setAuthError(data.detail || "Erreur lors de l'authentification Google")
        setLoading(false)
        return { success: false } 
      }

      // Sauvegarder le token et l'utilisateur
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      setLoading(false)
      return { success: true, user: data.user } 
    } catch (error) {
      console.error("Erreur d'authentification Google:", error)
      setAuthError("Erreur de connexion au serveur")
      setLoading(false)
      return { success: false } 
    }
  }

  const logout = async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }

    // Nettoyer le state et le localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    setLoading(false)
    navigate("/login")
  }

  const value = {
    user,
    loading,
    authError,
    isInitializing,
    signup,
    login,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}