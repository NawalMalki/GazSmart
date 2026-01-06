import { useTheme } from "../context/ThemeContext"
import { 
  FiUsers, 
  FiTrendingUp, 
  FiAward, 
  FiActivity,
  FiTarget,
  FiZap,
  FiThermometer,
  FiDroplet,
  FiEye,
  FiClock,
  FiAlertCircle,
  FiTrendingDown
} from "react-icons/fi"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

export default function AdminSpace() {
  const { theme } = useTheme()

  const userEngagementData = [
    { month: "Jan", actifs: 52, inactifs: 18, nouveaux: 15 },
    { month: "Fév", actifs: 61, inactifs: 16, nouveaux: 17 },
    { month: "Mar", actifs: 71, inactifs: 13, nouveaux: 20 },
    { month: "Avr", actifs: 78, inactifs: 11, nouveaux: 18 },
    { month: "Mai", actifs: 84, inactifs: 10, nouveaux: 14 },
    { month: "Jun", actifs: 89, inactifs: 9, nouveaux: 16 }
  ]

  const challengeData = [
    { name: "Défi Température", participants: 67, completion: 78, points: 32400 },
    { name: "Chrono Douche", participants: 54, completion: 65, points: 26800 },
    { name: "Cuisine Maligne", participants: 49, completion: 71, points: 34700 }
  ]

  const badgeDistribution = [
    { name: "Sans badge", value: 48, color: "#9CA3AF" },
    { name: "Bronze", value: 31, color: "#CD7F32" },
    { name: "Argent", value: 16, color: "#C0C0C0" },
    { name: "Or", value: 7, color: "#FFD700" }
  ]

  const feedEngagementData = [
    { day: "Lun", posts: 8, comments: 23, likes: 67 },
    { day: "Mar", posts: 11, comments: 31, likes: 82 },
    { day: "Mer", posts: 13, comments: 38, likes: 95 },
    { day: "Jeu", posts: 9, comments: 27, likes: 74 },
    { day: "Ven", posts: 14, comments: 42, likes: 103 },
    { day: "Sam", posts: 7, comments: 21, likes: 58 },
    { day: "Dim", posts: 5, comments: 16, likes: 44 }
  ]

  const energyConsumptionData = [
    { month: "Jan", consommation: 2840, economie: 320 },
    { month: "Fév", consommation: 2590, economie: 410 },
    { month: "Mar", consommation: 2380, economie: 520 },
    { month: "Avr", consommation: 2170, economie: 630 },
    { month: "Mai", consommation: 2080, economie: 720 },
    { month: "Jun", consommation: 1960, economie: 840 }
  ]

  const featureUsageData = [
    { feature: "Dashboard", temps: 8.5, sessions: 287 },
    { feature: "Défis", temps: 12.3, sessions: 213 },
    { feature: "Feed", temps: 15.7, sessions: 245 },
    { feature: "Classement", temps: 6.2, sessions: 156 },
    { feature: "Contribution", temps: 4.8, sessions: 118 }
  ]

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className={`rounded-lg p-5 border transition-all duration-200 ${
      theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            trend.startsWith('+') 
              ? theme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'
              : theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className={`text-2xl font-bold mb-1 tabular-nums ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </h3>
      <p className={`text-sm font-medium mb-1 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {title}
      </p>
      <p className={`text-xs ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        {subtitle}
      </p>
    </div>
  )

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Stats principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FiUsers}
            title="Utilisateurs Actifs"
            value="89"
            subtitle="Sur 102 inscrits (87.3%)"
            trend="+12.7%"
          />
          <StatCard
            icon={FiAward}
            title="Défis Actifs"
            value="170"
            subtitle="67 + 54 + 49 participants"
            trend="+18.2%"
          />
          <StatCard
            icon={FiZap}
            title="Économie Totale"
            value="840"
            subtitle="kWh économisés ce mois"
            trend="+16.7%"
          />
          <StatCard
            icon={FiTrendingUp}
            title="Taux d'Engagement"
            value="73.8%"
            subtitle="Moyenne sur 30 jours"
            trend="+7.4%"
          />
        </div>

        {/* Engagement utilisateurs & Consommation énergétique */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Engagement utilisateurs */}
          <div className={`rounded-lg p-6 border ${
            theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiUsers className="w-4 h-4" />
              Évolution de l'engagement utilisateur
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userEngagementData}>
                <defs>
                  <linearGradient id="colorActifs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNouveaux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} opacity={0.3} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area 
                  type="monotone" 
                  dataKey="actifs" 
                  name="Utilisateurs actifs"
                  stroke="#10B981" 
                  fill="url(#colorActifs)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="nouveaux" 
                  name="Nouveaux utilisateurs"
                  stroke="#3B82F6" 
                  fill="url(#colorNouveaux)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="inactifs" 
                  name="Inactifs"
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Consommation énergétique */}
          <div className={`rounded-lg p-6 border ${
            theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiTrendingDown className="w-4 h-4" />
              Consommation énergétique globale (kWh)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={energyConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} opacity={0.3} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="consommation" 
                  name="Consommation totale"
                  stroke={theme === 'dark' ? '#A78BFA' : '#8B5CF6'}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="economie" 
                  name="Économies réalisées"
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={`mt-4 p-3 rounded-lg border ${
              theme === 'dark' ? 'bg-green-500/5 border-green-900/30' : 'bg-green-50/50 border-green-200/50'
            }`}>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-green-300/80' : 'text-green-700'
              }`}>
                <strong>Tendance positive :</strong> La consommation globale baisse de mois en mois grâce aux efforts collectifs
              </p>
            </div>
          </div>
        </div>

        {/* Performance des défis */}
        <div className={`rounded-lg p-6 border ${
          theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <FiTarget className="w-4 h-4" />
            Performance des défis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challengeData.map((challenge, idx) => (
              <div key={idx} className={`rounded-lg p-5 border transition-all duration-150 ${
                theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {challenge.name}
                  </h4>
                  {idx === 0 && <FiThermometer className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
                  {idx === 1 && <FiDroplet className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
                  {idx === 2 && <FiClock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                        Participants
                      </span>
                      <span className={`font-semibold tabular-nums ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {challenge.participants}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${(challenge.participants / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                        Taux de complétion
                      </span>
                      <span className={`font-semibold tabular-nums ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {challenge.completion}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${challenge.completion}%` }}
                      />
                    </div>
                  </div>
                  <div className={`pt-3 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Points distribués
                    </span>
                    <p className={`text-lg font-bold tabular-nums ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {challenge.points.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Feed & Distribution badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Engagement Feed */}
          <div className={`lg:col-span-2 rounded-lg p-6 border ${
            theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiActivity className="w-4 h-4" />
              Activité sur le Feed
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={feedEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} opacity={0.3} />
                <XAxis dataKey="day" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="posts" name="Posts" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="comments" name="Commentaires" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="likes" name="Likes" fill="#EF4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution badges */}
          <div className={`rounded-lg p-6 border ${
            theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiAward className="w-4 h-4" />
              Distribution des badges
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={badgeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {badgeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {badgeDistribution.map((badge, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: badge.color }}
                    />
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {badge.name}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold tabular-nums ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {badge.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage des fonctionnalités */}
        <div className={`rounded-lg p-6 border ${
          theme === 'dark' ? 'bg-gray-900/60 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <FiEye className="w-4 h-4" />
            Usage des fonctionnalités
          </h3>
          <div className="space-y-3">
            {featureUsageData.map((feature, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.feature}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {feature.sessions} sessions
                    </span>
                    <span className={`text-xs font-semibold tabular-nums ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature.temps} min
                    </span>
                  </div>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${(feature.sessions / 300) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes & Actions recommandées */}
        <div className={`rounded-lg p-6 border ${
          theme === 'dark' ? 'bg-amber-500/5 border-amber-900/30' : 'bg-amber-50/50 border-amber-200/50'
        }`}>
          <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
          }`}>
            <FiAlertCircle className="w-4 h-4" />
            Actions recommandées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                9 utilisateurs inactifs
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Envoyer une notification de relance pour réengager les utilisateurs dormants
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Chrono Douche en baisse
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Participation -8% cette semaine. Envisager un boost de points ou un mini-défi
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Objectif mensuel atteint
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                840 kWh économisés ! Communiquer cette victoire collective sur le feed
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}