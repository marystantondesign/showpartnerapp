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
  { id: 'p3', name: 'Yadim', role: 'artist', specialty: 'makeup', avatar: '/assistants/yadim.jpg',
    tags: ['Runway makeup', 'Period looks', 'Airbrushing', 'Bridal', 'Avant-garde looks'] },

  // Lead assistants (new role)
  { id: 'p4', name: 'Aimi K', role: 'lead_assistant', specialty: 'makeup', avatar: '/assistants/aimi.jpg' },
  { id: 'p5', name: 'Iona M', role: 'lead_assistant', specialty: 'makeup', avatar: '/assistants/iona.jpg' },

  // Hair assistants (9)
  { id: 'p6',  name: 'Sophia Rivera',  role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/assistants/Sophia-Rivera.png', station: 'Station 1' },
  { id: 'p7',  name: 'James Kim',      role: 'assistant', specialty: 'hair',   trackingState: 'lost', lastSeenMins: 12, avatar: '/assistants/James-Kim.png',     station: 'Station 2' },
  { id: 'p8',  name: 'David Kim',      role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/artists/David-Kim.png',        station: 'Station 3' },
  { id: 'p9',  name: 'Priya Osei',     role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/artists/Priya-Osei.png',       station: 'Station 4' },
  { id: 'p10', name: 'Luna Torres',    role: 'assistant', specialty: 'hair',   trackingState: 'lost', lastSeenMins: 5,  avatar: '/artists/Luna-Tores.png',       station: 'Station 5' },
  { id: 'p11', name: 'Cleo Marsh',     role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: '/assistants/Cleo-Marsh.png',    station: 'Station 6' },
  { id: 'p12', name: 'Dara Okafor',    role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('DO', '#7A9E7E'),             station: 'Station 7' },
  { id: 'p13', name: 'Ivana R.',       role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('IR', '#7A9E7E'),             station: 'Station 8' },
  { id: 'p14', name: 'Tomás V.',       role: 'assistant', specialty: 'hair',   trackingState: 'active',               avatar: _av('TV', '#7A9E7E'),             station: 'Station 9' },

  // Makeup assistants (9)
  { id: 'p15', name: 'Benji Adams',    role: 'assistant', specialty: 'makeup', trackingState: 'lost', lastSeenMins: 8,  avatar: '/assistants/benji.jpg',   station: 'Station 5' },
  { id: 'p16', name: 'Kenji Watanabe', role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/kenji.jpg',   station: 'Station 1' },
  { id: 'p17', name: 'Sofia Reyes',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/sofia.jpg',   station: 'Station 2' },
  { id: 'p18', name: 'Aisha Johnson',  role: 'assistant', specialty: 'makeup', trackingState: 'lost', lastSeenMins: 3,  avatar: '/assistants/aisha.jpg',   station: 'Station 3' },
  { id: 'p19', name: 'Lena Schmidt',   role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/lena.jpg',    station: 'Station 4' },
  { id: 'p20', name: 'Mira Patel',     role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/mira.jpg',    station: 'Station 6' },
  { id: 'p21', name: 'Carmen Ruiz',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/carmen.jpg',  station: 'Station 7' },
  { id: 'p22', name: 'Yuki T.',        role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/yuki.jpg',    station: 'Station 8' },
  { id: 'p23', name: 'Ella Voss',      role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/ella.jpg',    station: 'Station 9' },
  { id: 'p32', name: 'Dara Okafor',   role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/dara.jpg',    station: 'Station 10' },
  { id: 'p33', name: 'Dev Kapoor',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/dev.jpg',     station: 'Station 10' },
  { id: 'p34', name: 'Ivana Ruiz',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/ivana.jpg',   station: 'Station 11' },
  { id: 'p35', name: 'Leo Tan',       role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/leo.jpg',     station: 'Station 12' },
  { id: 'p36', name: 'Theo Grant',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/theo.jpg',    station: 'Station 13' },
  { id: 'p37', name: 'Tomás Vega',    role: 'assistant', specialty: 'makeup', trackingState: 'active',               avatar: '/assistants/tomas.jpg',   station: 'Station 14' },

  // Nails assistants (8)
  { id: 'p24', name: 'Nadia Faris',    role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: '/assistants/Nadia-Faris.png',   station: 'Station 1' },
  { id: 'p25', name: 'Riley Chen',     role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('RC', '#8A9BB0'),             station: 'Station 2' },
  { id: 'p26', name: 'Asha P.',        role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('AP', '#8A9BB0'),             station: 'Station 3' },
  { id: 'p27', name: 'Zhen Liu',       role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('ZL', '#8A9BB0'),             station: 'Station 4' },
  { id: 'p28', name: 'Petra M.',       role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('PM', '#8A9BB0'),             station: 'Station 5' },
  { id: 'p29', name: 'Bianca R.',      role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('BR', '#8A9BB0'),             station: 'Station 9' },
  { id: 'p30', name: 'Jin Ho',         role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('JH', '#8A9BB0'),             station: 'Station 6' },
  { id: 'p31', name: 'Fatime K.',      role: 'assistant', specialty: 'nails',  trackingState: 'active',               avatar: _av('FK', '#8A9BB0'),             station: 'Station 7' },
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
    notes: [{ id: 'note-m1-1', text: 'Allergic to latex gloves.', isAllergy: true, authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: '2026-04-28T13:35:00' }],
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
    arrived: true, arrivedAt: '1:18 PM', eta: null, flagged: true, flagReason: 'Allergy check needed',
    services: {
      hair:   _done('p9',  '1:52 PM', 44),
      makeup: _done('p18', '1:57 PM', 38),
      nails:  _done('p27', '2:10 PM', 28),
    },
    status: 'done',
    notes: [],
    statusLog: [
      { time: '1:18 PM', text: 'Arrived' },
      { time: '3:05 PM', text: 'Paired with Aisha Johnson' },
      { time: '3:31 PM', text: 'Hair started' },
      { time: '3:50 PM', text: 'Makeup started · Aisha J' },
      { time: '4:12 PM', text: 'Makeup paused · Aisha J' },
    ],
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
      makeup: { ..._done('p20', '2:02 PM', 42), reviewRequestedAt: '3:41 PM' },
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
      makeup: _ip('p37',   '3:45 PM'),
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
      makeup: { ..._done('p16', '2:20 PM', 40), reviewRequestedAt: '3:22 PM' },
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
      makeup: { ..._done('p18', '2:25 PM', 38), reviewRequestedAt: '3:28 PM' },
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
    arrived: true, arrivedAt: '2:12 PM', eta: null, flagged: true, flagReason: 'Check in needed',
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
      makeup: _ip('p32',   '3:50 PM'),
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
      makeup: _ip('p33',   '3:52 PM'),
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
    arrived: false, arrivedAt: null, eta: '5:00 PM', flagged: false, comingFrom: 'Prada',
    services: {
      hair:   _ns(),
      makeup: _ip('p34',   '3:55 PM'),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },
  {
    id: 'm29', name: 'Leo Beaumont', look: 'A',
    avatar: _av('LB', '#B0ACA7'),
    arrived: false, arrivedAt: null, eta: '5:15 PM', flagged: false, comingFrom: 'Prada',
    services: {
      hair:   _ns(),
      makeup: _ip('p35',   '3:58 PM'),
      nails:  _ns(),
    },
    status: 'not_started',
    notes: [],
    photos: [],
  },
  {
    id: 'm30', name: 'Zara El-Amin', look: 'B',
    avatar: _av('ZA', '#B0ACA7'),
    arrived: false, arrivedAt: null, eta: '5:30 PM', flagged: false, comingFrom: 'Khaite',
    services: {
      hair:   _ns(),
      makeup: _ip('p36',   '4:00 PM'),
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
    designer: { brand: 'Valentino', showContact: 'Giulia R, Studio Meridian', brief: 'Makeup brief from Yadim' },
    modelsCount: 30,
    workedWithBefore: 4,
    artists: [
      { name: 'Marcus Lee', specialty: 'hair',   stars: 4 },
      { name: 'Yadim',      specialty: 'makeup', stars: 5 },
      { name: 'David Kim',  specialty: 'hair',   stars: 3 },
    ],
    assistants: [
      { name: 'Yadim',       role: 'Key artist · makeup',  stars: 5, inviteBack: true },
      { name: 'Marcus Lee',  role: 'Hair lead',             stars: 4, inviteBack: true },
      { name: 'Sofia Reyes', role: 'Makeup assistant',      stars: 4, inviteBack: true },
      { name: 'David Kim',   role: 'Hair assistant',        stars: 3, inviteBack: false },
    ],
    assistantsCount: 28,
    venueNotes: 'Backstage on the 2nd floor, one freight lift. Only 4 outlets per row, bring extension cords. Wifi drops in the east room.',
    workedAlongside: [
      { dept: 'Hair',             company: 'Atelier Coiffure',  lead: 'Paolo M' },
      { dept: 'Nails',            company: 'Paintbox Studio',   lead: 'Kim T' },
      { dept: 'Show production',  company: 'Studio Meridian',   lead: 'Giulia R' },
      { dept: 'Casting',          company: 'Ark Casting',       lead: 'Tomas B' },
    ],
    howItWent: { walkthroughPlanned: '4:00', walkthroughActual: '4:12', readyAtWalkthrough: 26, modelsTotal: 30 },
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
    designer: { brand: 'Valentino', showContact: 'Léa M, Bureau d\'Arts', brief: 'Makeup brief from Pat McGrath' },
    modelsCount: 28,
    workedWithBefore: 3,
    artists: [
      { name: 'Marcus Lee',  specialty: 'hair',   stars: 3 },
      { name: 'Luna Torres', specialty: 'makeup', stars: 5 },
    ],
    assistants: [
      { name: 'Luna Torres', role: 'Key artist · makeup',  stars: 5, inviteBack: true },
      { name: 'Marcus Lee',  role: 'Hair lead',             stars: 3, inviteBack: false },
      { name: 'Aimi K',      role: 'Makeup assistant',      stars: 4, inviteBack: true },
    ],
    assistantsCount: 24,
    venueNotes: 'Garden venue, weather contingency tent on the left. No freight access, hand-carry everything from rue de Varenne entrance.',
    workedAlongside: [
      { dept: 'Hair',             company: 'Dessange Paris',    lead: 'Fabien D' },
      { dept: 'Nails',            company: 'CND',               lead: 'Sophie L' },
      { dept: 'Show production',  company: 'Bureau d\'Arts',    lead: 'Léa M' },
      { dept: 'Casting',          company: 'Viva Models',       lead: 'Marc A' },
    ],
    howItWent: { walkthroughPlanned: '3:30', walkthroughActual: '3:48', readyAtWalkthrough: 22, modelsTotal: 28 },
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
    designer: { brand: 'Valentino', showContact: 'Rachel K, The Collective', brief: 'Makeup brief from Tom Pecheux' },
    modelsCount: 32,
    workedWithBefore: 2,
    artists: [
      { name: 'Yadim',      specialty: 'makeup', stars: 5 },
      { name: 'Priya Osei', specialty: 'hair',   stars: 4 },
    ],
    assistants: [
      { name: 'Yadim',       role: 'Key artist · makeup',  stars: 5, inviteBack: true },
      { name: 'Priya Osei',  role: 'Hair lead',             stars: 4, inviteBack: true },
      { name: 'Tomás V',     role: 'Makeup assistant',      stars: 3, inviteBack: false },
    ],
    assistantsCount: 22,
    venueNotes: 'Loading dock on W 23rd. Cold in October, bring a wrap. Long walk from parking to backstage through the main studio.',
    workedAlongside: [
      { dept: 'Hair',             company: 'Bumble and bumble',  lead: 'Justin A' },
      { dept: 'Nails',            company: 'OPI Pro',            lead: 'Dana R' },
      { dept: 'Show production',  company: 'The Collective',     lead: 'Rachel K' },
      { dept: 'Casting',          company: 'DNA Models',         lead: 'Sam G' },
    ],
    howItWent: { walkthroughPlanned: '5:00', walkthroughActual: '5:00', readyAtWalkthrough: 32, modelsTotal: 32 },
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

export const profileNotifications = {
  // Benji Adams (p15) — makeup assistant
  'p15': [
    { id: 'bn1', type: 'ping',       text: 'Iona M pinged you: get Mei Lin reviewed by Yadim',               timestamp: '4:41 PM', read: false, dot: 'red'  },
    { id: 'bn2', type: 'walkthrough', text: 'Walkthrough in 15 minutes',                                      timestamp: '3:45 PM', read: true,  dot: 'gray' },
    { id: 'bn3', type: 'walkthrough', text: 'Walkthrough in 30 minutes',                                      timestamp: '3:30 PM', read: true,  dot: 'gray' },
    { id: 'bn4', type: 'pairing',     text: "You're paired with Rosa Ferreira · Look C · Station 5", timestamp: '2:32 PM', read: false, dot: 'gold' },
  ],
  // Iona M (p5) — lead assistant
  'p5': [
    { id: 'im1', type: 'review_request', text: 'Dev Kapoor pinged you to get Camille Dubois reviewed · Look 13 · Station 11', timestamp: '4:38 PM', read: false, dot: 'red'  },
    { id: 'im2', type: 'review_request', text: 'Aisha Johnson pinged you to get Luna Torres reviewed · Look 7 · Station 3',   timestamp: '4:25 PM', read: false, dot: 'red'  },
    { id: 'im3', type: 'finished',       text: 'Sofia Reyes finished Mei Lin · Look 06',                                           timestamp: '4:10 PM', read: true,  dot: 'gray' },
    { id: 'im4', type: 'producer_ping',  text: 'Jen Z pinged you: Amara Diallo needs a touch-up',                                       timestamp: '3:55 PM', read: false, dot: 'red'  },
    { id: 'im5', type: 'walkthrough',    text: 'Walkthrough in 15 minutes',                                                             timestamp: '3:45 PM', read: true,  dot: 'gray' },
    { id: 'im6', type: 'walkthrough',    text: 'Walkthrough in 30 minutes',                                                             timestamp: '3:30 PM', read: true,  dot: 'gray' },
  ],
}

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

// ─── Model details (phone, past shows) ────────────────────────────────────────
export const modelDetails = {
  'm1':  { phone: '+33 6 11 22 33 44', pastShows: { count: 2, shows: 'Valentino FW25, SS25' } },
  'm2':  { phone: '+44 7911 123 456',  pastShows: { count: 2, shows: 'Valentino FW25, FW24' } },
  'm3':  { phone: '+7 916 123 45 67',  pastShows: { count: 1, shows: 'Valentino SS25' } },
  'm4':  { phone: '+1 212 555 0140',   pastShows: { count: 0, shows: null } },
  'm5':  { phone: '+1 310 555 0182',   pastShows: { count: 0, shows: null } },
  'm6':  { phone: '+86 138 0013 8000', pastShows: { count: 1, shows: 'Valentino FW25' } },
  'm7':  { phone: '+34 612 345 678',   pastShows: { count: 0, shows: null } },
  'm8':  { phone: '+47 912 34 567',    pastShows: { count: 0, shows: null } },
  'm9':  { phone: '+91 98765 43210',   pastShows: { count: 1, shows: 'Valentino SS25' } },
  'm10': { phone: '+7 495 123 45 67',  pastShows: { count: 0, shows: null } },
  'm11': { phone: '+221 77 123 45 67', pastShows: { count: 1, shows: 'Valentino FW25' } },
  'm12': { phone: '+81 3 1234 5678',   pastShows: { count: 0, shows: null } },
  'm13': { phone: '+33 6 98 76 54 32', pastShows: { count: 0, shows: null } },
  'm14': { phone: '+47 999 00 111',    pastShows: { count: 0, shows: null } },
  'm15': { phone: '+81 90 1234 5678',  pastShows: { count: 0, shows: null } },
  'm16': { phone: '+20 100 123 4567',  pastShows: { count: 0, shows: null } },
  'm17': { phone: '+39 320 123 4567',  pastShows: { count: 0, shows: null } },
  'm18': { phone: '+82 10 1234 5678',  pastShows: { count: 0, shows: null } },
  'm19': { phone: '+971 50 123 4567',  pastShows: { count: 0, shows: null } },
  'm20': { phone: '+1 323 555 0167',   pastShows: { count: 0, shows: null } },
  'm21': { phone: '+46 70 123 45 67',  pastShows: { count: 0, shows: null } },
  'm22': { phone: '+20 100 987 6543',  pastShows: { count: 0, shows: null } },
  'm23': { phone: '+81 80 9876 5432',  pastShows: { count: 0, shows: null } },
  'm24': { phone: '+33 6 45 67 89 01', pastShows: { count: 0, shows: null } },
  'm25': { phone: '+233 20 123 4567',  pastShows: { count: 0, shows: null } },
  'm26': { phone: '+82 10 9876 5432',  pastShows: { count: 0, shows: null } },
  'm27': { phone: '+351 912 345 678',  pastShows: { count: 0, shows: null } },
  'm28': { phone: '+7 926 123 45 67',  pastShows: { count: 0, shows: null } },
  'm29': { phone: '+33 6 78 90 12 34', pastShows: { count: 0, shows: null } },
  'm30': { phone: '+216 20 123 456',   pastShows: { count: 0, shows: null } },
}

// ─── Inventory products ────────────────────────────────────────────────────────
export const inventoryProducts = [
  // Skin (12)
  { id: 'p-sk-01', name: 'Luminous Silk Foundation',    brand: 'Armani Beauty',        shade: '6.5',          area: 'Skin',  color: '#C8A882', inKit: 2, today: 1, stock: 4 },
  { id: 'p-sk-02', name: 'Radiant Creamy Concealer',    brand: 'NARS',                 shade: 'Custard',       area: 'Skin',  color: '#D4B896', inKit: 3, today: 2, stock: 6 },
  { id: 'p-sk-03', name: 'Flawless Filter',             brand: 'Charlotte Tilbury',    shade: '4',             area: 'Skin',  color: '#C9A87C', inKit: 1, today: 0, stock: 3 },
  { id: 'p-sk-04', name: 'Pro Filt\'r Soft Matte',      brand: 'Fenty Beauty',         shade: '200W',          area: 'Skin',  color: '#B89070', inKit: 2, today: 1, stock: 2 },
  { id: 'p-sk-05', name: 'Translucent Loose Powder',    brand: 'Laura Mercier',        shade: 'Translucent',   area: 'Skin',  color: '#E8DDD0', inKit: 4, today: 3, stock: 8 },
  { id: 'p-sk-06', name: 'Ambient Lighting Powder',     brand: 'Hourglass',            shade: 'Ethereal Light',area: 'Skin',  color: '#E4D4C0', inKit: 1, today: 0, stock: 2 },
  { id: 'p-sk-07', name: 'Skin Long-Wear Foundation',   brand: 'Bobbi Brown',          shade: 'Warm Ivory',    area: 'Skin',  color: '#D4AA80', inKit: 2, today: 1, stock: 5 },
  { id: 'p-sk-08', name: 'Studio Fix Fluid SPF 15',     brand: 'MAC',                  shade: 'NC30',          area: 'Skin',  color: '#C4966A', inKit: 0, today: 0, stock: 1 },
  { id: 'p-sk-09', name: 'Sensual Skin Enhancer',       brand: 'Kevyn Aucoin',         shade: 'SX08',          area: 'Skin',  color: '#B8845E', inKit: 1, today: 0, stock: 3 },
  { id: 'p-sk-10', name: 'Sheer Glow Foundation',       brand: 'NARS',                 shade: 'Syracuse',      area: 'Skin',  color: '#C09070', inKit: 3, today: 2, stock: 7 },
  { id: 'p-sk-11', name: 'Forever Skin Glow',           brand: 'Dior',                 shade: '2N',            area: 'Skin',  color: '#C8A882', inKit: 2, today: 1, stock: 4 },
  { id: 'p-sk-12', name: 'Hyaluronic Hydra-Foundation', brand: 'By Terry',             shade: '200C Natural',  area: 'Skin',  color: '#D0A880', inKit: 0, today: 0, stock: 0 },
  // Eyes (12)
  { id: 'p-ey-01', name: 'Rock n Kohl Liner',           brand: 'Charlotte Tilbury',    shade: 'Barbarella Brown', area: 'Eyes', color: '#6B4226', inKit: 6, today: 4, stock: 10 },
  { id: 'p-ey-02', name: 'Scattered Light Glitter',     brand: 'Hourglass',            shade: 'Blaze',          area: 'Eyes', color: '#D4916B', inKit: 1, today: 0, stock: 2 },
  { id: 'p-ey-03', name: 'Soft Glam Eye Shadow',        brand: 'Anastasia Beverly Hills', shade: 'Palette',    area: 'Eyes', color: '#C4845E', inKit: 2, today: 1, stock: 4 },
  { id: 'p-ey-04', name: 'Snap Shadows Mix & Match',    brand: 'Fenty Beauty',         shade: '4 Warm',         area: 'Eyes', color: '#A87040', inKit: 2, today: 2, stock: 5 },
  { id: 'p-ey-05', name: '24/7 Glide-On Eye Pencil',    brand: 'Urban Decay',          shade: 'Zero',           area: 'Eyes', color: '#1A1410', inKit: 8, today: 5, stock: 14 },
  { id: 'p-ey-06', name: 'Liquid Eye Liner',            brand: 'MAC',                  shade: 'Boot Black',     area: 'Eyes', color: '#0D0B08', inKit: 5, today: 3, stock: 9 },
  { id: 'p-ey-07', name: 'Climax Mascara',              brand: 'NARS',                 shade: 'Explicit Black', area: 'Eyes', color: '#0A0806', inKit: 6, today: 6, stock: 12 },
  { id: 'p-ey-08', name: 'Sky High Mascara',            brand: 'Maybelline',           shade: 'Very Black',     area: 'Eyes', color: '#0D0A07', inKit: 4, today: 3, stock: 8 },
  { id: 'p-ey-09', name: 'Highliner Matte Gel',         brand: 'Marc Jacobs',          shade: 'Blacquer',       area: 'Eyes', color: '#121010', inKit: 3, today: 2, stock: 6 },
  { id: 'p-ey-10', name: 'Stylo Yeux Waterproof',       brand: 'Chanel',               shade: 'Noir',           area: 'Eyes', color: '#0E0C09', inKit: 2, today: 1, stock: 4 },
  { id: 'p-ey-11', name: 'Diorshow Iconic Mascara',     brand: 'Dior',                 shade: 'Black',          area: 'Eyes', color: '#0B0908', inKit: 5, today: 4, stock: 10 },
  { id: 'p-ey-12', name: 'Infallible 36H Gel Liner',    brand: 'L\'Oreal',             shade: 'Black',          area: 'Eyes', color: '#100E0B', inKit: 3, today: 2, stock: 6 },
  // Lips (8)
  { id: 'p-lp-01', name: 'Gloss Bomb Universal Lip',    brand: 'Fenty Beauty',         shade: 'Fu$$y',          area: 'Lips', color: '#C47060', inKit: 4, today: 3, stock: 8 },
  { id: 'p-lp-02', name: 'Pillow Talk Lipstick',        brand: 'Charlotte Tilbury',    shade: 'Pillow Talk',    area: 'Lips', color: '#C0806A', inKit: 3, today: 2, stock: 6 },
  { id: 'p-lp-03', name: 'Matte Lipstick',              brand: 'MAC',                  shade: 'Ruby Woo',       area: 'Lips', color: '#C03040', inKit: 2, today: 1, stock: 4 },
  { id: 'p-lp-04', name: 'Velvet Matte Lip Pencil',     brand: 'NARS',                 shade: 'Dragon Girl',    area: 'Lips', color: '#B82840', inKit: 1, today: 0, stock: 2 },
  { id: 'p-lp-05', name: 'Lip Glow Oil',                brand: 'Dior',                 shade: 'Natural',        area: 'Lips', color: '#D4907A', inKit: 3, today: 2, stock: 5 },
  { id: 'p-lp-06', name: 'Lip Color Satin',             brand: 'Tom Ford',             shade: 'Scarlet Rouge',  area: 'Lips', color: '#C83040', inKit: 1, today: 0, stock: 2 },
  { id: 'p-lp-07', name: 'Rouge Coco Flash',            brand: 'Chanel',               shade: '54 Boy',         area: 'Lips', color: '#D06050', inKit: 2, today: 1, stock: 4 },
  { id: 'p-lp-08', name: 'Aquaphor Healing Ointment',   brand: 'Aquaphor',             shade: 'Original',       area: 'Lips', color: '#E8DECE', inKit: 6, today: 5, stock: 12 },
  // Brows (5)
  { id: 'p-br-01', name: 'Brow Freeze Styling Wax',     brand: 'Anastasia Beverly Hills', shade: 'Clear',      area: 'Brows',color: '#D4C8B0', inKit: 5, today: 4, stock: 10 },
  { id: 'p-br-02', name: 'Boy Brow',                    brand: 'Glossier',             shade: 'Clear',          area: 'Brows',color: '#C8C0A8', inKit: 4, today: 3, stock: 8 },
  { id: 'p-br-03', name: 'Brow Wiz',                    brand: 'Anastasia Beverly Hills', shade: 'Taupe',      area: 'Brows',color: '#9A8068', inKit: 6, today: 4, stock: 12 },
  { id: 'p-br-04', name: 'Eyebrows Fiber Gel',          brand: 'MAC',                  shade: 'Brunette',       area: 'Brows',color: '#6E5040', inKit: 3, today: 2, stock: 6 },
  { id: 'p-br-05', name: '24-Hr Brow Setter',           brand: 'Benefit',              shade: 'Clear',          area: 'Brows',color: '#E0D8C8', inKit: 4, today: 3, stock: 8 },
  // Tools (5)
  { id: 'p-tl-01', name: 'Beautyblender Original',      brand: 'Beautyblender',        shade: 'Pink',           area: 'Tools',color: '#F0B0B0', inKit: 8, today: 8, stock: 16 },
  { id: 'p-tl-02', name: 'F80 Flat Kabuki Brush',       brand: 'Sigma',                shade: 'Black',          area: 'Tools',color: '#3A3632', inKit: 6, today: 4, stock: 10 },
  { id: 'p-tl-03', name: 'Expert Face Brush',           brand: 'Real Techniques',      shade: 'Rose Gold',      area: 'Tools',color: '#C08070', inKit: 5, today: 4, stock: 9 },
  { id: 'p-tl-04', name: '217S Blending Brush',         brand: 'MAC',                  shade: 'Black',          area: 'Tools',color: '#2E2A26', inKit: 6, today: 5, stock: 11 },
  { id: 'p-tl-05', name: 'Classic Lash Curler',         brand: 'Tweezerman',           shade: 'Silver',         area: 'Tools',color: '#A8A09A', inKit: 4, today: 4, stock: 8 },
]

// ─── Receipts ─────────────────────────────────────────────────────────────────
export const receipts = [
  {
    id: 'rc-1',
    when: 'Apr 28, 11:30 AM',
    vendor: 'Sephora Paris',
    submittedById: 'p15',
    submittedByName: 'Benji Adams',
    for: 'Luminous Silk · Look D',
    amount: 78,
    status: 'submitted',
  },
  {
    id: 'rc-2',
    when: 'Apr 28, 9:15 AM',
    vendor: 'Marionnaud',
    submittedById: 'p1',
    submittedByName: 'Jen Z',
    for: 'Setting powder + primers (30 models)',
    amount: 240,
    status: 'approved',
  },
  {
    id: 'rc-3',
    when: 'Apr 27, 4:00 PM',
    vendor: 'Boots Pharmacy',
    submittedById: 'p18',
    submittedByName: 'Aisha Johnson',
    for: 'Brushes + sponges',
    amount: 123,
    status: 'approved',
  },
]

export const receiptSummary = { spent: 441, budget: 1500, waitingCount: 1 }
