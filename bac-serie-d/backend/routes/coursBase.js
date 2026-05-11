// ===================== COURS =====================
const express = require('express');
const coursRouter = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

coursRouter.get('/', protect, async (req, res) => {
  const { chapitre_id } = req.query;
  try {
    const bind = chapitre_id ? [chapitre_id] : [];
    const where = chapitre_id ? 'WHERE co.chapitre_id = $1' : '';
    const result = await sequelize.query(
      `SELECT co.*, c.titre AS chapitre, m.nom AS matiere FROM cours co
       JOIN chapitres c ON co.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id ${where} ORDER BY co.id`,
      { bind, type: 'SELECT' }
    );
    res.json({ success: true, data: result[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

coursRouter.get('/:id', protect, async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT co.*, c.titre AS chapitre, m.nom AS matiere FROM cours co
       JOIN chapitres c ON co.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id WHERE co.id = $1`,
      { bind: [req.params.id], type: 'SELECT' }
    );
    if (!result[0].length) return res.status(404).json({ success: false, message: 'Cours non trouvé' });
    res.json({ success: true, data: result[0][0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

coursRouter.post('/', protect, adminOnly, async (req, res) => {
  const { titre, resume, contenu, chapitre_id } = req.body;
  try {
    const result = await sequelize.query(
      'INSERT INTO cours (titre, resume, contenu, chapitre_id) VALUES ($1,$2,$3,$4) RETURNING *',
      { bind: [titre, resume, contenu, chapitre_id], type: 'SELECT' }
    );
    res.status(201).json({ success: true, data: result[0][0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

coursRouter.put('/:id', protect, adminOnly, async (req, res) => {
  const { titre, resume, contenu } = req.body;
  try {
    await sequelize.query(
      'UPDATE cours SET titre=$1, resume=$2, contenu=$3 WHERE id=$4',
      { bind: [titre, resume, contenu, req.params.id] }
    );
    res.json({ success: true, message: 'Cours mis à jour' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

coursRouter.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM cours WHERE id=$1', { bind: [req.params.id] });
    res.json({ success: true, message: 'Cours supprimé' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = { coursRouter };
