// Sujets.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Archive, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

const DEMO_SUJETS = [
  { id:1, annee:2023, titre:'Bac Série D 2023 — Mathématiques', matiere:'Mathématiques',
    correction_complete:`CORRECTION OFFICIELLE 2023

Exercice 1 : Suites (5 pts)
u₀ = 3, u_{n+1} = 2u_n + 1
Limite : l = -1 (suite arithmético-géométrique)
v_n = u_n + 1 géométrique de raison 2
→ u_n = 4×2ⁿ - 1

Exercice 2 : Probabilités (5 pts)
P(A∩B) = 0,12, P(A) = 0,3
→ P(B|A) = 0,12/0,3 = 0,4

Problème : Fonctions (10 pts)
f(x) = 2x³ - 9x² + 12x - 4 sur [0;3]
f'(x) = 6x² - 18x + 12 = 6(x-1)(x-2)
Max local en x=1 : f(1) = 1
Min local en x=2 : f(2) = 0` },
  { id:2, annee:2022, titre:'Bac Série D 2022 — SVT', matiere:'SVT',
    correction_complete:`CORRECTION OFFICIELLE 2022

Partie A : Génétique (8 pts)
Croisement test : P × homozygote récessif
50% yeux bleus, 50% yeux marrons → Parent hétérozygote Bb

Partie B : Géologie (7 pts)
Tectonique des plaques : subduction de la plaque océanique
Formation des chaînes de montagnes par collision continentale

Partie C : Physiologie (5 pts)
Réponse immunitaire spécifique : lymphocytes B → anticorps
Mémoire immunologique : réponse plus rapide à la 2ème infection` },
  { id:3, annee:2021, titre:'Bac Série D 2021 — Physique-Chimie', matiere:'Physique-Chimie',
    correction_complete:`CORRECTION OFFICIELLE 2021

Partie Physique : Mécanique (8 pts)
m = 2 kg, g = 10 m/s², θ = 30°
F = mg sin θ = 2×10×0,5 = 10 N
a = F/m = 5 m/s²

Partie Chimie : Solutions (7 pts)
pH = 4, [H₃O⁺] = 10⁻⁴ mol/L
Acide faible → pKa ≈ 4 + log(Ci/CA)` },
]

function SujetCard({ sujet }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Archive size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{sujet.titre}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={11} /> {sujet.annee}
                </span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{sujet.matiere}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline whitespace-nowrap">
            {open ? <><ChevronUp size={12} /> Masquer</> : <><ChevronDown size={12} /> Corrigé</>}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-950/20 px-5 py-4">
          <p className="text-xs font-semibold text-primary mb-2">Correction complète</p>
          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {sujet.correction_complete}
          </pre>
        </div>
      )}
    </div>
  )
}

export function Sujets() {
  const [sujets, setSujets] = useState(DEMO_SUJETS)
  const [filtre, setFiltre] = useState('Tous')
  const matieres = ['Tous', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Philosophie', 'Histoire-Géographie']

  useEffect(() => {
    api.get('/sujets').then(res => { if (res.data.data?.length) setSujets(res.data.data) }).catch(() => {})
  }, [])

  const filtered = filtre === 'Tous' ? sujets : sujets.filter(s => s.matiere === filtre)

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sujets Bac</h1>
        <p className="text-sm text-gray-500 mt-1">Annales officielles avec corrigés complets</p>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {matieres.map(m => (
          <button key={m} onClick={() => setFiltre(m)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              filtre === m ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
            }`}>
            {m}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(s => <SujetCard key={s.id} sujet={s} />)}
      </div>
    </div>
  )
}

export default Sujets
