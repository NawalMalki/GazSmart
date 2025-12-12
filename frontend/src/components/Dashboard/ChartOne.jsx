import { useState } from "react"
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
import { FiTrendingDown, FiAlertCircle } from "react-icons/fi"

const ConsommationGaz = () => {
  const [period, setPeriod] = useState("mensuel")

  const monthlyData = [
    { label: "Jan", value: 420, target: 380 },
    { label: "Fév", value: 395, target: 370 },
    { label: "Mar", value: 365, target: 360 },
    { label: "Avr", value: 310, target: 350 },
    { label: "Mai", value: 285, target: 340 },
    { label: "Jun", value: 255, target: 330 },
    { label: "Jul", value: 225, target: 320 },
    { label: "Aoû", value: 210, target: 310 },
    { label: "Sep", value: 235, target: 320 },
    { label: "Oct", value: 275, target: 340 },
    { label: "Nov", value: 325, target: 360 },
    { label: "Déc", value: 385, target: 380 },
  ]

  const quarterlyData = [
    { label: "Q1", value: 1180, target: 1110 },
    { label: "Q2", value: 850, target: 1020 },
    { label: "Q3", value: 670, target: 950 },
    { label: "Q4", value: 985, target: 1080 },
  ]

  const yearlyData = [
    { label: "2021", value: 4850, target: 4500 },
    { label: "2022", value: 4600, target: 4300 },
    { label: "2023", value: 4200, target: 4100 },
    { label: "2024", value: 3650, target: 3900 },
  ]

  const getData = () => {
    switch (period) {
      case "trimestriel":
        return quarterlyData
      case "annuel":
        return yearlyData
      default:
        return monthlyData
    }
  }

  const data = getData()

  const avgActual = data.reduce((a, b) => a + b.value, 0) / data.length
  const avgTarget = data.reduce((a, b) => a + b.target, 0) / data.length
  const savingPercent = ((avgTarget - avgActual) / avgTarget) * 100
  const isTargetAchieved = savingPercent > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg text-gray-900 dark:text-white font-semibold">
            Consommation de gaz
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Évolution et objectifs
          </p>
        </div>

        <div className="flex gap-2">
          {["mensuel", "trimestriel", "annuel"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-lg ${
                period === p
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2">
            <FiTrendingDown className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Consommation totale
            </span>
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
            {data.reduce((a, b) => a + b.value, 0)} m³
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            isTargetAchieved
              ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiAlertCircle className={`${isTargetAchieved ? "text-green-600" : "text-red-600"}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Objectif
            </span>
          </div>

          <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
            {avgActual.toFixed(0)} m³
          </p>
        </div>
      </div>

      {/* REAL GRAPH */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Consommation réelle */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            {/* Objectif (pointillé) */}
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        {isTargetAchieved
          ? `Bravo ! Votre consommation est inférieure de ${savingPercent.toFixed(
              1
            )} % à l'objectif.`
          : `Attention : vous dépassez l'objectif de ${Math.abs(
              savingPercent
            ).toFixed(1)} %.`
        }
      </div>
    </div>
  )
}

export default ConsommationGaz
