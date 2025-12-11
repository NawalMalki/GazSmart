"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { Alert } from "../components/Alert"
import logo from "../assets/logoo.jpeg"

function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const { signup, loginWithGoogle, loading, authError } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = {}

    if (!fullName.trim()) {
      errors.fullName = "Le nom complet est requis"
    }

    if (!email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email invalide"
    }

    if (!password) {
      errors.password = "Le mot de passe est requis"
    } else if (password.length < 6) {
      errors.password = "Minimum 6 caractères"
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) return

    const signupSuccess = await signup(email, password, fullName)
    if (signupSuccess) {
      setSuccess("Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.")
      // Attendre 3 secondes puis rediriger
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } else {
      setError(authError || "L'inscription a échoué. Cet email existe peut-être déjà.")
    }
  }

  const handleGoogleSignup = async (credentialResponse) => {
    setError("")
    const success = await loginWithGoogle(credentialResponse.credential)
    if (success) {
      navigate("/dashboard")
    } else {
      setError(authError || "L'inscription Google a échoué")
    }
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="w-full max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-center">
            {/* Left Section - Welcome Message */}
            <div className="hidden lg:block text-left space-y-6 pl-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <img src={logo || "/placeholder.svg"} alt="Challenge Sobriété" className="w-8 h-8 rounded-lg" />
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                    GazSmart
                  </span>
                </div>
                <h1 className="heading-premium text-5xl text-gray-900 leading-tight">Commencer dès maintenant</h1>
                <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded"></div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                Rejoignez des milliers d'utilisateurs qui optimisent leur consommation énergétique avec notre plateforme
                intuitive et performante.
              </p>

              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Suivi temps réel de votre énergie
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Rapports détaillés et analyses
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Conseils d'optimisation personnalisés
                </li>
              </ul>
            </div>

            {/* Right Section - Signup Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animation-slideIn">
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-8">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Challenge Sobriété"
                    className="w-12 h-12 mx-auto mb-4 rounded-lg"
                  />
                  <h2 className="heading-premium text-3xl text-gray-900">Créer un compte</h2>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                  <h2 className="heading-premium text-3xl text-gray-900">Créer un compte</h2>
                </div>

                {/* Success Alert */}
                {success && <Alert type="success" message={success} />}

                {/* Error Alert */}
                {(error || authError) && <Alert type="error" message={error || authError} />}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  {/* Full Name Field */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                    >
                      Nom complet
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                        validationErrors.fullName
                          ? "border-red-400 focus:ring-red-400/50"
                          : "border-gray-300 focus:ring-teal-400/50 focus:border-teal-400"
                      } text-gray-900 placeholder-gray-500`}
                      placeholder="Jean Dupont"
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.fullName}</p>
                    )}
                  </div>

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
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                    >
                      Mot de passe
                    </label>
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

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                    >
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                        validationErrors.confirmPassword
                          ? "border-red-400 focus:ring-red-400/50"
                          : "border-gray-300 focus:ring-teal-400/50 focus:border-teal-400"
                      } text-gray-900 placeholder-gray-500`}
                      placeholder="••••••••"
                    />
                    {validationErrors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 mt-8"
                  >
                    {loading ? "Création du compte..." : "Créer un compte"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-xs font-medium">ou</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Signup */}
                {googleClientId ? (
                  <div className="flex justify-center mb-6">
                    <GoogleLogin
                      onSuccess={handleGoogleSignup}
                      onError={() => setError("L'inscription Google a échouée")}
                      text="signup_with"
                    />
                  </div>
                ) : (
                  <Alert
                    type="warning"
                    message="Google signup non configuré. Ajoutez VITE_GOOGLE_CLIENT_ID à vos variables d'environnement."
                  />
                )}

                {/* Sign In Link */}
                <p className="text-center text-gray-600 text-sm">
                  Vous avez déjà un compte?{" "}
                  <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold transition">
                    Se connecter
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

export default Signup