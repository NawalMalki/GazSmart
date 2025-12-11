const UpcomingSchedule = () => {
  const events = [
    {
      date: "Wed, 11 Jan",
      time: "09:20 AM",
      title: "Business Analytics Press",
      description: "Exploring the Future of Data-Driven +6 more",
    },
    {
      date: "Fri, 15 Feb",
      time: "10:35 AM",
      title: "Business Sprint",
      description: "Techniques from Business Sprint +2 more",
    },
    {
      date: "Thu, 18 Mar",
      time: "01:15 AM",
      title: "Customer Review Meeting",
      description: "Insights from the Customer Review Meeting +8 more",
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Schedule</h3>

      <div className="space-y-2 sm:space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <input type="checkbox" className="mt-1 rounded border-gray-300 dark:border-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white truncate">
                  {event.date}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{event.time}</span>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{event.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingSchedule
