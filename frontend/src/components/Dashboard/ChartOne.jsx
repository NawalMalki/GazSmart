const EstimatedRevenue = () => {
  const monthlyData = [
    { month: "Jan", value: 80 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 90 },
    { month: "Apr", value: 150 },
    { month: "May", value: 180 },
    { month: "Jun", value: 200 },
    { month: "Jul", value: 170 },
    { month: "Aug", value: 190 },
    { month: "Sep", value: 220 },
    { month: "Oct", value: 180 },
    { month: "Nov", value: 160 },
    { month: "Dec", value: 140 },
  ]

  const maxValue = 250

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Estimated Revenue</h3>
        <div className="flex gap-2 flex-wrap">
          <button className="px-2 sm:px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            Monthly
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            Quarterly
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            Annually
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">Target you've set for each month</p>

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-800">
          <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">$212,142.12</p>
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">+23.2%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Yearly Profit</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4 border border-red-100 dark:border-red-800">
          <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">$30,321.23</p>
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">-12.3%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Yearly Profit</p>
        </div>
      </div>

      {/* Chart - Responsive */}
      <div className="relative h-32 sm:h-40 overflow-x-auto">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>250</span>
          <span className="hidden sm:inline">200</span>
          <span>150</span>
          <span className="hidden sm:inline">100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="absolute left-6 sm:left-8 right-0 top-0 bottom-0 flex items-end justify-between px-1 sm:px-2">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 min-w-0">
              <div
                className="w-1.5 sm:w-2 bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 dark:hover:from-blue-700 hover:to-blue-400"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EstimatedRevenue
