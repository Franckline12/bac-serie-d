require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/matieres',    require('./routes/matieres'));
app.use('/api/chapitres',   require('./routes/chapitres'));
app.use('/api/cours',       require('./routes/cours'));
app.use('/api/exercices',   require('./routes/exercices'));
app.use('/api/sujets',      require('./routes/sujets'));
app.use('/api/quiz',        require('./routes/quiz'));
app.use('/api/scores',      require('./routes/scores'));
app.use('/api/progression', require('./routes/progression'));
app.use('/api/admin',       require('./routes/admin'));  // ← NOUVEAU

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bac Série D API en ligne' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL réussie');
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
  } catch (err) {
    console.error('❌ Erreur de connexion DB:', err.message);
    process.exit(1);
  }
})();
