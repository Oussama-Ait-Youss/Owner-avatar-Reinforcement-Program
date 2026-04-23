<?php

/**
 * EXERCICE 1 - Gestion d'une pharmacie
 *
 * Une pharmacie gere son stock de medicaments et les ordonnances patients.
 *
 * =====================================================================
 * Classe Medicament :
 *   Proprietes : id, nom, prixUnitaire, stockActuel, stockMinimum, surOrdonnance
 *
 * Methodes :
 *
 *   approvisionner(int $quantite) : void
 *     Augmenter le stock. Quantite doit etre > 0.
 *
 *   estEnRupture() : bool
 *     Retourner true si stockActuel == 0.
 *
 *   estEnStockCritique() : bool
 *     Retourner true si 0 < stockActuel <= stockMinimum.
 *
 *   toString() : string
 *     Format : "Doliprane 500mg | Prix: 12.50 DH | Stock: 45 unites"
 *
 * =====================================================================
 * Classe LignePrescription :
 *   Proprietes : medicament (Medicament), quantitePrescrite, posologie (string)
 *
 * =====================================================================
 * Classe Ordonnance :
 *   Proprietes : id, nomPatient, medecin, date, lignes (LignePrescription[]),
 *                dispensee (bool)
 *
 * Methodes :
 *
 *   ajouterMedicament(Medicament $med, int $quantite, string $posologie) : void
 *     Verifier que le medicament n'est pas deja dans l'ordonnance.
 *     Lever une LogicException si doublon.
 *
 *   calculerCout() : float
 *     Calculer le total brut des medicaments de l'ordonnance.
 *     Appliquer une prise en charge securite sociale : 70% du total.
 *     Retourner le montant restant a charge patient (30%).
 *
 *   dispenser(Pharmacie $pharmacie) : array
 *     Verifier pour chaque medicament :
 *       - Disponible en stock
 *       - Non en rupture
 *     Decremente les stocks si tout est OK.
 *     Retourner ['succes' => bool, 'message' => string, 'manquants' => array]
 *     Marquer l'ordonnance comme dispensee.
 *
 * =====================================================================
 * 
 * 
 * Classe Pharmacie :
 *   Proprietes : nom, medicaments (Medicament[])
 *
 * Methodes :
 *
 *   ajouterMedicament(Medicament $med) : void
 *
 *   rechercherMedicament(string $nom) : ?Medicament
 *     Recherche insensible a la casse. Retourner null si non trouve.
 *
 *   getMedicamentsEnRupture() : array
 *   getMedicamentsEnStockCritique() : array
 *
 *   valeurStockTotal() : float
 *     Retourner sum(prixUnitaire * stockActuel) pour tous les medicaments.
 */

// Votre implementation ci-dessous


    class Medicament{
        private $id;
        private $nom ;
        private $prixUnitaire;
        private $stockActuel;
        private $stockMinimum;
        private $surOrdonnance;



        public function __construct($nom,$prixUnitaire,$stockActuel,$stockMinimum,$surOrdonnance)
        {
                $this->nom = $nom;
                $this->prixUnitaire = $prixUnitaire;
                $this->stockMinimum = $stockMinimum;
                $this->surOrdonnance = $surOrdonnance;
        }

        public function approvisionner(int $quantite){
            if(!($quantite)){
                $this->stockActuel += $quantite;
            }
        }

        public function estEnRupture(){
            if($this->stockActuel == 0){
                return true;
            }
        }

        public function __toString(){
            return "$this->nom | Prix: $this->prixUnitaire | Stock : $this->stockActuel";
        }

    }
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    class Pharmacie{
        private $nom;
        private $medicants = [];





        public function __construct($nom)
        {
            $this->nom = $nom;
        }

        public function ajouterMedicament(Medicament $med){

        }

        public function rechercherMedicament(string $nom) : ?Medicament{

        }

        public function getMedicamentsEnRupture() : array{

        }
        public function getMedicamentsEnStockCritique() : array{

        }
 
        public function valeurStockTotal() : float{

            return sum($this->prixUnitaire * $this->stockActuel);
        }
        
        


    }



// Tests attendus
$pharmacie = new Pharmacie("Pharmacie Centrale");

$paracetamol = new Medicament("Paracetamol 500mg", 12.50, 80, 15, false);
$amoxicilline = new Medicament("Amoxicilline 500mg", 35.00, 8, 20, true);
$ibuprofene = new Medicament("Ibuprofene 400mg", 18.00, 0, 10, false);
$metformine = new Medicament("Metformine 850mg", 28.00, 3, 15, true);

$pharmacie->ajouterMedicament($paracetamol);
$pharmacie->ajouterMedicament($amoxicilline);
$pharmacie->ajouterMedicament($ibuprofene);
$pharmacie->ajouterMedicament($metformine);

echo "=== Etat du stock ===" . PHP_EOL;
echo "Ruptures : " . count($pharmacie->getMedicamentsEnRupture()) . PHP_EOL;
echo "Critiques : " . count($pharmacie->getMedicamentsEnStockCritique()) . PHP_EOL;
echo "Valeur stock : " . $pharmacie->valeurStockTotal() . " DH" . PHP_EOL;

$ordonnance = new Ordonnance("Alami Hassan", "Dr. Benali");
$ordonnance->ajouterMedicament($paracetamol, 2, "1 comprime toutes les 8h");
$ordonnance->ajouterMedicament($amoxicilline, 1, "1 gelule 3 fois par jour");

echo PHP_EOL . "=== Ordonnance ===" . PHP_EOL;
echo "Reste a charge : " . $ordonnance->calculerCout() . " DH" . PHP_EOL;

$resultat = $ordonnance->dispenser($pharmacie);
echo "Dispensation : " . ($resultat['succes'] ? 'OK' : 'ECHEC') . PHP_EOL;
if (!$resultat['succes']) echo "Message : " . $resultat['message'] . PHP_EOL;