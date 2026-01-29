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
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">

       

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
                      className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 ${
                        theme === "dark"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Terminer
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
                    {currentThreshold.label} • {currentThreshold.points} pts
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

              {/* Stats Grid - MÊME COULEUR */}
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
                    style={{ width: `${(completedShowers / TARGET_SHOWERS) * 100}%` }} 
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