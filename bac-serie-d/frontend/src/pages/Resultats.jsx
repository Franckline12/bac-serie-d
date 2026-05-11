import { useEffect, useState } from 'react'
import api from '../services/api'
import { BarChart2, Clock, CheckCircle, XCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const DEMO_SCORES = [
  { id:1, quiz_titre:'Suites numériques',     niveau:'moyen',    matiere:'Mathématiques', score:85, nb_questions:10, temps_utilise:260, created_at:'2025-01-15T10:30:00Z' },
  { id:2, quiz_titre:'Mécanique du point',    niveau:'difficile',matiere:'Physique-Chimie',score:62, nb_questions:10, temps_utilise:432, created_at:'2025-01-14T14:00:00Z' },
  { id:3, quiz_titre:'Génétique',             niveau:'facile',   matiere:'SVT',           score:95, nb_questions:5,  temps_utilise:185, created_at:'2025-01-14T09:15:00Z' },
  { id:4, quiz_titre:'Philosophie',           niveau:'moyen',    matiere:'Philosophie',   score:40, nb_questions:10, temps_utilise:408, created_at:'2025-01-13T16:45:00Z' },
  { id:5, quiz_titre:'Géologie',              niveau:'facile',   matiere:'SVT',           score:78, nb_questions:10, temps_utilise:240, created_at:'2025-01-12T11:00:00Z' },
  { id:6, quiz_titre:'Dérivées — Facile',     niveau:'facile',   matiere:'Mathématiques', score:90, nb_questions:10, temps_utilise:310, created_at:'2025-01-11T08:30:00Z' },
  { id:7, quiz_titre:'Probabilités',          niveau:'moyen',    matiere:'Mathématiques', score:55, nb_questions:10, temps_utilise:520, created_at:'2025-01-10T15:20:00Z' },
]

function ScoreBadge({ score }) {
  if (score >= 75) return <span className="score-badge score-good">{score}%</span>
  if (score >= 50) return <span className="score-badge score-mid">{score}%</span>
  return <span className="score-badge score-low">{score}%</span>
}

const NIVEAU_BADGE = {
  facile:    'bg-green-50 text-green-600',
  moyen:     'bg-yellow-50 text-yellow-600',
  difficile: 'bg-red-50 text-red-600',
}

const formatTime = s => {
  if (!s) return '—'
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}m ${String(sec).padStart(2,'0')}s`
}

const formatDate = d => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-MG', { day:'numeric', month:'short' })
}

export default function Resultats() {
  const [scores, setScores] = useState(DEMO_SCORES)

  useEffect(() => {
    api.get('/scores')
      .then(res => { if (res.data.data?.length) setScores(res.data.data) })
      .catch(() => {})
  }, [])

  const scoreMoyen = scores.length
    ? Math.round(scores.reduce((s, q) => s + q.score, 0) / scores.length)
    : 0

  const nbReussis = scores.filter(s => s.score >= 60).length

  // Données pour le graphique
  const chartData = scores.slice(0, 7).reverse().map((s, i) => ({
    name: `Q${i + 1}`,
    score: s.score,
    label: s.quiz_titre
  }))

  return (
    <div className="max-w-4xl mx-auto fade-in space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Résultats</h1>
        <p className="text-sm text-gray-500 mt-1">Historique complet de tes quiz</p>
      </div>

      {/* Stats résumé */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{scoreMoyen}%</div>
          <div className="text-xs text-gray-400">Score moyen</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-success mb-1">{nbReussis}</div>
          <div className="text-xs text-gray-400">Quiz réussis (≥60%)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{scores.length}</div>
          <div className="text-xs text-gray-400">Total quiz</div>
        </div>
      </div>

      {/* Graphique évolution */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <BarChart2 size={15} className="text-primary" />
          Évolution des scores
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ left: -20, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, _, props) => [`${v}%`, props.payload.label]}
              labelFormatter={() => ''}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score >= 75 ? '#3B6D11' : entry.score >= 50 ? '#BA7517' : '#993C1D'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau historique */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Historique détaillé</h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {scores.map(s => (
            <div key={s.id} className="px-5 py-4 flex items-center gap-4">
              {/* Icône résultat */}
              <div className="flex-shrink-0">
                {s.score >= 60
                  ? <CheckCircle size={18} className="text-success" />
                  : <XCircle    size={18} className="text-danger" />
                }
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {s.quiz_titre}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${NIVEAU_BADGE[s.niveau] || ''}`}>
                    {s.niveau}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{s.matiere}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {formatTime(s.temps_utilise)}
                  </span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{formatDate(s.created_at)}</span>
                </div>
              </div>

              {/* Score */}
              <ScoreBadge score={s.score} />
            </div>
          ))}
        </div>

        {scores.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun résultat pour l'instant.</p>
            <p className="text-xs mt-1">Fais ton premier quiz pour commencer !</p>
          </div>
        )}
      </div>
    </div>
  )
}
