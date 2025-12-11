import { FiTrendingUp, FiUsers, FiShoppingCart, FiBarChart } from "react-icons/fi"

const StatsCard = ({ title, value, percentage, icon, trend }) => {
  const icons = {
    revenue: <FiTrendingUp className="text-xl sm:text-2xl text-green-500" />,
    users: <FiUsers className="text-xl sm:text-2xl text-blue-500" />,
    orders: <FiShoppingCart className="text-xl sm:text-2xl text-orange-500" />,
    conversion: <FiBarChart className="text-xl sm:text-2xl text-purple-500" />,
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">{value}</p>
          <div className={`flex items-center mt-1 sm:mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            <span className="text-xs sm:text-sm font-medium">{percentage}</span>
            <span className="text-xs ml-1">from last month</span>
          </div>
        </div>
        <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0">{icons[icon]}</div>
      </div>
    </div>
  )
}

export default StatsCard
