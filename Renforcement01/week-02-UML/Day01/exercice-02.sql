-- EXERCICE 2 - Jointures sur une base e-commerce simple
--
-- Schema :
--   clients(id, nom, ville, email)
--   produits(id, nom, prix, categorie_id, stock)
--   categories(id, nom)
--   commandes(id, client_id, date_commande, statut)
--   lignes_commande(id, commande_id, produit_id, quantite, prix_unitaire)
--
-- Travail demande :
-- 1. Lister toutes les commandes avec le nom du client et le nombre d'articles.
-- 2. Calculer le montant total de chaque commande.
-- 3. Trouver les clients n'ayant jamais passe de commande.
-- 4. Top 3 produits les plus vendus (par quantite totale).
-- 5. Chiffre d'affaires par categorie, trie par CA decroissant.

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY,
    nom VARCHAR(100),
    ville VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS produits (
    id INT PRIMARY KEY,
    nom VARCHAR(100),
    prix DECIMAL(10,2),
    categorie_id INT,
    stock INT,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS commandes (
    id INT PRIMARY KEY,
    client_id INT,
    date_commande DATE,
    statut VARCHAR(20),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS lignes_commande (
    id INT PRIMARY KEY,
    commande_id INT,
    produit_id INT,
    quantite INT,
    prix_unitaire DECIMAL(10,2),
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

INSERT INTO categories VALUES (1,'Electronique'),(2,'Mobilier'),(3,'Accessoires');
INSERT INTO clients VALUES
(1,'Alami Hassan','Casablanca','h.alami@email.ma'),
(2,'Benali Sara','Rabat','s.benali@email.ma'),
(3,'Chraibi Omar','Fes','o.chraibi@web.ma'),
(4,'Drissi Fatima','Tanger','f.drissi@web.ma');
INSERT INTO produits VALUES
(1,'Laptop',8500,1,10),(2,'Souris',150,3,50),(3,'Clavier',420,3,30),
(4,'Ecran',1800,1,15),(5,'Chaise',1500,2,8),(6,'Bureau',2200,2,5);
INSERT INTO commandes VALUES
(1,1,'2024-01-10','livre'),(2,2,'2024-01-15','livre'),
(3,1,'2024-02-05','en_cours'),(4,3,'2024-02-20','livre');
INSERT INTO lignes_commande VALUES
(1,1,1,1,8500),(2,1,2,2,150),(3,2,4,1,1800),(4,2,3,1,420),
(5,3,2,3,150),(6,3,6,1,2200),(7,4,1,2,8500),(8,4,5,1,1500);

-- Ecrivez vos requetes ci-dessous

-- 1. Commandes avec nom client et nombre d'articles
SELECT c.id AS commande_id, cl.nom AS nom_client, SUM(lc.quantite) AS nombre_articles
FROM commandes c
JOIN clients cl ON c.client_id = cl.id
JOIN lignes_commande lc ON c.id = lc.commande_id
GROUP BY c.id, cl.nom;

-- 2. Montant total par commande
SELECT commande_id, SUM(quantite * prix_unitaire) AS montant_total
FROM lignes_commande
GROUP BY commande_id;


-- 3. Clients sans commande
SELECT cl.id, cl.nom
FROM clients cl
LEFT JOIN commandes c ON cl.id = c.client_id
WHERE c.id IS NULL;


-- 4. Top 3 produits les plus vendus
SELECT p.nom AS produit, SUM(lc.quantite) AS quantite_totale
FROM produits p
JOIN lignes_commande lc ON p.id = lc.produit_id
GROUP BY p.id, p.nom
ORDER BY quantite_totale DESC
LIMIT 3;


-- 5. CA par categorie
SELECT cat.nom AS categorie, SUM(lc.quantite * lc.prix_unitaire) AS chiffre_affaires
FROM categories cat
JOIN produits p ON cat.id = p.categorie_id
JOIN lignes_commande lc ON p.id = lc.produit_id
GROUP BY cat.id, cat.nom
ORDER BY chiffre_affaires DESC;