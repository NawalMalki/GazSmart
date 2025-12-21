"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { Alert } from "../components/Alert"
import logo from "../assets/logoo.jpeg"
import grdf_logo from "../assets/images/grdf_logo.png"
import cegibat_logo from "../assets/images/ceg.jpg"


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const { login, loginWithGoogle, loading, authError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setValidationErrors({})

    const errors = {}
    if (!email.trim()) errors.email = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email invalide"
    if (!password) errors.password = "Le mot de passe est requis"

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate("/dashboard")
    } else {
      setError(authError || "Identifiants incorrects. Veuillez réessayer.")
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    setError("")
    const success = await loginWithGoogle(credentialResponse.credential)
    if (success) {
      navigate("/dashboard")
    } else {
      setError(authError || "Connexion Google échouée")
    }
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="w-full max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Section - Welcome Message */}
            <div className="hidden lg:block text-left space-y-6 pl-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <img src={logo || "/placeholder.svg"} alt="Challenge Sobriété" className="w-8 h-8 rounded-lg" />
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                    GazSmart
                  </span>
                </div>
                <h1 className="heading-premium text-5xl text-gray-900 leading-tight">Bienvenue</h1>
                <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded"></div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                Votre plateforme de suivi d'économisation d'énergie. Connectez-vous pour commencer à monitorer votre
                consommation énergétique et réaliser des économies durables.
              </p>

              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition transform hover:scale-105">
                <span>En savoir plus</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Partner Logos */}
              <div className="pt-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  En partenariat avec
                </p>
                <div className="flex items-center gap-6">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <img 
                      src={grdf_logo || "/placeholder.svg"} 
                      alt="GRDF" 
                      className="h-6 w-auto object-contain grayscale hover:grayscale-0 transition"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <img 
                      src={cegibat_logo || "/placeholder.svg"} 
                      alt="CEGIBAT" 
                      className="h-6 w-auto object-contain grayscale hover:grayscale-0 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animation-slideIn">
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-8">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Challenge Sobriété"
                    className="w-12 h-12 mx-auto mb-4 rounded-lg"
                  />
                  <h2 className="heading-premium text-3xl text-gray-900">Se connecter</h2>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                  <h2 className="heading-premium text-3xl text-gray-900">Se connecter</h2>
                </div>

                {/* Error Alert */}
                {(error || authError) && <Alert type="error" message={error || authError} />}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                    >
                      Adresse email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                        validationErrors.email
                          ? "border-red-400 focus:ring-red-400/50"
                          : "border-gray-300 focus:ring-teal-400/50 focus:border-teal-400"
                      } text-gray-900 placeholder-gray-500`}
                      placeholder="vous@exemple.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        Mot de passe
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs font-medium text-teal-600 hover:text-teal-700 transition"
                      >
                        Mot de passe oublié?
                      </Link>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                        validationErrors.password
                          ? "border-red-400 focus:ring-red-400/50"
                          : "border-gray-300 focus:ring-teal-400/50 focus:border-teal-400"
                      } text-gray-900 placeholder-gray-500`}
                      placeholder="••••••••"
                    />
                    {validationErrors.password && (
                      <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.password}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 mt-8"
                  >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-xs font-medium">ou</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Login */}
                {googleClientId ? (
                  <div className="flex justify-center mb-6">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setError("Connexion Google échouée")}
                      text="signin_with"
                    />
                  </div>
                ) : (
                  <Alert
                    type="warning"
                    message="Google login non configuré. Ajoutez VITE_GOOGLE_CLIENT_ID à vos variables d'environnement."
                  />
                )}

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 text-sm">
                  Pas encore de compte?{" "}
                  <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold transition">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login