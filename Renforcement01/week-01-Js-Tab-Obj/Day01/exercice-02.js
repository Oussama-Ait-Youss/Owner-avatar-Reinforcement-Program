const produits = [
  { id: 1, nom: 'Laptop Pro',      prix: 8500, stock: 12, categorie: 'Informatique' },
  { id: 2, nom: 'Souris sans fil', prix: 150,  stock: 3,  categorie: 'Informatique' },
  { id: 3, nom: 'Clavier mecanique',prix: 420, stock: 8,  categorie: 'Informatique' },
  { id: 4, nom: 'Bureau debout',   prix: 2200, stock: 5,  categorie: 'Mobilier'     },
  { id: 5, nom: 'Chaise ergonomique',prix:1800,stock: 2,  categorie: 'Mobilier'     },
  { id: 6, nom: 'Lampe LED',       prix: 180,  stock: 20, categorie: 'Mobilier'     },
  { id: 7, nom: 'Tapis de souris', prix: 80,   stock: 0,  categorie: 'Accessoires'  },
  { id: 8, nom: 'Support laptop',  prix: 350,  stock: 7,  categorie: 'Accessoires'  },
  { id: 9, nom: 'Webcam HD',       prix: 550,  stock: 4,  categorie: 'Informatique' },
];

function produitsEnRuptureOuCritique(produits) {
  return produits
    .filter(produit => produit.stock <= 5) 
    .sort((a, b) => a.stock - b.stock); 
}

function valeurTotaleParCategorie(produits) {
  return produits.reduce((acc, produit) => {
    const valeurStock = produit.prix * produit.stock;
    
    
    if (!acc[produit.categorie]) {
      acc[produit.categorie] = 0;
    }
    
    acc[produit.categorie] += valeurStock;
    
    return acc;
  }, {}); 
}

function produitLePlusCherParCategorie(produits) {
  return produits.reduce((acc, produit) => {
    if (!acc[produit.categorie] || produit.prix > acc[produit.categorie].prix) {
      acc[produit.categorie] = produit;
    }
    
    return acc;
  }, {});
}

function appliquerRemise(produits, categorie, pourcentage) {
  return produits.map(produit => {
    if (produit.categorie === categorie) {
      const prixReduit = produit.prix * (1 - pourcentage / 100);
      
      return {
        ...produit,
        prix: +(prixReduit.toFixed(2)) 
      };
    }
   
    return produit;
  });
}

console.log('--- 1. En Rupture ou Critique ---');
console.log(produitsEnRuptureOuCritique(produits));

console.log('--- 2. Valeur Totale Par Catégorie ---');
console.log(valeurTotaleParCategorie(produits)); 


console.log('--- 3. Produit Le Plus Cher Par Catégorie ---');
console.log(produitLePlusCherParCategorie(produits));

console.log('--- 4. Appliquer Remise (10% sur Informatique) ---');
console.log(appliquerRemise(produits, 'Informatique', 10));