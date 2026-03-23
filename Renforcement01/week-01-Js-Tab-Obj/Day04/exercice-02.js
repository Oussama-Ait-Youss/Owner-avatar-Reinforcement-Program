const comptes = [
  {
    id: 'CPT001', titulaire: 'Alami Hassan',  type: 'courant', solde: 5200,
    decouvertAutorise: -1000,
    transactions: [
      { id: 'TR001', type: 'depot',   montant: 5000, date: '2024-03-01', soldeApres: 5000 },
      { id: 'TR002', type: 'retrait', montant: 800,  date: '2024-03-05', soldeApres: 4200 },
      { id: 'TR003', type: 'depot',   montant: 2500, date: '2024-03-15', soldeApres: 6700 },
      { id: 'TR004', type: 'retrait', montant: 1500, date: '2024-03-22', soldeApres: 5200 },
    ]
  },
  {
    id: 'CPT002', titulaire: 'Benali Sara', type: 'epargne', solde: 18500,
    decouvertAutorise: 0,
    transactions: [
      { id: 'TR005', type: 'depot',   montant: 20000, date: '2024-01-10', soldeApres: 20000 },
      { id: 'TR006', type: 'retrait', montant: 1500,  date: '2024-02-20', soldeApres: 18500 },
    ]
  },
  {
    id: 'CPT003', titulaire: 'Chraibi Omar', type: 'courant', solde: 350,
    decouvertAutorise: -500,
    transactions: [
      { id: 'TR007', type: 'depot',   montant: 1200, date: '2024-03-02', soldeApres: 1200 },
      { id: 'TR008', type: 'retrait', montant: 850,  date: '2024-03-10', soldeApres: 350  },
    ]
  }
];

function traiterTransaction(comptes, transaction) {
  const nouvelleListe = structuredClone(comptes);
  const { type, compteId, montant, compteDestId } = transaction;
  const cptSource = nouvelleListe.find(c => c.id === compteId);
  const dateStr = new Date().toISOString().split('T')[0];
  const tId = 'TR' + Date.now();

  if (!cptSource) return { succes: false, erreur: 'Compte source introuvable' };

  if (type === 'depot') {
    cptSource.solde += montant;
    cptSource.transactions.push({ id: tId, type, montant, date: dateStr, soldeApres: cptSource.solde });
  } 
  else if (type === 'retrait') {
    const frais = cptSource.type === 'courant' ? montant * 0.005 : 0;
    if (cptSource.solde - (montant + frais) < cptSource.decouvertAutorise) {
      return { succes: false, erreur: 'Fonds insuffisants' };
    }
    cptSource.solde -= (montant + frais);
    cptSource.transactions.push({ id: tId, type, montant: montant + frais, date: dateStr, soldeApres: cptSource.solde });
  } 
  else if (type === 'virement') {
    const cptDest = nouvelleListe.find(c => c.id === compteDestId);
    if (!cptDest) return { succes: false, erreur: 'Compte destination introuvable' };
    if (cptSource.solde - montant < cptSource.decouvertAutorise) {
      return { succes: false, erreur: 'Fonds insuffisants pour virement' };
    }
    
    cptSource.solde -= montant;
    cptSource.transactions.push({ id: tId + 'S', type: 'virement_sortant', montant, date: dateStr, soldeApres: cptSource.solde });
    
    cptDest.solde += montant;
    cptDest.transactions.push({ id: tId + 'E', type: 'virement_entrant', montant, date: dateStr, soldeApres: cptDest.solde });
  } 
  else {
    return { succes: false, erreur: 'Type de transaction non valide' };
  }

  return { succes: true, comptes: nouvelleListe };
}

function appliquerFraisMensuels(comptes, mois) {
  const nouvelleListe = structuredClone(comptes);

  for (let cpt of nouvelleListe) {
    if (cpt.type === 'courant') {
      const txDuMois = cpt.transactions.filter(t => t.date.startsWith(mois));
      if (txDuMois.length > 0) {
        const soldeMoyen = txDuMois.reduce((acc, t) => acc + t.soldeApres, 0) / txDuMois.length;
        if (soldeMoyen < 1000) {
          cpt.solde -= 25;
          cpt.transactions.push({
            id: 'FR' + Date.now() + Math.floor(Math.random() * 1000),
            type: 'frais_mensuels',
            montant: 25,
            date: `${mois}-28`,
            soldeApres: cpt.solde
          });
        }
      }
    }
  }

  return nouvelleListe;
}

function releveCompte(compte) {
  let totalDebits = 0;
  let totalCredits = 0;

  for (let t of compte.transactions) {
    if (['retrait', 'virement_sortant', 'frais_mensuels'].includes(t.type)) {
      totalDebits += t.montant;
    } else if (['depot', 'virement_entrant'].includes(t.type)) {
      totalCredits += t.montant;
    }
  }

  return {
    solde: compte.solde,
    totalDebits,
    totalCredits,
    nombreOperations: compte.transactions.length,
    derniereOperation: compte.transactions[compte.transactions.length - 1] || null
  };
}

function detecterSuspects(comptes) {
  const suspects = [];

  for (let cpt of comptes) {
    if (cpt.transactions.length === 0) continue;

    const moyenne = cpt.transactions.reduce((acc, t) => acc + t.montant, 0) / cpt.transactions.length;
    const seuil = moyenne * 3;

    for (let t of cpt.transactions) {
      if (t.montant > seuil) {
        suspects.push({
          compteId: cpt.id,
          transaction: t,
          ecartMoyenne: Math.round(((t.montant - moyenne) / moyenne) * 100)
        });
      }
    }
  }

  return suspects;
}

// Tests
const result = traiterTransaction(comptes, { type: 'virement', compteId: 'CPT001', compteDestId: 'CPT003', montant: 500 });
console.log('Virement:', result.succes);

const resultEchec = traiterTransaction(comptes, { type: 'retrait', compteId: 'CPT003', montant: 1000 });
console.log('Retrait refuse:', resultEchec);

console.log('Releve CPT001:', releveCompte(comptes[0]));
console.log('Transactions suspectes:', detecterSuspects(comptes));