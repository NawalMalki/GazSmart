import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Alert } from "../components/Alert"
import logo from "../assets/logoo.jpeg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [message, setMessage] = useState("")
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Token de vérification manquant")
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage("Votre email a été vérifié avec succès ! Redirection vers la page de connexion...")
          setTimeout(() => {
            navigate("/login")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.detail || "La vérification de l'email a échoué")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Erreur de connexion au serveur")
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logo || "/placeholder.svg"} alt="Challenge Sobriété" className="w-16 h-16 mx-auto mb-4 rounded-lg" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérification d'email</h1>
          </div>

          {/* Status Display */}
          {status === "verifying" && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Vérification en cours...</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <Alert type="success" message={message} />
              <div className="text-center mt-6">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Link
                  to="/login"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Se connecter maintenant
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div>
              <Alert type="error" message={message} />
              <div className="text-center mt-6">
                <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 mb-4">Le lien de vérification est peut-être expiré ou invalide.</p>
                <Link
                  to="/signup"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Créer un nouveau compte
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail