const commandes = [
  { id: 'CMD-001', client: 'Alami Hassan',    montant: 450,  statut: 'livree',     ville: 'Casablanca' },
  { id: 'CMD-002', client: 'Benali Sara',     montant: 1200, statut: 'en_attente', ville: 'Rabat'       },
  { id: 'CMD-003', client: 'Chraibi Omar',    montant: 320,  statut: 'en_cours',   ville: 'Marrakech'   },
  { id: 'CMD-004', client: 'Drissi Fatima',   montant: 875,  statut: 'en_attente', ville: 'Fes'         },
  { id: 'CMD-005', client: 'El Amrani Youssef',montant: 95,  statut: 'annulee',    ville: 'Casablanca'  },
  { id: 'CMD-006', client: 'Fassi Leila',     montant: 2100, statut: 'livree',     ville: 'Tanger'      },
  {
    id: 'CMD-007',
    client: 'Ghazali Mehdi',
    montant: 560,
    statut: 'en_attente',
    ville: 'Agadir'

   },
  
  { 

    id: 'CMD-008',
    client: 'Hamdaoui Nadia',
    montant: 430,
    statut:'en_cours',
    ville: 'Casablanca'

  },
];


function filtrerParStatut(commandes,statut){
    return commandes.filter(commande => commande.statut == statut)
}



function calculerChiffreAffaires(commande){
    let total = 0;
    commande.forEach(element => {
        total = total + element.montant;
    });
    return total;
}


function commandeLaPlusElevee(commande){
    let elevee = commande[0].montant;
    commande.forEach(element => {
        if(element.montant > elevee){
            elevee = element.montant;
        }
    });
    return elevee;
}   

function marquerPrioritaires(commandes) {
  return commandes.map(c => ({
    ...pro,
    prioritaire: pro.montant > 800 && pro.statut === 'en_attente'
  }));
}


function resumeParStatut(commandes) {
  return commandes.reduce((acc, c) => {
    if (!acc[c.statut]) {
      acc[c.statut] = { count: 0, total: 0 };
    }
    acc[c.statut].count += 1;
    acc[c.statut].total += c.montant;
    return acc;
  }, {});
}

