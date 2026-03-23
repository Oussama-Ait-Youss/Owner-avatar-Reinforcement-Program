const entrepot = {
  'Zone-A': {
    'Rayon-A1': [
      { id: 'P001', nom: 'Clavier',  stock: 45, prixUnitaire: 120 },
      { id: 'P002', nom: 'Souris',   stock: 3,  prixUnitaire: 85  },
      { id: 'P003', nom: 'Webcam',   stock: 12, prixUnitaire: 220 },
    ],
    'Rayon-A2': [
      { id: 'P004', nom: 'Ecran 24"',stock: 8,  prixUnitaire: 1500 },
      { id: 'P005', nom: 'Ecran 27"',stock: 2,  prixUnitaire: 2200 },
    ]
  },
  'Zone-B': {
    'Rayon-B1': [
      { id: 'P006', nom: 'Cable HDMI',stock: 100,prixUnitaire: 30  },
      { id: 'P007', nom: 'Hub USB',   stock: 25, prixUnitaire: 95  },
    ],
    'Rayon-B2': [
      { id: 'P008', nom: 'Casque BT', stock: 4,  prixUnitaire: 350 },
      { id: 'P009', nom: 'Enceinte',  stock: 0,  prixUnitaire: 280 },
    ]
  },
  'Zone-C': {
    'Rayon-C1': [
      { id: 'P010', nom: 'Tapis souris',stock: 60, prixUnitaire: 40 },
      { id: 'P011', nom: 'Repose-poignet',stock:15,prixUnitaire: 55 },
    ]
  }
};

function trouverProduit(entrepot, idProduit) {
  for (const [zone, rayons] of Object.entries(entrepot)) {
    for (const [rayon, produits] of Object.entries(rayons)) {
      const produit = produits.find(p => p.id === idProduit);
      if (produit) {
        return { produit, zone, rayon };
      }
    }
  }
  return null;
}

function produitsStockCritique(entrepot, seuilMinimum) {
  const stockCritique = [];
  
  for (const [zone, rayons] of Object.entries(entrepot)) {
    for (const [rayon, produits] of Object.entries(rayons)) {
      produits
        .filter(p => p.stock <= seuilMinimum)
        .forEach(p => stockCritique.push({ ...p, zone, rayon }));
    }
  }
  
  return stockCritique;
}

function valeurTotaleEntrepot(entrepot) {
  let total = 0;
  
  for (const rayons of Object.values(entrepot)) {
    for (const produits of Object.values(rayons)) {
      total += produits.reduce((acc, p) => acc + (p.stock * p.prixUnitaire), 0);
    }
  }
  
  return total;
}

function deplacerProduit(entrepot, idProduit, nouvelleZone, nouveauRayon) {
  const nouvelEntrepot = structuredClone(entrepot);
  let produitADeplacer = null;

  for (const zone in nouvelEntrepot) {
    for (const rayon in nouvelEntrepot[zone]) {
      const produits = nouvelEntrepot[zone][rayon];
      const index = produits.findIndex(p => p.id === idProduit);
      
      if (index !== -1) {
        produitADeplacer = produits.splice(index, 1)[0];
        break;
      }
    }
    if (produitADeplacer) break;
  }

  if (produitADeplacer) {
    if (!nouvelEntrepot[nouvelleZone]) nouvelEntrepot[nouvelleZone] = {};
    if (!nouvelEntrepot[nouvelleZone][nouveauRayon]) nouvelEntrepot[nouvelleZone][nouveauRayon] = [];
    nouvelEntrepot[nouvelleZone][nouveauRayon].push(produitADeplacer);
  }

  return nouvelEntrepot;
}

function rapportParZone(entrepot) {
  return Object.entries(entrepot).map(([zone, rayons]) => {
    let nombreProduits = 0;
    let nombreReferences = 0;
    let valeurTotale = 0;

    for (const produits of Object.values(rayons)) {
      nombreReferences += produits.length;
      for (const p of produits) {
        nombreProduits += p.stock;
        valeurTotale += (p.stock * p.prixUnitaire);
      }
    }

    return { zone, nombreProduits, nombreReferences, valeurTotale };
  });
}

// Tests
console.log('--- Trouver Produit ---');
console.log(trouverProduit(entrepot, 'P008'));

console.log('\n--- Stock Critique ---');
console.log(produitsStockCritique(entrepot, 5));

console.log('\n--- Valeur totale ---');
console.log(valeurTotaleEntrepot(entrepot));

console.log('\n--- Rapport par Zone ---');
console.log(rapportParZone(entrepot));

console.log('\n--- Déplacer Produit ---');
const nouvelInventaire = deplacerProduit(entrepot, 'P008', 'Zone-C', 'Rayon-C2');
console.log('Ancien entrepot (intact) P008 dans :', trouverProduit(entrepot, 'P008')?.rayon);
console.log('Nouvel entrepot P008 dans :', trouverProduit(nouvelInventaire, 'P008')?.rayon);