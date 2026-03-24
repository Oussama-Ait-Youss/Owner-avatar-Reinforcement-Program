-- EXERCICE 1 - Requetes SQL sur une base de donnees RH simple
--
-- Schema fourni :
--   employes(id, nom, prenom, departement_id, salaire, date_embauche, manager_id)
--   departements(id, nom, localisation, budget)
--
-- Travail demande :
--
-- 1. Lister tous les employes du departement 'Technologie', tries par salaire decroissant.
-- 2. Compter le nombre d'employes par departement.
-- 3. Trouver les employes dont le salaire est superieur a la moyenne generale.
-- 4. Lister les employes embauch es en 2022 ou 2023, avec le nom de leur departement.
-- 5. Afficher les departements dont la masse salariale (sum salaires) depasse 50 000 DH.
-- 6. Trouver l'employe le mieux paye de chaque departement (nom departement, nom employe, salaire).

-- Schema de creation et donnees
CREATE TABLE IF NOT EXISTS departements (
    id INT PRIMARY KEY,
    nom VARCHAR(50),
    localisation VARCHAR(50),
    budget DECIMAL(12,2)
);

CREATE TABLE IF NOT EXISTS employes (
    id INT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    departement_id INT,
    salaire DECIMAL(10,2),
    date_embauche DATE,
    manager_id INT,
    FOREIGN KEY (departement_id) REFERENCES departements(id)
);

INSERT INTO departements VALUES
(1, 'Technologie',  'Casablanca', 250000),
(2, 'Finance',      'Rabat',      180000),
(3, 'RH',           'Casablanca', 120000),
(4, 'Commercial',   'Marrakech',  200000);

INSERT INTO employes VALUES
(1,  'Alami',    'Karim',   1, 14000, '2019-03-15', NULL),
(2,  'Benali',   'Sara',    1, 11500, '2020-07-01', 1),
(3,  'Chraibi',  'Omar',    1, 16000, '2018-01-10', 1),
(4,  'Drissi',   'Hanane',  3, 10500, '2022-04-20', NULL),
(5,  'Ennaji',   'Youssef', 3, 8500,  '2023-09-05', 4),
(6,  'Fassi',    'Samira',  2, 9800,  '2020-02-14', NULL),
(7,  'Ghazali',  'Mehdi',   2, 13000, '2019-11-30', 6),
(8,  'Hamdaoui', 'Nadia',   1, 12500, '2022-06-22', 1),
(9,  'Idrissi',  'Karim',   4, 11000, '2023-05-18', NULL),
(10, 'Jalal',    'Fatima',  4, 9500,  '2021-08-03', 9),
(11, 'Khalil',   'Anas',    1, 15000, '2016-12-01', 1),
(12, 'Lamrani',  'Zineb',   2, 22000, '2015-03-08', NULL);

-- Ecrivez vos requetes ci-dessous

-- 1. Employes du departement Technologie, tries par salaire decroissant

    select employes.id,employes.nom,employes.prenom, departements.nom,employes.salaire
    from employes
    join departements on employes.departement_id = departements.id
    where departements.nom = 'Technologie'
    order by employes.salaire DESC;

-- 2. Nombre d'employes par departement

    select count(employes.id) as nombre_empl,departements.nom
    from employes
    JOIN departements ON employes.departement_id = departements.id
    GROUP BY departements.nom;

-- 3. Employes avec salaire superieur a la moyenne

    SELECT nom, prenom, salaire,MoyenneFROM employesWHERE salaire > (SELECT AVG(salaire) as Moyenne FROM employes);

-- 4. Employes embauch es en 2022 ou 2023 avec nom departement

    SELECT employes.nom,employes.prenom,employes.salaire,departements.nom
    FROM employes
    JOIN departements on employes.departement_id = departements.id
    WHERE YEAR(employes.date_embauche) IN (2022,2023);

-- 5. Departements dont la masse salariale > 50 000

    SELECT SUM(salaire) AS salariable
    FROM employes
    JOIN departements ON employes.departement_id = departements.id
    GROUP BY departements.id
    HAVING salariable > 50000;

-- 6. Employe le mieux paye par departement

    SELECT d.nom as departement, e.nom as employe, e.salaire
FROM employes e
JOIN departements d ON e.departement_id = d.id
WHERE e.salaire = (
    SELECT MAX(salaire) 
    FROM employes 
    WHERE departement_id = d.id
);