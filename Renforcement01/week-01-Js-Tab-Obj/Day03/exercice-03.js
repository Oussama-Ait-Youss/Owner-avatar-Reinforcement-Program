const etudiants = [
  {
    id: 'ETU01', nom: 'Alami', prenom: 'Karim',
    notes: [
      { module: 'Algorithmique',  note: 14, coeff: 4 },
      { module: 'PHP POO',        note: 12, coeff: 4 },
      { module: 'JavaScript',     note: 16, coeff: 3 },
      { module: 'BDD SQL',        note: 11, coeff: 3 },
      { module: 'HTML/CSS',       note: 15, coeff: 2 },
      { module: 'Projet',         note: 13, coeff: 4 },
    ]
  },
  {
    id: 'ETU02', nom: 'Benali', prenom: 'Sara',
    notes: [
      { module: 'Algorithmique',  note: 7,  coeff: 4 },
      { module: 'PHP POO',        note: 9,  coeff: 4 },
      { module: 'JavaScript',     note: 11, coeff: 3 },
      { module: 'BDD SQL',        note: 8,  coeff: 3 },
      { module: 'HTML/CSS',       note: 14, coeff: 2 },
      { module: 'Projet',         note: 10, coeff: 4 },
    ]
  },
  {
    id: 'ETU03', nom: 'Chraibi', prenom: 'Omar',
    notes: [
      { module: 'Algorithmique',  note: 4,  coeff: 4 },
      { module: 'PHP POO',        note: 15, coeff: 4 },
      { module: 'JavaScript',     note: 13, coeff: 3 },
      { module: 'BDD SQL',        note: 16, coeff: 3 },
      { module: 'HTML/CSS',       note: 18, coeff: 2 },
      { module: 'Projet',         note: 14, coeff: 4 },
    ]
  },
  {
    id: 'ETU04', nom: 'Drissi', prenom: 'Fatima',
    notes: [
      { module: 'Algorithmique',  note: 17, coeff: 4 },
      { module: 'PHP POO',        note: 18, coeff: 4 },
      { module: 'JavaScript',     note: 16, coeff: 3 },
      { module: 'BDD SQL',        note: 19, coeff: 3 },
      { module: 'HTML/CSS',       note: 17, coeff: 2 },
      { module: 'Projet',         note: 18, coeff: 4 },
    ]
  },
  {
    id: 'ETU05', nom: 'Ennaji', prenom: 'Youssef',
    notes: [
      { module: 'Algorithmique',  note: 6,  coeff: 4 },
      { module: 'PHP POO',        note: 7,  coeff: 4 },
      { module: 'JavaScript',     note: 9,  coeff: 3 },
      { module: 'BDD SQL',        note: 5,  coeff: 3 },
      { module: 'HTML/CSS',       note: 12, coeff: 2 },
      { module: 'Projet',         note: 8,  coeff: 4 },
    ]
  },
];

function calculerMoyenne(etudiant) {
  const totaux = etudiant.notes.reduce((acc, n) => {
    acc.sommeNotes += (n.note * n.coeff);
    acc.sommeCoeffs += n.coeff;
    return acc;
  }, { sommeNotes: 0, sommeCoeffs: 0 });

  return Number((totaux.sommeNotes / totaux.sommeCoeffs).toFixed(2));
}

function determinerStatut(etudiant) {
  const moyenne = calculerMoyenne(etudiant);
  
  const modulesEliminatoires = etudiant.notes
    .filter(n => n.note < 5)
    .map(n => n.module);

  let mention = '';
  if (moyenne >= 16) mention = 'TB';
  else if (moyenne >= 14) mention = 'B';
  else if (moyenne >= 12) mention = 'AB';
  else if (moyenne >= 10) mention = 'P';
  else mention = 'Echec';

  let statut = '';
  if (modulesEliminatoires.length > 0) {
    statut = 'elimine';
  } else if (moyenne >= 10) {
    statut = 'admis';
  } else if (moyenne >= 8) {
    statut = 'rattrapage';
  } else {
    statut = 'exclu';
  }

  return { moyenne, mention, statut, modulesEliminatoires };
}

function classementPromotion(etudiants) {
  return etudiants
    .map(etu => {
      const resultats = determinerStatut(etu);
      return { ...etu, ...resultats };
    })
    .sort((a, b) => b.moyenne - a.moyenne)
    .map((etu, index) => ({ ...etu, rang: index + 1 }));
}

function statistiquesModule(etudiants, nomModule) {
  const notesModule = etudiants
    .flatMap(e => e.notes)
    .filter(n => n.module === nomModule)
    .map(n => n.note);

  if (notesModule.length === 0) return null;

  const somme = notesModule.reduce((acc, note) => acc + note, 0);
  const moyenne = Number((somme / notesModule.length).toFixed(2));
  const min = Math.min(...notesModule);
  const max = Math.max(...notesModule);
  
  const reussites = notesModule.filter(n => n >= 10).length;
  const tauxReussite = Number(((reussites / notesModule.length) * 100).toFixed(2));

  const distribution = notesModule.reduce((acc, note) => {
    if (note < 10) acc['<10']++;
    else if (note < 12) acc['10-12']++;
    else if (note < 14) acc['12-14']++;
    else if (note < 16) acc['14-16']++;
    else acc['>=16']++;
    return acc;
  }, { '<10': 0, '10-12': 0, '12-14': 0, '14-16': 0, '>=16': 0 });

  return { module: nomModule, moyenne, min, max, tauxReussite, distribution };
}

function etudiantsARisque(etudiants) {
  return etudiants
    .map(etu => {
      const modulesEnDifficulte = etu.notes
        .filter(n => n.note < 10)
        .map(n => n.module);
        
      return { ...etu, modulesEnDifficulte };
    })
    .filter(etu => etu.modulesEnDifficulte.length >= 2);
}

// Tests
console.log('--- Statut ETU02 ---');
console.log(determinerStatut(etudiants[1]));

console.log('\n--- Statut ETU03 (eliminatoire) ---');
console.log(determinerStatut(etudiants[2]));

console.log('\n--- Classement ---');
classementPromotion(etudiants).forEach(e => 
  console.log(`${e.rang}. ${e.nom} - Moyenne: ${e.moyenne} (${e.mention})`)
);

console.log('\n--- Stats PHP POO ---');
console.log(statistiquesModule(etudiants, 'PHP POO'));

console.log('\n--- A risque ---');
console.log(etudiantsARisque(etudiants).map(e => `${e.nom} (${e.modulesEnDifficulte.join(', ')})`));