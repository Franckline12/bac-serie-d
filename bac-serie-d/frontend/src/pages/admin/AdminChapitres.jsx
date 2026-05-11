import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookMarked, Plus, Trash2, X, Save } from 'lucide-react'

const FORM_VIDE = { titre: '', matiere_id: '', ordre: 1 }

export default function AdminChapitres() {
  const [chapitres, setChapitres] = useState([])
  const [matieres, setMatieres]   = useState([])
  const [form, setForm]           = useState(FORM_VIDE)
  const [showForm, setShowForm]   = useState(false)
  const [msg, setMsg]             = useState('')
  const [filtre, setFiltre]       = useState('')
  const [loading, setLoading]     = useState(true)

  const fetchAll = async () => {
    try {
      const [ch, m] = await Promise.all([
        api.get('/chapitres'),
        api.get('/matieres')
      ])
      setChapitres(Array.isArray(ch.data.data) ? ch.data.data : [])
      setMatieres(Array.isArray(m.data.data) ? m.data.data : [])
    } catch (err) {
      console.error('Erreur chargement:', err)
      setChapitres([])
      setMatieres([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.titre || !form.matiere_id)
      return setMsg('Titre et matière obligatoires')
    try {
      await api.post('/chapitres', form)
      setMsg('Chapitre ajouté !')
      setForm(FORM_VIDE); setShowForm(false); fetchAll()
    } catch (err) {
      setMsg('Erreur : ' + (err.response?.data?.message || err.message))
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer ce chapitre ?')) return
    try { await api.delete('/chapitres/' + id) } catch {}
    setChapitres(c => c.filter(x => x.id !== id))
  }

  const filtered = filtre
    ? chapitres.filter(c => String(c.matiere_id) === String(filtre))
    : chapitres

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <BookMarked size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Chapitres</h1>
            <p className="text-sm text-gray-500">{chapitres.length} chapitres</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setForm(FORM_VIDE) }}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Nouveau chapitre
        </button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-lg ${
          msg.startsWith('Chapitre ajouté') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>{msg}</div>
      )}

      <select value={filtre} onChange={e => setFiltre(e.target.value)}
        className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none">
        <option value="">Toutes les matières</option>
        {matieres.map(m => (
          <option key={m.id} value={m.id}>{m.nom}</option>
        ))}
      </select>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Nouveau chapitre</h2>
            <button onClick={() => setShowForm(false)}>
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matière *</label>
                <select value={form.matiere_id} onChange={set('matiere_id')} required
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none">
                  <option value="">-- Choisir --</option>
                  {matieres.map(m => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordre</label>
                <input type="number" value={form.ordre} onChange={set('ordre')} min="1"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre *</label>
              <input value={form.titre} onChange={set('titre')} required
                placeholder="Ex: Fonctions et dérivées"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Save size={14} /> Enregistrer
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookMarked size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun chapitre trouvé</p>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm font-semibold text-indigo-600">
                {c.ordre}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{c.titre}</p>
                <p className="text-xs text-gray-400">{c.matiere}</p>
              </div>
              <button onClick={() => handleDelete(c.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
