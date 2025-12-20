import { useState } from "react"
import { useTheme } from "../../context/ThemeContext" 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

const ConsommationGaz = () => {
  const { theme } = useTheme()
  const [period, setPeriod] = useState("mensuel")

  const monthlyData = [
    { label: "Jan", bio: 12.5, nonBio: 8.2, energieProduite: 18.4, gazEconomise: 15.2 },
    { label: "Fév", bio: 14.2, nonBio: 9.1, energieProduite: 20.8, gazEconomise: 17.5 },
    { label: "Mar", bio: 16.8, nonBio: 10.5, energieProduite: 24.2, gazEconomise: 20.8 },
    { label: "Avr", bio: 15.3, nonBio: 9.8, energieProduite: 22.5, gazEconomise: 19.1 },
    { label: "Mai", bio: 18.1, nonBio: 11.2, energieProduite: 26.1, gazEconomise: 22.4 },
    { label: "Jun", bio: 19.5, nonBio: 12.8, energieProduite: 28.7, gazEconomise: 24.8 },
    { label: "Jul", bio: 21.2, nonBio: 13.5, energieProduite: 30.9, gazEconomise: 27.1 },
    { label: "Aoû", bio: 20.8, nonBio: 14.1, energieProduite: 31.2, gazEconomise: 27.8 },
    { label: "Sep", bio: 17.9, nonBio: 11.8, energieProduite: 26.5, gazEconomise: 23.2 },
    { label: "Oct", bio: 16.2, nonBio: 10.3, energieProduite: 23.8, gazEconomise: 20.5 },
    { label: "Nov", bio: 14.7, nonBio: 9.5, energieProduite: 21.6, gazEconomise: 18.7 },
    { label: "Déc", bio: 13.1, nonBio: 8.7, energieProduite: 19.5, gazEconomise: 16.8 },
  ]

  const quarterlyData = [
    { label: "Q1", bio: 43.5, nonBio: 27.8, energieProduite: 63.4, gazEconomise: 53.5 },
    { label: "Q2", bio: 52.9, nonBio: 33.8, energieProduite: 77.3, gazEconomise: 66.3 },
    { label: "Q3", bio: 59.9, nonBio: 39.4, energieProduite: 88.6, gazEconomise: 78.1 },
    { label: "Q4", bio: 44.0, nonBio: 28.5, energieProduite: 64.9, gazEconomise: 56.0 },
  ]

  const yearlyData = [
    { label: "2022", bio: 165, nonBio: 105, energieProduite: 240, gazEconomise: 198 },
    { label: "2023", bio: 185, nonBio: 118, energieProduite: 270, gazEconomise: 225 },
    { label: "2024", bio: 200, nonBio: 129, energieProduite: 294, gazEconomise: 254 },
  ]

  const getData = () => {
    switch (period) {
      case "trimestriel": return quarterlyData
      case "annuel": return yearlyData
      default: return monthlyData
    }
  }

  const data = getData()
  const totalBio = data.reduce((a, b) => a + b.bio, 0)
  const totalNonBio = data.reduce((a, b) => a + b.nonBio, 0)
  const totalEnergie = data.reduce((a, b) => a + b.energieProduite, 0)
  const totalGazEco = data.reduce((a, b) => a + b.gazEconomise, 0)

  return (
    <div className={`rounded-xl shadow-sm p-6 border transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
            Ma Contribution Énergétique
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Déchets déposés → Énergie produite
          </p>
        </div>

        <div className="flex gap-2">
          {["mensuel", "trimestriel", "annuel"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-lg transition-all
                ${period === p 
                  ? theme === 'dark' 
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-blue-100 text-blue-600'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`p-4 rounded-lg border transition-colors duration-300
          ${theme === 'dark' ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-50 border-green-300 text-green-700'}`}>
          <p className="text-xs font-medium mb-1">Déchets Bio</p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
            {totalBio.toFixed(1)} kg
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Méthanisation
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-300
          ${theme === 'dark' ? 'bg-orange-900/30 border-orange-700 text-orange-300' : 'bg-orange-50 border-orange-300 text-orange-700'}`}>
          <p className="text-xs font-medium mb-1">Déchets Non-Bio</p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
            {totalNonBio.toFixed(1)} kg
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
            Micropyrolyse
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-300
          ${theme === 'dark' ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-700'}`}>
          <p className="text-xs font-medium mb-1">Énergie Produite</p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
            {totalEnergie.toFixed(1)} kWh
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            Contribution totale
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-300
          ${theme === 'dark' ? 'bg-purple-900/30 border-purple-700 text-purple-300' : 'bg-purple-50 border-purple-300 text-purple-700'}`}>
          <p className="text-xs font-medium mb-1">Gaz Économisé</p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
            {totalGazEco.toFixed(1)} m³
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            Impact direct
          </p>
        </div>
      </div>

      {/* GRAPH */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#d1d5db'} opacity={0.3}/>
            <XAxis dataKey="label" stroke={theme === 'dark' ? '#d1d5db' : '#111827'} />
            <YAxis stroke={theme === 'dark' ? '#d1d5db' : '#111827'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                color: theme === 'dark' ? '#f9fafb' : '#111827',
                borderRadius: '8px',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
              }} 
            />
            <Legend wrapperStyle={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }} />
            <Line type="monotone" dataKey="energieProduite" name="Énergie produite (kWh)"
              stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} />
            <Line type="monotone" dataKey="gazEconomise" name="Gaz économisé (m³)"
              stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS */}
      <div className={`mt-6 p-4 rounded-lg border transition-colors duration-300
        ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
        <p className="text-sm mb-2">
          💡 <span className="font-semibold">Comment ça marche ?</span>
        </p>
        <ul className="text-xs space-y-1 ml-4">
          <li>• <span className="text-green-500 font-medium">Déchets bio</span> → Méthanisation → Production de biogaz</li>
          <li>• <span className="text-orange-500 font-medium">Déchets non-bio</span> → Micropyrolyse → Production d'énergie thermique</li>
          <li>• Plus vous triez, plus vous contribuez à réduire la consommation de gaz du bâtiment !</li>
        </ul>
      </div>
    </div>
  )
}

export default ConsommationGaz