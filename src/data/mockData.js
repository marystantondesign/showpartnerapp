export const show = {
  id: 's1',
  name: 'Valentino SS26',
  date: 'Tuesday, April 28',
  dateShort: 'TUESDAY, APRIL 28',
  showtime: '6:00 PM',
  venue: 'Palais Brongniart',
  address: '8 Place de la Bourse, 75002 Paris, France',
}

export const profiles = [
  // Lead
  { id: 'p1',  name: 'Jen Z',       role: 'lead',      specialty: 'hair',   avatar: '/lead/Jen-Z.png',
    tags: ['Show direction', 'Team coordination', 'Hair + Beauty'] },

  // Artists (10 total)
  { id: 'p2',  name: 'Marcus Lee',      role: 'artist',    specialty: 'makeup', avatar: '/artists/Marcus-Lee.png',
    tags: ['Editorial makeup', 'Special effects', 'Contouring', 'Avant-garde color', 'Skin prep'] },
  { id: 'p3',  name: 'Zoe Park',        role: 'artist',    specialty: 'makeup', avatar: '/artists/Zoe-Parker.png',
    tags: ['Runway makeup', 'Period looks', 'Airbrushing', 'Bridal', 'Avant-garde looks'] },
  { id: 'p6',  name: 'David Kim',       role: 'artist',    specialty: 'hair',   avatar: '/artists/David-Kim.png',
    tags: ['Hair extensions', 'Avant-garde styling', 'Braiding', 'Color work', 'Keratin'] },
  { id: 'p7',  name: 'Priya Osei',      role: 'artist',    specialty: 'hair',   avatar: '/artists/Priya-Osei.png',
    tags: ['Natural textures', 'Protective styles', 'Color correction', 'Precision cuts', 'Blowouts'] },
  { id: 'p8',  name: 'Luna Torres',     role: 'artist',    specialty: 'makeup', avatar: '/artists/Luna-Tores.png',
    tags: ['Eyebrow bleaching', 'Editorial makeup', 'Avant-garde color', 'Fantasy looks', 'Runway'] },
  { id: 'p11', name: 'Kenji Watanabe',  role: 'artist',    specialty: 'hair',   avatar: '/artists/Kenji-Watanabe.png',
    tags: ['Avant-garde cuts', 'Keratin treatments', 'Natural textures', 'Braiding', 'Ombré'] },
  { id: 'p12', name: 'Sofia Reyes',     role: 'artist',    specialty: 'nails',  avatar: '/artists/Sofia-Reyes.png',
    tags: ['Nail art', 'Gel extensions', 'Chrome powder', 'Hand painting', '3D nail art'] },
  { id: 'p13', name: 'Aisha Johnson',   role: 'artist',    specialty: 'makeup', avatar: '/artists/Aisha-Johnson.png',
    tags: ['Skin prep', 'Airbrush', 'Contouring', 'Lash application', 'Film & TV'] },
  { id: 'p14', name: 'Lena Schmidt',    role: 'artist',    specialty: 'hair',   avatar: '/artists/Lena-Schmidt.png',
    tags: ['Updos', 'Vintage styles', 'Extensions', 'Color correction', 'Scalp care'] },
  { id: 'p15', name: 'Mira Patel',      role: 'artist',    specialty: 'nails',  avatar: '/artists/Mira-Patel.png',
    tags: ['Nail extensions', 'Acrylic overlays', 'Chrome effects', 'Minimalist design', 'Nail repair'] },

  // Assistants (5 total)
  { id: 'p4',  name: 'Sophia Rivera',   role: 'assistant', trackingState: 'active',                  avatar: '/assistants/Sophia-Rivera.png'  },
  { id: 'p5',  name: 'James Kim',       role: 'assistant', trackingState: 'lost', lastSeenMins: 12,  avatar: '/assistants/James-Kim.png' },
  { id: 'p9',  name: 'Cleo Marsh',      role: 'assistant', trackingState: 'active',                  avatar: '/assistants/Cleo-Marsh.png' },
  { id: 'p10', name: 'Benji Adams',     role: 'assistant', trackingState: 'lost', lastSeenMins: 8,   avatar: '/assistants/Benji-Adams.png' },
  { id: 'p16', name: 'Nadia Faris',     role: 'assistant', trackingState: 'active',                  avatar: '/assistants/Nadia-Faris.png' },
]

export const team = profiles

export const models = [
  {
    id: 'm1', name: 'Sofia Andersen', lookNumber: '01',
    avatar: '/models/Sofia-Andersen-1.png',
    assignedArtists: ['David Kim', 'Marcus Lee', 'Sofia Reyes'],
    hairArtist: 'David Kim',
    makeupArtist: 'Marcus Lee',
    nailArtist: 'Sofia Reyes',
    assistant: 'Sophia Rivera',
    status: 'needs_revisit',
    notes: [{ id: 'note-m1-1', text: 'Allergic to latex gloves.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-06-01T05:35:00' }],
    photos: [
    { id: 'ph-1', url: '/models/Sofia-Andersen-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Sofia-Andersen-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '5:12 AM', updatedBy: 'Jen Z' },
      { status: 'needs_revisit', timestamp: '5:35 AM', updatedBy: 'Jen Z' },
    ],
  },
  {
    id: 'm2', name: 'Neville Williams', lookNumber: '02',
    avatar: '/models/Neville-Williams-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: null,
    assistant: 'James Kim',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Neville-Williams-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Neville-Williams-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Neville-Williams-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Neville-Williams-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:10 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '2:47 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm3', name: 'Irina Volkov', lookNumber: '03',
    avatar: '/models/Irina-Volkov-1.png',
    assignedArtists: ['Kenji Watanabe', 'Luna Torres', 'Mira Patel'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Luna Torres',
    nailArtist: 'Mira Patel',
    assistant: 'Cleo Marsh',
    status: 'paused',
    notes: [{ id: 'note-m3-1', text: 'Requested minimal coverage.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-06-01T03:06:00' }],
    photos: [
    { id: 'ph-1', url: '/models/Irina-Volkov-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Irina-Volkov-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Irina-Volkov-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:49 AM', updatedBy: 'Zoe Park' },
      { status: 'paused', timestamp: '3:06 AM', updatedBy: 'Jen Z' },
    ],
  },
  {
    id: 'm4', name: 'Cassidy Martin', lookNumber: '04',
    avatar: '/models/Cassidy-Martin-1.png',
    assignedArtists: ['David Kim', 'Aisha Johnson'],
    hairArtist: 'David Kim',
    makeupArtist: 'Aisha Johnson',
    nailArtist: null,
    assistant: 'Benji Adams',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Cassidy-Martin-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Cassidy-Martin-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Cassidy-Martin-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Cassidy-Martin-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-5', url: '/models/Cassidy-Martin-5.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '1:55 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '2:29 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm5', name: 'Aaliyah Jones', lookNumber: '05',
    avatar: '/models/Aaliyah-Jones-1.png',
    assignedArtists: ['Lena Schmidt', 'Marcus Lee', 'Sofia Reyes'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Marcus Lee',
    nailArtist: 'Sofia Reyes',
    assistant: 'Nadia Faris',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Aaliyah-Jones-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Aaliyah-Jones-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Aaliyah-Jones-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Aaliyah-Jones-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-5', url: '/models/Aaliyah-Jones-5.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-6', url: '/models/Aaliyah-Jones-6.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:00 AM', updatedBy: 'Sophia Rivera' },
      { status: 'done', timestamp: '2:34 AM', updatedBy: 'Sophia Rivera' },
    ],
  },
  {
    id: 'm6', name: 'Mei Lin', lookNumber: '06',
    avatar: '/models/Mei-Lin-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: null,
    assistant: 'Sophia Rivera',
    status: 'needs_revisit',
    notes: [{ id: 'note-m6-1', text: 'Touch up left brow.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-06-01T03:08:00' }],
    photos: [
    { id: 'ph-1', url: '/models/Mei-Lin-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Mei-Lin-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Mei-Lin-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:30 AM', updatedBy: 'Zoe Park' },
      { status: 'needs_revisit', timestamp: '3:08 AM', updatedBy: 'Zoe Park' },
    ],
  },
  {
    id: 'm7', name: 'Valentina Cruz', lookNumber: '07',
    avatar: '/models/Valentina-Cruz-1.png',
    assignedArtists: ['Kenji Watanabe', 'Luna Torres', 'Mira Patel'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Luna Torres',
    nailArtist: 'Mira Patel',
    assistant: 'James Kim',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Valentina-Cruz-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Valentina-Cruz-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '1:50 AM', updatedBy: 'Jen Z' },
      { status: 'done', timestamp: '2:24 AM', updatedBy: 'Jen Z' },
    ],
  },
  {
    id: 'm8', name: 'Ingrid Larsen', lookNumber: '08',
    avatar: '/models/Ingrid-Larson-1.png',
    assignedArtists: ['David Kim', 'Aisha Johnson'],
    hairArtist: 'David Kim',
    makeupArtist: 'Aisha Johnson',
    nailArtist: null,
    assistant: 'Cleo Marsh',
    status: 'in_progress',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Ingrid-Larson-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Ingrid-Larson-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '3:15 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm9', name: 'Priya Sharma', lookNumber: '09',
    avatar: '/models/Priya-Sharma-1.png',
    assignedArtists: ['Lena Schmidt', 'Marcus Lee', 'Sofia Reyes'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Marcus Lee',
    nailArtist: 'Sofia Reyes',
    assistant: 'Benji Adams',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Priya-Sharma-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Priya-Sharma-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Priya-Sharma-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Priya-Sharma-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:45 AM', updatedBy: 'Zoe Park' },
      { status: 'done', timestamp: '3:20 AM', updatedBy: 'Zoe Park' },
    ],
  },
  {
    id: 'm10', name: 'Elena Morozova', lookNumber: '10',
    avatar: '/models/Elena-Morozova-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: null,
    assistant: 'Nadia Faris',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Elena-Morozova-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Elena-Morozova-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Elena-Morozova-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '3:30 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '4:05 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm11', name: 'Amara Diallo', lookNumber: '11',
    avatar: '/models/Amara-Diallo-1.png',
    assignedArtists: ['Kenji Watanabe', 'Luna Torres'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Luna Torres',
    nailArtist: null,
    assistant: 'Sophia Rivera',
    status: 'in_progress',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Amara-Diallo-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Amara-Diallo-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Amara-Diallo-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [
      { status: 'in_progress', timestamp: '4:40 AM', updatedBy: 'Jen Z' },
    ],
  },
  {
    id: 'm12', name: 'Hana Tanaka', lookNumber: '12',
    avatar: '/models/Hana-Tanaka-1.png',
    assignedArtists: ['David Kim', 'Aisha Johnson', 'Mira Patel'],
    hairArtist: 'David Kim',
    makeupArtist: 'Aisha Johnson',
    nailArtist: 'Mira Patel',
    assistant: 'James Kim',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Hana-Tanaka-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Hana-Tanaka-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  // New models 13–25
  {
    id: 'm13', name: 'Camille Dubois', lookNumber: '13',
    avatar: '/models/Camille-DuBois-1.png',
    assignedArtists: ['Lena Schmidt', 'Marcus Lee', 'Sofia Reyes'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Marcus Lee',
    nailArtist: 'Sofia Reyes',
    assistant: 'Cleo Marsh',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Camille-DuBois-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Camille-DuBois-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Camille-DuBois-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '3:00 AM', updatedBy: 'Kenji Watanabe' }, { status: 'done', timestamp: '3:46 AM', updatedBy: 'Kenji Watanabe' }],
  },
  {
    id: 'm14', name: 'Ingrid Strand', lookNumber: '14',
    avatar: '/models/Ingrid-Strand-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: null,
    assistant: 'Benji Adams',
    status: 'in_progress',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Ingrid-Strand-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Ingrid-Strand-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Ingrid-Strand-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Ingrid-Strand-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-5', url: '/models/Ingrid-Strand-5.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '4:10 AM', updatedBy: 'Aisha Johnson' }],
  },
  {
    id: 'm15', name: 'Yuki Nakamura', lookNumber: '15',
    avatar: '/models/Yuki-Nakamura-1.png',
    assignedArtists: ['Kenji Watanabe', 'Luna Torres', 'Mira Patel'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Luna Torres',
    nailArtist: 'Mira Patel',
    assistant: 'Nadia Faris',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Yuki-Nakamura-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Yuki-Nakamura-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Yuki-Nakamura-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm16', name: 'Fatima Hassan', lookNumber: '16',
    avatar: '/models/Fatima-Hassan-1.png',
    assignedArtists: ['David Kim', 'Aisha Johnson', 'Sofia Reyes'],
    hairArtist: 'David Kim',
    makeupArtist: 'Aisha Johnson',
    nailArtist: 'Sofia Reyes',
    assistant: 'Sophia Rivera',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Fatima-Hassan-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Fatima-Hassan-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Fatima-Hassan-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Fatima-Hassan-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '2:20 AM', updatedBy: 'Lena Schmidt' }, { status: 'done', timestamp: '3:05 AM', updatedBy: 'Aisha Johnson' }],
  },
  {
    id: 'm17', name: 'Claudia Ferretti', lookNumber: '17',
    avatar: '/models/Claudia-Ferretti-1.png',
    assignedArtists: ['Lena Schmidt', 'Marcus Lee'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Marcus Lee',
    nailArtist: null,
    assistant: 'James Kim',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Claudia-Ferretti-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Claudia-Ferretti-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Claudia-Ferretti-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-4', url: '/models/Claudia-Ferretti-4.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm18', name: 'Soo-Yeon Park', lookNumber: '18',
    avatar: '/models/Soo-Yeon-Park-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park', 'Mira Patel'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: 'Mira Patel',
    assistant: 'Cleo Marsh',
    status: 'in_progress',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Soo-Yeon-Park-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Soo-Yeon-Park-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Soo-Yeon-Park-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '4:30 AM', updatedBy: 'Lena Schmidt' }],
  },
  {
    id: 'm19', name: 'Abdullah Ali', lookNumber: '19',
    avatar: '/models/Abdullah-Ali-1.png',
    assignedArtists: ['Kenji Watanabe', 'Aisha Johnson'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Aisha Johnson',
    nailArtist: null,
    assistant: 'Benji Adams',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Abdullah-Ali-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Abdullah-Ali-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Abdullah-Ali-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm20', name: 'Justin Mitchell', lookNumber: '20',
    avatar: '/models/Justin-Mitchell-1.png',
    assignedArtists: ['David Kim', 'Marcus Lee'],
    hairArtist: 'David Kim',
    makeupArtist: 'Marcus Lee',
    nailArtist: null,
    assistant: 'Nadia Faris',
    status: 'paused',
    notes: [{ id: 'note-m20-1', text: 'Waiting on stylist.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-06-01T05:10:00' }],
    photos: [
    { id: 'ph-1', url: '/models/Justin-Mitchell-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Justin-Mitchell-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Justin-Mitchell-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '4:50 AM', updatedBy: 'Luna Torres' }, { status: 'paused', timestamp: '5:10 AM', updatedBy: 'Luna Torres' }],
  },
  {
    id: 'm21', name: 'Astrid Lindqvist', lookNumber: '21',
    avatar: '/models/Astrid-Lindqvist-1.png',
    assignedArtists: ['Lena Schmidt', 'Luna Torres', 'Sofia Reyes'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Luna Torres',
    nailArtist: 'Sofia Reyes',
    assistant: 'Sophia Rivera',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Astrid-Lindqvist-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Astrid-Lindqvist-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm22', name: 'Leila Nasser', lookNumber: '22',
    avatar: '/models/Leila-Nasser-1.png',
    assignedArtists: ['Priya Osei', 'Zoe Park', 'Mira Patel'],
    hairArtist: 'Priya Osei',
    makeupArtist: 'Zoe Park',
    nailArtist: 'Mira Patel',
    assistant: 'James Kim',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Leila-Nasser-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Leila-Nasser-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm23', name: 'Rio Sakamoto', lookNumber: '23',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%238A9BB0'/%3E%3Ctext x='150' y='175' text-anchor='middle' font-family='Inter,system-ui,sans-serif' font-size='100' font-weight='500' fill='white'%3ERS%3C/text%3E%3C/svg%3E",
    assignedArtists: ['Kenji Watanabe', 'Aisha Johnson'],
    hairArtist: 'Kenji Watanabe',
    makeupArtist: 'Aisha Johnson',
    nailArtist: null,
    assistant: 'Cleo Marsh',
    status: 'needs_revisit',
    notes: [{ id: 'note-m23-1', text: 'Root touchup needed.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-06-01T05:25:00' }],
    photos: [
  ],
    statusLog: [{ status: 'in_progress', timestamp: '5:00 AM', updatedBy: 'Lena Schmidt' }, { status: 'needs_revisit', timestamp: '5:25 AM', updatedBy: 'Lena Schmidt' }],
  },
  {
    id: 'm24', name: 'Beatrice Fontaine', lookNumber: '24',
    avatar: '/models/Beatrice-Fontaine-1.png',
    assignedArtists: ['David Kim', 'Luna Torres'],
    hairArtist: 'David Kim',
    makeupArtist: 'Luna Torres',
    nailArtist: null,
    assistant: 'Benji Adams',
    status: 'not_started',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Beatrice-Fontaine-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Beatrice-Fontaine-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Beatrice-Fontaine-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [],
  },
  {
    id: 'm25', name: 'Zara Osei', lookNumber: '25',
    avatar: '/models/Zara-Osei-1.png',
    assignedArtists: ['Lena Schmidt', 'Marcus Lee', 'Sofia Reyes'],
    hairArtist: 'Lena Schmidt',
    makeupArtist: 'Marcus Lee',
    nailArtist: 'Sofia Reyes',
    assistant: 'Nadia Faris',
    status: 'done',
    notes: [],
    photos: [
    { id: 'ph-1', url: '/models/Zara-Osei-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-2', url: '/models/Zara-Osei-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' },
    { id: 'ph-3', url: '/models/Zara-Osei-3.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 12, 2026', label: '' }
  ],
    statusLog: [{ status: 'in_progress', timestamp: '2:10 AM', updatedBy: 'Aisha Johnson' }, { status: 'done', timestamp: '2:56 AM', updatedBy: 'Mira Patel' }],
  },
]

// Per-model show history (past shows this model worked with the team)
export const modelHistory = {
  'm1': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Marcus Lee', 'Zoe Park'], assistants: ['Sophia Rivera'], notes: 'Strong look. No issues.', incidents: [] },
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Marcus Lee'], assistants: [], notes: '', incidents: [] },
  ],
  'm2': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Marcus Lee'], assistants: ['Sophia Rivera'], notes: '', incidents: [] },
    { showName: 'Valentino FW24', date: 'October 2024', city: 'New York', artists: ['Zoe Park'], assistants: [], notes: 'Easy to work with.', incidents: [] },
  ],
  'm3': [
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Zoe Park'], assistants: ['James Kim'], notes: 'Minimal coverage requested, honour it.', incidents: [] },
  ],
  'm6': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Zoe Park', 'David Kim'], assistants: [], notes: 'Left brow is always tricky — note for future.', incidents: [] },
    { showName: 'Valentino FW24', date: 'October 2024', city: 'New York', artists: ['Priya Osei'], assistants: [], notes: '', incidents: [] },
  ],
  'm9': [
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Zoe Park'], assistants: ['Cleo Marsh'], notes: 'Excellent. Fast in chair.', incidents: [] },
  ],
  'm11': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Jen Z', 'Marcus Lee'], assistants: ['Benji Adams'], notes: '', incidents: [] },
    { showName: 'Valentino FW24', date: 'October 2024', city: 'New York', artists: ['Jen Z'], assistants: [], notes: '', incidents: [] },
  ],
}

export const showHistory = [
  {
    id: 'sh1',
    name: 'Valentino FW25',
    season: 'Fall / Winter 2025',
    date: 'November 2025',
    venue: 'Palazzo Visconti',
    city: 'Milan',
    artists: [
      { name: 'Marcus Lee',  specialty: 'makeup', stars: 4 },
      { name: 'Zoe Park',    specialty: 'makeup', stars: 5 },
      { name: 'David Kim',   specialty: 'hair',   stars: 3 },
    ],
    incidents: [],
    receipts: { total: '$12,400', breakdown: ['Artist fees · $9,600', 'Product · $1,800', 'Travel · $1,000'] },
    notes: 'Smooth show. All artists arrived on time. David needs a stronger pre-show brief next season — timing was slightly off on the first three looks.',
  },
  {
    id: 'sh2',
    name: 'Valentino SS25',
    season: 'Spring / Summer 2025',
    date: 'March 2025',
    venue: 'Musée Rodin',
    city: 'Paris',
    artists: [
      { name: 'Marcus Lee',   specialty: 'makeup', stars: 3 },
      { name: 'Luna Torres',  specialty: 'makeup', stars: 5 },
    ],
    incidents: ['Artist no-show (original makeup lead). Replaced day-of with Luna Torres, sourced within 2 hours of call time.'],
    receipts: { total: '$9,800', breakdown: ['Artist fees · $7,200', 'Emergency replacement · $1,400', 'Product · $1,200'] },
    notes: 'Luna was the standout of the season — flag for all future Paris shows. No-show was handled cleanly but the replacement sourcing needs a standby protocol going forward.',
  },
  {
    id: 'sh3',
    name: 'Valentino FW24',
    season: 'Fall / Winter 2024',
    date: 'October 2024',
    venue: 'Pier 59 Studios',
    city: 'New York',
    artists: [
      { name: 'Zoe Park',    specialty: 'makeup', stars: 5 },
      { name: 'Priya Osei',  specialty: 'hair',   stars: 4 },
    ],
    incidents: [],
    receipts: { total: '$11,200', breakdown: ['Artist fees · $8,000', 'Product · $1,600', 'Travel · $1,600'] },
    notes: 'First NY show with this team configuration. Excellent execution. Priya and Zoe work well together — strong pairing for future US dates.',
  },
]

export const notifications = [
  { id: 'n1', text: 'Jen Z marked Sofia Andersen as Needs Revisit', status: 'needs_revisit', timestamp: '5:35 AM', read: false },
  { id: 'n2', text: 'Zoe Park started Irina Volkov', status: 'in_progress', timestamp: '3:06 AM', read: false },
  { id: 'n3', text: 'Marcus Lee added a note to Chloe Martin', status: null, timestamp: '2:29 AM', read: true },
  { id: 'n4', text: 'James Kim logged station', status: null, timestamp: '9:12 AM', read: true },
]

export const schedule = [
  { time: '9:00 AM',  label: 'Team arrives, stations set up' },
  { time: '9:30 AM',  label: 'Models begin arriving' },
  { time: '10:00 AM', label: 'Hair + Makeup begins' },
  { time: '12:00 PM', label: 'Lunch break (30 min)' },
  { time: '12:30 PM', label: 'Hair + Makeup resumes' },
  { time: '3:00 PM',  label: 'First run-through' },
  { time: '4:00 PM',  label: 'Touch-ups begin' },
  { time: '5:00 PM',  label: 'Models dressed, final checks' },
  { time: '5:30 PM',  label: 'Final run-through' },
  { time: '6:00 PM',  label: 'SHOWTIME', isShowtime: true },
  { time: '7:30 PM',  label: 'Show wraps, strike begins' },
]

export const STATUS_ORDER = ['not_started', 'in_progress', 'paused', 'needs_revisit', 'done']

export const STATUS_META = {
  not_started:  { label: 'NOT STARTED', color: '#E8E4DF', textColor: '#111111' },
  in_progress:  { label: 'IN PROGRESS', color: '#D4A853', textColor: '#111111' },
  paused:       { label: 'PAUSED',      color: '#8A9BB0', textColor: '#111111' },
  needs_revisit:{ label: 'NEEDS REVISIT', color: '#C4614A', textColor: '#111111' },
  done:         { label: 'DONE',        color: '#7A9E7E', textColor: '#111111' },
}

export function cycleStatus(current) {
  const idx = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
}

export function parseScheduleTime(timeStr) {
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}
