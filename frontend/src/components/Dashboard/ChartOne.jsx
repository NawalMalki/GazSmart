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
    <div className={`rounded-lg p-6 border transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' 
        : 'bg-white/80 backdrop-blur-sm border-gray-200'
    }`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base font-semibold`}>
            Ma Contribution Énergétique
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
            Déchets déposés → Énergie produite
          </p>
        </div>

        <div className="flex gap-2">
          {["mensuel", "trimestriel", "annuel"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150 border ${
                period === p 
                  ? theme === 'dark' 
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-gray-900 text-white border-gray-900'
                  : theme === 'dark'
                    ? 'bg-transparent text-gray-400 hover:text-gray-300 border-gray-700 hover:bg-gray-800/50'
                    : 'bg-transparent text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS - MÊME COULEUR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Déchets Bio
          </p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold tabular-nums`}>
            {totalBio.toFixed(1)} <span className="text-sm font-normal">kg</span>
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Méthanisation
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Déchets Non-Bio
          </p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold tabular-nums`}>
            {totalNonBio.toFixed(1)} <span className="text-sm font-normal">kg</span>
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Micropyrolyse
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Énergie Produite
          </p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold tabular-nums`}>
            {totalEnergie.toFixed(1)} <span className="text-sm font-normal">kWh</span>
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Contribution totale
          </p>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Gaz Produit
          </p>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold tabular-nums`}>
            {totalGazEco.toFixed(1)} <span className="text-sm font-normal">m³</span>
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Impact direct
          </p>
        </div>
      </div>

      {/* GRAPH */}
      <div className="w-full h-72 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
              opacity={0.3}
            />
            <XAxis 
              dataKey="label" 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                color: theme === 'dark' ? '#f9fafb' : '#111827',
                borderRadius: '8px',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                fontSize: '12px'
              }} 
            />
            <Legend 
              wrapperStyle={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: '12px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="energieProduite" 
              name="Énergie produite (kWh)"
              stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
              strokeWidth={2.5}
              dot={{ r: 4, fill: theme === 'dark' ? '#60A5FA' : '#3B82F6' }}
            />
            <Line 
              type="monotone" 
              dataKey="gazEconomise" 
              name="Gaz économisé (m³)"
              stroke={theme === 'dark' ? '#34D399' : '#10B981'}
              strokeWidth={2.5}
              dot={{ r: 4, fill: theme === 'dark' ? '#34D399' : '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS */}
      <div className={`p-4 rounded-lg border transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
      }`}>
        <p className={`text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
          Comment ça marche ?
        </p>
        <ul className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
            <span><strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Déchets bio</strong> → Méthanisation → Production de biogaz</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
            <span><strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Déchets non-bio</strong> → Micropyrolyse → Production d'énergie thermique</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
            <span>Plus vous triez, plus vous contribuez à réduire la consommation de gaz du bâtiment</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ConsommationGaz