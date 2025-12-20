import { useTheme } from "../../context/ThemeContext"

const RecommendationsIA = () => {
  const { theme } = useTheme()

  const recommendations = [
    {
      title: "Baissez de 1°C",
      description: "Économie potentielle : 7% sur le chauffage",
    },
    {
      title: "Douches plus courtes",
      description: "Passez à 5 min pour économiser 15 kWh/mois",
    },
    {
      title: "Comparez-vous",
      description: "Vos voisins consomment 12% de moins",
    },
  ]

  return (
    <div
      className={`rounded-lg shadow-sm border p-4 sm:p-6 h-full transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
        }`}
    >
      <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Recommandations IA
      </h3>

      <div className="space-y-2 sm:space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-lg border transition-colors duration-300
              ${theme === 'dark'
                ? 'bg-blue-900/20 border-blue-800'
                : 'bg-blue-50 border-blue-100'
              }`}
          >
            <h4 className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
              {recommendation.title}
            </h4>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              {recommendation.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsIA
