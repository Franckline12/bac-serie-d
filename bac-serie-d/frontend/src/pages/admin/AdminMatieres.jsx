import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Layers, Plus, Trash2, X, Save } from 'lucide-react'

const FORM_VIDE = { nom: '', icone: '📚', couleur: '#185FA5' }

export default function AdminMatieres() {
  const [matieres, setMatieres] = useState([])
  const [form, setForm]         = useState(FORM_VIDE)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg]           = useState('')
  const [loading, setLoading]   = useState(true)

  const fetchAll = async () => {
    try {
      const res = await api.get('/matieres')
      setMatieres(Array.isArray(res.data.data) ? res.data.data : [])
    } catch { setMatieres([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nom) return setMsg('Nom obligatoire')
    try {
      await api.post('/matieres', form)
      setMsg('Matière ajoutée !'); setForm(FORM_VIDE); setShowForm(false); fetchAll()
    } catch (err) { setMsg('Erreur : ' + (err.response?.data?.message || err.message)) }
    setTimeout(() => setMsg(''), 3000)
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer cette matière et tout son contenu ?')) return
    try { await api.delete('/matieres/' + id) } catch {}
    setMatieres(m => m.filter(x => x.id !== id))
  }

  if (loading) return <div className="flex justify-center h-40 items-center"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"/></div>

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Layers size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Matières</h1>
            <p className="text-sm text-gray-500">{matieres.length} matières</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Plus size={15} /> Nouvelle matière
        </button>
      </div>

      {msg && <div className={`text-sm px-4 py-3 rounded-lg ${msg.includes('ajoutée') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Nouvelle matière</h2>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icône</label>
                <input value={form.icone} onChange={set('icone')}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center text-2xl dark:bg-gray-700 dark:text-white focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom *</label>
                <input value={form.nom} onChange={set('nom')} required placeholder="Ex: Mathématiques"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.couleur} onChange={set('couleur')}
                  className="w-10 h-10 rounded cursor-pointer border-0" />
                <span className="text-sm text-gray-500">{form.couleur}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
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
        {matieres.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Layers size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune matière</p>
          </div>
        ) : (
          matieres.map(m => (
            <div key={m.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: (m.couleur || '#185FA5') + '20' }}>
                {m.icone || '📚'}
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-white text-sm">{m.nom}</span>
              <button onClick={() => handleDelete(m.id)}
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
