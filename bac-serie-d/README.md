# 🎓 BacPro Madagascar — Révision Bac Série D

Application web complète de révision intelligente pour le Bac Série D à Madagascar.

---

## 📋 Fonctionnalités

- ✅ Cours résumés par chapitre (Maths, Physique, SVT, Philo, Histoire-Géo)
- ✅ Exercices avec corrections détaillées
- ✅ Sujets bac officiels avec corrigés complets
- ✅ Quiz interactifs avec chronomètre (facile / moyen / difficile)
- ✅ 100+ questions par matière
- ✅ Suivi de progression par matière avec graphiques
- ✅ Recommandations IA personnalisées
- ✅ Classement des étudiants
- ✅ Badges de réussite
- ✅ Mode sombre
- ✅ Interface responsive (mobile + desktop)

---

## 🛠️ Stack Technique

| Partie    | Technologies                              |
|-----------|-------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS + Recharts |
| Backend   | Node.js + Express.js (architecture MVC)   |
| Base de données | PostgreSQL 15+                      |
| ORM       | Sequelize                                 |
| Auth      | JWT (JSON Web Token)                      |

---

## 🚀 Installation étape par étape

### Prérequis

- Node.js 18+ ([nodejs.org](https://nodejs.org))
- PostgreSQL 15+ ([postgresql.org](https://postgresql.org))
- pgAdmin 4 (recommandé pour la gestion visuelle de la BDD)

---

### 1️⃣ Créer la base de données avec pgAdmin

1. Ouvrir **pgAdmin 4**
2. Clic droit sur **Servers** → Connect
3. Clic droit sur **Databases** → Create → Database
   - Name: `bac_serie_d`
   - Cliquer **Save**
4. Clic droit sur `bac_serie_d` → **Query Tool**
5. Ouvrir et exécuter le fichier `database.sql` :
   - File → Open → sélectionner `database.sql`
   - Cliquer ▶ (Execute)
6. Puis exécuter `database_questions.sql` de la même façon

---

### 2️⃣ Configurer et démarrer le Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier de configuration
cp .env .env.local
# Éditer .env et renseigner vos identifiants PostgreSQL :
# DB_USER=postgres
# DB_PASSWORD=votre_mot_de_passe

# Démarrer le serveur
npm run dev
# Le serveur démarre sur http://localhost:5000
```

**Tester l'API :**
```bash
curl http://localhost:5000/api/health
# Réponse : {"status":"OK","message":"Bac Série D API en ligne"}
```

---

### 3️⃣ Configurer et démarrer le Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
# L'application s'ouvre sur http://localhost:5173
```

---

### 4️⃣ Se connecter

Deux comptes de test sont disponibles :

| Rôle    | Email                | Mot de passe |
|---------|----------------------|--------------|
| Admin   | admin@bac-mada.mg    | password123  |
| Étudiant| rakoto@example.mg    | password123  |

> ⚠️ Pour que les mots de passe fonctionnent, les hacher avec bcrypt avant d'insérer en base :
```bash
node -e "const b=require('bcryptjs'); b.hash('password123',10).then(h=>console.log(h))"
```
Puis mettre à jour la table `users` avec le hash généré.

---

## 📁 Structure du projet

```
bac-serie-d/
├── database.sql              # Schéma + données initiales
├── database_questions.sql    # 100+ questions par matière
├── README.md
│
├── backend/
│   ├── .env                  # Configuration (DB, JWT)
│   ├── server.js             # Point d'entrée Express
│   ├── package.json
│   ├── config/
│   │   └── database.js       # Connexion Sequelize
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   └── progressionController.js
│   └── routes/
│       ├── auth.js
│       ├── matieres.js
│       ├── chapitres.js
│       ├── cours.js
│       ├── exercices.js
│       ├── sujets.js
│       ├── quiz.js
│       ├── scores.js
│       └── progression.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── App.jsx             # Router principal
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx # Auth globale
        ├── services/
        │   └── api.js          # Axios configuré
        ├── components/
        │   └── Layout.jsx      # Sidebar + navigation
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx   # Tableau de bord + graphiques
            ├── Matieres.jsx    # Liste des matières
            ├── Chapitres.jsx   # Chapitres par matière
            ├── CoursPage.jsx   # Cours + exercices par chapitre
            ├── CoursDetail.jsx # Contenu détaillé d'un cours
            ├── Exercices.jsx   # Tous les exercices
            ├── Sujets.jsx      # Annales bac avec corrigés
            ├── QuizList.jsx    # Liste des quiz
            ├── QuizPlay.jsx    # Quiz interactif + chronomètre
            ├── Progression.jsx # Suivi progression + badges
            └── Resultats.jsx   # Historique des résultats
```

---

## 🔌 API REST — Endpoints

### Authentification
| Méthode | Endpoint          | Description          |
|---------|-------------------|----------------------|
| POST    | /api/auth/register| Créer un compte      |
| POST    | /api/auth/login   | Se connecter         |
| GET     | /api/auth/me      | Profil utilisateur   |

### Contenu pédagogique
| Méthode | Endpoint                   | Description             |
|---------|----------------------------|-------------------------|
| GET     | /api/matieres              | Liste des matières      |
| GET     | /api/chapitres?matiere_id= | Chapitres d'une matière |
| GET     | /api/cours?chapitre_id=    | Cours d'un chapitre     |
| GET     | /api/cours/:id             | Détail d'un cours       |
| GET     | /api/exercices?chapitre_id=| Exercices               |
| GET     | /api/sujets?matiere_id=    | Annales bac             |

### Quiz
| Méthode | Endpoint                  | Description              |
|---------|---------------------------|--------------------------|
| GET     | /api/quiz?niveau=         | Liste des quiz           |
| GET     | /api/quiz/:id             | Quiz + questions         |
| POST    | /api/quiz/:id/soumettre   | Soumettre les réponses   |

### Progression
| Méthode | Endpoint                    | Description              |
|---------|-----------------------------|--------------------------|
| GET     | /api/progression/dashboard  | Données du dashboard     |
| GET     | /api/progression/matieres   | Progression par matière  |
| GET     | /api/progression/classement | Top 10 étudiants         |

---

## 🧠 Système de recommandations

Le système analyse automatiquement :
1. Les scores par chapitre de l'étudiant
2. Détecte les chapitres avec score moyen < 60%
3. Génère des recommandations personnalisées :
   - "Tu es faible en X → Revoir le cours"
   - "Quiz adapté recommandé"

---

## 🎯 Contenu pédagogique inclus

| Matière              | Chapitres | Questions | Sujets bac |
|----------------------|-----------|-----------|------------|
| Mathématiques        | 10        | 50+       | 3          |
| Physique-Chimie      | 8         | 30+       | 3          |
| SVT                  | 8         | 25+       | 2          |
| Philosophie          | 8         | 10+       | 2          |
| Histoire-Géographie  | 8         | 10+       | 2          |

> Pour atteindre 100+ questions par matière, ajouter des questions via l'interface admin ou en exécutant des INSERT supplémentaires dans `database_questions.sql`.

---

## 🐛 Résolution de problèmes courants

**Erreur de connexion PostgreSQL :**
```
Error: password authentication failed for user "postgres"
```
→ Vérifier `.env` : DB_USER, DB_PASSWORD, DB_HOST, DB_PORT

**Module non trouvé :**
```bash
npm install  # dans backend/ et frontend/
```

**Port déjà utilisé :**
```bash
# Changer le port dans backend/.env : PORT=5001
# Adapter vite.config.js proxy en conséquence
```

**CORS Error :**
→ Vérifier que le frontend tourne sur `http://localhost:5173`
→ Le proxy Vite redirige `/api` vers `http://localhost:5000`

---

## 📜 Licence

Projet éducatif — Usage libre pour les élèves du Bac Série D de Madagascar.

---

*Développé pour aider les élèves malgaches à réussir leur Baccalauréat Série D* 🇲🇬
