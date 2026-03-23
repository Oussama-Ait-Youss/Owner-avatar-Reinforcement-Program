const matchs = [
  { journee: 1, domicile: 'FUS Rabat',     bDomicile: 2, bExterieur: 1, exterieur: 'WAC'        },
  { journee: 1, domicile: 'Raja',          bDomicile: 1, bExterieur: 1, exterieur: 'MAS'        },
  { journee: 1, domicile: 'FAR',           bDomicile: 3, bExterieur: 0, exterieur: 'HUSA'       },
  { journee: 2, domicile: 'WAC',           bDomicile: 2, bExterieur: 2, exterieur: 'Raja'       },
  { journee: 2, domicile: 'MAS',           bDomicile: 1, bExterieur: 0, exterieur: 'FAR'        },
  { journee: 2, domicile: 'HUSA',          bDomicile: 1, bExterieur: 3, exterieur: 'FUS Rabat'  },
  { journee: 3, domicile: 'Raja',          bDomicile: 2, bExterieur: 0, exterieur: 'FAR'        },
  { journee: 3, domicile: 'FUS Rabat',     bDomicile: 1, bExterieur: 1, exterieur: 'MAS'        },
  { journee: 3, domicile: 'WAC',           bDomicile: 4, bExterieur: 1, exterieur: 'HUSA'       },
  { journee: 4, domicile: 'FAR',           bDomicile: 2, bExterieur: 2, exterieur: 'WAC'        },
  { journee: 4, domicile: 'MAS',           bDomicile: 0, bExterieur: 1, exterieur: 'FUS Rabat'  },
  { journee: 4, domicile: 'HUSA',          bDomicile: 2, bExterieur: 3, exterieur: 'Raja'       },
];

function calculerClassement(matchs) {
  const stats = matchs.reduce((acc, m) => {
    if (!acc[m.domicile]) acc[m.domicile] = { equipe: m.domicile, joues: 0, victoires: 0, nuls: 0, defaites: 0, bpour: 0, bcontre: 0, points: 0 };
    if (!acc[m.exterieur]) acc[m.exterieur] = { equipe: m.exterieur, joues: 0, victoires: 0, nuls: 0, defaites: 0, bpour: 0, bcontre: 0, points: 0 };

    const dom = acc[m.domicile];
    const ext = acc[m.exterieur];

    dom.joues++; 
    ext.joues++;
    dom.bpour += m.bDomicile; 
    dom.bcontre += m.bExterieur;
    ext.bpour += m.bExterieur; 
    ext.bcontre += m.bDomicile;

    if (m.bDomicile > m.bExterieur) {
      dom.victoires++; dom.points += 3;
      ext.defaites++;
    } else if (m.bDomicile < m.bExterieur) {
      ext.victoires++; ext.points += 3;
      dom.defaites++;
    } else {
      dom.nuls++; dom.points += 1;
      ext.nuls++; ext.points += 1;
    }

    return acc;
  }, {});

  let tableau = Object.values(stats)
    .map(t => {
      t.diff = t.bpour - t.bcontre;
      return t;
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points; 
      if (b.diff !== a.diff) return b.diff - a.diff;         
      if (b.bpour !== a.bpour) return b.bpour - a.bpour;     
      return a.equipe.localeCompare(b.equipe);               
    });

  return tableau.map((t, index) => {
    t.rang = index + 1;
    return t;
  });
}

function meilleureAttaque(classement) {
  return classement.reduce((max, equipe) => {
    return equipe.bpour > max.bpour ? equipe : max;
  }, classement[0]); 
}

function meilleureDefense(classement) {
  return classement.reduce((min, equipe) => {
    return equipe.bcontre < min.bcontre ? equipe : min;
  }, classement[0]);
}

function serieInvaincue(matchs, equipe) {
  const matchsEquipe = matchs
    .filter(m => m.domicile === equipe || m.exterieur === equipe)
    .sort((a, b) => b.journee - a.journee);

  let serie = 0;

  for (let m of matchsEquipe) {
    const estDomicile = m.domicile === equipe;
    const bEquipe = estDomicile ? m.bDomicile : m.bExterieur;
    const bAdversaire = estDomicile ? m.bExterieur : m.bDomicile;

    if (bEquipe >= bAdversaire) {
      serie++;
    } else {
      break;
    }
  }

  return serie;
}

const classement = calculerClassement(matchs);

console.log('--- Classement ---');
classement.forEach(e => console.log(
  `${e.rang}. ${e.equipe.padEnd(12)} | J:${e.joues} V:${e.victoires} N:${e.nuls} D:${e.defaites} | ${e.bpour}:${e.bcontre} (${e.diff > 0 ? '+' : ''}${e.diff}) | ${e.points} pts`
));

console.log('\n--- Statistiques ---');
console.log('Meilleure attaque:', meilleureAttaque(classement).equipe);
console.log('Meilleure defense:', meilleureDefense(classement).equipe);
console.log('Serie WAC sans defaite:', serieInvaincue(matchs, 'WAC') + ' matchs');