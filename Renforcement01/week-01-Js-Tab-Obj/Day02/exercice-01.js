/**
 * EXERCICE 1 - Rapport de facturation mensuel
 *
 * Contexte :
 * Vous travaillez sur le module de reporting d'une plateforme SaaS.
 * Le service comptabilite a besoin d'un rapport mensuel automatique
 * genere a partir du journal des transactions.
 *
 * Travail demande :
 *
 * 1. rapportMensuel(transactions)
 *    Retourner un tableau trie par mois (format 'YYYY-MM') contenant pour chaque mois :
 *    { mois, nombreTransactions, totalHT, totalTVA, totalTTC, transactionMax }
 *    - totalTVA = totalHT * 0.20
 *    - totalTTC = totalHT + totalTVA
 *    - transactionMax : le montant le plus eleve du mois
 *
 * 2. top3Clients(transactions)
 *    Retourner les 3 clients ayant depense le plus au total (sur toute la periode).
 *    Format : [{ clientId, nom, total, nombreAchats }]
 *
 * 3. evolutionMensuelle(transactions)
 *    Retourner un tableau indiquant pour chaque mois (sauf le premier)
 *    le pourcentage d'evolution du CA vs le mois precedent.
 *    Format : [{ mois, totalHT, evolution }]
 *    evolution est un nombre arrondi a 1 decimale (ex: +12.3 ou -5.7)
 *
 * 4. detecterAnomalies(transactions)
 *    Une transaction est consideree anormale si son montant depasse
 *    2.5 fois la moyenne generale. Retourner ces transactions avec un champ
 *    `ecartMoyenne` indiquant le pourcentage de depassement (arrondi).
 */

const transactions = [
  { id: 'T001', clientId: 'C01', nom: 'Alami SA',       montant: 1200, date: '2024-01-08' },
  { id: 'T002', clientId: 'C02', nom: 'Benali SARL',    montant: 450,  date: '2024-01-15' },
  { id: 'T003', clientId: 'C03', nom: 'Chraibi Corp',   montant: 8900, date: '2024-01-22' },
  { id: 'T004', clientId: 'C01', nom: 'Alami SA',       montant: 2300, date: '2024-02-05' },
  { id: 'T005', clientId: 'C04', nom: 'Drissi SARL',    montant: 670,  date: '2024-02-14' },
  { id: 'T006', clientId: 'C02', nom: 'Benali SARL',    montant: 3100, date: '2024-02-20' },
  { id: 'T007', clientId: 'C05', nom: 'El Fassi Ltd',   montant: 980,  date: '2024-02-28' },
  { id: 'T008', clientId: 'C03', nom: 'Chraibi Corp',   montant: 15000,date: '2024-03-03' },
  { id: 'T009', clientId: 'C01', nom: 'Alami SA',       montant: 4200, date: '2024-03-11' },
  { id: 'T010', clientId: 'C04', nom: 'Drissi SARL',    montant: 890,  date: '2024-03-19' },
  { id: 'T011', clientId: 'C02', nom: 'Benali SARL',    montant: 1750, date: '2024-03-25' },
  { 
    id: 'T012',
    clientId: 'C05',
    nom: 'El Fassi Ltd',
    montant: 630,
    date: '2024-03-30'
   },
];

function rapportMensuel(transactions) {
 
  const parMois = transactions.reduce((acc, t) => {
    const mois = t.date.substring(0, 7); 
    
    if (!acc[mois]) {
      acc[mois] = { 
        mois: mois, 
        nombreTransactions: 0, 
        totalHT: 0, 
        transactionMax: 0 
      };
    }
    
    acc[mois].nombreTransactions++;
    acc[mois].totalHT += t.montant;
    
    if (t.montant > acc[mois].transactionMax) {
      acc[mois].transactionMax = t.montant;
    }
    
    return acc;
  }, {});

  return Object.values(parMois)
    .map(groupe => ({
      ...groupe, 
      totalTVA: groupe.totalHT * 0.20,
      totalTTC: groupe.totalHT * 1.20
    }))
    .sort((a, b) => a.mois.localeCompare(b.mois));
}

function top3Clients(transactions) {
  const parClient = transactions.reduce((acc, t) => {
    if (!acc[t.clientId]) {
      acc[t.clientId] = { 
        clientId: t.clientId, 
        nom: t.nom, 
        total: 0, 
        nombreAchats: 0 
      };
    }
    
    acc[t.clientId].total += t.montant;
    acc[t.clientId].nombreAchats++;
    
    return acc;
  }, {});

  return Object.values(parClient)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
}

function evolutionMensuelle(transactions) {
  const totauxParMois = transactions.reduce((acc, t) => {
    const mois = t.date.substring(0, 7);
    if (!acc[mois]) acc[mois] = { mois: mois, totalHT: 0 };
    
    acc[mois].totalHT += t.montant;
    return acc;
  }, {});

  const moisTries = Object.values(totauxParMois).sort((a, b) => a.mois.localeCompare(b.mois));

  const evolution = [];
  
  
  for (let i = 1; i < moisTries.length; i++) {
    const moisActuel = moisTries[i];
    const moisPrecedent = moisTries[i - 1];
    
    const calcul = ((moisActuel.totalHT - moisPrecedent.totalHT) / moisPrecedent.totalHT) * 100;
    
    evolution.push({
      mois: moisActuel.mois,
      totalHT: moisActuel.totalHT,
      evolution: Number(calcul.toFixed(1)) 
    });
  }
  
  return evolution;
}

function detecterAnomalies(transactions) {
  const totalGlobal = transactions.reduce((acc, t) => acc + t.montant, 0);
  const moyenne = totalGlobal / transactions.length;
  
  const seuilAnomalie = moyenne * 2.5;

  return transactions
    .filter(t => t.montant > seuilAnomalie) 
    .map(t => {                             
      const depassement = ((t.montant - moyenne) / moyenne) * 100;
      
      return {
        ecartMoyenne: Math.round(depassement) + "%"
      };
    });
}


// Tests
console.log('--- Rapport mensuel ---');
console.log(JSON.stringify(rapportMensuel(transactions), null, 2));

console.log('--- Top 3 clients ---');
console.log(top3Clients(transactions));

console.log('--- Evolution mensuelle ---');
console.log(evolutionMensuelle(transactions));

console.log('--- Anomalies ---');
console.log(detecterAnomalies(transactions));
