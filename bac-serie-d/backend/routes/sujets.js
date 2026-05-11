// routes/sujets.js — version complète avec PUT et DELETE
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const { matiere_id } = req.query;
  try {
    const bind = matiere_id ? [matiere_id] : [];
    const where = matiere_id ? 'WHERE s.matiere_id=$1' : '';
    const [rows] = await sequelize.query(
      `SELECT s.*, m.nom AS matiere FROM sujets s
       JOIN matieres m ON s.matiere_id=m.id
       ${where} ORDER BY s.annee DESC`,
      { bind }
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT s.*, m.nom AS matiere FROM sujets s JOIN matieres m ON s.matiere_id=m.id WHERE s.id=$1',
      { bind: [req.params.id] }
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Non trouvé' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { annee, titre, correction_complete, matiere_id } = req.body;
  if (!annee || !titre || !correction_complete || !matiere_id)
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
  try {
    const [rows] = await sequelize.query(
      'INSERT INTO sujets (annee,titre,correction_complete,matiere_id) VALUES ($1,$2,$3,$4) RETURNING *',
      { bind: [annee, titre, correction_complete, matiere_id] }
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const { annee, titre, correction_complete, matiere_id } = req.body;
  try {
    await sequelize.query(
      'UPDATE sujets SET annee=$1, titre=$2, correction_complete=$3, matiere_id=$4 WHERE id=$5',
      { bind: [annee, titre, correction_complete, matiere_id, req.params.id] }
    );
    res.json({ success: true, message: 'Sujet mis à jour' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM sujets WHERE id=$1', { bind: [req.params.id] });
    res.json({ success: true, message: 'Sujet supprimé' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
