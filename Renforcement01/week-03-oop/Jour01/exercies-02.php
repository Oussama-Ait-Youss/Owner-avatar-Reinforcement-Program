<?php
/**
 * EXERCICE 2 - Classe Produit avec gestion de stock
 *
 * Classe Produit :
 *   Proprietes : id, nom, description, prix, stock, categorie, actif
 *
 * Constructeur :
 *   __construct(string $nom, float $prix, int $stock, string $categorie)
 *   - prix doit etre > 0
 *   - stock doit etre >= 0
 *   - Lever InvalidArgumentException si invalide
 *
 * Methodes :
 *   approvisionner(int $quantite) : void
 *     Ajouter la quantite au stock. Lever InvalidArgumentException si quantite <= 0.
 *
 *   vendre(int $quantite) : float
 *     Verifier si le stock est suffisant.
 *     Lever une RuntimeException("Stock insuffisant") si non.
 *     Decremente le stock, retourne le montant total (prix * quantite).
 *
 *   appliquerRemise(float $pourcentage) : void
 *     Appliquer une remise. Pourcentage doit etre entre 1 et 50.
 *
 *   estDisponible() : bool
 *     Retourner true si actif ET stock > 0.
 *
 *   toArray() : array
 */

class Produit
{
    private $id;
    private $nom;
    private $description;
    private $prix;
    private $stock;
    private $categorie;
    private $actif;

    public function __construct(string $nom, float $prix, int $stock, string $categorie)
    {      

    $this->nom = $nom;

    if(!($prix > 0)){
        throw new InvalidArgumentException("invalide prix");
    }
    if(!($stock > 0)){
        throw new InvalidArgumentException("invalide stock");
    }
    $this->prix = $prix;
    $this->stock = $stock;
    $this->categorie = $categorie;
    $this->actif = true;
    }


    // approvisionner(int $quantite) : void Ajouter la quantite au stock. Lever InvalidArgumentException si quantite <= 0.

    public function approvisionner(int $quantite)
    {
        if(!($quantite <= 0)){
            throw new InvalidArgumentException("Quantite > 1 at least...");
        }

        $this->stock += $quantite;
    }

//     vendre(int $quantite) : float
//  *     Verifier si le stock est suffisant.
//  *     Lever une RuntimeException("Stock insuffisant") si non.
//  *     Decremente le stock, retourne le montant total (prix * quantite).

    public function vendre(int $quantite){
        // verfifier se le stock est suffisant
        if(!($this->stock > $quantite))
        {
            throw new RuntimeException("stock insuffisant");
        }






        $this->stock -= $quantite;

        return $this->prix * $quantite;
    }


//     appliquerRemise(float $pourcentage) : void
//  *     Appliquer une remise. Pourcentage doit etre entre 1 et 50.

        public function appliquerRemise(float $pourcentage)
{
    if ($pourcentage < 1 || $pourcentage > 50) {
        throw new Exception("Le pourcentage doit être entre 1 et 50");
    }

    $this->prix -= ($this->prix * $pourcentage / 100);
}

        public function estDisponible()
        {

            return $this->stock > 0 && $this->actif == true;

        }

        }

        // to array 
        public function toarray(){
            return [
                'nom' => $this->nom,
                'description' => $this->description,
                'prix' => $this->prix,
                'stock' => $this->stock,
                'categorie' => $this->categorie,
                'actif' => $this->actif
            ];
        }


        // getters

        public function getStock(){
            return $this->stock;
        }

        public function getPrix(){
            return $this->prix;
        }




}




// Tests
try {
    $p = new Produit('Laptop Pro', 8500.00, 10, 'Informatique');
    echo "Stock initial : " . $p->getStock() . PHP_EOL;

    $p->approvisionner(5);
    echo "Apres appro : " . $p->getStock() . PHP_EOL; // 15

    $montant = $p->vendre(3);
    echo "Vente 3 unites, montant : " . $montant . " DH" . PHP_EOL; // 25500

    $p->appliquerRemise(10);
    echo "Prix apres remise 10% : " . $p->getPrix() . PHP_EOL; // 7650

    // Test stock insuffisant
    $p->vendre(100);
} catch (RuntimeException $e) {
    echo 'Erreur stock : ' . $e->getMessage() . PHP_EOL;
}