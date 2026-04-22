<?php
/**
 * EXERCICE 1 - Premiere classe PHP : Gestion d'un compte utilisateur
 *
 * Contexte :
 * Vous devez implementer une classe simple de gestion de compte utilisateur
 * avant d'aborder des classes metier plus complexes.
 *
 * Specifications :
 *
 * Classe Utilisateur :
 *   Proprietes : id, nom, prenom, email, motDePasse (hache), actif, dateCreation
 *
 * Constructeur :
 *   __construct(string $nom, string $prenom, string $email, string $motDePasse)
 *   - Valider que l'email est valide (utiliser filter_var)
 *   - Hacher le mot de passe avec password_hash()
 *   - Lancer une InvalidArgumentException si l'email est invalide
 *
 * Methodes :
 *   getNomComplet() : string
 *     Retourner "Prenom Nom"
 *
 *   verifierMotDePasse(string $motDePasse) : bool
 *     Verifier le mot de passe avec password_verify()
 *
 *   changerEmail(string $nouvelEmail) : void
 *     Valider le nouvel email avant de le changer.
 *     Lancer InvalidArgumentException si invalide.
 *
 *   desactiver() : void
 *     Mettre actif a false.
 *
 *   toArray() : array
 *     Retourner toutes les proprietes SAUF le mot de passe.
 */

class Utilisateur
{
    private static int $nextId = 1;
    private int $id;
    private string $nom;
    private string $prenom;
    private string $email;
    private string $motDePasse;
    private bool $actif;
    private string $dateCreation;

    public function __construct(string $nom, string $prenom, string $email, string $motDePasse)
    {
        if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
            throw new InvalidArgumentException('email invalide...');
            }
        $this->email = $email;
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->motDePasse = password_hash($motDePasse,PASSWORD_DEFAULT);
        $this->actif = true;
        $this->dateCreation = date('Y-m-d');
        $this->id = self::$nextId++;
    }


    public function getNomComplet(): string
    {
        return "$this->nom"." $this->prenom";
    }

    public function verifierMotDePasse(string $motDePasse): bool
    {   
        $hash_password = password_hash($motDePasse,PASSWORD_DEFAULT);
        return password_verify($motDePasse,$hash_password);
    }

    public function changerEmail(string $nouvelEmail): void
    {
        if(filter_var($nouvelEmail,FILTER_VALIDATE_EMAIL)){
            $this->email = $nouvelEmail;
        }else{
            throw new InvalidArgumentException("invalide email format");
        }
    }

    public function desactiver(): void
    {
        $this->actif = false;
    }

    public function toArray(): array
    {
        $arr = [];

        $arr[] = $this->nom;
        $arr[] = $this->prenom;
        $arr[] = $this->email;
        $arr[] = $this->actif;
        $arr[] = $this->dateCreation;

        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'actif' => $this->actif,
            'dateCreation' => $this->dateCreation,
        ];

    }

    // Getters
    public function getId(): int { return $this->id; }
    public function getEmail(): string { return $this->email; }
    public function isActif(): bool { return $this->actif; }
}

// Tests
try {
    $u = new Utilisateur('Alami', 'Hassan', 'h.alami@email.ma', 'MonMdp123!');
    echo $u->getNomComplet() . PHP_EOL; // Hassan Alami
    echo ($u->verifierMotDePasse('MonMdp123!') ? 'Mot de passe correct' : 'Incorrect') . PHP_EOL;
    print_r($u->toArray());

    $u->changerEmail('nouveau@email.ma');
    echo 'Nouvel email : ' . $u->getEmail() . PHP_EOL;

    // Test email invalide
    $u2 = new Utilisateur('Test', 'User', 'email-invalide', 'mdp');
} catch (InvalidArgumentException $e) {
    echo 'Erreur attendue : ' . $e->getMessage() . PHP_EOL;
}