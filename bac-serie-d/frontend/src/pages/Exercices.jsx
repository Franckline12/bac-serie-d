import { useEffect, useState } from 'react'
import api from '../services/api'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'

const DEMO = [
  { id:1, enonce:'Soit f(x) = x³ - 6x² + 9x + 1. Calculer f\'(x) et étudier les variations de f.',
    correction_detaillee:`f'(x) = 3x² - 12x + 9 = 3(x-1)(x-3)
x=1 : max local, f(1)=5
x=3 : min local, f(3)=1`,
    niveau:'moyen', chapitre:'Fonctions et dérivées', matiere:'Mathématiques' },
  { id:2, enonce:'Résoudre dans ℝ : 2x² - 5x + 3 = 0.',
    correction_detaillee:`Δ = 25 - 24 = 1
x₁ = (5+1)/4 = 3/2 et x₂ = (5-1)/4 = 1
Solution : {1 ; 3/2}`,
    niveau:'facile', chapitre:'Fonctions et dérivées', matiere:'Mathématiques' },
  { id:3, enonce:'Calculer la limite de f(x) = (x²-4)/(x-2) quand x→2.',
    correction_detaillee:`f(x) = (x-2)(x+2)/(x-2) = x+2 pour x ≠ 2
lim(x→2) f(x) = 2+2 = 4`,
    niveau:'facile', chapitre:'Fonctions et dérivées', matiere:'Mathématiques' },
  { id:4, enonce:'Un urne contient 5 boules rouges et 3 bleues. On tire 2 boules sans remise. Calculer P(2 rouges).',
    correction_detaillee:`P(2 rouges) = C(5,2)/C(8,2) = 10/28 = 5/14 ≈ 0,357`,
    niveau:'moyen', chapitre:'Probabilités et statistiques', matiere:'Mathématiques' },
  { id:5, enonce:'Démontrer que √2 est irrationnel.',
    correction_detaillee:`Supposons √2 = p/q avec pgcd(p,q)=1
2q² = p² → p² pair → p pair → p=2k
2q² = 4k² → q² = 2k² → q pair
Contradiction avec pgcd(p,q)=1. Donc √2 est irrationnel.`,
    niveau:'difficile', chapitre:'Arithmétique', matiere:'Mathématiques' },
]

const NIVEAU_CFG = {
  facile:   { label:'Facile',   cls:'bg-green-50 text-green-700' },
  moyen:    { label:'Moyen',    cls:'bg-yellow-50 text-yellow-700' },
  difficile:{ label:'Difficile',cls:'bg-red-50 text-red-700' },
}

function ExerciceCard({ exo }) {
  const [open, setOpen] = useState(false)
  const cfg = NIVEAU_CFG[exo.niveau] || {}
  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText size={15} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>
              <span className="text-xs text-gray-400">{exo.matiere} · {exo.chapitre}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{exo.enonce}</p>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)}
          className="mt-3 ml-11 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {open ? 'Masquer la correction' : 'Afficher la correction'}
        </button>
      </div>
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-green-50 dark:bg-green-950/20 px-5 py-4">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">✓ Correction</p>
          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {exo.correction_detaillee}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function Exercices() {
  const [exercices, setExercices] = useState(DEMO)
  const [filtre, setFiltre]       = useState('tous')

  useEffect(() => {
    api.get('/exercices')
      .then(res => { if (res.data.data?.length) setExercices(res.data.data) })
      .catch(() => {})
  }, [])

  const filtered = filtre === 'tous' ? exercices : exercices.filter(e => e.niveau === filtre)

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Exercices</h1>
        <p className="text-sm text-gray-500 mt-1">Avec corrections détaillées étape par étape</p>
      </div>
      <div className="flex gap-2 mb-5">
        {['tous','facile','moyen','difficile'].map(n => (
          <button key={n} onClick={() => setFiltre(n)}
            className={`text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filtre === n ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}>
            {n}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(e => <ExerciceCard key={e.id} exo={e} />)}
      </div>
    </div>
  )
}
