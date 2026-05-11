const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/cours
router.get("/", protect, async (req, res) => {
  const { chapitre_id } = req.query;
  try {
    let query = `
      SELECT co.id, co.titre, co.resume, co.chapitre_id,
             c.titre AS chapitre, m.nom AS matiere
      FROM cours co
      JOIN chapitres c ON co.chapitre_id = c.id
      JOIN matieres m ON c.matiere_id = m.id
    `;
    const bind = [];
    if (chapitre_id) {
      query += " WHERE co.chapitre_id = $1";
      bind.push(chapitre_id);
    }
    query += " ORDER BY co.id";

    const [rows] = await sequelize.query(query, { bind });
    console.log("Cours trouvés:", rows.length);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Erreur cours:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cours/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT co.*, c.titre AS chapitre, m.nom AS matiere
       FROM cours co
       JOIN chapitres c ON co.chapitre_id = c.id
       JOIN matieres m ON c.matiere_id = m.id
       WHERE co.id = $1`,
      { bind: [req.params.id] },
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Cours non trouvé" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cours
router.post("/", protect, adminOnly, async (req, res) => {
  const { titre, resume, contenu, chapitre_id } = req.body;
  if (!titre || !contenu || !chapitre_id)
    return res.status(400).json({
      success: false,
      message: "Titre, contenu et chapitre sont obligatoires",
    });
  try {
    const [rows] = await sequelize.query(
      `INSERT INTO cours (titre, resume, contenu, chapitre_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      { bind: [titre, resume || "", contenu, chapitre_id] },
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cours/:id
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { titre, resume, contenu } = req.body;
  try {
    await sequelize.query(
      "UPDATE cours SET titre=$1, resume=$2, contenu=$3 WHERE id=$4",
      { bind: [titre, resume || "", contenu, req.params.id] },
    );
    res.json({ success: true, message: "Cours mis à jour" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cours/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await sequelize.query("DELETE FROM cours WHERE id = $1", {
      bind: [req.params.id],
    });
    res.json({ success: true, message: "Cours supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
