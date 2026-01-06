import { useTheme } from "../../context/ThemeContext"
import RecommendationCard from "./RecommendationCard"
import { recommendationsData } from "./recommendations.data"
import { FiZap } from "react-icons/fi"

export default function RecommendationsList() {
  const { theme } = useTheme()
  
  return (
    <section className={`p-5 rounded-lg transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900/40' 
        : 'bg-gray-50/60'
    }`}>
      <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <FiZap className="w-4 h-4" />
        Recommandations IA
      </h3>

      <div className="grid md:grid-cols-2 gap-3">
        {recommendationsData.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}