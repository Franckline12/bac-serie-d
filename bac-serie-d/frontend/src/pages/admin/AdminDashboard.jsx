import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Users, BookOpen, Brain, BarChart2, TrendingUp, Award } from 'lucide-react'

const DEMO = {
  nb_users: 24,
  nb_cours: 51,
  nb_quiz: 18,
  nb_questions: 185,
  nb_scores: 230,
  score_moyen: 68,
  top_users: [
    { nom: 'Rakoto Aina',    score_moyen: 85, nb_quiz: 12 },
    { nom: 'Rasoa Marie',    score_moyen: 79, nb_quiz: 9  },
    { nom: 'Andry Paul',     score_moyen: 72, nb_quiz: 15 },
    { nom: 'Hanta Nirina',   score_moyen: 65, nb_quiz: 7  },
    { nom: 'Franckline',     score_moyen: 61, nb_quiz: 5  },
  ]
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO)

  useEffect(() => {
    api.get('/progression/classement')
      .then(res => {
        if (res.data.data?.length)
          setStats(s => ({ ...s, top_users: res.data.data }))
      }).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Vue d'ensemble de la plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Users}    label="Étudiants inscrits" value={stats.nb_users}     color="text-blue-600"   bg="bg-blue-50" />
        <StatCard icon={BookOpen} label="Cours disponibles"  value={stats.nb_cours}     color="text-green-600"  bg="bg-green-50" />
        <StatCard icon={Brain}    label="Quiz créés"         value={stats.nb_quiz}      color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={Award}    label="Questions"          value={stats.nb_questions} color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard icon={TrendingUp} label="Quiz complétés"   value={stats.nb_scores}    color="text-pink-600"   bg="bg-pink-50" />
        <StatCard icon={BarChart2} label="Score moyen global" value={`${stats.score_moyen}%`} color="text-red-600" bg="bg-red-50" />
      </div>

      {/* Top étudiants */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          🏆 Top étudiants
        </h2>
        <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-700">
          {stats.top_users.map((u, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <span className={`text-sm font-bold w-6 ${
                i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-400'
              }`}>{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-semibold">
                {u.nom?.slice(0,2).toUpperCase()}
              </div>
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{u.nom}</span>
              <span className="text-xs text-gray-400">{u.nb_quiz} quiz</span>
              <span className="text-sm font-semibold text-primary">{u.score_moyen}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accès rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Ajouter un cours',    to: '/admin/cours',      emoji: '📖' },
          { label: 'Créer un quiz',       to: '/admin/quiz',       emoji: '🧠' },
          { label: 'Ajouter un sujet',    to: '/admin/sujets',     emoji: '📄' },
          { label: 'Gérer les users',     to: '/admin/utilisateurs', emoji: '👥' },
        ].map(({ label, to, emoji }) => (
          <a key={to} href={to}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center hover:shadow-md transition-all">
            <div className="text-2xl mb-2">{emoji}</div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
