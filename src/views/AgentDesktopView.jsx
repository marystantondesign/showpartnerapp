import { useState } from 'react'

// ─── Demo phases ───────────────────────────────────────────────────────────────
const DEMO_PHASES = ['PRE-SHOW', 'DAY-OF', 'POST-SHOW']

// ─── Shows ─────────────────────────────────────────────────────────────────────
const BASE_SHOWS = [
  {
    id: 'vs26',
    name: 'Valentino SS26',
    date: 'Today — June 1, 2026',
    venue: '8 Place de la Bourse',
    city: 'Paris',
    artistCount: 6,
    baseStatus: 'active',
    callTime: '5:00 AM',
    showtime: '6:00 PM',
    client: 'Valentino',
  },
  {
    id: 'pr27',
    name: 'Prada Resort 27',
    date: 'June 15, 2026',
    venue: 'Fondazione Prada',
    city: 'Milan',
    artistCount: 4,
    baseStatus: 'upcoming',
    callTime: '6:00 AM',
    showtime: '2:00 PM',
    client: 'Prada',
  },
  {
    id: 'jlp',
    name: 'Jacquemus Le Printemps',
    date: 'May 25, 2026',
    venue: 'Domaine du Château Estoublon',
    city: 'Provence',
    artistCount: 5,
    baseStatus: 'completed',
    callTime: '8:00 AM',
    showtime: '4:00 PM',
    client: 'Jacquemus',
  },
]

// ─── Valentino SS26 artists ────────────────────────────────────────────────────
const VS26_ARTISTS = [
  { id: 'a1', name: 'Marcus Lee',  specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=12', onSiteStatus: 'late',    confirmed: 'CONFIRMED', modelsCompleted: 3, stars: 3, incidents: ['Arrived 45 minutes late to call time'], note: '',    inviteBack: true  },
  { id: 'a2', name: 'Zoe Park',    specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=5',  onSiteStatus: 'on-site', confirmed: 'CONFIRMED', modelsCompleted: 4, stars: 5, incidents: [],                                                  note: '',    inviteBack: true  },
  { id: 'a3', name: 'David Kim',   specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=33', onSiteStatus: 'on-site', confirmed: 'CONFIRMED', modelsCompleted: 3, stars: 4, incidents: [],                                                  note: '',    inviteBack: true  },
  { id: 'a4', name: 'Priya Osei',  specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=20', onSiteStatus: 'on-site', confirmed: 'CONFIRMED', modelsCompleted: 2, stars: 2, incidents: ['Left 20 minutes before show ended without checking out'], note: '', inviteBack: false },
  { id: 'a5', name: 'Luna Torres', specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=38', onSiteStatus: 'on-site', confirmed: 'CONFIRMED', modelsCompleted: 3, stars: 5, incidents: [],                                                  note: 'Excellent, would request specifically again', inviteBack: true },
  { id: 'a6', name: 'Aria Chen',   specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=47', onSiteStatus: 'on-site', confirmed: 'CONFIRMED', modelsCompleted: 4, stars: 4, incidents: [],                                                  note: '',    inviteBack: true  },
]

// ─── Prada Resort 27 artists (pre-show) ────────────────────────────────────────
const PRADA_ARTISTS = [
  { id: 'p1', name: 'Marcus Lee',  specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=12', confirmed: 'CONFIRMED' },
  { id: 'p2', name: 'Zoe Park',    specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=5',  confirmed: 'CONFIRMED' },
  { id: 'p3', name: 'David Kim',   specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=33', confirmed: 'PENDING'   },
  { id: 'p4', name: 'Priya Osei',  specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=20', confirmed: 'PENDING'   },
]

// ─── Jacquemus artists (post-show) ────────────────────────────────────────────
const JACQ_ARTISTS = [
  { id: 'j1', name: 'Zoe Park',   specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=5',  modelsCompleted: 5, stars: 5, incidents: [], note: 'Flawless execution throughout',   inviteBack: true  },
  { id: 'j2', name: 'Priya Osei', specialty: 'Hair',   avatar: 'https://i.pravatar.cc/150?img=20', modelsCompleted: 4, stars: 4, incidents: [], note: 'Reliable, good communication',    inviteBack: true  },
  { id: 'j3', name: 'Luna Torres',specialty: 'Makeup', avatar: 'https://i.pravatar.cc/150?img=38', modelsCompleted: 3, stars: 5, incidents: [], note: 'Standout performance',             inviteBack: true  },
]

// ─── VS26 receipts ─────────────────────────────────────────────────────────────
const VS26_RECEIPTS = [
  { category: 'Products',        items: [{ desc: 'Hair extensions', artist: 'Marcus Lee', amount: 7500 }, { desc: 'Setting spray (3 units)', artist: 'Zoe Park', amount: 84 }] },
  { category: 'Transportation',  items: [{ desc: 'Car service to venue', artist: 'David Kim', amount: 120 }] },
  { category: 'Meals',           items: [{ desc: 'Craft services contribution', artist: 'Luna Torres', amount: 45 }] },
]

// ─── Jacquemus receipts ───────────────────────────────────────────────────────
const JACQ_RECEIPTS = [
  { category: 'Products',       items: [{ desc: 'Biodegradable packaging supplies', artist: 'Zoe Park', amount: 320 }] },
  { category: 'Transportation', items: [{ desc: 'Train Paris + taxi', artist: 'Priya Osei', amount: 180 }] },
  { category: 'Meals',          items: [{ desc: 'Lunch for team (5)', artist: 'Luna Torres', amount: 210 }] },
]

// ─── Prada budget ─────────────────────────────────────────────────────────────
const PRADA_BUDGET = [
  { desc: 'Hair Extensions',  budgeted: 6000, actual: 7500 },
  { desc: 'Setting Spray',    budgeted: 100,  actual: 84   },
  { desc: 'Artist Fees',      budgeted: 12000, actual: null },
  { desc: 'Transportation',   budgeted: 500,  actual: null  },
  { desc: 'Craft Services',   budgeted: 300,  actual: null  },
]

// ─── Initial incidents ─────────────────────────────────────────────────────────
const INIT_INCIDENTS = [
  { id: 'i1', artist: 'Marcus Lee',  type: 'Late Arrival', notes: 'Arrived 45 minutes late to call time', time: '5:45 AM' },
  { id: 'i2', artist: 'Priya Osei', type: 'Left Early',   notes: 'Left 20 minutes before show ended without checking out', time: '7:40 PM' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) { return `$${n.toLocaleString()}` }

function Stars({ n, size = 13 }) {
  return <span style={{ fontSize: size, letterSpacing: 2, color: '#D4A853' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

function StatusPill({ status }) {
  const map = { active: ['#D4A853', 'DAY OF'], upcoming: ['#8A9BB0', 'UPCOMING'], completed: ['#7A9E7E', 'COMPLETED'] }
  const [bg, label] = map[status] || ['#C8C4BF', status.toUpperCase()]
  return (
    <span style={{ backgroundColor: bg, borderRadius: 20, padding: '3px 10px', fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', fontWeight: 600 }}>
      {label}
    </span>
  )
}

function ConfirmPill({ status }) {
  const map = { CONFIRMED: '#7A9E7E', PENDING: '#D4A853', DECLINED: '#C4614A' }
  return (
    <span style={{ backgroundColor: map[status] || '#C8C4BF', borderRadius: 20, padding: '2px 8px', fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', color: '#111', fontWeight: 600 }}>
      {status}
    </span>
  )
}

function SectionLabel({ children, dark }) {
  return <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888580', fontWeight: 600 }}>{children}</p>
}

function Card({ children, dark, style = {} }) {
  return (
    <div style={{
      backgroundColor: dark ? '#242220' : '#fff',
      borderRadius: 10,
      padding: '20px 24px',
      boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 8px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Show detail sub-views ─────────────────────────────────────────────────────

function PreShowDetail({ show, artists, budget, dark }) {
  const [tab, setTab] = useState('info')
  const [info, setInfo] = useState({ name: show.name, date: show.date, venue: show.venue, callTime: show.callTime, showtime: show.showtime })
  const text = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  const tabStyle = (t) => ({
    fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: tab === t ? text : muted,
    background: 'none', border: 'none',
    borderBottom: tab === t ? `1.5px solid ${text}` : '1.5px solid transparent',
    padding: '8px 0', marginRight: 28, cursor: 'pointer', outline: 'none',
  })

  const inputStyle = {
    fontFamily: 'Inter, system-ui', fontSize: 13, color: text, background: 'transparent',
    border: 'none', borderBottom: `1px solid ${border}`, outline: 'none',
    padding: '4px 0', width: '100%', marginBottom: 16,
  }

  return (
    <div>
      {/* Sub-tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, marginBottom: 28 }}>
        {['info', 'roster', 'documents', 'budget'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'info' ? 'Show Info' : t === 'roster' ? 'Artist Roster' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <Card dark={dark} style={{ maxWidth: 520 }}>
          <SectionLabel dark={dark}>Show Information</SectionLabel>
          {[['Show Name', 'name'], ['Date', 'date'], ['Venue', 'venue'], ['Call Time', 'callTime'], ['Showtime', 'showtime']].map(([label, key]) => (
            <div key={key}>
              <p style={{ margin: '0 0 2px', fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{label}</p>
              <input value={info[key]} onChange={e => setInfo(i => ({ ...i, [key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
        </Card>
      )}

      {tab === 'roster' && (
        <div>
          {artists.map(a => (
            <Card key={a.id} dark={dark} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <img src={a.avatar} alt={a.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 16, color: text }}>{a.name}</p>
                <p style={{ margin: '2px 0 0', fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{a.specialty}</p>
              </div>
              <ConfirmPill status={a.confirmed} />
            </Card>
          ))}
          <button style={{ marginTop: 8, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: text, border: `1px solid ${border}`, borderRadius: 6, padding: '9px 16px', background: 'none', cursor: 'pointer', outline: 'none' }}>
            + ADD ARTIST
          </button>
        </div>
      )}

      {tab === 'documents' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, maxWidth: 680 }}>
          {['Call Sheet', 'Running Order', 'Face Charts'].map(doc => (
            <Card key={doc} dark={dark} style={{ textAlign: 'center', padding: '32px 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.2" strokeLinecap="round" style={{ marginBottom: 12 }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 11, color: text }}>{doc}</p>
              <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>No file uploaded</p>
              <label style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: text, border: `1px solid ${border}`, borderRadius: 5, padding: '6px 12px', cursor: 'pointer' }}>
                UPLOAD<input type="file" style={{ display: 'none' }} />
              </label>
            </Card>
          ))}
        </div>
      )}

      {tab === 'budget' && (
        <Card dark={dark} style={{ maxWidth: 600 }}>
          <SectionLabel dark={dark}>Budget Overview</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '8px 16px', marginBottom: 8 }}>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Item</p>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, textAlign: 'right' }}>Budgeted</p>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, textAlign: 'right' }}>Actual</p>
          </div>
          <div style={{ height: 1, backgroundColor: border, marginBottom: 12 }} />
          {budget.map((row, i) => {
            const over = row.actual && row.actual > row.budgeted
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '8px 16px', padding: '10px 0', borderBottom: i < budget.length - 1 ? `1px solid ${border}` : 'none' }}>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text }}>{row.desc}</p>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text, textAlign: 'right' }}>{fmt(row.budgeted)}</p>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, textAlign: 'right', color: over ? '#C4614A' : row.actual ? '#7A9E7E' : muted, fontWeight: over ? 500 : 400 }}>
                  {row.actual ? fmt(row.actual) : '—'}
                </p>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}

function DayOfDetail({ show, artists, incidents, onFlagIncident, dark }) {
  const text = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  const statusDot = { 'on-site': '#7A9E7E', late: '#D4A853', 'no-show': '#C4614A' }
  const statusLabel = { 'on-site': 'On site', late: 'Late', 'no-show': 'No show' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 20, color: text }}>Artist Status Board</p>
        <button
          onClick={onFlagIncident}
          style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', backgroundColor: '#C4614A', border: 'none', borderRadius: 6, padding: '10px 18px', cursor: 'pointer', outline: 'none', fontWeight: 500 }}
        >
          FLAG INCIDENT
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {artists.map(a => (
          <Card key={a.id} dark={dark} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={a.avatar} alt={a.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text, fontWeight: 500 }}>{a.name}</p>
              <p style={{ margin: '2px 0 6px', fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: muted }}>{a.specialty}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusDot[a.onSiteStatus] || '#888580', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, system-ui', fontSize: 10, color: statusDot[a.onSiteStatus] || muted }}>{statusLabel[a.onSiteStatus] || a.onSiteStatus}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ height: 1, backgroundColor: border, marginBottom: 24 }} />
      <p style={{ margin: '0 0 16px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>INCIDENT LOG</p>
      {incidents.length === 0 ? (
        <p style={{ fontFamily: 'Inter, system-ui', fontSize: 13, color: muted }}>No incidents logged.</p>
      ) : incidents.map((inc, i) => (
        <Card key={i} dark={dark} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 10, borderLeft: '2px solid #C4614A', borderRadius: '0 10px 10px 0' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, fontWeight: 500, color: text }}>{inc.artist}</p>
              <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C4614A' }}>{inc.type}</span>
            </div>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, color: muted, lineHeight: 1.5 }}>{inc.notes}</p>
          </div>
          <span style={{ fontFamily: 'Inter, system-ui', fontSize: 10, color: muted, whiteSpace: 'nowrap', flexShrink: 0 }}>{inc.time}</span>
        </Card>
      ))}
    </div>
  )
}

function WrapDetail({ show, artists, receipts, dark }) {
  const [notes, setNotes] = useState(Object.fromEntries(artists.map(a => [a.id, a.note])))
  const [inviteBack, setInviteBack] = useState(Object.fromEntries(artists.map(a => [a.id, a.inviteBack])))
  const text = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  const totalReceipts = receipts.reduce((sum, cat) => sum + cat.items.reduce((s, i) => s + i.amount, 0), 0)
  const totalModels = artists.reduce((s, a) => s + a.modelsCompleted, 0)
  const totalIncidents = artists.reduce((s, a) => s + a.incidents.length, 0)

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          ['Total Artists', artists.length],
          ['Models Completed', totalModels],
          ['Incidents', totalIncidents],
          ['Total Spend', fmt(totalReceipts)],
        ].map(([label, val]) => (
          <Card key={label} dark={dark} style={{ textAlign: 'center', padding: '20px 16px' }}>
            <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontSize: 28, color: text, lineHeight: 1 }}>{val}</p>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>{label}</p>
          </Card>
        ))}
      </div>

      {/* Per-artist rows */}
      <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>ARTIST REVIEWS</p>
      {artists.map(a => (
        <Card key={a.id} dark={dark} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <img src={a.avatar} alt={a.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 16, color: text }}>{a.name}</p>
                <Stars n={a.stars} />
                <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{a.specialty}</span>
              </div>
              <p style={{ margin: '0 0 8px', fontFamily: 'Inter, system-ui', fontSize: 11, color: muted }}>{a.modelsCompleted} model{a.modelsCompleted !== 1 ? 's' : ''} completed{a.incidents.length ? ` · ${a.incidents.length} incident${a.incidents.length !== 1 ? 's' : ''}` : ''}</p>
              {a.incidents.map((inc, i) => (
                <p key={i} style={{ margin: '0 0 6px', fontFamily: 'Inter, system-ui', fontSize: 11, color: '#C4614A', paddingLeft: 10, borderLeft: '2px solid #C4614A' }}>{inc}</p>
              ))}
              <textarea
                value={notes[a.id]}
                onChange={e => setNotes(n => ({ ...n, [a.id]: e.target.value }))}
                placeholder="Performance notes…"
                rows={2}
                style={{ width: '100%', fontFamily: 'Inter, system-ui', fontSize: 12, color: text, background: 'transparent', border: 'none', borderBottom: `1px solid ${border}`, outline: 'none', resize: 'none', padding: '4px 0', marginTop: 6, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <p style={{ margin: '0 0 6px', fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>INVITE BACK</p>
              <button
                onClick={() => setInviteBack(ib => ({ ...ib, [a.id]: !ib[a.id] }))}
                style={{
                  fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: inviteBack[a.id] ? '#111' : text,
                  backgroundColor: inviteBack[a.id] ? '#7A9E7E' : 'transparent',
                  border: `1px solid ${inviteBack[a.id] ? '#7A9E7E' : border}`,
                  borderRadius: 20, padding: '5px 12px', cursor: 'pointer', outline: 'none',
                  transition: 'all 150ms ease',
                }}
              >
                {inviteBack[a.id] ? 'YES' : 'NO'}
              </button>
            </div>
          </div>
        </Card>
      ))}

      {/* Receipts */}
      <div style={{ marginTop: 40 }}>
        <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>RECEIPTS & SUPPLIES</p>
        {receipts.map(cat => (
          <Card key={cat.category} dark={dark} style={{ marginBottom: 12 }}>
            <p style={{ margin: '0 0 14px', fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>{cat.category}</p>
            {cat.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < cat.items.length - 1 ? `1px solid ${border}` : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text }}>{item.desc}</p>
                  <p style={{ margin: '2px 0 0', fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>{item.artist}</p>
                </div>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 16, color: text }}>{fmt(item.amount)}</p>
              </div>
            ))}
          </Card>
        ))}
        <Card dark={dark} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Total</p>
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 24, color: text }}>{fmt(totalReceipts)}</p>
        </Card>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => window.print()}
          style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: text, border: `1px solid ${border}`, borderRadius: 6, padding: '11px 22px', background: 'none', cursor: 'pointer', outline: 'none' }}
        >
          EXPORT FOR INVOICE
        </button>
      </div>
    </div>
  )
}

// ─── Incident modal ─────────────────────────────────────────────────────────────
function IncidentModal({ artists, onSubmit, onClose, dark }) {
  const [artist, setArtist] = useState(artists[0]?.name || '')
  const [type, setType] = useState('No Show')
  const [notes, setNotes] = useState('')
  const text = dark ? '#F0EDE8' : '#111'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const card = dark ? '#242220' : '#fff'
  const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const fieldStyle = {
    fontFamily: 'Inter, system-ui', fontSize: 13, color: text, background: 'transparent',
    border: `1px solid ${border}`, borderRadius: 6, padding: '9px 12px', width: '100%',
    outline: 'none', boxSizing: 'border-box', marginBottom: 14,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: card, borderRadius: 12, padding: 32, width: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <p style={{ margin: '0 0 24px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888580' }}>FLAG INCIDENT</p>
        <select value={artist} onChange={e => setArtist(e.target.value)} style={fieldStyle}>
          {artists.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={fieldStyle}>
          {['No Show', 'Left Early', 'Dismissed', 'Medical', 'Other'].map(t => <option key={t}>{t}</option>)}
        </select>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add notes…"
          rows={4}
          style={{ ...fieldStyle, resize: 'none', marginBottom: 8 }}
        />
        <p style={{ margin: '0 0 20px', fontFamily: 'Inter, system-ui', fontSize: 10, color: '#888580' }}>Logged: {timestamp}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onSubmit({ artist, type, notes, time: timestamp })} style={{ flex: 1, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', backgroundColor: '#C4614A', border: 'none', borderRadius: 6, padding: 12, cursor: 'pointer', outline: 'none', fontWeight: 500 }}>
            SUBMIT
          </button>
          <button onClick={onClose} style={{ flex: 1, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: text, border: `1px solid ${border}`, borderRadius: 6, padding: 12, background: 'none', cursor: 'pointer', outline: 'none' }}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function AgentDesktopView({ dark, onToggleDark, onLogOut }) {
  const [nav, setNav] = useState('shows')
  const [demoPhaseIdx, setDemoPhaseIdx] = useState(1) // default: DAY-OF
  const [selectedShow, setSelectedShow] = useState(null)
  const [showFilter, setShowFilter] = useState('all')
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)
  const [incidents, setIncidents] = useState(INIT_INCIDENTS)

  const demoPhase = DEMO_PHASES[demoPhaseIdx]

  function getShowStatus(show) {
    if (show.id === 'vs26') {
      if (demoPhaseIdx === 0) return 'upcoming'
      if (demoPhaseIdx === 1) return 'active'
      return 'completed'
    }
    return show.baseStatus
  }

  function cycleDemoPhase(dir) {
    setDemoPhaseIdx(i => (i + dir + 3) % 3)
    setSelectedShow(null)
  }

  const bg = dark ? '#1A1816' : '#F5F2EE'
  const sidebar = dark ? '#111110' : '#F5F2EE'
  const text = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const card = dark ? '#242220' : '#fff'

  const DEMO_BAR_H = 36
  const SIDEBAR_W  = 220

  const filteredShows = BASE_SHOWS.filter(s =>
    showFilter === 'all' || getShowStatus(s) === showFilter
  )

  // ── Render show detail ─────────────────────────────────────────────────────
  function renderShowDetail(show) {
    const status = getShowStatus(show)

    // Which phase to display — VS26 follows demoPhase, others follow baseStatus
    let phase = status === 'upcoming' ? 'pre' : status === 'active' ? 'day' : 'wrap'

    return (
      <div>
        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <button
            onClick={() => setSelectedShow(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', color: muted, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Shows
          </button>
          <div style={{ width: 1, height: 16, backgroundColor: border }} />
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 20, color: text }}>{show.name}</p>
          <StatusPill status={status} />
        </div>

        {phase === 'pre'  && <PreShowDetail show={show} artists={show.id === 'pr27' ? PRADA_ARTISTS : []} budget={show.id === 'pr27' ? PRADA_BUDGET : []} dark={dark} />}
        {phase === 'day'  && <DayOfDetail   show={show} artists={VS26_ARTISTS} incidents={incidents} onFlagIncident={() => setIncidentModalOpen(true)} dark={dark} />}
        {phase === 'wrap' && <WrapDetail    show={show} artists={show.id === 'jlp' ? JACQ_ARTISTS : VS26_ARTISTS} receipts={show.id === 'jlp' ? JACQ_RECEIPTS : VS26_RECEIPTS} dark={dark} />}
      </div>
    )
  }

  // ── Render shows list ──────────────────────────────────────────────────────
  function renderShows() {
    const filterBtnStyle = (f) => ({
      fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
      color: showFilter === f ? text : muted,
      background: 'none', border: 'none',
      borderBottom: showFilter === f ? `1.5px solid ${text}` : '1.5px solid transparent',
      padding: '8px 0', marginRight: 24, cursor: 'pointer', outline: 'none',
    })

    return (
      <div>
        {/* Filters */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, marginBottom: 28 }}>
          {['all', 'upcoming', 'active', 'completed'].map(f => (
            <button key={f} style={filterBtnStyle(f)} onClick={() => setShowFilter(f)}>
              {f === 'all' ? 'All Shows' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredShows.map(show => {
          const status = getShowStatus(show)
          return (
            <div key={show.id} style={{
              backgroundColor: card, borderRadius: 10, padding: '20px 24px', marginBottom: 12,
              boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 8px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontSize: 22, color: text }}>{show.name}</p>
                <p style={{ margin: '0 0 10px', fontFamily: 'Inter, system-ui', fontSize: 11, color: muted }}>
                  {show.date} · {show.venue} · {show.city}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <StatusPill status={status} />
                  <span style={{ fontFamily: 'Inter, system-ui', fontSize: 11, color: muted }}>{show.artistCount} artists</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedShow(show)}
                style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: text, border: `1px solid ${border}`, borderRadius: 6, padding: '10px 20px', background: 'none', cursor: 'pointer', outline: 'none', flexShrink: 0 }}
              >
                OPEN
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  const NAV_ITEMS = [
    { id: 'shows', label: 'SHOWS' },
    { id: 'artists', label: 'ARTISTS' },
    { id: 'emergency', label: 'EMERGENCY BOARD' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', backgroundColor: bg }}>

      {/* ── Demo mode bar ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: DEMO_BAR_H,
        backgroundColor: '#EDE9E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', zIndex: 300, borderBottom: '0.5px solid #D8D4CF',
      }}>
        <span style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888580' }}>DEMO MODE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => cycleDemoPhase(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', color: '#888580', padding: '0 4px', fontSize: 14 }}>‹</button>
          <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111' }}>
            Viewing: <strong>{demoPhase}</strong>
          </span>
          <button onClick={() => cycleDemoPhase(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', color: '#888580', padding: '0 4px', fontSize: 14 }}>›</button>
        </div>
        <span style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580' }}>
          Valentino SS26 reflects selected phase
        </span>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: DEMO_BAR_H, left: 0, bottom: 0, width: SIDEBAR_W,
        backgroundColor: sidebar, borderRight: `0.5px solid ${border}`,
        display: 'flex', flexDirection: 'column', zIndex: 100,
      }}>
        {/* Branding */}
        <div style={{ padding: '28px 20px 20px', borderBottom: `0.5px solid ${border}` }}>
          <p style={{ margin: '0 0 14px', fontFamily: 'Georgia, serif', fontSize: 18, color: text, lineHeight: 1 }}>Show Partner</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://i.pravatar.cc/150?img=47" alt="Alexis" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, fontWeight: 500, color: text }}>Alexis Monroe</p>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>AGENT</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = nav === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setNav(item.id); setSelectedShow(null) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '11px 20px',
                  fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isActive ? text : muted,
                  background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
                  borderLeft: isActive ? `2px solid ${text}` : '2px solid transparent',
                  transition: 'color 150ms ease, border-color 150ms ease',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: dark mode + logout */}
        <div style={{ padding: '16px 20px', borderTop: `0.5px solid ${border}` }}>
          <button
            onClick={onToggleDark}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', outline: 'none', marginBottom: 12, padding: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5" strokeLinecap="round">
              {dark
                ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
                : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              }
            </svg>
            <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button
            onClick={onLogOut}
            style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ marginLeft: SIDEBAR_W, paddingTop: DEMO_BAR_H, minHeight: '100vh' }}>
        <div style={{ padding: 40, maxWidth: 900 }}>
          {nav === 'shows' && (
            <>
              {!selectedShow ? (
                <>
                  <p style={{ margin: '0 0 24px', fontFamily: 'Georgia, serif', fontSize: 28, color: text }}>Shows</p>
                  {renderShows()}
                </>
              ) : renderShowDetail(selectedShow)}
            </>
          )}

          {nav === 'artists' && (
            <div>
              <p style={{ margin: '0 0 24px', fontFamily: 'Georgia, serif', fontSize: 28, color: text }}>Artists</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {VS26_ARTISTS.map(a => (
                  <Card key={a.id} dark={dark} style={{ textAlign: 'center', padding: '24px 20px' }}>
                    <img src={a.avatar} alt={a.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
                    <p style={{ margin: '0 0 3px', fontFamily: 'Georgia, serif', fontSize: 15, color: text }}>{a.name}</p>
                    <p style={{ margin: '0 0 8px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{a.specialty}</p>
                    <Stars n={a.stars} size={12} />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {nav === 'emergency' && (
            <div>
              <p style={{ margin: '0 0 8px', fontFamily: 'Georgia, serif', fontSize: 28, color: text }}>Emergency Board</p>
              <p style={{ margin: '0 0 28px', fontFamily: 'Inter, system-ui', fontSize: 12, color: muted }}>Active incidents across all shows</p>
              {incidents.length === 0 ? (
                <p style={{ fontFamily: 'Inter, system-ui', fontSize: 13, color: muted }}>No active incidents. All clear.</p>
              ) : incidents.map((inc, i) => (
                <Card key={i} dark={dark} style={{ marginBottom: 12, borderLeft: '2px solid #C4614A', borderRadius: '0 10px 10px 0', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 4, alignItems: 'center' }}>
                      <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, fontWeight: 500, color: text }}>{inc.artist}</p>
                      <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C4614A' }}>{inc.type}</span>
                      <span style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.06em', color: muted }}>Valentino SS26</span>
                    </div>
                    <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, color: muted, lineHeight: 1.5 }}>{inc.notes}</p>
                  </div>
                  <span style={{ fontFamily: 'Inter, system-ui', fontSize: 10, color: muted, whiteSpace: 'nowrap' }}>{inc.time}</span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Incident modal ───────────────────────────────────────────────────── */}
      {incidentModalOpen && (
        <IncidentModal
          artists={VS26_ARTISTS}
          dark={dark}
          onClose={() => setIncidentModalOpen(false)}
          onSubmit={(inc) => {
            setIncidents(prev => [{ ...inc, id: Date.now() }, ...prev])
            setIncidentModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
