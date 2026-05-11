import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart2 } from 'lucide-react'

const DEMO = [
  { matiere: 'Maths', score_moyen: 72, nb_quiz: 45 },
  { matiere: 'Physique', score_moyen: 61, nb_quiz: 38 },
  { matiere: 'SVT', score_moyen: 78, nb_quiz: 52 },
  { matiere: 'Philo', score_moyen: 55, nb_quiz: 29 },
  { matiere: 'Hist-Géo', score_moyen: 67, nb_quiz: 33 },
]

export default function AdminStats() {
  const [data, setData] = useState(DEMO)
  useEffect(() => {
    api.get('/admin/stats').then(res => { if (res.data.data?.length) setData(res.data.data) }).catch(() => {})
  }, [])
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center"><BarChart2 size={20} className="text-pink-600" /></div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Statistiques globales</h1>
          <p className="text-sm text-gray-500">Performance des étudiants par matière</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Score moyen par matière</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="matiere" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => `${v}%`} />
            <Bar dataKey="score_moyen" fill="#185FA5" radius={[4,4,0,0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Nombre de quiz par matière</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="matiere" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="nb_quiz" fill="#534AB7" radius={[4,4,0,0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
