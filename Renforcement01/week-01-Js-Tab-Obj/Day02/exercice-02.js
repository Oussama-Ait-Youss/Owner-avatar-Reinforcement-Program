/**
 * EXERCICE 2 - Moteur de recherche et filtrage d'un catalogue RH
 *
 * Contexte :
 * Vous developpez le module de recherche d'un SIRH (Systeme d'Information
 * Ressources Humaines). Le RH doit pouvoir filtrer, trier et paginer les employes
 * selon plusieurs criteres simultanement.
 *
 * Travail demande :
 *
 * 1. rechercherEmployes(employes, criteres)
 *    criteres peut contenir : { departement, poste, salairMin, salaireMax, motCle }
 *    - motCle cherche dans nom ET prenom (insensible a la casse)
 *    - Tous les criteres present dans l'objet sont appliques simultanement (AND)
 *    - Retourner le tableau filtre
 *
 * 2. trierEmployes(employes, champ, ordre)
 *    ordre : 'asc' ou 'desc'
 *    champ : 'nom', 'salaire', 'anciennete' (en annees depuis dateEmbauche)
 *    Ne pas muter le tableau original.
 *
 * 3. paginer(employes, page, parPage)
 *    Retourner { donnees, page, parPage, total, totalPages }
 *    page commence a 1.
 *
 * 4. statistiquesParDepartement(employes)
 *    Retourner pour chaque departement :
 *    { departement, effectif, salaireMoyen, salaireMin, salaireMax, masseSalariale }
 *    Trier par effectif decroissant.
 */

const employes = [
  { id: 1,  nom: 'Alami',    prenom: 'Karim',   departement: 'Tech',    poste: 'Dev Backend',  salaire: 12000, dateEmbauche: '2019-03-15' },
  { id: 2,  nom: 'Benali',   prenom: 'Layla',   departement: 'Tech',    poste: 'Dev Frontend', salaire: 11000, dateEmbauche: '2020-07-01' },
  { id: 3,  nom: 'Chraibi',  prenom: 'Omar',    departement: 'Tech',    poste: 'DevOps',       salaire: 14000, dateEmbauche: '2018-01-10' },
  { id: 4,  nom: 'Drissi',   prenom: 'Hanane',  departement: 'RH',      poste: 'RH Manager',   salaire: 10500, dateEmbauche: '2021-04-20' },
  { id: 5,  nom: 'Ennaji',   prenom: 'Youssef', departement: 'RH',      poste: 'Recruteur',    salaire: 8500,  dateEmbauche: '2022-09-05' },
  { id: 6,  nom: 'Fassi',    prenom: 'Samira',  departement: 'Finance', poste: 'Comptable',    salaire: 9800,  dateEmbauche: '2020-02-14' },
  { id: 7,  nom: 'Ghazali',  prenom: 'Mehdi',   departement: 'Finance', poste: 'Analyste',     salaire: 11500, dateEmbauche: '2019-11-30' },
  { id: 8,  nom: 'Hamdaoui', prenom: 'Nadia',   departement: 'Tech',    poste: 'Dev Backend',  salaire: 12500, dateEmbauche: '2017-06-22' },
  { id: 9,  nom: 'Idrissi',  prenom: 'Karim',   departement: 'Marketing',poste:'Chef Projet',  salaire: 13000, dateEmbauche: '2020-05-18' },
  { id: 10, nom: 'Jalal',    prenom: 'Fatima',  departement: 'Marketing',poste:'Designer',     salaire: 9500,  dateEmbauche: '2021-08-03' },
  { id: 11, nom: 'Khalil',   prenom: 'Anas',    departement: 'Tech',    poste: 'Data Engineer',salaire: 15000, dateEmbauche: '2016-12-01' },
  {
    id: 12,
    nom: 'Lamrani', 
    prenom: 'Zineb',
    departement: 'Finance',
    poste: 'DAF',
    salaire: 22000,
    dateEmbauche: '2015-03-08' },
];

function rechercherEmployes(employes, criteres) {
  let emp = employes.filter(emploi => {
  if (criteres.departement && emploi.departement !== criteres.departement) {
      return false; 
  }

  if (criteres.salaireMin && emploi.salaire < criteres.salaireMin) {
      return false; 
  }

  return true; 
});
}

function trierEmployes(employes, champ, ordre) {
  const copie = [...employes]; 

  return copie.sort((a, b) => {
    let valA = a[champ];
    let valB = b[champ];

    if (champ === 'anciennete') {
      valA = new Date(a.dateEmbauche).getTime();
      valB = new Date(b.dateEmbauche).getTime();
      if (ordre === 'desc') return valA - valB; 
      return valB - valA;
    }

    if (typeof valA === 'string') {
      return ordre === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } 
    
    return ordre === 'asc' ? valA - valB : valB - valA;
  });
}

function paginer(employes, page, parPage) {
  const debut = (page - 1) * parPage; 
  const fin = debut + parPage;
  
  const donnees = employes.slice(debut, fin);
  
  const total = employes.length;
  const totalPages = Math.ceil(total / parPage); 

  return { 
    donnees, 
    page, 
    parPage, 
    total, 
    totalPages 
  };
}

function statistiquesParDepartement(employes) {
  const stats = employes.reduce((acc, emp) => {
    const dep = emp.departement;
    
    if (!acc[dep]) {
      acc[dep] = {
        departement: dep,
        effectif: 0,
        salaireMin: emp.salaire, 
        salaireMax: emp.salaire,
        masseSalariale: 0
      };
    }
    
    acc[dep].effectif++;
    acc[dep].masseSalariale += emp.salaire;
    
    if (emp.salaire < acc[dep].salaireMin) acc[dep].salaireMin = emp.salaire;
    if (emp.salaire > acc[dep].salaireMax) acc[dep].salaireMax = emp.salaire;
    
    return acc;
  }, {});

  return Object.values(stats)
    .map(dep => {
      dep.salaireMoyen = Math.round(dep.masseSalariale / dep.effectif);
      return dep;
    })
    .sort((a, b) => b.effectif - a.effectif); 
}

// Tests
console.log(rechercherEmployes(employes, { departement: 'Tech', salaireMin: 12000 }));
console.log(rechercherEmployes(employes, { motCle: 'karim' }));
console.log(trierEmployes(employes, 'salaire', 'desc').map(e => e.nom + ' ' + e.salaire));
console.log(paginer(employes, 2, 4));
console.log(statistiquesParDepartement(employes));
