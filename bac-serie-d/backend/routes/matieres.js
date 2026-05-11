const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/matieres — retourne TOUS les matieres
router.get('/', async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM matieres ORDER BY id'
    );
    // rows est toujours un tableau
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/matieres/:id — une seule matière
router.get('/:id', protect, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM matieres WHERE id = $1',
      { bind: [req.params.id] }
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/matieres — créer une matière (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  const { nom, icone, couleur } = req.body;
  if (!nom)
    return res.status(400).json({ success: false, message: 'Le nom est obligatoire' });
  try {
    const [rows] = await sequelize.query(
      'INSERT INTO matieres (nom, icone, couleur) VALUES ($1, $2, $3) RETURNING *',
      { bind: [nom, icone || '📚', couleur || '#185FA5'] }
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/matieres/:id — modifier
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { nom, icone, couleur } = req.body;
  try {
    await sequelize.query(
      'UPDATE matieres SET nom=$1, icone=$2, couleur=$3 WHERE id=$4',
      { bind: [nom, icone, couleur, req.params.id] }
    );
    res.json({ success: true, message: 'Matière mise à jour' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/matieres/:id — supprimer
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query(
      'DELETE FROM matieres WHERE id = $1',
      { bind: [req.params.id] }
    );
    res.json({ success: true, message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;