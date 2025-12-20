import { useState, useEffect } from "react";
import { FiDroplet, FiPlay, FiRotateCcw, FiAward, FiTrendingDown } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext"

const ChronoDouche = () => {
  const { theme } = useTheme(); 
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedShowers, setCompletedShowers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const TARGET_SHOWERS = 10;

  const pointsThresholds = [
    { max: 300, points: 150, label: "Moins de 5 min", color: theme === "dark" ? "text-green-400" : "text-green-600" },
    { max: 420, points: 100, label: "5-7 min", color: theme === "dark" ? "text-blue-400" : "text-blue-600" },
    { max: 600, points: 70, label: "7-10 min", color: theme === "dark" ? "text-orange-400" : "text-orange-600" },
    { max: Infinity, points: 40, label: "10+ min", color: theme === "dark" ? "text-red-400" : "text-red-600" }
  ];

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

  const startTimer = () => setIsRunning(true);
  const resetTimer = () => { setIsRunning(false); setTime(0); };
  const completeShower = () => {
    const threshold = pointsThresholds.find(t => time < t.max);
    setTotalPoints(prev => prev + threshold.points);
    setCompletedShowers(prev => prev + 1);
    setIsRunning(false);
    setTime(0);
  };

  const getAverageTime = () => completedShowers === 0 ? "0.0" : ((completedShowers * 5 * 60) / completedShowers / 60).toFixed(1);
  const getCurrentThreshold = () => pointsThresholds.find(t => time < t.max);
  const currentThreshold = getCurrentThreshold();

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-cyan-900/30" : "bg-cyan-100"}`}>
            <FiDroplet className={`w-6 h-6 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Chrono Douche</h1>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Douches courtes = 50% d'économie sur l'eau chaude</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Timer */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 shadow-md border h-full flex flex-col justify-center transition-colors ${
              theme === "dark" 
                ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-800" 
                : "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
            }`}>
              <div className="text-center">
                <div className={`text-5xl sm:text-6xl font-bold mb-6 font-mono tracking-wider ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {formatTime(time)}
                </div>

                <div className="space-y-3">
                  {!isRunning ? (
                    <button
                      onClick={startTimer}
                      className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                          : "bg-cyan-600 hover:bg-cyan-700 text-white"
                      }`}
                    >
                      <FiPlay className="w-5 h-5" /> Démarrer
                    </button>
                  ) : (
                    <button
                      onClick={completeShower}
                      className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Terminer
                    </button>
                  )}

                  {!isRunning && time > 0 && (
                    <button
                      onClick={resetTimer}
                      className={`w-full px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      <FiRotateCcw className="w-4 h-4" /> Réinitialiser
                    </button>
                  )}
                </div>

                {isRunning && currentThreshold && (
                  <div className={`mt-4 text-xs font-semibold ${currentThreshold.color}`}>
                    {currentThreshold.label} • {currentThreshold.points} pts
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Points */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-6 shadow-md border h-full transition-colors ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`rounded-lg p-4 text-center ${theme === "dark" ? "bg-cyan-900/20" : "bg-gradient-to-br from-cyan-50 to-blue-50"}`}>
                  <div className={`text-3xl font-bold mb-1 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>{completedShowers}</div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Douches validées</div>
                </div>
                <div className={`rounded-lg p-4 text-center ${theme === "dark" ? "bg-cyan-900/20" : "bg-gradient-to-br from-cyan-50 to-blue-50"}`}>
                  <div className={`text-3xl font-bold mb-1 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
                    {getAverageTime()} <span className="text-xl">min</span>
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Temps moyen</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Objectif: {TARGET_SHOWERS} douches
                  </span>
                  <span className={`text-xs font-bold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
                    {completedShowers}/{TARGET_SHOWERS}
                  </span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500 rounded-full" style={{ width: `${(completedShowers / TARGET_SHOWERS) * 100}%` }} />
                </div>
              </div>

              {/* Points */}
              <div className={`rounded-lg p-4 mb-6 flex items-center justify-between transition-colors ${
                theme === "dark" ? "bg-green-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50"
              }`}>
                <div>
                  <div className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Points totaux</div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{totalPoints}</div>
                </div>
                <FiAward className={`w-10 h-10 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
              </div>

              {/* Point System */}
              <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  <FiTrendingDown className={`w-4 h-4 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                  Système de points
                </h3>
                <div className="space-y-2">
                  {pointsThresholds.slice(0, -1).map((threshold, index) => (
                    <div key={index} className={`flex justify-between items-center rounded-lg px-3 py-2 transition-colors ${theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"}`}>
                      <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{threshold.label}</span>
                      <span className={`text-xs font-bold ${threshold.color}`}>{threshold.points} pts</span>
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
