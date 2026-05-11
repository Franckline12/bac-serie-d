const { sequelize } = require('../config/database');

exports.dashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    // Progression par matière
    const [prog] = await sequelize.query(
      `SELECT p.pourcentage, m.nom, m.icone, m.couleur, m.id AS matiere_id
       FROM progression p 
       JOIN matieres m ON p.matiere_id = m.id
       WHERE p.user_id = $1 
       ORDER BY m.id`,
      { bind: [userId] }
    );

    // Score moyen
    const [scoreAvg] = await sequelize.query(
      `SELECT 
         COALESCE(ROUND(AVG(score)), 0) AS score_moyen, 
         COUNT(*) AS nb_quiz 
       FROM scores 
       WHERE user_id = $1`,
      { bind: [userId] }
    );

    // Derniers quiz
    const [derniers] = await sequelize.query(
      `SELECT s.score, s.temps_utilise, s.created_at,
              q.titre AS quiz_titre, q.niveau,
              m.nom AS matiere
       FROM scores s
       JOIN quiz q ON s.quiz_id = q.id
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC 
       LIMIT 10`,
      { bind: [userId] }
    );

    // Chapitres faibles
    const [parChapitre] = await sequelize.query(
      `SELECT c.titre AS chapitre, m.nom AS matiere, 
              ROUND(AVG(s.score)) AS score_moyen
       FROM scores s
       JOIN quiz q ON s.quiz_id = q.id
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE s.user_id = $1
       GROUP BY c.id, c.titre, m.nom
       HAVING AVG(s.score) < 60
       ORDER BY AVG(s.score) ASC 
       LIMIT 3`,
      { bind: [userId] }
    );

    const recommandations = parChapitre.map(ch => ({
      type: 'faible',
      message: `Tu es faible en "${ch.chapitre}" (${ch.matiere}) avec ${ch.score_moyen}%`,
      action: `Revoir le cours sur ${ch.chapitre}`,
      chapitre: ch.chapitre,
      matiere: ch.matiere
    }));

    const progressionGlobale = prog.length
      ? Math.round(prog.reduce((sum, p) => sum + p.pourcentage, 0) / prog.length)
      : 0;

    res.json({
      success: true,
      data: {
        progression_globale: progressionGlobale,
        progression_matieres: prog,
        score_moyen: scoreAvg[0]?.score_moyen || 0,
        nb_quiz: scoreAvg[0]?.nb_quiz || 0,
        derniers_quiz: derniers,
        recommandations
      }
    });
  } catch (err) {
    console.error('❌ ERREUR DASHBOARD:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.matieres = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT p.pourcentage, m.nom, m.icone, m.couleur
       FROM progression p 
       JOIN matieres m ON p.matiere_id = m.id
       WHERE p.user_id = $1`,
      { bind: [req.user.id] }
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.classement = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT u.nom, 
              COALESCE(ROUND(AVG(s.score)), 0) AS score_moyen, 
              COUNT(s.id) AS nb_quiz
       FROM users u
       LEFT JOIN scores s ON s.user_id = u.id
       WHERE u.role = 'etudiant'
       GROUP BY u.id, u.nom
       ORDER BY AVG(s.score) DESC NULLS LAST
       LIMIT 10`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};