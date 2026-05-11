import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Plus, Pencil, Trash2, X, Save } from 'lucide-react'

const FORM_VIDE = {
  titre: '', resume: '', contenu: '', chapitre_id: ''
}

export default function AdminCours() {
  const [cours, setCours]         = useState([])
  const [chapitres, setChapitres] = useState([])
  const [form, setForm]           = useState(FORM_VIDE)
  const [editing, setEditing]     = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [msg, setMsg]             = useState('')
  const [loading, setLoading]     = useState(false)

  const fetchAll = async () => {
    try {
      const [c, ch] = await Promise.all([
        api.get('/cours'),
        api.get('/chapitres')
      ])
      setCours(Array.isArray(c.data.data) ? c.data.data : [])
      setChapitres(Array.isArray(ch.data.data) ? ch.data.data : [])
    } catch {}
  }

  useEffect(() => { fetchAll() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.titre || !form.contenu || !form.chapitre_id)
      return setMsg('❌ Titre, contenu et chapitre sont obligatoires')
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/cours/${editing}`, form)
        setMsg('✅ Cours mis à jour !')
      } else {
        await api.post('/cours', form)
        setMsg('✅ Cours ajouté !')
      }
      setForm(FORM_VIDE)
      setEditing(null)
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setMsg('❌ Erreur : ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const handleEdit = (c) => {
    setForm({
      titre:       c.titre,
      resume:      c.resume || '',
      contenu:     c.contenu,
      chapitre_id: c.chapitre_id
    })
    setEditing(c.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce cours ?')) return
    try {
      await api.delete(`/cours/${id}`)
      setCours(c => c.filter(x => x.id !== id))
      setMsg('✅ Cours supprimé')
    } catch {
      setMsg('❌ Erreur suppression')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gestion des Cours</h1>
            <p className="text-sm text-gray-500">{cours.length} cours disponibles</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(FORM_VIDE) }}
          className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Plus size={15} /> Nouveau cours
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
              {editing ? '✏️ Modifier le cours' : '➕ Nouveau cours'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chapitre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chapitre <span className="text-red-500">*</span>
              </label>
              <select value={form.chapitre_id} onChange={set('chapitre_id')} required
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">-- Sélectionner un chapitre --</option>
                {chapitres.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.matiere} › {ch.titre}
                  </option>
                ))}
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du cours <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.titre} onChange={set('titre')} required
                placeholder="Ex: Introduction aux dérivées"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            {/* Résumé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Résumé court
              </label>
              <input type="text" value={form.resume} onChange={set('resume')}
                placeholder="Ex: La dérivée mesure le taux de variation instantané"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenu du cours <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Tu peux utiliser ## pour les titres, • pour les listes, et écrire les formules directement.
              </p>
              <textarea value={form.contenu} onChange={set('contenu')} required rows={12}
                placeholder={`## 1. Définition\n\nLa dérivée de f en a est :\nf'(a) = lim(h→0) [f(a+h) - f(a)] / h\n\n## 2. Règles\n\n• (xⁿ)' = n·xⁿ⁻¹\n• (eˣ)' = eˣ\n\n## 3. Exemple\n\nSoit f(x) = 3x² + 2x\nf'(x) = 6x + 2`}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                <Save size={14} />
                {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Enregistrer le cours'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(FORM_VIDE) }}
                className="px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des cours */}
      <div className="space-y-2">
        {cours.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun cours — clique sur "Nouveau cours" pour commencer</p>
          </div>
        ) : (
          cours.map(c => (
            <div key={c.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-4">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{c.titre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {c.matiere} › {c.chapitre}
                </p>
                {c.resume && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{c.resume}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleEdit(c)}
                  className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(c.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
