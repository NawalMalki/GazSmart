const RecommendationsIA = () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
        Recommandations IA
      </h3>

      <div className="space-y-2 sm:space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
          >
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-sm mb-1">{recommendation.title}</h4>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">{recommendation.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsIA
