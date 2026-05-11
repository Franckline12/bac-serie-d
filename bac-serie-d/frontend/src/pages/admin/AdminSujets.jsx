import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Archive, Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react'

const FORM_VIDE = { annee: new Date().getFullYear(), titre: '', correction_complete: '', matiere_id: '' }

export default function AdminSujets() {
  const [sujets, setSujets]     = useState([])
  const [matieres, setMatieres] = useState([])
  const [form, setForm]         = useState(FORM_VIDE)
  const [editing, setEditing]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [openId, setOpenId]     = useState(null)
  const [msg, setMsg]           = useState('')
  const [loading, setLoading]   = useState(false)

  const fetchAll = async () => {
    try {
      const [s, m] = await Promise.all([api.get('/sujets'), api.get('/matieres')])
      setSujets(Array.isArray(s.data.data) ? s.data.data : [])
      setMatieres(Array.isArray(m.data.data) ? m.data.data : [])
    } catch {}
  }

  useEffect(() => { fetchAll() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.titre || !form.correction_complete || !form.matiere_id || !form.annee)
      return setMsg('❌ Tous les champs sont obligatoires')
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/sujets/${editing}`, form)
        setMsg('✅ Sujet mis à jour !')
      } else {
        await api.post('/sujets', form)
        setMsg('✅ Sujet ajouté !')
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

  const handleEdit = s => {
    setForm({ annee: s.annee, titre: s.titre, correction_complete: s.correction_complete, matiere_id: s.matiere_id })
    setEditing(s.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer ce sujet ?')) return
    try { await api.delete(`/sujets/${id}`) } catch {}
    setSujets(s => s.filter(x => x.id !== id))
    setMsg('✅ Sujet supprimé')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Archive size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sujets Bac & Corrigés</h1>
            <p className="text-sm text-gray-500">{sujets.length} sujets disponibles</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(FORM_VIDE) }}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={15} /> Nouveau sujet
        </button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${
          msg.startsWith('✅') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>{msg}</div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {editing ? '✏️ Modifier le sujet' : '➕ Nouveau sujet bac'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
              className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select value={form.matiere_id} onChange={set('matiere_id')} required
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">-- Matière --</option>
                  {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Année <span className="text-red-500">*</span>
                </label>
                <input type="number" value={form.annee} onChange={set('annee')} required
                  min="2000" max="2030"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.titre} onChange={set('titre')} required
                  placeholder="Ex: Bac Série D 2024 — Maths"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correction complète <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Écris la correction complète du sujet, exercice par exercice.
              </p>
              <textarea value={form.correction_complete} onChange={set('correction_complete')} required rows={15}
                placeholder={`CORRECTION OFFICIELLE — BAC SÉRIE D 2024\n\nEXERCICE 1 : Suites numériques (5 pts)\n----------------------------------------\n1. u₀ = 3, u_{n+1} = 2u_n + 1\n   On pose v_n = u_n + 1\n   v_{n+1} = u_{n+1} + 1 = 2u_n + 2 = 2v_n\n   Donc (v_n) est géométrique de raison 2\n   v_n = v₀ × 2ⁿ = 4 × 2ⁿ\n   u_n = 4 × 2ⁿ - 1\n\n2. lim u_n = +∞ (raison > 1)\n\nEXERCICE 2 : Probabilités (5 pts)\n----------------------------------------\n...\n\nPROBLÈME : Fonctions (10 pts)\n----------------------------------------\n...`}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                <Save size={14} />
                {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Enregistrer le sujet'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
                className="px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste sujets */}
      <div className="space-y-3">
        {sujets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Archive size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun sujet — clique sur "Nouveau sujet" pour commencer</p>
          </div>
        ) : (
          sujets.map(s => (
            <div key={s.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold text-blue-600">
                  {s.annee?.toString().slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{s.titre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.matiere} · {s.annee}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setOpenId(openId === s.id ? null : s.id)}
                    className="flex items-center gap-1 text-xs text-blue-600 px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">
                    {openId === s.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Corrigé
                  </button>
                  <button onClick={() => handleEdit(s)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {openId === s.id && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-950/20 px-5 py-4">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Correction complète</p>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {s.correction_complete}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
