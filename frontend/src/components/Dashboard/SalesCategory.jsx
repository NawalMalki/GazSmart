export default function SalesCategory({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const radius = 50
  const circ = 2 * Math.PI * radius

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md w-full h-full transition-colors duration-300">
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Répartition de la consommation
      </h2>

      <div className="flex flex-col items-center gap-6">
        {/* Donut Chart - Responsive */}
        <div className="flex-shrink-0">
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] mx-auto">
            <svg width="100%" height="100%" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(75,75)">
                {
                  data.reduce(
                    (acc, item, index) => {
                      const startOffset = acc.offset
                      const strokeDash = (item.percent / 100) * circ

                      acc.offset += strokeDash

                      acc.elements.push(
                        <circle
                          key={index}
                          r={radius}
                          stroke={item.color}
                          strokeWidth="14"
                          fill="transparent"
                          strokeDasharray={`${strokeDash} ${circ}`}
                          strokeDashoffset={-startOffset}
                          strokeLinecap="round"
                          transform="rotate(-90)"
                        />,
                      )

                      return acc
                    },
                    { offset: 0, elements: [] },
                  ).elements
                }
              </g>
            </svg>

            {/* Total center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Total</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">kWh</span>
            </div>
          </div>
        </div>

        {/* Right labels - Responsive */}
        <div className="space-y-3 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ background: item.color }}></span>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.percent}% • {item.value.toLocaleString()} kWh
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
