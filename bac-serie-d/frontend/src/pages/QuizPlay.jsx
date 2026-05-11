import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react'

// Questions de démonstration (Dérivées - Moyen)
const DEMO_QUIZ = {
  id: 2, titre: 'Quiz Dérivées — Moyen', niveau: 'moyen',
  chapitre: 'Fonctions et dérivées', matiere: 'Mathématiques', temps_limite: 1200,
  questions: [
    { id:1, question:'Quelle est la dérivée de f(x) = 3x⁴ - 2x³ + 5x - 7 ?',
      choix1:'12x³ - 6x² + 5', choix2:'12x³ - 6x² + 5x', choix3:'12x³ + 6x² + 5', choix4:'4x³ - 3x² + 5',
      bonne_reponse: 1,
      explication: 'On dérive terme à terme : (3x⁴)\'=12x³, (-2x³)\'=-6x², (5x)\'=5, (-7)\'=0.' },
    { id:2, question:'Si f\'(x) > 0 sur ]a, b[, alors f est :',
      choix1:'Décroissante', choix2:'Constante', choix3:'Croissante', choix4:'Nulle',
      bonne_reponse: 3, explication: 'Dérivée positive ⟺ fonction croissante sur l\'intervalle.' },
    { id:3, question:'Quelle est la dérivée de f(x) = eˣ · sin(x) ?',
      choix1:'eˣcos(x)', choix2:'eˣ(sin x + cos x)', choix3:'eˣ(sin x - cos x)', choix4:'eˣ · sin x',
      bonne_reponse: 2, explication: '(uv)\' = u\'v + uv\' = eˣsin x + eˣcos x = eˣ(sin x + cos x).' },
    { id:4, question:'Pour f(x) = √x, f\'(x) vaut :',
      choix1:'2√x', choix2:'1/(2√x)', choix3:'√x/2', choix4:'1/√x',
      bonne_reponse: 2, explication: 'f(x)=x^(1/2), f\'(x)=(1/2)x^(-1/2)=1/(2√x).' },
    { id:5, question:'L\'équation de la tangente à y = x² en (1,1) est :',
      choix1:'y = x', choix2:'y = 2x - 1', choix3:'y = 2x + 1', choix4:'y = x + 1',
      bonne_reponse: 2, explication: 'f\'(1)=2, tangente : y=2(x-1)+1=2x-1.' },
  ]
}

const OPTS = ['choix1','choix2','choix3','choix4']
const LETTERS = ['A','B','C','D']

export default function QuizPlay() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [currentQ, setCurrentQ]     = useState(0)
  const [reponses, setReponses]     = useState([])   // { question_id, reponse_choisie }
  const [selected, setSelected]     = useState(null) // index choix (0-3) ou null
  const [confirmed, setConfirmed]   = useState(false)
  const [timeLeft, setTimeLeft]     = useState(1200)
  const [timeUsed, setTimeUsed]     = useState(0)
  const [finished, setFinished]     = useState(false)
  const [result, setResult]         = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/quiz/${id}`)
      .then(res => { setQuiz(res.data.data); setTimeLeft(res.data.data.temps_limite || 1200) })
      .catch(() => setQuiz(DEMO_QUIZ))
      .finally(() => setLoading(false))
  }, [id])

  // Chronomètre
  useEffect(() => {
    if (!quiz || finished) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); handleSubmit(); return 0 }
        return t - 1
      })
      setTimeUsed(u => u + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [quiz, finished])

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const questions = quiz?.questions || []
  const q = questions[currentQ]

  const handleSelect = (idx) => {
    if (confirmed) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setConfirmed(true)
    setReponses(prev => [...prev, { question_id: q.id, reponse_choisie: selected + 1 }])
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(i => i + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = useCallback(async () => {
    if (finished || submitting) return
    setSubmitting(true)
    setFinished(true)
    // Ajouter la dernière réponse si pas encore ajoutée
    const finalReponses = selected !== null && !confirmed
      ? [...reponses, { question_id: q?.id, reponse_choisie: selected + 1 }]
      : reponses

    try {
      const res = await api.post(`/quiz/${id}/soumettre`, {
        reponses: finalReponses, temps_utilise: timeUsed
      })
      setResult(res.data.data)
    } catch {
      // Calcul local si pas d'API
      let score = 0
      finalReponses.forEach(r => {
        const question = questions.find(q => q.id === r.question_id)
        if (question && r.reponse_choisie === question.bonne_reponse) score++
      })
      setResult({
        score: Math.round((score / questions.length) * 100),
        nb_bonnes: score,
        nb_questions: questions.length,
        corrections: questions.map(q => {
          const rep = finalReponses.find(r => r.question_id === q.id)
          return {
            question_id: q.id,
            correct: rep?.reponse_choisie === q.bonne_reponse,
            bonne_reponse: q.bonne_reponse,
            explication: q.explication
          }
        })
      })
    } finally {
      setSubmitting(false)
    }
  }, [reponses, questions, id, timeUsed, selected, confirmed, q])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  // Écran de résultat
  if (finished && result) {
    const emoji = result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '💪'
    return (
      <div className="max-w-xl mx-auto fade-in">
        <div className="card p-8 text-center mb-6">
          <div className="text-5xl mb-4">{emoji}</div>
          <div className={`text-5xl font-bold mb-2 ${
            result.score >= 75 ? 'text-success' : result.score >= 50 ? 'text-warning' : 'text-danger'
          }`}>{result.score}%</div>
          <p className="text-gray-500 text-sm">{result.nb_bonnes} / {result.nb_questions} bonnes réponses</p>
          <p className="text-gray-400 text-xs mt-1">Temps : {formatTime(timeUsed)}</p>

          {result.score < 60 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
              💡 Nous te recommandons de revoir le cours sur ce chapitre.
            </div>
          )}
        </div>

        {/* Corrections */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Corrections détaillées</h2>
          {questions.map((q, i) => {
            const corr = result.corrections?.find(c => c.question_id === q.id)
            const rep = reponses.find(r => r.question_id === q.id)
            const correct = corr?.correct
            return (
              <div key={q.id} className={`card p-4 border-l-4 ${correct ? 'border-green-400' : 'border-red-400'}`}>
                <div className="flex gap-2 mb-2">
                  {correct
                    ? <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                    : <XCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                  }
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
                </div>
                {!correct && rep && (
                  <p className="text-xs text-danger ml-6 mb-1">
                    Votre réponse : {q[OPTS[rep.reponse_choisie - 1]]}
                  </p>
                )}
                <p className="text-xs text-success ml-6 mb-2">
                  Bonne réponse : {q[OPTS[corr?.bonne_reponse - 1]]}
                </p>
                {corr?.explication && (
                  <p className="text-xs text-gray-500 ml-6 italic">{corr.explication}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setFinished(false); setCurrentQ(0); setReponses([]); setSelected(null); setConfirmed(false); setTimeLeft(quiz.temps_limite); setTimeUsed(0); setResult(null) }}
            className="flex-1 btn-secondary flex items-center justify-center gap-2">
            <RotateCcw size={14} /> Recommencer
          </button>
          <button onClick={() => navigate('/quiz')}
            className="flex-1 btn-primary flex items-center justify-center gap-2">
            <Trophy size={14} /> Voir les résultats
          </button>
        </div>
      </div>
    )
  }

  if (!q) return <div className="text-center text-gray-400 py-12">Aucune question disponible</div>

  const isLow = timeLeft < 60

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* Header quiz */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400">{quiz?.matiere} · {quiz?.chapitre}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">Niveau : {quiz?.niveau}</p>
        </div>
        <div className={`flex items-center gap-2 text-lg font-mono font-semibold px-4 py-2 rounded-xl ${
          isLow ? 'bg-red-50 text-danger' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }`}>
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${
            i < currentQ ? 'bg-primary' : i === currentQ ? 'bg-purple-DEFAULT' : 'bg-gray-200 dark:bg-gray-700'
          }`} style={{ backgroundColor: i < currentQ ? '#185FA5' : i === currentQ ? '#534AB7' : undefined }} />
        ))}
      </div>

      {/* Compteur */}
      <p className="text-xs text-gray-400 mb-3">Question {currentQ + 1} / {questions.length}</p>

      {/* Question */}
      <div className="card p-6 mb-4">
        <p className="text-base font-medium text-gray-900 dark:text-white leading-relaxed mb-6">
          {q.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {OPTS.map((opt, idx) => {
            const isSelected = selected === idx
            const isCorrect  = confirmed && idx + 1 === q.bonne_reponse
            const isWrong    = confirmed && isSelected && idx + 1 !== q.bonne_reponse

            return (
              <button key={opt} onClick={() => handleSelect(idx)}
                disabled={confirmed}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                  : isWrong  ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                  : isSelected ? 'border-primary bg-primary-light'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  isCorrect ? 'border-green-500 bg-green-500 text-white'
                  : isWrong  ? 'border-red-500 bg-red-500 text-white'
                  : isSelected ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-500'
                }`}>
                  {LETTERS[idx]}
                </span>
                <span className={`text-sm ${
                  isCorrect ? 'text-green-700 dark:text-green-400 font-medium'
                  : isWrong  ? 'text-red-700 dark:text-red-400'
                  : isSelected ? 'text-primary font-medium'
                  : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {q[opt]}
                </span>
                {isCorrect && <CheckCircle size={16} className="text-success ml-auto flex-shrink-0" />}
                {isWrong   && <XCircle    size={16} className="text-danger ml-auto flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {confirmed && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            selected + 1 === q.bonne_reponse
              ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
          }`}>
            {selected + 1 === q.bonne_reponse ? '✓ Correct ! ' : '✗ Incorrect. '}
            {q.explication}
          </div>
        )}
      </div>

      {/* Boutons */}
      {!confirmed ? (
        <button onClick={handleConfirm} disabled={selected === null}
          className="w-full btn-primary py-3 disabled:opacity-40">
          Valider la réponse
        </button>
      ) : (
        <button onClick={handleNext}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2">
          {currentQ < questions.length - 1 ? (
            <><ArrowRight size={16} /> Question suivante</>
          ) : (
            <><Trophy size={16} /> Voir mes résultats</>
          )}
        </button>
      )}
    </div>
  )
}
