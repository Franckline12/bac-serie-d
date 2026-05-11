import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft } from 'lucide-react'

const DEMO = {
  titre: 'Introduction aux dérivées',
  resume: 'La dérivée mesure le taux de variation instantané.',
  chapitre: 'Fonctions et dérivées',
  matiere: 'Mathématiques',
  contenu: `## 1. Définition de la dérivée

La dérivée de f en a est :
f'(a) = lim(h→0) [f(a+h) - f(a)] / h

Géométriquement, f'(a) représente la pente de la tangente à la courbe en x=a.

## 2. Règles de dérivation

• (xⁿ)' = n·xⁿ⁻¹
• (eˣ)' = eˣ
• (ln x)' = 1/x
• (sin x)' = cos x
• (cos x)' = -sin x
• (u+v)' = u' + v'
• (uv)' = u'v + uv'
• (u/v)' = (u'v - uv') / v²

## 3. Variations et extremums

Si f'(x) > 0 sur ]a,b[ → f est croissante sur ]a,b[
Si f'(x) < 0 sur ]a,b[ → f est décroissante sur ]a,b[
Si f'(x₀) = 0 et changement de signe → extremum local en x₀

## 4. Exemple complet

Soit f(x) = 2x³ - 3x² - 12x + 4

f'(x) = 6x² - 6x - 12 = 6(x² - x - 2) = 6(x-2)(x+1)

f'(x) = 0 ⟹ x = -1 ou x = 2

• x < -1 : f'(x) > 0 → f croissante
• -1 < x < 2 : f'(x) < 0 → f décroissante
• x > 2 : f'(x) > 0 → f croissante

Maximum local en x=-1 : f(-1) = -2-3+12+4 = 11
Minimum local en x=2 : f(2) = 16-12-24+4 = -16`
}

// Rendu simple du markdown en HTML basique
function renderContenu(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## '))
      return <h3 key={i} className="text-base font-semibold text-gray-900 dark:text-white mt-5 mb-2 first:mt-0">{line.slice(3)}</h3>
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* '))
      return <li key={i} className="text-sm text-gray-700 dark:text-gray-300 ml-4 leading-relaxed">{line.slice(2)}</li>
    if (line.match(/^f['']?\(|^[A-Za-z]'|lim|⟹|^•|^Soit|^Max|^Min|^Si /))
      return <div key={i} className="formula">{line}</div>
    if (line.trim() === '')
      return <div key={i} className="h-2" />
    return <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-1">{line}</p>
  })
}

export default function CoursDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cours, setCours] = useState(DEMO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/cours/${id}`)
      .then(res => setCours(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </button>
        <div>
          <p className="text-xs text-gray-400">{cours.matiere} › {cours.chapitre}</p>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{cours.titre}</h1>
        </div>
      </div>

      {cours.resume && (
        <div className="bg-primary-light border-l-4 border-primary p-4 rounded-r-xl mb-5">
          <p className="text-sm text-primary font-medium">{cours.resume}</p>
        </div>
      )}

      <div className="card p-6">
        <div className="prose prose-sm max-w-none">
          {renderContenu(cours.contenu || '')}
        </div>
      </div>
    </div>
  )
}
