import { useState, useEffect } from 'react'
import {
  models as initModels,
  profiles,
  timeline as timelineData,
  announcements as initAnnouncements,
  show,
} from '../data/mockData'

// ── constants ────────────────────────────────────────────────────────────────
const SVC       = 'makeup'
const SVC_LABEL = 'Makeup'
const BG = '#F5F2EE', BD = '#E0DDD8', TX = '#111', MT = '#4A4743', M2 = '#6E6A64', DV = '#CFCAC4'

const CHIP_STATUS = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: '#E8E4DF', t: 'Not started' },
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

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false)
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (err || !src) {
    return (
      <span style={{
        width: size, height: size, borderRadius: '50%', background: '#E0DDD8', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.33), color: M2,
        fontFamily: 'Inter,system-ui,sans-serif',
      }}>
        {ini}
      </span>
    )
  }
  return (
    <img
      src={src} alt={name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  )
}

// ── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ c, t }) {
  return (
    <span style={{
      fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600,
      letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999,
      padding: '4px 8px', color: TX, background: c, whiteSpace: 'nowrap', justifySelf: 'start',
    }}>
      {t}
    </span>
  )
}

// ── Lbl ──────────────────────────────────────────────────────────────────────
function Lbl({ children, style }) {
  return (
    <p style={{
      fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em',
      textTransform: 'uppercase', color: M2, margin: 0, ...style,
    }}>
      {children}
    </p>
  )
}

// ── Bar ──────────────────────────────────────────────────────────────────────
function Bar({ segments, dark }) {
  return (
    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: dark ? '#3A3734' : '#E8E4DF' }}>
      {segments.map((s, i) => <span key={i} style={{ width: s.w, background: s.c }} />)}
    </div>
  )
}

// ── DefaultPanel (timeline + announcements) ───────────────────────────────────
function DefaultPanel({ tlItems, announcements, onStartWalkthrough, onCompose }) {
  return (
    <>
      {/* Timeline */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: `1px solid ${BD}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Lbl>Today</Lbl>
          <Lbl>Show in 2h 15m</Lbl>
        </div>
        {tlItems.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            minHeight: 36, padding: '0 10px', margin: '0 -10px',
            borderRadius: 8,
            background: t.kind === 'next' ? TX : 'transparent',
          }}>
            <span style={{ width: 64, fontSize: 12, color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.time}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: t.kind === 'next' ? 600 : 400, color: t.kind === 'next' ? '#fff' : t.kind === 'past' ? M2 : TX }}>{t.label}</span>
            <span style={{ fontSize: 11, color: t.kind === 'next' ? '#E8C77A' : M2 }}>{t.state}</span>
          </div>
        ))}
        <button
          onClick={() => {}}
          style={{ alignSelf: 'flex-start', marginTop: 6, minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: TX, cursor: 'pointer' }}
        >
          Push walkthrough time
        </button>
      </div>

      {/* Announcements */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Lbl>Announcements</Lbl>
        {announcements.map((ann, i) => {
          const { got, unopened, undelivered } = ann.delivery
          const total = got + unopened + undelivered
          const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '0%'
          if (i === 0) {
            return (
              <div key={ann.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{ann.text}</span>
                  <span style={{ fontSize: 11, color: MT }}>Auto · {ann.sentAt}</span>
                </div>
                <span style={{ fontSize: 12, color: MT }}>To all 26 assistants</span>
                <Bar segments={[{ w: gotPct, c: TX }]} />
                <span style={{ fontSize: 12 }}>{got} got it · {unopened} haven't opened · {undelivered} not delivered</span>
              </div>
            )
          }
          return (
            <div key={ann.id} style={{ padding: '0 2px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: MT }}>{ann.text}</span>
              <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap', marginLeft: 8 }}>Auto · {ann.sentAt} · {ann.delivery.got} got it</span>
            </div>
          )
        })}
      </div>

      {/* Buttons */}
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onStartWalkthrough}
          style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}
        >
          START WALKTHROUGH · PAUSE ALL WORK
        </button>
        <button
          onClick={onCompose}
          style={{ minHeight: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
        >
          NEW ANNOUNCEMENT
        </button>
      </div>
    </>
  )
}

// ── WalkthroughPanel ──────────────────────────────────────────────────────────
function WalkthroughPanel({ elapsed, startedAt, announcements, onModelsBack, onCompose }) {
  return (
    <>
      {/* Dark timer card */}
      <div style={{ margin: '16px 20px 0', background: TX, color: '#F5F2EE', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Lbl style={{ color: '#C9C4BE' }}>Walkthrough · started {startedAt}</Lbl>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 44, lineHeight: 1 }}>{elapsed} min</span>
        <span style={{ fontSize: 12, color: '#E0DDD8' }}>All work paused · models back at 4:30</span>
        <button style={{ alignSelf: 'flex-start', minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: '#F5F2EE', cursor: 'pointer' }}>
          Change time
        </button>
      </div>

      {/* Announcements */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Lbl>Announcements</Lbl>
        {announcements.map((ann, i) => {
          const { got, unopened, undelivered } = ann.delivery
          const total = got + unopened + undelivered
          const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '96%'
          if (i === 0) {
            return (
              <div key={ann.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{ann.text}</span>
                  <span style={{ fontSize: 11, color: MT }}>{ann.sentAt}</span>
                </div>
                <Bar segments={[{ w: gotPct, c: TX }]} />
                <span style={{ fontSize: 12 }}>{total > 0 ? `${got} of ${total} got it` : '25 of 26 got it'}</span>
              </div>
            )
          }
          return (
            <div key={ann.id} style={{ padding: '0 2px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: MT }}>{ann.text}</span>
              <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap', marginLeft: 8 }}>{ann.sentAt} · {ann.delivery.got} got it</span>
            </div>
          )
        })}
      </div>

      {/* Buttons */}
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onModelsBack}
          style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}
        >
          MODELS ARE BACK · RESUME WORK
        </button>
        <button
          onClick={onCompose}
          style={{ minHeight: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
        >
          NEW ANNOUNCEMENT
        </button>
      </div>
    </>
  )
}

// ── PairingPanel ──────────────────────────────────────────────────────────────
function PairingPanel({ model, assistants, selected, onSelect, onConfirm, onClose, svcLabel }) {
  const selectedName = assistants.find(a => a.id === selected)?.name || ''
  return (
    <>
      {/* Model header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar src={model.avatar} name={model.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: MT, marginBottom: 2 }}>
            Look {model.look} · {model.arrived ? `arrived ${model.arrivedAt}` : `ETA ${model.eta}`}
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{model.name}</div>
        </div>
        <button
          onClick={onClose}
          style={{ border: 0, background: 'none', fontSize: 18, color: M2, cursor: 'pointer', lineHeight: 1, padding: 4 }}
          aria-label="Close pairing"
        >
          ×
        </button>
      </div>

      {/* Assistant list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px' }}>
        <Lbl style={{ marginBottom: 10 }}>Send to</Lbl>
        {assistants.map(a => {
          const isSel = selected === a.id
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                border: isSel ? `1.5px solid ${TX}` : `1px solid transparent`,
                background: isSel ? '#F5F2EE' : 'transparent',
                textAlign: 'left', cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                readOnly
                checked={isSel}
                style={{ accentColor: TX, width: 16, height: 16, flexShrink: 0 }}
              />
              <Avatar src={a.avatar} name={a.name} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: a.free ? '#7A9E7E' : MT }}>
                  {a.free ? 'Free' : `With ${a.currentModelName}`}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Send button */}
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
        <button
          onClick={onConfirm}
          disabled={!selected}
          style={{
            width: '100%', minHeight: 52, borderRadius: 8, border: 0,
            background: selected ? TX : DV,
            color: '#fff', fontFamily: 'Inter,system-ui,sans-serif',
            fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            cursor: selected ? 'pointer' : 'default',
            textTransform: 'uppercase',
          }}
        >
          {selected && selectedName
            ? `SEND ${model.name.split(' ')[0].toUpperCase()} TO ${selectedName.split(' ')[0].toUpperCase()}`
            : `SELECT AN ASSISTANT`}
        </button>
      </div>
    </>
  )
}

// ── ComposePanel ──────────────────────────────────────────────────────────────
const QUICK_MSGS = ['Models are back', 'Dressing in 10', 'Final touch-ups now']

const SCHEDULED_WARNINGS = [
  { id: 'sw-1', time: '3:45 PM', text: 'Walkthrough in 15 minutes' },
  { id: 'sw-2', time: '4:30 PM', text: 'Models are back (auto)' },
]

function ComposePanel({ msg, onMsg, to, onTo, onSend, onClose, producer }) {
  const toOptions = [
    { id: 'all',    label: 'All assistants 26' },
    { id: 'lead',   label: 'Lead assistants 2' },
    { id: 'yadim',  label: 'Yadim'             },
    { id: 'select', label: 'Select people'     },
  ]
  return (
    <>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>New announcement</span>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 18, color: M2, cursor: 'pointer', lineHeight: 1, padding: 4 }} aria-label="Close">×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* To chips */}
        <div>
          <Lbl style={{ marginBottom: 8 }}>To</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {toOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => onTo(opt.id)}
                style={{
                  minHeight: 34, padding: '0 12px', borderRadius: 999, cursor: 'pointer',
                  border: to === opt.id ? `1px solid ${TX}` : `1px solid ${DV}`,
                  background: to === opt.id ? TX : 'transparent',
                  fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12,
                  color: to === opt.id ? '#fff' : TX,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick messages */}
        <div>
          <Lbl style={{ marginBottom: 8 }}>Quick messages</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {QUICK_MSGS.map(q => (
              <button
                key={q}
                onClick={() => onMsg(q)}
                style={{
                  padding: '8px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                  border: msg === q ? `1px solid ${TX}` : `1px solid ${DV}`,
                  background: msg === q ? '#F0EDE8' : 'transparent',
                  fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Free text */}
        <textarea
          value={msg}
          onChange={e => onMsg(e.target.value)}
          placeholder="Or write your own"
          rows={3}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8,
            border: `1px solid ${DV}`, background: 'transparent',
            fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX,
            resize: 'none', boxSizing: 'border-box', outline: 'none',
          }}
        />

        {/* Scheduled */}
        <div>
          <Lbl style={{ marginBottom: 8 }}>Scheduled</Lbl>
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

      {/* Send button */}
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
        <button
          onClick={onSend}
          disabled={!msg.trim()}
          style={{
            width: '100%', minHeight: 52, borderRadius: 8, border: 0,
            background: msg.trim() ? TX : DV,
            color: '#fff', fontFamily: 'Inter,system-ui,sans-serif',
            fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            cursor: msg.trim() ? 'pointer' : 'default',
          }}
        >
          SEND
        </button>
      </div>
    </>
  )
}

// ── ConfirmModal ──────────────────────────────────────────────────────────────
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <div
        role="dialog"
        aria-label="Start the walkthrough"
        style={{
          width: 460, background: BG, borderRadius: 16, padding: 28,
          display: 'flex', flexDirection: 'column', gap: 18,
        }}
      >
        <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400 }}>
          Start the walkthrough?
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: MT }}>
          Everything in progress pauses and every assistant gets a notice.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ minHeight: 52, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
          >
            NOT YET
          </button>
          <button
            onClick={onConfirm}
            style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}
          >
            START WALKTHROUGH
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ProducerIPadView ──────────────────────────────────────────────────────────
export default function ProducerIPadView({ onLogOut }) {
  const [models, setModels]           = useState(initModels)
  const [panel, setPanel]             = useState('default')
  const [pairModel, setPairModel]     = useState(null)
  const [pairAssist, setPairAssist]   = useState(null)
  const [wkPhase, setWkPhase]         = useState('upcoming') // 'upcoming' | 'in_progress'
  const [wkElapsed, setWkElapsed]     = useState(0)
  const [wkStartedAt, setWkStartedAt] = useState('')
  const [filter, setFilter]           = useState('all')
  const [announcements, setAnnouncements] = useState(initAnnouncements)
  const [composeMsg, setComposeMsg]   = useState('')
  const [composeTo, setComposeTo]     = useState('all')
  const [currentTime, setCurrentTime] = useState(fmtNow)

  useEffect(() => {
    const iv = setInterval(() => setCurrentTime(fmtNow()), 30000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (wkPhase !== 'in_progress') return
    const iv = setInterval(() => setWkElapsed(e => e + 1), 60000)
    return () => clearInterval(iv)
  }, [wkPhase])

  const wkActive  = wkPhase === 'in_progress'
  const producer  = profiles.find(p => p.role === 'lead') || profiles[0]

  // ── Derived stats ──────────────────────────────────────────────────────────
  const svcStats = ['hair', 'makeup', 'nails'].map(svc => {
    const all  = models.map(m => m.services[svc])
    const done = all.filter(s => s.status === 'done').length
    const ip   = wkActive ? 0 : all.filter(s => s.status === 'in_progress').length
    const pa   = wkActive
      ? all.filter(s => s.status === 'in_progress' || s.status === 'paused').length
      : all.filter(s => s.status === 'paused').length
    const ns   = 30 - done - ip - pa
    const label = svc.charAt(0).toUpperCase() + svc.slice(1)
    return { svc, label, done, ip, pa, ns }
  })

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

  // ── Assistants for pairing ─────────────────────────────────────────────────
  const mkAssistants = profiles
    .filter(p => p.specialty === SVC && (p.role === 'assistant' || p.role === 'lead_assistant'))
    .map(a => {
      const active = models.find(m => m.services[SVC].assistantId === a.id && m.services[SVC].status === 'in_progress')
      return { ...a, free: !active, currentModelName: active?.name || null }
    })
    .sort((a, b) => (a.free === b.free ? 0 : a.free ? -1 : 1))

  // ── Timeline ───────────────────────────────────────────────────────────────
  const tlItems = timelineData.map((t, i) => {
    const wkIdx = timelineData.findIndex(x => x.id === 'walkthrough')
    let kind  = i < wkIdx ? 'past' : i === wkIdx ? 'next' : 'fut'
    let state = kind === 'past' ? 'Done' : kind === 'next' ? (wkActive ? 'now' : 'in 15 min') : ''
    if (wkActive && i <= wkIdx) kind = i < wkIdx ? 'past' : 'next'
    return { ...t, kind, state }
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  function getAssistantName(id) {
    return id ? (profiles.find(p => p.id === id)?.name || '—') : null
  }

  function getModelNote(m) {
    if (!m.arrived) return { text: `Not arrived · ETA ${m.eta || 'TBD'}`, red: true }
    if (m.flagged)  return { text: 'Flagged', red: true }
    return { text: `Arrived ${m.arrivedAt}`, red: false }
  }

  function handlePair(m) {
    setPairModel(m)
    setPairAssist(null)
    setPanel('pairing')
  }

  function handleConfirmPair() {
    if (!pairModel || !pairAssist) return
    setModels(prev => prev.map(m =>
      m.id === pairModel.id
        ? { ...m, services: { ...m.services, [SVC]: { ...m.services[SVC], assistantId: pairAssist } } }
        : m
    ))
    setPanel('default')
  }

  function handleStartWalkthrough() {
    const t = fmtNow()
    setWkPhase('in_progress')
    setWkElapsed(0)
    setWkStartedAt(t)
    setAnnouncements(prev => [{
      id: `ann-wk-${Date.now()}`,
      text: 'Walkthrough now · work paused',
      sentAt: t, sentBy: 'p1',
      delivery: { got: 25, unopened: 1, undelivered: 0 },
    }, ...prev])
    setPanel('default')
  }

  function handleModelsBack() {
    setWkPhase('upcoming')
    setPanel('default')
  }

  function handleSend() {
    if (!composeMsg.trim()) return
    const t = fmtNow()
    setAnnouncements(prev => [{
      id: `ann-${Date.now()}`,
      text: composeMsg, sentAt: t, sentBy: 'p1',
      delivery: { got: 0, unopened: 26, undelivered: 0 },
    }, ...prev])
    setComposeMsg('')
    setPanel('default')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const showRight = panel === 'default' || panel === 'confirm'

  return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', color: TX }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '12px 24px', borderBottom: `1px solid ${BD}` }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 26 }}>{show.name}</span>
        <span style={{ fontSize: 12, color: MT }}>{SVC_LABEL} · {currentTime}</span>
        <span style={{ flex: 1 }} />
        <button
          style={{ minHeight: 40, padding: '0 16px', borderRadius: 999, border: `1px solid ${TX}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', color: TX, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2"><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/></svg>
          SHARE STATUS LINK
        </button>
        <Avatar src={producer.avatar} name={producer.name} size={36} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>

        {/* ── Left column ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '16px 20px 0' }}>

          {/* Metrics row */}
          <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
            {/* Fully ready */}
            <div style={{ background: TX, color: '#F5F2EE', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Lbl style={{ color: '#C9C4BE' }}>Fully ready</Lbl>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 34, lineHeight: 1 }}>
                {readyCount}<span style={{ fontSize: 16, color: '#C9C4BE' }}> / 30</span>
              </span>
              <Bar dark segments={[{ w: pct(readyCount), c: '#7A9E7E' }]} />
              <span style={{ fontSize: 11, color: '#C9C4BE' }}>Hair, makeup and nails all done</span>
            </div>

            {/* Service cards */}
            {svcStats.map(s => {
              const parts = [
                s.ip > 0 && { n: s.ip, l: 'in progress', c: '#D4A853' },
                s.pa > 0 && { n: s.pa, l: wkActive ? 'paused' : 'paused', c: '#8A9BB0' },
                s.ns > 0 && { n: s.ns, l: 'not started', c: DV },
              ].filter(Boolean)
              return (
                <div key={s.svc} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Lbl>{s.label}</Lbl>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 34, lineHeight: 1 }}>
                    {s.done}<span style={{ fontSize: 16, color: M2 }}> / 30 done</span>
                  </span>
                  <Bar segments={[
                    { w: pct(s.done), c: '#7A9E7E' },
                    { w: pct(s.ip),   c: '#D4A853' },
                    { w: pct(s.pa),   c: '#8A9BB0' },
                  ]} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
                    {parts.map((p, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MT }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.c }} />
                        {p.n} {p.l}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Filter chips */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '14px 0 6px' }}>
            {[
              { id: 'all',             label: `All ${models.length}`              },
              { id: 'needs_attention', label: `Needs attention ${needsCount}`     },
              { id: 'not_arrived',     label: `Not arrived ${notArrivedCount}`    },
              { id: 'not_paired',      label: `Not paired ${notPairedCount}`      },
              { id: 'ready',           label: `Ready ${readyCount}`               },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  minHeight: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer',
                  border: filter === f.id ? `1px solid ${TX}` : `1px solid ${DV}`,
                  background: filter === f.id ? TX : 'transparent',
                  fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12,
                  color: filter === f.id ? '#fff' : TX,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Model table */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 36px minmax(0,1.5fr) repeat(3,minmax(0,1fr)) minmax(0,1.3fr)',
              alignItems: 'center', columnGap: 10,
              position: 'sticky', top: 0, background: BG,
              padding: '8px 0', borderBottom: `1px solid ${DV}`,
            }}>
              {['Look', '', 'Model', 'Hair', 'Makeup', 'Nails', `${SVC_LABEL} assistant`].map((h, i) => (
                <Lbl key={i}>{h}</Lbl>
              ))}
            </div>

            {/* Data rows */}
            {filtered.map(m => {
              const note    = getModelNote(m)
              const hChip   = svcChip(m.services.hair,   wkActive)
              const mkChip  = svcChip(m.services.makeup, wkActive)
              const nChip   = svcChip(m.services.nails,  wkActive)
              const aName   = getAssistantName(m.services[SVC].assistantId)
              const needsPair = m.arrived && !m.services[SVC].assistantId

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 36px minmax(0,1.5fr) repeat(3,minmax(0,1fr)) minmax(0,1.3fr)',
                    alignItems: 'center', columnGap: 10,
                    minHeight: 58, borderBottom: `1px solid ${BD}`,
                  }}
                >
                  <span style={{ fontSize: 12, color: MT }}>{m.look}</span>
                  <Avatar src={m.avatar} name={m.name} size={36} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 15 }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: note.red ? '#A33D28' : MT }}>{note.text}</span>
                  </span>
                  <Chip c={hChip.c}  t={hChip.t}  />
                  <Chip c={mkChip.c} t={mkChip.t} />
                  <Chip c={nChip.c}  t={nChip.t}  />
                  {needsPair ? (
                    <button
                      onClick={() => handlePair(m)}
                      style={{
                        justifySelf: 'start', minHeight: 36, padding: '0 14px 0 10px',
                        borderRadius: 999, border: 0, background: TX, color: '#fff',
                        fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600,
                        letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      PAIR
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: MT }}>{aName || '—'}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right panel ── */}
        <aside style={{ width: 360, flexShrink: 0, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column' }}>
          {panel === 'pairing' && pairModel && (
            <PairingPanel
              model={pairModel}
              assistants={mkAssistants}
              selected={pairAssist}
              onSelect={setPairAssist}
              onConfirm={handleConfirmPair}
              onClose={() => setPanel('default')}
              svcLabel={SVC_LABEL}
            />
          )}
          {panel === 'compose' && (
            <ComposePanel
              msg={composeMsg}
              onMsg={setComposeMsg}
              to={composeTo}
              onTo={setComposeTo}
              onSend={handleSend}
              onClose={() => setPanel('default')}
              producer={producer}
            />
          )}
          {showRight && (
            wkActive ? (
              <WalkthroughPanel
                elapsed={wkElapsed}
                startedAt={wkStartedAt}
                announcements={announcements}
                onModelsBack={handleModelsBack}
                onCompose={() => setPanel('compose')}
              />
            ) : (
              <DefaultPanel
                tlItems={tlItems}
                announcements={announcements}
                onStartWalkthrough={() => setPanel('confirm')}
                onCompose={() => setPanel('compose')}
              />
            )
          )}
        </aside>
      </div>

      {/* Confirm walkthrough modal */}
      {panel === 'confirm' && (
        <ConfirmModal
          onConfirm={handleStartWalkthrough}
          onCancel={() => setPanel('default')}
        />
      )}
    </div>
  )
}
