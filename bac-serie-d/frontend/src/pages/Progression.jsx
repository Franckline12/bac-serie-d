import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { TrendingUp, Award, Target, Flame } from 'lucide-react'

const COULEURS = ['#185FA5','#534AB7','#3B6D11','#BA7517','#993C1D']

const DEMO_PROG = [
  { nom:'Mathématiques', pourcentage:72, icone:'📐', couleur:'#185FA5' },
  { nom:'Physique-Chimie', pourcentage:58, icone:'⚗️',  couleur:'#534AB7' },
  { nom:'SVT',             pourcentage:80, icone:'🌿', couleur:'#3B6D11' },
  { nom:'Philosophie',     pourcentage:45, icone:'🤔', couleur:'#BA7517' },
  { nom:'Histoire-Géo',    pourcentage:61, icone:'🌍', couleur:'#993C1D' },
]

const DEMO_HISTORIQUE = [
  { semaine:'S1', Maths:45, SVT:50, Phys:40 },
  { semaine:'S2', Maths:55, SVT:60, Phys:48 },
  { semaine:'S3', Maths:62, SVT:70, Phys:53 },
  { semaine:'S4', Maths:72, SVT:80, Phys:58 },
]

const BADGES = [
  { icon:'🏅', label:'7 jours consécutifs',   earned: true  },
  { icon:'⭐', label:'Quiz parfait SVT',       earned: true  },
  { icon:'🎯', label:'80% en SVT',             earned: true  },
  { icon:'🔥', label:'30 jours consécutifs',   earned: false },
  { icon:'🏆', label:'100% Mathématiques',     earned: false },
  { icon:'💎', label:'Maître des quiz',        earned: false },
]

export default function Progression() {
  const [matieres, setMatieres] = useState(DEMO_PROG)
  const [classement, setClassement] = useState([])

  useEffect(() => {
    api.get('/progression/matieres')
      .then(res => { if (res.data.data?.length) setMatieres(res.data.data) })
      .catch(() => {})
    api.get('/progression/classement')
      .then(res => { if (res.data.data?.length) setClassement(res.data.data) })
      .catch(() => {})
  }, [])

  const global = Math.round(matieres.reduce((s, m) => s + m.pourcentage, 0) / matieres.length)

  const radarData = matieres.map(m => ({
    subject: m.nom.split('-')[0].split(' ')[0],
    score: m.pourcentage,
    fullMark: 100
  }))

  return (
    <div className="max-w-5xl mx-auto fade-in space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Ma Progression</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi détaillé de tes révisions</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-primary">{global}%</div>
          <div className="text-xs text-gray-400 mt-1">Progression globale</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-success">80%</div>
          <div className="text-xs text-gray-400 mt-1">Meilleure matière (SVT)</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-warning">45%</div>
          <div className="text-xs text-gray-400 mt-1">À améliorer (Philo)</div>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame size={20} className="text-danger" />
            <span className="text-3xl font-bold text-danger">7</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Jours consécutifs</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar des matières */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Target size={15} className="text-primary" />
            Vue d'ensemble
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Radar name="Score" dataKey="score" stroke="#185FA5" fill="#185FA5" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Évolution dans le temps */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" />
            Évolution hebdomadaire
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DEMO_HISTORIQUE} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semaine" tick={{ fontSize: 11 }} />
              <YAxis domain={[0,100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Maths" stroke="#185FA5" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="SVT"   stroke="#3B6D11" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Phys"  stroke="#534AB7" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barres par matière */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-5">Détail par matière</h2>
        <div className="space-y-4">
          {matieres.map((m, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icone}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{m.nom}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: m.couleur || COULEURS[i] }}>
                  {m.pourcentage}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-700"
                  style={{ width: `${m.pourcentage}%`, backgroundColor: m.couleur || COULEURS[i] }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {m.pourcentage < 50 ? '⚠️ À améliorer' : m.pourcentage < 70 ? '👍 En progrès' : '✅ Très bien'}
                </span>
                <span className="text-xs text-gray-400">{m.pourcentage}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Award size={15} className="text-warning" />
          Badges de réussite
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {BADGES.map((b, i) => (
            <div key={i} className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
              b.earned
                ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                : 'border-gray-100 dark:border-gray-700 opacity-40'
            }`}>
              <span className="text-2xl mb-1">{b.icon}</span>
              <span className="text-xs text-center text-gray-600 dark:text-gray-400 leading-tight">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Classement */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">🏆 Classement des étudiants</h2>
        {classement.length > 0 ? (
          <div className="space-y-2">
            {classement.map((u, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <span className={`text-sm font-bold w-6 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-semibold">
                  {u.nom?.slice(0,2).toUpperCase()}
                </div>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{u.nom}</span>
                <span className="text-sm font-semibold text-primary">{u.score_moyen}%</span>
                <span className="text-xs text-gray-400">{u.nb_quiz} quiz</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            Fais des quiz pour apparaître dans le classement !
          </div>
        )}
      </div>
    </div>
  )
}
