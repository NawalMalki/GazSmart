import { useState, useEffect } from "react";
import { FiDroplet, FiPlay, FiRotateCcw, FiAward, FiTrendingDown, FiAlertCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { getParticipationDetails, validateShower, joinChallenge } from "../services/challengesApi"
import { useNavigate } from "react-router-dom"

const ChronoDouche = () => {
  const { theme } = useTheme(); 
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [participation, setParticipation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const CHALLENGE_SLUG = "chrono-douche";
  const TARGET_SHOWERS = 10;

  const pointsThresholds = [
    { max: 300, points: 150, label: "Moins de 5 min", color: theme === "dark" ? "text-green-400" : "text-green-600" },
    { max: 420, points: 100, label: "5-7 min", color: theme === "dark" ? "text-blue-400" : "text-blue-600" },
    { max: 600, points: 70, label: "7-10 min", color: theme === "dark" ? "text-orange-400" : "text-orange-600" },
    { max: Infinity, points: 40, label: "10+ min", color: theme === "dark" ? "text-red-400" : "text-red-600" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await getParticipationDetails(CHALLENGE_SLUG);
        setParticipation(data.participation);
        
        // Si pas encore participant, joindre automatiquement
        if (!data.is_participating) {
          await joinChallenge(CHALLENGE_SLUG);
          const updatedData = await getParticipationDetails(CHALLENGE_SLUG);
          setParticipation(updatedData.participation);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setError(null);
    setSuccessMessage(null);
    setIsRunning(true);
  };
  
  const resetTimer = () => { 
    setIsRunning(false); 
    setTime(0); 
  };
  
  const completeShower = async () => {
    if (!user || validating) return;
    
    setValidating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await validateShower(CHALLENGE_SLUG, time);
      
      setSuccessMessage(
        `Douche validée! +${result.points_earned} points (${result.duration_minutes} min)${result.bonus_earned > 0 ? ` + Bonus ${result.bonus_earned} pts!` : ''}`
      );
      
      // Mettre à jour les stats localement
      setParticipation(prev => ({
        ...prev,
        total_points: result.total_points,
        total_days_validated: result.total_showers
      }));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setValidating(false);
      setIsRunning(false);
      setTime(0);
    }
  };

  const getAverageTime = () => {
    if (!participation || participation.total_days_validated === 0) return "0.0";
    // Estimation basée sur le nombre de douches (5 min par défaut)
    return "5.0";
  };

  const getCurrentThreshold = () => pointsThresholds.find(t => time < t.max);
  const currentThreshold = getCurrentThreshold();

  const completedShowers = participation?.total_days_validated || 0;
  const totalPoints = participation?.total_points || 0;

  if (!user) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <FiAlertCircle className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Connexion requise
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Connectez-vous pour participer au défi chrono douche.
          </p>
          <button
            onClick={() => navigate('/login')}
            className={`px-6 py-2 rounded-lg font-medium ${
              theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Messages */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className={`mb-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-green-900/20 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {successMessage}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Timer */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg p-6 border h-full flex flex-col justify-center transition-colors duration-200 ${
              theme === "dark" 
                ? "bg-gray-900/60 backdrop-blur-sm border-gray-800" 
                : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}>
              <div className="text-center">
                <div className={`text-6xl font-bold mb-6 tabular-nums tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {formatTime(time)}
                </div>

                <div className="space-y-3">
                  {!isRunning ? (
                    <button
                      onClick={startTimer}
                      className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 ${
                        theme === "dark"
                          ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                          : "bg-cyan-600 hover:bg-cyan-700 text-white"
                      }`}
                    >
                      <FiPlay className="w-5 h-5" /> Démarrer
                    </button>
                  ) : (
                    <button
                      onClick={completeShower}
                      disabled={validating}
                      className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 ${
                        theme === "dark"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } ${validating ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {validating ? 'Enregistrement...' : 'Terminer'}
                    </button>
                  )}

                  {!isRunning && time > 0 && (
                    <button
                      onClick={resetTimer}
                      className={`w-full px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 border ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                      }`}
                    >
                      <FiRotateCcw className="w-4 h-4" /> Réinitialiser
                    </button>
                  )}
                </div>

                {isRunning && currentThreshold && (
                  <div className={`mt-4 text-xs font-medium ${currentThreshold.color}`}>
                    {currentThreshold.label} = {currentThreshold.points} pts
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Points */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg p-6 border h-full transition-colors duration-200 ${
              theme === "dark" ? "bg-gray-900/60 backdrop-blur-sm border-gray-800" : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`rounded-lg p-4 text-center border ${
                  theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                }`}>
                  <div className={`text-3xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {completedShowers}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Douches validées</div>
                </div>
                <div className={`rounded-lg p-4 text-center border ${
                  theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                }`}>
                  <div className={`text-3xl font-bold mb-1 tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {getAverageTime()} <span className="text-lg">min</span>
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Temps moyen</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Objectif: {TARGET_SHOWERS} douches
                  </span>
                  <span className={`text-xs font-semibold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {completedShowers}/{TARGET_SHOWERS}
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      theme === "dark" ? "bg-cyan-500" : "bg-cyan-600"
                    }`} 
                    style={{ width: `${Math.min((completedShowers / TARGET_SHOWERS) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              {/* Points */}
              <div className={`rounded-lg p-4 mb-6 flex items-center justify-between border ${
                theme === "dark" ? "bg-green-500/5 border-green-900/30" : "bg-green-50/50 border-green-200/50"
              }`}>
                <div>
                  <div className={`text-xs mb-1 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Points totaux</div>
                  <div className={`text-3xl font-bold tabular-nums ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    {totalPoints}
                  </div>
                </div>
                <FiAward className={`w-9 h-9 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
              </div>

              {/* Point System */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiTrendingDown className="w-4 h-4" />
                  Système de points
                </h3>
                <div className="space-y-2">
                  {pointsThresholds.slice(0, -1).map((threshold, index) => (
                    <div key={index} className={`flex justify-between items-center rounded-lg px-3 py-2 border transition-colors duration-150 ${
                      theme === "dark" ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/80 border-gray-200"
                    }`}>
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{threshold.label}</span>
                      <span className={`text-xs font-semibold tabular-nums ${threshold.color}`}>{threshold.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChronoDouche;
