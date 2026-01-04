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
  FiSettings,
  FiDatabase,
  FiShield,
  FiActivity,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi"
import logo from "../assets/logoo.jpeg"
import { Link, useLocation } from "react-router-dom" 

const Sidebar = ({ isOpen, isAdmin = false }) => {
  const location = useLocation(); 
  const { theme } = useTheme() 

  // Menu pour utilisateurs normaux
  const userMenuItems = [
    {
      title: "ACCUEIL",
      items: [
        { icon: <FiHome />, label: "Tableau de bord", path: "/dashboard" }, 
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

  // Menu pour admin
  const adminMenuItems = [
    {
      title: "ACCUEIL",
      items: [
        { icon: <FiHome />, label: "Tableau de bord admin", path: "/adminspace" }, 
        { icon: <FiAlertTriangle />, label: "Gestion des alertes", path: "/adminspace/alertes" },
 
      ],}, 
      {
      title: "DÉFIS & JEUX",
      items: [
        { icon: <FiAward />, label: "Gestion des défis", path: '/adminspace/defis' },
         { icon: <FiAward />, label: "Gestion des récompenses", path: "/adminspace/recompenses" },
      ],
    },
    {
      title: "COMMUNAUTÉ",
      items: [
        { icon: <FiMessageSquare />, label: "Contrôle des postes", path: "/adminspace/feed" },
        { icon: <FiCalendar />, label: "Gestion des évenements", path: "/adminspace/evenements" },
       
      ],
    
    }
  ]

  // Choisir le menu selon le type d'utilisateur
  const menuItems = isAdmin ? adminMenuItems : userMenuItems
  
  // Choisir la couleur du thème selon le type
  const accentColor = isAdmin ? 'red' : 'green'

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
                <h1 className={`text-xl font-bold truncate`}>
                  GazSmart
                </h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs truncate`}>
                  {isAdmin ? 'GazSmart - GRDF' : 'Sobriété énergétique'}
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
                        ? `${theme === 'dark' 
                            ? `text-${accentColor}-400 bg-${accentColor}-900/20 border-r-2 border-${accentColor}-400` 
                            : `text-${accentColor}-600 bg-${accentColor}-50 border-r-2 border-${accentColor}-600`}`
                        : `${theme === 'dark' 
                            ? `text-gray-400 hover:text-${accentColor}-400 hover:bg-gray-800` 
                            : `text-gray-600 hover:text-${accentColor}-600 hover:bg-gray-50`}`
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