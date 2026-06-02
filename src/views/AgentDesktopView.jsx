import { useState, useEffect, useRef } from 'react'
import { AGENT_ARTISTS } from '../data/agentArtists'

function useBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => { document.body.style.overflow = prev; document.documentElement.style.overflow = '' }
  }, [])
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEMO_PHASES = ['PRE-SHOW', 'DAY-OF', 'POST-SHOW']

const BASE_SHOWS = [
  { id:'vs26', name:'Valentino SS26',           date:'Today — June 1, 2026', venue:'8 Place de la Bourse',       city:'Paris',    artistCount:6,  baseStatus:'active',    callTime:'5:00 AM', showtime:'6:00 PM'  },
  { id:'pr27', name:'Prada Resort 27',          date:'June 15, 2026',        venue:'Fondazione Prada',           city:'Milan',    artistCount:10, baseStatus:'upcoming',  callTime:'6:00 AM', showtime:'2:00 PM'  },
  { id:'jlp',  name:'Jacquemus Le Printemps',   date:'May 25, 2026',         venue:'Domaine du Château Estoublon', city:'Provence', artistCount:5,  baseStatus:'completed', callTime:'8:00 AM', showtime:'4:00 PM'  },
]
const ARCHIVE_SHOWS = [
  { id:'vfw25', name:'Valentino FW25', date:'November 2025', venue:'Palazzo Visconti',  city:'Milan',    artistCount:8, baseStatus:'archive', callTime:'6:00 AM', showtime:'3:00 PM' },
  { id:'vss25', name:'Valentino SS25', date:'March 2025',    venue:'Musée Rodin',       city:'Paris',    artistCount:7, baseStatus:'archive', callTime:'7:00 AM', showtime:'2:00 PM' },
  { id:'vfw24', name:'Valentino FW24', date:'October 2024',  venue:'Pier 59 Studios',   city:'New York', artistCount:6, baseStatus:'archive', callTime:'6:00 AM', showtime:'3:00 PM' },
]
const ALL_SHOWS = [...BASE_SHOWS, ...ARCHIVE_SHOWS]

const VS26_ARTISTS = [
  { id:'a1', name:'Marcus Lee',  specialty:'Makeup', avatar:'/artists/Marcus-Lee.png',     onSiteStatus:'late',    confirmed:'CONFIRMED', modelsCompleted:3, incidents:['Arrived 45 minutes late to call time'] },
  { id:'a2', name:'Zoe Park',    specialty:'Makeup', avatar:'/artists/Zoe-Parker.png',     onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:4, incidents:[] },
  { id:'a3', name:'David Kim',   specialty:'Hair',   avatar:'/artists/David-Kim.png',      onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:3, incidents:[] },
  { id:'a4', name:'Priya Osei',  specialty:'Hair',   avatar:'/artists/Priya-Osei.png',     onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:2, incidents:['Left 20 minutes before show ended without checking out'] },
  { id:'a5', name:'Luna Torres', specialty:'Makeup', avatar:'/artists/Luna-Tores.png',     onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:3, incidents:[] },
  { id:'a6', name:'Jen Z',       specialty:'Hair',   avatar:'/lead/Jen-Z.png',             onSiteStatus:'on-site', confirmed:'CONFIRMED', modelsCompleted:4, incidents:[] },
]

const PRADA_ARTISTS_INIT = [
  { id:'p1',  name:'Marcus Lee',    specialty:'Makeup', avatar:'/artists/Marcus-Lee.png',    confirmed:'CONFIRMED' },
  { id:'p2',  name:'Zoe Park',      specialty:'Makeup', avatar:'/artists/Zoe-Parker.png',    confirmed:'CONFIRMED' },
  { id:'p3',  name:'David Kim',     specialty:'Hair',   avatar:'/artists/David-Kim.png',     confirmed:'PENDING'   },
  { id:'p4',  name:'Priya Osei',    specialty:'Hair',   avatar:'/artists/Priya-Osei.png',    confirmed:'PENDING'   },
  { id:'p5',  name:'Kenji Watanabe',specialty:'Hair',   avatar:'/artists/Kenji-Watanabe.png',confirmed:'CONFIRMED' },
  { id:'p6',  name:'Sofia Reyes',   specialty:'Nails',  avatar:'/artists/Sofia-Reyes.png',   confirmed:'CONFIRMED' },
  { id:'p7',  name:'Aisha Johnson', specialty:'Makeup', avatar:'/artists/Aisha-Johnson.png', confirmed:'PENDING'   },
  { id:'p8',  name:'Lena Schmidt',  specialty:'Hair',   avatar:'/artists/Lena-Schmidt.png',  confirmed:'DECLINED'  },
  { id:'p9',  name:'Mira Patel',    specialty:'Nails',  avatar:'/artists/Mira-Patel.png',    confirmed:'CONFIRMED' },
  { id:'p10', name:'Emma Chen',     specialty:'Makeup', avatar:'https://i.pravatar.cc/150?img=1', confirmed:'PENDING' },
]

const PRADA_PLANNED_BUDGET_INIT = [
  { id:1, item:'Hair Artist Fees (3 artists × 2 days)',   category:'Artist Fees',    budgeted:9000  },
  { id:2, item:'Makeup Artist Fees (4 artists × 2 days)', category:'Artist Fees',    budgeted:8000  },
  { id:3, item:'Nails (2 artists × 2 days)',              category:'Artist Fees',    budgeted:3200  },
  { id:4, item:'Hair extensions & tools',                 category:'Supplies',       budgeted:4500  },
  { id:5, item:'Makeup kit replenishment',                category:'Supplies',       budgeted:1200  },
  { id:6, item:'Team flights (Milan)',                    category:'Travel',         budgeted:3800  },
  { id:7, item:'Ground transportation',                   category:'Travel',         budgeted:600   },
  { id:8, item:'Hotel — 4 rooms × 3 nights',             category:'Accommodation',  budgeted:4200  },
  { id:9, item:'Craft services',                          category:'Other',          budgeted:350   },
]

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
const INVOICE_ADJUSTMENTS = [
  { id:1, desc:'Additional hair extensions', amount:1500 },
  { id:2, desc:'Tooth gems (set of 12)',     amount:240  },
  { id:3, desc:'Extra mascara tubes (x3)',   amount:45   },
]
const INIT_INCIDENTS = [
  { id:'i1', artist:'Marcus Lee', type:'Late Arrival', notes:'Arrived 45 minutes late to call time',              time:'5:45 AM' },
  { id:'i2', artist:'Priya Osei', type:'Left Early',   notes:'Left 20 minutes before show ended without checking out', time:'7:40 PM' },
]
// Receipts & adjustments logged during VS26 (reverse-chron order displayed in UI)
const VS26_RECEIPTS_ADJ = [
  { id:'ra6', artist:'Priya Osei',  item:'Ground transport — missed team car',              amount:35,  type:'Adjustment', time:'8:30 PM' },
  { id:'ra4', artist:'Luna Torres', item:'Emergency mascara replacement',                   amount:22,  type:'Receipt',    time:'9:30 AM' },
  { id:'ra3', artist:'Marcus Lee',  item:'Extra hair extensions ×20 — beyond budgeted qty', amount:40,  type:'Adjustment', time:'8:00 AM' },
  { id:'ra2', artist:'Zoe Park',    item:'Setting spray replacement (2 units)',             amount:28,  type:'Receipt',    time:'7:15 AM' },
  { id:'ra1', artist:'Marcus Lee',  item:'Hair extension adhesive ×3',                     amount:45,  type:'Receipt',    time:'6:30 AM' },
  { id:'ra5', artist:'David Kim',   item:'Car service to venue',                           amount:120, type:'Receipt',    time:'5:00 AM' },
]

// Artist review data for completed shows (10 artists each)
const REVIEW_ARTISTS = [
  { id:'r1',  name:'Zoe Park',         specialty:'Makeup', avatar:'/artists/Zoe-Parker.png',     avgRating:5.0, reviewCount:4, quotes:['Exceptional work throughout — every model looked incredible.','Finished ahead of schedule on every single look.'], leadNote:'Flawless execution. Request specifically for all future Jacquemus.' },
  { id:'r2',  name:'Priya Osei',       specialty:'Hair',   avatar:'/artists/Priya-Osei.png',     avgRating:4.2, reviewCount:3, quotes:['Great with natural textures, very precise.','Communication was excellent all day.'], leadNote:'Reliable and consistent. Strong on protective styles.' },
  { id:'r3',  name:'Luna Torres',      specialty:'Makeup', avatar:'/artists/Luna-Tores.png',     avgRating:5.0, reviewCount:4, quotes:['Best makeup artist I have worked with on a show.','Every look was editorial-level from first to last.'], leadNote:'Standout performance of the season. Lock in for everything.' },
  { id:'r4',  name:'Marcus Lee',       specialty:'Makeup', avatar:'/artists/Marcus-Lee.png',     avgRating:3.8, reviewCount:3, quotes:['Highly skilled, slight timing issue at end.','Skin prep was exceptional quality.'], leadNote:'Strong technical work despite the timing incident. Would rebook.' },
  { id:'r5',  name:'David Kim',        specialty:'Hair',   avatar:'/artists/David-Kim.png',      avgRating:4.0, reviewCount:3, quotes:['Great with extension work, very adaptable.','Calm under pressure and very focused.'], leadNote:'Consistent and trustworthy. Excellent with extensions.' },
  { id:'r6',  name:'Aisha Johnson',    specialty:'Makeup', avatar:'/artists/Aisha-Johnson.png',  avgRating:3.5, reviewCount:2, quotes:['Good technique, took a bit long on first model.','Very strong airbrush work.'], leadNote:'Solid first outing. Needs to work on pace.' },
  { id:'r7',  name:'Kenji Watanabe',   specialty:'Hair',   avatar:'/artists/Kenji-Watanabe.png', avgRating:4.8, reviewCount:3, quotes:['Avant-garde cuts perfectly executed.','Fastest hair artist I have seen at this level.'], leadNote:'Exceptional. One of the strongest hair artists we have worked with.' },
  { id:'r8',  name:'Lena Schmidt',     specialty:'Hair',   avatar:'/artists/Lena-Schmidt.png',   avgRating:3.2, reviewCount:2, quotes:['Good vintage styling but slightly slow.','Updos were beautiful.'], leadNote:'Technically skilled but pace needs improvement for show day.' },
  { id:'r9',  name:'Sofia Reyes',      specialty:'Nails',  avatar:'/artists/Sofia-Reyes.png',    avgRating:4.5, reviewCount:2, quotes:['Chrome work was flawless — models loved it.','Very efficient and professional.'], leadNote:'Strong nail artist. Chrome and gel work was particularly impressive.' },
  { id:'r10', name:'Mira Patel',       specialty:'Nails',  avatar:'/artists/Mira-Patel.png',     avgRating:4.3, reviewCount:2, quotes:['Beautiful minimalist designs, exactly what the show needed.','Very calm and focused under show-day pressure.'], leadNote:'Exactly what the show needed aesthetically. Would rebook.' },
]

const REVIEW_REVIEWERS = ['Sophia Rivera','Cleo Marsh','James Kim','Nadia Faris']

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = n => `$${Number(n).toLocaleString()}`

function Stars({ n, size = 13 }) {
  return <span style={{ fontSize:size, letterSpacing:2, color:'#D4A853' }}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>
}
function StatusPill({ status }) {
  const map = { active:['#D4A853','DAY OF'], upcoming:['#8A9BB0','UPCOMING'], completed:['#7A9E7E','COMPLETED'], archive:['#C8C4BF','ARCHIVED'] }
  const [bg, label] = map[status] || ['#C8C4BF', status.toUpperCase()]
  return <span style={{ background:bg, borderRadius:20, padding:'3px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', fontWeight:600 }}>{label}</span>
}
function ConfirmPill({ status }) {
  const map = { CONFIRMED:'#7A9E7E', PENDING:'#D4A853', DECLINED:'#C4614A' }
  return <span style={{ background:map[status]||'#C8C4BF', borderRadius:20, padding:'2px 8px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', color:'#111', fontWeight:600 }}>{status}</span>
}
function Card({ children, dark, style={} }) {
  return <div style={{ background:dark?'#242220':'#fff', borderRadius:10, padding:'20px 24px', boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)', ...style }}>{children}</div>
}
function SLabel({ children }) {
  return <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#888580', fontWeight:600 }}>{children}</p>
}
function TabBar({ tabs, active, onChange, dark }) {
  const text  = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const border= dark ? '#2E2B28' : '#E0DDD8'
  return (
    <div style={{ display:'flex', borderBottom:`1px solid ${border}`, marginBottom:28 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase',
          color: active===t ? text : muted,
          background:'none', border:'none',
          borderBottom: active===t ? `1.5px solid ${text}` : '1.5px solid transparent',
          padding:'8px 0', marginRight:28, cursor:'pointer', outline:'none',
        }}>{t}</button>
      ))}
    </div>
  )
}

// ─── Show Card (proper component so hover state is not inside .map) ──────────
function ShowCard({ show, status, dark, onClick }) {
  const [hov, setHov] = useState(false)
  const text  = dark ? '#F0EDE8' : '#111'
  const muted = '#888580'
  const card  = dark ? '#242220' : '#fff'
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: card, borderRadius: 10, padding: '20px 24px', marginBottom: 12, cursor: 'pointer',
        boxShadow: hov
          ? (dark ? '0 4px 16px rgba(0,0,0,.4)' : '0 4px 16px rgba(0,0,0,.1)')
          : (dark ? '0 1px 4px rgba(0,0,0,.3)' : '0 1px 8px rgba(0,0,0,.06)'),
        transition: 'box-shadow 150ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontFamily: 'Georgia,serif', fontSize: 22, color: text }}>{show.name}</p>
          <p style={{ margin: '0 0 10px', fontFamily: 'Inter,system-ui', fontSize: 11, color: muted }}>{show.date} · {show.venue} · {show.city}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <StatusPill status={status} />
            <span style={{ fontFamily: 'Inter,system-ui', fontSize: 11, color: muted }}>{show.artistCount} artists</span>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  )
}

// ─── Show Info Tab (shared by all show states) ─────────────────────────────────
function ShowInfoTab({ show, dark }) {
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const fields = [
    ['Show Name', show.name],
    ['Date', show.date],
    ['Venue', show.venue],
    ['City', show.city],
    ['Call Time', show.callTime],
    ['Showtime', show.showtime],
  ]
  return (
    <Card dark={dark} style={{ maxWidth:520 }}>
      {fields.map(([label, value]) => (
        <div key={label} style={{ padding:'12px 0', borderBottom:`1px solid ${border}` }}>
          <p style={{ margin:'0 0 3px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{label}</p>
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{value}</p>
        </div>
      ))}
    </Card>
  )
}

// ─── Add Artist Search Modal ───────────────────────────────────────────────────
function AddArtistModal({ onAdd, onClose, dark, existingNames=[] }) {
  const [q, setQ] = useState('')
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const bg    = dark?'#1A1816':'#F5F2EE'
  const card  = dark?'#242220':'#fff'

  const results = AGENT_ARTISTS
    .filter(a => !existingNames.includes(a.name))
    .filter(a => !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.specialty.toLowerCase().includes(q.toLowerCase()) || a.city.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 12)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:card, borderRadius:12, width:420, maxHeight:'80vh', display:'flex', flexDirection:'column', boxShadow:'0 8px 32px rgba(0,0,0,.2)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ADD ARTIST</p>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:9, fontFamily:'Inter,system-ui', letterSpacing:'0.1em', textTransform:'uppercase', outline:'none' }}>CLOSE</button>
        </div>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${border}` }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, specialty, city…" autoFocus style={{ width:'100%', background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, outline:'none', boxSizing:'border-box' }} />
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {results.map(a => (
            <button key={a.id} onClick={() => { onAdd({ id:`new-${a.id}`, name:a.name, specialty:a.specialty, avatar:a.avatar, confirmed:'PENDING' }); onClose() }} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'10px 16px', background:'none', border:'none', borderBottom:`1px solid ${border}`, cursor:'pointer', outline:'none', textAlign:'left' }}>
              <img src={a.avatar} style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:text }}>{a.name}</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{a.specialty.toUpperCase()} · {a.city}</p>
              </div>
              <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>${a.hourlyRate}/hr</span>
            </button>
          ))}
          {results.length === 0 && <p style={{ padding:'20px 16px', fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>No artists found.</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Add To Show Modal ─────────────────────────────────────────────────────────
function AddToShowModal({ artistNames, upcomingShows, onAdd, onClose, dark }) {
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const card  = dark?'#242220':'#fff'
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:card, borderRadius:12, width:400, boxShadow:'0 8px 32px rgba(0,0,0,.2)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${border}` }}>
          <p style={{ margin:'0 0 4px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ADD TO SHOW</p>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>{artistNames.length} artist{artistNames.length!==1?'s':''} selected</p>
        </div>
        {upcomingShows.length === 0 ? (
          <p style={{ padding:'24px', fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>No upcoming shows available.</p>
        ) : upcomingShows.map(show => (
          <button key={show.id} onClick={() => { onAdd(show.id, artistNames); onClose() }} style={{ display:'block', width:'100%', textAlign:'left', padding:'16px 24px', background:'none', border:'none', borderBottom:`1px solid ${border}`, cursor:'pointer', outline:'none' }}>
            <p style={{ margin:'0 0 3px', fontFamily:'Georgia,serif', fontSize:15, color:text }}>{show.name}</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{show.date} · {show.city}</p>
          </button>
        ))}
        <div style={{ padding:'16px 24px' }}>
          <button onClick={onClose} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:'none', cursor:'pointer', outline:'none' }}>CANCEL</button>
        </div>
      </div>
    </div>
  )
}

// ─── Invoice Panel (right-side fixed overlay) ──────────────────────────────────
function InvoicePanel({ show, onClose, dark }) {
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const bg    = dark?'#1A1816':'#F5F2EE'
  const total = INVOICE_ADJUSTMENTS.reduce((s,i)=>s+i.amount, 0)
  return (
    <div style={{ position:'fixed', top:36, right:0, bottom:0, width:460, background:bg, borderLeft:`1px solid ${border}`, display:'flex', flexDirection:'column', zIndex:100, boxShadow:'-4px 0 16px rgba(0,0,0,.1)' }}>
      <div style={{ padding:'16px 24px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>FOLLOW-UP INVOICE</p>
        <button onClick={onClose} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:'none', cursor:'pointer', outline:'none' }}>CLOSE</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'28px 24px' }}>
        {/* Letterhead */}
        <div style={{ marginBottom:28 }}>
          <p style={{ margin:'0 0 2px', fontFamily:'Georgia,serif', fontSize:22, color:text }}>Art Partner</p>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>Production Agency</p>
        </div>
        <div style={{ height:1, background:border, marginBottom:24 }} />
        <div style={{ marginBottom:24 }}>
          <p style={{ margin:'0 0 4px', fontFamily:'Georgia,serif', fontSize:17, color:text }}>{show.name}</p>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{show.date} · {show.city}</p>
        </div>
        <div style={{ marginBottom:8 }}>
          <p style={{ margin:'0 0 12px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ADDITIONAL CHARGES</p>
          {INVOICE_ADJUSTMENTS.map((item, i) => (
            <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${border}` }}>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{item.desc}</p>
              <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:15, color:text }}>{fmt(item.amount)}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderTop:`2px solid ${border}`, marginTop:4 }}>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>TOTAL DUE</p>
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:26, color:text }}>{fmt(total)}</p>
        </div>
      </div>
      <div style={{ padding:'16px 24px', borderTop:`1px solid ${border}`, flexShrink:0 }}>
        <button onClick={() => window.print()} style={{ width:'100%', padding:'12px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, background:'none', border:`1px solid ${border}`, borderRadius:6, cursor:'pointer', outline:'none' }}>PRINT</button>
      </div>
    </div>
  )
}

// ─── Artist side panel (full-page overlay) ─────────────────────────────────────
function ArtistPanel({ artist, upcomingShows, onAddToShow, onClose, dark }) {
  const [note, setNote] = useState(artist.notes || '')
  const [addModal, setAddModal] = useState(false)
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const bg    = dark?'#1A1816':'#F5F2EE'
  return (
    <>
      <div style={{ position:'fixed', top:36, right:0, bottom:0, width:380, background:bg, borderLeft:`1px solid ${border}`, display:'flex', flexDirection:'column', zIndex:60, overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${border}`, flexShrink:0 }}>
          <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>ARTIST PROFILE</p>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', outline:'none' }}>CLOSE</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
            <img src={artist.avatar} alt={artist.name} style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
            <div>
              <p style={{ margin:'0 0 3px', fontFamily:'Georgia,serif', fontSize:20, color:text }}>{artist.name}</p>
              <p style={{ margin:'0 0 2px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{artist.specialty.toUpperCase()} · {artist.city}</p>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{artist.email}</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
            {[['Experience', `${artist.experience} yrs`],['Times Booked', artist.timesBooked],['Hourly Rate', fmt(artist.hourlyRate)],['Rating', `${artist.rating} ★`]].map(([l,v])=>(
              <div key={l} style={{ background:dark?'#242220':'#fff', borderRadius:8, padding:'10px 12px' }}>
                <p style={{ margin:'0 0 2px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{l}</p>
                <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{v}</p>
              </div>
            ))}
          </div>
          {artist.skills?.length>0 && (<><p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>SKILLS</p><div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>{artist.skills.map(s=><span key={s} style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted, border:`1px solid ${border}`, borderRadius:20, padding:'3px 8px' }}>{s}</span>)}</div></>)}
          {artist.designers?.length>0 && (<><p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>DESIGNER CLIENTS</p><div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>{artist.designers.map(d=><span key={d} style={{ fontFamily:'Inter,system-ui', fontSize:10, color:text, background:dark?'#2A2724':'#EDE9E4', borderRadius:20, padding:'3px 8px' }}>{d}</span>)}</div></>)}
          <p style={{ margin:'0 0 6px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>NOTES</p>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Private notes…" rows={4} style={{ width:'100%', background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, outline:'none', resize:'none', boxSizing:'border-box', marginBottom:16 }} />
          <button onClick={() => setAddModal(true)} style={{ width:'100%', padding:12, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:6, cursor:'pointer', outline:'none', fontWeight:500 }}>ASSIGN TO SHOW</button>
        </div>
      </div>
      {addModal && <AddToShowModal artistNames={[artist.name]} upcomingShows={upcomingShows} onAdd={(showId, names) => { onAddToShow(showId, names); setAddModal(false) }} onClose={() => setAddModal(false)} dark={dark} />}
    </>
  )
}

// ─── Pre-Show Detail ───────────────────────────────────────────────────────────
function PreShowDetail({ show, dark }) {
  const [tab, setTab]       = useState('SHOW INFO')
  const [roster, setRoster] = useState(PRADA_ARTISTS_INIT)
  const [budget, setBudget] = useState(PRADA_PLANNED_BUDGET_INIT)
  const [addArtist, setAddArtist] = useState(false)
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'

  const totalBudget = budget.reduce((s,r)=>s+Number(r.budgeted||0), 0)
  const CATS = ['Artist Fees','Supplies','Travel','Accommodation','Other']

  function addRow() {
    setBudget(b=>[...b, { id:Date.now(), item:'', category:'Other', budgeted:0 }])
  }
  function updateRow(id, field, val) {
    setBudget(b=>b.map(r=>r.id===id ? {...r, [field]: field==='budgeted' ? Number(val)||0 : val} : r))
  }
  function removeRow(id) { setBudget(b=>b.filter(r=>r.id!==id)) }

  return (
    <div>
      <TabBar tabs={['SHOW INFO','ARTIST ROSTER','BUDGET']} active={tab} onChange={setTab} dark={dark} />
      {tab==='SHOW INFO' && <ShowInfoTab show={show} dark={dark} />}
      {tab==='ARTIST ROSTER' && (
        <div>
          {roster.map(a=>(
            <Card key={a.id} dark={dark} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
              <img src={a.avatar} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{a.name}</p>
                <p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</p>
              </div>
              <ConfirmPill status={a.confirmed} />
            </Card>
          ))}
          <button onClick={()=>setAddArtist(true)} style={{ marginTop:8, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'9px 16px', background:'none', cursor:'pointer', outline:'none' }}>+ ADD ARTIST</button>
        </div>
      )}
      {tab==='BUDGET' && (
        <div style={{ maxWidth:720 }}>
          <SLabel>PLANNED BUDGET</SLabel>
          <div style={{ background:dark?'#242220':'#fff', borderRadius:10, boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)', overflow:'hidden', marginBottom:12 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${border}`, background:dark?'#1F1D1B':'#F9F7F5' }}>
                  {['Item','Category','Budgeted Amount',''].map(h=>(
                    <th key={h} style={{ padding:'10px 16px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textAlign:'left', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budget.map(row=>(
                  <tr key={row.id} style={{ borderBottom:`1px solid ${border}` }}>
                    <td style={{ padding:'8px 16px' }}>
                      <input value={row.item} onChange={e=>updateRow(row.id,'item',e.target.value)} style={{ fontFamily:'Inter,system-ui', fontSize:13, color:text, background:'transparent', border:`1px solid ${border}`, borderRadius:4, padding:'4px 8px', outline:'none', width:'100%' }} />
                    </td>
                    <td style={{ padding:'8px 16px' }}>
                      <select value={row.category} onChange={e=>updateRow(row.id,'category',e.target.value)} style={{ fontFamily:'Inter,system-ui', fontSize:11, color:text, background:dark?'#2A2724':'#F5F2EE', border:`1px solid ${border}`, borderRadius:4, padding:'4px 8px', outline:'none', cursor:'pointer' }}>
                        {CATS.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'8px 16px' }}>
                      <input value={row.budgeted} type="number" onChange={e=>updateRow(row.id,'budgeted',e.target.value)} style={{ fontFamily:'Georgia,serif', fontSize:14, color:text, background:'transparent', border:`1px solid ${border}`, borderRadius:4, padding:'4px 8px', outline:'none', width:120, textAlign:'right' }} />
                    </td>
                    <td style={{ padding:'8px 16px', textAlign:'center' }}>
                      <button onClick={()=>removeRow(row.id)} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:14, outline:'none' }}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <button onClick={addRow} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'8px 14px', background:'none', cursor:'pointer', outline:'none' }}>+ ADD LINE ITEM</button>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>TOTAL</span>
              <span style={{ fontFamily:'Georgia,serif', fontSize:22, color:text }}>{fmt(totalBudget)}</span>
            </div>
          </div>
        </div>
      )}
      {addArtist && <AddArtistModal dark={dark} existingNames={roster.map(a=>a.name)} onAdd={a=>setRoster(r=>[...r,a])} onClose={()=>setAddArtist(false)} />}
    </div>
  )
}

// ─── Day-Of Detail ─────────────────────────────────────────────────────────────
function DayOfDetail({ artists, incidents, show, dark }) {
  const [tab, setTab] = useState('SHOW INFO')
  const [addArtist, setAddArtist] = useState(false)
  const [roster, setRoster] = useState(artists)
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const statusDot   = { 'on-site':'#7A9E7E', late:'#D4A853', 'no-show':'#C4614A' }
  const statusLabel = { 'on-site':'On site', late:'Late', 'no-show':'No show' }

  return (
    <div>
      {/* Status board — always visible */}
      <div style={{ marginBottom:28 }}>
        <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ARTIST STATUS BOARD</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {artists.map(a=>(
            <Card key={a.id} dark={dark} style={{ display:'flex', alignItems:'center', gap:14 }}>
              <img src={a.avatar} style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
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
      </div>

      <TabBar tabs={['SHOW INFO','ARTIST ROSTER','BUDGET','RECEIPTS & ADJUSTMENTS']} active={tab} onChange={setTab} dark={dark} />

      {tab==='SHOW INFO' && <ShowInfoTab show={show} dark={dark} />}

      {tab==='ARTIST ROSTER' && (
        <div>
          {roster.map(a=>(
            <Card key={a.id} dark={dark} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
              <img src={a.avatar} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text }}>{a.name}</p>
                <p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</p>
              </div>
              <ConfirmPill status={a.confirmed} />
            </Card>
          ))}
          <button onClick={()=>setAddArtist(true)} style={{ marginTop:8, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'9px 16px', background:'none', cursor:'pointer', outline:'none' }}>+ ADD ARTIST</button>
        </div>
      )}

      {tab==='BUDGET' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px', gap:'6px 12px', padding:'8px 0 10px', borderBottom:`1px solid ${border}`, marginBottom:4 }}>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>ITEM</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textAlign:'right' }}>BUDGETED</p>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textAlign:'right' }}>ADJUSTED</p>
          </div>
          {VS26_RECEIPTS.map(cat=>cat.items.map((item,i)=>{
            const over = (item.actual||0) > (item.budgeted||0)
            return (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px', gap:'6px 12px', padding:'10px 12px', marginBottom:2, borderRadius:6, background: over ? (dark?'rgba(184,134,42,0.12)':'rgba(184,134,42,0.08)') : 'transparent' }}>
                <div>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{item.desc}</p>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{item.artist}</p>
                </div>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right' }}>{fmt(item.budgeted)}</p>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, textAlign:'right', color:over?'#B8862A':text, fontWeight:over?500:400 }}>{fmt(item.actual)}</p>
              </div>
            )
          }))}
        </div>
      )}

      {tab==='RECEIPTS & ADJUSTMENTS' && (
        <div>
          <p style={{ margin:'0 0 14px', fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>Submitted by artists during the show · read only</p>
          {VS26_RECEIPTS_ADJ.map(entry=>(
            <Card key={entry.id} dark={dark} style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:10, marginBottom:4, alignItems:'center', flexWrap:'wrap' }}>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, fontWeight:500, color:text }}>{entry.artist}</p>
                  <span style={{ fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color: entry.type==='Receipt'?'#7A9E7E':'#8A9BB0', background: entry.type==='Receipt'?'rgba(122,158,126,0.12)':'rgba(138,155,176,0.12)', borderRadius:20, padding:'2px 8px' }}>{entry.type}</span>
                  <span style={{ fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{entry.time}</span>
                </div>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, lineHeight:1.5 }}>{entry.item}</p>
              </div>
              <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:16, color:text, flexShrink:0 }}>{fmt(entry.amount)}</p>
            </Card>
          ))}
        </div>
      )}

      {addArtist && <AddArtistModal dark={dark} existingNames={roster.map(a=>a.name)} onAdd={a=>setRoster(r=>[...r,a])} onClose={()=>setAddArtist(false)} />}
    </div>
  )
}

// ─── Wrap Detail (Completed) ───────────────────────────────────────────────────
function WrapDetail({ show, reviewArtists, receipts, dark }) {
  const [tab, setTab]         = useState('SHOW INFO')
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'

  const totalActual  = receipts.reduce((s,cat)=>s+cat.items.reduce((ss,i)=>ss+(i.actual||0),0),0)
  const totalBudget  = receipts.reduce((s,cat)=>s+cat.items.reduce((ss,i)=>ss+(i.budgeted||0),0),0)

  return (
    <div>
      <TabBar tabs={['SHOW INFO','ARTIST REVIEWS','BUDGET']} active={tab} onChange={setTab} dark={dark} />

      {tab==='SHOW INFO' && <ShowInfoTab show={show} dark={dark} />}

      {tab==='ARTIST REVIEWS' && (
        <div>
          {reviewArtists.map(artist=>(
            <Card key={artist.id} dark={dark} style={{ marginBottom:16 }}>
              {/* Artist header */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <img src={artist.avatar} style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', flexShrink:0 }} />
                <div>
                  <p style={{ margin:'0 0 3px', fontFamily:'Georgia,serif', fontSize:17, color:text }}>{artist.name}</p>
                  <p style={{ margin:'0 0 4px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{artist.specialty}</p>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, color:text }}>
                    {artist.avgRating.toFixed(1)} out of 5 stars · based on {artist.reviewCount} review{artist.reviewCount!==1?'s':''}
                  </p>
                </div>
              </div>
              {/* Review quotes */}
              {artist.quotes.map((q, qi) => (
                <p key={qi} style={{ margin:'0 0 8px', fontFamily:'Georgia,serif', fontSize:13, color:text, fontStyle:'italic', paddingLeft:12, borderLeft:`2px solid ${border}` }}>
                  "{q}"
                  <span style={{ display:'block', fontFamily:'Inter,system-ui', fontSize:9, fontStyle:'normal', letterSpacing:'0.08em', textTransform:'uppercase', color:muted, marginTop:4 }}>{REVIEW_REVIEWERS[qi % REVIEW_REVIEWERS.length]} · {qi===0?'ASSISTANT':'ASSISTANT'}</span>
                </p>
              ))}
              {/* Lead review */}
              <div style={{ background:dark?'#2A2724':'#F9F7F5', borderRadius:8, padding:'14px 16px', marginTop:14 }}>
                <p style={{ margin:'0 0 6px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#D4A853' }}>LEAD REVIEW · JEN Z</p>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <Stars n={Math.round(artist.avgRating)} size={14} />
                  <span style={{ fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>May 25, 2026</span>
                </div>
                <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, lineHeight:1.6, fontStyle:'italic' }}>"{artist.leadNote}"</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==='BUDGET' && (
        <div>
          <SLabel>FINAL BUDGET SUMMARY</SLabel>
          {/* Column headers */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 95px 95px 95px', gap:'6px 12px', padding:'6px 12px 8px', borderBottom:`1px solid ${border}`, marginBottom:4 }}>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>ITEM</p>
            {['BUDGETED','ADJUSTED','DIFFERENCE'].map(h=>(
              <p key={h} style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted, textAlign:'right' }}>{h}</p>
            ))}
          </div>
          {receipts.map(cat=>{
            const catAdjusted = cat.items.reduce((s,i)=>s+(i.actual||0),0)
            const catBudget   = cat.items.reduce((s,i)=>s+(i.budgeted||0),0)
            const catDiff     = catAdjusted - catBudget
            return (
              <div key={cat.category}>
                <p style={{ margin:'10px 12px 4px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>{cat.category}</p>
                {cat.items.map((item,i)=>{
                  const diff = (item.actual||0) - (item.budgeted||0)
                  const over = diff > 0
                  return (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 95px 95px 95px', gap:'6px 12px', padding:'8px 12px', borderRadius:6, marginBottom:2, background: over ? (dark?'rgba(184,134,42,0.12)':'rgba(184,134,42,0.08)') : 'transparent' }}>
                      <div><p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{item.desc}</p><p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:10, color:muted }}>{item.artist}</p></div>
                      <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right' }}>{fmt(item.budgeted)}</p>
                      <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right' }}>{fmt(item.actual)}</p>
                      <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, textAlign:'right', color:over?'#C4614A':'#7A9E7E', fontWeight:500 }}>{diff>0?'+':''}{fmt(diff)}</p>
                    </div>
                  )
                })}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 95px 95px 95px', gap:'6px 12px', padding:'8px 12px', borderTop:`1px solid ${border}`, marginTop:2, marginBottom:8 }}>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>Subtotal</p>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right', fontWeight:500 }}>{fmt(catBudget)}</p>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text, textAlign:'right', fontWeight:500 }}>{fmt(catAdjusted)}</p>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, textAlign:'right', color:catDiff>0?'#C4614A':'#7A9E7E', fontWeight:600 }}>{catDiff>0?'+':''}{fmt(catDiff)}</p>
                </div>
              </div>
            )
          })}
          {/* Grand total */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 95px 95px 95px', gap:'6px 12px', padding:'12px', borderTop:`2px solid ${border}`, marginTop:4 }}>
            <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, fontWeight:600 }}>TOTAL</p>
            <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:18, color:text, textAlign:'right' }}>{fmt(totalBudget)}</p>
            <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:18, color:text, textAlign:'right' }}>{fmt(totalActual)}</p>
            <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:18, textAlign:'right', color:(totalActual-totalBudget)>0?'#C4614A':'#7A9E7E' }}>{(totalActual-totalBudget)>0?'+':''}{fmt(totalActual-totalBudget)}</p>
          </div>

          <div style={{ marginTop:20 }}>
            <SLabel>BUDGET ADJUSTMENTS</SLabel>
            <Card dark={dark} style={{ marginBottom:12 }}>
              {INVOICE_ADJUSTMENTS.map((item,i)=>(
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom: i<INVOICE_ADJUSTMENTS.length-1?`1px solid ${border}`:'none' }}>
                  <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{item.desc}</p>
                  <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:15, color:text }}>{fmt(item.amount)}</p>
                </div>
              ))}
            </Card>
          </div>

          <div style={{ marginTop:28, display:'flex', justifyContent:'flex-end', gap:12 }}>
            <button onClick={() => window.print()} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:text, border:`1px solid ${border}`, borderRadius:6, padding:'11px 22px', background:'none', cursor:'pointer', outline:'none' }}>EXPORT FOR INVOICE</button>
            <button onClick={() => setInvoiceOpen(true)} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:6, padding:'11px 22px', cursor:'pointer', outline:'none', fontWeight:500 }}>GENERATE FOLLOW-UP INVOICE</button>
          </div>

          {invoiceOpen && <InvoicePanel show={show} onClose={() => setInvoiceOpen(false)} dark={dark} />}
        </div>
      )}
    </div>
  )
}

// ─── Artists View ──────────────────────────────────────────────────────────────
const ALL_DESIGNERS = ['Valentino','Prada','Jacquemus','Oscar de la Renta','Diesel','Chanel','Dior','Givenchy','Balenciaga','Saint Laurent','Versace','Fendi','Bottega Veneta','Burberry','Alexander McQueen']
const ALL_SKILLS    = ['Eyebrow bleaching','Hair extensions','Tooth gems','Editorial makeup','Avant-garde color','Airbrush','Special effects','Natural glam','Nail art','Gel extensions','Acrylic','Press-on sets','Braiding','Wig styling','Color correction']
const ALL_CITIES    = ['New York','Paris','Milan','London','Los Angeles','Tokyo','Sydney','Berlin']

function applyFilters(artists, f) {
  return artists.filter(a => {
    if (f.specialty && a.specialty !== f.specialty) return false
    if (f.cities?.length && !f.cities.includes(a.city)) return false
    if (f.minHourlyRate && a.hourlyRate < f.minHourlyRate) return false
    if (f.maxHourlyRate && a.hourlyRate > f.maxHourlyRate) return false
    if (f.minRating && a.rating < f.minRating) return false
    if (f.minExperience && a.experience < f.minExperience) return false
    if (f.designerTags?.length && !f.designerTags.some(d => a.designers.includes(d))) return false
    if (f.skillTags?.length && !f.skillTags.some(s => a.skills.includes(s))) return false
    return true
  })
}
function applySort(artists, sort) {
  return [...artists].sort((a,b) => {
    const dir = sort.dir==='asc' ? 1 : -1
    switch(sort.col) {
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

function ArtistsView({ dark, upcomingShows, onAddArtistsToShow }) {
  const [sort, setSort]         = useState({ col:'name', dir:'asc' })
  const [filters, setFilters]   = useState({})
  const [fSpec, setFSpec]       = useState('')
  const [fCity, setFCity]       = useState('')
  const [fMinRate, setFMinRate] = useState('')
  const [fMaxRate, setFMaxRate] = useState('')
  const [fMinRating, setFMinRating] = useState('')
  const [fDesigner, setFDesigner]   = useState('')
  const [fSkill, setFSkill]         = useState('')
  const [nlQuery, setNlQuery]     = useState('')
  const [nameFilter, setNameFilter] = useState('')  // real-time name search
  const [nlLoading, setNlLoading] = useState(false)
  const [nlError, setNlError]   = useState('')
  const [selected, setSelected] = useState(null)
  const [checked, setChecked]   = useState(new Set())
  const [addToShowModal, setAddToShowModal] = useState(false)

  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const card  = dark?'#242220':'#fff'
  const bg    = dark?'#1F1D1B':'#F9F7F5'

  const activeFilters = {
    specialty:     fSpec || filters.specialty || null,
    cities:        fCity ? [fCity] : (filters.cities || null),
    minHourlyRate: fMinRate ? parseInt(fMinRate) : (filters.minHourlyRate || null),
    maxHourlyRate: fMaxRate ? parseInt(fMaxRate) : (filters.maxHourlyRate || null),
    minRating:     fMinRating ? parseFloat(fMinRating) : (filters.minRating || null),
    minExperience: filters.minExperience || null,
    designerTags:  fDesigner ? [fDesigner] : (filters.designerTags || null),
    skillTags:     fSkill ? [fSkill] : (filters.skillTags || null),
  }
  const hasFilters = Object.values(activeFilters).some(v => v !== null && (Array.isArray(v) ? v.length>0 : true)) || !!nameFilter

  const filtered = applyFilters(AGENT_ARTISTS, activeFilters).filter(a =>
    !nameFilter || a.name.toLowerCase().includes(nameFilter.toLowerCase())
  )
  const sorted   = applySort(filtered, sort)

  function toggleSort(col) {
    setSort(s => s.col===col ? { col, dir: s.dir==='asc'?'desc':'asc' } : { col, dir:'asc' })
  }
  function clearAll() {
    setFilters({}); setFSpec(''); setFCity(''); setFMinRate(''); setFMaxRate(''); setFMinRating(''); setFDesigner(''); setFSkill(''); setNlQuery(''); setNameFilter(''); setChecked(new Set())
  }
  function toggleCheck(id, e) {
    e.stopPropagation()
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  function toggleAll(e) {
    if (checked.size === sorted.length) { setChecked(new Set()) }
    else { setChecked(new Set(sorted.map(a=>a.id))) }
  }

  async function handleNLSearch(e) {
    e.preventDefault()
    if (!nlQuery.trim()) return
    setNlLoading(true); setNlError(''); setNameFilter('')
    try {
      const res = await fetch('/api/search-artists', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ query: nlQuery }) })
      const data = await res.json()
      if (data.error && !data.filters) { setNlError(data.error); return }
      const f = data.filters || {}
      // Map API response keys to filter state
      setFilters({
        specialty:     f.specialty ? f.specialty.toLowerCase() : null,
        cities:        f.city ? [f.city] : null,
        maxHourlyRate: f.maxRate || null,
        minRating:     f.minRating || null,
        minExperience: f.minYears || null,
        designerTags:  f.designers?.length ? f.designers : null,
        skillTags:     f.skills?.length ? f.skills : null,
      })
      setFSpec(''); setFCity(''); setFMinRate(''); setFMaxRate(''); setFMinRating(''); setFDesigner(''); setFSkill('')
    } catch {
      // Fallback: keyword match on name
      setFilters({})
      setFSpec('')
      const q = nlQuery.toLowerCase()
      setFilters(prev => ({ ...prev, _nameKeyword: q }))
      setNlError('Search unavailable — showing name matches.')
    } finally {
      setNlLoading(false)
    }
  }

  const thStyle = col => ({
    padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase',
    color: sort.col===col ? text : muted, cursor:'pointer', background:'none', border:'none', outline:'none',
    whiteSpace:'nowrap', textAlign:'left', userSelect:'none',
  })
  const arrow = col => sort.col===col ? (sort.dir==='asc' ? ' ▲' : ' ▼') : ''
  const selStyle = { fontFamily:'Inter,system-ui', fontSize:10, color:text, background:'transparent', border:`1px solid ${border}`, borderRadius:4, padding:'3px 6px', outline:'none', cursor:'pointer' }

  const checkedArtists = sorted.filter(a => checked.has(a.id))

  return (
    <>
      <p style={{ margin:'0 0 16px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Artists</p>

      {/* NL search */}
      <form onSubmit={handleNLSearch} style={{ display:'flex', gap:8, marginBottom:12 }}>
        <input value={nlQuery} onChange={e=>{ setNlQuery(e.target.value); setNameFilter(e.target.value); setFilters({}) }} placeholder="Search artists by name, or try 'nail artists in NYC under $100/hr' and hit Search" style={{ flex:1, fontFamily:'Inter,system-ui', fontSize:13, color:text, background:card, border:`1px solid ${border}`, borderRadius:8, padding:'10px 14px', outline:'none' }} />
        <button type="submit" disabled={nlLoading} style={{ padding:'10px 18px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:8, cursor:'pointer', outline:'none', fontWeight:500, opacity:nlLoading?0.6:1, flexShrink:0 }}>
          {nlLoading ? '···' : 'SEARCH'}
        </button>
        {(hasFilters || nlQuery) && (
          <button type="button" onClick={clearAll} style={{ padding:'10px 14px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:`1px solid ${border}`, borderRadius:8, cursor:'pointer', outline:'none', flexShrink:0, whiteSpace:'nowrap' }}>CLEAR ALL</button>
        )}
      </form>
      {nlError && <p style={{ margin:'0 0 10px', fontFamily:'Inter,system-ui', fontSize:11, color:'#C4614A' }}>{nlError}</p>}

      {/* Bulk action */}
      {checked.size > 0 && (
        <div style={{ marginBottom:12 }}>
          <button onClick={() => setAddToShowModal(true)} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', background:'#D4A853', border:'none', borderRadius:6, padding:'10px 18px', cursor:'pointer', outline:'none', fontWeight:500 }}>
            ADD TO SHOW ({checked.size} SELECTED)
          </button>
        </div>
      )}

      <p style={{ margin:'0 0 10px', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{sorted.length} artist{sorted.length!==1?'s':''}{hasFilters?' (filtered)':''}</p>

      {/* Table — full width, no maxWidth */}
      <div style={{ overflowX:'auto', background:card, borderRadius:10, boxShadow:dark?'0 1px 4px rgba(0,0,0,.3)':'0 1px 8px rgba(0,0,0,.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'auto' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${border}` }}>
              <th style={{ padding:'8px 10px', width:36 }}>
                <input type="checkbox" checked={checked.size===sorted.length && sorted.length>0} onChange={toggleAll} style={{ cursor:'pointer' }} />
              </th>
              <th style={{ padding:0, width:44 }}></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('name')} style={thStyle('name')}>Name{arrow('name')}</button></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('specialty')} style={thStyle('specialty')}>Specialty{arrow('specialty')}</button></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('city')} style={thStyle('city')}>City{arrow('city')}</button></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('experience')} style={thStyle('experience')}>Exp{arrow('experience')}</button></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('timesBooked')} style={thStyle('timesBooked')}>Booked{arrow('timesBooked')}</button></th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('rating')} style={thStyle('rating')}>Rating{arrow('rating')}</button></th>
              <th style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textAlign:'left' }}>Designers</th>
              <th style={{ padding:0 }}><button onClick={()=>toggleSort('hourlyRate')} style={thStyle('hourlyRate')}>Rate{arrow('hourlyRate')}</button></th>
              <th style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textAlign:'left' }}>Skills</th>
              <th style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>Link</th>
            </tr>
            {/* Filter row */}
            <tr style={{ borderBottom:`1px solid ${border}`, background:bg }}>
              <td /><td />
              <td style={{ padding:'4px 6px' }}></td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fSpec} onChange={e=>setFSpec(e.target.value)} style={selStyle}>
                  <option value="">All</option>
                  {['hair','makeup','nails'].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fCity} onChange={e=>setFCity(e.target.value)} style={{ ...selStyle, minWidth:160 }}>
                  <option value="">All cities</option>
                  {ALL_CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td /><td />
              <td style={{ padding:'4px 6px' }}>
                <select value={fMinRating} onChange={e=>setFMinRating(e.target.value)} style={selStyle}>
                  <option value="">Any</option>
                  {['3.0','3.5','4.0','4.5'].map(r=><option key={r} value={r}>{r}+</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fDesigner} onChange={e=>setFDesigner(e.target.value)} style={selStyle}>
                  <option value="">Any</option>
                  {ALL_DESIGNERS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <div style={{ display:'flex', gap:3 }}>
                  <input value={fMinRate} onChange={e=>setFMinRate(e.target.value)} placeholder="$min" type="number" style={{ ...selStyle, width:52 }} />
                  <input value={fMaxRate} onChange={e=>setFMaxRate(e.target.value)} placeholder="$max" type="number" style={{ ...selStyle, width:52 }} />
                </div>
              </td>
              <td style={{ padding:'4px 6px' }}>
                <select value={fSkill} onChange={e=>setFSkill(e.target.value)} style={selStyle}>
                  <option value="">Any</option>
                  {ALL_SKILLS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td />
            </tr>
          </thead>
          <tbody>
            {sorted.map(a => (
              <tr key={a.id} onClick={() => setSelected(selected?.id===a.id ? null : a)} style={{ borderBottom:`1px solid ${border}`, cursor:'pointer', background:selected?.id===a.id?(dark?'#2A2724':'#F0EDE8'):'transparent', transition:'background 100ms' }}>
                <td style={{ padding:'8px 10px' }} onClick={e=>e.stopPropagation()}>
                  <input type="checkbox" checked={checked.has(a.id)} onChange={e=>toggleCheck(a.id,e)} style={{ cursor:'pointer' }} />
                </td>
                <td style={{ padding:'8px 10px' }}>
                  <img src={a.avatar} style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
                </td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>{a.name}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{a.specialty}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:11, color:muted, whiteSpace:'nowrap' }}>{a.city}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, textAlign:'center' }}>{a.experience}y</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, textAlign:'center' }}>{a.timesBooked}</td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>{a.rating} ★ <span style={{ fontSize:10, color:muted }}>({a.ratingCount})</span></td>
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {a.designers.slice(0,2).map(d=><span key={d} style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted, background:dark?'#2A2724':'#EDE9E4', borderRadius:20, padding:'2px 6px', whiteSpace:'nowrap' }}>{d}</span>)}
                    {a.designers.length>2 && <span style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted }}>+{a.designers.length-2}</span>}
                  </div>
                </td>
                <td style={{ padding:'8px 10px', fontFamily:'Inter,system-ui', fontSize:12, color:text, whiteSpace:'nowrap' }}>${a.hourlyRate}/hr</td>
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {a.skills.slice(0,2).map(s=><span key={s} style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted, border:`1px solid ${border}`, borderRadius:20, padding:'2px 6px', whiteSpace:'nowrap' }}>{s}</span>)}
                    {a.skills.length>2 && <span style={{ fontFamily:'Inter,system-ui', fontSize:9, color:muted }}>+{a.skills.length-2}</span>}
                  </div>
                </td>
                <td style={{ padding:'8px 10px', textAlign:'center' }}>
                  <a href={a.portfolioUrl} onClick={e=>e.stopPropagation()} style={{ color:muted }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Artist panel — fixed overlay, table stays full width */}
      {selected && (
        <ArtistPanel artist={selected} upcomingShows={upcomingShows} onAddToShow={onAddArtistsToShow} onClose={() => setSelected(null)} dark={dark} />
      )}

      {/* Add to show modal (bulk) */}
      {addToShowModal && (
        <AddToShowModal artistNames={checkedArtists.map(a=>a.name)} upcomingShows={upcomingShows} onAdd={(showId, names) => { onAddArtistsToShow(showId, names); setChecked(new Set()); setAddToShowModal(false) }} onClose={() => setAddToShowModal(false)} dark={dark} />
      )}
    </>
  )
}

// ─── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage({ dark, onToggleDark, onLogOut }) {
  const [email, setEmail] = useState('alexis.monroe@showpartner.io')
  const [phone, setPhone] = useState('+1 212 555 0200')
  const [dayAlerts, setDayAlerts] = useState(true)
  const [postReport, setPostReport] = useState(true)
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  function Toggle({ value, onChange }) {
    return <button onClick={()=>onChange(!value)} style={{ position:'relative', width:40, height:22, borderRadius:11, background:value?'#7A9E7E':'#888580', border:'none', cursor:'pointer', outline:'none', flexShrink:0, transition:'background 150ms' }}><span style={{ position:'absolute', top:3, left:value?21:3, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 150ms', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} /></button>
  }
  function Row({ label, sub, children }) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:`1px solid ${border}` }}><div><p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:13, color:text }}>{label}</p>{sub&&<p style={{ margin:'2px 0 0', fontFamily:'Inter,system-ui', fontSize:11, color:muted }}>{sub}</p>}</div>{children}</div>
  }
  const inputStyle = { fontFamily:'Inter,system-ui', fontSize:12, color:text, background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'6px 10px', outline:'none', width:220 }
  return (
    <div style={{ maxWidth:560 }}>
      <p style={{ margin:'0 0 28px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Settings</p>
      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>ACCOUNT</p>
      <Card dark={dark} style={{ marginBottom:28 }}>
        <Row label="Name" sub="Alexis Monroe"><span style={{ fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>Agent</span></Row>
        <Row label="Email"><input value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} /></Row>
        <Row label="Phone"><input value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle} /></Row>
      </Card>
      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>NOTIFICATIONS</p>
      <Card dark={dark} style={{ marginBottom:28 }}>
        <Row label="Show day-of alerts" sub="Notify when artists check in or log incidents"><Toggle value={dayAlerts} onChange={setDayAlerts} /></Row>
        <Row label="Post-show report ready" sub="Notify when wrap report is available"><Toggle value={postReport} onChange={setPostReport} /></Row>
      </Card>
      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>APPEARANCE</p>
      <Card dark={dark} style={{ marginBottom:28 }}><Row label="Dark mode"><Toggle value={dark} onChange={onToggleDark} /></Row></Card>
      <p style={{ margin:'0 0 8px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>SHOW PARTNER</p>
      <Card dark={dark} style={{ marginBottom:40 }}><Row label="Version"><span style={{ fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>1.0</span></Row></Card>
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
  // Show rosters (mutable, for ADD ARTIST functionality)
  const [showRosters, setShowRosters] = useState({})

  const demoPhase = DEMO_PHASES[demoPhaseIdx]

  function getShowStatus(show) {
    if (show.baseStatus === 'archive') return 'archive'
    if (show.id==='vs26') { if (demoPhaseIdx===0) return 'upcoming'; if (demoPhaseIdx===1) return 'active'; return 'completed' }
    return show.baseStatus
  }
  function cycleDemoPhase(dir) { setDemoPhaseIdx(i=>(i+dir+3)%3); setSelectedShow(null) }

  function handleAddArtistsToShow(showId, artistNames) {
    setShowRosters(prev => ({
      ...prev,
      [showId]: [
        ...(prev[showId] || []),
        ...artistNames.filter(n => !(prev[showId]||[]).some(a=>a.name===n)).map((n,i) => ({
          id: `added-${Date.now()}-${i}`, name:n, specialty:'TBD', avatar:'https://i.pravatar.cc/150?img=1', confirmed:'PENDING'
        }))
      ]
    }))
  }

  const bg    = dark?'#1A1816':'#F5F2EE'
  const text  = dark?'#F0EDE8':'#111'
  const muted = '#888580'
  const border= dark?'#2E2B28':'#E0DDD8'
  const card  = dark?'#242220':'#fff'
  const DEMO_BAR_H = 36
  const SIDEBAR_W  = 220

  const upcomingShows = ALL_SHOWS.filter(s => getShowStatus(s) === 'upcoming')

  const filteredShows = ALL_SHOWS.filter(s => {
    const st = getShowStatus(s)
    if (showFilter==='all') return true
    if (showFilter==='completed') return st==='completed'
    if (showFilter==='archive') return st==='archive'
    return st === showFilter
  })

  function renderShowDetail(show) {
    const status = getShowStatus(show)
    const phase  = status==='upcoming'  ? 'pre'
                 : status==='active'    ? 'day'
                 : 'wrap'
    const receipts = show.id==='jlp' ? JACQ_RECEIPTS : VS26_RECEIPTS
    return (
      <div style={{ overflowY:'auto', height:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
          <button onClick={()=>setSelectedShow(null)} style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:muted, display:'flex', alignItems:'center', gap:6, fontFamily:'Inter,system-ui', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', padding:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shows
          </button>
          <div style={{ width:1, height:16, background:border }} />
          <p style={{ margin:0, fontFamily:'Georgia,serif', fontSize:20, color:text }}>{show.name}</p>
          <StatusPill status={status} />
        </div>
        {phase==='pre'  && <PreShowDetail show={show} dark={dark} />}
        {phase==='day'  && <DayOfDetail artists={VS26_ARTISTS} incidents={incidents} show={show} dark={dark} />}
        {phase==='wrap' && <WrapDetail show={show} reviewArtists={REVIEW_ARTISTS} receipts={receipts} dark={dark} />}
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
          <button onClick={()=>cycleDemoPhase(-1)} style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:'#888580', fontSize:16, padding:'0 4px' }}>‹</button>
          <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111' }}>Viewing: <strong>{demoPhase}</strong></span>
          <button onClick={()=>cycleDemoPhase(1)}  style={{ background:'none', border:'none', cursor:'pointer', outline:'none', color:'#888580', fontSize:16, padding:'0 4px' }}>›</button>
        </div>
        <span style={{ fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888580' }}>Valentino SS26 reflects selected phase</span>
      </div>

      {/* Sidebar */}
      <div style={{ position:'fixed', top:DEMO_BAR_H, left:0, bottom:0, width:SIDEBAR_W, background:dark?'#111110':bg, borderRight:`0.5px solid ${border}`, display:'flex', flexDirection:'column', zIndex:100 }}>
        <div style={{ padding:'28px 20px 20px', borderBottom:`0.5px solid ${border}` }}>
          <p style={{ margin:'0 0 14px', fontFamily:'Georgia,serif', fontSize:18, color:text, lineHeight:1 }}>Show Partner</p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="/lead/Jen-Z.png" alt="Alexis" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', objectPosition:'center top' }} />
            <div>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:12, fontWeight:500, color:text }}>Alexis Monroe</p>
              <p style={{ margin:0, fontFamily:'Inter,system-ui', fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase', color:muted }}>AGENT</p>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'16px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = nav===item.id
            return (
              <button key={item.id} onClick={()=>{ setNav(item.id); setSelectedShow(null) }} style={{ display:'block', width:'100%', textAlign:'left', padding:'11px 20px', fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:isActive?text:muted, background:'none', border:'none', outline:'none', cursor:'pointer', borderLeft:isActive?`2px solid ${text}`:'2px solid transparent', fontWeight:isActive?500:400 }}>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:`0.5px solid ${border}` }}>
          <button onClick={onToggleDark} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', outline:'none', marginBottom:10, padding:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5" strokeLinecap="round">
              {dark?<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>:<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
            </svg>
            <span style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:muted }}>{dark?'Light':'Dark'} mode</span>
          </button>
          <button onClick={onLogOut} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:muted, background:'none', border:'none', cursor:'pointer', outline:'none', padding:0 }}>Log out</button>
        </div>
      </div>

      {/* Main content — fixed scrolling container so it scrolls independently of sidebar */}
      <div style={{ position:'fixed', top:DEMO_BAR_H, left:SIDEBAR_W, right:0, bottom:0, overflowY:'auto' }}>
        <div style={{ padding:40, maxWidth: nav==='artists' ? 'none' : 960 }}>

          {/* ── SHOWS ── */}
          {nav==='shows' && !selectedShow && (
            <div>
              <p style={{ margin:'0 0 24px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Shows</p>
              {/* Filter tabs */}
              <div style={{ display:'flex', borderBottom:`1px solid ${border}`, marginBottom:28 }}>
                {['all','upcoming','active','completed','archive'].map(f=>(
                  <button key={f} onClick={()=>setShowFilter(f)} style={{ fontFamily:'Inter,system-ui', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:showFilter===f?text:muted, background:'none', border:'none', borderBottom:showFilter===f?`1.5px solid ${text}`:'1.5px solid transparent', padding:'8px 0', marginRight:24, cursor:'pointer', outline:'none' }}>
                    {f==='all'?'ALL SHOWS':f.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Show cards — whole card clickable */}
              {filteredShows.map(show => {
                const status = getShowStatus(show)
                return (
                  <ShowCard
                    key={show.id}
                    show={show}
                    status={status}
                    dark={dark}
                    onClick={() => setSelectedShow(show)}
                  />
                )
              })}
            </div>
          )}
          {nav==='shows' && selectedShow && renderShowDetail(selectedShow)}

          {/* ── ARTISTS ── */}
          {nav==='artists' && (
            <ArtistsView dark={dark} upcomingShows={upcomingShows} onAddArtistsToShow={handleAddArtistsToShow} />
          )}

          {/* ── EMERGENCY BOARD ── */}
          {nav==='emergency' && (
            <div>
              <p style={{ margin:'0 0 6px', fontFamily:'Georgia,serif', fontSize:28, color:text }}>Emergency Board</p>
              <p style={{ margin:'0 0 24px', fontFamily:'Inter,system-ui', fontSize:12, color:muted }}>Incidents logged by the on-site Lead · read only</p>
              {incidents.length===0 ? (
                <p style={{ fontFamily:'Inter,system-ui', fontSize:13, color:muted }}>No active incidents.</p>
              ) : incidents.map((inc,i)=>(
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

          {/* ── SETTINGS ── */}
          {nav==='settings' && <SettingsPage dark={dark} onToggleDark={onToggleDark} onLogOut={onLogOut} />}
        </div>
      </div>
    </div>
  )
}
