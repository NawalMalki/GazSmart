import { useTheme } from "../../context/ThemeContext"
import { FiBell } from "react-icons/fi"
import AlertCard from "./AlertCard"
import { alertsData } from "./alerts.data"

export default function AlertsList() {
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
        <FiBell className="w-5 h-5" />
        Alertes personnalisées
      </h3>

      <div className="space-y-3">
        {alertsData.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  )
}