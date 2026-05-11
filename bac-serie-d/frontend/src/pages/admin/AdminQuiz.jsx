import { useEffect, useState } from 'react'
import api from '../../services/api'
import { HelpCircle, Plus, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react'

const FORM_VIDE = { titre: '', niveau: 'moyen', temps_limite: 1200, chapitre_id: '' }
const Q_VIDE    = { question: '', choix1: '', choix2: '', choix3: '', choix4: '', bonne_reponse: 1, explication: '' }

export default function AdminQuiz() {
  const [quizList, setQuizList]   = useState([])
  const [chapitres, setChapitres] = useState([])
  const [form, setForm]           = useState(FORM_VIDE)
  const [questions, setQuestions] = useState([{ ...Q_VIDE }])
  const [showForm, setShowForm]   = useState(false)
  const [openQuizId, setOpenQuizId] = useState(null)
  const [msg, setMsg]             = useState('')
  const [loading, setLoading]     = useState(false)

  const fetchAll = async () => {
    try {
      const [q, ch] = await Promise.all([api.get('/quiz'), api.get('/chapitres')])
      setQuizList(Array.isArray(q.data.data) ? q.data.data : []); setChapitres(Array.isArray(ch.data.data) ? ch.data.data : [])
    } catch {}
  }
  useEffect(() => { fetchAll() }, [])

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setQ = (i, k) => e => setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [k]: e.target.value } : q))

  const addQuestion = () => setQuestions(qs => [...qs, { ...Q_VIDE }])
  const removeQuestion = i => setQuestions(qs => qs.filter((_, idx) => idx !== i))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.titre || !form.chapitre_id) return setMsg('❌ Titre et chapitre obligatoires')
    setLoading(true)
    try {
      await api.post('/quiz', { ...form, questions })
      setMsg('✅ Quiz créé avec ' + questions.length + ' questions !')
      setForm(FORM_VIDE); setQuestions([{ ...Q_VIDE }]); setShowForm(false); fetchAll()
    } catch (err) { setMsg('❌ ' + (err.response?.data?.message || err.message)) }
    finally { setLoading(false); setTimeout(() => setMsg(''), 4000) }
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer ce quiz et toutes ses questions ?')) return
    try { await api.delete(`/quiz/${id}`) } catch {}
    setQuizList(q => q.filter(x => x.id !== id))
  }

  const NIVEAU_CFG = { facile: 'bg-green-50 text-green-700', moyen: 'bg-yellow-50 text-yellow-700', difficile: 'bg-red-50 text-red-700' }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <HelpCircle size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Quiz & Questions</h1>
            <p className="text-sm text-gray-500">{quizList.length} quiz créés</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Plus size={15} /> Créer un quiz
        </button>
      </div>
      {msg && <div className={`text-sm px-4 py-3 rounded-lg border ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{msg}</div>}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="flex justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">➕ Créer un quiz</h2>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Infos quiz */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapitre <span className="text-red-500">*</span></label>
                <select value={form.chapitre_id} onChange={setF('chapitre_id')} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white dark:bg-gray-700">
                  <option value="">-- Choisir --</option>
                  {chapitres.map(c => <option key={c.id} value={c.id}>{c.matiere} › {c.titre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select value={form.niveau} onChange={setF('niveau')} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white dark:bg-gray-700">
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps (secondes)</label>
                <input type="number" value={form.temps_limite} onChange={setF('temps_limite')} min="60" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
              <input value={form.titre} onChange={setF('titre')} required placeholder="Ex: Quiz Dérivées — Moyen" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Questions ({questions.length})</h3>
                <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-xs text-purple-600 hover:underline">
                  <Plus size={12} /> Ajouter une question
                </button>
              </div>
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">Question {i + 1}</span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      )}
                    </div>
                    <textarea value={q.question} onChange={setQ(i, 'question')} required rows={2} placeholder="Écris la question ici..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                            parseInt(q.bonne_reponse) === n ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>{['A','B','C','D'][n-1]}</span>
                          <input value={q[`choix${n}`]} onChange={setQ(i, `choix${n}`)} required placeholder={`Choix ${n}`}
                            className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 items-center">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Bonne réponse</label>
                        <select value={q.bonne_reponse} onChange={setQ(i, 'bonne_reponse')} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none bg-white">
                          <option value={1}>A</option><option value={2}>B</option><option value={3}>C</option><option value={4}>D</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Explication (optionnel)</label>
                        <input value={q.explication} onChange={setQ(i, 'explication')} placeholder="Pourquoi c'est la bonne réponse..."
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
                <Save size={14} /> {loading ? 'Création...' : `Créer le quiz (${questions.length} questions)`}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Liste quiz */}
      <div className="space-y-2">
        {quizList.map(q => (
          <div key={q.id} className="bg-white dark:bg-gray-800 border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center"><HelpCircle size={16} className="text-purple-600" /></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm">{q.titre}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${NIVEAU_CFG[q.niveau]}`}>{q.niveau}</span>
                <span className="text-xs text-gray-400">{q.matiere} · {Math.floor(q.temps_limite/60)} min · {q.nb_questions} questions</span>
              </div>
            </div>
            <button onClick={() => handleDelete(q.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
