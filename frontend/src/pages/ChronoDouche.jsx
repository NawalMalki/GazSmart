import { useState, useEffect } from "react";
import { FiDroplet, FiPlay, FiRotateCcw, FiAward, FiTrendingDown } from "react-icons/fi";

const ChronoDouche = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedShowers, setCompletedShowers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const TARGET_SHOWERS = 10;

  const pointsThresholds = [
    { max: 300, points: 150, label: "Moins de 5 min", color: "text-green-600" },
    { max: 420, points: 100, label: "5-7 min", color: "text-blue-600" },
    { max: 600, points: 70, label: "7-10 min", color: "text-orange-600" },
    { max: Infinity, points: 40, label: "10+ min", color: "text-red-600" }
  ];

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const completeShower = () => {
    const threshold = pointsThresholds.find(t => time < t.max);
    const earnedPoints = threshold.points;
    
    setTotalPoints(totalPoints + earnedPoints);
    setCompletedShowers(completedShowers + 1);
    setIsRunning(false);
    setTime(0);
  };

  const getAverageTime = () => {
    if (completedShowers === 0) return "0.0";
    const totalTime = completedShowers * 5 * 60;
    return (totalTime / completedShowers / 60).toFixed(1);
  };

  const getCurrentThreshold = () => {
    return pointsThresholds.find(t => time < t.max);
  };

  const currentThreshold = getCurrentThreshold();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
            <FiDroplet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chrono Douche</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Douches courtes = 50% d'économie sur l'eau chaude
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Timer - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 shadow-md border border-cyan-200 dark:border-cyan-800 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono tracking-wider">
                  {formatTime(time)}
                </div>
                
                <div className="space-y-3">
                  {!isRunning ? (
                    <button
                      onClick={startTimer}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiPlay className="w-5 h-5" />
                      Démarrer
                    </button>
                  ) : (
                    <button
                      onClick={completeShower}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Terminer
                    </button>
                  )}
                  
                  {!isRunning && time > 0 && (
                    <button
                      onClick={resetTimer}
                      className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                      Réinitialiser
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

          {/* Right: All Other Info - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 h-full">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    {completedShowers}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Douches validées</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    {getAverageTime()} <span className="text-xl">min</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Temps moyen</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Objectif: {TARGET_SHOWERS} douches
                  </span>
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {completedShowers}/{TARGET_SHOWERS}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(completedShowers / TARGET_SHOWERS) * 100}%` }}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Points totaux</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {totalPoints}
                    </div>
                  </div>
                  <FiAward className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Point System */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiTrendingDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Système de points
                </h3>
                <div className="space-y-2">
                  {pointsThresholds.slice(0, -1).map((threshold, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{threshold.label}</span>
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