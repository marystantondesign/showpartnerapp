import { useState, useEffect, useRef } from 'react'
import {
  models as initModels,
  profiles,
  timeline as timelineData,
  announcements as initAnnouncements,
  show,
  showHistory,
} from '../data/mockData'
import ModelDetailSheet from '../components/ModelDetailSheet'
import StatusLinkView from './StatusLinkView'

const SVC       = 'makeup'
const SVC_LABEL = 'Makeup'
const BG = '#F5F2EE', BD = '#E0DDD8', TX = '#111', MT = '#4A4743', M2 = '#6E6A64', DV = '#CFCAC4'

const CHIP_STATUS = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: '#E8E4DF', t: 'Not started' },
  to_check:    { c: '#DCE8DD', t: 'To check'    },
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

function ArrivalsPanel({ models, recentArrivals, onArrived, onOpenRunningLate, onClose, onPair }) {
  const [search, setSearch] = useState('')
  const notArrived = models.filter(m => !m.arrived)
  const filtered = notArrived.filter(m =>
    !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    String(m.look).toLowerCase().includes(search.toLowerCase())
  )
  return (
    <>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Lbl>Arrivals</Lbl>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, marginTop: 2 }}>{models.filter(m => m.arrived).length} of {models.length} here</div>
        </div>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 20, color: M2, cursor: 'pointer', lineHeight: 1, padding: '4px 4px 0' }}>×</button>
      </div>
      <div style={{ padding: '10px 20px', borderBottom: `1px solid ${BD}` }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Check in by name or look" style={{ width: '100%', boxSizing: 'border-box', height: 40, borderRadius: 999, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, padding: '0 16px', color: TX, outline: 'none' }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px' }}>
        {filtered.length > 0 && <Lbl s={{ marginBottom: 10 }}>Still expected · by ETA</Lbl>}
        {filtered.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
            <Avatar src={m.avatar} name={m.name} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: MT }}>Look {m.look} · ETA {m.eta || 'TBD'}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => onArrived(m.id)} style={{ height: 40, padding: '0 12px', borderRadius: 999, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>ARRIVED</button>
              <button onClick={() => onOpenRunningLate(m.id)} style={{ height: 40, padding: '0 10px', borderRadius: 999, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.1em', color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>RUNNING LATE</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && notArrived.length === 0 && (
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: M2, paddingTop: 12 }}>All models checked in</div>
        )}
        {recentArrivals.length > 0 && (
          <>
            <Lbl s={{ marginTop: 20, marginBottom: 10 }}>Just arrived</Lbl>
            {[...recentArrivals].reverse().slice(0, 6).map(arr => {
              const m = models.find(x => x.id === arr.modelId)
              if (!m) return null
              const needsPair = m.arrived && !m.services[SVC].assistantId
              return (
                <div key={arr.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                  <Avatar src={m.avatar} name={m.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: MT }}>Look {m.look} · arrived {arr.arrivedAt}</div>
                  </div>
                  {needsPair && (
                    <button onClick={() => { onPair?.(m); onClose() }} style={{ height: 40, padding: '0 12px 0 8px', borderRadius: 999, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                      PAIR
                    </button>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}

function RunningLateModal({ model, onSave, onCancel }) {
  const [preset, setPreset] = useState(null)
  const [note, setNote] = useState('')
  const WALKTHROUGH_H = 16

  function parseEta(s) {
    if (!s) return null
    const parts = s.trim().split(' ')
    if (parts.length < 2) return null
    const [time, period] = parts
    const [h, m] = time.split(':').map(Number)
    let hrs = h
    if (period === 'PM' && hrs !== 12) hrs += 12
    if (period === 'AM' && hrs === 12) hrs = 0
    return { h: hrs, m }
  }
  function formatEta(h, m) {
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
    const period = h >= 12 ? 'PM' : 'AM'
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`
  }

  const currentEta = model.eta || '5:00 PM'
  const parsed = parseEta(currentEta)
  let newEtaStr = currentEta
  if (preset && preset !== 'pick' && parsed) {
    const total = parsed.h * 60 + parsed.m + preset
    newEtaStr = formatEta(Math.floor(total / 60) % 24, total % 60)
  }
  const parsedNew = parseEta(newEtaStr)
  const afterWalkthrough = parsedNew && parsedNew.h >= WALKTHROUGH_H

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
      <div role="dialog" aria-label={`${model.name} is running late`} style={{ width: 460, maxWidth: 'calc(100vw - 32px)', background: BG, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar src={model.avatar} name={model.name} size={48} />
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>{model.name} is running late</div>
            <div style={{ fontSize: 12, color: MT }}>Current ETA: {currentEta}</div>
          </div>
        </div>
        <div>
          <Lbl s={{ marginBottom: 8 }}>New ETA</Lbl>
          <div style={{ display: 'flex', gap: 8 }}>
            {[10, 20, 30].map(n => (
              <button key={n} onClick={() => setPreset(n)} style={{ flex: 1, minHeight: 44, borderRadius: 8, border: preset === n ? `1.5px solid ${TX}` : `1px solid ${DV}`, background: preset === n ? '#F0EDE8' : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, cursor: 'pointer' }}>+{n} min</button>
            ))}
            <button onClick={() => setPreset('pick')} style={{ flex: 1, minHeight: 44, borderRadius: 8, border: preset === 'pick' ? `1.5px solid ${TX}` : `1px solid ${DV}`, background: preset === 'pick' ? '#F0EDE8' : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, cursor: 'pointer' }}>Pick time</button>
          </div>
          {preset && preset !== 'pick' && (
            <div style={{ marginTop: 8, fontSize: 13, color: MT }}>New ETA: {newEtaStr}</div>
          )}
        </div>
        <div>
          <Lbl s={{ marginBottom: 8 }}>Note (optional)</Lbl>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for the team" style={{ width: '100%', boxSizing: 'border-box', height: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, padding: '0 14px', color: TX, outline: 'none' }} />
        </div>
        {afterWalkthrough && preset !== null && preset !== 'pick' && (
          <div style={{ background: '#F6E3DE', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#6B2A1A', lineHeight: 1.5 }}>
            This ETA is after the walkthrough at 4:00 PM. The team will need to prep this look after the walkthrough.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10 }}>
          <button onClick={onCancel} style={{ minHeight: 52, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>CANCEL</button>
          <button onClick={() => onSave(newEtaStr, note)} disabled={!preset || preset === 'pick'} style={{ minHeight: 52, borderRadius: 8, border: 0, background: (preset && preset !== 'pick') ? TX : DV, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: (preset && preset !== 'pick') ? 'pointer' : 'default' }}>SAVE NEW ETA</button>
        </div>
      </div>
    </div>
  )
}

function ToCheckPanel({ toCheckQueue, profiles, onLooksGood, onOpenTouchup, onClose }) {
  return (
    <>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Lbl>Ready to check</Lbl>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, marginTop: 2 }}>{toCheckQueue.length} waiting</div>
        </div>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 20, color: M2, cursor: 'pointer', lineHeight: 1, padding: '4px 4px 0' }}>×</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toCheckQueue.length === 0 && (
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: M2, paddingTop: 8 }}>No checks pending</div>
        )}
        {toCheckQueue.map(check => (
          <div key={check.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <Avatar src={check.modelAvatar} name={check.modelName} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{check.modelName}</div>
                <div style={{ fontSize: 11, color: MT }}>Look {check.modelLook} · {check.specialty} by {check.assistantName.split(' ')[0]} · done {check.doneAt}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => onLooksGood(check.id)} style={{ minHeight: 44, borderRadius: 999, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>LOOKS GOOD</button>
              <button onClick={() => onOpenTouchup(check.id)} style={{ minHeight: 44, borderRadius: 999, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>TOUCH-UP</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, padding: '10px 20px 16px', borderTop: `1px solid ${BD}` }}>
        <p style={{ fontSize: 11, color: M2, margin: 0, lineHeight: 1.5 }}>Tap "Looks good" to finish the model or "Touch-up" to send notes back to the assistant.</p>
      </div>
    </>
  )
}

function TouchupSheet({ check, onSend, onClose }) {
  const [areas, setAreas] = useState([])
  const [note, setNote] = useState('')
  const WHERE_OPTIONS = ['Eyes', 'Brows', 'Skin', 'Lips', 'Other']
  function toggleArea(a) { setAreas(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]) }
  const canSend = areas.length > 0 || note.trim().length > 0
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 20 }}>
      <div style={{ width: '100%', background: BG, borderRadius: '16px 16px 0 0', paddingBottom: 28 }}>
        <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 44, height: 5, borderRadius: 3, background: DV }} />
        </div>
        <div style={{ padding: '0 20px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={check.modelAvatar} name={check.modelName} size={40} />
          <div style={{ flex: 1 }}>
            <Lbl s={{}}>Back to {check.assistantName.split(' ')[0]}</Lbl>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>Touch-up for {check.modelName.split(' ')[0]}</div>
          </div>
          <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 20, color: M2, cursor: 'pointer', lineHeight: 1, padding: '0 0 0 8px' }}>×</button>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Lbl s={{ marginBottom: 8 }}>Where</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {WHERE_OPTIONS.map(a => (
                <button key={a} onClick={() => toggleArea(a)} style={{ height: 36, padding: '0 16px', borderRadius: 999, border: areas.includes(a) ? 0 : `1px solid ${DV}`, background: areas.includes(a) ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: areas.includes(a) ? '#fff' : TX, cursor: 'pointer' }}>{a}</button>
              ))}
            </div>
          </div>
          <div>
            <Lbl s={{ marginBottom: 8 }}>What to fix</Lbl>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Describe what needs adjusting" style={{ width: '100%', boxSizing: 'border-box', height: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15, padding: '0 14px', color: TX, outline: 'none' }} />
          </div>
          <button onClick={() => onSend(areas, note)} disabled={!canSend} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: canSend ? TX : DV, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: canSend ? 'pointer' : 'default' }}>
            SEND TO {check.assistantName.split(' ')[0].toUpperCase()}
          </button>
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

const AUTHOR_KEY = 'showpartner_author_v1'
function lsGet(key, fb) { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

const IPAD_SECTIONS = [
  { id: 'home',       label: 'Home'       },
  { id: 'assistants', label: 'Assistants' },
  { id: 'lineup',     label: 'Lineup'     },
  { id: 'studio',     label: 'Studio'     },
  { id: 'settings',   label: 'Settings'   },
]

const IPAD_NOTIFS = [
  { id: 'n1', title: 'Lead check escalated', subtitle: 'Aimi asked Yadim about Sofia R · Mei Lin', time: '3:44', dot: '#111' },
  { id: 'n2', title: 'Ready to check',       subtitle: 'Kenji W · Camille Dubois, makeup done',   time: '3:43', dot: '#7A9E7E' },
  { id: 'n3', title: 'Running late',          subtitle: 'Priya Sharma, new ETA 3:55',              time: '3:40', dot: '#C4614A' },
  { id: 'n4', title: 'Arrived',               subtitle: 'Yuki Nakamura checked in, not paired',    time: '3:44', dot: '#D4A853' },
  { id: 'n5', title: 'Touch-up sent',         subtitle: 'Aimi to Ivana R · Sofia Andersen, lips',  time: '3:31', dot: '#C8C4BF' },
]

const STATUS_META_LINEUP = {
  not_started:   { color: '#C8C4BF', label: 'Not started'   },
  in_progress:   { color: '#D4A853', label: 'In progress'   },
  paused:        { color: '#8A9BB0', label: 'Paused'        },
  needs_revisit: { color: '#C4614A', label: 'Needs revisit' },
  done:          { color: '#7A9E7E', label: 'Done'          },
}

function NavIcon({ id, active }) {
  const c = active ? '#fff' : TX
  const s = { fill: 'none', stroke: c, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (id === 'home')       return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
  if (id === 'assistants') return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M22 21v-2a4 4 0 00-3-3.87"/></svg>
  if (id === 'lineup')     return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  if (id === 'studio')     return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 6l2-3h4l2 3"/></svg>
  if (id === 'settings')   return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  return null
}

function StarRow({ stars, max = 5 }) {
  return (
    <span style={{ display: 'flex', gap: 3 }} aria-label={`${stars} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"
            fill={i < stars ? '#D4A853' : 'none'}
            stroke={i < stars ? '#B8902F' : '#8E8A84'}
            strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  )
}

function ShowHistoryModal({ onClose }) {
  const [selId, setSelId] = useState(showHistory[0]?.id)
  const sh = showHistory.find(s => s.id === selId) || showHistory[0]
  const BD2 = '#E0DDD8', MT2 = '#4A4743', M22 = '#6E6A64'

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-label="Show history"
        style={{ width: 940, height: 640, background: BG, borderRadius: 18, overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', fontFamily: 'Inter, system-ui, sans-serif', color: TX }}>

        {/* Left: list */}
        <div style={{ borderRight: `1px solid ${BD2}`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '22px 20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>Show history</span>
            <span style={{ fontSize: 12, color: MT2 }}>{showHistory.length} past shows</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 10px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {showHistory.map(s => {
              const isSel = s.id === selId
              return (
                <button key={s.id} onClick={() => setSelId(s.id)} aria-current={isSel || undefined}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 14px', borderRadius: 12, border: 0, background: isSel ? '#fff' : 'transparent', boxShadow: isSel ? 'inset 0 0 0 1.5px #111' : 'none', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', color: TX }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: MT2 }}>{s.date} · {s.venue}, {s.city}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: detail */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Header */}
          <div style={{ padding: '22px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: `1px solid ${BD2}`, flexShrink: 0 }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 26 }}>{sh.name}</span>
              <span style={{ fontSize: 12, color: MT2 }}>{sh.season} · {sh.date} · {sh.venue}, {sh.city}</span>
            </span>
            <button style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>
              START A NEW SHOW FROM THIS
            </button>
            <button onClick={onClose} aria-label="Close" style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${BD2}`, background: 'transparent', fontSize: 18, color: MT2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 24px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Designer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Designer</Lbl>
                <div style={{ background: '#fff', border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{sh.designer?.brand}</span>
                  <span style={{ color: MT2 }}>Show contact: {sh.designer?.showContact} · {sh.designer?.brief}</span>
                </div>
              </div>

              {/* Models */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Lbl>Models</Lbl>
                  <span style={{ fontSize: 12, color: MT2 }}>{sh.modelsCount} models · {sh.workedWithBefore} you&apos;ve worked with before</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 6 }}>
                  {Array.from({ length: Math.min(sh.modelsCount, 6) }, (_, i) => (
                    <div key={i} style={{ width: '100%', aspectRatio: '3/4', borderRadius: 8, background: BD2 }} />
                  ))}
                </div>
              </div>

              {/* Artists and assistants */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Lbl>Artists and assistants</Lbl>
                  <span style={{ fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>All {sh.assistantsCount}</span>
                </div>
                <div>
                  {(sh.assistants || []).map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, borderBottom: `1px solid ${BD2}` }}>
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 14 }}>{a.name}</span>
                        <span style={{ fontSize: 12, color: MT2 }}>{a.role}</span>
                      </span>
                      <StarRow stars={a.stars} />
                      <span style={{ minWidth: 92, textAlign: 'right', fontSize: 12, fontWeight: a.inviteBack ? 600 : 400, color: a.inviteBack ? '#3F6B45' : MT2 }}>
                        {a.inviteBack ? 'Invited back' : 'Invite back'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Venue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Venue</Lbl>
                <div style={{ background: '#fff', border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ fontSize: 14 }}>{sh.venue}, {sh.city}</span>
                  <span style={{ color: MT2 }}>{sh.venueNotes}</span>
                </div>
              </div>

              {/* Worked alongside */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Worked alongside</Lbl>
                <div style={{ fontSize: 13 }}>
                  {(sh.workedAlongside || []).map((w, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 0', borderBottom: `1px solid ${BD2}` }}>
                      <span>{w.dept}</span>
                      <span style={{ color: MT2, textAlign: 'right' }}>{w.company} · lead {w.lead}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it went */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>How it went</Lbl>
                <div style={{ background: '#fff', border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
                  {sh.howItWent && <>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ whiteSpace: 'nowrap' }}>Walkthrough</span>
                      <span style={{ textAlign: 'right' }}>{sh.howItWent.walkthroughPlanned} planned, {sh.howItWent.walkthroughActual} actual</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ whiteSpace: 'nowrap' }}>Ready at walkthrough</span>
                      <span>{sh.howItWent.readyAtWalkthrough} of {sh.howItWent.modelsTotal}</span>
                    </span>
                  </>}
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ whiteSpace: 'nowrap' }}>Incidents</span>
                    <span style={{ color: sh.incidents?.length ? '#A33D28' : '#3F6B45' }}>
                      {sh.incidents?.length ? sh.incidents.length + ' logged' : 'None logged'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Receipts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Receipts</Lbl>
                <div style={{ background: '#fff', border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ whiteSpace: 'nowrap' }}>Total</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{sh.receipts?.total}</span>
                  </span>
                  <span style={{ color: MT2 }}>{sh.receipts?.breakdown?.join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShareStatusModal({ onClose }) {
  const [copied, setCopied] = useState(false)
  const [name,   setName]   = useState('')
  const [phone,  setPhone]  = useState('')
  const [sent,   setSent]   = useState(false)
  const url = 'showpartner.app/s/valentino-ss26-x7k2'
  function handleCopy() {
    try { navigator.clipboard.writeText('https://' + url) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  function handleSend() {
    if (!phone.trim()) return
    setSent(true); setName(''); setPhone(''); setTimeout(() => setSent(false), 3000)
  }
  const alreadyHas = [
    { name: 'Marco', role: 'Show producer', sent: '1:05 PM', opens: 'opened 6 times' },
    { name: 'Dana',  role: 'Hair producer', sent: '1:05 PM', opens: 'opened twice'   },
  ]
  const inputStyle = { height: 48, padding: '0 12px', border: `1px solid ${DV}`, borderRadius: 10, background: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: TX, outline: 'none', boxSizing: 'border-box' }
  const circumference = 2 * Math.PI * 78
  const readyPct = 8 / 30
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-label="Share the status link" style={{ width: 820, background: BG, borderRadius: 18, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px' }}>
        {/* Left column */}
        <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 26 }}>Share the status link</span>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: MT }}>For the show producer, other teams, dressing. They see numbers only, no names or photos.</span>
          </div>
          {/* Link row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 48, padding: '0 14px', border: `1px solid ${DV}`, borderRadius: 10, background: '#fff', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
            <button onClick={handleCopy} style={{ minHeight: 48, padding: '0 18px', borderRadius: 10, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>{copied ? 'COPIED' : 'COPY'}</button>
          </div>
          {/* Text it to */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Lbl>Text it to</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ ...inputStyle, width: 150 }} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleSend} style={{ minHeight: 48, padding: '0 18px', borderRadius: 10, border: `1px solid ${TX}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>{sent ? 'SENT' : 'SEND'}</button>
            </div>
          </div>
          {/* Already has it */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Lbl s={{ marginBottom: 4 }}>Already has it</Lbl>
            {alreadyHas.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, borderBottom: `1px solid ${BD}` }}>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14 }}>{p.name} · {p.role}</span>
                  <span style={{ fontSize: 12, color: MT }}>Texted {p.sent} · {p.opens}</span>
                </span>
                <button style={{ minHeight: 40, padding: '0 12px', border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: TX, cursor: 'pointer' }}>Resend</button>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
            <span style={{ flex: 1, fontSize: 12, color: MT, lineHeight: 1.4 }}>The link stops working at 7:00 PM, an hour after the show.</span>
            <button style={{ minHeight: 40, padding: '0 12px', border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: '#A33D28', cursor: 'pointer', whiteSpace: 'nowrap' }}>Turn off now</button>
            <button onClick={onClose} style={{ minHeight: 44, padding: '0 18px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>DONE</button>
          </div>
        </div>
        {/* Right column: phone preview */}
        <div style={{ background: '#E8E4DF', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <Lbl s={{ alignSelf: 'flex-start' }}>What they see</Lbl>
          <div style={{ width: 220, height: 440, borderRadius: 22, border: '6px solid #111', background: '#F5F2EE', overflow: 'hidden', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{show.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: MT }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3F6B45' }} />
              Live · updated 3:45 PM
            </span>
            <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="64" height="64" viewBox="0 0 180 180" aria-hidden="true">
                <circle cx="90" cy="90" r="78" fill="none" stroke="#E8E4DF" strokeWidth="16" />
                <circle cx="90" cy="90" r="78" fill="none" stroke="#7A9E7E" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${circumference * readyPct} ${circumference}`} transform="rotate(-90 90 90)" />
                <text x="90" y="100" textAnchor="middle" fontFamily="Georgia, serif" fontSize="34" fill="#111">27%</text>
              </svg>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 9, color: MT }}>
                <span>Ready <b style={{ color: TX }}>8 of 30</b></span>
                <span>Show in <b style={{ color: TX }}>2h 15m</b></span>
                <span>Not arrived <b style={{ color: TX }}>3</b></span>
              </span>
            </div>
            {[['Hair',14],['Makeup',17],['Nails',9]].map(([svc, n]) => (
              <div key={svc} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}>{svc}<span style={{ color: MT }}>{n} of 30</span></span>
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: '#E8E4DF' }}>
                  <span style={{ width: `${n / 30 * 100}%`, background: '#7A9E7E' }} />
                </div>
              </div>
            ))}
            <span style={{ fontSize: 9, color: MT, marginTop: 4 }}>Walkthrough 4:00 · Dressing 5:00 · Show 6:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const INCIDENT_TYPES_IPAD = ['Late Arrival', 'Left Early', 'No Show', 'Medical', 'Other']
const ASST_SHOW_COUNTS = { 'Sofia Reyes': 4, 'Lena Schmidt': 2, 'Dara Okafor': 1, 'Ivana R': 3, 'Tomás V': 2, 'Kenji Watanabe': 5, 'Mira Patel': 1, 'Aimi K': 6, 'Iona M': 3 }
const ASST_AVG_TIMES   = { 'Sofia Reyes': '43m', 'Lena Schmidt': '51m', 'Dara Okafor': '38m', 'Ivana R': '29m', 'Tomás V': '46m', 'Kenji Watanabe': '47m', 'Mira Patel': '52m', 'Aimi K': '40m', 'Iona M': '44m' }
const ASST_FREE_SINCE  = { 'Lena Schmidt': '3:38', 'Dara Okafor': '3:41', 'Mira Patel': '3:20', 'Aimi K': 'at the front', 'Iona M': 'on Look 02' }
function ordinal(n) { const s = ['th','st','nd','rd']; const v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]) }

function IPadAssistantsSection({ models, profiles: profs }) {
  const [chip, setChip]               = useState('all')
  const [selId, setSelId]             = useState(null)
  const [overallStars, setOverallStars] = useState({})
  const [overallNote, setOverallNote]   = useState({})
  const [inviteBack, setInviteBack]     = useState({})
  const [modelStars, setModelStars]     = useState({})
  const [modelNotes, setModelNotes]     = useState({})
  const [editingNote, setEditingNote]   = useState(null)
  const [noteInput, setNoteInput]       = useState('')
  const [incidents, setIncidents]       = useState([])
  const [showForm, setShowForm]         = useState(false)
  const [incForm, setIncForm]           = useState({ type: 'Late Arrival', notes: '' })
  const [pending, setPending]           = useState(null)

  const assistants = profs.filter(p => p.role === 'assistant' || p.role === 'lead_assistant')
  const SPEC_ORDER = ['hair', 'makeup', 'nails']

  function getStatus(a) {
    return models.some(m =>
      (m.services?.hair?.assistantId === a.id   && m.services.hair.status   === 'in_progress') ||
      (m.services?.makeup?.assistantId === a.id && m.services.makeup.status === 'in_progress') ||
      (m.services?.nails?.assistantId === a.id  && m.services.nails.status  === 'in_progress')
    ) ? 'working' : 'free'
  }

  function getCurrentModel(a) {
    return models.find(m =>
      (m.services?.hair?.assistantId === a.id   && m.services.hair.status   === 'in_progress') ||
      (m.services?.makeup?.assistantId === a.id && m.services.makeup.status === 'in_progress') ||
      (m.services?.nails?.assistantId === a.id  && m.services.nails.status  === 'in_progress')
    )
  }

  const totalLeads  = assistants.filter(a => a.role === 'lead_assistant').length
  const totalWorking = assistants.filter(a => getStatus(a) === 'working').length
  const totalFree   = assistants.filter(a => getStatus(a) === 'free').length

  const filtered = assistants.filter(a => {
    if (chip === 'all')     return true
    if (chip === 'working') return getStatus(a) === 'working'
    if (chip === 'free')    return getStatus(a) === 'free'
    if (chip === 'leads')   return a.role === 'lead_assistant'
    return true
  })

  const grouped = SPEC_ORDER.map(k => ({
    key: k, label: k.charAt(0).toUpperCase() + k.slice(1),
    people: filtered.filter(a => a.specialty === k),
  })).filter(g => g.people.length > 0)
  const ungrouped = filtered.filter(a => !a.specialty)

  const selA = selId ? profs.find(p => p.id === selId) : null
  const assigned = selA ? models.filter(m =>
    m.services?.hair?.assistantId   === selA.id ||
    m.services?.makeup?.assistantId === selA.id ||
    m.services?.nails?.assistantId  === selA.id
  ) : []
  const selCurrentModel = selA ? getCurrentModel(selA) : null

  function submitInc() {
    const inc = { id: Date.now(), type: incForm.type, notes: incForm.notes, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }
    setPending(inc); setShowForm(false); setIncForm({ type: 'Late Arrival', notes: '' })
  }

  function AsstRow({ a }) {
    const st = getStatus(a)
    const isSel = selId === a.id
    const curM = getCurrentModel(a)
    const sub = st === 'working' && curM
      ? `On ${curM.name} · Look ${curM.lookNumber || curM.look}`
      : (ASST_FREE_SINCE[a.name] ? `Free since ${ASST_FREE_SINCE[a.name]}` : 'Available')
    const dotColor = a.role === 'lead_assistant' ? TX : (st === 'working' ? '#D4A853' : '#7A9E7E')
    return (
      <button onClick={() => { setSelId(a.id); setShowForm(false); setPending(null) }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, padding: '0 12px', background: isSel ? '#fff' : 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', boxShadow: isSel ? 'inset 0 0 0 1.5px #111' : 'none' }}>
        <Avatar src={a.avatar} name={a.name} size={40} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
          <span style={{ fontSize: 12, color: MT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>
        </span>
        <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: M2, flexShrink: 0 }}>{a.role === 'lead_assistant' ? 'Lead' : (a.specialty || SVC)}</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      </button>
    )
  }

  const chipDef = [
    { id: 'all',     label: `All ${assistants.length}` },
    { id: 'working', label: `Working ${totalWorking}` },
    { id: 'free',    label: `Free ${totalFree}` },
    { id: 'leads',   label: `Leads ${totalLeads}` },
  ]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      {/* Left 440px list */}
      <div style={{ width: 440, flexShrink: 0, borderRight: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, padding: '16px 20px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>Team today</span>
            <span style={{ fontSize: 12, color: MT }}>{assistants.length - totalLeads} assistants · {totalLeads} leads</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {chipDef.map(c => (
              <button key={c.id} onClick={() => setChip(c.id)} style={{ height: 36, padding: '0 14px', borderRadius: 999, border: chip === c.id ? `1px solid ${TX}` : `1px solid ${DV}`, background: chip === c.id ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: chip === c.id ? '#fff' : TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {grouped.map(g => (
            <div key={g.key}>
              <Lbl s={{ padding: '16px 12px 6px' }}>{g.label}</Lbl>
              {g.people.map(a => <AsstRow key={a.id} a={a} />)}
            </div>
          ))}
          {ungrouped.map(a => <AsstRow key={a.id} a={a} />)}
        </div>
      </div>
      {/* Right: detail */}
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {!selA ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: M2 }}>Select a team member</p>
          </div>
        ) : (
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* 1. Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar src={selA.avatar} name={selA.name} size={72} />
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 28 }}>{selA.name}</span>
                <span style={{ fontSize: 13, color: MT }}>
                  {selA.role === 'lead_assistant' ? 'Lead assistant' : (selA.specialty ? selA.specialty.charAt(0).toUpperCase() + selA.specialty.slice(1) + ' assistant' : 'Makeup assistant')}
                  {' · '}{ordinal(ASST_SHOW_COUNTS[selA.name] || 1)} show with you
                  {selCurrentModel ? ` · on ${selCurrentModel.name} now` : ''}
                </span>
              </span>
            </div>
            {/* 2. Overall card */}
            <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>Overall for {show.name}</span>
                  <span style={{ fontSize: 12, color: MT }}>Private. Only you and the agent see this.</span>
                </span>
                <span style={{ display: 'flex', gap: 3 }} aria-label={`${overallStars[selA.id] || 0} of 5`}>
                  {[1,2,3,4,5].map(n => {
                    const cur = overallStars[selA.id] || 0
                    return <button key={n} onClick={() => setOverallStars(s => ({ ...s, [selA.id]: cur === n ? 0 : n }))}
                      style={{ fontSize: 28, color: n <= cur ? '#D4A853' : '#D0CCC7', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', lineHeight: 1 }}>★</button>
                  })}
                </span>
              </div>
              <textarea value={overallNote[selA.id] || ''} onChange={e => setOverallNote(n => ({ ...n, [selA.id]: e.target.value }))}
                rows={2} placeholder="Performance notes for post-show review..."
                style={{ padding: 12, border: `1px solid ${DV}`, borderRadius: 10, background: BG, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, lineHeight: 1.45, resize: 'none', color: TX, outline: 'none' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#EEF3EE', cursor: 'pointer' }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: inviteBack[selA.id] ? '#3F6B45' : '#fff', border: inviteBack[selA.id] ? 'none' : `1.5px solid #B5B0AA`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {inviteBack[selA.id] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10"/></svg>}
                </span>
                <input type="checkbox" checked={!!inviteBack[selA.id]} onChange={e => setInviteBack(v => ({ ...v, [selA.id]: e.target.checked }))} style={{ display: 'none' }} />
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Invite back</span>
                  <span style={{ fontSize: 12, color: MT }}>Alexis (agent) gets your recommendation when the show wraps.</span>
                </span>
              </label>
            </div>
            {/* 3. Stat tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {[['Models today', String(assigned.length)], ['Avg time', ASST_AVG_TIMES[selA.name] || '45m'], ['Touch-ups', '0']].map(([lbl, val]) => (
                <div key={lbl} style={{ border: `1px solid ${BD}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Lbl>{lbl}</Lbl>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>{val}</span>
                </div>
              ))}
            </div>
            {/* 4. Today's models */}
            {assigned.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <Lbl>Today's models</Lbl>
                  <span style={{ fontSize: 12, color: MT }}>Rate or note each one, optional</span>
                </div>
                {assigned.map(m => {
                  const key = `${selA.id}:${m.id}`
                  const mStar = modelStars[key] || 0
                  const mNote = modelNotes[key] || ''
                  const isEditing = editingNote === key
                  return (
                    <div key={m.id} style={{ borderBottom: `1px solid ${BD}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56 }}>
                        <Avatar src={m.avatar} name={m.name} size={32} />
                        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 14 }}>{m.name} · Look {m.lookNumber || m.look}</span>
                          <span style={{ fontSize: 12, color: MT }}>{m.services?.[SVC]?.status === 'in_progress' ? 'In progress' : m.services?.[SVC]?.status === 'done' ? 'Done' : 'Not started'}</span>
                        </span>
                        {!mNote && <button onClick={() => { setEditingNote(key); setNoteInput('') }} style={{ border: 0, background: 'none', fontSize: 12, color: MT, textDecoration: 'underline', cursor: 'pointer' }}>Add note</button>}
                        {mStar === 0
                          ? <button onClick={() => setModelStars(s => ({ ...s, [key]: 1 }))} style={{ border: 0, background: 'none', fontSize: 12, color: MT, textDecoration: 'underline', cursor: 'pointer' }}>Rate</button>
                          : <span style={{ display: 'flex', gap: 2 }}>
                              {[1,2,3,4,5].map(n => <button key={n} onClick={() => setModelStars(s => ({ ...s, [key]: mStar === n ? 0 : n }))} style={{ fontSize: 14, color: n <= mStar ? '#D4A853' : '#D0CCC7', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 2px', lineHeight: 1 }}>★</button>)}
                            </span>
                        }
                      </div>
                      {isEditing && (
                        <div style={{ margin: '0 0 10px 44px', display: 'flex', gap: 8 }}>
                          <input value={noteInput} onChange={e => setNoteInput(e.target.value)} autoFocus placeholder="Add a note..." style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${DV}`, background: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, outline: 'none' }} />
                          <button onClick={() => { if (noteInput.trim()) setModelNotes(n => ({ ...n, [key]: noteInput.trim() })); setEditingNote(null) }} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditingNote(null)} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      )}
                      {mNote && !isEditing && (
                        <div style={{ margin: '0 0 12px 44px', padding: '10px 12px', borderRadius: 10, background: '#fff', border: `1px solid ${BD}`, fontSize: 13, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ flex: 1 }}>{mNote}</span>
                          <button onClick={() => { setNoteInput(mNote); setEditingNote(key) }} style={{ border: 0, background: 'none', fontSize: 11, color: MT, textDecoration: 'underline', cursor: 'pointer', flexShrink: 0 }}>Edit</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {/* 5. Their photos */}
            {assigned.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Lbl>Their photos</Lbl>
                  <span style={{ fontSize: 12, color: MT }}>{assigned.length} uploaded</span>
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                  {assigned.map(m => (
                    <span key={m.id} style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={m.avatar} alt={`Look ${m.lookNumber || m.look}`} style={{ width: 96, height: 128, borderRadius: 10, objectFit: 'cover', display: 'block' }} />
                      <span style={{ position: 'absolute', left: 6, bottom: 6, padding: '2px 6px', borderRadius: 4, background: 'rgba(17,17,17,.75)', color: '#fff', fontSize: 10 }}>Look {m.lookNumber || m.look}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* 6. Incident form */}
            {showForm && (
              <div style={{ border: `1px solid ${BD}`, borderRadius: 12, padding: 16 }}>
                <Lbl s={{ marginBottom: 10 }}>Flag an incident</Lbl>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {INCIDENT_TYPES_IPAD.map(t => <button key={t} onClick={() => setIncForm(f => ({ ...f, type: t }))} style={{ height: 30, padding: '0 12px', borderRadius: 999, border: incForm.type === t ? `1px solid ${TX}` : `1px solid ${DV}`, background: incForm.type === t ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: incForm.type === t ? '#fff' : TX, cursor: 'pointer' }}>{t}</button>)}
                </div>
                <textarea value={incForm.notes} onChange={e => setIncForm(f => ({ ...f, notes: e.target.value }))} placeholder="What happened?" rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, resize: 'none', outline: 'none', marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={submitInc} style={{ flex: 1, height: 44, borderRadius: 8, border: 0, background: '#D4A853', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>CONTINUE</button>
                  <button onClick={() => { setShowForm(false); setIncForm({ type: 'Late Arrival', notes: '' }) }} style={{ flex: 1, height: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>CANCEL</button>
                </div>
              </div>
            )}
            {pending && (
              <div style={{ border: '1px solid #A33D28', borderRadius: 12, padding: 16 }}>
                <Lbl s={{ color: '#A33D28', marginBottom: 8 }}>Confirm incident</Lbl>
                <p style={{ fontSize: 13, color: TX, margin: '0 0 12px' }}><strong>{pending.type}</strong>{pending.notes ? ` -- ${pending.notes}` : ''}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setIncidents(p => [...p, pending]); setPending(null) }} style={{ flex: 1, height: 44, borderRadius: 8, border: 0, background: '#A33D28', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>YES, SUBMIT</button>
                  <button onClick={() => setPending(null)} style={{ flex: 1, height: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>GO BACK</button>
                </div>
              </div>
            )}
            {incidents.length > 0 && (
              <div>
                <Lbl s={{ marginBottom: 8 }}>Incident log</Lbl>
                {incidents.map(inc => (
                  <div key={inc.id} style={{ display: 'flex', gap: 8, padding: '8px 0 8px 10px', borderLeft: '2px solid #A33D28', marginLeft: -12, borderBottom: `1px solid ${BD}` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, color: '#A33D28', fontWeight: 600, margin: 0 }}>{inc.type}</p>
                      <p style={{ fontSize: 12, color: MT, margin: '2px 0 0' }}>{inc.notes}</p>
                      <p style={{ fontSize: 10, color: M2, margin: '2px 0 0' }}>{inc.time}</p>
                    </div>
                    <button onClick={() => setIncidents(p => p.filter(i => i.id !== inc.id))} style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: '#A33D28', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>DELETE</button>
                  </div>
                ))}
              </div>
            )}
            {!showForm && !pending && (
              <button onClick={() => setShowForm(true)} style={{ alignSelf: 'flex-start', minHeight: 44, padding: '0 18px', borderRadius: 8, border: '1px solid #A33D28', background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: '#A33D28', letterSpacing: '.1em', cursor: 'pointer' }}>FLAG AN INCIDENT</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const LINEUP_PANEL_DATA = {
  'Mei Lin': {
    lookLabel: 'Look 06 · walks 6th · Look B',
    arrival: '2:52',
    latestUpdate: { time: '3:38', text: 'Marco D: "Waiting on clip-ins from kit 2, back in 10."', chipLabel: 'Hair paused', chipColor: '#8A9BB0', borderColor: '#8A9BB0' },
    serviceWho: { hair: 'Marco D · paused at 3:38', makeup: 'Sofia R · 18 min so far', nails: 'Bianca R is up next' },
    allergy: 'Latex. Use non-latex sponges only.',
    note: 'Coming from Prada, may still have their lash glue on. Sensitive eyes.',
    updates: [
      { time: '3:27', text: 'Makeup started · Sofia R' },
      { time: '3:05', text: 'Hair started · Marco D' },
      { time: '2:52', text: 'Arrived, came from Prada' },
      { time: '2:40', text: 'ETA pushed to 2:50' },
    ],
    pastShowCount: 2, pastShowNames: 'Valentino FW25, Khaite SS25',
  },
  'Sofia Andersen': {
    lookLabel: 'Look 01 · walks 1st · Look A',
    arrival: '2:30',
    latestUpdate: { time: '3:41', text: 'Ivana R: "Touch-up on brow arch needed."', chipLabel: 'Makeup revisit', chipColor: '#C4614A', borderColor: '#C4614A' },
    serviceWho: { hair: 'Sasha K · done at 3:10', makeup: 'Ivana R · touch-up', nails: 'Bianca R · done' },
    allergy: null,
    note: null,
    updates: [
      { time: '3:41', text: 'Touch-up flagged · Ivana R' },
      { time: '3:10', text: 'Hair done · Sasha K' },
      { time: '2:30', text: 'Arrived' },
    ],
    pastShowCount: 1, pastShowNames: 'Valentino FW25',
  },
}

function IPadLineupSection({ models }) {
  const [selModel, setSelModel] = useState(null)
  const svcs = ['hair', 'makeup', 'nails']

  function getPanelData(m) {
    return LINEUP_PANEL_DATA[m.name] || {
      lookLabel: `Look ${String(m.lookNumber || m.look).padStart(2,'0')} · Look A`,
      arrival: '3:00',
      latestUpdate: null,
      serviceWho: { hair: null, makeup: null, nails: null },
      allergy: m.allergy || null,
      note: m.notes || null,
      updates: [{ time: '3:00', text: 'Arrived' }],
      pastShowCount: 1, pastShowNames: 'Valentino FW25',
    }
  }

  function getServiceCounts(m) {
    const c = { done: 0, in_progress: 0, paused: 0 }
    svcs.forEach(s => {
      const st = m.services?.[s]?.status
      if (st === 'done') c.done++
      else if (st === 'in_progress') c.in_progress++
      else if (st === 'paused') c.paused++
    })
    return c
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      {/* Grid area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 8, padding: '16px 24px 12px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, whiteSpace: 'nowrap' }}>Show order</span>
          <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap' }}>{models.length} looks</span>
          <span style={{ flex: 1 }} />
          <span style={{ flexBasis: '100%', display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 11, color: MT }}>
            {Object.entries(STATUS_META_LINEUP).map(([key, meta]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: meta.color }} />
                {meta.label}
              </span>
            ))}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: selModel ? 'repeat(5, minmax(0,1fr))' : 'repeat(8, minmax(0,1fr))', gap: 12, alignContent: 'start' }}>
            {models.map((m, i) => {
              const isSel = selModel?.id === m.id
              const isNs = !m.status || m.status === 'not_started'
              const statusColor = STATUS_META_LINEUP[m.status]?.color
              const lookNum = String(m.lookNumber || i + 1).padStart(2, '0')
              return (
                <button key={m.id} onClick={() => setSelModel(isSel ? null : m)}
                  style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                  <span style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', borderRadius: 10, overflow: 'hidden', background: '#E0DDD8', boxShadow: isSel ? '0 0 0 3px #F5F2EE, 0 0 0 6px #111' : 'none', outline: !isNs ? `4px solid ${statusColor}` : 'none', outlineOffset: -4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isNs ? 0.45 : 1 }} />
                    <span style={{ position: 'absolute', left: 8, top: 8, padding: '2px 6px', borderRadius: 4, background: '#fff', fontSize: 12, fontWeight: 600, color: TX }}>{lookNum}</span>
                  </span>
                  <span style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {/* Side panel */}
      {selModel && (() => {
        const pd = getPanelData(selModel)
        const c = getServiceCounts(selModel)
        return (
          <aside aria-label="Model details" style={{ width: 400, flexShrink: 0, borderLeft: `1px solid ${BD}`, background: '#FBFAF8', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Header */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <img src={selModel.avatar} alt={selModel.name} style={{ width: 90, aspectRatio: '3 / 4', borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 24, lineHeight: 1.1 }}>{selModel.name}</span>
                  <span style={{ fontSize: 13, color: MT }}>{pd.lookLabel}</span>
                  <span style={{ fontSize: 13, color: MT }}>Arrived {pd.arrival}</span>
                  <span style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>{c.done} of 3 done</span>
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: '#E8E4DF' }}>
                      <span style={{ width: `${c.done / 3 * 100}%`, background: '#7A9E7E' }} />
                      <span style={{ width: `${c.in_progress / 3 * 100}%`, background: '#D4A853' }} />
                      <span style={{ width: `${c.paused / 3 * 100}%`, background: '#8A9BB0' }} />
                    </div>
                  </span>
                </span>
                <button onClick={() => setSelModel(null)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${BD}`, background: 'transparent', fontSize: 18, color: MT, flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              {/* Latest update */}
              {pd.latestUpdate && (
                <div style={{ background: '#fff', border: `1px solid ${BD}`, borderLeft: `4px solid ${pd.latestUpdate.borderColor}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Lbl>Latest · {pd.latestUpdate.time}</Lbl>
                    <span style={{ display: 'inline-block', height: 22, padding: '0 8px', borderRadius: 999, background: pd.latestUpdate.chipColor, fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: '22px', color: TX }}>{pd.latestUpdate.chipLabel}</span>
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.45 }}>{pd.latestUpdate.text}</span>
                </div>
              )}
              {/* Where they're at */}
              <div>
                <Lbl s={{ marginBottom: 2 }}>Where they're at</Lbl>
                {svcs.map(svc => {
                  const st = selModel.services?.[svc]?.status || 'not_started'
                  const chipColor = STATUS_META_LINEUP[st]?.color || '#E0DDD8'
                  const chipLabel = STATUS_META_LINEUP[st]?.label || 'Not started'
                  const who = pd.serviceWho[svc]
                  return (
                    <div key={svc} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) auto', gap: 10, alignItems: 'center', minHeight: 44, borderBottom: `1px solid ${BD}` }}>
                      <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{svc}</span>
                      <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{who || 'Not assigned'}</span>
                      <span style={{ display: 'inline-block', height: 22, padding: '0 8px', borderRadius: 999, background: chipColor, fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: '22px', color: TX, whiteSpace: 'nowrap' }}>{chipLabel}</span>
                    </div>
                  )
                })}
              </div>
              {/* Notes */}
              {(pd.allergy || pd.note) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Lbl>Notes</Lbl>
                  {pd.allergy && (
                    <span style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: '#F8E9E5', fontSize: 13, lineHeight: 1.4 }}>
                      <b style={{ color: '#A33D28', fontSize: 11, letterSpacing: '.08em', paddingTop: 1, flexShrink: 0 }}>ALLERGY</b>
                      <span>{pd.allergy}</span>
                    </span>
                  )}
                  {pd.note && (
                    <span style={{ padding: '10px 12px', borderRadius: 10, background: '#fff', border: `1px solid ${BD}`, fontSize: 13, lineHeight: 1.4 }}>{pd.note}</span>
                  )}
                </div>
              )}
              {/* Earlier updates */}
              {pd.updates.length > 0 && (
                <div>
                  <Lbl s={{ marginBottom: 2 }}>Earlier updates</Lbl>
                  {pd.updates.map((u, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', gap: 10, padding: '7px 0', fontSize: 12 }}>
                      <span style={{ color: MT }}>{u.time}</span>
                      <span>{u.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Past shows */}
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: `1px solid ${BD}`, background: '#fff', fontFamily: 'Inter,system-ui,sans-serif', textAlign: 'left', color: TX, cursor: 'pointer' }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14 }}>Past shows with you · {pd.pastShowCount}</span>
                  <span style={{ fontSize: 12, color: MT }}>{pd.pastShowNames}</span>
                </span>
                <span aria-hidden="true" style={{ fontSize: 16, color: MT }}>›</span>
              </button>
            </div>
            {/* Sticky footer */}
            <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
              <button style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>PING ASSISTANT</button>
              <span style={{ flex: 1 }} />
              <button style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>UPDATE STATUS</button>
            </div>
          </aside>
        )
      })()}
    </div>
  )
}

const LOOK_AREAS = ['Eyes','Brows','Skin','Cheeks','Lips']

function IPadStudioSection() {
  const DEFAULT_DATA = {
    lookCount: 3,
    lookNames: { A: 'Look A', B: 'Look B', C: 'Look C' },
    looks: {
      A: { areas: { Eyes: { notes: '', products: '', refs: '' }, Brows: { notes: '', products: '', refs: '' }, Skin: { notes: 'Dewy base, focus on glow', products: '', refs: '' }, Cheeks: { notes: '', products: '', refs: '' }, Lips: { notes: '', products: '', refs: '' } }, shared: false, pendingApproval: false },
      B: { areas: { Eyes: { notes: 'Smoky liner, deep shadow', products: '', refs: '' }, Brows: { notes: 'Feathered brow', products: '', refs: '' }, Skin: { notes: '', products: '', refs: '' }, Cheeks: { notes: '', products: '', refs: '' }, Lips: { notes: 'Nude gloss', products: '', refs: '' } }, shared: false, pendingApproval: true },
      C: { areas: { Eyes: { notes: '', products: '', refs: '' }, Brows: { notes: '', products: '', refs: '' }, Skin: { notes: '', products: '', refs: '' }, Cheeks: { notes: '', products: '', refs: '' }, Lips: { notes: '', products: '', refs: '' } }, shared: false, pendingApproval: false },
    },
    assignments: {},
  }
  const [data, setData]     = useState(() => lsGet(AUTHOR_KEY, DEFAULT_DATA))
  const [selLook, setSelLook] = useState('A')
  const [selArea, setSelArea] = useState('Eyes')

  const lookKeys = data.lookNames ? Object.keys(data.lookNames).slice(0, data.lookCount || 3) : ['A','B','C']

  function updateArea(lookKey, area, field, value) {
    setData(prev => {
      const next = { ...prev, looks: { ...prev.looks, [lookKey]: { ...prev.looks?.[lookKey], areas: { ...(prev.looks?.[lookKey]?.areas || {}), [area]: { ...(prev.looks?.[lookKey]?.areas?.[area] || {}), [field]: value } } } } }
      lsSet(AUTHOR_KEY, next); return next
    })
  }
  function toggleLookFlag(lookKey, flag) {
    setData(prev => { const next = { ...prev, looks: { ...prev.looks, [lookKey]: { ...prev.looks?.[lookKey], [flag]: !prev.looks?.[lookKey]?.[flag] } } }; lsSet(AUTHOR_KEY, next); return next })
  }

  const curLook = data.looks?.[selLook] || { areas: {} }
  const curArea = curLook.areas?.[selArea] || { notes: '', products: '', refs: '' }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}><Lbl>Studio</Lbl></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {lookKeys.map(key => {
            const look = data.looks?.[key]
            const name = data.lookNames?.[key] || `Look ${key}`
            const isActive = selLook === key
            return (
              <button key={key} onClick={() => { setSelLook(key); setSelArea('Eyes') }} style={{ width: '100%', padding: '12px 20px', background: isActive ? '#E8E4DF' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: TX }}>{name}</span>
                {look?.pendingApproval && <span style={{ fontSize: 10, color: '#D4A853', letterSpacing: '.06em' }}>Pending approval</span>}
                {look?.shared && <span style={{ fontSize: 10, color: '#7A9E7E', letterSpacing: '.06em' }}>Shared</span>}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BD}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>{data.lookNames?.[selLook] || `Look ${selLook}`}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toggleLookFlag(selLook, 'pendingApproval')} style={{ height: 36, padding: '0 14px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>{curLook.pendingApproval ? 'REVOKE REQUEST' : 'REQUEST APPROVAL'}</button>
            <button onClick={() => toggleLookFlag(selLook, 'shared')} style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, cursor: 'pointer' }}>{curLook.shared ? 'UNSHARE' : 'SHARE'}</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BD}`, flexShrink: 0, padding: '0 24px', overflowX: 'auto' }}>
          {LOOK_AREAS.map(area => (
            <button key={area} onClick={() => setSelArea(area)} style={{ height: 40, padding: '0 14px', background: 'transparent', border: 'none', borderBottom: selArea === area ? `2px solid ${TX}` : '2px solid transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: selArea === area ? TX : MT, cursor: 'pointer', marginBottom: -1, whiteSpace: 'nowrap' }}>{area}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['notes','Notes','Describe the look...'],['products','Products','List products used...'],['refs','References','Reference photos or links...']].map(([field, label, ph]) => (
            <div key={field}>
              <Lbl s={{ marginBottom: 6 }}>{label}</Lbl>
              <textarea value={curArea[field] || ''} onChange={e => updateArea(selLook, selArea, field, e.target.value)} rows={field === 'notes' ? 4 : 2} placeholder={ph} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, resize: 'none', outline: 'none' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SETTINGS_ITEMS = [
  { id: 'schedule',      label: 'Schedule',      group: 'show'  },
  { id: 'venue',         label: 'Venue',          group: 'show'  },
  { id: 'models',        label: 'Models',         group: 'show'  },
  { id: 'team',          label: 'Team',           group: 'show'  },
  { id: 'notifications', label: 'Notifications',  group: 'prefs' },
  { id: 'appearance',    label: 'Appearance',     group: 'prefs' },
  { id: 'about',         label: 'About',          group: 'prefs' },
]

function IPadSettingsSection({ dark, onToggleDark, schedule, onScheduleChange, venue, modelCount }) {
  const [active, setActive]         = useState('schedule')
  const [rows, setRows]             = useState(() => schedule || [])
  const [localVenue, setLocalVenue] = useState(venue || '')

  function changeRow(idx, field, value) {
    setRows(prev => { const n = prev.map((r, i) => i === idx ? { ...r, [field]: value } : r); onScheduleChange?.(n); return n })
  }
  function addRow()      { setRows(prev => { const n = [...prev, { time: '', label: '' }]; onScheduleChange?.(n); return n }) }
  function deleteRow(idx){ setRows(prev => { const n = prev.filter((_, i) => i !== idx); onScheduleChange?.(n); return n }) }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BD}`, overflowY: 'auto' }}>
        {[['show','Show Setup'],['prefs','Preferences']].map(([grp, grpLabel]) => (
          <div key={grp} style={{ padding: '16px 0 8px' }}>
            <Lbl s={{ padding: '0 20px', marginBottom: 4 }}>{grpLabel}</Lbl>
            {SETTINGS_ITEMS.filter(s => s.group === grp).map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: active === s.id ? '#E8E4DF' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: TX, textAlign: 'left' }}>
                {s.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={M2} strokeWidth="1.5" strokeLinecap="round"><polyline points="3 2 7 5 3 8"/></svg>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '24px 28px' }}>
        {active === 'schedule' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Schedule</p>
            {rows.map((row, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <input value={row.time || ''} onChange={e => changeRow(idx, 'time', e.target.value)} placeholder="Time" style={{ width: 100, height: 40, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, padding: '0 12px', color: TX, outline: 'none' }} />
                <input value={row.label || ''} onChange={e => changeRow(idx, 'label', e.target.value)} placeholder="Event" style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, padding: '0 12px', color: TX, outline: 'none' }} />
                <button onClick={() => deleteRow(idx)} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BD}`, background: 'transparent', color: '#C4614A', cursor: 'pointer', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
            <button onClick={addRow} style={{ height: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: TX, cursor: 'pointer', marginTop: 4 }}>+ Add row</button>
          </div>
        )}
        {active === 'venue' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Venue</p>
            <Lbl s={{ marginBottom: 6 }}>Location</Lbl>
            <input value={localVenue} onChange={e => setLocalVenue(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', height: 44, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, padding: '0 14px', color: TX, outline: 'none' }} />
          </div>
        )}
        {active === 'models' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Models</p>
            <p style={{ fontSize: 13, color: MT }}>{modelCount || 30} models loaded for this show.</p>
          </div>
        )}
        {active === 'team' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Team</p>
            <p style={{ fontSize: 13, color: MT }}>28 assistants on the team for this show.</p>
          </div>
        )}
        {active === 'notifications' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Notifications</p>
            {[['Status alerts','Notify when model status changes'],['Pings','Notify when an assistant sends a ping']].map(([label, desc]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BD}` }}>
                <div><div style={{ fontSize: 14, color: TX }}>{label}</div><div style={{ fontSize: 12, color: MT, marginTop: 2 }}>{desc}</div></div>
                <span style={{ width: 44, height: 24, borderRadius: 999, background: TX, position: 'relative', flexShrink: 0, display: 'inline-block' }}><span style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} /></span>
              </div>
            ))}
          </div>
        )}
        {active === 'appearance' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Appearance</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BD}` }}>
              <span style={{ fontSize: 14, color: TX }}>Dark mode</span>
              <button onClick={onToggleDark} style={{ width: 44, height: 24, borderRadius: 999, background: dark ? TX : BD, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 150ms', flexShrink: 0 }}>
                <span style={{ position: 'absolute', top: 3, left: dark ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
              </button>
            </div>
          </div>
        )}
        {active === 'about' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>About</p>
            <p style={{ fontSize: 13, color: MT, lineHeight: 1.6 }}>Show Partner helps production teams coordinate talent, beauty, and logistics on show day.</p>
            <p style={{ fontSize: 12, color: M2, marginTop: 8 }}>Version 1.0 · Front-end preview</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProducerIPadView({
  models, setModels,
  walkthroughPhase, setWalkthroughPhase,
  announcements, setAnnouncements,
  toCheckQueue = [],
  touchupNotes = [],
  runningLates = {},
  recentArrivals = [],
  onLooksGood,
  onSendTouchup,
  onArrived,
  onRunningLate,
  onLogOut,
  dark = false,
  onToggleDark,
  schedule,
  onScheduleChange,
  venue,
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
  const [lateModalId, setLateModalId] = useState(null)
  const [touchupCheckId, setTouchupCheckId] = useState(null)
  const [activeModel, setActiveModel] = useState(null)
  const [statusLinkOpen, setStatusLinkOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [ipadSection, setIpadSection] = useState(() => lsGet('sp_ipad_section', 'home'))
  const [menuOpen, setMenuOpen]       = useState(() => lsGet('sp_ipad_menu', true))
  const [bellOpen, setBellOpen]       = useState(false)
  const [showHistoryOpen, setShowHistoryOpen] = useState(false)

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
  const toCheckCount    = toCheckQueue.length

  const filtered = models.filter(m => {
    switch (filter) {
      case 'needs_attention': return m.flagged
      case 'not_arrived':     return !m.arrived
      case 'not_paired':      return m.arrived && !m.services[SVC].assistantId
      case 'ready':           return m.services.hair.status === 'done' && m.services.makeup.status === 'done' && m.services.nails.status === 'done'
      case 'to_check':        return toCheckQueue.some(c => c.modelId === m.id)
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

  function handleArrivedLocal(modelId) {
    onArrived?.(modelId)
  }
  function handleRunningLateLocal(newEta, noteText) {
    if (!lateModalId) return
    onRunningLate?.(lateModalId, newEta)
    setLateModalId(null)
  }
  function handleOpenTouchup(checkId) {
    setTouchupCheckId(checkId)
  }
  function handleSendTouchupLocal(areas, note) {
    if (!touchupCheckId) return
    onSendTouchup?.(touchupCheckId, areas, note)
    setTouchupCheckId(null)
  }

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
  const showRight  = panel === 'default' || panel === 'confirm' || panel === 'arrivals' || panel === 'to_check'

  const svcCards = [
    { svc: 'hair',   label: 'Hair',   ...DS.hair   },
    { svc: 'makeup', label: 'Makeup', ...DS.makeup },
    { svc: 'nails',  label: 'Nails',  ...DS.nails  },
  ]

  return (
    <div className="sp-ipad" style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', color: TX }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', height: 56, borderBottom: `1px solid ${BD}` }}>
        {/* Menu button M3/M4 */}
        <button
          onClick={() => { const next = !menuOpen; setMenuOpen(next); lsSet('sp_ipad_menu', next) }}
          style={{ height: 44, padding: '0 14px 0 12px', borderRadius: 12, border: `1px solid ${TX}`, background: menuOpen ? TX : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
          }
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{show.name}</span>
          <span style={{ fontSize: 10, color: MT, whiteSpace: 'nowrap', letterSpacing: '.06em' }}>{SVC_LABEL} · {currentTime}</span>
        </div>
        <span style={{ flex: 1 }} />
        <button onClick={() => setStatusLinkOpen(true)} style={{ height: 36, padding: '0 14px', borderRadius: 999, border: `1px solid ${TX}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', color: TX, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2"><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/></svg>
          STATUS LINK
        </button>
        {/* Bell D7 */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => { setBellOpen(o => !o); setProfileMenuOpen(false) }} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#C4614A' }} />
          </button>
          {bellOpen && (
            <div style={{ position: 'absolute', top: 48, right: 0, width: 320, background: '#fff', border: `1px solid ${BD}`, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 350, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: MT }}>Notifications</span>
                <button onClick={() => setBellOpen(false)} style={{ border: 0, background: 'none', fontSize: 11, color: MT, cursor: 'pointer', textDecoration: 'underline' }}>Mark all read</button>
              </div>
              {IPAD_NOTIFS.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 10, padding: '11px 16px', borderBottom: `1px solid ${BD}`, alignItems: 'flex-start' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: MT, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.subtitle}</div>
                  </div>
                  <span style={{ fontSize: 10, color: M2, flexShrink: 0, paddingTop: 1 }}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Avatar + account menu D1 */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => { setProfileMenuOpen(o => !o); setBellOpen(false) }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', borderRadius: '50%' }}>
            <Avatar src={producer.avatar} name={producer.name} size={36} />
          </button>
          {profileMenuOpen && (
            <div style={{ position: 'absolute', top: 48, right: 0, background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.12)', minWidth: 220, zIndex: 350, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar src={producer.avatar} name={producer.name} size={36} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{producer.name}</div>
                  <div style={{ fontSize: 12, color: MT, marginTop: 2 }}>Makeup Producer</div>
                </div>
              </div>
              <button onClick={() => { setProfileMenuOpen(false); onLogOut?.() }} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: TX }}>Switch profile</button>
              <button onClick={() => onToggleDark?.()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: TX }}>
                <span>Dark mode</span>
                <span style={{ width: 36, height: 20, borderRadius: 999, background: dark ? TX : BD, position: 'relative', flexShrink: 0, transition: 'background 150ms', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', top: 3, left: dark ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                </span>
              </button>
              <button onClick={() => { setShowHistoryOpen(true); setProfileMenuOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: TX }}>Show history</button>
              <button onClick={() => { setProfileMenuOpen(false); onLogOut?.() }} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', borderTop: `1px solid ${BD}`, cursor: 'pointer', fontSize: 13, color: '#C4614A', fontWeight: 500 }}>Log out</button>
            </div>
          )}
        </div>
      </div>

      {/* Body: nav + sections */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* Docked nav M4 */}
        {menuOpen && (
          <nav aria-label="Main navigation" style={{ width: 96, flexShrink: 0, borderRight: `1px solid ${BD}`, background: '#ECE8E3', display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
            {IPAD_SECTIONS.map(s => {
              const isActive = ipadSection === s.id
              return (
                <button key={s.id} onClick={() => { setIpadSection(s.id); lsSet('sp_ipad_section', s.id) }} aria-current={isActive ? 'page' : undefined} style={{ width: 76, minHeight: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: isActive ? TX : 'transparent', border: 'none', cursor: 'pointer', borderRadius: 14, margin: '0 10px' }}>
                  <NavIcon id={s.id} active={isActive} />
                  <span style={{ fontSize: 11, fontFamily: 'Inter,system-ui,sans-serif', color: isActive ? '#fff' : TX }}>{s.label}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Section content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {/* NON-HOME SECTIONS */}
          {ipadSection === 'assistants' && <IPadAssistantsSection models={models} profiles={profiles} />}
          {ipadSection === 'lineup'     && <IPadLineupSection models={models} />}
          {ipadSection === 'studio'     && <IPadStudioSection />}
          {ipadSection === 'settings'   && <IPadSettingsSection dark={dark} onToggleDark={onToggleDark} schedule={schedule} onScheduleChange={onScheduleChange} venue={venue} modelCount={models.length} />}

          {/* HOME */}
          {ipadSection === 'home' && (
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
              { id: 'all',             label: `All ${models.length}`,               panel: null           },
              { id: 'needs_attention', label: `Needs attention ${needsCount}`,       panel: null           },
              { id: 'not_arrived',     label: `Not arrived ${notArrivedCount}`,      panel: null           },
              { id: 'arrivals',        label: `Arrivals`,                            panel: 'arrivals'     },
              { id: 'not_paired',      label: `Not paired ${notPairedCount}`,        panel: null           },
              { id: 'to_check',        label: `To check ${toCheckCount}`,            panel: 'to_check'     },
              { id: 'ready',           label: `Ready ${readyCount}`,                 panel: null           },
            ].map(f => {
              const isActive = filter === f.id || (f.panel && panel === f.panel && filter !== 'all')
              return (
                <button key={f.id} onClick={() => { setFilter(f.id); if (f.panel) setPanel(f.panel) }} style={{ flexShrink: 0, minHeight: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer', border: isActive ? `1px solid ${TX}` : `1px solid ${DV}`, background: isActive ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: isActive ? '#fff' : TX, whiteSpace: 'nowrap' }}>
                  {f.label}
                </button>
              )
            })}
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
                <div key={m.id} onClick={() => setActiveModel(m)} style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center', columnGap: 10, minHeight: 58, borderBottom: `1px solid ${BD}`, cursor: 'pointer' }}>
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
                    {panel === 'arrivals' && (
                      <ArrivalsPanel models={models} recentArrivals={recentArrivals} onArrived={handleArrivedLocal} onOpenRunningLate={(id) => setLateModalId(id)} onClose={() => setPanel('default')} onPair={(m) => { setPairModel(m); setPairAssist(null); setPanel('pairing') }} />
                    )}
                    {panel === 'to_check' && (
                      <ToCheckPanel toCheckQueue={toCheckQueue} profiles={profiles} onLooksGood={(id) => onLooksGood?.(id)} onOpenTouchup={handleOpenTouchup} onClose={() => setPanel('default')} />
                    )}
                    {(panel === 'default' || panel === 'confirm') && (
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

        {/* Running late modal */}
        {lateModalId && (() => {
          const m = models.find(x => x.id === lateModalId)
          return m ? <RunningLateModal model={m} onSave={handleRunningLateLocal} onCancel={() => setLateModalId(null)} /> : null
        })()}

        {/* Touch-up sheet */}
        {touchupCheckId && (() => {
          const check = toCheckQueue.find(c => c.id === touchupCheckId)
          return check ? <TouchupSheet check={check} onSend={handleSendTouchupLocal} onClose={() => setTouchupCheckId(null)} /> : null
        })()}

        {/* Model detail sheet */}
        {activeModel && (
          <ModelDetailSheet
            model={models.find(m => m.id === activeModel.id) || activeModel}
            onClose={() => setActiveModel(null)}
            onStatusChange={(modelId, newStatus) => {
              setModels(prev => prev.map(m => {
                if (m.id !== modelId) return m
                return {
                  ...m,
                  status: newStatus,
                  statusLog: [...(m.statusLog || []), { status: newStatus, timestamp: fmtNow(), updatedBy: producer?.name || 'Producer' }],
                }
              }))
            }}
            onNote={(modelId, newNotesArray) => {
              setModels(prev => prev.map(m => m.id === modelId ? { ...m, notes: newNotesArray } : m))
            }}
            currentProfile={producer}
          />
        )}
          </div>
          )}
        </div>
      </div>

      {/* Share status modal D6 */}
      {statusLinkOpen && <ShareStatusModal onClose={() => setStatusLinkOpen(false)} />}

      {/* Show history */}
      {showHistoryOpen && <ShowHistoryModal onClose={() => setShowHistoryOpen(false)} />}

      {/* Tap-away overlay for dropdowns */}
      {(bellOpen || profileMenuOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }} onClick={() => { setBellOpen(false); setProfileMenuOpen(false) }} />
      )}
    </div>
  )
}
