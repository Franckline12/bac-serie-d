const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/database");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

// POST /api/auth/register
exports.register = async (req, res) => {
  const { nom, email, password } = req.body;

  console.log("=== INSCRIPTION ===", { nom, email });

  if (!nom || !email || !password)
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont obligatoires",
    });

  try {
    // Vérifier si email existe déjà
    const [existing] = await sequelize.query(
      "SELECT id FROM users WHERE email = $1",
      { bind: [email] },
    );

    console.log("Email existant:", existing);

    if (existing.length > 0)
      return res.status(409).json({
        success: false,
        message: "Email déjà utilisé",
      });

    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    console.log("Hash créé avec succès");

    // Insérer l'utilisateur
    const [newUser] = await sequelize.query(
      `INSERT INTO users (nom, email, password, role)
       VALUES ($1, $2, $3, 'etudiant')
       RETURNING id, nom, email, role`,
      { bind: [nom, email, hash] },
    );

    console.log("Utilisateur créé:", newUser[0]);

    const user = newUser[0];

    // Initialiser progression pour chaque matière
    const [matieres] = await sequelize.query("SELECT id FROM matieres");

    for (const m of matieres) {
      await sequelize.query(
        `INSERT INTO progression (user_id, matiere_id, pourcentage)
         VALUES ($1, $2, 0)
         ON CONFLICT (user_id, matiere_id) DO NOTHING`,
        { bind: [user.id, m.id] },
      );
    }

    console.log("✅ INSCRIPTION RÉUSSIE");

    res.status(201).json({
      success: true,
      token: signToken(user),
      user,
    });
  } catch (err) {
    console.error("❌ ERREUR INSCRIPTION:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("=== LOGIN ===", { email });

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Email et mot de passe requis",
    });

  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM users WHERE email = $1",
      { bind: [email] },
    );

    const user = rows[0];

    if (!user) {
      console.log("❌ Utilisateur non trouvé");
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    console.log("✅ Utilisateur trouvé:", user.email);

    const match = await bcrypt.compare(password, user.password);
    console.log("Mot de passe correct:", match);

    if (!match)
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });

    const { password: _, ...userData } = user;

    console.log("✅ LOGIN RÉUSSI");

    res.json({
      success: true,
      token: signToken(userData),
      user: userData,
    });
  } catch (err) {
    console.error("❌ ERREUR LOGIN:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT id, nom, email, role, created_at FROM users WHERE id = $1",
      { bind: [req.user.id] },
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
