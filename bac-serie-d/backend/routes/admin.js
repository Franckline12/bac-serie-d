const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/users — liste tous les utilisateurs
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT u.id, u.nom, u.email, u.role, u.created_at,
              COUNT(s.id) AS nb_quiz
       FROM users u
       LEFT JOIN scores s ON s.user_id = u.id
       GROUP BY u.id, u.nom, u.email, u.role, u.created_at
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/role — changer le rôle
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'etudiant'].includes(role))
    return res.status(400).json({ success: false, message: 'Rôle invalide' });
  try {
    await sequelize.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      { bind: [role, req.params.id] }
    );
    res.json({ success: true, message: `Rôle changé en ${role}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id — supprimer un utilisateur
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM users WHERE id = $1', { bind: [req.params.id] });
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/stats — statistiques globales
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [stats] = await sequelize.query(
      `SELECT m.nom AS matiere,
              ROUND(AVG(s.score)) AS score_moyen,
              COUNT(s.id) AS nb_quiz
       FROM scores s
       JOIN quiz q ON s.quiz_id = q.id
       JOIN chapitres c ON q.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       GROUP BY m.id, m.nom
       ORDER BY m.id`
    );
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
