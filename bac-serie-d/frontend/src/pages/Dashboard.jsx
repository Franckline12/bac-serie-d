import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import {
  TrendingUp, Brain, BookOpen, Trophy, Lightbulb,
  ArrowRight, Clock, Flame, Star
} from 'lucide-react'

const COULEURS = ['#185FA5','#534AB7','#3B6D11','#BA7517','#993C1D']

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary', bg = 'bg-primary-light' }) {
  return (
    <div className="card p-5 fade-in">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function ScoreBadge({ score }) {
  if (score >= 75) return <span className="score-badge score-good">{score}%</span>
  if (score >= 50) return <span className="score-badge score-mid">{score}%</span>
  return <span className="score-badge score-low">{score}%</span>
}

// Données demo (utilisées si l'API n'est pas connectée)
const DEMO = {
  progression_globale: 64,
  score_moyen: 71,
  nb_quiz: 23,
  progression_matieres: [
    { nom: 'Mathématiques', pourcentage: 72, icone: '📐' },
    { nom: 'Physique-Chimie', pourcentage: 58, icone: '⚗️' },
    { nom: 'SVT', pourcentage: 80, icone: '🌿' },
    { nom: 'Philosophie', pourcentage: 45, icone: '🤔' },
    { nom: 'Histoire-Géo', pourcentage: 61, icone: '🌍' },
  ],
  derniers_quiz: [
    { quiz_titre: 'Suites numériques', niveau: 'moyen',    matiere: 'Mathématiques', score: 85, temps_utilise: 260 },
    { quiz_titre: 'Mécanique',         niveau: 'difficile', matiere: 'Physique',      score: 62, temps_utilise: 432 },
    { quiz_titre: 'Génétique',         niveau: 'facile',   matiere: 'SVT',           score: 95, temps_utilise: 185 },
    { quiz_titre: 'Philosophie',       niveau: 'moyen',    matiere: 'Philosophie',   score: 40, temps_utilise: 408 },
    { quiz_titre: 'Géologie',          niveau: 'facile',   matiere: 'SVT',           score: 78, temps_utilise: 240 },
  ],
  recommandations: [
    { message: 'Tu es faible en "Dérivées" (Mathématiques) avec 48%', action: 'Revoir le cours' },
    { message: 'Score bas en "Optique" (Physique) avec 42%',           action: 'Faire les exercices' },
    { message: 'Philosophie : progression lente (45%)',                 action: 'Quiz recommandé' },
  ]
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData]     = useState(DEMO)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/progression/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => {}) // utilise DEMO si pas de connexion
      .finally(() => setLoading(false))
  }, [])

  const barData = data.progression_matieres.map((m, i) => ({
    name: m.nom.split('-')[0].trim().slice(0,4),
    score: m.pourcentage,
    fill: COULEURS[i]
  }))

  const formatTime = s => {
    if (!s) return '—'
    const m = Math.floor(s / 60), sec = s % 60
    return `${m}m ${sec}s`
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Bonjour, {user?.nom?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Voici ton tableau de bord de révision
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Progression globale" value={`${data.progression_globale}%`}
          sub="toutes matières" color="text-primary" bg="bg-primary-light" />
        <StatCard icon={Brain} label="Quiz complétés" value={data.nb_quiz}
          sub="5 matières" color="text-purple-600" bg="bg-purple-light" />
        <StatCard icon={Trophy} label="Score moyen" value={`${data.score_moyen}%`}
          sub={data.score_moyen >= 70 ? 'Très bien !' : 'À améliorer'} color="text-warning" bg="bg-warning-light" />
        <StatCard icon={Flame} label="Série active" value="7 jours"
          sub="Continue !" color="text-danger" bg="bg-danger-light" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique progression */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" />
            Progression par matière
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`${v}%`, 'Score']} />
              <Bar dataKey="score" radius={[4,4,0,0]} maxBarSize={40}>
                {barData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Barres de progression */}
          <div className="mt-4 space-y-2">
            {data.progression_matieres.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base w-6">{m.icone}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${m.pourcentage}%`, backgroundColor: COULEURS[i] }} />
                </div>
                <span className="text-xs font-medium text-gray-600 w-9 text-right">
                  {m.pourcentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations IA */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Lightbulb size={15} className="text-warning" />
            Recommandations IA
          </h2>
          <div className="space-y-3">
            {data.recommandations?.length ? (
              data.recommandations.map((r, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{r.message}</p>
                    <Link to="/quiz" className="text-xs text-primary font-medium mt-1 inline-flex items-center gap-1 hover:underline">
                      {r.action} <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Star size={16} className="text-success" />
                <p className="text-sm text-success">Excellent travail ! Continue comme ça.</p>
              </div>
            )}
          </div>

          {/* Accès rapide */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 mb-2">Accès rapide</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/quiz" className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary p-2 rounded-lg hover:bg-primary-light transition-colors">
                <Brain size={14} /> Faire un quiz
              </Link>
              <Link to="/cours/1" className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary p-2 rounded-lg hover:bg-primary-light transition-colors">
                <BookOpen size={14} /> Revoir un cours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Derniers quiz */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Clock size={15} className="text-primary" />
          Derniers quiz
        </h2>
        <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-800">
          {data.derniers_quiz?.map((q, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {q.quiz_titre}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {q.matiere} · <span className="capitalize">{q.niveau}</span> · {formatTime(q.temps_utilise)}
                </p>
              </div>
              <ScoreBadge score={q.score} />
            </div>
          ))}
        </div>
        <Link to="/resultats" className="mt-3 text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
          Voir tous les résultats <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
