import { useState, useEffect, useRef } from 'react'
import {
  models as initModels,
  profiles,
  timeline as timelineData,
  announcements as initAnnouncements,
  show,
} from '../data/mockData'

const SVC       = 'makeup'
const SVC_LABEL = 'Makeup'
const BG = '#F5F2EE', BD = '#E0DDD8', TX = '#111', MT = '#4A4743', M2 = '#6E6A64', DV = '#CFCAC4'

const CHIP_STATUS = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: '#E8E4DF', t: 'Not started' },
}

const DS = {
  ready: 8,
  hair:   { done: 14, ip: 9, pa: 2 },
  makeup: { done: 17, ip: 8, pa: 0 },
  nails:  { done: 9,  ip: 6, pa: 0 },
}

function pct(n) { return (n / 30 * 100).toFixed(1) + '%' }
function svcChip(entry, wkActive) {
  if (!entry) return CHIP_STATUS.not_started
  if (wkActive && entry.status === 'in_progress') return CHIP_STATUS.paused
  return CHIP_STATUS[entry.status] || CHIP_STATUS.not_started
}
function fmtNow() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
function winSize() { return { w: window.innerWidth, h: window.innerHeight } }

function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false)
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (err || !src) {
    return (
      <span style={{ width: size, height: size, borderRadius: '50%', background: '#E0DDD8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.33), color: M2, fontFamily: 'Inter,system-ui,sans-serif' }}>
        {ini}
      </span>
    )
  }
  return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={() => setErr(true)} />
}

function Chip({ c, t }) {
  return (
    <span style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999, padding: '4px 8px', color: TX, background: c, whiteSpace: 'nowrap', justifySelf: 'start' }}>
      {t}
    </span>
  )
}

function Lbl({ children, style: s }) {
  return <p style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, margin: 0, ...s }}>{children}</p>
}

function Bar({ segments, dark }) {
  return (
    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: dark ? '#3A3734' : '#E8E4DF' }}>
      {segments.map((s, i) => <span key={i} style={{ width: s.w, background: s.c }} />)}
    </div>
  )
}

function PanelButtons({ onStart, onCompose, wide, startLabel = 'START WALKTHROUGH' }) {
  return (
    <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}`, display: wide ? 'grid' : 'flex', gridTemplateColumns: wide ? '1fr 1fr' : undefined, flexDirection: wide ? undefined : 'column', gap: 8 }}>
      <button onClick={onStart} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer', whiteSpace: 'nowrap' }}>{startLabel}</button>
      <button onClick={onCompose} style={{ minHeight: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>ANNOUNCE</button>
    </div>
  )
}

function DefaultPanel({ tlItems, announcements, onStartWalkthrough, onCompose, wide }) {
  return (
    <>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: `1px solid ${BD}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Lbl>Today</Lbl><Lbl>Show in 2h 15m</Lbl>
        </div>
        {tlItems.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36, padding: '0 10px', margin: '0 -10px', borderRadius: 8, background: t.kind === 'next' ? TX : 'transparent' }}>
            <span style={{ width: 64, fontSize: 12, whiteSpace: 'nowrap', color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.time}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: t.kind === 'next' ? 600 : 400, color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.label}</span>
            <span style={{ fontSize: 11, whiteSpace: 'nowrap', color: t.kind === 'next' ? '#E8C77A' : M2 }}>{t.state}</span>
          </div>
        ))}
        <button onClick={() => {}} style={{ alignSelf: 'flex-start', marginTop: 6, minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: TX, cursor: 'pointer' }}>Push walkthrough time</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Lbl>Announcements</Lbl>
        {announcements.map((ann, i) => {
          const { got, unopened, undelivered } = ann.delivery
          const total = got + unopened + undelivered
          const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '0%'
          if (i === 0) return (
            <div key={ann.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ann.text}</span>
                <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap' }}>Auto · {ann.sentAt}</span>
              </div>
              <span style={{ fontSize: 12, color: MT }}>To all 26 assistants</span>
              <Bar segments={[{ w: gotPct, c: TX }]} />
              <span style={{ fontSize: 12 }}>{got} got it · {unopened} haven't opened · {undelivered} not delivered</span>
            </div>
          )
          return (
            <div key={ann.id} style={{ padding: '0 2px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: MT }}>{ann.text}</span>
              <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap', marginLeft: 8 }}>Auto · {ann.sentAt} · {ann.delivery.got} got it</span>
            </div>
          )
        })}
      </div>
      <PanelButtons onStart={onStartWalkthrough} onCompose={onCompose} wide={wide} />
    </>
  )
}

function WalkthroughPanel({ elapsed, startedAt, announcements, onModelsBack, onCompose, wide }) {
  return (
    <>
      <div style={{ margin: '16px 20px 0', background: TX, color: '#F5F2EE', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Lbl s={{ color: '#C9C4BE' }}>Walkthrough · started {startedAt}</Lbl>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 44, lineHeight: 1 }}>{elapsed} min</span>
        <span style={{ fontSize: 12, color: '#E0DDD8' }}>All work paused · models back at 4:30</span>
        <button style={{ alignSelf: 'flex-start', minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: '#F5F2EE', cursor: 'pointer' }}>Change time</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Lbl>Announcements</Lbl>
        {announcements.map((ann, i) => {
          const { got, unopened, undelivered } = ann.delivery
          const total = got + unopened + undelivered
          const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '96%'
          if (i === 0) return (
            <div key={ann.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ann.text}</span>
                <span style={{ fontSize: 11, color: MT }}>{ann.sentAt}</span>
              </div>
              <Bar segments={[{ w: gotPct, c: TX }]} />
              <span style={{ fontSize: 12 }}>{total > 0 ? `${got} of ${total} got it` : '25 of 26 got it'}</span>
            </div>
          )
          return (
            <div key={ann.id} style={{ padding: '0 2px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: MT }}>{ann.text}</span>
              <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap', marginLeft: 8 }}>{ann.sentAt} · {ann.delivery.got} got it</span>
            </div>
          )
        })}
      </div>
      <PanelButtons onStart={onModelsBack} onCompose={onCompose} wide={wide} startLabel="MODELS BACK · RESUME" />
    </>
  )
}

function PairingPanel({ model, assistants, selected, onSelect, onConfirm, onClose }) {
  const selectedName = assistants.find(a => a.id === selected)?.name || ''
  return (
    <>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar src={model.avatar} name={model.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: MT, marginBottom: 2 }}>Look {model.look} · {model.arrived ? `arrived ${model.arrivedAt}` : `ETA ${model.eta}`}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{model.name}</div>
        </div>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 18, color: M2, cursor: 'pointer', lineHeight: 1, padding: 4 }} aria-label="Close pairing">×</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px' }}>
        <Lbl s={{ marginBottom: 10 }}>Send to</Lbl>
        {assistants.map(a => {
          const isSel = selected === a.id
          return (
            <button key={a.id} onClick={() => onSelect(a.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, marginBottom: 4, border: isSel ? `1.5px solid ${TX}` : `1px solid transparent`, background: isSel ? '#F5F2EE' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
              <input type="radio" readOnly checked={isSel} style={{ accentColor: TX, width: 16, height: 16, flexShrink: 0 }} />
              <Avatar src={a.avatar} name={a.name} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: a.free ? '#7A9E7E' : MT }}>{a.free ? 'Free' : `With ${a.currentModelName}`}</div>
              </div>
            </button>
          )
        })}
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
        <button onClick={onConfirm} disabled={!selected} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: selected ? TX : DV, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: selected ? 'pointer' : 'default', textTransform: 'uppercase' }}>
          {selected && selectedName ? `SEND ${model.name.split(' ')[0].toUpperCase()} TO ${selectedName.split(' ')[0].toUpperCase()}` : 'SELECT AN ASSISTANT'}
        </button>
      </div>
    </>
  )
}

const QUICK_MSGS = ['Models are back', 'Dressing in 10', 'Final touch-ups now']
const SCHEDULED_WARNINGS = [
  { id: 'sw-1', time: '3:45 PM', text: 'Walkthrough in 15 minutes' },
  { id: 'sw-2', time: '4:30 PM', text: 'Models are back (auto)'    },
]

function ComposePanel({ msg, onMsg, to, onTo, onSend, onClose }) {
  const toOptions = [
    { id: 'all',    label: 'All assistants 26' },
    { id: 'lead',   label: 'Lead assistants 2' },
    { id: 'yadim',  label: 'Yadim'             },
    { id: 'select', label: 'Select people'     },
  ]
  return (
    <>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>New announcement</span>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 18, color: M2, cursor: 'pointer', lineHeight: 1, padding: 4 }} aria-label="Close">×</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Lbl s={{ marginBottom: 8 }}>To</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {toOptions.map(opt => (
              <button key={opt.id} onClick={() => onTo(opt.id)} style={{ minHeight: 34, padding: '0 12px', borderRadius: 999, cursor: 'pointer', border: to === opt.id ? `1px solid ${TX}` : `1px solid ${DV}`, background: to === opt.id ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: to === opt.id ? '#fff' : TX }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <Lbl s={{ marginBottom: 8 }}>Quick messages</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {QUICK_MSGS.map(q => (
              <button key={q} onClick={() => onMsg(q)} style={{ padding: '8px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', border: msg === q ? `1px solid ${TX}` : `1px solid ${DV}`, background: msg === q ? '#F0EDE8' : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX }}>{q}</button>
            ))}
          </div>
        </div>
        <textarea value={msg} onChange={e => onMsg(e.target.value)} placeholder="Or write your own" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
        <div>
          <Lbl s={{ marginBottom: 8 }}>Scheduled</Lbl>
          {SCHEDULED_WARNINGS.map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${BD}` }}>
              <div>
                <div style={{ fontSize: 12 }}>{w.text}</div>
                <div style={{ fontSize: 11, color: MT }}>{w.time}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ border: 0, background: 'none', fontSize: 11, color: TX, textDecoration: 'underline', cursor: 'pointer' }}>Edit</button>
                <button style={{ border: 0, background: 'none', fontSize: 11, color: MT, textDecoration: 'underline', cursor: 'pointer' }}>Skip</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
        <button onClick={onSend} disabled={!msg.trim()} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: msg.trim() ? TX : DV, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: msg.trim() ? 'pointer' : 'default' }}>SEND</button>
      </div>
    </>
  )
}

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <div role="dialog" aria-label="Start the walkthrough" style={{ width: 460, background: BG, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400 }}>Start the walkthrough?</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: MT }}>Everything in progress pauses and every assistant gets a notice.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10 }}>
          <button onClick={onCancel} style={{ minHeight: 52, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>NOT YET</button>
          <button onClick={onConfirm} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH</button>
        </div>
      </div>
    </div>
  )
}

function CollapsedRail({ onExpand, onStartWalkthrough }) {
  const tileStyle = { width: 56, minHeight: 64, border: 0, borderRadius: 12, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontFamily: 'Inter,system-ui,sans-serif', color: TX, cursor: 'pointer' }
  return (
    <aside aria-label="Collapsed panel" style={{ width: 72, flexShrink: 0, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '10px 0 16px' }}>
      <button onClick={onExpand} aria-label="Expand panel" style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${BD}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <div style={{ width: 40, height: 1, background: BD }} />
      <button style={tileStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        <span style={{ fontSize: 10, fontWeight: 600 }}>15m</span>
        <span style={{ fontSize: 9, color: MT }}>walkthru</span>
      </button>
      <button style={tileStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M17 9a4 4 0 010 6"/></svg>
        <span style={{ fontSize: 10, fontWeight: 600 }}>22/26</span>
        <span style={{ fontSize: 9, color: MT }}>got it</span>
      </button>
      <span style={{ flex: 1 }} />
      <button onClick={onStartWalkthrough} style={{ ...tileStyle, background: TX, color: '#fff' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="none"><rect x="7" y="5" width="3.5" height="14" fill="currentColor"/><rect x="13.5" y="5" width="3.5" height="14" fill="currentColor"/></svg>
        <span style={{ fontSize: 10, fontWeight: 600 }}>Start</span>
        <span style={{ fontSize: 9, color: '#C9C4BE' }}>walkthru</span>
      </button>
    </aside>
  )
}

function PortraitDrawer({ open, onToggle, tlItems, announcements, onStartWalkthrough, onCompose }) {
  const COLLAPSED_H = 160
  const EXPANDED_H  = 470

  const [liveH, setLiveH]       = useState(() => open ? EXPANDED_H : COLLAPSED_H)
  const [snapping, setSnapping] = useState(false)
  const swipeRef        = useRef({ active: false, pending: false, startY: 0, startH: 0, lastY: 0, lastT: 0, velY: 0 })
  const contentScrollRef = useRef(null)

  useEffect(() => {
    setSnapping(true)
    setLiveH(open ? EXPANDED_H : COLLAPSED_H)
  }, [open])

  function handleDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setSnapping(false)
    swipeRef.current = { active: true, pending: false, startY: e.clientY, startH: liveH, lastY: e.clientY, lastT: performance.now(), velY: 0 }
  }
  function handleMove(e) {
    const r = swipeRef.current
    if (!r.active) return
    const now = performance.now()
    const dt  = now - r.lastT
    if (dt > 0) r.velY = (r.lastY - e.clientY) / dt * 1000
    r.lastY = e.clientY; r.lastT = now
    setLiveH(Math.max(COLLAPSED_H, Math.min(EXPANDED_H, r.startH + (r.startY - e.clientY))))
  }
  function handleUp(e) {
    const r = swipeRef.current
    if (!r.active) return
    r.active = false
    const finalH = r.startH + (r.startY - e.clientY)
    const flick  = Math.abs(r.velY) > 300
    const target = flick
      ? (r.velY > 0 ? EXPANDED_H : COLLAPSED_H)
      : (finalH >= (COLLAPSED_H + EXPANDED_H) / 2 ? EXPANDED_H : COLLAPSED_H)
    setSnapping(true)
    setLiveH(target)
    onToggle(target === EXPANDED_H)
  }
  function contentDown(e) {
    const el = contentScrollRef.current
    if (!el || el.scrollTop > 0) return
    swipeRef.current = { active: false, pending: true, startY: e.clientY, startH: liveH, lastY: e.clientY, lastT: performance.now(), velY: 0 }
  }
  function contentMove(e) {
    const r = swipeRef.current
    if (!r.pending && !r.active) return
    const dy = e.clientY - r.startY
    if (r.pending) {
      if (dy > 10)  { e.currentTarget.setPointerCapture(e.pointerId); r.active = true; r.pending = false }
      else if (dy < -10) { r.pending = false }
      return
    }
    handleMove(e)
  }
  function contentUp(e) {
    const r = swipeRef.current
    if (r.active) handleUp(e)
    r.pending = false
  }

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: liveH, transition: snapping ? 'height 0.25s ease-out' : 'none', background: '#fff', borderTop: `1px solid ${BD}`, boxShadow: '0 -6px 18px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>

      {/* Grab handle */}
      <div
        onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp} onPointerCancel={handleUp}
        role="separator" aria-orientation="horizontal" aria-label="Drag to resize panel"
        style={{ flexShrink: 0, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'row-resize', touchAction: 'none', userSelect: 'none' }}
      >
        <span style={{ width: 44, height: 5, borderRadius: 3, background: '#B9B4AE' }} />
      </div>

      {/* Collapsed: two-row layout */}
      {!open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 24px 20px', marginTop: -10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: TX, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8C77A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>Walkthrough at 4:00</span>
                <span style={{ fontSize: 12, color: '#A0761D', whiteSpace: 'nowrap' }}>in 15 min</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>15 min warning sent</span>
              <span style={{ fontSize: 13, color: MT, whiteSpace: 'nowrap' }}>22 got it · 4 waiting</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onStartWalkthrough} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH · PAUSE ALL</button>
            <button onClick={onCompose} style={{ minHeight: 52, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>NEW ANNOUNCEMENT</button>
          </div>
        </div>
      )}

      {/* Expanded: 2-col grid + footer */}
      {open && (
        <>
          <div
            ref={contentScrollRef}
            onPointerDown={contentDown} onPointerMove={contentMove} onPointerUp={contentUp} onPointerCancel={contentUp}
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 24px 12px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, alignContent: 'start', touchAction: 'pan-y' }}
          >
            {/* Timeline column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <Lbl s={{ marginBottom: 8 }}>Today · show in 2h 15m</Lbl>
              {tlItems.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, padding: '0 14px', borderRadius: 8, background: t.kind === 'next' ? TX : 'transparent' }}>
                  <span style={{ width: 72, fontSize: 12, whiteSpace: 'nowrap', color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.time}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: t.kind === 'next' ? 600 : 400, color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.label}</span>
                  <span style={{ fontSize: 11, whiteSpace: 'nowrap', color: t.kind === 'next' ? '#E8C77A' : M2 }}>{t.state}</span>
                </div>
              ))}
              <button onClick={() => {}} style={{ alignSelf: 'flex-start', marginLeft: 14, marginTop: 6, minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: TX, cursor: 'pointer' }}>Push walkthrough time</button>
            </div>
            {/* Announcements column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
              <Lbl>Announcements</Lbl>
              {announcements.slice(0, 3).map((ann, i) => {
                const { got, unopened, undelivered = 0 } = ann.delivery
                const total  = got + unopened + undelivered
                const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '85%'
                if (i === 0) return (
                  <div key={ann.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{ann.text}</span>
                      <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap' }}>Auto · {ann.sentAt}</span>
                    </div>
                    <span style={{ fontSize: 12, color: MT }}>To all 26 assistants</span>
                    <Bar segments={[{ w: gotPct, c: TX }]} />
                    <span style={{ fontSize: 12 }}>{got} got it · {unopened} haven't opened · {undelivered} not delivered</span>
                  </div>
                )
                return (
                  <div key={ann.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '0 2px' }}>
                    <span style={{ fontSize: 12, color: MT }}>{ann.text}</span>
                    <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap' }}>{ann.sentAt} · {ann.delivery.got} got it</span>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Footer outside scroll */}
          <div style={{ flexShrink: 0, padding: '12px 24px 20px', borderTop: `1px solid ${BD}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onStartWalkthrough} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH · PAUSE ALL</button>
            <button onClick={onCompose} style={{ minHeight: 52, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>NEW ANNOUNCEMENT</button>
          </div>
        </>
      )}
    </div>
  )
}

export default function ProducerIPadView({
  models, setModels,
  walkthroughPhase, setWalkthroughPhase,
  announcements, setAnnouncements,
  onLogOut,
}) {
  const [panel, setPanel]           = useState('default')
  const [pairModel, setPairModel]   = useState(null)
  const [pairAssist, setPairAssist] = useState(null)
  const [wkElapsed, setWkElapsed]   = useState(0)
  const [wkStartedAt, setWkStartedAt] = useState('')
  const [filter, setFilter]         = useState('all')
  const [composeMsg, setComposeMsg] = useState('')
  const [composeTo, setComposeTo]   = useState('all')
  const [currentTime, setCurrentTime] = useState(fmtNow)
  const [windowSize, setWindowSize] = useState(winSize)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [panelWidth, setPanelWidthRaw] = useState(() => {
    const s = parseInt(localStorage.getItem('sp_panelWidth'), 10)
    return !isNaN(s) ? Math.max(300, Math.min(600, s)) : 340
  })
  const [panelCollapsed, setPanelCollapsedRaw] = useState(() =>
    localStorage.getItem('sp_panelCollapsed') === 'true'
  )

  const dragRef = useRef({ active: false, startX: 0, startW: 0 })

  useEffect(() => {
    const iv = setInterval(() => setCurrentTime(fmtNow()), 30000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (walkthroughPhase !== 'in_progress') return
    const iv = setInterval(() => setWkElapsed(e => e + 1), 60000)
    return () => clearInterval(iv)
  }, [walkthroughPhase])

  useEffect(() => {
    function onResize() { setWindowSize(winSize()) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const wkActive  = walkthroughPhase === 'in_progress'
  const producer  = profiles.find(p => p.role === 'lead') || profiles[0]

  const isPortrait      = windowSize.w <= windowSize.h
  const effectivePanelW = isPortrait ? 0 : (panelCollapsed ? 72 : panelWidth)
  const mainWidth       = windowSize.w - effectivePanelW
  const narrowMain      = mainWidth < 720
  const widePanel       = !panelCollapsed && panelWidth >= 480
  const drawerHeight    = drawerOpen ? 470 : 160

  const readyCount      = models.filter(m => m.services.hair.status === 'done' && m.services.makeup.status === 'done' && m.services.nails.status === 'done').length
  const notArrivedCount = models.filter(m => !m.arrived).length
  const notPairedCount  = models.filter(m => m.arrived && !m.services[SVC].assistantId).length
  const needsCount      = models.filter(m => m.flagged).length

  const filtered = models.filter(m => {
    switch (filter) {
      case 'needs_attention': return m.flagged
      case 'not_arrived':     return !m.arrived
      case 'not_paired':      return m.arrived && !m.services[SVC].assistantId
      case 'ready':           return m.services.hair.status === 'done' && m.services.makeup.status === 'done' && m.services.nails.status === 'done'
      default:                return true
    }
  })

  const mkAssistants = profiles
    .filter(p => p.specialty === SVC && (p.role === 'assistant' || p.role === 'lead_assistant'))
    .map(a => {
      const active = models.find(m => m.services[SVC].assistantId === a.id && m.services[SVC].status === 'in_progress')
      return { ...a, free: !active, currentModelName: active?.name || null }
    })
    .sort((a, b) => (a.free === b.free ? 0 : a.free ? -1 : 1))

  const tlItems = timelineData.map((t, i) => {
    const wkIdx = timelineData.findIndex(x => x.id === 'walkthrough')
    const kind  = i < wkIdx ? 'past' : i === wkIdx ? 'next' : 'fut'
    const state = kind === 'past' ? 'Done' : kind === 'next' ? (wkActive ? 'now' : 'in 15 min') : ''
    return { ...t, kind, state }
  })

  function getAssistantName(id) {
    return id ? (profiles.find(p => p.id === id)?.name || '—') : null
  }
  function getModelNote(m) {
    if (!m.arrived) return { text: `Not arrived · ETA ${m.eta || 'TBD'}`, red: true }
    if (m.flagged)  return { text: 'Flagged', red: true }
    return { text: `Arrived ${m.arrivedAt}`, red: false }
  }
  function handlePair(m) { setPairModel(m); setPairAssist(null); setPanel('pairing') }
  function handleConfirmPair() {
    if (!pairModel || !pairAssist) return
    setModels(prev => prev.map(m => m.id === pairModel.id ? { ...m, services: { ...m.services, [SVC]: { ...m.services[SVC], assistantId: pairAssist } } } : m))
    setPanel('default')
  }
  function handleStartWalkthrough() {
    const t = fmtNow()
    setWalkthroughPhase('in_progress')
    setWkElapsed(0); setWkStartedAt(t)
    setAnnouncements(prev => [{ id: `ann-wk-${Date.now()}`, text: 'Walkthrough now · work paused', sentAt: t, sentBy: 'p1', ackedBy: [], delivery: { got: 25, unopened: 1, undelivered: 0 } }, ...prev])
    setPanel('default')
  }
  function handleModelsBack() { setWalkthroughPhase('upcoming'); setPanel('default') }
  function handleSend() {
    if (!composeMsg.trim()) return
    const t = fmtNow()
    setAnnouncements(prev => [{ id: `ann-${Date.now()}`, text: composeMsg, sentAt: t, sentBy: 'p1', delivery: { got: 0, unopened: 26, undelivered: 0 } }, ...prev])
    setComposeMsg(''); setPanel('default')
  }
  function expandPanel() { setPanelCollapsedRaw(false); localStorage.setItem('sp_panelCollapsed', 'false') }
  function collapsePanel() { setPanelCollapsedRaw(true); localStorage.setItem('sp_panelCollapsed', 'true') }

  function onHandlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { active: true, startX: e.clientX, startW: panelWidth }
  }
  function onHandlePointerMove(e) {
    if (!dragRef.current.active) return
    const delta = dragRef.current.startX - e.clientX
    setPanelWidthRaw(Math.max(200, Math.min(600, dragRef.current.startW + delta)))
  }
  function onHandlePointerUp(e) {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    const delta = dragRef.current.startX - e.clientX
    const finalW = dragRef.current.startW + delta
    if (finalW < 200) {
      setPanelCollapsedRaw(true); localStorage.setItem('sp_panelCollapsed', 'true')
      const savedW = Math.max(300, Math.min(600, dragRef.current.startW))
      setPanelWidthRaw(savedW); localStorage.setItem('sp_panelWidth', String(savedW))
    } else {
      const w = Math.max(300, Math.min(600, finalW))
      setPanelWidthRaw(w); localStorage.setItem('sp_panelWidth', String(w))
    }
  }

  const colsWide   = '40px 40px minmax(0,1fr) 104px 104px 104px minmax(0,0.8fr)'
  const colsNarrow = '40px 40px minmax(0,1fr) 104px 104px 104px'
  const gridCols   = narrowMain ? colsNarrow : colsWide
  const showRight  = panel === 'default' || panel === 'confirm'

  const svcCards = [
    { svc: 'hair',   label: 'Hair',   ...DS.hair   },
    { svc: 'makeup', label: 'Makeup', ...DS.makeup },
    { svc: 'nails',  label: 'Nails',  ...DS.nails  },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', color: TX }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '12px 24px', borderBottom: `1px solid ${BD}` }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 26, whiteSpace: 'nowrap' }}>{show.name}</span>
        <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap' }}>{SVC_LABEL} · {currentTime}</span>
        <span style={{ flex: 1 }} />
        <button style={{ minHeight: 40, padding: '0 16px', borderRadius: 999, border: `1px solid ${TX}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', color: TX, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2"><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/></svg>
          SHARE STATUS LINK
        </button>
        <Avatar src={producer.avatar} name={producer.name} size={36} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '16px 24px 0', paddingBottom: isPortrait ? drawerHeight : 0 }}>

          {/* Metric cards */}
          <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
            <div style={{ background: TX, color: '#F5F2EE', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Lbl s={{ color: '#C9C4BE', whiteSpace: 'nowrap' }}>Fully ready</Lbl>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1, whiteSpace: 'nowrap' }}>{DS.ready}<span style={{ fontSize: 15, color: '#C9C4BE' }}> /30</span></span>
              <Bar dark segments={[{ w: pct(DS.ready), c: '#7A9E7E' }]} />
            </div>
            {svcCards.map(s => {
              const ns = 30 - s.done - s.ip - s.pa
              const parts = [
                s.ip > 0 && { n: s.ip, l: 'in progress', c: '#D4A853' },
                s.pa > 0 && { n: s.pa, l: 'paused',      c: '#8A9BB0' },
                ns  > 0 && { n: ns,   l: 'not started',  c: DV        },
              ].filter(Boolean)
              return (
                <div key={s.svc} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Lbl s={{ whiteSpace: 'nowrap' }}>{s.label} done</Lbl>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1, whiteSpace: 'nowrap' }}>{s.done}<span style={{ fontSize: 15, color: M2 }}> /30</span></span>
                  <Bar segments={[{ w: pct(s.done), c: '#7A9E7E' }, { w: pct(s.ip), c: '#D4A853' }, { w: pct(s.pa), c: '#8A9BB0' }]} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 10, rowGap: 2 }}>
                    {parts.map((p, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MT, whiteSpace: 'nowrap' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.c, flexShrink: 0 }} />
                        {p.n} {p.l}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Filter chips */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '14px 0 6px', overflowX: 'auto', flexWrap: 'nowrap' }}>
            {[
              { id: 'all',             label: `All ${models.length}`           },
              { id: 'needs_attention', label: `Needs attention ${needsCount}`  },
              { id: 'not_arrived',     label: `Not arrived ${notArrivedCount}` },
              { id: 'not_paired',      label: `Not paired ${notPairedCount}`   },
              { id: 'ready',           label: `Ready ${readyCount}`            },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink: 0, minHeight: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer', border: filter === f.id ? `1px solid ${TX}` : `1px solid ${DV}`, background: filter === f.id ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: filter === f.id ? '#fff' : TX, whiteSpace: 'nowrap' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Model table */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center', columnGap: 10, position: 'sticky', top: 0, background: BG, padding: '8px 0', borderBottom: `1px solid ${DV}` }}>
              {(narrowMain ? ['Look','','Model','Hair','Makeup','Nails'] : ['Look','','Model','Hair','Makeup','Nails',`${SVC_LABEL} assistant`]).map((h, i) => <Lbl key={i}>{h}</Lbl>)}
            </div>
            {filtered.map(m => {
              const note      = getModelNote(m)
              const hChip     = svcChip(m.services.hair,   wkActive)
              const mkChip    = svcChip(m.services.makeup, wkActive)
              const nChip     = svcChip(m.services.nails,  wkActive)
              const aName     = getAssistantName(m.services[SVC].assistantId)
              const needsPair = m.arrived && !m.services[SVC].assistantId
              return (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center', columnGap: 10, minHeight: 58, borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap' }}>{m.look}</span>
                  <Avatar src={m.avatar} name={m.name} size={36} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: note.red ? '#A33D28' : MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {note.text}
                      {narrowMain && !needsPair && aName && <span style={{ color: MT }}> · {aName}</span>}
                    </span>
                    {narrowMain && needsPair && (
                      <button onClick={() => handlePair(m)} style={{ alignSelf: 'flex-start', marginTop: 2, minHeight: 28, padding: '0 10px 0 8px', borderRadius: 999, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                        PAIR
                      </button>
                    )}
                  </span>
                  <Chip c={hChip.c}  t={hChip.t}  />
                  <Chip c={mkChip.c} t={mkChip.t} />
                  <Chip c={nChip.c}  t={nChip.t}  />
                  {!narrowMain && (
                    needsPair ? (
                      <button onClick={() => handlePair(m)} style={{ justifySelf: 'start', minHeight: 36, padding: '0 14px 0 10px', borderRadius: 999, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                        PAIR
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aName || '—'}</span>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Landscape panel */}
        {!isPortrait && (
          <>
            <div
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              style={{ width: 14, flexShrink: 0, borderLeft: `1px solid ${BD}`, cursor: 'col-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', userSelect: 'none' }}
            >
              <span style={{ width: 3, height: 28, borderRadius: 2, background: DV }} />
            </div>
            <aside style={{ width: panelCollapsed ? 72 : panelWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {panelCollapsed ? (
                <CollapsedRail onExpand={expandPanel} onStartWalkthrough={() => setPanel('confirm')} />
              ) : (
                <>
                  <div style={{ flexShrink: 0, padding: '8px 12px 0', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={collapsePanel} aria-label="Collapse panel" style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    {panel === 'pairing' && pairModel && (
                      <PairingPanel model={pairModel} assistants={mkAssistants} selected={pairAssist} onSelect={setPairAssist} onConfirm={handleConfirmPair} onClose={() => setPanel('default')} />
                    )}
                    {panel === 'compose' && (
                      <ComposePanel msg={composeMsg} onMsg={setComposeMsg} to={composeTo} onTo={setComposeTo} onSend={handleSend} onClose={() => setPanel('default')} />
                    )}
                    {showRight && (
                      wkActive ? (
                        <WalkthroughPanel elapsed={wkElapsed} startedAt={wkStartedAt} announcements={announcements} onModelsBack={handleModelsBack} onCompose={() => setPanel('compose')} wide={widePanel} />
                      ) : (
                        <DefaultPanel tlItems={tlItems} announcements={announcements} onStartWalkthrough={() => setPanel('confirm')} onCompose={() => setPanel('compose')} wide={widePanel} />
                      )
                    )}
                  </div>
                </>
              )}
            </aside>
          </>
        )}

        {/* Portrait drawer */}
        {isPortrait && (
          <PortraitDrawer open={drawerOpen} onToggle={setDrawerOpen} tlItems={tlItems} announcements={announcements} onStartWalkthrough={() => setPanel('confirm')} onCompose={() => setPanel('compose')} />
        )}

        {/* Confirm modal */}
        {panel === 'confirm' && (
          <ConfirmModal onConfirm={handleStartWalkthrough} onCancel={() => setPanel('default')} />
        )}
      </div>
    </div>
  )
}
