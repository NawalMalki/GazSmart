import {
  FiHome,
  FiPieChart,
  FiAward,
  FiUsers,
  FiCalendar,
  FiDroplet,
  FiClock,
  FiAlertTriangle,
  FiTrendingDown,
  FiBarChart2,
} from "react-icons/fi"
import logo from "../assets/logoo.jpeg"
import { Link, useLocation } from "react-router-dom" 


const Sidebar = ({ isOpen }) => {
  const location = useLocation(); 

  const menuItems = [
    {
      title: "DASHBOARD",
      items: [
        { icon: <FiHome />, label: "Tableau de bord", path: "/" }, 
        { icon: <FiPieChart />, label: "Analyses détaillées", path: "/analyses" },
        { icon: <FiAlertTriangle />, label: "Alertes & Recommandations", path: "/alertes" },
      ],
    },
    {
      title: "DÉFIS & JEUX",
      items: [
        { icon: <FiAward />, label: "Défis disponibles", path: '/defis' },
        { icon: <FiTrendingDown />, label: "Défi Température", path: "/defi-temperature" },
        { icon: <FiDroplet />, label: "Chrono Douche", path: "/chrono-douche" },
        { icon: <FiClock />, label: "Cuisine Maligne", path: "/cuisine-maligne" }
      ],
    },
    {
      title: "COMMUNAUTÉ",
      items: [
        { icon: <FiUsers />, label: "Classement", path: "/classement" },
        { icon: <FiUsers />, label: "Fil d'actualité", path: "/actualites" },
        { icon: <FiCalendar />, label: "Événements", path: "/evenements" },
        { icon: <FiAward />, label: "Récompenses", path: "/recompenses" },
      ],
    },
  ]

  return (
    <div
      className={`bg-white dark:bg-gray-900 shadow-lg h-screen overflow-y-auto transition-all duration-300 flex-shrink-0
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header logo seulement */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className={`p-4 flex ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="flex items-center space-x-3">
            <img
              src={logo || "/placeholder.svg"}
              alt="GazSmart Logo"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            {isOpen && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-green-600 truncate">GazSmart</h1>
                <p className="text-xs text-gray-500 truncate">Sobriété énergétique</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 pb-6 mt-4">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-6">
            {/* Section title */}
            {isOpen && (
              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 truncate">
                {section.title}
              </h3>
            )}

            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link 
                    to={item.path || "#"} 
                    className={`flex items-center px-4 py-3 text-sm font-medium 
                      transition-colors duration-200 rounded-lg mx-1 whitespace-nowrap
                      ${
                        location.pathname === item.path 
                          ? "text-green-600 bg-green-50 dark:bg-green-900/20 border-r-2 border-green-600"
                          : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                      ${isOpen ? "justify-start" : "justify-center"}`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className={`${isOpen ? "mr-3" : ""} text-lg flex-shrink-0`}>{item.icon}</span>
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar