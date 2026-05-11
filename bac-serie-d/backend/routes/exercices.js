// routes/exercices.js — version complète
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const { chapitre_id, niveau } = req.query;
  try {
    let where = 'WHERE 1=1'; const bind = []; let i = 1;
    if (chapitre_id) { where += ` AND e.chapitre_id=$${i++}`; bind.push(chapitre_id); }
    if (niveau)      { where += ` AND e.niveau=$${i++}`;       bind.push(niveau); }
    const [rows] = await sequelize.query(
      `SELECT e.*, c.titre AS chapitre, m.nom AS matiere FROM exercices e
       JOIN chapitres c ON e.chapitre_id=c.id
       JOIN matieres m ON c.matiere_id=m.id
       ${where} ORDER BY e.id`,
      { bind }
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { enonce, correction_detaillee, niveau, chapitre_id } = req.body;
  if (!enonce || !correction_detaillee || !chapitre_id)
    return res.status(400).json({ success: false, message: 'Énoncé, correction et chapitre obligatoires' });
  try {
    const [rows] = await sequelize.query(
      'INSERT INTO exercices (enonce,correction_detaillee,niveau,chapitre_id) VALUES ($1,$2,$3,$4) RETURNING *',
      { bind: [enonce, correction_detaillee, niveau || 'moyen', chapitre_id] }
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const { enonce, correction_detaillee, niveau, chapitre_id } = req.body;
  try {
    await sequelize.query(
      'UPDATE exercices SET enonce=$1, correction_detaillee=$2, niveau=$3, chapitre_id=$4 WHERE id=$5',
      { bind: [enonce, correction_detaillee, niveau, chapitre_id, req.params.id] }
    );
    res.json({ success: true, message: 'Exercice mis à jour' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM exercices WHERE id=$1', { bind: [req.params.id] });
    res.json({ success: true, message: 'Exercice supprimé' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
