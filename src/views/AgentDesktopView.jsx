import { useState, useEffect, useRef } from 'react'
import { AGENT_ARTISTS } from '../data/agentArtists'

// ─── Unlock body scroll for desktop agent view ────────────────────────────────
function useBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }
  }, [])
}

// ─── Demo phases ──────────────────────────────────────────────────────────────
const DEMO_PHASES = ['PRE-SHOW', 'DAY-OF', 'POST-SHOW']

// ─── Shows ───────────────────────────────────────────────────────────────────
const BASE_SHOWS = [
  { id: 'vs26', name: 'Valentino SS26', date: 'Today — June 1, 2026',   venue: '8 Place de la Bourse', city: 'Paris',    artistCount: 6,  baseStatus: 'active',    callTime: '5:00 AM', showtime: '6:00 PM', client: 'Valentino' },
  { id: 'pr27', name: 'Prada Resort 27', date: 'June 15, 2026',          venue: 'Fondazione Prada',    city: 'Milan',    artistCount: 10, baseStatus: 'upcoming',  callTime: '6:00 AM', showtime: '2:00 PM', client: 'Prada'     },
  { id: 'jlp',  name: 'Jacquemus Le Printemps', date: 'May 25, 2026',    venue: 'Domaine du Château Estoublon', city: 'Provence', artistCount: 5, baseStatus: 'completed', callTime: '8:00 AM', showtime: '4:00 PM', client: 'Jacquemus' },
]

// ─── VS26 artists ─────────────────────────────────────────────────────────────
const VS26_ARTISTS = [
  { id:'a1', name:'Marcus Lee',  specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=12', onSiteStatus:'late',    confirmed:'CONFIRMED', modelsCompleted:3, stars:3, incidents:['Arrived 45 minutes late to call time'], note:'', inviteBack:'YES'   },
  { id:'a2', name:'Zoe Park',    specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=5',  onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:4, stars:5, incidents:[],                                          note:'', inviteBack:'YES'   },
  { id:'a3', name:'David Kim',   specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=33', onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:3, stars:4, incidents:[],                                          note:'', inviteBack:'YES'   },
  { id:'a4', name:'Priya Osei',  specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=20', onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:2, stars:2, incidents:['Left 20 minutes before show ended'],       note:'', inviteBack:'NO'    },
  { id:'a5', name:'Luna Torres', specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=38', onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:3, stars:5, incidents:[],                                          note:'Excellent — request specifically again', inviteBack:'YES' },
  { id:'a6', name:'Jen Z',   specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=47', onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:4, stars:4, incidents:[],                                          note:'', inviteBack:'YES'   },
]

// ─── Prada artist roster (10) ─────────────────────────────────────────────────
const PRADA_ARTISTS = [
  { id:'p1',  name:'Marcus Lee',           specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=12', confirmed:'CONFIRMED' },
  { id:'p2',  name:'Zoe Park',             specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=5',  confirmed:'CONFIRMED' },
  { id:'p3',  name:'David Kim',            specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=33', confirmed:'PENDING'   },
  { id:'p4',  name:'Priya Osei',           specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=20', confirmed:'PENDING'   },
  { id:'p5',  name:'Kenji Watanabe',       specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=66', confirmed:'CONFIRMED' },
  { id:'p6',  name:'Sofia Reyes',          specialty:'Nails',  avatar:'https://i.pravatar.cc/150?img=68', confirmed:'CONFIRMED' },
  { id:'p7',  name:'Aisha Johnson',        specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=58', confirmed:'PENDING'   },
  { id:'p8',  name:'Lena Schmidt',         specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=26', confirmed:'DECLINED'  },
  { id:'p9',  name:'Mira Patel',           specialty:'Nails',  avatar:'https://i.pravatar.cc/150?img=37', confirmed:'CONFIRMED' },
  { id:'p10', name:'Emma Chen',            specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=1',  confirmed:'PENDING'   },
]

// ─── Jacquemus artists (post-show) ────────────────────────────────────────────
const JACQ_ARTISTS = [
  { id:'j1', name:'Zoe Park',    specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=5',  modelsCompleted:5, stars:5, incidents:[], note:'Flawless execution throughout',   inviteBack:'YES'   },
  { id:'j2', name:'Priya Osei',  specialty:'Hair',   avatar:'https://i.pravatar.cc/150?img=20', modelsCompleted:4, stars:4, incidents:[], note:'Reliable, good communication',    inviteBack:'YES'   },
  { id:'j3', name:'Luna Torres', specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=38', modelsCompleted:3, stars:5, incidents:[], note:'Standout performance',             inviteBack:'YES'   },
]

// ─── VS26 receipts ─────────────────────────────────────────────────────────────
const VS26_RECEIPTS = [
  { category:'Products',       items:[{ desc:'Hair extensions', artist:'Marcus Lee', budgeted:6000, actual:7500 }, { desc:'Setting spray (3 units)', artist:'Zoe Park', budgeted:100, actual:84 }] },
  { category:'Transportation', items:[{ desc:'Car service to venue', artist:'David Kim', budgeted:100, actual:120 }] },
  { category:'Meals',          items:[{ desc:'Craft services contribution', artist:'Luna Torres', budgeted:50, actual:45 }] },
]
const JACQ_RECEIPTS = [
  { category:'Products',       items:[{ desc:'Biodegradable packaging supplies', artist:'Zoe Park', budgeted:300, actual:320 }] },
  { category:'Transportation', items:[{ desc:'Train Paris + taxi', artist:'Priya Osei', budgeted:200, actual:180 }] },
  { category:'Meals',          items:[{ desc:'Lunch for team (5)', artist:'Luna Torres', budgeted:250, actual:210 }] },
]

const PRADA_BUDGET = [
  { desc:'Hair Extensions',  budgeted:6000 },
  { desc:'Setting Spray',    budgeted:100  },
  { desc:'Artist Fees',      budgeted:12000 },
  { desc:'Transportation',   budgeted:500  },
  { desc:'Craft Services',   budgeted:300  },
]

const INIT_INCIDENTS = [
  { id:'i1', artist:'Marcus Lee',  type:'Late Arrival', notes:'Arrived 45 minutes late to call time', time:'5:45 AM' },
  { id:'i2', artist:'Priya Osei',  type:'Left Early',   notes:'Left 20 minutes before show ended',    time:'7:40 PM' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = n => `$${Number(n).toLocaleString()}`

function Stars({ n, size = 13 }) {
  return <span style={{ fontSize: size, letterSpacing: 2, color: '#D4A853' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

function StatusPill({ status }) {
  const map = { active:['#D4A853','DAY OF'], upcoming:['#8A9BB0','UPCOMING'], completed:['#7A9E7E','COMPLETED'] }
  const [bg, label] = map[status] || ['#C8C4BF', status]
  return <span style={{ background:bg, borderRadius:20, padding:'3px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', fontWeight:600 }}>{label}</span>
}

function ConfirmPill({ status }) {
  const map = { CONFIRMED:'#7A9E7E', PENDING:'#D4A853', DECLINED:'#C4614A' }
  return <span style={{ background:map[status]||'#C8C4BF', borderRadius:20, padding:'2px 8px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', color:'#111', fontWeight:600 }}>{status}</span>
}

function Card({ children, dark, style={} }) {
  return (
    <div style={{ background:dark?'#242220':'#fff', borderRadius:10, padding:'20px 24px', boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)', ...style }}>
      {children}
    </div>
  )
}

function SLabel({ children }) {
  return <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#888580', fontWeight:600 }}>{children}</p>
}

// ─── Artist side panel ───────────────────────────────────────────────────────
function ArtistPanel({ artist, onClose, dark }) {
  const [note, setNote] = useState(artist.notes || '')
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const bg     = dark ? '#1A1816' : '#F5F2EE'

  return (
    <div style={{ position:'fixed', top:36, right:0, bottom:0, width:380, background:bg, borderLeft:`1px solid ${border}`, display:'flex', flexDirection:'column', zIndex:60, overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>ARTIST PROFILE</p>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:muted, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase' }}>CLOSE</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <img src={artist.avatar} alt={artist.name} style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
          <div>
            <p style={{ margin:'0 0 3px', fontFamily:'Georgia,serif', fontSize:20, color:text }}>{artist.name}</p>
            <p style={{ margin:'0 0 2px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{artist.specialty.toUpperCase()} · {artist.city}</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{artist.email}</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{artist.phone}</p>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
          {[['Experience', `${artist.experience} yrs`], ['Times Booked', artist.timesBooked], ['Hourly Rate', fmt(artist.hourlyRate)], ['Rating', `${artist.rating} ★`]].map(([l,v]) => (
            <div key={l} style={{ background:dark?'#242220':'#fff', borderRadius:8, padding:'10px 12px' }}>
              <p style={{ margin:'0 0 2px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{l}</p>
              <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{v}</p>
            </div>
          ))}
        </div>
        {/* Skills */}
        <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>SKILLS</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
          {artist.skills.map(s => <span key={s} style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted, border:`1px solid ${border}`, borderRadius:20, padding:'3px 8px' }}>{s}</span>)}
        </div>
        {/* Designer tags */}
        <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>DESIGNER CLIENTS</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
          {artist.designers.map(d => <span key={d} style={{ fontFamily:'Inter,system-ui', fontSize:10, color:text, background:dark?'#2A2724':'#EDE9E4', borderRadius:20, padding:'3px 8px' }}>{d}</span>)}
        </div>
        {/* Show history */}
        {artist.showHistory?.length > 0 && (
          <>
            <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>SHOW HISTORY</p>
            {artist.showHistory.map((h,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${border}` }}>
                <div><p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:text }}>{h.show}</p><p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{h.date} · {h.role}</p></div>
                <Stars n={h.rating} size={11} />
              </div>
            ))}
            <div style={{ marginBottom:18 }} />
          </>
        )}
        {/* Notes */}
        <p style={{ margin:'0 0 6px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>NOTES</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Private notes about this artist…" rows={4} style={{ width:'100%', background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, outline:'none', resize:'none', boxSizing:'border-box', marginBottom:16 }} />
        <button style={{ width:'100%', padding:12, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:6, cursor:'pointer', outline:'none', fontWeight:500 }}>
          ASSIGN TO SHOW
        </button>
      </div>
    </div>
  )
}

// ─── Add Artist panel ─────────────────────────────────────────────────────────
function AddArtistPanel({ onClose, onAdd, dark }) {
  const [q, setQ] = useState('')
  const results = AGENT_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.specialty.toLowerCase().includes(q.toLowerCase()) ||
    a.city.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 12)
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const bg     = dark ? '#1A1816' : '#F5F2EE'

  return (
    <div style={{ position:'fixed', top:36, right:0, bottom:0, width:360, background:bg, borderLeft:`1px solid ${border}`, display:'flex', flexDirection:'column', zIndex:60 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>ADD ARTIST</p>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontFamily:'Inter,system-ui', fontSize:9, outline:'none' }}>CLOSE</button>
      </div>
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, specialty, city…" style={{ width:'100%', background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, outline:'none', boxSizing:'border-box' }} />
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {results.map(a => (
          <button key={a.id} onClick={() => { onAdd(a); onClose() }} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'10px 16px', background:'none', border:'none', borderBottom:`1px solid ${border}`, cursor:'pointer', outline:'none', textAlign:'left' }}>
            <img src={a.avatar} style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:text }}>{a.name}</p>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{a.specialty.toUpperCase()} · {a.city}</p>
            </div>
            <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>${a.hourlyRate}/hr</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Artists table ────────────────────────────────────────────────────────────
const ALL_DESIGNERS = ['Valentino','Prada','Jacquemus','Oscar de la Renta','Diesel','Chanel','Dior','Givenchy','Balenciaga','Saint Laurent','Versace','Fendi','Bottega Veneta','Burberry','Alexander McQueen']
const ALL_SKILLS    = ['Eyebrow bleaching','Hair extensions','Tooth gems','Editorial makeup','Avant-garde color','Airbrush','Special effects','Natural glam','Nail art','Gel extensions','Acrylic','Press-on sets','Braiding','Wig styling','Color correction']
const ALL_CITIES    = ['New York','Paris','Milan','London','Los Angeles','Tokyo','Sydney','Berlin']

function applyFilters(artists, filters) {
  return artists.filter(a => {
    if (filters.specialty && a.specialty !== filters.specialty) return false
    if (filters.cities?.length && !filters.cities.includes(a.city)) return false
    if (filters.minHourlyRate && a.hourlyRate < filters.minHourlyRate) return false
    if (filters.maxHourlyRate && a.hourlyRate > filters.maxHourlyRate) return false
    if (filters.minRating && a.rating < filters.minRating) return false
    if (filters.minExperience && a.experience < filters.minExperience) return false
    if (filters.designerTags?.length && !filters.designerTags.some(d => a.designers.includes(d))) return false
    if (filters.skillTags?.length && !filters.skillTags.some(s => a.skills.includes(s))) return false
    return true
  })
}

function applySort(artists, sort) {
  return [...artists].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    switch (sort.col) {
      case 'name':        return dir * a.name.localeCompare(b.name)
      case 'specialty':   return dir * a.specialty.localeCompare(b.specialty)
      case 'city':        return dir * a.city.localeCompare(b.city)
      case 'experience':  return dir * (a.experience - b.experience)
      case 'timesBooked': return dir * (a.timesBooked - b.timesBooked)
      case 'rating':      return dir * (a.rating - b.rating)
      case 'hourlyRate':  return dir * (a.hourlyRate - b.hourlyRate)
      default: return 0
    }
  })
}

function ArtistsView({ dark }) {
  const [sort, setSort]       = useState({ col:'name', dir:'asc' })
  const [filters, setFilters] = useState({})
  const [nlQuery, setNlQuery] = useState('')
  const [nlLoading, setNlLoading] = useState(false)
  const [nlError, setNlError] = useState('')
  const [selected, setSelected] = useState(null)

  // Filter UI local state
  const [fSpec, setFSpec]     = useState('')
  const [fCity, setFCity]     = useState('')
  const [fMinRate, setFMinRate] = useState('')
  const [fMaxRate, setFMaxRate] = useState('')
  const [fMinRating, setFMinRating] = useState('')
  const [fDesigner, setFDesigner]   = useState('')
  const [fSkill, setFSkill]         = useState('')

  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const card   = dark ? '#242220' : '#fff'
  const bg     = dark ? '#1A1816' : '#F5F2EE'

  // Build filters object from UI inputs + NL filters
  const activeFilters = {
    specialty:      fSpec || filters.specialty || null,
    cities:         fCity ? [fCity] : (filters.cities || null),
    minHourlyRate:  fMinRate ? parseInt(fMinRate) : (filters.minHourlyRate || null),
    maxHourlyRate:  fMaxRate ? parseInt(fMaxRate) : (filters.maxHourlyRate || null),
    minRating:      fMinRating ? parseFloat(fMinRating) : (filters.minRating || null),
    minExperience:  filters.minExperience || null,
    designerTags:   fDesigner ? [fDesigner] : (filters.designerTags || null),
    skillTags:      fSkill ? [fSkill] : (filters.skillTags || null),
  }

  const hasFilters = Object.values(activeFilters).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true))
  const filtered   = applyFilters(AGENT_ARTISTS, activeFilters)
  const sorted     = applySort(filtered, sort)

  function toggleSort(col) {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' })
  }

  function clearAll() {
    setFilters({})
    setFSpec(''); setFCity(''); setFMinRate(''); setFMaxRate(''); setFMinRating(''); setFDesigner(''); setFSkill('')
    setNlQuery('')
  }

  async function handleNLSearch(e) {
    e.preventDefault()
    if (!nlQuery.trim()) return
    setNlLoading(true)
    setNlError('')
    try {
      const res = await fetch('/api/search-artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlQuery }),
      })
      const data = await res.json()
      if (data.error && !data.filters) { setNlError(data.error); return }
      setFilters(data.filters || {})
      setFSpec(''); setFCity(''); setFMinRate(''); setFMaxRate(''); setFMinRating(''); setFDesigner(''); setFSkill('')
    } catch (err) {
      setNlError('Search unavailable')
    } finally {
      setNlLoading(false)
    }
  }

  const thStyle = (col) => ({
    padding: '8px 10px',
    fontFamily: 'Inter,system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: sort.col === col ? text : muted,
    cursor: 'pointer', background: 'none', border: 'none', outline: 'none',
    whiteSpace: 'nowrap', textAlign: 'left', userSelect: 'none',
  })
  const sortArrow = (col) => sort.col === col ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''

  const inputStyle = {
    fontFamily:'Inter,system-ui', fontSize:10, color:text, background:'transparent',
    border:`1px solid ${border}`, borderRadius:4, padding:'3px 6px', outline:'none', width:'100%',
  }
  const selectStyle = { ...inputStyle, cursor:'pointer' }

  return (
    <div style={{ paddingRight: selected ? 390 : 0 }}>
      {/* NL search */}
      <div style={{ marginBottom:20 }}>
        <p style={{ margin:'0 0 8px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Artists</p>
        <form onSubmit={handleNLSearch} style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input
            value={nlQuery}
            onChange={e => setNlQuery(e.target.value)}
            placeholder="Search artists… try 'nail artists in NYC under $100/hr'"
            style={{ flex:1, fontFamily:'Inter,system-ui', fontSize:13, color:text, background:card, border:`1px solid ${border}`, borderRadius:8, padding:'11px 14px', outline:'none', boxShadow: dark?'none':'0 1px 4px rgba(0,0,0,.05)' }}
          />
          <button type="submit" disabled={nlLoading} style={{ padding:'11px 20px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:8, cursor:'pointer', outline:'none', fontWeight:500, opacity: nlLoading ? 0.6 : 1, flexShrink:0 }}>
            {nlLoading ? '···' : 'SEARCH'}
          </button>
          {(hasFilters || nlQuery) && (
            <button type="button" onClick={clearAll} style={{ padding:'11px 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:`1px solid ${border}`, borderRadius:8, cursor:'pointer', outline:'none', flexShrink:0, whiteSpace:'nowrap' }}>
              CLEAR ALL
            </button>
          )}
        </form>
        {nlError && <p style={{ margin:'6px 0 0', fontFamily:'Inter,system-ui', fontSize:11, color:'#C4614A' }}>{nlError}. Set ANTHROPIC_API_KEY in Vercel environment to enable AI search.</p>}
      </div>

      {/* Results count */}
      <p style={{ margin:'0 0 12px', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{sorted.length} artist{sorted.length !== 1 ? 's' : ''}{hasFilters ? ' (filtered)' : ''}</p>

      {/* Table */}
      <div style={{ overflowX:'auto', background:card, borderRadius:10, boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:1100 }}>
          <thead>
            {/* Sort headers */}
            <tr style={{ borderBottom:`1px solid ${border}` }}>
              <th style={{ ...thStyle(null), width:48 }}></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('name')}     style={thStyle('name')}>Name{sortArrow('name')}</button></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('specialty')} style={thStyle('specialty')}>Specialty{sortArrow('specialty')}</button></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('city')}     style={thStyle('city')}>City{sortArrow('city')}</button></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('experience')} style={thStyle('experience')}>Exp{sortArrow('experience')}</button></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('timesBooked')} style={thStyle('timesBooked')}>Booked{sortArrow('timesBooked')}</button></th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('rating')}   style={thStyle('rating')}>Rating{sortArrow('rating')}</button></th>
              <th style={{ ...thStyle(null), minWidth:120 }}>Designers</th>
              <th style={{ padding:0 }}><button onClick={() => toggleSort('hourlyRate')} style={thStyle('hourlyRate')}>Rate{sortArrow('hourlyRate')}</button></th>
              <th style={{ ...thStyle(null), minWidth:120 }}>Skills</th>
              <th style={{ ...thStyle(null), width:40 }}>Portfolio</th>
              <th style={{ ...thStyle(null), minWidth:120 }}>Email</th>
              <th style={{ ...thStyle(null), minWidth:100 }}>Phone</th>
            </tr>
            {/* Filter row */}
            <tr style={{ borderBottom:`1px solid ${border}`, background:dark?'#1F1D1B':'#F9F7F5' }}>
              <td style={{ padding:'6px 10px' }}></td>
              <td style={{ padding:'4px 6px' }}></td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fSpec} onChange={e => setFSpec(e.target.value)} style={selectStyle}>
                  <option value="">All</option>
                  {['hair','makeup','nails'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fCity} onChange={e => setFCity(e.target.value)} style={selectStyle}>
                  <option value="">All cities</option>
                  {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}></td>
              <td style={{ padding:'4px 6px' }}></td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fMinRating} onChange={e => setFMinRating(e.target.value)} style={selectStyle}>
                  <option value="">Any</option>
                  {['3.0','3.5','4.0','4.5'].map(r => <option key={r} value={r}>{r}+</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fDesigner} onChange={e => setFDesigner(e.target.value)} style={selectStyle}>
                  <option value="">Any designer</option>
                  {ALL_DESIGNERS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <div style={{ display:'flex', gap:3 }}>
                  <input value={fMinRate} onChange={e => setFMinRate(e.target.value)} placeholder="$min" type="number" style={{ ...inputStyle, width:52 }} />
                  <input value={fMaxRate} onChange={e => setFMaxRate(e.target.value)} placeholder="$max" type="number" style={{ ...inputStyle, width:52 }} />
                </div>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fSkill} onChange={e => setFSkill(e.target.value)} style={selectStyle}>
                  <option value="">Any skill</option>
                  {ALL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td /><td /><td />
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => (
              <tr
                key={a.id}
                onClick={() => setSelected(selected?.id === a.id ? null : a)}
                style={{ borderBottom:`1px solid ${border}`, cursor:'pointer', background: selected?.id === a.id ? (dark?'#2A2724':'#F0EDE8') : 'transparent', transition:'background 100ms' }}
              >
                <td style={{ padding:'8px 10px' }}><img src={a.avatar} style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block' }} /></td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>{a.name}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:11, color:muted, whiteSpace:'nowrap' }}>{a.city}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, textAlign:'center' }}>{a.experience}y</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, textAlign:'center' }}>{a.timesBooked}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>{a.rating} ★ <span style={{ fontSize:10, color:muted }}>({a.ratingCount})</span></td>
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {a.designers.slice(0,2).map(d => <span key={d} style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted, background:dark?'#2A2724':'#EDE9E4', borderRadius:20, padding:'2px 6px' }}>{d}</span>)}
                    {a.designers.length > 2 && <span style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted }}>+{a.designers.length - 2}</span>}
                  </div>
                </td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>${a.hourlyRate}/hr</td>
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {a.skills.slice(0,2).map(s => <span key={s} style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted, border:`1px solid ${border}`, borderRadius:20, padding:'2px 6px', whiteSpace:'nowrap' }}>{s}</span>)}
                    {a.skills.length > 2 && <span style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted }}>+{a.skills.length - 2}</span>}
                  </div>
                </td>
                <td style={{ padding:'8px 10px', textAlign:'center' }}>
                  <a href={a.portfolioUrl} onClick={e => e.stopPropagation()} style={{ color:muted }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:10, color:muted, whiteSpace:'nowrap' }}>{a.email}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:10, color:muted, whiteSpace:'nowrap' }}>{a.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      {selected && <ArtistPanel artist={selected} onClose={() => setSelected(null)} dark={dark} />}
    </div>
  )
}

// ─── Show detail sub-views ────────────────────────────────────────────────────
function PreShowDetail({ show, dark }) {
  const [tab, setTab]       = useState('info')
  const [roster, setRoster] = useState(PRADA_ARTISTS)
  const [addPanel, setAddPanel] = useState(false)
  const [info, setInfo]     = useState({ name:show.name, date:show.date, venue:show.venue, callTime:show.callTime, showtime:show.showtime })
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  const tabStyle = t => ({
    fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase',
    color: tab === t ? text : muted,
    background:'none', border:'none',
    borderBottom: tab === t ? `1.5px solid ${text}` : '1.5px solid transparent',
    padding:'8px 0', marginRight:28, cursor:'pointer', outline:'none',
  })
  const inputStyle = { fontFamily:'Inter,system-ui', fontSize:13, color:text, background:'transparent', border:'none', borderBottom:`1px solid ${border}`, outline:'none', padding:'4px 0', width:'100%', marginBottom:16 }

  return (
    <div>
      <div style={{ display:'flex', borderBottom:`1px solid ${border}`, marginBottom:28 }}>
        {['info','roster','documents'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'info' ? 'Show Info' : t === 'roster' ? 'Artist Roster' : 'Documents'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <Card dark={dark} style={{ maxWidth:520 }}>
          <SLabel>Show Information</SLabel>
          {[['Show Name','name'],['Date','date'],['Venue','venue'],['Call Time','callTime'],['Showtime','showtime']].map(([label,key]) => (
            <div key={key}>
              <p style={{ margin:'0 0 2px', fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{label}</p>
              <input value={info[key]} onChange={e => setInfo(i=>({...i,[key]:e.target.value}))} style={inputStyle} />
            </div>
          ))}
        </Card>
      )}

      {tab === 'roster' && (
        <div>
          {roster.map(a => (
            <Card key={a.id} dark={dark} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
              <img src={a.avatar} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{a.name}</p>
                <p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</p>
              </div>
              <ConfirmPill status={a.confirmed} />
            </Card>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:12 }}>
            <button onClick={() => setAddPanel(true)} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'9px 16px', background:'none', cursor:'pointer', outline:'none' }}>+ ADD ARTIST</button>
            <button style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, border:`1px solid ${border}`, borderRadius:6, padding:'9px 16px', background:'none', cursor:'pointer', outline:'none' }}>IMPORT CSV</button>
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, maxWidth:680 }}>
          {['Call Sheet','Running Order','Face Charts'].map(doc => (
            <Card key={doc} dark={dark} style={{ textAlign:'center', padding:'32px 20px' }}>
              <p style={{ margin:'0 0 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text }}>{doc}</p>
              <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>No file</p>
              <label style={{ fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:5, padding:'6px 12px', cursor:'pointer' }}>
                UPLOAD<input type="file" style={{ display:'none' }} />
              </label>
            </Card>
          ))}
        </div>
      )}

      {addPanel && <AddArtistPanel dark={dark} onClose={() => setAddPanel(false)} onAdd={a => setRoster(r => [...r, { ...a, confirmed:'PENDING' }])} />}
    </div>
  )
}

function DayOfDetail({ artists, incidents, dark }) {
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const statusDot   = { 'on-site':'#7A9E7E', late:'#D4A853', 'no-show':'#C4614A' }
  const statusLabel = { 'on-site':'On site', late:'Late', 'no-show':'No show' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, color:text }}>Artist Status Board</p>
        <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, color:muted, letterSpacing:'0.06em' }}>Incidents logged by Lead — read only</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:40 }}>
        {artists.map(a => (
          <Card key={a.id} dark={dark} style={{ display:'flex', alignItems:'center', gap:14 }}>
            <img src={a.avatar} style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, fontWeight:500 }}>{a.name}</p>
              <p style={{ margin:'2px 0 6px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.07em', textTransform:'uppercase', color:muted }}>{a.specialty}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:statusDot[a.onSiteStatus]||'#888', flexShrink:0 }} />
                <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:statusDot[a.onSiteStatus]||muted }}>{statusLabel[a.onSiteStatus]||a.onSiteStatus}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ height:1, background:border, marginBottom:20 }} />
      <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>INCIDENT LOG · READ ONLY</p>
      {incidents.length === 0 ? (
        <p style={{ fontFamily:'Inter,system-ui', fontSize:13, color:muted }}>No incidents logged.</p>
      ) : incidents.map((inc, i) => (
        <Card key={i} dark={dark} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:10, borderLeft:'2px solid #C4614A', borderRadius:'0 10px 10px 0' }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, fontWeight:500, color:text }}>{inc.artist}</p>
              <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'#C4614A' }}>{inc.type}</span>
            </div>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:muted, lineHeight:1.5 }}>{inc.notes}</p>
          </div>
          <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted, whiteSpace:'nowrap', flexShrink:0 }}>{inc.time}</span>
        </Card>
      ))}
    </div>
  )
}

function WrapDetail({ show, artists, receipts, dark }) {
  const [inviteBack, setInviteBack] = useState(Object.fromEntries(artists.map(a => [a.id, a.inviteBack || 'YES'])))
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  const totalActual   = receipts.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + (i.actual || 0), 0), 0)
  const totalBudgeted = receipts.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + (i.budgeted || 0), 0), 0)
  const variance = totalActual - totalBudgeted

  const INVITE_OPTS = ['YES','MAYBE','NO']
  const inviteColors = { YES:'#7A9E7E', MAYBE:'#D4A853', NO:'#C4614A' }

  return (
    <div>
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:40 }}>
        {[['Total Artists',artists.length],['Total Spend',fmt(totalActual)],['Incidents',artists.reduce((s,a)=>s+a.incidents.length,0)],['vs Budget',variance > 0 ? `+${fmt(variance)}` : fmt(variance)]].map(([l,v]) => (
          <Card key={l} dark={dark} style={{ textAlign:'center', padding:'20px 16px' }}>
            <p style={{ margin:'0 0 4px', fontFamily:'Georgia,serif', fontSize:26, color: l==='vs Budget' ? (variance>0?'#C4614A':'#7A9E7E') : text, lineHeight:1 }}>{v}</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{l}</p>
          </Card>
        ))}
      </div>

      {/* Artist reviews — from Lead/assistants, read-only for Agent */}
      <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ARTIST REVIEWS · FROM ON-SITE TEAM</p>
      {artists.map(a => (
        <Card key={a.id} dark={dark} style={{ marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
            <img src={a.avatar} style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{a.name}</p>
                <Stars n={a.stars} />
                <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</span>
              </div>
              <p style={{ margin:'0 0 6px', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{a.modelsCompleted} model{a.modelsCompleted!==1?'s':''} completed{a.incidents.length?` · ${a.incidents.length} incident`:''}</p>
              {a.incidents.map((inc,i) => <p key={i} style={{ margin:'0 0 4px', fontFamily:'Inter,system-ui', fontSize:11, color:'#C4614A', paddingLeft:10, borderLeft:'2px solid #C4614A' }}>{inc}</p>)}
              {a.note && <p style={{ margin:'6px 0 0', fontFamily:'Inter,system-ui', fontSize:12, color:text, fontStyle:'italic' }}>"{a.note}"</p>}
            </div>
            {/* Invite back — YES / MAYBE / NO */}
            <div style={{ flexShrink:0, textAlign:'center' }}>
              <p style={{ margin:'0 0 6px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>INVITE BACK</p>
              <div style={{ display:'flex', gap:4 }}>
                {INVITE_OPTS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInviteBack(ib => ({ ...ib, [a.id]: opt }))}
                    style={{
                      fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.06em', textTransform:'uppercase',
                      color: inviteBack[a.id] === opt ? '#111' : text,
                      background: inviteBack[a.id] === opt ? inviteColors[opt] : 'transparent',
                      border: `1px solid ${inviteBack[a.id] === opt ? inviteColors[opt] : border}`,
                      borderRadius:20, padding:'4px 8px', cursor:'pointer', outline:'none',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Full budget with variance */}
      <div style={{ marginTop:40 }}>
        <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>BUDGET · ACTUALS & VARIANCE</p>
        {receipts.map(cat => {
          const catBudgeted = cat.items.reduce((s,i) => s+(i.budgeted||0), 0)
          const catActual   = cat.items.reduce((s,i) => s+(i.actual||0), 0)
          const catVar      = catActual - catBudgeted
          return (
            <Card key={cat.category} dark={dark} style={{ marginBottom:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px', gap:'6px 12px', marginBottom:10 }}>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{cat.category}</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted, textAlign:'right' }}>Budgeted</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted, textAlign:'right' }}>Actual</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted, textAlign:'right' }}>Variance</p>
              </div>
              {cat.items.map((item,i) => {
                const v = (item.actual||0) - (item.budgeted||0)
                return (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px', gap:'6px 12px', padding:'8px 0', borderTop:`1px solid ${border}` }}>
                    <div><p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{item.desc}</p><p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{item.artist}</p></div>
                    <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right' }}>{fmt(item.budgeted||0)}</p>
                    <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right' }}>{fmt(item.actual||0)}</p>
                    <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, textAlign:'right', color: v > 0 ? '#C4614A' : '#7A9E7E', fontWeight:500 }}>{v > 0 ? '+' : ''}{fmt(v)}</p>
                  </div>
                )
              })}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px', gap:'6px 12px', padding:'10px 0 0', borderTop:`2px solid ${border}`, marginTop:4 }}>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>Subtotal</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right', fontWeight:500 }}>{fmt(catBudgeted)}</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right', fontWeight:500 }}>{fmt(catActual)}</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, textAlign:'right', color: catVar > 0 ? '#C4614A' : '#7A9E7E', fontWeight:600 }}>{catVar > 0 ? '+' : ''}{fmt(catVar)}</p>
              </div>
            </Card>
          )
        })}
        <Card dark={dark} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px', gap:'6px 12px' }}>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>Grand Total</p>
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, color:text, textAlign:'right' }}>{fmt(totalBudgeted)}</p>
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, color:text, textAlign:'right' }}>{fmt(totalActual)}</p>
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, textAlign:'right', color: variance > 0 ? '#C4614A' : '#7A9E7E' }}>{variance > 0 ? '+' : ''}{fmt(variance)}</p>
        </Card>
      </div>

      <div style={{ marginTop:32, display:'flex', justifyContent:'flex-end' }}>
        <button onClick={() => window.print()} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'11px 22px', background:'none', cursor:'pointer', outline:'none' }}>EXPORT FOR INVOICE</button>
      </div>
    </div>
  )
}

// ─── Settings page ───────────────────────────────────────────────────────────
function SettingsPage({ dark, onToggleDark, onLogOut }) {
  const [email, setEmail]   = useState('alexis.monroe@showpartner.io')
  const [phone, setPhone]   = useState('+1 212 555 0200')
  const [dayAlerts, setDayAlerts] = useState(true)
  const [postReport, setPostReport] = useState(true)
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'

  function Toggle({ value, onChange }) {
    return (
      <button onClick={() => onChange(!value)} style={{ position:'relative', width:40, height:22, borderRadius:11, background: value ? '#7A9E7E' : '#888580', border:'none', cursor:'pointer', outline:'none', flexShrink:0, transition:'background 150ms' }}>
        <span style={{ position:'absolute', top:3, left: value ? 21 : 3, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 150ms', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
      </button>
    )
  }

  function Row({ label, sub, children }) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:`1px solid ${border}` }}>
        <div>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{label}</p>
          {sub && <p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{sub}</p>}
        </div>
        {children}
      </div>
    )
  }

  const inputStyle = { fontFamily:'Inter,system-ui', fontSize:12, color:text, background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'6px 10px', outline:'none', width:220 }

  return (
    <div style={{ maxWidth:560 }}>
      <p style={{ margin:'0 0 28px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Settings</p>

      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ACCOUNT</p>
      <Card dark={dark} style={{ marginBottom:28 }}>
        <Row label="Name" sub="Alexis Monroe"><span style={{ fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>Agent</span></Row>
        <Row label="Email"><input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></Row>
        <Row label="Phone"><input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} /></Row>
      </Card>

      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>NOTIFICATIONS</p>
      <Card dark={dark} style={{ marginBottom:28 }}>
        <Row label="Show day-of alerts" sub="Notify when artists check in, log incidents"><Toggle value={dayAlerts} onChange={setDayAlerts} /></Row>
        <Row label="Post-show report ready" sub="Notify when wrap report is available"><Toggle value={postReport} onChange={setPostReport} /></Row>
      </Card>

      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>APPEARANCE</p>
      <Card dark={dark} style={{ marginBottom:28 }}>
        <Row label="Dark mode"><Toggle value={dark} onChange={onToggleDark} /></Row>
      </Card>

      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>SHOW PARTNER</p>
      <Card dark={dark} style={{ marginBottom:40 }}>
        <Row label="Version"><span style={{ fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>1.0</span></Row>
      </Card>

      <button onClick={onLogOut} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:muted, background:'none', border:'none', cursor:'pointer', outline:'none', padding:0 }}>Log out</button>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AgentDesktopView({ dark, onToggleDark, onLogOut }) {
  useBodyScroll()

  const [nav, setNav]           = useState('shows')
  const [demoPhaseIdx, setDemoPhaseIdx] = useState(1)
  const [selectedShow, setSelectedShow] = useState(null)
  const [showFilter, setShowFilter]     = useState('all')
  const [incidents]   = useState(INIT_INCIDENTS)

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

  const bg     = dark ? '#1A1816' : '#F5F2EE'
  const sidebar = dark ? '#111110' : '#F5F2EE'
  const text   = dark ? '#F0EDE8' : '#111'
  const muted  = '#888580'
  const border = dark ? '#2E2B28' : '#E0DDD8'
  const card   = dark ? '#242220' : '#fff'

  const DEMO_BAR_H = 36
  const SIDEBAR_W  = 220

  const filteredShows = BASE_SHOWS.filter(s => showFilter === 'all' || getShowStatus(s) === showFilter)

  function renderShowDetail(show) {
    const status = getShowStatus(show)
    const phase  = status === 'upcoming' ? 'pre' : status === 'active' ? 'day' : 'wrap'
    const receipts = show.id === 'jlp' ? JACQ_RECEIPTS : VS26_RECEIPTS
    const wrapArtists = show.id === 'jlp' ? JACQ_ARTISTS : VS26_ARTISTS

    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
          <button onClick={() => setSelectedShow(null)} style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:muted, display:'flex', alignItems:'center', gap:6, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', padding:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shows
          </button>
          <div style={{ width:1, height:16, background:border }} />
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, color:text }}>{show.name}</p>
          <StatusPill status={status} />
        </div>

        {phase === 'pre'  && <PreShowDetail show={show} dark={dark} />}
        {phase === 'day'  && <DayOfDetail artists={VS26_ARTISTS} incidents={incidents} dark={dark} />}
        {phase === 'wrap' && <WrapDetail show={show} artists={wrapArtists} receipts={receipts} dark={dark} />}
      </div>
    )
  }

  function renderShows() {
    const filterBtnStyle = f => ({
      fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase',
      color: showFilter === f ? text : muted,
      background:'none', border:'none',
      borderBottom: showFilter === f ? `1.5px solid ${text}` : '1.5px solid transparent',
      padding:'8px 0', marginRight:24, cursor:'pointer', outline:'none',
    })
    return (
      <div>
        <div style={{ display:'flex', borderBottom:`1px solid ${border}`, marginBottom:28 }}>
          {['all','upcoming','active','completed'].map(f => (
            <button key={f} style={filterBtnStyle(f)} onClick={() => setShowFilter(f)}>
              {f === 'all' ? 'All Shows' : f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        {filteredShows.map(show => (
          <div key={show.id} style={{ background:card, borderRadius:10, padding:'20px 24px', marginBottom:12, boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ flex:1 }}>
              <p style={{ margin:'0 0 4px', fontFamily:'Georgia,serif', fontSize:22, color:text }}>{show.name}</p>
              <p style={{ margin:'0 0 10px', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{show.date} · {show.venue} · {show.city}</p>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <StatusPill status={getShowStatus(show)} />
                <span style={{ fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{show.artistCount} artists</span>
              </div>
            </div>
            <button onClick={() => setSelectedShow(show)} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'10px 20px', background:'none', cursor:'pointer', outline:'none', flexShrink:0 }}>OPEN</button>
          </div>
        ))}
      </div>
    )
  }

  const NAV_ITEMS = [
    { id:'shows',     label:'SHOWS'           },
    { id:'artists',   label:'ARTISTS'         },
    { id:'emergency', label:'EMERGENCY BOARD' },
    { id:'settings',  label:'SETTINGS'        },
  ]

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:bg }}>

      {/* Demo bar */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:DEMO_BAR_H, background:'#EDE9E4', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', zIndex:300, borderBottom:'0.5px solid #D8D4CF' }}>
        <span style={{ fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.12em', textTransform:'uppercase', color:'#888580' }}>DEMO MODE</span>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => cycleDemoPhase(-1)} style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:'#888580', fontSize:16, padding:'0 4px' }}>‹</button>
          <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111' }}>Viewing: <strong>{demoPhase}</strong></span>
          <button onClick={() => cycleDemoPhase(1)}  style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:'#888580', fontSize:16, padding:'0 4px' }}>›</button>
        </div>
        <span style={{ fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888580' }}>Valentino SS26 reflects selected phase</span>
      </div>

      {/* Sidebar */}
      <div style={{ position:'fixed', top:DEMO_BAR_H, left:0, bottom:0, width:SIDEBAR_W, background:sidebar, borderRight:`0.5px solid ${border}`, display:'flex', flexDirection:'column', zIndex:100 }}>
        <div style={{ padding:'28px 20px 20px', borderBottom:`0.5px solid ${border}` }}>
          <p style={{ margin:'0 0 14px', fontFamily:'Georgia,serif', fontSize:18, color:text, lineHeight:1 }}>Show Partner</p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="https://i.pravatar.cc/150?img=47" alt="Alexis" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }} />
            <div>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, fontWeight:500, color:text }}>Alexis Monroe</p>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>AGENT</p>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'16px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = nav === item.id
            return (
              <button key={item.id} onClick={() => { setNav(item.id); setSelectedShow(null) }} style={{ display:'block', width:'100%', textAlign:'left', padding:'11px 20px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color: isActive ? text : muted, background:'none', border:'none', outline:'none', cursor:'pointer', borderLeft: isActive ? `2px solid ${text}` : '2px solid transparent', fontWeight: isActive ? 500 : 400 }}>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding:'16px 20px', borderTop:`0.5px solid ${border}` }}>
          <button onClick={onToggleDark} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', outline:'none', marginBottom:10, padding:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5" strokeLinecap="round">
              {dark ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
            </svg>
            <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{dark?'Light':'Dark'} mode</span>
          </button>
          <button onClick={onLogOut} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:'none', cursor:'pointer', outline:'none', padding:0 }}>Log out</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft:SIDEBAR_W, paddingTop:DEMO_BAR_H }}>
        <div style={{ padding:40, maxWidth:960 }}>

          {nav === 'shows' && (
            <>
              {!selectedShow ? (
                <><p style={{ margin:'0 0 24px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Shows</p>{renderShows()}</>
              ) : renderShowDetail(selectedShow)}
            </>
          )}

          {nav === 'artists' && <ArtistsView dark={dark} />}

          {nav === 'emergency' && (
            <div>
              <p style={{ margin:'0 0 6px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Emergency Board</p>
              <p style={{ margin:'0 0 24px', fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>Incidents logged by the on-site Lead · read only</p>
              {incidents.length === 0 ? (
                <p style={{ fontFamily:'Inter,system-ui', fontSize:13, color:muted }}>No active incidents.</p>
              ) : incidents.map((inc,i) => (
                <Card key={i} dark={dark} style={{ marginBottom:12, borderLeft:'2px solid #C4614A', borderRadius:'0 10px 10px 0', display:'flex', gap:20, alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:10, marginBottom:4, alignItems:'center' }}>
                      <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, fontWeight:500, color:text }}>{inc.artist}</p>
                      <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'#C4614A' }}>{inc.type}</span>
                      <span style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted }}>Valentino SS26</span>
                    </div>
                    <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:muted, lineHeight:1.5 }}>{inc.notes}</p>
                  </div>
                  <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted, whiteSpace:'nowrap' }}>{inc.time}</span>
                </Card>
              ))}
            </div>
          )}

          {nav === 'settings' && <SettingsPage dark={dark} onToggleDark={onToggleDark} onLogOut={onLogOut} />}
        </div>
      </div>
    </div>
  )
}
