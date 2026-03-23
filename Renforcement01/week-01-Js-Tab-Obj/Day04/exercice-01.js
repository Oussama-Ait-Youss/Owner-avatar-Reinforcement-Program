let registre = [
  { id: 1, nom: 'Alami Hassan',   email: 'h.alami@email.ma',  ville: 'Casablanca', formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-06-15' },
  { id: 2, nom: 'Benali Sara',    email: 's.benali@email.ma', ville: 'Rabat',      formule: 'basic',   tarif: 49,  statut: 'actif',    dateExpiration: '2024-12-01' },
  { id: 3, nom: 'Chraibi Omar',   email: 'o.chraibi@web.ma',  ville: 'Casablanca', formule: 'business',tarif: 199, statut: 'actif',    dateExpiration: '2024-04-01' },
  { id: 4, nom: 'Drissi Fatima',  email: 'f.drissi@web.ma',   ville: 'Fes',        formule: 'basic',   tarif: 49,  statut: 'suspendu', dateExpiration: '2024-03-20' },
  { id: 5, nom: 'Ennaji Youssef', email: 'y.ennaji@mail.ma',  ville: 'Casablanca', formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-08-30' },
  { id: 6, nom: 'Fassi Leila',    email: 'l.fassi@mail.ma',   ville: 'Marrakech',  formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-04-10' },
  { id: 7, nom: 'Ghazali Mehdi',  email: 'm.ghazali@pro.ma',  ville: 'Rabat',      formule: 'business',tarif: 199, statut: 'expire',   dateExpiration: '2024-02-28' },
  { id: 8, nom: 'Hamdaoui Nadia', email: 'n.hmdaoui@web.ma',  ville: 'Tanger',     formule: 'basic',   tarif: 49,  statut: 'actif',    dateExpiration: '2024-07-15' },
];

function ajouterAbonne(registre, abonne) {
  if (registre.some(a => a.email === abonne.email)) {
    throw new Error("Un abonne avec cet email existe deja.");
  }
  const nouvelId = registre.length > 0 ? Math.max(...registre.map(a => a.id)) + 1 : 1;
  return [...registre, { id: nouvelId, ...abonne }];
}

function mettreAJourAbonne(registre, id, modifications) {
  if (!registre.some(a => a.id === id)) {
    throw new Error("Abonne non trouve.");
  }
  return registre.map(a => a.id === id ? { ...a, ...modifications } : a);
}

function supprimerAbonne(registre, id) {
  if (!registre.some(a => a.id === id)) {
    throw new Error("Abonne non trouve.");
  }
  return registre.filter(a => a.id !== id);
}

function renouvelerAbonnements(registre, dateReference) {
  const refTime = new Date(dateReference).getTime();
  const septJoursMs = 7 * 24 * 60 * 60 * 1000;

  return registre.map(abonne => {
    const expTime = new Date(abonne.dateExpiration).getTime();
    const difference = expTime - refTime;

    if (difference < 0) {
      return { ...abonne, statut: 'expire' };
    } else if (difference >= 0 && difference <= septJoursMs) {
      return { ...abonne, alerteRenouvellement: true };
    }
    return abonne;
  });
}

function tableauDeBord(registre) {
  const stats = registre.reduce((acc, a) => {
    acc.totalAbonnes++;
    
    if (a.statut === 'actif') {
      acc.actifs++;
      acc.revenuesMensuelsTotaux += a.tarif;
    } else if (a.statut === 'expire') {
      acc.expires++;
    } else if (a.statut === 'suspendu') {
      acc.suspendu++;
    }

    acc.repartitionParFormule[a.formule] = (acc.repartitionParFormule[a.formule] || 0) + 1;
    acc.villesCount[a.ville] = (acc.villesCount[a.ville] || 0) + 1;

    return acc;
  }, {
    totalAbonnes: 0, actifs: 0, expires: 0, suspendu: 0,
    revenuesMensuelsTotaux: 0, repartitionParFormule: {}, villesCount: {}
  });

  stats.top3Villes = Object.entries(stats.villesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(v => v[0]);

  delete stats.villesCount;
  return stats;
}

// Tests
const r1 = ajouterAbonne(registre, { nom: 'Test User', email: 'test@test.ma', ville: 'Agadir', formule: 'basic', tarif: 49, statut: 'actif', dateExpiration: '2024-09-01' });
console.log('Nouveau registre:', r1.length);

const r2 = mettreAJourAbonne(registre, 3, { formule: 'premium', tarif: 99 });
console.log('Mis a jour:', r2.find(a => a.id === 3));

const r3 = renouvelerAbonnements(registre, '2024-04-05');
console.log('Apres renouvellement:', r3.filter(a => a.alerteRenouvellement || a.statut === 'expire').map(a => a.nom));

console.log('Tableau de bord:', tableauDeBord(registre));