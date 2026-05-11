// QuizList.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Brain, Clock, ChevronRight } from 'lucide-react'

const DEMO = [
  { id:1, titre:'Quiz Dérivées — Facile',   niveau:'facile',    matiere:'Mathématiques', chapitre:'Fonctions et dérivées', nb_questions:10, temps_limite:900  },
  { id:2, titre:'Quiz Dérivées — Moyen',    niveau:'moyen',     matiere:'Mathématiques', chapitre:'Fonctions et dérivées', nb_questions:10, temps_limite:1200 },
  { id:3, titre:'Quiz Dérivées — Difficile',niveau:'difficile', matiere:'Mathématiques', chapitre:'Fonctions et dérivées', nb_questions:10, temps_limite:1800 },
  { id:4, titre:'Quiz Génétique — Facile',  niveau:'facile',    matiere:'SVT',           chapitre:'Génétique et hérédité', nb_questions:5,  temps_limite:600  },
  { id:5, titre:'Quiz Suites — Moyen',      niveau:'moyen',     matiere:'Mathématiques', chapitre:'Suites numériques',     nb_questions:10, temps_limite:1200 },
  { id:6, titre:'Quiz Mécanique — Difficile',niveau:'difficile',matiere:'Physique-Chimie',chapitre:'Mécanique du point',   nb_questions:10, temps_limite:1800 },
]

const NIVEAU_STYLE = {
  facile:    'bg-green-50 text-green-700 border-green-200',
  moyen:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  difficile: 'bg-red-50 text-red-700 border-red-200',
}

export default function QuizList() {
  const [searchParams] = useSearchParams()
  const chapitreId = searchParams.get('chapitre_id')
  const [quizList, setQuizList] = useState(DEMO)
  const [filtre, setFiltre]     = useState('tous')

  useEffect(() => {
    const url = chapitreId ? `/quiz?chapitre_id=${chapitreId}` : '/quiz'
    api.get(url)
      .then(res => { if (res.data.data?.length) setQuizList(res.data.data) })
      .catch(() => {})
  }, [chapitreId])

  const filtered = filtre === 'tous' ? quizList : quizList.filter(q => q.niveau === filtre)

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Quiz interactifs</h1>
        <p className="text-sm text-gray-500 mt-1">Teste tes connaissances avec le chronomètre</p>
      </div>

      {/* Filtre niveau */}
      <div className="flex gap-2 mb-5">
        {['tous','facile','moyen','difficile'].map(n => (
          <button key={n} onClick={() => setFiltre(n)}
            className={`text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filtre === n
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {n}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(q => (
          <div key={q.id} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-light rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain size={18} style={{ color: '#534AB7' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{q.titre}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${NIVEAU_STYLE[q.niveau]}`}>
                  {q.niveau}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400">{q.matiere}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  {Math.floor(q.temps_limite / 60)} min
                </span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{q.nb_questions} questions</span>
              </div>
            </div>
            <Link to={`/quiz/${q.id}/play`}
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap">
              Commencer <ChevronRight size={15} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
