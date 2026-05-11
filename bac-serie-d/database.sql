-- ============================================================
-- BAC SÉRIE D MADAGASCAR - Schéma PostgreSQL complet
-- ============================================================

CREATE DATABASE bac_serie_d;
\c bac_serie_d;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE users (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom       VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  role      VARCHAR(20) DEFAULT 'etudiant' CHECK (role IN ('admin','etudiant')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matieres (
  id    SERIAL PRIMARY KEY,
  nom   VARCHAR(100) NOT NULL,
  icone VARCHAR(10),
  couleur VARCHAR(20)
);

CREATE TABLE chapitres (
  id         SERIAL PRIMARY KEY,
  titre      VARCHAR(200) NOT NULL,
  matiere_id INTEGER REFERENCES matieres(id) ON DELETE CASCADE,
  ordre      INTEGER DEFAULT 1
);

CREATE TABLE cours (
  id         SERIAL PRIMARY KEY,
  titre      VARCHAR(200) NOT NULL,
  resume     TEXT,
  contenu    TEXT NOT NULL,
  chapitre_id INTEGER REFERENCES chapitres(id) ON DELETE CASCADE
);

CREATE TABLE exercices (
  id                  SERIAL PRIMARY KEY,
  enonce              TEXT NOT NULL,
  correction_detaillee TEXT NOT NULL,
  niveau              VARCHAR(10) DEFAULT 'moyen' CHECK (niveau IN ('facile','moyen','difficile')),
  chapitre_id         INTEGER REFERENCES chapitres(id) ON DELETE CASCADE
);

CREATE TABLE sujets (
  id                 SERIAL PRIMARY KEY,
  annee              INTEGER NOT NULL,
  titre              VARCHAR(200),
  correction_complete TEXT,
  matiere_id         INTEGER REFERENCES matieres(id) ON DELETE CASCADE
);

CREATE TABLE quiz (
  id          SERIAL PRIMARY KEY,
  titre       VARCHAR(200) NOT NULL,
  niveau      VARCHAR(10) CHECK (niveau IN ('facile','moyen','difficile')),
  temps_limite INTEGER DEFAULT 1800,
  chapitre_id INTEGER REFERENCES chapitres(id) ON DELETE CASCADE
);

CREATE TABLE questions (
  id           SERIAL PRIMARY KEY,
  question     TEXT NOT NULL,
  choix1       VARCHAR(500) NOT NULL,
  choix2       VARCHAR(500) NOT NULL,
  choix3       VARCHAR(500) NOT NULL,
  choix4       VARCHAR(500) NOT NULL,
  bonne_reponse INTEGER CHECK (bonne_reponse IN (1,2,3,4)),
  explication  TEXT,
  quiz_id      INTEGER REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE TABLE scores (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id     INTEGER REFERENCES quiz(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL,
  nb_questions INTEGER NOT NULL,
  temps_utilise INTEGER,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE progression (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  matiere_id  INTEGER REFERENCES matieres(id) ON DELETE CASCADE,
  pourcentage INTEGER DEFAULT 0,
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, matiere_id)
);

-- ============================================================
-- DONNÉES D'EXEMPLE
-- ============================================================

-- Matières
INSERT INTO matieres (nom, icone, couleur) VALUES
  ('Mathématiques',       '📐', '#185FA5'),
  ('Physique-Chimie',     '⚗️',  '#534AB7'),
  ('SVT',                 '🌿', '#3B6D11'),
  ('Philosophie',         '🤔', '#BA7517'),
  ('Histoire-Géographie', '🌍', '#993C1D');

-- Chapitres Mathématiques
INSERT INTO chapitres (titre, matiere_id, ordre) VALUES
  ('Suites numériques',          1, 1),
  ('Fonctions et dérivées',      1, 2),
  ('Probabilités et statistiques',1,3),
  ('Nombres complexes',          1, 4),
  ('Géométrie dans l''espace',   1, 5),
  ('Intégration',                1, 6),
  ('Équations différentielles',  1, 7),
  ('Arithmétique',               1, 8),
  ('Trigonométrie',              1, 9),
  ('Matrices et systèmes',       1, 10);

-- Chapitres Physique-Chimie
INSERT INTO chapitres (titre, matiere_id, ordre) VALUES
  ('Mécanique du point',         2, 1),
  ('Optique géométrique',        2, 2),
  ('Électricité',                2, 3),
  ('Thermodynamique',            2, 4),
  ('Ondes mécaniques',           2, 5),
  ('Chimie des solutions',       2, 6),
  ('Cinétique chimique',         2, 7),
  ('Équilibres chimiques',       2, 8);

-- Chapitres SVT
INSERT INTO chapitres (titre, matiere_id, ordre) VALUES
  ('Génétique et hérédité',      3, 1),
  ('La cellule et le métabolisme',3,2),
  ('L''évolution des êtres vivants',3,3),
  ('Géologie et tectonique',     3, 4),
  ('Système nerveux',            3, 5),
  ('Reproduction',               3, 6),
  ('Immunologie',                3, 7),
  ('Écologie',                   3, 8);

-- Chapitres Philosophie
INSERT INTO chapitres (titre, matiere_id, ordre) VALUES
  ('La conscience',              4, 1),
  ('L''existence et le temps',   4, 2),
  ('Le langage',                 4, 3),
  ('La vérité',                  4, 4),
  ('La raison et le réel',       4, 5),
  ('La liberté',                 4, 6),
  ('La morale',                  4, 7),
  ('La société et l''État',      4, 8);

-- Chapitres Histoire-Géo
INSERT INTO chapitres (titre, matiere_id, ordre) VALUES
  ('La colonisation de Madagascar',5,1),
  ('L''indépendance et la 1ère République',5,2),
  ('La 2ème République',         5, 3),
  ('Géographie physique de Madagascar',5,4),
  ('Économie malgache',          5, 5),
  ('La mondialisation',          5, 6),
  ('L''Afrique contemporaine',   5, 7),
  ('Le monde après 1945',        5, 8);

-- Cours : Fonctions et dérivées (chapitre 2)
INSERT INTO cours (titre, resume, contenu, chapitre_id) VALUES (
  'Introduction aux dérivées',
  'La dérivée d''une fonction mesure son taux de variation instantané.',
  '## 1. Définition de la dérivée

La dérivée de f en a est : f''(a) = lim(h→0) [f(a+h) - f(a)] / h

Géométriquement, f''(a) est la pente de la tangente à la courbe en x=a.

## 2. Règles de dérivation

- (xⁿ)'' = n·xⁿ⁻¹
- (eˣ)'' = eˣ
- (ln x)'' = 1/x
- (sin x)'' = cos x
- (cos x)'' = -sin x
- (u+v)'' = u'' + v''
- (uv)'' = u''v + uv''
- (u/v)'' = (u''v - uv'') / v²

## 3. Variations et extremums

Si f''(x) > 0 sur ]a,b[ → f croissante
Si f''(x) < 0 sur ]a,b[ → f décroissante
Si f''(x₀) = 0 et changement de signe → extremum local

## 4. Exemple complet

f(x) = 2x³ - 3x² - 12x + 4
f''(x) = 6x² - 6x - 12 = 6(x-2)(x+1)
Extremums : x = -1 (max local), x = 2 (min local)',
  2
);

-- Exercices sur les dérivées
INSERT INTO exercices (enonce, correction_detaillee, niveau, chapitre_id) VALUES
(
  'Soit f(x) = x³ - 6x² + 9x + 1. Calculer f''(x) et étudier les variations de f.',
  'Étape 1 : f''(x) = 3x² - 12x + 9 = 3(x-1)(x-3)
Étape 2 : f''(x) = 0 ⟹ x = 1 ou x = 3
Étape 3 :
- x < 1 : f''(x) > 0 (croissante)
- 1 < x < 3 : f''(x) < 0 (décroissante)
- x > 3 : f''(x) > 0 (croissante)
Maximum local en x=1 : f(1) = 1-6+9+1 = 5
Minimum local en x=3 : f(3) = 27-54+27+1 = 1',
  'moyen', 2
),
(
  'Trouver l''équation de la tangente à y = x² au point (2, 4).',
  'Étape 1 : f''(x) = 2x donc f''(2) = 4
Étape 2 : Équation : y - 4 = 4(x - 2)
Résultat : y = 4x - 4',
  'facile', 2
),
(
  'Étudier f(x) = (x²-1)/(x+2) : domaine, dérivée, variations.',
  'Domaine : ℝ \ {-2}
f''(x) = [(2x)(x+2) - (x²-1)(1)] / (x+2)²
     = [2x²+4x - x²+1] / (x+2)²
     = (x²+4x+1) / (x+2)²
Racines : x = (-4 ± √12)/2 = -2 ± √3
x₁ = -2-√3 ≈ -3,73 (min local)
x₂ = -2+√3 ≈ -0,27 (max local)',
  'difficile', 2
);

-- Quiz facile sur les dérivées
INSERT INTO quiz (titre, niveau, temps_limite, chapitre_id) VALUES
  ('Quiz Dérivées - Facile', 'facile', 900, 2),
  ('Quiz Dérivées - Moyen', 'moyen', 1200, 2),
  ('Quiz Dérivées - Difficile', 'difficile', 1800, 2);

-- Questions quiz Dérivées Facile (quiz_id = 1)
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Quelle est la dérivée de f(x) = x⁵ ?',
 '5x⁴','x⁴','5x⁶','4x⁵', 1,
 'La dérivée de xⁿ est nxⁿ⁻¹, donc (x⁵)'' = 5x⁴.', 1),

('Quelle est la dérivée de f(x) = 7 (constante) ?',
 '7','1','0','7x', 3,
 'La dérivée d''une constante est toujours 0.', 1),

('Si f''(x) > 0 sur ]a,b[, alors f est :',
 'Décroissante','Constante','Croissante','Nulle', 3,
 'Dérivée positive ⟺ fonction croissante.', 1),

('La dérivée de f(x) = sin(x) est :',
 '-sin(x)','cos(x)','-cos(x)','sin(x)', 2,
 'C''est une formule fondamentale : (sin x)'' = cos x.', 1),

('Quelle est la dérivée de f(x) = eˣ ?',
 'xeˣ⁻¹','eˣ⁺¹','eˣ','1/eˣ', 3,
 'La fonction exponentielle est sa propre dérivée : (eˣ)'' = eˣ.', 1),

('La dérivée de f(x) = ln(x) est :',
 'x','1/x','ln(x)/x','1', 2,
 '(ln x)'' = 1/x, valable pour x > 0.', 1),

('Calculer f''(0) si f(x) = 3x² + 2x + 1 :',
 '3','1','2','6', 3,
 'f''(x) = 6x + 2, donc f''(0) = 0 + 2 = 2.', 1),

('La dérivée de cos(x) est :',
 'sin(x)','-sin(x)','cos(x)','-cos(x)', 2,
 '(cos x)'' = -sin x.', 1),

('Pour f(x) = x³, f''(2) vaut :',
 '6','12','8','9', 2,
 'f''(x) = 3x², donc f''(2) = 3×4 = 12.', 1),

('Que représente géométriquement f''(a) ?',
 'L''ordonnée en a','L''abscisse en a','La pente de la tangente en a','L''aire sous la courbe', 3,
 'f''(a) est le coefficient directeur de la tangente à la courbe en x = a.', 1);

-- Questions quiz Dérivées Moyen (quiz_id = 2)
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Quelle est la dérivée de f(x) = 3x⁴ - 2x³ + 5x - 7 ?',
 '12x³ - 6x² + 5','12x³ - 6x² + 5x','12x³ - 2x + 5','4x³ - 3x² + 5', 1,
 'On dérive terme à terme : 12x³ - 6x² + 5 - 0.', 2),

('Quelle est la dérivée de f(x) = eˣ · sin(x) ?',
 'eˣcos(x)','eˣ(sin(x)+cos(x))','eˣ(sin(x)-cos(x))','eˣ·sin(x)', 2,
 '(uv)'' = u''v + uv'' = eˣsin(x) + eˣcos(x).', 2),

('Pour f(x) = √x, f''(x) vaut :',
 '2√x','1/(2√x)','√x/2','1/√x', 2,
 'f(x) = x^(1/2), f''(x) = (1/2)x^(-1/2) = 1/(2√x).', 2),

('L''équation de la tangente à y = x² en (1,1) est :',
 'y = x','y = 2x - 1','y = 2x + 1','y = x + 1', 2,
 'f''(1)=2, tangente : y = 2(x-1)+1 = 2x-1.', 2),

('Dériver f(x) = (2x+1)³ :',
 '3(2x+1)²','6(2x+1)²','2(2x+1)³','6(2x+1)', 2,
 'Règle de la chaîne : 3(2x+1)² × 2 = 6(2x+1)².', 2),

('Si f(x) = x² - 4x + 3, les extremums sont en :',
 'x = 2','x = 4','x = -2','x = 0', 1,
 'f''(x) = 2x - 4 = 0 ⟹ x = 2.', 2),

('La dérivée de f(x) = ln(x²+1) est :',
 '1/(x²+1)','2x/(x²+1)','x/(x²+1)','2/(x²+1)', 2,
 'Règle de la chaîne : (ln u)'' = u''/u, u=x²+1, u''=2x.', 2),

('Quelle est la dérivée de f(x) = x·eˣ ?',
 'eˣ','x·eˣ','(x+1)eˣ','(x-1)eˣ', 3,
 '(x·eˣ)'' = 1·eˣ + x·eˣ = (x+1)eˣ.', 2),

('f(x) = 1/x a comme dérivée :',
 'ln(x)','-1/x²','1/x²','-ln(x)', 2,
 'f(x) = x⁻¹, f''(x) = -x⁻² = -1/x².', 2),

('Trouver les intervalles de croissance de f(x) = -x² + 4x - 1 :',
 ']2, +∞[',']-∞, 2[',']-∞, +∞[',']-2, 2[', 2,
 'f''(x) = -2x+4 > 0 ⟺ x < 2.', 2);

-- Questions quiz Génétique Facile (nouveau quiz)
INSERT INTO quiz (titre, niveau, temps_limite, chapitre_id) VALUES
  ('Quiz Génétique - Facile', 'facile', 900, 21),
  ('Quiz Génétique - Moyen', 'moyen', 1200, 21);

INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Que contient principalement le noyau cellulaire ?',
 'Des lipides','De l''ARN','De l''ADN','Des protéines', 3,
 'Le noyau contient l''ADN, support de l''information génétique.', 4),

('Un allèle dominant s''exprime :',
 'Seulement chez la femelle','Toujours, même en un seul exemplaire','Seulement en double exemplaire','Jamais avec un allèle récessif', 2,
 'Un allèle dominant s''exprime qu''il soit en simple (hétérozygote) ou double exemplaire (homozygote).', 4),

('La méiose produit des cellules :',
 'Diploïdes','Haploïdes','Triploïdes','Polyploïdes', 2,
 'La méiose réduit le nombre de chromosomes de moitié : les cellules filles sont haploïdes (n chromosomes).', 4),

('Les lois de Mendel s''appliquent à :',
 'La reproduction asexuée','La mitose','La transmission héréditaire','La synthèse des protéines', 3,
 'Mendel a établi les lois de la transmission des caractères héréditaires (dominance, ségrégation, assortiment indépendant).', 4),

('Le génotype d''un individu désigne :',
 'Son apparence physique','Sa constitution génétique','Son phénotype','Son sexe', 2,
 'Le génotype est la composition allélique d''un individu (ses gènes), à distinguer du phénotype (apparence visible).', 4);

-- Sujets Bac
INSERT INTO sujets (annee, titre, correction_complete, matiere_id) VALUES
(2023, 'Bac Série D 2023 — Mathématiques',
 'CORRECTION OFFICIELLE 2023
Exercice 1 : Suites (5 pts)
1. u₀ = 3, u_{n+1} = 2u_n + 1 → Suite arithmético-géométrique
   Limite : on pose u_n = l → l = 2l+1 → l = -1
   v_n = u_n + 1 géométrique de raison 2 → v_n = 4×2ⁿ → u_n = 4×2ⁿ - 1

Exercice 2 : Probabilités (5 pts)
2. P(A∩B) = 0,12, P(A) = 0,3 → P(B|A) = 0,12/0,3 = 0,4

Problème : Fonctions (10 pts)
f(x) = 2x³ - 9x² + 12x - 4 sur [0;3]
f''(x) = 6x² - 18x + 12 = 6(x-1)(x-2)
Max local en x=1 : f(1) = 1, Min local en x=2 : f(2) = 0', 1),

(2022, 'Bac Série D 2022 — SVT',
 'CORRECTION OFFICIELLE 2022
Partie A : Génétique (8 pts)
Croisement test : P × homozygote récessif
Résultat : 50% yeux bleus, 50% yeux marrons
→ Le parent est hétérozygote Bb

Partie B : Géologie (7 pts)
La tectonique des plaques : subduction de la plaque océanique
Formation des chaînes de montagnes par collision continentale

Partie C : Physiologie (5 pts)
Réponse immunitaire spécifique : lymphocytes B → anticorps
Mémoire immunologique : permet une réponse plus rapide lors d''une 2ème infection', 3);

-- Utilisateur admin de test
INSERT INTO users (nom, email, password, role) VALUES
('Administrateur', 'admin@bac-mada.mg', '$2b$10$examplehashedpassword123456789', 'admin'),
('Rakoto Aina', 'rakoto@example.mg', '$2b$10$examplehashedpassword987654321', 'etudiant');

-- ============================================================
-- INDEX pour les performances
-- ============================================================
CREATE INDEX idx_chapitres_matiere ON chapitres(matiere_id);
CREATE INDEX idx_cours_chapitre ON cours(chapitre_id);
CREATE INDEX idx_exercices_chapitre ON exercices(chapitre_id);
CREATE INDEX idx_quiz_chapitre ON quiz(chapitre_id);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_scores_user ON scores(user_id);
CREATE INDEX idx_scores_quiz ON scores(quiz_id);
CREATE INDEX idx_progression_user ON progression(user_id);
