---

## 🐋 Architecture DevOps & Industrialisation

Ce projet a été industrialisé selon les meilleures pratiques DevOps afin de garantir une portabilité locale maximale et un découpage micro-services.

### 1. Conteneurisation & Orchestration (Docker)
L'ensemble de l'application est conteneurisé. L'infrastructure locale est orchestrée par **Docker Compose** pour lancer l'application complète en une seule commande :
*   **`frontend`** : Image optimisée Node 18 exposant l'application React/Vite sur le port `5173`.
*   **`backend`** : Image Node 18 contenant l'API Express/Sequelize connectée sur le port `5000`.

### 2. Base de Données Cloud Managée (Supabase)
En production et en local via Docker, le projet est connecté à une base de données **PostgreSQL hébergée sur Supabase**. 
*   Utilisation du **Pooler de connexion Supavisor** (port `6543`) pour optimiser la gestion des connexions simultanées en environnement conteneurisé.
*   Sécurisation complète des accès via l'injection de variables d'environnement (`.env`).

### 3. Orchestration Cloud Ready (Kubernetes)
Le dossier `/k8s` contient les manifestes YAML prêts pour un déploiement à l'échelle sur un cluster (Minikube / GKE / AWS EKS) :
*   `Deployments` & `Services` pour le Frontend et le Backend.
*   `HPA (Horizontal Pod Autoscaler)` configuré pour gérer l'autoscaling automatique des pods en fonction de la charge CPU.

### 🚀 Lancement DevOps ultra-rapide en 2 étapes

Si vous possédez **Docker Desktop**, plus besoin d'installer Node.js ou PostgreSQL localement.

**Étape A : Configurer le fichier `backend/.env`**
```env
PORT=5000
DB_HOST=://supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.askqdwsjyhunbuzpotby
DB_PASSWORD=votre_mot_de_passe_supabase
JWT_SECRET=bac_serie_d_secret_2025_madagascar
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Étape B : Démarrer toute l'infrastructure**
À la racine du projet, lancez :
```bash
docker compose up --build
```
L'application est immédiatement accessible :
*   **Frontend :** `http://localhost:5173`
*   **Backend / API :** `http://localhost:5000`

---
