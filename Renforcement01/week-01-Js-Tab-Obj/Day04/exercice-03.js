const livraisons = [
  { id: 'LIV001', livreurId: 'L1', livreur: 'Rachid B.', ville: 'Casablanca', statut: 'livre',    delaiPrevu: 2, delaiReel: 2.5, rating: 4.5 },
  { id: 'LIV002', livreurId: 'L2', livreur: 'Amine K.',  ville: 'Rabat',      statut: 'livre',    delaiPrevu: 3, delaiReel: 2.8, rating: 5.0 },
  { id: 'LIV003', livreurId: 'L1', livreur: 'Rachid B.', ville: 'Casablanca', statut: 'echec',    delaiPrevu: 2, delaiReel: 3.5, rating: 2.0 },
  { id: 'LIV004', livreurId: 'L3', livreur: 'Khalid M.', ville: 'Marrakech',  statut: 'livre',    delaiPrevu: 4, delaiReel: 4.1, rating: 4.8 },
  { id: 'LIV005', livreurId: 'L2', livreur: 'Amine K.',  ville: 'Casablanca', statut: 'livre',    delaiPrevu: 2, delaiReel: 2.2, rating: 4.7 },
  { id: 'LIV006', livreurId: 'L3', livreur: 'Khalid M.', ville: 'Marrakech',  statut: 'echec',    delaiPrevu: 4, delaiReel: 9.0, rating: 1.5 },
  { id: 'LIV007', livreurId: 'L1', livreur: 'Rachid B.', ville: 'Rabat',      statut: 'en_route', delaiPrevu: 3, delaiReel: null,rating: null},
  { id: 'LIV008', livreurId: 'L4', livreur: 'Samir A.',  ville: 'Fes',        statut: 'livre',    delaiPrevu: 5, delaiReel: 4.8, rating: 4.9 },
  { id: 'LIV009', livreurId: 'L2', livreur: 'Amine K.',  ville: 'Fes',        statut: 'livre',    delaiPrevu: 5, delaiReel: 11.0,rating: 2.5 },
  { id: 'LIV010', livreurId: 'L4', livreur: 'Samir A.',  ville: 'Casablanca', statut: 'livre',    delaiPrevu: 2, delaiReel: 2.1, rating: 5.0 },
];

function kpiLivraisons(livraisons) {
  const totalLivraisons = livraisons.length;
  const livraisonsReussies = livraisons.filter(l => l.statut === 'livre').length;
  const tauxReussite = Number(((livraisonsReussies / totalLivraisons) * 100).toFixed(1));

  const livraisonsTerminees = livraisons.filter(l => l.delaiReel !== null);
  const sommeDelais = livraisonsTerminees.reduce((acc, l) => acc + l.delaiReel, 0);
  const delaiMoyenLivraison = livraisonsTerminees.length > 0 
    ? Number((sommeDelais / livraisonsTerminees.length).toFixed(1)) 
    : 0;

  const livraisonsEnRetard = livraisonsTerminees.filter(l => l.delaiReel > l.delaiPrevu).length;
  const ponctuel = livraisonsTerminees.length - livraisonsEnRetard;
  const tauxPonctualite = livraisonsTerminees.length > 0 
    ? Number(((ponctuel / livraisonsTerminees.length) * 100).toFixed(1)) 
    : 0;

  return {
    totalLivraisons,
    tauxReussite,
    delaiMoyenLivraison,
    livraisonsEnRetard,
    tauxPonctualite
  };
}

function performanceParLivreur(livraisons) {
  const stats = livraisons.reduce((acc, l) => {
    if (!acc[l.livreurId]) {
      acc[l.livreurId] = {
        livreurId: l.livreurId, nom: l.livreur, totalLivraisons: 0,
        reussies: 0, sommeDelai: 0, countDelai: 0, sommeRating: 0, countRating: 0
      };
    }
    const livreur = acc[l.livreurId];
    
    livreur.totalLivraisons++;
    if (l.statut === 'livre') livreur.reussies++;
    if (l.delaiReel !== null) {
      livreur.sommeDelai += l.delaiReel;
      livreur.countDelai++;
    }
    if (l.rating !== null) {
      livreur.sommeRating += l.rating;
      livreur.countRating++;
    }
    return acc;
  }, {});

  return Object.values(stats).map(l => {
    return {
      livreurId: l.livreurId,
      nom: l.nom,
      totalLivraisons: l.totalLivraisons,
      reussies: l.reussies,
      tauxReussite: Number(((l.reussies / l.totalLivraisons) * 100).toFixed(1)),
      delaiMoyen: l.countDelai > 0 ? Number((l.sommeDelai / l.countDelai).toFixed(1)) : 0,
      rating: l.countRating > 0 ? Number((l.sommeRating / l.countRating).toFixed(1)) : 0
    };
  }).sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.tauxReussite - a.tauxReussite;
  });
}

function heatmapGeographique(livraisons) {
  const stats = livraisons.reduce((acc, l) => {
    if (!acc[l.ville]) {
      acc[l.ville] = { ville: l.ville, total: 0, reussies: 0, echecs: 0, enAttente: 0, sommeDelai: 0, countDelai: 0 };
    }
    const ville = acc[l.ville];
    
    ville.total++;
    if (l.statut === 'livre') ville.reussies++;
    else if (l.statut === 'echec') ville.echecs++;
    else ville.enAttente++;

    if (l.delaiReel !== null) {
      ville.sommeDelai += l.delaiReel;
      ville.countDelai++;
    }
    return acc;
  }, {});

  return Object.values(stats).map(v => ({
    ville: v.ville,
    total: v.total,
    reussies: v.reussies,
    echecs: v.echecs,
    enAttente: v.enAttente,
    delaiMoyen: v.countDelai > 0 ? Number((v.sommeDelai / v.countDelai).toFixed(1)) : 0
  })).sort((a, b) => b.total - a.total);
}

function anomaliesDelais(livraisons) {
  return livraisons
    .filter(l => l.delaiReel !== null && l.delaiReel > (l.delaiPrevu * 2))
    .map(l => ({
      ...l,
      depassement: Number((l.delaiReel - l.delaiPrevu).toFixed(1))
    }));
}

// Tests
console.log('--- KPIs ---');
console.log(kpiLivraisons(livraisons));

console.log('\n--- Performance livreurs ---');
performanceParLivreur(livraisons).forEach(l => console.log(l.nom, l.tauxReussite + '%', l.delaiMoyen + 'h'));

console.log('\n--- Heatmap ---');
console.log(heatmapGeographique(livraisons));

console.log('\n--- Anomalies ---');
console.log(anomaliesDelais(livraisons));