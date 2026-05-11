import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ChevronRight, ArrowLeft, BookOpen, Brain, FileText } from 'lucide-react'

const DEMO_CHAPITRES = {
  1: [
    { id:1,  titre:'Suites numériques',           ordre:1,  score:72 },
    { id:2,  titre:'Fonctions et dérivées',       ordre:2,  score:48 },
    { id:3,  titre:'Probabilités et statistiques',ordre:3,  score:65 },
    { id:4,  titre:'Nombres complexes',           ordre:4,  score:80 },
    { id:5,  titre:'Géométrie dans l\'espace',    ordre:5,  score:60 },
    { id:6,  titre:'Intégration',                 ordre:6,  score:null },
    { id:7,  titre:'Équations différentielles',   ordre:7,  score:null },
    { id:8,  titre:'Arithmétique',                ordre:8,  score:null },
    { id:9,  titre:'Trigonométrie',               ordre:9,  score:null },
    { id:10, titre:'Matrices et systèmes',        ordre:10, score:null },
  ],
  2: [
    { id:11, titre:'Mécanique du point',          ordre:1,  score:62 },
    { id:12, titre:'Optique géométrique',         ordre:2,  score:42 },
    { id:13, titre:'Électricité',                 ordre:3,  score:70 },
    { id:14, titre:'Thermodynamique',             ordre:4,  score:null },
    { id:15, titre:'Ondes mécaniques',            ordre:5,  score:null },
  ],
}

const MATIERES = {
  1: { nom: 'Mathématiques', icone: '📐', couleur: '#185FA5' },
  2: { nom: 'Physique-Chimie', icone: '⚗️', couleur: '#534AB7' },
  3: { nom: 'SVT', icone: '🌿', couleur: '#3B6D11' },
  4: { nom: 'Philosophie', icone: '🤔', couleur: '#BA7517' },
  5: { nom: 'Histoire-Géographie', icone: '🌍', couleur: '#993C1D' },
}

function ScoreDot({ score }) {
  if (score === null) return <span className="text-xs text-gray-300">Non commencé</span>
  if (score >= 75) return <span className="score-badge score-good">{score}%</span>
  if (score >= 50) return <span className="score-badge score-mid">{score}%</span>
  return <span className="score-badge score-low">{score}%</span>
}

export default function Chapitres() {
  const { id } = useParams()
  const navigate = useNavigate()
  const matiere = MATIERES[id] || { nom: 'Matière', icone: '📚', couleur: '#185FA5' }
  const [chapitres, setChapitres] = useState(DEMO_CHAPITRES[id] || [])

  useEffect(() => {
    api.get(`/chapitres?matiere_id=${id}`)
      .then(res => { if (res.data.data?.length) setChapitres(res.data.data) })
      .catch(() => {})
  }, [id])

  return (
    <div className="max-w-3xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/matieres')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{matiere.icone}</span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{matiere.nom}</h1>
            <p className="text-sm text-gray-400">{chapitres.length} chapitres au programme</p>
          </div>
        </div>
      </div>

      {/* Liste des chapitres */}
      <div className="space-y-2">
        {chapitres.map(ch => (
          <div key={ch.id} className="card p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              {/* Numéro */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
                style={{ backgroundColor: matiere.couleur + '15', color: matiere.couleur }}>
                {ch.ordre}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{ch.titre}</p>
                <div className="flex items-center gap-3 mt-1">
                  <ScoreDot score={ch.score} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link to={`/chapitres/${ch.id}/cours`}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary px-2.5 py-1.5 rounded-lg hover:bg-primary-light transition-colors">
                  <BookOpen size={13} /> Cours
                </Link>
                <Link to={`/quiz?chapitre_id=${ch.id}`}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 px-2.5 py-1.5 rounded-lg hover:bg-purple-light transition-colors">
                  <Brain size={13} /> Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
