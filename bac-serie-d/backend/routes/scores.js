const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT s.*, q.titre AS quiz_titre, q.niveau, m.nom AS matiere
       FROM scores s JOIN quiz q ON s.quiz_id=q.id
       JOIN chapitres c ON q.chapitre_id=c.id JOIN matieres m ON c.matiere_id=m.id
       WHERE s.user_id=$1 ORDER BY s.created_at DESC LIMIT 50`,
      { bind: [req.user.id], type: 'SELECT' }
    );
    res.json({ success: true, data: result[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
