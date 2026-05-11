const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/quiz
router.get('/', protect, async (req, res) => {
  const { chapitre_id, niveau } = req.query;
  try {
    let query = `
      SELECT q.id, q.titre, q.niveau, q.temps_limite, q.chapitre_id,
             c.titre AS chapitre, m.nom AS matiere,
             COUNT(qu.id) AS nb_questions
      FROM quiz q
      JOIN chapitres c ON q.chapitre_id = c.id
      JOIN matieres m ON c.matiere_id = m.id
      LEFT JOIN questions qu ON qu.quiz_id = q.id
      WHERE 1=1
    `
    const bind = []
    let i = 1
    if (chapitre_id) {
      query += ` AND q.chapitre_id = $${i++}`
      bind.push(chapitre_id)
    }
    if (niveau) {
      query += ` AND q.niveau = $${i++}`
      bind.push(niveau)
    }
    query += ' GROUP BY q.id, c.titre, m.nom ORDER BY q.id'

    const [rows] = await sequelize.query(query, { bind })
    console.log('Quiz trouvés:', rows.length)
    res.json({ success: true, data: rows })
  } catch (err) {
    console.error('Erreur quiz:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
});

// GET /api/quiz/:id — quiz + questions
router.get('/:id', protect, async (req, res) => {
  try {
    const [quiz] = await sequelize.query(
      `SELECT q.*, c.titre AS chapitre, m.nom AS matiere
       FROM quiz q
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE q.id = $1`,
      { bind: [req.params.id] }
    )
    if (!quiz.length)
      return res.status(404).json({ success: false, message: 'Quiz non trouvé' })

    const [questions] = await sequelize.query(
      `SELECT id, question, choix1, choix2, choix3, choix4
       FROM questions 
       WHERE quiz_id = $1 
       ORDER BY id`,
      { bind: [req.params.id] }
    )

    res.json({
      success: true,
      data: { ...quiz[0], questions }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
});

// POST /api/quiz — créer quiz + questions
router.post('/', protect, adminOnly, async (req, res) => {
  const { titre, niveau, temps_limite, chapitre_id, questions } = req.body
  if (!titre || !chapitre_id)
    return res.status(400).json({
      success: false,
      message: 'Titre et chapitre sont obligatoires'
    })
  try {
    // Créer le quiz
    const [quizRows] = await sequelize.query(
      `INSERT INTO quiz (titre, niveau, temps_limite, chapitre_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      { bind: [titre, niveau || 'moyen', temps_limite || 1200, chapitre_id] }
    )
    const quiz_id = quizRows[0].id

    // Ajouter les questions
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await sequelize.query(
          `INSERT INTO questions 
           (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          {
            bind: [
              q.question,
              q.choix1,
              q.choix2,
              q.choix3,
              q.choix4,
              q.bonne_reponse,
              q.explication || '',
              quiz_id
            ]
          }
        )
      }
    }

    console.log('Quiz créé avec', questions?.length || 0, 'questions')
    res.status(201).json({ success: true, data: quizRows[0] })
  } catch (err) {
    console.error('Erreur création quiz:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
});

// POST /api/quiz/:id/soumettre — soumettre les réponses
router.post('/:id/soumettre', protect, async (req, res) => {
  const { reponses, temps_utilise } = req.body
  try {
    const [questions] = await sequelize.query(
      'SELECT id, bonne_reponse, explication FROM questions WHERE quiz_id = $1',
      { bind: [req.params.id] }
    )

    let score = 0
    const corrections = questions.map(q => {
      const rep = reponses?.find(r => r.question_id === q.id)
      const correct = rep && rep.reponse_choisie === q.bonne_reponse
      if (correct) score++
      return {
        question_id: q.id,
        correct,
        bonne_reponse: q.bonne_reponse,
        explication: q.explication
      }
    })

    const pct = questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0

    // Enregistrer le score
    await sequelize.query(
      `INSERT INTO scores (user_id, quiz_id, score, nb_questions, temps_utilise)
       VALUES ($1, $2, $3, $4, $5)`,
      { bind: [req.user.id, req.params.id, pct, questions.length, temps_utilise || 0] }
    )

    // Mettre à jour la progression
    const [quizInfo] = await sequelize.query(
      `SELECT m.id AS matiere_id FROM quiz q
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE q.id = $1`,
      { bind: [req.params.id] }
    )

    if (quizInfo.length) {
      const matiere_id = quizInfo[0].matiere_id
      const [avgResult] = await sequelize.query(
        `SELECT COALESCE(ROUND(AVG(s.score)), 0) AS avg_score
         FROM scores s
         JOIN quiz q ON s.quiz_id = q.id
         JOIN chapitres c ON q.chapitre_id = c.id
         WHERE s.user_id = $1 AND c.matiere_id = $2`,
        { bind: [req.user.id, matiere_id] }
      )

      await sequelize.query(
        `INSERT INTO progression (user_id, matiere_id, pourcentage, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, matiere_id)
         DO UPDATE SET pourcentage = $3, updated_at = NOW()`,
        { bind: [req.user.id, matiere_id, avgResult[0].avg_score] }
      )
    }

    res.json({
      success: true,
      data: {
        score: pct,
        corrections,
        nb_bonnes: score,
        nb_questions: questions.length
      }
    })
  } catch (err) {
    console.error('Erreur soumission quiz:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
});

// DELETE /api/quiz/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query(
      'DELETE FROM questions WHERE quiz_id = $1',
      { bind: [req.params.id] }
    )
    await sequelize.query(
      'DELETE FROM quiz WHERE id = $1',
      { bind: [req.params.id] }
    )
    res.json({ success: true, message: 'Quiz supprimé' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
});

module.exports = router;