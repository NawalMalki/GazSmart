import { FiThermometer, FiDroplet, FiClock, FiAward, FiTrendingUp, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const DefisDisponibles = () => {
  const challenges = [
    {
      id: 1,
      icon: <FiThermometer className="w-8 h-8" />,
      title: "Défi température",
      description: "Maintenez 19°C pendant 7 jours",
      explanation: "Optimisez votre chauffage en ne l'activant que lorsque c'est vraiment nécessaire. Gardez une température constante de 19°C pour un confort optimal tout en réduisant votre consommation énergétique.",
      points: 500,
      path: "/defi-temperature",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: 2,
      icon: <FiDroplet className="w-8 h-8" />,
      title: "Chrono douche",
      description: "Réduisez votre temps de douche",
      explanation: "Minimisez le temps passé sous la douche au maximum. Chaque minute économisée représente des litres d'eau chaude en moins et une réduction significative de votre consommation d'énergie.",
      points: 1000,
      path: "/chrono-douche",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      borderColor: "border-cyan-200 dark:border-cyan-800"
    },
    {
      id: 3,
      icon: <FiClock className="w-8 h-8" />,
      title: "Cuisine maligne",
      description: "Checklist quotidienne d'économie",
      explanation: "Suivez une checklist quotidienne de bonnes pratiques en cuisine pour minimiser l'énergie consommée : couvercles sur les casseroles, utilisation optimale du four, extinction des plaques avant la fin de cuisson...",
      points: 2000,
      path: "/cuisine-maligne",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-800"
    }
  ];

  const rewards = [
    {
      icon: "🥉",
      title: "Bronze",
      points: "100-500 points",
      perks: "Bon d'achat 15€"
    },
    {
      icon: "🥈",
      title: "Argent",
      points: "500-900 points",
      perks: "Bon d'achat 30€"
    },
    {
      icon: "🥇",
      title: "Or",
      points: "900+ points",
      perks: "Bon d'achat 50€"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 rounded-2xl p-8 shadow-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <FiAward className="w-10 h-10 text-green-700 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-200">Défis disponibles</h1>
          </div>
          <p className="text-base text-green-800 dark:text-green-100 max-w-3xl leading-relaxed mb-6">
            Ensemble, par le biais de la sobriété énergétique, réduisons la consommation d'énergie 
            dans nos bâtiments tout en gagnant des récompenses pour nos efforts collectifs.
          </p>
          
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-5 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2 text-base">
              <FiAward className="text-green-600 dark:text-green-400 w-5 h-5" />
              Comment ça marche ?
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-100">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">•</span>
                <span>Relevez des défis pour accumuler des points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">•</span>
                <span>Suivez votre progression en temps réel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">•</span>
                <span>Échangez vos points contre des récompenses</span>
              </li>
              
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-green-700 dark:text-green-200">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Impact mesurable</span>
            </div>
            <div className="flex items-center gap-2">
              <FiAward className="w-5 h-5" />
              <span className="text-sm font-medium">Récompenses garanties</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5" />
              <span className="text-sm font-medium">Action collective</span>
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiAward className="text-green-600 dark:text-green-400" />
            Relevez un défi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`${challenge.bgColor} border-2 ${challenge.borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}
              >
                <div className={`${challenge.iconColor} mb-4`}>
                  {challenge.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
                  {challenge.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  {challenge.explanation}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xl font-bold ${challenge.iconColor}`}>
                    +{challenge.points} pts
                  </span>
                  
                </div>
                <Link to={challenge.path}>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${challenge.iconColor} border-2 ${challenge.borderColor} hover:bg-white dark:hover:bg-gray-800`}>
                    Relever
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards System Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Système de récompenses
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Accumulez des points en relevant des défis et déverrouillez des récompenses exclusives. 
              Plus vous participez, plus vous gagnez !
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 text-center border-2 border-gray-200 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="text-6xl mb-4">{reward.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                  {reward.points}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  {reward.perks}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DefisDisponibles;