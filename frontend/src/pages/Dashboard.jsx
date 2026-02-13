import { useTheme } from "../context/ThemeContext"
import StatsCard from "../components/Dashboard/StatsCard"
import ChartOne from "../components/Dashboard/ChartOne"
import SalesCategory from "../components/Dashboard/SalesCategory"
import UpcomingSchedule from "../components/Dashboard/UpcomingSchedule"
import RecommendationsIA from "../components/Dashboard/RecommendationsIA"

const Dashboard = () => {
  const { theme } = useTheme() // ← récupère le thème ici

  const salesData = [
    { label: "Chauffage", percent: 48, value: 2040, color: "#3B82F6" },
    { label: "Eau chaude sanitaire", percent: 33, value: 1402, color: "#60A5FA" },
    { label: "Cuisson", percent: 19, value: 510, color: "#93C5FD" },
  ]

  return (
    <div className={`p-4 sm:p-6 space-y-4 sm:space-y-6 w-full min-h-screen transition-colors duration-300
      ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Stats Grid - Fully responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <StatsCard title="Consommation Totale" value="93.9 kWh" percentage="+12.5%" icon="revenue" trend="up" />
        <StatsCard title="Classement immeuble" value="3" percentage="+8.2%" icon="users" trend="up" />
        <StatsCard title="Economie réalisée" value="6%" percentage="+2.1%" icon="orders" trend="up" />
      </div>

      {/* ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-2 h-auto lg:h-full min-h-[300px]">
          <ChartOne />
        </div>
        <div className="h-auto lg:h-full min-h-[300px]">
          <SalesCategory data={salesData} />
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 h-auto lg:h-full min-h-[250px]">
          <RecommendationsIA />
        </div>
        <div className="h-auto lg:h-full min-h-[250px]">
          <UpcomingSchedule />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
