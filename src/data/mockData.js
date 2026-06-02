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
  { id: 'p1',  name: 'Aria Chen',       role: 'lead',      specialty: 'hair',   avatar: 'https://i.pravatar.cc/150?img=47',
    tags: ['Show direction', 'Team coordination', 'Hair + Beauty'] },

  // Artists (10 total)
  { id: 'p2',  name: 'Marcus Lee',      role: 'artist',    specialty: 'makeup', avatar: 'https://i.pravatar.cc/150?img=12',
    tags: ['Editorial makeup', 'Special effects', 'Contouring', 'Avant-garde color', 'Skin prep'] },
  { id: 'p3',  name: 'Zoe Park',        role: 'artist',    specialty: 'makeup', avatar: 'https://i.pravatar.cc/150?img=5',
    tags: ['Runway makeup', 'Period looks', 'Airbrushing', 'Bridal', 'Avant-garde looks'] },
  { id: 'p6',  name: 'David Kim',       role: 'artist',    specialty: 'hair',   avatar: 'https://i.pravatar.cc/150?img=33',
    tags: ['Hair extensions', 'Avant-garde styling', 'Braiding', 'Color work', 'Keratin'] },
  { id: 'p7',  name: 'Priya Osei',      role: 'artist',    specialty: 'hair',   avatar: 'https://i.pravatar.cc/150?img=20',
    tags: ['Natural textures', 'Protective styles', 'Color correction', 'Precision cuts', 'Blowouts'] },
  { id: 'p8',  name: 'Luna Torres',     role: 'artist',    specialty: 'makeup', avatar: 'https://i.pravatar.cc/150?img=38',
    tags: ['Eyebrow bleaching', 'Editorial makeup', 'Avant-garde color', 'Fantasy looks', 'Runway'] },
  { id: 'p11', name: 'Kenji Watanabe',  role: 'artist',    specialty: 'hair',   avatar: 'https://i.pravatar.cc/150?img=66',
    tags: ['Avant-garde cuts', 'Keratin treatments', 'Natural textures', 'Braiding', 'Ombré'] },
  { id: 'p12', name: 'Sofia Reyes',     role: 'artist',    specialty: 'nails',  avatar: 'https://i.pravatar.cc/150?img=68',
    tags: ['Nail art', 'Gel extensions', 'Chrome powder', 'Hand painting', '3D nail art'] },
  { id: 'p13', name: 'Aisha Johnson',   role: 'artist',    specialty: 'makeup', avatar: 'https://i.pravatar.cc/150?img=58',
    tags: ['Skin prep', 'Airbrush', 'Contouring', 'Lash application', 'Film & TV'] },
  { id: 'p14', name: 'Lena Schmidt',    role: 'artist',    specialty: 'hair',   avatar: 'https://i.pravatar.cc/150?img=26',
    tags: ['Updos', 'Vintage styles', 'Extensions', 'Color correction', 'Scalp care'] },
  { id: 'p15', name: 'Mira Patel',      role: 'artist',    specialty: 'nails',  avatar: 'https://i.pravatar.cc/150?img=37',
    tags: ['Nail extensions', 'Acrylic overlays', 'Chrome effects', 'Minimalist design', 'Nail repair'] },

  // Assistants (5 total)
  { id: 'p4',  name: 'Sophia Rivera',   role: 'assistant', trackingState: 'active',                  avatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: 'p5',  name: 'James Kim',       role: 'assistant', trackingState: 'lost', lastSeenMins: 12,  avatar: 'https://i.pravatar.cc/150?img=52' },
  { id: 'p9',  name: 'Cleo Marsh',      role: 'assistant', trackingState: 'active',                  avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 'p10', name: 'Ben Adeyemi',     role: 'assistant', trackingState: 'lost', lastSeenMins: 8,   avatar: 'https://i.pravatar.cc/150?img=57' },
  { id: 'p16', name: 'Nadia Faris',     role: 'assistant', trackingState: 'active',                  avatar: 'https://i.pravatar.cc/150?img=64' },
]

export const team = profiles

export const models = [
  {
    id: 'm1', name: 'Sofia Andersen', lookNumber: '01',
    avatar: 'https://i.pravatar.cc/300?img=44',
    assignedArtists: ['Aria Chen'],
    status: 'needs_revisit',
    notes: 'Allergic to latex gloves.',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=44', uploadedBy: 'Aria Chen', timestamp: '5:12 AM', label: 'Before' },
      { id: 'ph2', url: 'https://i.pravatar.cc/300?img=48', uploadedBy: 'Aria Chen', timestamp: '5:34 AM', label: 'After' },
      { id: 'ph3', url: 'https://i.pravatar.cc/300?img=56', uploadedBy: 'Aria Chen', timestamp: '5:40 AM', label: 'Revisit' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '5:12 AM', updatedBy: 'Aria Chen' },
      { status: 'needs_revisit', timestamp: '5:35 AM', updatedBy: 'Aria Chen' },
    ],
  },
  {
    id: 'm2', name: 'Naomi Williams', lookNumber: '02',
    avatar: 'https://i.pravatar.cc/300?img=25',
    assignedArtists: ['Marcus Lee'],
    status: 'done',
    notes: '',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=25', uploadedBy: 'Marcus Lee', timestamp: '2:10 AM', label: 'Before' },
      { id: 'ph2', url: 'https://i.pravatar.cc/300?img=60', uploadedBy: 'Marcus Lee', timestamp: '2:46 AM', label: 'Done' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:10 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '2:47 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm3', name: 'Irina Volkov', lookNumber: '03',
    avatar: 'https://i.pravatar.cc/300?img=29',
    assignedArtists: ['Aria Chen', 'Zoe Park'],
    status: 'paused',
    notes: 'Requested minimal coverage.',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=29', uploadedBy: 'Zoe Park', timestamp: '2:49 AM', label: 'Before' },
      { id: 'ph2', url: 'https://i.pravatar.cc/300?img=53', uploadedBy: 'Aria Chen', timestamp: '3:05 AM', label: 'Paused' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:49 AM', updatedBy: 'Zoe Park' },
      { status: 'paused', timestamp: '3:06 AM', updatedBy: 'Aria Chen' },
    ],
  },
  {
    id: 'm4', name: 'Chloe Martin', lookNumber: '04',
    avatar: 'https://i.pravatar.cc/300?img=15',
    assignedArtists: ['Marcus Lee'],
    status: 'done',
    notes: '',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=15', uploadedBy: 'Marcus Lee', timestamp: '1:55 AM', label: 'Before' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '1:55 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '2:29 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm5', name: 'Aaliyah Jones', lookNumber: '05',
    avatar: 'https://i.pravatar.cc/300?img=32',
    assignedArtists: ['Sophia Rivera'],
    status: 'done',
    notes: '',
    photos: [],
    statusLog: [
      { status: 'in_progress', timestamp: '2:00 AM', updatedBy: 'Sophia Rivera' },
      { status: 'done', timestamp: '2:34 AM', updatedBy: 'Sophia Rivera' },
    ],
  },
  {
    id: 'm6', name: 'Mei Lin', lookNumber: '06',
    avatar: 'https://i.pravatar.cc/300?img=39',
    assignedArtists: ['Zoe Park'],
    status: 'needs_revisit',
    notes: 'Touch up left brow.',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=39', uploadedBy: 'Zoe Park', timestamp: '2:30 AM', label: 'Before' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:30 AM', updatedBy: 'Zoe Park' },
      { status: 'needs_revisit', timestamp: '3:08 AM', updatedBy: 'Zoe Park' },
    ],
  },
  {
    id: 'm7', name: 'Valentina Cruz', lookNumber: '07',
    avatar: 'https://i.pravatar.cc/300?img=16',
    assignedArtists: ['Aria Chen'],
    status: 'done',
    notes: '',
    photos: [],
    statusLog: [
      { status: 'in_progress', timestamp: '1:50 AM', updatedBy: 'Aria Chen' },
      { status: 'done', timestamp: '2:24 AM', updatedBy: 'Aria Chen' },
    ],
  },
  {
    id: 'm8', name: 'Ingrid Larsen', lookNumber: '08',
    avatar: 'https://i.pravatar.cc/300?img=43',
    assignedArtists: ['Sophia Rivera', 'Marcus Lee'],
    status: 'in_progress',
    notes: '',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=43', uploadedBy: 'Marcus Lee', timestamp: '3:15 AM', label: 'Before' },
      { id: 'ph2', url: 'https://i.pravatar.cc/300?img=62', uploadedBy: 'Sophia Rivera', timestamp: '3:40 AM', label: 'In Progress' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '3:15 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm9', name: 'Priya Sharma', lookNumber: '09',
    avatar: 'https://i.pravatar.cc/300?img=23',
    assignedArtists: ['Zoe Park'],
    status: 'done',
    notes: '',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=23', uploadedBy: 'Zoe Park', timestamp: '2:45 AM', label: 'Before' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '2:45 AM', updatedBy: 'Zoe Park' },
      { status: 'done', timestamp: '3:20 AM', updatedBy: 'Zoe Park' },
    ],
  },
  {
    id: 'm10', name: 'Elena Morozova', lookNumber: '10',
    avatar: 'https://i.pravatar.cc/300?img=49',
    assignedArtists: ['Marcus Lee'],
    status: 'done',
    notes: '',
    photos: [],
    statusLog: [
      { status: 'in_progress', timestamp: '3:30 AM', updatedBy: 'Marcus Lee' },
      { status: 'done', timestamp: '4:05 AM', updatedBy: 'Marcus Lee' },
    ],
  },
  {
    id: 'm11', name: 'Amara Diallo', lookNumber: '11',
    avatar: 'https://i.pravatar.cc/300?img=36',
    assignedArtists: ['Aria Chen'],
    status: 'in_progress',
    notes: '',
    photos: [
      { id: 'ph1', url: 'https://i.pravatar.cc/300?img=36', uploadedBy: 'Aria Chen', timestamp: '4:40 AM', label: 'Before' },
      { id: 'ph2', url: 'https://i.pravatar.cc/300?img=65', uploadedBy: 'Aria Chen', timestamp: '5:02 AM', label: 'In Progress' },
      { id: 'ph3', url: 'https://i.pravatar.cc/300?img=67', uploadedBy: 'Aria Chen', timestamp: '5:18 AM', label: 'Detail' },
    ],
    statusLog: [
      { status: 'in_progress', timestamp: '4:40 AM', updatedBy: 'Aria Chen' },
    ],
  },
  {
    id: 'm12', name: 'Hana Tanaka', lookNumber: '12',
    avatar: 'https://i.pravatar.cc/300?img=21',
    assignedArtists: ['Sophia Rivera'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  // New models 13–25
  {
    id: 'm13', name: 'Camille Dubois', lookNumber: '13',
    avatar: 'https://i.pravatar.cc/300?img=40',
    assignedArtists: ['Kenji Watanabe'],
    status: 'done',
    notes: '',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=40', uploadedBy: 'Kenji Watanabe', timestamp: '3:00 AM', label: 'Before' },
              { id: 'ph2', url: 'https://i.pravatar.cc/300?img=41', uploadedBy: 'Kenji Watanabe', timestamp: '3:45 AM', label: 'Done' }],
    statusLog: [{ status: 'in_progress', timestamp: '3:00 AM', updatedBy: 'Kenji Watanabe' }, { status: 'done', timestamp: '3:46 AM', updatedBy: 'Kenji Watanabe' }],
  },
  {
    id: 'm14', name: 'Ingrid Strand', lookNumber: '14',
    avatar: 'https://i.pravatar.cc/300?img=42',
    assignedArtists: ['Aisha Johnson'],
    status: 'in_progress',
    notes: '',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=42', uploadedBy: 'Aisha Johnson', timestamp: '4:10 AM', label: 'Before' }],
    statusLog: [{ status: 'in_progress', timestamp: '4:10 AM', updatedBy: 'Aisha Johnson' }],
  },
  {
    id: 'm15', name: 'Yuki Nakamura', lookNumber: '15',
    avatar: 'https://i.pravatar.cc/300?img=45',
    assignedArtists: ['Kenji Watanabe'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm16', name: 'Fatima Hassan', lookNumber: '16',
    avatar: 'https://i.pravatar.cc/300?img=46',
    assignedArtists: ['Lena Schmidt', 'Aisha Johnson'],
    status: 'done',
    notes: '',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=46', uploadedBy: 'Lena Schmidt', timestamp: '2:20 AM', label: 'Before' }],
    statusLog: [{ status: 'in_progress', timestamp: '2:20 AM', updatedBy: 'Lena Schmidt' }, { status: 'done', timestamp: '3:05 AM', updatedBy: 'Aisha Johnson' }],
  },
  {
    id: 'm17', name: 'Claudia Ferretti', lookNumber: '17',
    avatar: 'https://i.pravatar.cc/300?img=50',
    assignedArtists: ['Sofia Reyes', 'Zoe Park'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm18', name: 'Soo-Yeon Park', lookNumber: '18',
    avatar: 'https://i.pravatar.cc/300?img=51',
    assignedArtists: ['Lena Schmidt'],
    status: 'in_progress',
    notes: '',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=51', uploadedBy: 'Lena Schmidt', timestamp: '4:30 AM', label: 'Before' }],
    statusLog: [{ status: 'in_progress', timestamp: '4:30 AM', updatedBy: 'Lena Schmidt' }],
  },
  {
    id: 'm19', name: 'Amara Okafor', lookNumber: '19',
    avatar: 'https://i.pravatar.cc/300?img=54',
    assignedArtists: ['Mira Patel', 'Marcus Lee'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm20', name: 'Bianca Reuter', lookNumber: '20',
    avatar: 'https://i.pravatar.cc/300?img=55',
    assignedArtists: ['Kenji Watanabe', 'Luna Torres'],
    status: 'paused',
    notes: 'Waiting on stylist.',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=55', uploadedBy: 'Luna Torres', timestamp: '4:50 AM', label: 'In Progress' }],
    statusLog: [{ status: 'in_progress', timestamp: '4:50 AM', updatedBy: 'Luna Torres' }, { status: 'paused', timestamp: '5:10 AM', updatedBy: 'Luna Torres' }],
  },
  {
    id: 'm21', name: 'Astrid Lindqvist', lookNumber: '21',
    avatar: 'https://i.pravatar.cc/300?img=59',
    assignedArtists: ['Aisha Johnson'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm22', name: 'Leila Nasser', lookNumber: '22',
    avatar: 'https://i.pravatar.cc/300?img=61',
    assignedArtists: ['Mira Patel', 'Priya Osei'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm23', name: 'Rina Yamamoto', lookNumber: '23',
    avatar: 'https://i.pravatar.cc/300?img=63',
    assignedArtists: ['Lena Schmidt'],
    status: 'needs_revisit',
    notes: 'Root touchup needed.',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=63', uploadedBy: 'Lena Schmidt', timestamp: '5:00 AM', label: 'Before' }],
    statusLog: [{ status: 'in_progress', timestamp: '5:00 AM', updatedBy: 'Lena Schmidt' }, { status: 'needs_revisit', timestamp: '5:25 AM', updatedBy: 'Lena Schmidt' }],
  },
  {
    id: 'm24', name: 'Beatrice Fontaine', lookNumber: '24',
    avatar: 'https://i.pravatar.cc/300?img=69',
    assignedArtists: ['Sofia Reyes', 'David Kim'],
    status: 'not_started',
    notes: '',
    photos: [],
    statusLog: [],
  },
  {
    id: 'm25', name: 'Zara Osei', lookNumber: '25',
    avatar: 'https://i.pravatar.cc/300?img=41',
    assignedArtists: ['Aisha Johnson', 'Mira Patel'],
    status: 'done',
    notes: '',
    photos: [{ id: 'ph1', url: 'https://i.pravatar.cc/300?img=41', uploadedBy: 'Aisha Johnson', timestamp: '2:10 AM', label: 'Before' },
              { id: 'ph2', url: 'https://i.pravatar.cc/300?img=40', uploadedBy: 'Mira Patel', timestamp: '2:55 AM', label: 'Done' }],
    statusLog: [{ status: 'in_progress', timestamp: '2:10 AM', updatedBy: 'Aisha Johnson' }, { status: 'done', timestamp: '2:56 AM', updatedBy: 'Mira Patel' }],
  },
]

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
  { id: 'n1', text: 'Aria Chen marked Sofia Andersen as Needs Revisit', status: 'needs_revisit', timestamp: '5:35 AM', read: false },
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
