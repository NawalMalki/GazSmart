import { useTheme } from "../../context/ThemeContext"

export default function RecommendationCard({ item }) {
  const { theme } = useTheme()
  
  return (
    <div className={`p-4 rounded-lg transition-all duration-150 ${
      theme === 'dark' 
        ? 'bg-gray-800/40 hover:bg-gray-800/60' 
        : 'bg-white hover:bg-gray-50'
    }`}>
      <h4 className={`font-medium text-sm ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {item.title}
      </h4>
      <p className={`text-xs mt-1.5 leading-relaxed ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {item.description}
      </p>

      <div className={`mt-3 pt-3 border-t text-xs font-medium ${
        theme === 'dark' 
          ? 'border-gray-700 text-green-400' 
          : 'border-gray-200 text-green-600'
      }`}>
        Gain estimé : {item.gain}
      </div>
    </div>
  )
}