import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { ChevronRight } from 'lucide-react'

const DEMO = [
  { id:1, nom:'Mathématiques',       icone:'📐', couleur:'#185FA5', progression:72 },
  { id:2, nom:'Physique-Chimie',     icone:'⚗️',  couleur:'#534AB7', progression:58 },
  { id:3, nom:'SVT',                 icone:'🌿', couleur:'#3B6D11', progression:80 },
  { id:4, nom:'Philosophie',         icone:'🤔', couleur:'#BA7517', progression:45 },
  { id:5, nom:'Histoire-Géographie', icone:'🌍', couleur:'#993C1D', progression:61 },
]

const INFO = {
  1: { chapitres:10, cours:10, questions:240, sujets:5 },
  2: { chapitres:8,  cours:8,  questions:200, sujets:5 },
  3: { chapitres:8,  cours:8,  questions:220, sujets:5 },
  4: { chapitres:8,  cours:8,  questions:160, sujets:4 },
  5: { chapitres:8,  cours:8,  questions:200, sujets:5 },
}

export default function Matieres() {
  const [matieres, setMatieres] = useState(DEMO)

  useEffect(() => {
    api.get('/matieres')
      .then(res => {
        // Sécuriser : vérifier que c'est bien un tableau
        const data = res.data.data
        if (Array.isArray(data) && data.length > 0) {
          setMatieres(data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Matières</h1>
        <p className="text-sm text-gray-500 mt-1">Programme officiel du Bac Série D — Madagascar</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {matieres.map(m => {
          const info = INFO[m.id] || { chapitres:0, cours:0, questions:0, sujets:0 }
          return (
            <Link key={m.id} to={'/matieres/' + m.id + '/chapitres'}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: (m.couleur || '#185FA5') + '20' }}>
                    {m.icone || '📚'}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900 dark:text-white">{m.nom}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {info.chapitres} chapitres · {info.questions} questions
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progression</span>
                  <span className="font-medium" style={{ color: m.couleur || '#185FA5' }}>
                    {m.progression || 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: (m.progression || 0) + '%', backgroundColor: m.couleur || '#185FA5' }} />
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                {[['Cours', info.cours], ['Sujets bac', info.sujets], ['Questions', info.questions]].map(([label, val]) => (
                  <div key={label} className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{val}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
