import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Brain } from 'lucide-react'

const DEMO_COURS = [
  {
    id: 1,
    titre: 'Introduction aux dérivées',
    resume: 'La dérivée mesure le taux de variation instantané d\'une fonction.',
    chapitre: 'Fonctions et dérivées',
    matiere: 'Mathématiques',
    contenu: `## 1. Définition de la dérivée

La dérivée de f en a est :
f'(a) = lim(h→0) [f(a+h) - f(a)] / h

Géométriquement, f'(a) représente la pente de la tangente à la courbe en x=a.

## 2. Règles de dérivation

- (xⁿ)' = n·xⁿ⁻¹
- (eˣ)' = eˣ
- (ln x)' = 1/x
- (sin x)' = cos x
- (cos x)' = -sin x
- (uv)' = u'v + uv'
- (u/v)' = (u'v - uv') / v²

## 3. Variations et extremums

Si f'(x) > 0 → f croissante
Si f'(x) < 0 → f décroissante
Si f'(x₀) = 0 et changement de signe → extremum local

## 4. Exemple complet

f(x) = 2x³ - 3x² - 12x + 4
f'(x) = 6x² - 6x - 12 = 6(x-2)(x+1)
Max local en x = -1 : f(-1) = 11
Min local en x = 2 : f(2) = -16`
  }
]

const DEMO_EXERCICES = [
  {
    id: 1,
    enonce: 'Soit f(x) = x³ - 6x² + 9x + 1. Calculer f\'(x) et étudier les variations de f.',
    correction_detaillee: `Étape 1 : f'(x) = 3x² - 12x + 9 = 3(x-1)(x-3)
Étape 2 : f'(x) = 0 ⟹ x = 1 ou x = 3
Étape 3 :
• x < 1 : f'(x) > 0 → f croissante
• 1 < x < 3 : f'(x) < 0 → f décroissante
• x > 3 : f'(x) > 0 → f croissante
Maximum local en x=1 : f(1) = 5
Minimum local en x=3 : f(3) = 1`,
    niveau: 'moyen'
  },
  {
    id: 2,
    enonce: 'Trouver l\'équation de la tangente à y = x² au point (2, 4).',
    correction_detaillee: `Étape 1 : f'(x) = 2x donc f'(2) = 4
Étape 2 : Équation : y - 4 = 4(x - 2)
Résultat : y = 4x - 4`,
    niveau: 'facile'
  },
  {
    id: 3,
    enonce: 'Étudier f(x) = (x² - 1)/(x + 2) : domaine, dérivée, variations.',
    correction_detaillee: `Domaine : ℝ \\ {-2}
f'(x) = [(2x)(x+2) - (x²-1)(1)] / (x+2)²
     = (x² + 4x + 1) / (x+2)²
Racines : x = -2 ± √3
x₁ ≈ -3,73 (min local)
x₂ ≈ -0,27 (max local)`,
    niveau: 'difficile'
  }
]

function NiveauBadge({ niveau }) {
  const cfg = {
    facile:   'bg-green-50 text-green-700',
    moyen:    'bg-yellow-50 text-yellow-700',
    difficile:'bg-red-50 text-red-700',
  }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cfg[niveau] || ''}`}>{niveau}</span>
}

function ExerciceItem({ exo }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <NiveauBadge niveau={exo.niveau} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{exo.enonce}</p>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)}
          className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {open ? 'Masquer la correction' : 'Voir la correction'}
        </button>
      </div>
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-green-50 dark:bg-green-950/20 p-4">
          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Correction détaillée</p>
          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {exo.correction_detaillee}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function CoursPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cours, setCours]         = useState(DEMO_COURS)
  const [exercices, setExercices] = useState(DEMO_EXERCICES)
  const [tab, setTab]             = useState('cours')

  useEffect(() => {
    api.get(`/cours?chapitre_id=${id}`)
      .then(res => { if (res.data.data?.length) setCours(res.data.data) })
      .catch(() => {})
    api.get(`/exercices?chapitre_id=${id}`)
      .then(res => { if (res.data.data?.length) setExercices(res.data.data) })
      .catch(() => {})
  }, [id])

  const tabs = [
    { key: 'cours',     label: 'Cours',     count: cours.length },
    { key: 'exercices', label: 'Exercices', count: exercices.length },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </button>
        <div>
          <p className="text-xs text-gray-400">Mathématiques › Fonctions et dérivées</p>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Contenu du chapitre</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary-light text-primary' : 'bg-gray-200 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contenu Cours */}
      {tab === 'cours' && (
        <div className="space-y-4">
          {cours.map(c => (
            <Link key={c.id} to={`/cours/${c.id}`}
              className="card p-5 block hover:shadow-md transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {c.titre}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.resume}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Contenu Exercices */}
      {tab === 'exercices' && (
        <div className="space-y-3">
          {exercices.map((exo, i) => (
            <ExerciceItem key={exo.id} exo={exo} />
          ))}
        </div>
      )}

      {/* CTA Quiz */}
      <div className="mt-6 p-4 bg-purple-light rounded-xl flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Prêt à te tester ?</p>
          <p className="text-xs text-purple-500 mt-0.5">Quiz disponibles pour ce chapitre</p>
        </div>
        <Link to={`/quiz?chapitre_id=${id}`}
          className="flex items-center gap-2 bg-purple-DEFAULT text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#534AB7' }}>
          <Brain size={15} />
          Faire le quiz
        </Link>
      </div>
    </div>
  )
}
