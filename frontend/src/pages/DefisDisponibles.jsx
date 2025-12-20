import { useTheme } from "../context/ThemeContext"
import { FiThermometer, FiDroplet, FiClock, FiAward, FiTrendingUp, FiUsers } from "react-icons/fi"
import { Link } from "react-router-dom"

const DefisDisponibles = () => {
  const { theme } = useTheme()

  const challenges = [
    {
      id: 1,
      icon: <FiThermometer className="w-8 h-8" />,
      title: "Défi température",
      description: "Maintenez 19°C pendant 7 jours",
      explanation: "Optimisez votre chauffage en ne l'activant que lorsque c'est vraiment nécessaire. Gardez une température constante de 19°C pour un confort optimal tout en réduisant votre consommation énergétique.",
      points: 500,
      path: "/defi-temperature",
      bgColor: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      borderColor: theme === 'dark' ? 'border-blue-800' : 'border-blue-200'
    },
    {
      id: 2,
      icon: <FiDroplet className="w-8 h-8" />,
      title: "Chrono douche",
      description: "Réduisez votre temps de douche",
      explanation: "Minimisez le temps passé sous la douche au maximum. Chaque minute économisée représente des litres d'eau chaude en moins et une réduction significative de votre consommation d'énergie.",
      points: 1000,
      path: "/chrono-douche",
      bgColor: theme === 'dark' ? 'bg-cyan-900/20' : 'bg-cyan-50',
      iconColor: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      borderColor: theme === 'dark' ? 'border-cyan-800' : 'border-cyan-200'
    },
    {
      id: 3,
      icon: <FiClock className="w-8 h-8" />,
      title: "Cuisine maligne",
      description: "Checklist quotidienne d'économie",
      explanation: "Suivez une checklist quotidienne de bonnes pratiques en cuisine pour minimiser l'énergie consommée : couvercles sur les casseroles, utilisation optimale du four, extinction des plaques avant la fin de cuisson...",
      points: 2000,
      path: "/cuisine-maligne",
      bgColor: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
      iconColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      borderColor: theme === 'dark' ? 'border-orange-800' : 'border-orange-200'
    }
  ]

  const rewards = [
    { icon: "🥇", title: "Or", points: "900+ points", perks: "Bon d'achat 50€" },
    { icon: "🥈", title: "Argent", points: "500-900 points", perks: "Bon d'achat 30€" },
    { icon: "🥉", title: "Bronze", points: "100-500 points", perks: "Bon d'achat 15€" }
  ]

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 
          ${theme === 'dark' 
            ? 'bg-gradient-to-r from-green-900/40 via-emerald-900/40 to-teal-900/40 border-green-800'
            : 'bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-green-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <FiAward className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'} w-10 h-10`} />
            <h1 className={`${theme === 'dark' ? 'text-green-200' : 'text-green-800'} text-4xl font-bold`}>Défis disponibles</h1>
          </div>
          <p className={`${theme === 'dark' ? 'text-green-100' : 'text-green-800'} text-base max-w-3xl leading-relaxed mb-6`}>
            Ensemble, par le biais de la sobriété énergétique, réduisons la consommation d'énergie 
            dans nos bâtiments tout en gagnant des récompenses pour nos efforts collectifs.
          </p>

          <div className={`rounded-lg p-5 border transition-colors duration-300
            ${theme === 'dark' ? 'bg-gray-800/60 border-green-700' : 'bg-white/60 border-green-200'}`}
          >
            <h4 className={`font-bold mb-3 flex items-center gap-2 text-base ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
              <FiAward className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} w-5 h-5`} />
              Comment ça marche ?
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-green-100' : 'text-green-700'}`}>
              <li className="flex items-start gap-2">
                <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold mt-0.5`}>•</span>
                <span>Relevez des défis pour accumuler des points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold mt-0.5`}>•</span>
                <span>Suivez votre progression en temps réel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold mt-0.5`}>•</span>
                <span>Échangez vos points contre des récompenses</span>
              </li>
            </ul>
          </div>

          <div className={`mt-6 flex flex-wrap items-center gap-6 transition-colors duration-300 ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
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
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <FiAward className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            Relevez un défi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`${challenge.bgColor} border-2 ${challenge.borderColor} rounded-xl p-6 transition-colors duration-300`}
              >
                <div className={`${challenge.iconColor} mb-4`}>
                  {challenge.icon}
                </div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-2`}>
                  {challenge.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 font-medium`}>
                  {challenge.description}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-4 leading-relaxed`}>
                  {challenge.explanation}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${challenge.iconColor} text-xl font-bold`}>
                    +{challenge.points} pts
                  </span>
                </div>
                <Link to={challenge.path}>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${challenge.iconColor} border-2 ${challenge.borderColor} hover:bg-white dark:hover:bg-gray-800`}>
                    Relever
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div className={`rounded-2xl p-8 shadow-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="text-center mb-8">
            <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-3`}>Système de récompenses</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm max-w-2xl mx-auto`}>
              Accumulez des points en relevant des défis et déverrouillez des récompenses exclusives. Plus vous participez, plus vous gagnez !
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 text-center border-2 transition-colors duration-300
                  ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:border-green-500'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-green-500'
                  }`}
              >
                <div className="text-6xl mb-4">{reward.icon}</div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-2`}>
                  {reward.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 font-medium`}>
                  {reward.points}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold`}>
                  {reward.perks}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DefisDisponibles
