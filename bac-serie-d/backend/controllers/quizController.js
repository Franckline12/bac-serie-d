const { sequelize } = require('../config/database');

// GET /api/quiz — tous les quiz (filtres: chapitre_id, niveau)
exports.getAll = async (req, res) => {
  try {
    const { chapitre_id, niveau } = req.query;
    let where = 'WHERE 1=1';
    const bind = [];
    let i = 1;
    if (chapitre_id) { where += ` AND q.chapitre_id = $${i++}`; bind.push(chapitre_id); }
    if (niveau)      { where += ` AND q.niveau = $${i++}`;       bind.push(niveau); }

    const result = await sequelize.query(`
      SELECT q.*, c.titre AS chapitre, m.nom AS matiere,
             COUNT(qu.id) AS nb_questions
      FROM quiz q
      JOIN chapitres c ON q.chapitre_id = c.id
      JOIN matieres m ON c.matiere_id = m.id
      LEFT JOIN questions qu ON qu.quiz_id = q.id
      ${where}
      GROUP BY q.id, c.titre, m.nom
      ORDER BY q.id
    `, { bind, type: 'SELECT' });
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/quiz/:id — quiz + questions
exports.getOne = async (req, res) => {
  try {
    const quiz = await sequelize.query(
      `SELECT q.*, c.titre AS chapitre, m.nom AS matiere
       FROM quiz q
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE q.id = $1`,
      { bind: [req.params.id], type: 'SELECT' }
    );
    if (!quiz[0].length) return res.status(404).json({ success: false, message: 'Quiz non trouvé' });

    const questions = await sequelize.query(
      `SELECT id, question, choix1, choix2, choix3, choix4
       FROM questions WHERE quiz_id = $1 ORDER BY id`,
      { bind: [req.params.id], type: 'SELECT' }
    );
    res.json({ success: true, data: { ...quiz[0][0], questions: questions[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/quiz/:id/soumettre — soumettre les réponses
exports.soumettre = async (req, res) => {
  const { reponses, temps_utilise } = req.body;
  // reponses = [{ question_id, reponse_choisie }]
  try {
    const questions = await sequelize.query(
      'SELECT id, bonne_reponse, explication FROM questions WHERE quiz_id = $1',
      { bind: [req.params.id], type: 'SELECT' }
    );

    let score = 0;
    const corrections = questions[0].map(q => {
      const rep = reponses.find(r => r.question_id === q.id);
      const correct = rep && rep.reponse_choisie === q.bonne_reponse;
      if (correct) score++;
      return { question_id: q.id, correct, bonne_reponse: q.bonne_reponse, explication: q.explication };
    });

    const pct = Math.round((score / questions[0].length) * 100);

    // Enregistrer le score
    await sequelize.query(
      'INSERT INTO scores (user_id, quiz_id, score, nb_questions, temps_utilise) VALUES ($1,$2,$3,$4,$5)',
      { bind: [req.user.id, req.params.id, pct, questions[0].length, temps_utilise || 0] }
    );

    // Mettre à jour la progression de la matière
    const quizInfo = await sequelize.query(
      `SELECT m.id AS matiere_id FROM quiz q
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE q.id = $1`,
      { bind: [req.params.id], type: 'SELECT' }
    );
    if (quizInfo[0].length) {
      const matiere_id = quizInfo[0][0].matiere_id;
      const avgResult = await sequelize.query(
        `SELECT ROUND(AVG(s.score)) AS avg_score
         FROM scores s
         JOIN quiz q ON s.quiz_id = q.id
         JOIN chapitres c ON q.chapitre_id = c.id
         WHERE s.user_id = $1 AND c.matiere_id = $2`,
        { bind: [req.user.id, matiere_id], type: 'SELECT' }
      );
      const avgScore = avgResult[0][0].avg_score || 0;
      await sequelize.query(
        `INSERT INTO progression (user_id, matiere_id, pourcentage, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, matiere_id)
         DO UPDATE SET pourcentage = $3, updated_at = NOW()`,
        { bind: [req.user.id, matiere_id, avgScore] }
      );
    }

    res.json({ success: true, data: { score: pct, corrections, nb_bonnes: score, nb_questions: questions[0].length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/quiz — créer un quiz (admin)
exports.create = async (req, res) => {
  const { titre, niveau, temps_limite, chapitre_id, questions } = req.body;
  try {
    const quiz = await sequelize.query(
      'INSERT INTO quiz (titre, niveau, temps_limite, chapitre_id) VALUES ($1,$2,$3,$4) RETURNING *',
      { bind: [titre, niveau, temps_limite || 1800, chapitre_id], type: 'SELECT' }
    );
    const quiz_id = quiz[0][0].id;
    if (questions && questions.length) {
      for (const q of questions) {
        await sequelize.query(
          `INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          { bind: [q.question, q.choix1, q.choix2, q.choix3, q.choix4, q.bonne_reponse, q.explication || '', quiz_id] }
        );
      }
    }
    res.status(201).json({ success: true, data: quiz[0][0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
