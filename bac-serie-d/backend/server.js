require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");

const app = express();

// ✅ CORS corrigé — autorise localhost et Vercel
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3031",
      "https://bac-serie-d-vrai2.vercel.app",
      "https://bac-serie-d-vrai2-francklinemarie14-3892s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ Gérer les requêtes preflight OPTIONS (obligatoire)
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/matieres", require("./routes/matieres"));
app.use("/api/chapitres", require("./routes/chapitres"));
app.use("/api/cours", require("./routes/cours"));
app.use("/api/exercices", require("./routes/exercices"));
app.use("/api/sujets", require("./routes/sujets"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/scores", require("./routes/scores"));
app.use("/api/progression", require("./routes/progression"));
app.use("/api/admin", require("./routes/admin"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Bac Série D API en ligne" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "Erreur serveur", error: err.message });
});

const PORT = process.env.PORT || 5000;

// Démarrage serveur
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion PostgreSQL réussie (Supabase Cloud)");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur de connexion PostgreSQL:", err.message);
    process.exit(1);
  }
})();
