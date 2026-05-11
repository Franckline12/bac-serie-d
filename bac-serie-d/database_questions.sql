-- ============================================================
-- 100+ QUESTIONS PAR MATIÈRE — BAC SÉRIE D MADAGASCAR (CORRIGÉ)
-- ============================================================

INSERT INTO quiz (titre, niveau, temps_limite, chapitre_id) VALUES
  ('Quiz Suites — Facile',           'facile',    900,  1),
  ('Quiz Suites — Moyen',            'moyen',     1200, 1),
  ('Quiz Suites — Difficile',        'difficile', 1800, 1),
  ('Quiz Probabilités — Facile',     'facile',    900,  3),
  ('Quiz Probabilités — Moyen',      'moyen',     1200, 3),
  ('Quiz Complexes — Moyen',         'moyen',     1200, 4),
  ('Quiz Mécanique — Facile',        'facile',    900,  11),
  ('Quiz Mécanique — Moyen',         'moyen',     1200, 11),
  ('Quiz Mécanique — Difficile',     'difficile', 1800, 11),
  ('Quiz Optique — Moyen',           'moyen',     1200, 12),
  ('Quiz Génétique — Moyen',         'moyen',     1200, 21),
  ('Quiz Géologie — Facile',         'facile',    900,  24),
  ('Quiz Géologie — Moyen',          'moyen',     1200, 24),
  ('Quiz Conscience — Moyen',        'moyen',     1200, 31),
  ('Quiz Colonisation — Facile',     'facile',    900,  41),
  ('Quiz Colonisation — Moyen',      'moyen',     1200, 41);

-- ============================================================
-- MATHÉMATIQUES — SUITES FACILE (quiz_id = 7)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Quelle est la raison d''une suite arithmétique dont u₀=3 et u₁=7 ?',
 '3','4','7','10', 2,
 'La raison est r = u₁ - u₀ = 7 - 3 = 4.', 7),

('Si (uₙ) est arithmétique de raison 2 et u₀=1, quel est u₅ ?',
 '9','11','10','12', 2,
 'u₅ = u₀ + 5r = 1 + 5×2 = 11.', 7),

('Une suite géométrique a u₀=2 et raison q=3. Quel est u₃ ?',
 '18','54','27','81', 2,
 'u₃ = u₀ × q³ = 2 × 27 = 54.', 7),

('La suite uₙ = 3n + 1 est :',
 'Géométrique','Constante','Arithmétique','Ni l''un ni l''autre', 3,
 'La différence uₙ₊₁ - uₙ = 3 est constante → suite arithmétique de raison 3.', 7),

('Quelle est la somme des 5 premiers termes de la suite 1, 3, 5, 7, 9 ?',
 '20','25','15','30', 2,
 'S = n(u₁+uₙ)/2 = 5(1+9)/2 = 25.', 7),

('Si uₙ = 2ⁿ, quelle est la limite de uₙ quand n→+∞ ?',
 '0','2','1','+∞', 4,
 '2ⁿ tend vers +∞ quand n→+∞.', 7),

('Une suite géométrique de raison |q| < 1 converge vers :',
 '+∞','0','1','−∞', 2,
 'Si |q| < 1, qⁿ tend vers 0.', 7),

('La suite définie par u₀=1 et uₙ₊₁ = uₙ/2 est :',
 'Arithmétique','Géométrique de raison 2','Géométrique de raison 1/2','Divergente', 3,
 'Chaque terme est multiplié par 1/2 : suite géométrique de raison 1/2.', 7),

('Quel est le terme général d''une suite arithmétique de premier terme a et raison r ?',
 'a × rⁿ','a + nr','a × nʳ','a + r/n', 2,
 'uₙ = u₀ + n×r = a + nr.', 7),

('La somme S = 1 + 2 + 3 + ... + 100 vaut :',
 '5000','5050','4950','10100', 2,
 'S = 100×101/2 = 5050.', 7);

-- ============================================================
-- MATHÉMATIQUES — SUITES MOYEN (quiz_id = 8)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('uₙ = 3×2ⁿ - 1 avec u₀=2 et uₙ₊₁ = 2uₙ + 1. Quelle est u₀ ?',
 '1','2','3','5', 2,
 'u₀ = 3×2⁰ - 1 = 3×1 - 1 = 2.', 8),

('La suite (vₙ) définie par vₙ = uₙ + 1 est géométrique si uₙ est :',
 'Arithmétique','Arithmético-géométrique du type uₙ₊₁ = auₙ + b','Constante','Croissante', 2,
 'Si uₙ₊₁ = auₙ + b, on pose vₙ = uₙ + l avec l = b/(1-a) : vₙ est géométrique.', 8),

('Soit uₙ₊₁ = 3uₙ - 2 et u₀ = 1. La limite de uₙ est :',
 '1','2','0','+∞', 4,
 'vₙ = uₙ - 1 géométrique de raison 3 (>1) → diverge vers +∞.', 8),

('La somme géométrique 1 + q + q² + ... + qⁿ⁻¹ vaut :',
 '(qⁿ-1)/(q-1)','n×q','q(1-qⁿ)/(1-q)','qⁿ', 1,
 'Formule de la somme géométrique : Sₙ = (qⁿ-1)/(q-1).', 8),

('Si uₙ = (-1)ⁿ, la suite est :',
 'Croissante','Convergente vers 0','Divergente','Géométrique de raison 1', 3,
 'La suite oscille entre -1 et 1 indéfiniment : elle diverge.', 8),

('Une suite croissante et majorée est :',
 'Divergente','Constante','Convergente','Nulle', 3,
 'Théorème de la limite monotone : toute suite croissante et majorée converge.', 8),

('Soit uₙ = (2n+1)/(n+3). La limite quand n→+∞ est :',
 '0','1','2','3', 3,
 'lim (2n+1)/(n+3) = lim 2n/n = 2.', 8),

('La suite uₙ = n! diverge-t-elle ?',
 'Non, elle converge vers e','Oui, vers +∞','Non, vers 0','Oui, vers -∞', 2,
 'n! croît plus vite que toute exponentielle : lim n! = +∞.', 8),

('Si aₙ ≤ uₙ ≤ bₙ et aₙ→l et bₙ→l, alors :',
 'uₙ diverge','uₙ→0','uₙ→l','uₙ→2l', 3,
 'Théorème des gendarmes : uₙ est coincée et converge vers l.', 8),

('Soit uₙ = 2uₙ₋₁ + 3 avec u₀=0. Trouver u₂.',
 '3','9','7','15', 2,
 'u₁ = 2×0+3=3 ; u₂ = 2×3+3=9.', 8);

-- ============================================================
-- PHYSIQUE — MÉCANIQUE FACILE (quiz_id = 13)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('L''unité du Newton est équivalente à :',
 'kg','kg·m/s²','kg·m/s','kg·m²/s²', 2,
 'Par F=ma : [F] = kg × m/s² = N.', 13),

('La 2ème loi de Newton s''énonce :',
 'F = mv','ΣF = ma','a = v/t','ΣF = mv²', 2,
 'La somme des forces est égale à ma.', 13),

('Un objet en chute libre depuis le repos parcourt en t secondes :',
 'gt','gt²/2','g/t','2gt', 2,
 'd = ½gt².', 13),

('La vitesse verticale d''un objet lancé horizontalement à v₀=10m/s après 2s est :',
 '10 m/s','20 m/s','0 m/s','5 m/s', 2,
 'vy = g×t = 10×2 = 20 m/s (g≈10m/s²).', 13),

('L''énergie cinétique d''un objet de masse m et vitesse v est :',
 'mv','mv²','½mv²','m²v', 3,
 'Ec = ½mv².', 13),

('Quelle force assure le mouvement circulaire uniforme ?',
 'Force de frottement','Force centripète','Force normale','Poids', 2,
 'La force centripète est dirigée vers le centre et assure la courbure.', 13),

('Si une force de 10N agit sur une masse de 2kg, l''accélération est :',
 '20 m/s²','0.2 m/s²','5 m/s²','12 m/s²', 3,
 'a = F/m = 10/2 = 5 m/s².', 13),

('Le principe d''inertie dit qu''un objet sans force nette :',
 'Accélère','Reste en repos ou en MRU','Ralentit','Tombe', 2,
 '1ère loi de Newton : sans force résultante → vitesse constante.', 13),

('L''unité de l''énergie est :',
 'Newton','Watt','Joule','Pascal', 3,
 'L''énergie se mesure en Joules (J).', 13),

('La quantité de mouvement d''un objet est :',
 'mv²','Fd','mv','½mv²', 3,
 'p = mv (masse × vitesse).', 13);

-- ============================================================
-- PHYSIQUE — MÉCANIQUE MOYEN (quiz_id = 14)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Un projectile lancé à 45° avec v₀=20m/s. La portée maximale est (g=10) :',
 '20 m','30 m','40 m','50 m', 3,
 'R = v₀²sin(2θ)/g = 400×1/10 = 40 m.', 14),

('L''altitude maximale d''un projectile lancé à v₀ vertical est :',
 'v₀/g','v₀²/g','v₀²/(2g)','2v₀²/g', 3,
 'h = v₀²/(2g) par conservation de l''énergie.', 14),

('Deux forces de 3N et 4N perpendiculaires ont une résultante de :',
 '7 N','1 N','5 N','12 N', 3,
 'R = √(3²+4²) = √25 = 5 N.', 14),

('Le travail d''une force F sur déplacement d avec angle θ est :',
 'Fd','F+d','Fd·sinθ','Fd·cosθ', 4,
 'W = F·d·cosθ.', 14),

('La puissance mécanique est :',
 'F×t','W/t','F×d','m×a²', 2,
 'P = W/t = Fv.', 14),

('Le théorème de l''énergie cinétique énonce que :',
 'Ec = mgh','ΔEc = ΣW','Ec = ½kx²','ΔEc = -ΔEp', 2,
 'La variation de Ec est égale au travail total des forces appliquées.', 14),

('En chute libre sans frottement, l''énergie mécanique est :',
 'Nulle','Croissante','Conservée','Décroissante', 3,
 'Sans frottement, Em = Ec + Ep = constante.', 14),

('Dans F = G·m₁·m₂/r², G est :',
 'Variable','La constante gravitationnelle (6,67×10⁻¹¹ N·m²/kg²)','La masse de la Terre','L''accélération', 2,
 'G = 6,67×10⁻¹¹ N·m²·kg⁻² est une constante universelle.', 14),

('Un satellite en orbite circulaire est en :',
 'Équilibre statique','Chute libre permanente','Accélération nulle','Mouvement rectiligne', 2,
 'Un satellite est en chute libre permanente autour de la Terre.', 14),

('Si la vitesse double, l''énergie cinétique est multipliée par :',
 '2','4','8','√2', 2,
 'Ec = ½mv² → si v×2 : Ec = ½m(2v)² = 4×½mv².', 14);

-- ============================================================
-- SVT — GÉNÉTIQUE MOYEN (quiz_id = 17)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Le support moléculaire de l''information génétique est :',
 'L''ARN','Les protéines','L''ADN','Les lipides', 3,
 'L''ADN (acide désoxyribonucléique) est le support de l''information génétique.', 17),

('La mitose produit :',
 '4 cellules haploïdes','2 cellules diploïdes identiques','4 cellules diploïdes','2 cellules haploïdes', 2,
 'La mitose donne 2 cellules filles génétiquement identiques à la cellule mère (diploïdes).', 17),

('Un individu homozygote pour un gène a :',
 'Deux allèles différents','Un seul allèle','Deux allèles identiques','Aucun allèle', 3,
 'Homozygote = deux allèles identiques (AA ou aa).', 17),

('La première loi de Mendel est la loi de :',
 'Ségrégation','Uniformité des hybrides F1','Assortiment indépendant','Dominance', 2,
 '1ère loi : les hybrides F1 de deux parents purs sont uniformes.', 17),

('Un gène létal à l''état homozygote modifie le ratio de 3:1 en :',
 '2:1','1:1','1:2:1','4:1', 1,
 'Si AA est létal, seuls Aa et aa survivent → ratio 2:1 au lieu de 3:1.', 17),

('Un nucléotide d''ADN contient :',
 'Glucose + base azotée','Désoxyribose + phosphate + base azotée','Ribose + base','Acide aminé + sucre', 2,
 'Un nucléotide = désoxyribose + groupement phosphate + base azotée.', 17),

('Dans l''ADN, la base A s''apparie avec :',
 'G','C','U','T', 4,
 'Dans l''ADN : A-T et C-G (règle de Chargaff).', 17),

('La transcription de l''ADN produit :',
 'De l''ADN','Des protéines','De l''ARNm','Des ribosomes', 3,
 'La transcription copie l''info de l''ADN en ARN messager.', 17),

('La traduction se fait dans :',
 'Le noyau','Les ribosomes','Les mitochondries','Le réticulum lisse', 2,
 'La traduction de l''ARNm en protéine a lieu dans les ribosomes.', 17),

('Un codon code pour :',
 'Un nucléotide','Un gène','Un acide aminé','Une protéine entière', 3,
 'Un codon = 3 nucléotides consécutifs = 1 acide aminé dans la protéine.', 17);

-- ============================================================
-- PHILOSOPHIE — CONSCIENCE MOYEN (quiz_id = 20)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Selon Descartes, la conscience de soi s''exprime par :',
 'Je vis, donc je suis','Je pense, donc je suis','Je sens, donc j''existe','Je veux, donc je suis', 2,
 'Le Cogito cartésien : "Cogito ergo sum" — Je pense, donc je suis.', 20),

('La conscience réflexive est :',
 'La conscience des autres','La conscience de sa propre conscience','L''inconscient','La perception du monde', 2,
 'La réflexivité est la capacité de la conscience à se prendre elle-même pour objet.', 20),

('Pour Freud, l''inconscient :',
 'N''existe pas','Est identique à la conscience','Contient des désirs refoulés','Est purement biologique', 3,
 'Freud définit l''inconscient comme le siège des désirs et pulsions refoulés.', 20),

('L''introspection consiste à :',
 'Observer les autres','S''observer soi-même','Analyser l''inconscient','Étudier le cerveau', 2,
 'L''introspection est l''examen de ses propres états mentaux et pensées.', 20),

('Le problème du solipsisme est :',
 'L''impossibilité de connaître le passé','L''impossibilité de prouver l''existence des autres','La limite de la raison','Le déterminisme', 2,
 'Le solipsisme doute de l''existence de toute réalité extérieure à sa propre conscience.', 20),

('Pour Sartre, la conscience est :',
 'Toujours pleine de contenu','Néant — elle se définit par ce qu''elle n''est pas','Identique à l''âme','Déterminée par le corps', 2,
 'Sartre dit que la conscience est "pour-soi" : elle est néant et liberté radicale.', 20),

('La mauvaise foi chez Sartre est :',
 'Mentir aux autres','Se mentir à soi-même pour fuir sa liberté','L''orgueil','L''erreur de jugement', 2,
 'La mauvaise foi consiste à nier sa propre liberté pour fuir la responsabilité.', 20),

('L''aliénation de la conscience chez Marx désigne :',
 'La liberté de penser','Le détachement spirituel','La prise de conscience de soi','La dépossession de l''homme par le travail', 4,
 'Marx : l''aliénation est le processus par lequel l''homme est dépossédé de son travail et de lui-même.', 20),

('La phénoménologie de Husserl s''intéresse à :',
 'L''inconscient','Les phénomènes tels qu''ils apparaissent à la conscience','La structure du cerveau','L''histoire des idées', 2,
 'Husserl étudie les vécus de la conscience et la façon dont les choses nous apparaissent.', 20),

('Le "moi" chez Hume est :',
 'Une substance permanente','Un simple faisceau d''impressions changeantes','L''âme immortelle','Le sujet de la raison pure', 2,
 'Hume nie l''existence d''un moi substantiel : le moi n''est qu''une succession d''impressions.', 20);

-- ============================================================
-- HISTOIRE — COLONISATION FACILE (quiz_id = 21)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('En quelle année Madagascar est-elle devenue colonie française ?',
 '1885','1895','1900','1912', 2,
 'Madagascar fut officiellement annexée par la France en 1895 après la victoire militaire française.', 21),

('Qui commandait l''expédition française de 1895 à Madagascar ?',
 'Gallieni','Joffre','Duchesne','Lyautey', 3,
 'Le général Duchesne a commandé l''expédition militaire de 1895.', 21),

('Quel mot malgache désigne le souverain ou roi ?',
 'Roi','Sultan','Merina','Mpanjaka', 4,
 'Mpanjaka désigne le souverain ou roi en malgache.', 21),

('Qui était la dernière reine de Madagascar ?',
 'Ranavalona I','Ranavalona II','Ranavalona III','Rasoherina', 3,
 'Ranavalona III fut déposée et exilée par les Français en 1897.', 21),

('Le système de l''indigénat imposait aux Malgaches :',
 'Le droit de vote','Des travaux forcés et impôts','La liberté de culte','L''enseignement gratuit', 2,
 'L''indigénat soumettait les colonisés aux travaux forcés et les privait de droits civiques.', 21),

('La révolte nationaliste malgache de 1947 est connue sous le nom de :',
 'Révolution rouge','Insurrection du 29 mars','Soulèvement des menalamba','Révolte des côtiers', 2,
 'L''insurrection du 29 mars 1947 fut une révolte nationaliste brutalement réprimée par la France.', 21),

('Les cultures de rente imposées par les Français étaient principalement :',
 'Le maïs','La vanille et le café','Le riz','Le manioc', 2,
 'Les Français développèrent des cultures d''exportation : vanille, café, cacao, girofle.', 21),

('Gallieni est connu à Madagascar pour avoir :',
 'Accordé l''indépendance','Aboli l''esclavage et réorganisé l''administration','Construit le chemin de fer','Fondé Antananarivo', 2,
 'Gallieni (gouverneur 1896-1905) abolit la royauté, l''esclavage et mit en place l''administration coloniale.', 21),

('L''économie coloniale de Madagascar reposait principalement sur :',
 'L''industrie lourde','L''extraction minière','L''agriculture et l''élevage','Le commerce maritime', 3,
 'L''économie coloniale était essentiellement agricole et pastorale.', 21),

('En quelle année Madagascar a-t-elle obtenu son indépendance ?',
 '1947','1958','1960','1965', 3,
 'Madagascar accéda à l''indépendance le 26 juin 1960.', 21);

-- ============================================================
-- DÉRIVÉES DIFFICILE — Questions supplémentaires (quiz_id = 3)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('Trouver les asymptotes de f(x) = (x²-1)/(x-2).',
 'y=x+2 (oblique) et x=2 (verticale)',
 'y=x (oblique) et x=1 (verticale)',
 'y=x+2 (oblique) et x=0 (verticale)',
 'y=2 (horizontale) et x=1 (verticale)', 1,
 'Division euclidienne : (x²-1)÷(x-2) = x+2 + 3/(x-2). Asymptote oblique y=x+2, verticale x=2.', 3),

('La dérivée de f(x) = arctan(x) est :',
 '1/cos²(x)','1/(1+x²)','1/√(1-x²)','-1/(1+x²)', 2,
 '(arctan x)'' = 1/(1+x²).', 3),

('Pour f(x) = x^sin(x), on obtient f''(x)/f(x) = :',
 'cos(x)·ln(x) + sin(x)/x',
 'cos(x)/x + sin(x)·ln(x)',
 'cos(x)',
 'sin(x)/x', 1,
 'ln f = sin(x)·ln(x) → f''/f = cos(x)·ln(x) + sin(x)/x.', 3),

('Un point d''inflexion existe là où :',
 'f''(x₀) = 0',
 'f''''(x₀) = 0 et f'''' change de signe',
 'f(x₀) = 0',
 'f''(x₀) > 0', 2,
 'Point d''inflexion : la dérivée seconde s''annule et change de signe (changement de concavité).', 3),

('La règle de l''Hôpital s''applique pour la forme indéterminée :',
 '0/∞','∞-∞','0/0 ou ∞/∞','0×∞', 3,
 'L''Hôpital permet de calculer lim f/g = lim f''/g'' sous les formes 0/0 ou ∞/∞.', 3);

-- ============================================================
-- OPTIQUE — MOYEN (quiz_id = 16)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('La loi de Snell-Descartes pour la réfraction est :',
 'n₁cosθ₁ = n₂cosθ₂','n₁sinθ₁ = n₂sinθ₂','n₁θ₁ = n₂θ₂','sinθ₁/sinθ₂ = n₂', 2,
 'n₁sinθ₁ = n₂sinθ₂ (loi de Snell-Descartes).', 16),

('L''indice de réfraction de l''eau est environ :',
 '1,0','1,33','1,5','2,0', 2,
 'L''eau a un indice n ≈ 1,33.', 16),

('La vergence d''une lentille est :',
 'Sa distance focale','L''inverse de la distance focale en dioptries','Son grossissement','Son diamètre', 2,
 'V = 1/f'' en dioptries (δ).', 16),

('Une lentille convergente a une vergence :',
 'Négative','Nulle','Positive','Variable', 3,
 'Vergence positive = lentille convergente.', 16),

('La formule de conjugaison de Descartes est :',
 '1/OA'' - 1/OA = 1/f''',
 '1/OA'' + 1/OA = 1/f''',
 'OA'' × OA = f''²',
 '1/f'' = 1/OA - 1/OA''', 1,
 '1/OA'' - 1/OA = 1/f'' (avec la convention algébrique).', 16),

('L''angle limite pour la réflexion totale interne vérifie :',
 'sinθ_lim = n₂/n₁ avec n₁ > n₂',
 'sinθ_lim = n₁/n₂',
 'θ_lim = 45°',
 'cosθ_lim = n₂/n₁', 1,
 'Réflexion totale quand sinθ ≥ n₂/n₁ (milieu optiquement plus dense vers moins dense).', 16),

('Le grossissement γ = OA''/OA. Pour une image droite :',
 'γ < 0','γ > 0','γ = 0','γ = ±1', 2,
 'γ > 0 : image dans le même sens que l''objet (image droite).', 16),

('La lumière blanche est dispersée par un prisme car :',
 'Les couleurs ont la même vitesse',
 'Les couleurs ont des indices de réfraction différents',
 'Le prisme absorbe certaines couleurs',
 'La lumière est réfléchie', 2,
 'Chaque longueur d''onde a un indice n différent → dispersion chromatique.', 16),

('Un miroir plan donne une image :',
 'Réelle et renversée','Virtuelle et droite','Réelle et droite','Virtuelle et renversée', 2,
 'L''image dans un miroir plan est virtuelle (derrière le miroir), droite et de même taille.', 16),

('La distance focale d''une lentille de vergence 4δ est :',
 '4 m','0,25 m','0,4 m','40 cm', 2,
 'f'' = 1/V = 1/4 = 0,25 m.', 16);

-- ============================================================
-- SVT — GÉOLOGIE FACILE (quiz_id = 18)
-- ============================================================
INSERT INTO questions (question, choix1, choix2, choix3, choix4, bonne_reponse, explication, quiz_id) VALUES
('La tectonique des plaques décrit :',
 'La statique de la Terre','Le mouvement des plaques lithosphériques','La formation des volcans uniquement','La composition du noyau', 2,
 'La tectonique des plaques décrit le mouvement des grandes plaques lithosphériques.', 18),

('La dorsale océanique est un lieu de :',
 'Subduction','Collision','Expansion océanique','Disparition de croûte', 3,
 'Les dorsales sont des zones de divergence où du magma remonte et crée une nouvelle croûte.', 18),

('Une zone de subduction se forme quand :',
 'Deux plaques continentales divergent',
 'Une plaque océanique s''enfonce sous une autre plaque',
 'Deux plaques se heurtent sans l''une plonger',
 'Une plaque disparaît en surface', 2,
 'La subduction : une plaque océanique (plus dense) plonge sous une plaque continentale.', 18),

('Les séismes se produisent principalement :',
 'Au centre des plaques','Aux frontières des plaques','Sous les océans uniquement','Dans les volcans uniquement', 2,
 'La majorité des séismes se produisent aux limites de plaques.', 18),

('Le foyer d''un séisme est :',
 'L''épicentre en surface',
 'Le point directement au-dessus en surface',
 'Le point de rupture en profondeur',
 'La zone de choc à la surface', 3,
 'Le foyer (hypocentre) est le point de rupture profond ; l''épicentre est sa projection en surface.', 18),

('La lave des dorsales provient de la fusion partielle :',
 'De la croûte continentale','Du manteau asthénosphérique','Du noyau externe','De sédiments marins', 2,
 'La remontée de magma vient de la fusion partielle du manteau asthénosphérique.', 18),

('Les Alpes se sont formées par :',
 'Subduction','Collision entre plaques continentales','Expansion océanique','Éruption volcanique', 2,
 'Les Alpes sont nées de la collision entre les plaques africaine et eurasienne.', 18),

('L''âge des roches océaniques augmente :',
 'En se rapprochant des dorsales','En s''éloignant des dorsales','Aux zones de subduction','De façon uniforme', 2,
 'Les roches les plus jeunes sont près de la dorsale, les plus vieilles s''en éloignent.', 18),

('Madagascar s''est séparée de l''Afrique il y a environ :',
 '10 millions d''années','65 millions d''années','165 millions d''années','500 millions d''années', 3,
 'Madagascar s''est séparée de l''Afrique il y a environ 165 millions d''années.', 18),

('Des fossiles marins trouvés sur des montagnes prouvent que :',
 'Les mers reculent','Des terrains jadis sous l''eau ont été soulevés','Les fossiles flottent','Les montagnes coulent', 2,
 'La présence de fossiles marins en altitude atteste du soulèvement de fonds marins anciens.', 18);