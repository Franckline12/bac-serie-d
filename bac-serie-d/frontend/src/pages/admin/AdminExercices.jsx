import { useEffect, useState } from 'react'
import api from '../../services/api'
import { FileText, Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react'

const FORM_VIDE = { enonce: '', correction_detaillee: '', niveau: 'moyen', chapitre_id: '' }

function ExoCard({ exo, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const cfg = {
    facile:    'bg-green-50 text-green-700',
    moyen:     'bg-yellow-50 text-yellow-700',
    difficile: 'bg-red-50 text-red-700',
  }
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cfg[exo.niveau]}`}>
                {exo.niveau}
              </span>
              <span className="text-xs text-gray-400">{exo.matiere} › {exo.chapitre}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{exo.enonce}</p>
            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
              {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {open ? 'Masquer la correction' : 'Voir la correction'}
            </button>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onEdit(exo)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(exo.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-green-50 dark:bg-green-950/20 px-4 py-3">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">✓ Correction</p>
          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {exo.correction_detaillee}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function AdminExercices() {
  const [exercices, setExercices] = useState([])
  const [chapitres, setChapitres] = useState([])
  const [form, setForm]           = useState(FORM_VIDE)
  const [editing, setEditing]     = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [msg, setMsg]             = useState('')
  const [loading, setLoading]     = useState(false)

  const fetchAll = async () => {
    try {
      const [e, ch] = await Promise.all([api.get('/exercices'), api.get('/chapitres')])
      setExercices(e.data.data || [])
      setChapitres(ch.data.data || [])
    } catch {}
  }

  useEffect(() => { fetchAll() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.enonce || !form.correction_detaillee || !form.chapitre_id)
      return setMsg('❌ Énoncé, correction et chapitre sont obligatoires')
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/exercices/${editing}`, form)
        setMsg('✅ Exercice mis à jour !')
      } else {
        await api.post('/exercices', form)
        setMsg('✅ Exercice ajouté !')
      }
      setForm(FORM_VIDE); setEditing(null); setShowForm(false)
      fetchAll()
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const handleEdit = exo => {
    setForm({ enonce: exo.enonce, correction_detaillee: exo.correction_detaillee, niveau: exo.niveau, chapitre_id: exo.chapitre_id })
    setEditing(exo.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer cet exercice ?')) return
    try { await api.delete(`/exercices/${id}`) } catch {}
    setExercices(e => e.filter(x => x.id !== id))
    setMsg('✅ Exercice supprimé')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-yellow-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gestion des Exercices</h1>
            <p className="text-sm text-gray-500">{exercices.length} exercices avec corrections</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(FORM_VIDE) }}
          className="flex items-center gap-2 bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
          <Plus size={15} /> Nouvel exercice
        </button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${
          msg.startsWith('✅') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>{msg}</div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {editing ? '✏️ Modifier l\'exercice' : '➕ Nouvel exercice'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
              className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chapitre <span className="text-red-500">*</span>
                </label>
                <select value={form.chapitre_id} onChange={set('chapitre_id')} required
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">-- Choisir un chapitre --</option>
                  {chapitres.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.matiere} › {ch.titre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau</label>
                <select value={form.niveau} onChange={set('niveau')}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Énoncé de l'exercice <span className="text-red-500">*</span>
              </label>
              <textarea value={form.enonce} onChange={set('enonce')} required rows={4}
                placeholder="Ex: Soit f(x) = x³ - 6x² + 9x + 1. Calculer f'(x) et étudier les variations de f."
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correction détaillée <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Écris la correction étape par étape. Utilise des sauts de ligne pour séparer les étapes.
              </p>
              <textarea value={form.correction_detaillee} onChange={set('correction_detaillee')} required rows={8}
                placeholder={`Étape 1 : Calculer la dérivée\nf'(x) = 3x² - 12x + 9 = 3(x-1)(x-3)\n\nÉtape 2 : Trouver les racines\nf'(x) = 0 → x = 1 ou x = 3\n\nÉtape 3 : Tableau de variations\n- x < 1 : f'(x) > 0 → f croissante\n- 1 < x < 3 : f'(x) < 0 → f décroissante\n- x > 3 : f'(x) > 0 → f croissante`}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50">
                <Save size={14} />
                {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
                className="px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {exercices.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun exercice — clique sur "Nouvel exercice" pour commencer</p>
          </div>
        ) : (
          exercices.map(e => <ExoCard key={e.id} exo={e} onEdit={handleEdit} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
