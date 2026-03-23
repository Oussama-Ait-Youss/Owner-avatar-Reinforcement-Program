const sprints = [
  {
    id: 'SP1', nom: 'Sprint 1 - Auth', actif: false,
    stories: [
      {
        id: 'US1', titre: 'Inscription utilisateur', points: 5, statut: 'done',
        description: 'En tant que visiteur, je peux creer un compte.',
        taches: [
          { id: 'T1', titre: 'Form HTML', assignee: 'Karim', fait: true },
          { id: 'T2', titre: 'Validation PHP', assignee: 'Sara', fait: true },
        ]
      },
      {
        id: 'US2', titre: 'Connexion JWT', points: 8, statut: 'done',
        description: 'Authentification via token JWT.',
        taches: [
          { id: 'T3', titre: 'Route login', assignee: 'Karim', fait: true },
          { id: 'T4', titre: 'Middleware auth', assignee: null, fait: true },
        ]
      },
    ]
  },
  {
    id: 'SP2', nom: 'Sprint 2 - Dashboard', actif: true,
    stories: [
      {
        id: 'US3', titre: 'Tableau de bord admin', points: 13, statut: 'en_cours',
        description: 'Afficher les statistiques principales.',
        taches: [
          { id: 'T5', titre: 'API statistiques', assignee: 'Omar', fait: true  },
          { id: 'T6', titre: 'Composant graphique', assignee: null, fait: false },
          { id: 'T7', titre: 'Tests unitaires', assignee: null, fait: false },
        ]
      },
      {
        id: 'US4', titre: 'Notifications temps reel', points: 8, statut: 'bloque',
        description: 'WebSocket pour les notifications utilisateur.',
        taches: [
          { id: 'T8', titre: 'Config WebSocket', assignee: 'Karim', fait: false },
        ]
      },
      {
        id: 'US5', titre: 'Export rapport PDF', points: 5, statut: 'a_faire',
        description: 'Generer un rapport en PDF via une librairie.',
        taches: [
          { id: 'T9', titre: 'Integration librairie PDF', assignee: null, fait: false },
        ]
      },
    ]
  },
  {
    id: 'SP3', nom: 'Sprint 3 - Mobile', actif: true,
    stories: [
      {
        id: 'US6', titre: 'Vue mobile du dashboard', points: 8, statut: 'en_cours',
        description: 'Adapter le tableau de bord pour mobile.',
        taches: [
          { id: 'T10', titre: 'Responsive CSS', assignee: 'Sara', fait: true },
          { id: 'T11', titre: 'Tests sur appareils', assignee: null, fait: false },
        ]
      },
      {
        id: 'US7', titre: 'Notifications push mobile', points: 13, statut: 'bloque',
        description: 'Integrer Firebase pour les push notifications.',
        taches: [
          { id: 'T12', titre: 'Config Firebase', assignee: null, fait: false },
        ]
      },
    ]
  }
];

function chargerSprint(sprints, idSprint) {
  const sprint = sprints.find(s => s.id === idSprint);
  if (!sprint) return null;
  
  const storiesDone = sprint.stories.filter(st => st.statut === 'done').length;
  const completion = sprint.stories.length > 0 
    ? Math.round((storiesDone / sprint.stories.length) * 100) 
    : 0;

  return { ...sprint, completion };
}

function storiesBloquees(sprints) {
  return sprints
    .filter(s => s.actif)
    .flatMap(s => s.stories
      .filter(st => st.statut === 'bloque')
      .map(st => ({ nomSprint: s.nom, idSprint: s.id, ...st }))
    );
}

function velociteParSprint(sprints) {
  return sprints.map(s => {
    const doneStories = s.stories.filter(st => st.statut === 'done');
    const velocite = doneStories.reduce((acc, st) => acc + st.points, 0);
    
    return {
      idSprint: s.id,
      nom: s.nom,
      velocite: velocite,
      storiesDone: doneStories.length,
      totalStories: s.stories.length
    };
  });
}

function rechercherStory(sprints, motCle) {
  const motCleLower = motCle.toLowerCase();
  
  return sprints.flatMap(s => s.stories
    .filter(st => 
      st.titre.toLowerCase().includes(motCleLower) || 
      st.description.toLowerCase().includes(motCleLower)
    )
    .map(st => ({ idSprint: s.id, nomSprint: s.nom, story: st }))
  );
}

function tachesSansResponsable(sprints) {
  return sprints.flatMap(s => s.stories.flatMap(st => 
    st.taches
      .filter(t => t.assignee === null)
      .map(t => ({ storyId: st.id, storyTitre: st.titre, tache: t }))
  ));
}

console.log('--- Charger Sprint ---');
console.log(chargerSprint(sprints, 'SP2'));

console.log('\n--- Bloquees ---');
console.log(storiesBloquees(sprints));

console.log('\n--- Velocite ---');
console.log(velociteParSprint(sprints));

console.log('\n--- Recherche ---');
console.log(rechercherStory(sprints, 'mobile'));

console.log('\n--- Sans responsable ---');
console.log(tachesSansResponsable(sprints));