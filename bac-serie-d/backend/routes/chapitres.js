const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/chapitres
router.get("/", protect, async (req, res) => {
  const { matiere_id } = req.query;
  try {
    let query = `
      SELECT c.id, c.titre, c.ordre, c.matiere_id,
             m.nom AS matiere
      FROM chapitres c
      JOIN matieres m ON c.matiere_id = m.id
    `;
    const bind = [];
    if (matiere_id) {
      query += " WHERE c.matiere_id = $1";
      bind.push(matiere_id);
    }
    query += " ORDER BY c.matiere_id, c.ordre";

    const [rows] = await sequelize.query(query, { bind });
    console.log("Chapitres trouvés:", rows.length);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Erreur chapitres:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chapitres/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT c.*, m.nom AS matiere 
       FROM chapitres c
       JOIN matieres m ON c.matiere_id = m.id 
       WHERE c.id = $1`,
      { bind: [req.params.id] },
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Chapitre non trouvé" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chapitres
router.post("/", protect, adminOnly, async (req, res) => {
  const { titre, matiere_id, ordre } = req.body;
  if (!titre || !matiere_id)
    return res.status(400).json({
      success: false,
      message: "Titre et matière sont obligatoires",
    });
  try {
    const [rows] = await sequelize.query(
      `INSERT INTO chapitres (titre, matiere_id, ordre)
       VALUES ($1, $2, $3) RETURNING *`,
      { bind: [titre, matiere_id, ordre || 1] },
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/chapitres/:id
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { titre, ordre } = req.body;
  try {
    await sequelize.query(
      "UPDATE chapitres SET titre=$1, ordre=$2 WHERE id=$3",
      { bind: [titre, ordre || 1, req.params.id] },
    );
    res.json({ success: true, message: "Chapitre mis à jour" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/chapitres/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query("DELETE FROM chapitres WHERE id = $1", {
      bind: [req.params.id],
    });
    res.json({ success: true, message: "Chapitre supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
