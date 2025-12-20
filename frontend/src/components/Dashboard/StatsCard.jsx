import { useTheme } from "../../context/ThemeContext"
import { FiTrendingUp, FiUsers, FiShoppingCart, FiBarChart } from "react-icons/fi"

const StatsCard = ({ title, value, percentage, icon, trend }) => {
  const { theme } = useTheme()

  const icons = {
    revenue: <FiTrendingUp className="text-xl sm:text-2xl text-green-500" />,
    users: <FiUsers className="text-xl sm:text-2xl text-blue-500" />,
    orders: <FiShoppingCart className="text-xl sm:text-2xl text-orange-500" />,
    conversion: <FiBarChart className="text-xl sm:text-2xl text-purple-500" />,
  }

  return (
    <div
      className={`rounded-lg shadow-sm border p-4 sm:p-6 transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
        }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="min-w-0 flex-1">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>
            {title}
          </p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl sm:text-2xl font-bold mt-1 sm:mt-2`}>
            {value}
          </p>
          <div className={`flex items-center mt-1 sm:mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            <span className="text-xs sm:text-sm font-medium">{percentage}</span>
            <span className="text-xs ml-1">depuis le mois dernier</span>
          </div>
        </div>
        <div
          className={`p-2 sm:p-3 rounded-lg flex-shrink-0 transition-colors duration-300
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          {icons[icon]}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
