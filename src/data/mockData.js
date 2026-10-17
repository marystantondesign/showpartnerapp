// ─── Avatar helper ────────────────────────────────────────────────────────────
const _av = (initials, bg = '#8A9BB0') => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='${bg}'/><text x='150' y='175' text-anchor='middle' font-family='Inter,system-ui,sans-serif' font-size='100' font-weight='500' fill='white'>${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// ─── Show ─────────────────────────────────────────────────────────────────────
export const show = {
  id: 's1',
  name: 'Valentino SS26',
  date: 'Tuesday, April 28',
  dateShort: 'TUESDAY, APRIL 28',
  showtime: '6:00 PM',
  venue: 'Palais Brongniart',
  address: '8 Place de la Bourse, 75002 Paris, France',
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
export const timeline = [
  { id: 'demo',        time: '1:30 PM', label: 'Demo' },
  { id: 'walkthrough', time: '4:00 PM', label: 'Walkthrough' },
  { id: 'models_back', time: '4:30 PM', label: 'Models back' },
  { id: 'dressing',    time: '5:00 PM', label: 'Dressing' },
  { id: 'show',        time: '6:00 PM', label: 'Show' },
]
export const walkthroughState = 'upcoming' // 'upcoming' | 'in_progress' | 'done'

// ─── Announcements ────────────────────────────────────────────────────────────
export const announcements = [
  {
    id: 'ann-1',
    text: 'Walkthrough in 15 minutes',
    sentAt: '3:45 PM',
    sentBy: 'p1',
    delivery: { got: 22, unopened: 3, undelivered: 1 },
  },
  {
    id: 'ann-2',
    text: 'Walkthrough in 30 minutes',
    sentAt: '3:30 PM',
    sentBy: 'p1',
    delivery: { got: 26, unopened: 0, undelivered: 0 },
  },
]

// ─── Profiles ─────────────────────────────────────────────────────────────────
export const profiles = [
  // Producer
  { id: 'p1', name: 'Jen Zambrano', role: 'lead', avatar: '/lead/Jen-Z.png',
    tags: ['Show direction', 'Team coordination', 'Budget oversight'] },

  // Key artists
  { id: 'p2', name: 'Marcus Lee', role: 'artist', specialty: 'hair', avatar: '/artists/Marcus-Lee.png',
    tags: ['Editorial styling', 'Hair extensions', 'Avant-garde cuts', 'Color work', 'Braiding'] },
  { id: 'p3', name: 'Yadim', role: 'artist', specialty: 'makeup', avatar: '/artists/Zoe-Parker.png',
    tags: ['Runway makeup', 'Period looks', 'Airbrushing', 'Bridal', 'Avant-garde looks'] },

  // Lead assistants (new role)
  { id: 'p4', name: 'Aimi K', role: 'lead_assistant', specialty: 'hair', avatar: _av('AK', '#7A9E7E') },
  { id: 'p5', name: 'Iona', role: 'lead_assistant', specialty: 'makeup', avatar: _av('IO', '#D4A853') },

  // Hair assistants (9)
  { id: 'p6',  name: 'Sophia Rivera',  role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/assistants/Sophia-Rivera.png' },
  { id: 'p7',  name: 'James Kim',      role: 'assistant', specialty: 'hair',   trackingState: 'lost', lastSeenMins: 12, avatar: '/assistants/James-Kim.png' },
  { id: 'p8',  name: 'David Kim',      role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/artists/David-Kim.png' },
  { id: 'p9',  name: 'Priya Osei',     role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/artists/Priya-Osei.png' },
  { id: 'p10', name: 'Luna Torres',    role: 'assistant', specialty: 'hair',   trackingState: 'lost', lastSeenMins: 5,  avatar: '/artists/Luna-Tores.png' },
  { id: 'p11', name: 'Cleo Marsh',     role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/assistants/Cleo-Marsh.png' },
  { id: 'p12', name: 'Dara Okafor',    role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('DO', '#7A9E7E') },
  { id: 'p13', name: 'Ivana R.',       role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('IR', '#7A9E7E') },
  { id: 'p14', name: 'Tomás V.',       role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('TV', '#7A9E7E') },

  // Makeup assistants (9)
  { id: 'p15', name: 'Benji Adams',    role: 'assistant', specialty: 'makeup', trackingState: 'lost', lastSeenMins: 8,  avatar: '/assistants/Benji-Adams.png' },
  { id: 'p16', name: 'Kenji Watanabe', role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/artists/Kenji-Watanabe.png' },
  { id: 'p17', name: 'Sofia Reyes',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/artists/Sofia-Reyes.png' },
  { id: 'p18', name: 'Aisha Johnson',  role: 'assistant', specialty: 'makeup', trackingState: 'lost', lastSeenMins: 3,  avatar: '/artists/Aisha-Johnson.png' },
  { id: 'p19', name: 'Lena Schmidt',   role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/artists/Lena-Schmidt.png' },
  { id: 'p20', name: 'Mira Patel',     role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/artists/Mira-Patel.png' },
  { id: 'p21', name: 'Carmen Ruiz',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: _av('CR', '#D4A853') },
  { id: 'p22', name: 'Yuki T.',        role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: _av('YT', '#D4A853') },
  { id: 'p23', name: 'Ella Voss',      role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: _av('EV', '#D4A853') },

  // Nails assistants (8)
  { id: 'p24', name: 'Nadia Faris',    role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: '/assistants/Nadia-Faris.png' },
  { id: 'p25', name: 'Riley Chen',     role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('RC', '#8A9BB0') },
  { id: 'p26', name: 'Asha P.',        role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('AP', '#8A9BB0') },
  { id: 'p27', name: 'Zhen Liu',       role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('ZL', '#8A9BB0') },
  { id: 'p28', name: 'Petra M.',       role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('PM', '#8A9BB0') },
  { id: 'p29', name: 'Bianca R.',      role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('BR', '#8A9BB0') },
  { id: 'p30', name: 'Jin Ho',         role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('JH', '#8A9BB0') },
  { id: 'p31', name: 'Fatime K.',      role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('FK', '#8A9BB0') },
]

export const team = profiles

// ─── Models (30 total) ────────────────────────────────────────────────────────
//
// Service status counts (must match exactly):
//   Hair:   14 done · 9 in_progress · 2 paused · 5 not_started
//   Makeup: 17 done · 8 in_progress · 5 not_started
//   Nails:   9 done · 6 in_progress · 15 not_started
//   Fully ready (all 3 done): 8
//   Not arrived: 3  ·  Unpaired (arrived, no assistant): 1
//
// Look distribution:
//   A: m1,m5,m9,m13,m17,m21,m25,m29  (8)
//   B: m2,m6,m10,m14,m18,m22,m26,m30 (8)
//   C: m3,m7,m11,m15,m19,m23,m27     (7)
//   D: m4,m8,m12,m16,m20,m24,m28     (7)

const _done   = (id, st, em) => ({ status: 'done',        assistantId: id, startedAt: st,  elapsedMins: em })
const _ip     = (id, st)     => ({ status: 'in_progress', assistantId: id, startedAt: st  })
const _paused = (id, st, pa, em) => ({ status: 'paused',  assistantId: id, startedAt: st, pausedAt: pa, elapsedMins: em })
const _ns     = (id = null)  => ({ status: 'not_started', assistantId: id })

export const models = [
  // ── m1-m8: fully ready (hair done, makeup done, nails done) ──────────────
  {
    id: 'm1', name: 'Sofia Andersen', look: 'A',
    avatar: '/models/Sofia-Andersen-1.png',
    arrived: true, arrivedAt: '1:10 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p6',  '1:45 PM', 48),
      makeup: _done('p15', '1:50 PM', 43),
      nails:  _done('p24', '2:00 PM', 29),
    },
    status: 'done',
    notes: [{ id: 'note-m1-1', text: 'Allergic to latex gloves.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T13:35:00' }],
    photos: [
      { id: 'ph-1', url: '/models/Sofia-Andersen-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Sofia-Andersen-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm2', name: 'Neville Williams', look: 'B',
    avatar: '/models/Neville-Williams-1.png',
    arrived: true, arrivedAt: '1:12 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p7',  '1:48 PM', 51),
      makeup: _done('p16', '1:52 PM', 44),
      nails:  _done('p25', '2:05 PM', 27),
    },
    status: 'done',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Neville-Williams-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Neville-Williams-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm3', name: 'Irina Volkov', look: 'C',
    avatar: '/models/Irina-Volkov-1.png',
    arrived: true, arrivedAt: '1:15 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p8',  '1:50 PM', 46),
      makeup: _done('p17', '1:55 PM', 41),
      nails:  _done('p26', '2:08 PM', 31),
    },
    status: 'done',
    notes: [{ id: 'note-m3-1', text: 'Requested minimal coverage.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T14:06:00' }],
    photos: [
      { id: 'ph-1', url: '/models/Irina-Volkov-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Irina-Volkov-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm4', name: 'Cassidy Martin', look: 'D',
    avatar: '/models/Cassidy-Martin-1.png',
    arrived: true, arrivedAt: '1:18 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p9',  '1:52 PM', 44),
      makeup: _done('p18', '1:57 PM', 38),
      nails:  _done('p27', '2:10 PM', 28),
    },
    status: 'done',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Cassidy-Martin-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Cassidy-Martin-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm5', name: 'Aaliyah Jones', look: 'A',
    avatar: '/models/Aaliyah-Jones-1.png',
    arrived: true, arrivedAt: '1:20 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p10', '1:55 PM', 47),
      makeup: _done('p19', '2:00 PM', 40),
      nails:  _done('p28', '2:12 PM', 30),
    },
    status: 'done',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Aaliyah-Jones-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Aaliyah-Jones-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm6', name: 'Mei Lin', look: 'B',
    avatar: '/models/Mei-Lin-1.png',
    arrived: true, arrivedAt: '1:22 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p11', '1:58 PM', 45),
      makeup: _done('p20', '2:02 PM', 42),
      nails:  _done('p29', '2:15 PM', 26),
    },
    status: 'done',
    notes: [{ id: 'note-m6-1', text: 'Touch up left brow.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T14:08:00' }],
    photos: [
      { id: 'ph-1', url: '/models/Mei-Lin-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm7', name: 'Valentina Cruz', look: 'C',
    avatar: '/models/Valentina-Cruz-1.png',
    arrived: true, arrivedAt: '1:25 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p12', '2:00 PM', 49),
      makeup: _done('p21', '2:04 PM', 39),
      nails:  _done('p30', '2:18 PM', 32),
    },
    status: 'done',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Valentina-Cruz-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
      { id: 'ph-2', url: '/models/Valentina-Cruz-2.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm8', name: 'Ingrid Larsen', look: 'D',
    avatar: '/models/Ingrid-Larson-1.png',
    arrived: true, arrivedAt: '1:28 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p13', '2:05 PM', 50),
      makeup: _done('p22', '2:08 PM', 43),
      nails:  _done('p31', '2:20 PM', 29),
    },
    status: 'done',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Ingrid-Larson-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },

  // ── m9-m13: hair done, makeup done, nails in_progress ────────────────────
  {
    id: 'm9', name: 'Priya Sharma', look: 'A',
    avatar: '/models/Priya-Sharma-1.png',
    arrived: true, arrivedAt: '1:30 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p14', '2:10 PM', 47),
      makeup: _done('p23', '2:14 PM', 41),
      nails:  _ip('p24',   '3:05 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Priya-Sharma-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm10', name: 'Elena Morozova', look: 'B',
    avatar: '/models/Elena-Morozova-1.png',
    arrived: true, arrivedAt: '1:32 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p6',  '2:12 PM', 48),
      makeup: _done('p15', '2:16 PM', 42),
      nails:  _ip('p25',   '3:08 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Elena-Morozova-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm11', name: 'Amara Diallo', look: 'C',
    avatar: '/models/Amara-Diallo-1.png',
    arrived: true, arrivedAt: '1:35 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p7',  '2:15 PM', 44),
      makeup: _done('p16', '2:20 PM', 40),
      nails:  _ip('p26',   '3:10 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Amara-Diallo-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm12', name: 'Hana Tanaka', look: 'D',
    avatar: '/models/Hana-Tanaka-1.png',
    arrived: true, arrivedAt: '1:38 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p8',  '2:18 PM', 46),
      makeup: _done('p17', '2:22 PM', 39),
      nails:  _ip('p27',   '3:12 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Hana-Tanaka-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm13', name: 'Camille Dubois', look: 'A',
    avatar: '/models/Camille-DuBois-1.png',
    arrived: true, arrivedAt: '1:40 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p9',  '2:20 PM', 45),
      makeup: _done('p18', '2:25 PM', 38),
      nails:  _ip('p28',   '3:15 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Camille-DuBois-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },

  // ── m14: hair done, makeup in_progress, nails done ───────────────────────
  {
    id: 'm14', name: 'Ingrid Strand', look: 'B',
    avatar: '/models/Ingrid-Strand-1.png',
    arrived: true, arrivedAt: '1:42 PM', eta: null, flagged: false,
    services: {
      hair:   _done('p10', '2:22 PM', 44),
      makeup: _ip('p19',   '3:18 PM'),
      nails:  _done('p29', '2:28 PM', 27),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Ingrid-Strand-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },

  // ── m15: hair in_progress, makeup done, nails in_progress ────────────────
  {
    id: 'm15', name: 'Yuki Nakamura', look: 'C',
    avatar: '/models/Yuki-Nakamura-1.png',
    arrived: true, arrivedAt: '1:45 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p11',   '3:00 PM'),
      makeup: _done('p20', '2:30 PM', 43),
      nails:  _ip('p30',   '3:20 PM'),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },

  // ── m16-m18: hair in_progress, makeup done, nails not_started ────────────
  {
    id: 'm16', name: 'Fatima Hassan', look: 'D',
    avatar: '/models/Fatima-Hassan-1.png',
    arrived: true, arrivedAt: '1:48 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p12',   '3:05 PM'),
      makeup: _done('p21', '2:35 PM', 41),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [
      { id: 'ph-1', url: '/models/Fatima-Hassan-1.png', uploadedBy: 'Production', uploaderId: 'system', timestamp: 'Apr 28, 2026', label: '' },
    ],
  },
  {
    id: 'm17', name: 'Claudia Ferretti', look: 'A',
    avatar: '/models/Claudia-Ferretti-1.png',
    arrived: true, arrivedAt: '1:50 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p13',   '3:08 PM'),
      makeup: _done('p22', '2:38 PM', 40),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },
  {
    id: 'm18', name: 'Soo-Yeon Park', look: 'B',
    avatar: '/models/Soo-Yeon-Park-1.png',
    arrived: true, arrivedAt: '1:52 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p14',   '3:10 PM'),
      makeup: _done('p23', '2:40 PM', 38),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },

  // ── m19-m23: hair in_progress, makeup in_progress, nails not_started ─────
  {
    id: 'm19', name: 'Abdullah Ali', look: 'C',
    avatar: '/models/Abdullah-Ali-1.png',
    arrived: true, arrivedAt: '2:00 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p6',    '3:15 PM'),
      makeup: _ip('p15',   '3:20 PM'),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },
  {
    id: 'm20', name: 'Justin Mitchell', look: 'D',
    avatar: '/models/Justin-Mitchell-1.png',
    arrived: true, arrivedAt: '2:05 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p7',    '3:18 PM'),
      makeup: _ip('p16',   '3:22 PM'),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [{ id: 'note-m20-1', text: 'Waiting on stylist confirm for final look.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T15:10:00' }],
    photos: [],
  },
  {
    id: 'm21', name: 'Astrid Lindqvist', look: 'A',
    avatar: '/models/Astrid-Lindqvist-1.png',
    arrived: true, arrivedAt: '2:08 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p8',    '3:20 PM'),
      makeup: _ip('p17',   '3:25 PM'),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },
  {
    id: 'm22', name: 'Leila Nasser', look: 'B',
    avatar: '/models/Leila-Nasser-1.png',
    arrived: true, arrivedAt: '2:10 PM', eta: null, flagged: false,
    services: {
      hair:   _ip('p9',    '3:22 PM'),
      makeup: _ip('p18',   '3:28 PM'),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [],
    photos: [],
  },
  {
    id: 'm23', name: 'Rio Sakamoto', look: 'C',
    avatar: _av('RS', '#8A9BB0'),
    arrived: true, arrivedAt: '2:12 PM', eta: null, flagged: true,
    services: {
      hair:   _ip('p10',   '3:25 PM'),
      makeup: _ip('p19',   '3:30 PM'),
      nails:  _ns(),
    },
    status: 'in_progress',
    notes: [{ id: 'note-m23-1', text: 'Root touchup needed before walkthrough.', authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T15:25:00' }],
    photos: [],
  },

  // ── m24-m25: hair paused, makeup in_progress, nails not_started ──────────
  {
    id: 'm24', name: 'Beatrice Fontaine', look: 'D',
    avatar: '/models/Beatrice-Fontaine-1.png',
    arrived: true, arrivedAt: '2:15 PM', eta: null, flagged: false,
    services: {
      hair:   _paused('p11', '3:10 PM', '3:38 PM', 28),
      makeup: _ip('p20',     '3:35 PM'),
      nails:  _ns(),
    },
    status: 'paused',
    notes: [],
    photos: [],
  },
  {
    id: 'm25', name: 'Zara Osei', look: 'A',
    avatar: '/models/Zara-Osei-1.png',
    arrived: true, arrivedAt: '2:18 PM', eta: null, flagged: false,
    services: {
      hair:   _paused('p12', '3:12 PM', '3:40 PM', 28),
      makeup: _ip('p21',     '3:38 PM'),
      nails:  _ns(),
    },
    status: 'paused',
    notes: [],
    photos: [],
  },

  // ── m26: arrived, paired, services not started ───────────────────────────
  {
    id: 'm26', name: 'Tae-Yang Oh', look: 'B',
    avatar: _av('TO', '#4A4743'),
    arrived: true, arrivedAt: '2:30 PM', eta: null, flagged: false,
    services: {
      hair:   _ns('p13'),
      makeup: _ns('p22'),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },

  // ── m27: arrived, unpaired (no assistant assigned) ────────────────────────
  {
    id: 'm27', name: 'Rosa Ferreira', look: 'C',
    avatar: _av('RF', '#4A4743'),
    arrived: true, arrivedAt: '3:10 PM', eta: null, flagged: false,
    services: {
      hair:   _ns(),
      makeup: _ns(),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },

  // ── m28-m30: not arrived ──────────────────────────────────────────────────
  {
    id: 'm28', name: 'Natasha Ivanova', look: 'D',
    avatar: _av('NI', '#B0ACA7'),
    arrived: false, arrivedAt: null, eta: '5:00 PM', flagged: false,
    services: {
      hair:   _ns(),
      makeup: _ns(),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },
  {
    id: 'm29', name: 'Leo Beaumont', look: 'A',
    avatar: _av('LB', '#B0ACA7'),
    arrived: false, arrivedAt: null, eta: '5:15 PM', flagged: false,
    services: {
      hair:   _ns(),
      makeup: _ns(),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },
  {
    id: 'm30', name: 'Zara El-Amin', look: 'B',
    avatar: _av('ZA', '#B0ACA7'),
    arrived: false, arrivedAt: null, eta: '5:30 PM', flagged: false,
    services: {
      hair:   _ns(),
      makeup: _ns(),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },
]

// ─── Model history ────────────────────────────────────────────────────────────
export const modelHistory = {
  'm1': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Marcus Lee', 'Yadim'], assistants: ['Sophia Rivera'], notes: 'Strong look. No issues.', incidents: [] },
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Marcus Lee'], assistants: [], notes: '', incidents: [] },
  ],
  'm2': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Marcus Lee'], assistants: ['Sophia Rivera'], notes: '', incidents: [] },
    { showName: 'Valentino FW24', date: 'October 2024', city: 'New York', artists: ['Yadim'], assistants: [], notes: 'Easy to work with.', incidents: [] },
  ],
  'm3': [
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Yadim'], assistants: ['James Kim'], notes: 'Minimal coverage requested, honour it.', incidents: [] },
  ],
  'm6': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Yadim', 'David Kim'], assistants: [], notes: 'Left brow is always tricky.', incidents: [] },
  ],
  'm9': [
    { showName: 'Valentino SS25', date: 'March 2025', city: 'Paris', artists: ['Yadim'], assistants: ['Cleo Marsh'], notes: 'Excellent. Fast in chair.', incidents: [] },
  ],
  'm11': [
    { showName: 'Valentino FW25', date: 'November 2025', city: 'Milan', artists: ['Jen Z', 'Marcus Lee'], assistants: ['Benji Adams'], notes: '', incidents: [] },
  ],
}

// ─── Show history ─────────────────────────────────────────────────────────────
export const showHistory = [
  {
    id: 'sh1',
    name: 'Valentino FW25',
    season: 'Fall / Winter 2025',
    date: 'November 2025',
    venue: 'Palazzo Visconti',
    city: 'Milan',
    artists: [
      { name: 'Marcus Lee', specialty: 'hair',   stars: 4 },
      { name: 'Yadim',      specialty: 'makeup', stars: 5 },
      { name: 'David Kim',  specialty: 'hair',   stars: 3 },
    ],
    incidents: [],
    receipts: { total: '$12,400', breakdown: ['Artist fees · $9,600', 'Product · $1,800', 'Travel · $1,000'] },
    notes: 'Smooth show. All artists arrived on time.',
  },
  {
    id: 'sh2',
    name: 'Valentino SS25',
    season: 'Spring / Summer 2025',
    date: 'March 2025',
    venue: 'Musée Rodin',
    city: 'Paris',
    artists: [
      { name: 'Marcus Lee',  specialty: 'hair',   stars: 3 },
      { name: 'Luna Torres', specialty: 'makeup', stars: 5 },
    ],
    incidents: ['Artist no-show (original makeup lead). Replaced day-of with Luna Torres.'],
    receipts: { total: '$9,800', breakdown: ['Artist fees · $7,200', 'Emergency replacement · $1,400', 'Product · $1,200'] },
    notes: 'Luna was the standout of the season.',
  },
  {
    id: 'sh3',
    name: 'Valentino FW24',
    season: 'Fall / Winter 2024',
    date: 'October 2024',
    venue: 'Pier 59 Studios',
    city: 'New York',
    artists: [
      { name: 'Yadim',      specialty: 'makeup', stars: 5 },
      { name: 'Priya Osei', specialty: 'hair',   stars: 4 },
    ],
    incidents: [],
    receipts: { total: '$11,200', breakdown: ['Artist fees · $8,000', 'Product · $1,600', 'Travel · $1,600'] },
    notes: 'First NY show with this team. Excellent execution.',
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = [
  { id: 'n1', text: 'Jen Z flagged Rio Sakamoto',         status: null,          timestamp: '3:25 PM', read: false },
  { id: 'n2', text: 'Beatrice Fontaine hair paused',       status: 'paused',      timestamp: '3:38 PM', read: false },
  { id: 'n3', text: 'Marcus Lee added note on Justin M.',  status: null,          timestamp: '3:10 PM', read: true  },
  { id: 'n4', text: 'Priya Sharma nails started',          status: 'in_progress', timestamp: '3:05 PM', read: true  },
]

// ─── Schedule (legacy — use timeline for new views) ───────────────────────────
export const schedule = [
  { time: '9:00 AM',  label: 'Team arrives, stations set up' },
  { time: '9:30 AM',  label: 'Models begin arriving' },
  { time: '10:00 AM', label: 'Hair + Makeup begins' },
  { time: '12:00 PM', label: 'Lunch break (30 min)' },
  { time: '12:30 PM', label: 'Hair + Makeup resumes' },
  { time: '1:30 PM',  label: 'Demo', id: 'demo' },
  { time: '4:00 PM',  label: 'Walkthrough', id: 'walkthrough' },
  { time: '4:30 PM',  label: 'Models back', id: 'models_back' },
  { time: '5:00 PM',  label: 'Dressing', id: 'dressing' },
  { time: '6:00 PM',  label: 'Show', isShowtime: true, id: 'show' },
  { time: '7:30 PM',  label: 'Show wraps, strike begins' },
]

// ─── Status helpers ───────────────────────────────────────────────────────────
export const STATUS_ORDER = ['not_started', 'in_progress', 'paused', 'done']

export const STATUS_META = {
  not_started: { label: 'NOT STARTED', color: '#E8E4DF', textColor: '#111111' },
  in_progress: { label: 'IN PROGRESS', color: '#D4A853', textColor: '#111111' },
  paused:      { label: 'PAUSED',      color: '#8A9BB0', textColor: '#111111' },
  done:        { label: 'DONE',        color: '#7A9E7E', textColor: '#111111' },
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

// Derives a single overall status from a model's per-service statuses
export function modelOverallStatus(model) {
  if (!model.arrived) return 'not_started'
  const statuses = Object.values(model.services).map(s => s.status)
  if (statuses.every(s => s === 'done'))         return 'done'
  if (statuses.some(s => s === 'in_progress'))   return 'in_progress'
  if (statuses.some(s => s === 'paused'))        return 'paused'
  return 'not_started'
}
