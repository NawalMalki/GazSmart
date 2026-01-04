import { useTheme } from "../context/ThemeContext"
import { FiThermometer, FiDroplet, FiClock, FiAward, FiTrendingUp, FiUsers, FiEye, FiClock as FiCalendar, FiShield, FiTarget } from "react-icons/fi"
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
      points: "500 pts/mois max",
      energy: "~17 kWh/mois",
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
      points: "700 pts/mois max",
      energy: "~24 kWh/mois",
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
      points: "1000 pts/mois max",
      energy: "~25 kWh/mois",
      path: "/cuisine-maligne",
      bgColor: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
      iconColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      borderColor: theme === 'dark' ? 'border-orange-800' : 'border-orange-200'
    }
  ]

  const badges = [
    { 
      icon: "🥉", 
      title: "Bronze", 
      points: "1 500 points", 
      conditions: "2 défis actifs • 1 mois après observation",
      reward: "Bon d'achat 15€",
      description: "Engagement initial vérifié"
    },
    { 
      icon: "🥈", 
      title: "Argent", 
      points: "3 000 points", 
      conditions: "3 défis actifs • Régularité 1 mois",
      reward: "Bon d'achat 30€",
      description: "Sobriété installée"
    },
    { 
      icon: "🥇", 
      title: "Or", 
      points: "5 000 points", 
      conditions: "3 défis actifs • Régularité 2 mois",
      reward: "Bon d'achat 50€",
      description: "Excellence énergétique"
    }
  ]

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <FiAward className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} w-10 h-10`} />
            <h1 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-4xl font-bold`}>Défis disponibles</h1>
          </div>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base max-w-3xl leading-relaxed mb-6`}>
            Ensemble, par le biais de la sobriété énergétique, réduisons la consommation d'énergie 
            dans nos bâtiments tout en gagnant des récompenses pour nos efforts collectifs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  <span>Débloquez des badges après la phase d'observation</span>
                </li>
              </ul>
            </div>

            <div className={`rounded-lg p-5 border transition-colors duration-300
              ${theme === 'dark' ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-300'}`}
            >
              <h4 className={`font-bold mb-3 flex items-center gap-2 text-base ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'}`}>
                <FiEye className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} w-5 h-5`} />
                Phase d'observation (3 mois)
              </h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-amber-100' : 'text-amber-800'}`}>
                <li className="flex items-start gap-2">
                  <span className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} font-bold mt-0.5`}>•</span>
                  <span><strong>Aucun badge</strong> débloquable pendant cette période</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} font-bold mt-0.5`}>•</span>
                  <span>Les points s'accumulent normalement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} font-bold mt-0.5`}>•</span>
                  <span>Après 3 mois : déblocage des récompenses</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={`flex flex-wrap items-center gap-6 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <FiTarget className="w-5 h-5" />
              <span className="text-sm font-medium">Jusqu'à 66 kWh/mois économisés</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-5 h-5" />
              <span className="text-sm font-medium">Maturité énergétique récompensée</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5" />
              <span className="text-sm font-medium">Impact collectif mesuré</span>
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
                  <div>
                    <span className={`${challenge.iconColor} text-base font-bold block`}>
                      {challenge.points}
                    </span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                      {challenge.energy}
                    </span>
                  </div>
                </div>
                <Link to={challenge.path}>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${challenge.iconColor} border-2 ${challenge.borderColor} hover:bg-white dark:hover:bg-gray-800`}>
                    Relever le défi
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Rewards Section */}
        <div className={`rounded-2xl p-8 shadow-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="text-center mb-8">
            <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-3`}>
              Système de badges & récompenses
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm max-w-3xl mx-auto mb-4`}>
              Les badges GazSmart ne récompensent pas un volume de points, mais un <strong>niveau de maturité énergétique</strong>. 
              Ils valorisent l'impact réel, la diversité des écogestes et la régularité dans le temps.
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'
            }`}>
              <FiCalendar className="w-4 h-4" />
              Déblocage après 3 mois d'observation
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 text-center border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:border-green-500'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-green-500'
                  }`}
              >
                <div className="text-6xl mb-4">{badge.icon}</div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-2`}>
                  {badge.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-sm mb-2 font-bold`}>
                  {badge.points}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mb-3 leading-relaxed`}>
                  {badge.conditions}
                </p>
                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} text-base font-bold mb-1`}>
                    {badge.reward}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs italic`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 rounded-lg p-6 border-2 ${
            theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
          }`}>
            <h4 className={`font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              <FiShield className="w-5 h-5" />
              Pourquoi une phase d'observation ?
            </h4>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              Cette période de 3 mois permet de <strong>valider un changement de comportement durable</strong>, 
              pas simplement une participation ponctuelle. Elle garantit que les badges récompensent 
              une véritable maturité énergétique et un engagement authentique dans la sobriété.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DefisDisponibles