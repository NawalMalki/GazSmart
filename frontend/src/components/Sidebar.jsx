import { useTheme } from "../context/ThemeContext"
import {
  FiHome,
  FiPieChart,
  FiAward,
  FiUsers,
  FiCalendar,
  FiDroplet,
  FiClock,
  FiAlertTriangle,
  FiMessageSquare,
  FiTrendingDown,
  FiBarChart2,
} from "react-icons/fi"
import logo from "../assets/logoo.jpeg"
import { Link, useLocation } from "react-router-dom" 

const Sidebar = ({ isOpen }) => {
  const location = useLocation(); 
  const { theme } = useTheme() 

  const menuItems = [
    {
      title: "ACCUEIL",
      items: [
        { icon: <FiHome />, label: "Tableau de bord", path: "/dashboard" }, 
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
        { icon: <FiMessageSquare />, label: "Fil d'actualité", path: "/feed" },
        { icon: <FiCalendar />, label: "Événements", path: "/evenements" },
        { icon: <FiAward />, label: "Récompenses", path: "/recompenses" },
      ],
    },
  ]

  return (
    <div
      className={`transition-all duration-300 flex-shrink-0 shadow-lg h-screen overflow-y-auto
        ${isOpen ? "w-64" : "w-20"}
        ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}`}
    >
      {/* Header logo */}
      <div className={`sticky top-0 z-10 border-b transition-colors duration-300
        ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs truncate`}>
                  Sobriété énergétique
                </p>
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
              <h3 className={`px-4 text-xs font-semibold uppercase tracking-wider mb-3 truncate
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      ${location.pathname === item.path
                        ? `${theme === 'dark' ? 'text-green-400 bg-green-900/20 border-r-2 border-green-400' : 'text-green-600 bg-green-50 border-r-2 border-green-600'}`
                        : `${theme === 'dark' ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`
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
