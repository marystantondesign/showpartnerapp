import { useState, useEffect, useRef, Fragment } from 'react'
import {
  models as initModels,
  profiles,
  timeline as timelineData,
  announcements as initAnnouncements,
  show,
  showHistory,
  modelHistory,
  modelDetails,
  inventoryProducts as initInventory,
  receipts as initReceipts,
  receiptSummary,
} from '../data/mockData'
import ModelModal from '../components/ModelModal'
import StatusLinkView from './StatusLinkView'

const SVC       = 'makeup'
const SVC_LABEL = 'Makeup'
const BG = 'var(--sp-bg)', BD = 'var(--sp-border)', TX = 'var(--sp-text)', MT = 'var(--sp-muted)', M2 = 'var(--sp-muted-2)', DV = 'var(--sp-divider)'
const SF = 'var(--sp-surface)', RL = 'var(--sp-rail)'

const CHIP_STATUS = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: 'var(--sp-chip-ns-bg)', t: 'Not started' },
  to_check:    { c: '#DCE8DD', t: 'To check'    },
}


function pct(n, total) { return (n / (total || 30) * 100).toFixed(1) + '%' }
function timeUntilShow(showtimeStr, nowStr) {
  const parse = s => {
    const [time, ampm] = s.trim().split(' ')
    let [h, m] = time.split(':').map(Number)
    if (ampm === 'PM' && h !== 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    return h * 60 + m
  }
  const diff = parse(showtimeStr) - parse(nowStr)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60), m = diff % 60
  return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`
}
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
      <span style={{ width: size, height: size, borderRadius: '50%', background: 'var(--sp-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.33), color: M2, fontFamily: 'Inter,system-ui,sans-serif' }}>
        {ini}
      </span>
    )
  }
  return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={() => setErr(true)} />
}

function Chip({ c, t }) {
  return (
    <span style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999, padding: '4px 8px', color: '#111', background: c, whiteSpace: 'nowrap', justifySelf: 'start' }}>
      {t}
    </span>
  )
}

function Lbl({ children, style: s }) {
  return <p style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, margin: 0, ...s }}>{children}</p>
}

function Bar({ segments, track = 'var(--sp-bar-track)' }) {
  return (
    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: track }}>
      {segments.map((s, i) => <span key={i} style={{ width: s.w, background: s.c }} />)}
    </div>
  )
}

function PanelButtons({ onStart, onCompose, startLabel = 'START WALKTHROUGH' }) {
  return (
    <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={onStart} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer', whiteSpace: 'nowrap' }}>{startLabel}</button>
      <button onClick={onCompose} style={{ minHeight: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>ANNOUNCE</button>
    </div>
  )
}

function DefaultPanel({ tlItems, announcements, onStartWalkthrough, onCompose }) {
  return (
    <>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: `1px solid ${BD}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Lbl>Today</Lbl><Lbl>Show in 2h 15m</Lbl>
        </div>
        {tlItems.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36, padding: '0 10px', margin: '0 -10px', borderRadius: 8, background: t.kind === 'next' ? TX : 'transparent' }}>
            <span style={{ width: 64, fontSize: 12, whiteSpace: 'nowrap', color: t.kind === 'next' ? 'var(--sp-inverse-text)' : t.kind === 'past' ? M2 : TX }}>{t.time}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: t.kind === 'next' ? 600 : 400, color: t.kind === 'next' ? 'var(--sp-inverse-text)' : t.kind === 'past' ? M2 : TX }}>{t.label}</span>
            <span style={{ fontSize: 11, whiteSpace: 'nowrap', color: t.kind === 'next' ? 'var(--sp-amber-text)' : M2 }}>{t.state}</span>
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
            <div key={ann.id} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
      <PanelButtons onStart={onStartWalkthrough} onCompose={onCompose} />
    </>
  )
}

function WalkthroughPanel({ elapsed, startedAt, announcements, onModelsBack, onCompose }) {
  return (
    <>
      <div style={{ margin: '16px 20px 0', background: TX, color: BG, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Lbl s={{ color: M2 }}>Walkthrough · started {startedAt}</Lbl>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 44, lineHeight: 1 }}>{elapsed} min</span>
        <span style={{ fontSize: 12, color: BD }}>All work paused · models back at 4:30</span>
        <button style={{ alignSelf: 'flex-start', minHeight: 32, padding: 0, border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, textDecoration: 'underline', color: BG, cursor: 'pointer' }}>Change time</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Lbl>Announcements</Lbl>
        {announcements.map((ann, i) => {
          const { got, unopened, undelivered } = ann.delivery
          const total = got + unopened + undelivered
          const gotPct = total > 0 ? (got / total * 100).toFixed(0) + '%' : '96%'
          if (i === 0) return (
            <div key={ann.id} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
      <PanelButtons onStart={onModelsBack} onCompose={onCompose} startLabel="MODELS BACK · RESUME" />
    </>
  )
}

function NotPairedPanel({ models, pairModel, pairAssist, assistants, modelOrderMap, onSelectModel, onSelectAssist, onConfirm, onBack, dark }) {
  const unpaired = models.filter(m => m.arrived && !m.services[SVC].assistantId)
    .sort((a, b) => models.indexOf(a) - models.indexOf(b))
  const mkFree   = assistants.filter(a => a.specialty === SVC && a.role === 'assistant' && a.free)
  const mkBusy   = assistants.filter(a => a.specialty === SVC && a.role === 'assistant' && !a.free)

  useEffect(() => {
    if (pairModel && !pairAssist && mkFree.length > 0) onSelectAssist(mkFree[0].id)
  }, [pairModel?.id])

  if (pairModel) {
    const selAssist = assistants.find(a => a.id === pairAssist)
    const modelFirst = pairModel.name.split(' ')[0]
    const assistFirst = selAssist?.name.split(' ')[0] || ''
    const radioRow = (a) => {
      const isSel = pairAssist === a.id
      return (
        <button key={a.id} onClick={() => onSelectAssist(a.id)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '0 12px', borderRadius: 8, marginBottom: 4, border: isSel ? `1.5px solid ${TX}` : `1px solid transparent`, background: isSel ? (dark ? SF : '#F5F2EE') : 'transparent', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSel ? TX : DV}`, background: isSel ? TX : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sp-inverse-text)' }} />}
          </div>
          <Avatar src={a.avatar} name={a.name} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 14 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: MT }}>{a.free ? (a.station || 'Free') : `With ${a.currentModelName?.split(' ')[0]} · ${a.station || ''}`}</div>
          </div>
        </button>
      )
    }
    return (
      <>
        <div style={{ flexShrink: 0, padding: '12px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Avatar src={pairModel.avatar} name={pairModel.name} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Lbl>#{modelOrderMap[pairModel.id]} · Look {pairModel.look} · arrived {pairModel.arrivedAt}</Lbl>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, marginTop: 2 }}>Pair {pairModel.name}</div>
          </div>
          {unpaired.length > 1 && (
            <button onClick={onBack} style={{ border: 0, background: 'none', fontSize: 20, color: M2, cursor: 'pointer', lineHeight: 1, padding: '4px 0 0 4px' }} aria-label="Back to list">×</button>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 20px' }}>
          {mkFree.length > 0 && (
            <>
              <Lbl s={{ marginBottom: 8 }}>Free now · {SVC_LABEL.toUpperCase()}</Lbl>
              {mkFree.map(radioRow)}
            </>
          )}
          {mkBusy.length > 0 && (
            <>
              <Lbl s={{ marginTop: 14, marginBottom: 8 }}>Finishing soon</Lbl>
              {mkBusy.map(radioRow)}
            </>
          )}
          {selAssist && (
            <p style={{ fontSize: 11, color: M2, margin: '12px 0 0', lineHeight: 1.5 }}>
              {selAssist.name.split(' ')[0]} gets a notification with {modelFirst}&apos;s look and where to find them.
            </p>
          )}
        </div>
        <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${BD}` }}>
          <button onClick={onConfirm} disabled={!pairAssist}
            style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: pairAssist ? TX : DV, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: pairAssist ? 'pointer' : 'default', textTransform: 'uppercase' }}>
            {pairAssist ? `PAIR ${modelFirst.toUpperCase()} WITH ${assistFirst.toUpperCase()}` : 'SELECT AN ASSISTANT'}
          </button>
        </div>
      </>
    )
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px' }}>
      <Lbl s={{ marginBottom: 12 }}>Not paired · {unpaired.length}</Lbl>
      {unpaired.map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
          <Avatar src={m.avatar} name={m.name} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
            <div style={{ fontSize: 11, color: MT }}>#{modelOrderMap[m.id]} · arrived {m.arrivedAt}</div>
          </div>
          <button onClick={() => onSelectModel(m)}
            style={{ height: 40, padding: '0 12px 0 8px', borderRadius: 999, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
            PAIR
          </button>
        </div>
      ))}
    </div>
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
              <button key={opt.id} onClick={() => onTo(opt.id)} style={{ minHeight: 34, padding: '0 12px', borderRadius: 999, cursor: 'pointer', border: to === opt.id ? `1px solid ${TX}` : `1px solid ${DV}`, background: to === opt.id ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: to === opt.id ? 'var(--sp-inverse-text)' : TX }}>{opt.label}</button>
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
        <button onClick={onSend} disabled={!msg.trim()} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: msg.trim() ? TX : DV, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: msg.trim() ? 'pointer' : 'default' }}>SEND</button>
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
          <button onClick={onConfirm} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH</button>
        </div>
      </div>
    </div>
  )
}

function ArrivalsPanel({ models, recentArrivals, onArrived, onOpenRunningLate, onPair, modelOrderMap, dark }) {
  const notArrived = models.filter(m => !m.arrived)
  const arrivedCount = models.filter(m => m.arrived).length

  const fromMap = {}
  notArrived.forEach(m => {
    const key = m.comingFrom || ''
    if (!fromMap[key]) fromMap[key] = []
    fromMap[key].push(m)
  })
  const fromEntries = Object.entries(fromMap).sort(([a], [b]) => {
    if (!a) return 1; if (!b) return -1; return a.localeCompare(b)
  })

  const justArrived = [...recentArrivals].reverse().slice(0, 6)
    .map(arr => { const m = models.find(x => x.id === arr.modelId); return m ? { ...m, arrRef: arr } : null })
    .filter(Boolean)

  const pillBase = { height: 44, borderRadius: 999, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap', padding: '0 14px' }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <Lbl>Arrivals</Lbl>
        <span style={{ fontSize: 11, color: M2 }}>{arrivedCount} of {models.length} here</span>
      </div>

      {fromEntries.map(([key, grp]) => (
        <div key={key || '_none'} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Lbl>{key ? `FROM ${key.toUpperCase()} · ${grp.length}` : `NO ETA · ${grp.length}`}</Lbl>
            {key && grp.length > 1 && (
              <button style={{ ...pillBase, height: 30, padding: '0 10px', fontSize: 10, border: `1px solid ${dark ? BD : '#CFCAC4'}`, background: 'transparent', color: TX }}>
                SET ETA FOR ALL
              </button>
            )}
          </div>
          {grp.map(m => (
            <div key={m.id} style={{ paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                <Avatar src={m.avatar} name={m.name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.3 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: MT, marginTop: 2 }}>#{modelOrderMap[m.id]} · {m.eta ? `ETA ${m.eta}` : 'No ETA'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 52 }}>
                <button onClick={() => onArrived(m.id)} style={{ ...pillBase, border: 0, background: dark ? SF : '#F5F2EE', color: TX, fontWeight: 600 }}>ARRIVED</button>
                <button onClick={() => onOpenRunningLate(m.id)} style={{ ...pillBase, border: `1px solid ${dark ? BD : '#CFCAC4'}`, background: 'transparent', color: TX }}>RUNNING LATE</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {justArrived.length > 0 && (
        <>
          <Lbl s={{ marginBottom: 10, marginTop: 4 }}>Just arrived</Lbl>
          {justArrived.map(m => {
            const needsPair = !m.services?.[SVC]?.assistantId
            return (
              <div key={m.id} style={{ paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Avatar src={m.avatar} name={m.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.3 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: MT, marginTop: 2 }}>#{modelOrderMap[m.id]} · arrived {m.arrivedAt}</div>
                  </div>
                  {needsPair && (
                    <button onClick={() => onPair?.(m)}
                      style={{ ...pillBase, height: 40, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                      PAIR
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}

      {notArrived.length === 0 && (
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: M2, paddingTop: 12 }}>All models checked in</div>
      )}
    </div>
  )
}

function AttentionPanel({ models, profiles, modelOrderMap, onOpenModel, dark }) {
  const reviewModels = models.filter(m => m.services[SVC]?.reviewRequestedAt)
    .sort((a, b) => models.indexOf(a) - models.indexOf(b))
  const flaggedModels = models.filter(m => m.flagged)
    .sort((a, b) => models.indexOf(a) - models.indexOf(b))

  function getAssistShort(id) {
    if (!id) return ''
    const p = profiles.find(x => x.id === id)
    if (!p) return ''
    const parts = p.name.split(' ')
    return parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '')
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {reviewModels.length > 0 && (
        <>
          <Lbl>Waiting for review · {reviewModels.length}</Lbl>
          {reviewModels.map(m => {
            const svc = m.services[SVC]
            return (
              <div key={m.id} style={{ background: dark ? SF : '#fff', border: `1px solid ${dark ? BD : '#E0DDD8'}`, borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar src={m.avatar} name={m.name} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: MT, marginTop: 2 }}>#{modelOrderMap[m.id]} · MU: {getAssistShort(svc.assistantId)} · Pinged @ {svc.reviewRequestedAt}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button style={{ minHeight: 44, borderRadius: 999, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>PING ARTIST</button>
                  <button style={{ minHeight: 44, borderRadius: 999, border: `1px solid ${dark ? BD : '#CFCAC4'}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>PING LEAD ASSISTANT</button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {flaggedModels.length > 0 && (
        <>
          <Lbl>Flagged · {flaggedModels.length}</Lbl>
          {flaggedModels.map(m => (
            <button key={m.id} onClick={() => onOpenModel?.(m)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', background: 'none', border: 0, borderBottom: `1px solid ${BD}`, textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: BD, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: M2, fontFamily: 'Inter,system-ui,sans-serif' }}>
                {m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TX }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#A33D28', marginTop: 1 }}>{m.flagReason || 'Flagged'}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={M2} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </>
      )}

      <p style={{ fontSize: 11, color: M2, margin: 'auto 0 0', lineHeight: 1.5, paddingTop: 12, borderTop: `1px solid ${BD}` }}>
        Producer, lead assistants and the artist see this list.
      </p>
    </div>
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
          <button onClick={() => onSave(newEtaStr, note)} disabled={!preset || preset === 'pick'} style={{ minHeight: 52, borderRadius: 8, border: 0, background: (preset && preset !== 'pick') ? TX : DV, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: (preset && preset !== 'pick') ? 'pointer' : 'default' }}>SAVE NEW ETA</button>
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
          <div key={check.id} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <Avatar src={check.modelAvatar} name={check.modelName} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{check.modelName}</div>
                <div style={{ fontSize: 11, color: MT }}>Look {check.modelLook} · {check.specialty} by {check.assistantName.split(' ')[0]} · done {check.doneAt}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => onLooksGood(check.id)} style={{ minHeight: 44, borderRadius: 999, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>LOOKS GOOD</button>
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
          <button onClick={() => onSend(areas, note)} disabled={!canSend} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: canSend ? TX : DV, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: canSend ? 'pointer' : 'default' }}>
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
      <button onClick={onStartWalkthrough} style={{ ...tileStyle, background: TX, color: 'var(--sp-inverse-text)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="none"><rect x="7" y="5" width="3.5" height="14" fill="currentColor"/><rect x="13.5" y="5" width="3.5" height="14" fill="currentColor"/></svg>
        <span style={{ fontSize: 10, fontWeight: 600 }}>Start</span>
        <span style={{ fontSize: 9, color: M2 }}>walkthru</span>
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
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: liveH, transition: snapping ? 'height 0.25s ease-out' : 'none', background: SF, borderTop: `1px solid ${BD}`, boxShadow: '0 -6px 18px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>

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
            <button onClick={onStartWalkthrough} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH · PAUSE ALL</button>
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
                  <span style={{ width: 72, fontSize: 12, whiteSpace: 'nowrap', color: t.kind === 'next' ? 'var(--sp-inverse-text)' : t.kind === 'past' ? M2 : TX }}>{t.time}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: t.kind === 'next' ? 600 : 400, color: t.kind === 'next' ? 'var(--sp-inverse-text)' : t.kind === 'past' ? M2 : TX }}>{t.label}</span>
                  <span style={{ fontSize: 11, whiteSpace: 'nowrap', color: t.kind === 'next' ? 'var(--sp-amber-text)' : M2 }}>{t.state}</span>
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
                  <div key={ann.id} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <button onClick={onStartWalkthrough} style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>START WALKTHROUGH · PAUSE ALL</button>
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
  { id: 'n1', title: 'Lead check escalated', subtitle: 'Aimi asked Yadim about Sofia R · Mei Lin', time: '3:44', dot: TX },
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
  const c = active ? 'var(--sp-inverse-text)' : TX
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

function ShowHistoryModal({ onClose, modelId }) {
  const visibleShows = modelId
    ? showHistory.filter(sh => (modelHistory[modelId] || []).some(mh => mh.showName === sh.name))
    : showHistory
  const [selId, setSelId] = useState(visibleShows[0]?.id)
  const sh = visibleShows.find(s => s.id === selId) || visibleShows[0]
  const BD2 = BD, MT2 = MT, M22 = M2

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-label="Show history"
        style={{ width: 940, height: 640, background: BG, borderRadius: 18, overflow: 'hidden', display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', fontFamily: 'Inter, system-ui, sans-serif', color: TX }}>

        {/* Left: list */}
        <div style={{ borderRight: `1px solid ${BD2}`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '22px 20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>Show history</span>
            <span style={{ fontSize: 12, color: MT2 }}>{visibleShows.length} past show{visibleShows.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 10px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {visibleShows.length === 0 && (
              <p style={{ fontSize: 13, color: MT2, padding: '8px 14px' }}>No previous shows with Art Partner.</p>
            )}
            {visibleShows.map(s => {
              const isSel = s.id === selId
              return (
                <button key={s.id} onClick={() => setSelId(s.id)} aria-current={isSel || undefined}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 14px', borderRadius: 12, border: 0, background: isSel ? SF : 'transparent', boxShadow: isSel ? `inset 0 0 0 1.5px ${TX}` : 'none', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', color: TX }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: MT2 }}>{s.date} · {s.venue}, {s.city}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: detail */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {!sh && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 14, color: MT2 }}>No shows to display.</p>
            </div>
          )}
          {sh && <>
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
                <div style={{ background: SF, border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
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
                      <span style={{ minWidth: 92, textAlign: 'right', fontSize: 12, fontWeight: a.inviteBack ? 600 : 400, color: a.inviteBack ? 'var(--sp-green-text)' : MT2 }}>
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
                <div style={{ background: SF, border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
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
                <div style={{ background: SF, border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
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
                    <span style={{ color: sh.incidents?.length ? 'var(--sp-red-text)' : 'var(--sp-green-text)' }}>
                      {sh.incidents?.length ? sh.incidents.length + ' logged' : 'None logged'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Receipts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Receipts</Lbl>
                <div style={{ background: SF, border: `1px solid ${BD2}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ whiteSpace: 'nowrap' }}>Total</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{sh.receipts?.total}</span>
                  </span>
                  <span style={{ color: MT2 }}>{sh.receipts?.breakdown?.join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
          </>}
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
  const inputStyle = { height: 48, padding: '0 12px', border: `1px solid ${DV}`, borderRadius: 10, background: SF, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: TX, outline: 'none', boxSizing: 'border-box' }
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
            <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 48, padding: '0 14px', border: `1px solid ${DV}`, borderRadius: 10, background: SF, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
            <button onClick={handleCopy} style={{ minHeight: 48, padding: '0 18px', borderRadius: 10, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>{copied ? 'COPIED' : 'COPY'}</button>
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
            <button style={{ minHeight: 40, padding: '0 12px', border: 0, background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: 'var(--sp-red-text)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Turn off now</button>
            <button onClick={onClose} style={{ minHeight: 44, padding: '0 18px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}>DONE</button>
          </div>
        </div>
        {/* Right column: phone preview */}
        <div style={{ background: 'var(--sp-bg-2)', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <Lbl s={{ alignSelf: 'flex-start' }}>What they see</Lbl>
          <div style={{ width: 220, height: 440, borderRadius: 22, border: `6px solid ${TX}`, background: BG, overflow: 'hidden', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{show.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: MT }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sp-green-text)' }} />
              Live · updated 3:45 PM
            </span>
            <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="64" height="64" viewBox="0 0 180 180" aria-hidden="true">
                <circle cx="90" cy="90" r="78" fill="none" stroke="var(--sp-bg-2)" strokeWidth="16" />
                <circle cx="90" cy="90" r="78" fill="none" stroke="#7A9E7E" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${circumference * readyPct} ${circumference}`} transform="rotate(-90 90 90)" />
                <text x="90" y="100" textAnchor="middle" fontFamily="Georgia, serif" fontSize="34" fill="currentColor">27%</text>
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
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--sp-bg-2)' }}>
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
const ASST_SHOW_COUNTS = { 'Sofia Reyes': 4, 'Lena Schmidt': 2, 'Kenji Watanabe': 5, 'Mira Patel': 1, 'Aimi K': 6, 'Iona M': 3, 'Dara Okafor': 1, 'Dev Kapoor': 2, 'Ivana Ruiz': 3, 'Leo Tan': 1, 'Theo Grant': 2, 'Tomás Vega': 2 }
const ASST_AVG_TIMES   = { 'Sofia Reyes': '43m', 'Lena Schmidt': '51m', 'Dara Okafor': '38m', 'Ivana R': '29m', 'Tomás V': '46m', 'Kenji Watanabe': '47m', 'Mira Patel': '52m', 'Aimi K': '40m', 'Iona M': '44m' }
const ASST_FREE_SINCE  = { 'Lena Schmidt': '3:38', 'Mira Patel': '3:20', 'Aimi K': 'At the front · 1 review waiting' }
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

  const assistants = profs.filter(p => (p.role === 'assistant' || p.role === 'lead_assistant') && p.specialty === SVC)

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

  const totalLeads   = assistants.filter(a => a.role === 'lead_assistant').length
  const totalWorking = assistants.filter(a => a.role !== 'lead_assistant' && getStatus(a) === 'working').length
  const totalFree    = assistants.filter(a => a.role !== 'lead_assistant' && getStatus(a) === 'free').length

  const filtered = assistants.filter(a => {
    if (chip === 'all')     return true
    if (chip === 'working') return a.role !== 'lead_assistant' && getStatus(a) === 'working'
    if (chip === 'free')    return a.role !== 'lead_assistant' && getStatus(a) === 'free'
    if (chip === 'leads')   return a.role === 'lead_assistant'
    return true
  })

  const filteredLeads    = filtered.filter(a => a.role === 'lead_assistant')
  const filteredNonLeads = filtered.filter(a => a.role !== 'lead_assistant')
                                   .sort((a, b) => a.name.localeCompare(b.name))
  const sortedList = [...filteredLeads, ...filteredNonLeads]

  const selA = selId ? assistants.find(p => p.id === selId) : null
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
      : (ASST_FREE_SINCE[a.name]
          ? (a.role === 'lead_assistant' ? ASST_FREE_SINCE[a.name] : `Free since ${ASST_FREE_SINCE[a.name]}`)
          : 'Available')
    const dotColor = a.role === 'lead_assistant' ? TX : (st === 'working' ? '#D4A853' : '#7A9E7E')
    return (
      <button onClick={() => { setSelId(a.id); setShowForm(false); setPending(null) }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, padding: '0 12px', background: isSel ? SF : 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', boxShadow: isSel ? `inset 0 0 0 1.5px ${TX}` : 'none' }}>
        <Avatar src={a.avatar} name={a.name} size={40} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
          <span style={{ fontSize: 12, color: MT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>
        </span>
        {a.role === 'lead_assistant' && (
          <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: M2, flexShrink: 0 }}>Lead</span>
        )}
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
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>{SVC_LABEL} team today</span>
            <span style={{ fontSize: 12, color: MT }}>{assistants.length - totalLeads} assistants · {totalLeads} leads</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {chipDef.map(c => (
              <button key={c.id} onClick={() => setChip(c.id)} style={{ height: 36, padding: '0 14px', borderRadius: 999, border: chip === c.id ? `1px solid ${TX}` : `1px solid ${DV}`, background: chip === c.id ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: chip === c.id ? '#fff' : TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {sortedList.map(a => <AsstRow key={a.id} a={a} />)}
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
            <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--sp-green-surface)', cursor: 'pointer' }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: inviteBack[selA.id] ? 'var(--sp-green-text)' : SF, border: inviteBack[selA.id] ? 'none' : `1.5px solid #B5B0AA`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                          <input value={noteInput} onChange={e => setNoteInput(e.target.value)} autoFocus placeholder="Add a note..." style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${DV}`, background: SF, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, outline: 'none' }} />
                          <button onClick={() => { if (noteInput.trim()) setModelNotes(n => ({ ...n, [key]: noteInput.trim() })); setEditingNote(null) }} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditingNote(null)} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      )}
                      {mNote && !isEditing && (
                        <div style={{ margin: '0 0 12px 44px', padding: '10px 12px', borderRadius: 10, background: SF, border: `1px solid ${BD}`, fontSize: 13, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
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
                      <span style={{ position: 'absolute', left: 6, bottom: 6, padding: '2px 6px', borderRadius: 4, background: 'rgba(17,17,17,.75)', color: 'var(--sp-inverse-text)', fontSize: 10 }}>Look {m.lookNumber || m.look}</span>
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
              <div style={{ border: `1px solid ${TX.replace('var(--sp-text)', 'var(--sp-red-text)')}`, borderRadius: 12, padding: 16 }}>
                <Lbl s={{ color: 'var(--sp-red-text)', marginBottom: 8 }}>Confirm incident</Lbl>
                <p style={{ fontSize: 13, color: TX, margin: '0 0 12px' }}><strong>{pending.type}</strong>{pending.notes ? ` -- ${pending.notes}` : ''}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setIncidents(p => [...p, pending]); setPending(null) }} style={{ flex: 1, height: 44, borderRadius: 8, border: 0, background: 'var(--sp-red-text)', color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>YES, SUBMIT</button>
                  <button onClick={() => setPending(null)} style={{ flex: 1, height: 44, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, cursor: 'pointer' }}>GO BACK</button>
                </div>
              </div>
            )}
            {incidents.length > 0 && (
              <div>
                <Lbl s={{ marginBottom: 8 }}>Incident log</Lbl>
                {incidents.map(inc => (
                  <div key={inc.id} style={{ display: 'flex', gap: 8, padding: '8px 0 8px 10px', borderLeft: `2px solid var(--sp-red-text)`, marginLeft: -12, borderBottom: `1px solid ${BD}` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, color: 'var(--sp-red-text)', fontWeight: 600, margin: 0 }}>{inc.type}</p>
                      <p style={{ fontSize: 12, color: MT, margin: '2px 0 0' }}>{inc.notes}</p>
                      <p style={{ fontSize: 10, color: M2, margin: '2px 0 0' }}>{inc.time}</p>
                    </div>
                    <button onClick={() => setIncidents(p => p.filter(i => i.id !== inc.id))} style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--sp-red-text)', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>DELETE</button>
                  </div>
                ))}
              </div>
            )}
            {!showForm && !pending && (
              <button onClick={() => setShowForm(true)} style={{ alignSelf: 'flex-start', minHeight: 44, padding: '0 18px', borderRadius: 8, border: `1px solid ${TX.replace('var(--sp-text)', 'var(--sp-red-text)')}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: 'var(--sp-red-text)', letterSpacing: '.1em', cursor: 'pointer' }}>FLAG AN INCIDENT</button>
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

function IPadLineupSection({ models, setModels }) {
  const [selModel, setSelModelRaw] = useState(null)
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false)
  const [pingOpen, setPingOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [pingPhrase, setPingPhrase] = useState(null)
  const [pingCustom, setPingCustom] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [localNotes, setLocalNotes] = useState([])
  const [showHistoryModelId, setShowHistoryModelId] = useState(null)
  const [pingToast, setPingToast] = useState(null)
  const svcs = ['hair', 'makeup', 'nails']

  function setSelModel(m) {
    setSelModelRaw(m)
    setUpdateStatusOpen(false)
    setPingOpen(false)
    setAddingNote(false)
    setNoteText('')
    setLocalNotes(m?.notes || [])
  }

  function getProfile(id) { return id ? profiles.find(p => p.id === id) : null }

  function getMakeupAssistant(m) { return getProfile(m.services?.makeup?.assistantId) }

  function getLookLabel(m) {
    const asst = getMakeupAssistant(m)
    return `Look ${m.look} · ${asst?.name || 'Not paired'}`
  }

  function svcStatus(m, svc) { return m.services?.[svc]?.status || 'not_started' }
  function svcChipColor(m, svc) { return STATUS_META_LINEUP[svcStatus(m, svc)]?.color || BD }
  function svcChipLabel(m, svc) { return STATUS_META_LINEUP[svcStatus(m, svc)]?.label || 'Not started' }

  function makeupSubLabel(m) {
    const mk = m.services?.makeup
    if (!mk) return ''
    const asst = getProfile(mk.assistantId)
    const name = asst ? asst.name : ''
    const st = mk.status
    if (st === 'done') return `${name}${name ? ' · ' : ''}Done · ${mk.elapsedMins} min`
    if (st === 'in_progress') return `${name}${name ? ' · ' : ''}In progress`
    if (st === 'paused') return `${name}${name ? ' · ' : ''}Paused${mk.elapsedMins ? ' · ' + mk.elapsedMins + ' min' : ''}`
    return name || ''
  }

  function getUpdates(m) {
    if (m.statusLog && m.statusLog.length > 0) return [...m.statusLog].reverse()
    const entries = []
    if (m.arrivedAt) entries.push({ time: m.arrivedAt, text: 'Arrived' })
    const mkAid = m.services?.makeup?.assistantId
    if (mkAid) {
      const aname = getProfile(mkAid)?.name
      if (aname) entries.push({ time: '', text: `Paired with ${aname}` })
      if (m.services.makeup.startedAt) entries.push({ time: m.services.makeup.startedAt, text: `Makeup started · ${aname?.split(' ')[0] || ''}` })
      if (m.services.makeup.status === 'done') entries.push({ time: '', text: `Makeup done · ${aname?.split(' ')[0] || ''}` })
    }
    return entries.reverse()
  }

  function getPastShowCount(m) { return (modelHistory?.[m.id] || []).length }

  function getPastShowSubLabel(m) {
    const mh = modelHistory?.[m.id] || []
    if (!mh.length) return 'First show with Art Partner'
    return mh.map(s => s.showName.replace('Valentino ', '')).join(', ')
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

  function handleSaveStatus() {
    if (!selModel || !selectedStatus) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const asst = getMakeupAssistant(selModel)
    const aShort = asst ? ' · ' + asst.name.split(' ')[0] : ''
    const statusWord = { not_started: 'Not started', in_progress: 'In progress', paused: 'Paused', done: 'Done' }
    const logText = `Makeup ${statusWord[selectedStatus].toLowerCase()}${aShort}`
    setModels(prev => prev.map(m => {
      if (m.id !== selModel.id) return m
      return {
        ...m,
        services: { ...m.services, makeup: { ...m.services.makeup, status: selectedStatus } },
        statusLog: [...(m.statusLog || []), { time: now, text: logText }],
      }
    }))
    setSelModelRaw(prev => ({
      ...prev,
      services: { ...prev.services, makeup: { ...prev.services.makeup, status: selectedStatus } },
      statusLog: [...(prev.statusLog || []), { time: now, text: logText }],
    }))
    setUpdateStatusOpen(false)
    setSelectedStatus(null)
  }

  function handleSendPing() {
    const msg = pingPhrase || pingCustom.trim()
    if (!msg) return
    const aname = getMakeupAssistant(selModel)?.name?.split(' ')[0] || 'assistant'
    setPingOpen(false); setPingPhrase(null); setPingCustom('')
    setPingToast(`Ping sent to ${aname}`)
    setTimeout(() => setPingToast(null), 3000)
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    const nn = { id: `note-${Date.now()}`, text: noteText.trim(), authorId: 'p1', authorName: 'Jen Z', authorRole: 'lead', createdAt: new Date().toISOString() }
    const updated = [...localNotes, nn]
    setLocalNotes(updated)
    setModels(prev => prev.map(m => m.id === selModel.id ? { ...m, notes: updated } : m))
    setNoteText(''); setAddingNote(false)
  }

  const QUICK_PHRASES = ['Status update?', 'Come to the front', 'Wrap up, rehearsal soon']

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      {/* Grid area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 8, padding: '16px 24px 12px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, whiteSpace: 'nowrap' }}>{models.length} Models</span>
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
                  <span style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', borderRadius: 10, overflow: 'hidden', background: BD, boxShadow: isSel ? `0 0 0 3px ${BG}, 0 0 0 6px ${TX}` : 'none', outline: !isNs ? `4px solid ${statusColor}` : 'none', outlineOffset: -4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isNs ? 0.45 : 1 }} />
                    <span style={{ position: 'absolute', left: 8, top: 8, padding: '2px 6px', borderRadius: 4, background: SF, fontSize: 12, fontWeight: 600, color: TX }}>{lookNum}</span>
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
        const c = getServiceCounts(selModel)
        const mkAsst = getMakeupAssistant(selModel)
        const pastCount = getPastShowCount(selModel)
        const updates = getUpdates(selModel)
        const isPaired = !!selModel.services?.makeup?.assistantId
        return (
          <aside aria-label="Model details" style={{ width: 400, flexShrink: 0, borderLeft: `1px solid ${BD}`, background: BG, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Header */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <img src={selModel.avatar} alt={selModel.name} style={{ width: 90, aspectRatio: '3 / 4', borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 24, lineHeight: 1.1 }}>{selModel.name}</span>
                  <span style={{ fontSize: 13, color: MT }}>{getLookLabel(selModel)}</span>
                  {selModel.arrivedAt && <span style={{ fontSize: 13, color: MT }}>Arrived {selModel.arrivedAt}</span>}
                  <span style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>{c.done} of 3 done</span>
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: RL }}>
                      <span style={{ width: `${c.done / 3 * 100}%`, background: '#7A9E7E' }} />
                      <span style={{ width: `${c.in_progress / 3 * 100}%`, background: '#D4A853' }} />
                      <span style={{ width: `${c.paused / 3 * 100}%`, background: '#8A9BB0' }} />
                    </div>
                  </span>
                </span>
                <button onClick={() => setSelModel(null)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${BD}`, background: 'transparent', fontSize: 18, color: MT, flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>

              {/* Where they're at */}
              <div>
                <Lbl s={{ marginBottom: 2 }}>Where they&apos;re at</Lbl>
                {/* Makeup first */}
                <div style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) auto', gap: 10, alignItems: 'center', minHeight: 44, borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 13, textTransform: 'capitalize' }}>Makeup</span>
                  <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{makeupSubLabel(selModel)}</span>
                  <span style={{ display: 'inline-block', height: 22, padding: '0 8px', borderRadius: 999, background: svcChipColor(selModel, 'makeup'), fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: '22px', color: TX, whiteSpace: 'nowrap' }}>{svcChipLabel(selModel, 'makeup')}</span>
                </div>
                {/* Hair and Nails — chip only */}
                {['hair', 'nails'].map(svc => (
                  <div key={svc} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) auto', gap: 10, alignItems: 'center', minHeight: 44, borderBottom: `1px solid ${BD}` }}>
                    <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{svc}</span>
                    <span />
                    <span style={{ display: 'inline-block', height: 22, padding: '0 8px', borderRadius: 999, background: svcChipColor(selModel, svc), fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: '22px', color: TX, whiteSpace: 'nowrap' }}>{svcChipLabel(selModel, svc)}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Lbl>Notes</Lbl>
                {localNotes.map(n => (
                  <span key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: n.isAllergy ? '#F8E9E5' : SF, border: n.isAllergy ? 'none' : `1px solid ${BD}`, fontSize: 13, lineHeight: 1.4 }}>
                    {n.isAllergy && <b style={{ color: '#A33D28', fontSize: 11, letterSpacing: '.08em', paddingTop: 1, flexShrink: 0 }}>ALLERGY</b>}
                    <span>{n.text}</span>
                  </span>
                ))}
                {addingNote ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea
                      autoFocus
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      rows={2}
                      placeholder="Write a note..."
                      style={{ padding: '10px 12px', border: `1px solid ${TX}`, borderRadius: 10, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, lineHeight: 1.4, resize: 'none', color: TX, background: SF, outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddNote} style={{ flex: 1, height: 36, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Save</button>
                      <button onClick={() => { setAddingNote(false); setNoteText('') }} style={{ flex: 1, height: 36, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingNote(true)} style={{ height: 44, borderRadius: 10, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    + ADD A NOTE
                  </button>
                )}
              </div>

              {/* Earlier updates */}
              {updates.length > 0 && (
                <div>
                  <Lbl s={{ marginBottom: 2 }}>Earlier updates</Lbl>
                  {updates.map((u, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px minmax(0,1fr)', gap: 10, padding: '7px 0', fontSize: 12, borderBottom: i < updates.length - 1 ? `1px solid ${BD}` : 'none' }}>
                      <span style={{ color: MT }}>{u.time}</span>
                      <span>{u.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Past shows */}
              <button
                onClick={() => setShowHistoryModelId(selModel.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: `1px solid ${BD}`, background: SF, fontFamily: 'Inter,system-ui,sans-serif', textAlign: 'left', color: TX, cursor: 'pointer' }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14 }}>Past shows with Art Partner · {pastCount}</span>
                  <span style={{ fontSize: 12, color: MT }}>{getPastShowSubLabel(selModel)}</span>
                </span>
                <span aria-hidden="true" style={{ fontSize: 16, color: MT }}>›</span>
              </button>
            </div>

            {/* Sticky footer with popovers */}
            <div style={{ flexShrink: 0, borderTop: `1px solid ${BD}`, position: 'relative' }}>
              {/* UPDATE STATUS popover (P2) */}
              {updateStatusOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 16, right: 16, background: SF, border: `1px solid ${BD}`, borderRadius: 16, boxShadow: '0 -8px 32px rgba(0,0,0,.12)', padding: '18px 16px', zIndex: 10 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: 'Georgia, serif', fontSize: 18 }}>Update makeup</p>
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: MT }}>{selModel.name} · {mkAsst ? mkAsst.name + ' gets notified' : 'No assistant paired'}</p>
                  {['not_started', 'in_progress', 'paused', 'done'].map(st => {
                    const meta = STATUS_META_LINEUP[st]
                    const isSel = selectedStatus === st
                    return (
                      <label key={st} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: `1px solid ${BD}`, cursor: 'pointer' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSel ? TX : BD}`, background: isSel ? TX : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSel && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sp-inverse-text)' }} />}
                        </span>
                        <input type="radio" name="update-status" value={st} checked={isSel} onChange={() => setSelectedStatus(st)} style={{ display: 'none' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                          <span style={{ width: 10, height: 10, borderRadius: 2, background: meta?.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 14 }}>{meta?.label}</span>
                        </span>
                      </label>
                    )
                  })}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button onClick={() => { setUpdateStatusOpen(false); setSelectedStatus(null) }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>CANCEL</button>
                    <button onClick={handleSaveStatus} disabled={!selectedStatus} style={{ flex: 2, height: 40, borderRadius: 8, border: 0, background: selectedStatus ? TX : BD, color: selectedStatus ? 'var(--sp-inverse-text)' : MT, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: selectedStatus ? 'pointer' : 'default' }}>SAVE</button>
                  </div>
                </div>
              )}
              {/* PING ASSISTANT popover (P3) */}
              {pingOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 16, right: 16, background: SF, border: `1px solid ${BD}`, borderRadius: 16, boxShadow: '0 -8px 32px rgba(0,0,0,.12)', padding: '18px 16px', zIndex: 10 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: 'Georgia, serif', fontSize: 18 }}>Ping {mkAsst?.name || 'assistant'}</p>
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: MT }}>About {selModel.name} · {mkAsst?.station || 'Station'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {QUICK_PHRASES.map(phrase => (
                      <button key={phrase} onClick={() => setPingPhrase(pingPhrase === phrase ? null : phrase)}
                        style={{ height: 34, padding: '0 14px', borderRadius: 999, border: `1px solid ${pingPhrase === phrase ? TX : BD}`, background: pingPhrase === phrase ? TX : 'transparent', color: pingPhrase === phrase ? 'var(--sp-inverse-text)' : TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {phrase}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={pingCustom}
                    onChange={e => { setPingCustom(e.target.value); if (e.target.value) setPingPhrase(null) }}
                    rows={2}
                    placeholder="Or write your own..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${DV}`, borderRadius: 10, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, lineHeight: 1.4, resize: 'none', color: TX, background: SF, outline: 'none', marginBottom: 12 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setPingOpen(false); setPingPhrase(null); setPingCustom('') }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>CANCEL</button>
                    <button onClick={handleSendPing} disabled={!pingPhrase && !pingCustom.trim()} style={{ flex: 2, height: 40, borderRadius: 8, border: 0, background: (pingPhrase || pingCustom.trim()) ? TX : BD, color: (pingPhrase || pingCustom.trim()) ? 'var(--sp-inverse-text)' : MT, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: (pingPhrase || pingCustom.trim()) ? 'pointer' : 'default' }}>SEND PING</button>
                  </div>
                </div>
              )}
              {/* Toast */}
              {pingToast && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 60px)', left: 16, right: 16, padding: '10px 14px', borderRadius: 10, background: TX, color: 'var(--sp-inverse-text)', fontSize: 13, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.2)', zIndex: 20 }}>
                  {pingToast}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, padding: '12px 20px 16px' }} onClick={() => { if (updateStatusOpen) setUpdateStatusOpen(false); if (pingOpen) setPingOpen(false) }}>
                <button
                  disabled={!isPaired}
                  onClick={e => { e.stopPropagation(); setUpdateStatusOpen(false); setPingOpen(o => !o) }}
                  style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${isPaired ? DV : BD}`, background: 'transparent', color: isPaired ? TX : M2, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: isPaired ? 'pointer' : 'default' }}>
                  PING ASSISTANT
                </button>
                <span style={{ flex: 1 }} />
                <button
                  onClick={e => { e.stopPropagation(); setPingOpen(false); setUpdateStatusOpen(o => !o); setSelectedStatus(selModel.services?.makeup?.status || null) }}
                  style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>
                  UPDATE STATUS
                </button>
              </div>
            </div>
          </aside>
        )
      })()}

      {/* Backdrop to close popovers */}
      {(updateStatusOpen || pingOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5 }} onClick={() => { setUpdateStatusOpen(false); setPingOpen(false) }} />
      )}

      {/* Show history modal filtered by model */}
      {showHistoryModelId && (
        <ShowHistoryModal
          onClose={() => setShowHistoryModelId(null)}
          modelId={showHistoryModelId}
        />
      )}
    </div>
  )
}

const LOOK_AREAS = ['Eyes','Brows','Skin','Cheeks','Lips']

const IPAD_LOOKS_INIT = [
  {
    id: 'A', name: 'Look A', modelsCount: 14, mediaDesc: 'Demo + 5 photos · 2 clips',
    state: 'shared', approvedBy: 'Yadim', approvedAt: '1:40',
    sharedWith: 'Aimi K (lead assistant) and 14 assistants on Look A', openedCount: 11,
    writtenBy: 'Aimi K',
    areas: {
      Eyes:   { howTo: 'Mascara is the whole look. Top and bottom, build in layers, let it go thick and a little clumpy.', products: ['Maybelline Lash Sensational Sky High · Very Black','Basic mascara~Generic'], refs: 3 },
      Brows:  { howTo: 'Clean. Brushed up with clear gel, no fill.', products: ['Glossier Boy Brow · Clear'], refs: 1 },
      Skin:   { howTo: 'Sheer. Spot conceal only, let freckles show.', products: ['Armani Luminous Silk · per model','NARS Radiant Creamy Concealer'], refs: 1 },
      Cheeks: { howTo: 'Nothing.', products: [], refs: 0 },
      Lips:   { howTo: 'Clean. Balm, then blot.', products: ['Aquaphor Lip Repair'], refs: 1 },
    },
  },
  {
    id: 'B', name: 'Look B', modelsCount: 9, mediaDesc: 'Demo + 4 photos · 1 clip',
    state: 'waiting', sentTo: 'Yadim', sentAt: '3:12',
    writtenBy: 'Aimi K',
    areas: {
      Eyes:   { howTo: "Smoky liner smudged into the lash line, deep brown shadow to the crease.", products: ["Charlotte Tilbury Rock 'n' Kohl · Barbarella Brown",'Basic brown shadow~Generic'], refs: 2 },
      Brows:  { howTo: 'Feathered up, a little messy.', products: ['Anastasia Brow Freeze'], refs: 1 },
      Skin:   { howTo: 'Dewy, glow on the high points.', products: ['Glossier Futuredew','Basic cream highlighter~Generic'], refs: 1 },
      Cheeks: { howTo: 'Soft warm flush, cream only.', products: ['Merit Flush Balm · Cheeky'], refs: 0 },
      Lips:   { howTo: 'Nude gloss, blotted center.', products: ['Fenty Gloss Bomb · Fu$$y'], refs: 1 },
    },
  },
  {
    id: 'C', name: 'Look C', modelsCount: 7, mediaDesc: 'Demo at 2:15 PM',
    state: 'draft', noDemo: true, areasWritten: 2, areasTotal: 5,
    writtenBy: 'Aimi K',
    areas: {
      Eyes:   { howTo: 'Bare lid, one graphic white line on the upper lash.', products: ['Basic white liner~Generic'], refs: 1 },
      Brows:  { howTo: '', products: [], refs: 0 },
      Skin:   { howTo: 'Matte, full coverage, no shine anywhere.', products: ['Estée Lauder Double Wear · per model'], refs: 0 },
      Cheeks: { howTo: '', products: [], refs: 0 },
      Lips:   { howTo: '', products: [], refs: 0 },
    },
  },
]

const PRODUCT_SUGGESTIONS = ['Basic mascara~Generic~any black mascara in the kit','Maybelline Lash Sensational Sky High~Very Black','Charlotte Tilbury Rock \'n\' Kohl~Barbarella Brown','L\'Oréal Telescopic~Blackest Black','Lancôme Lash Idôle~Glossy Black']

const INV_AREAS = ['All', 'Skin', 'Eyes', 'Lips', 'Brows', 'Tools']

function InventoryTab() {
  const [products, setProducts] = useState(initInventory)
  const [areaFilter, setAreaFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [newProd, setNewProd] = useState({ name: '', brand: '', shade: '', area: 'Skin', inKit: '', today: '', stock: '' })

  const visible = areaFilter === 'All' ? products : products.filter(p => p.area === areaFilter)
  const countByArea = Object.fromEntries(INV_AREAS.map(a => [a, a === 'All' ? products.length : products.filter(p => p.area === a).length]))

  function handleAddProduct() {
    if (!newProd.name.trim()) return
    const p = {
      id: `p-new-${Date.now()}`,
      name: newProd.name, brand: newProd.brand, shade: newProd.shade, area: newProd.area,
      color: '#C8B090',
      inKit: parseInt(newProd.inKit) || 0,
      today: parseInt(newProd.today) || 0,
      stock: parseInt(newProd.stock) || 0,
    }
    setProducts(prev => [...prev, p])
    setNewProd({ name: '', brand: '', shade: '', area: 'Skin', inKit: '', today: '', stock: '' })
    setAddOpen(false)
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 0 0 0' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', flexWrap: 'wrap', rowGap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {INV_AREAS.map(area => (
            <button key={area} onClick={() => setAreaFilter(area)}
              style={{ height: 32, padding: '0 14px', borderRadius: 999, border: 0, background: areaFilter === area ? TX : RL, color: areaFilter === area ? 'var(--sp-inverse-text)' : TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {area} {countByArea[area]}
            </button>
          ))}
        </div>
        <button onClick={() => setAddOpen(true)} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, letterSpacing: '.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + ADD PRODUCT
        </button>
      </div>

      {addOpen && (
        <div style={{ flexShrink: 0, margin: '0 24px 12px', padding: '14px 16px', background: SF, border: `1px solid ${BD}`, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
          {[['name','Product name'], ['brand','Brand'], ['shade','Shade']].map(([k, ph]) => (
            <input key={k} value={newProd[k]} onChange={e => setNewProd(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
              style={{ flex: '1 1 140px', height: 36, padding: '0 10px', border: `1px solid ${BD}`, borderRadius: 8, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, background: 'transparent', outline: 'none' }} />
          ))}
          <select value={newProd.area} onChange={e => setNewProd(p => ({ ...p, area: e.target.value }))}
            style={{ height: 36, padding: '0 10px', border: `1px solid ${BD}`, borderRadius: 8, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, background: 'transparent', outline: 'none', cursor: 'pointer' }}>
            {['Skin','Eyes','Lips','Brows','Tools'].map(a => <option key={a}>{a}</option>)}
          </select>
          {[['inKit','In kit'], ['stock','Stock']].map(([k, ph]) => (
            <input key={k} value={newProd[k]} onChange={e => setNewProd(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} type="number"
              style={{ width: 70, height: 36, padding: '0 10px', border: `1px solid ${BD}`, borderRadius: 8, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, background: 'transparent', outline: 'none' }} />
          ))}
          <button onClick={handleAddProduct} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Add</button>
          <button onClick={() => setAddOpen(false)} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BD}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,2fr) minmax(120px,1fr) 90px 70px 52px 60px 60px', alignItems: 'center', padding: '0 16px', height: 40, borderBottom: `1px solid ${BD}`, position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
            {['Product', 'Brand', 'Shade', 'Area', 'In kit', 'Today', 'Stock'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64' }}>{h}</span>
            ))}
          </div>
          {visible.map((p, i) => {
            const kitRed = p.inKit !== undefined && p.inKit <= 6
            const stockLow = p.stock > 0 && p.stock <= 3
            const stockOut = p.stock === 0
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,2fr) minmax(120px,1fr) 90px 70px 52px 60px 60px', alignItems: 'center', padding: '0 16px', minHeight: 44, borderBottom: i < visible.length - 1 ? `1px solid ${BD}` : 'none', background: 'white' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: p.color, flexShrink: 0, border: '1px solid rgba(0,0,0,.08)' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                </span>
                <span style={{ fontSize: 12, color: '#6E6A64', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.brand}</span>
                <span style={{ fontSize: 12, color: '#6E6A64', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.shade}</span>
                <span style={{ fontSize: 12, color: '#6E6A64' }}>{p.area}</span>
                <span style={{ fontSize: 13, fontWeight: kitRed ? 700 : 400, color: kitRed ? '#C4614A' : '#111' }}>{p.inKit}</span>
                <span style={{ fontSize: 13, color: '#111' }}>{p.today > 0 ? `${p.today} used` : ''}</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {stockOut ? <span style={{ height: 20, padding: '0 8px', borderRadius: 999, background: '#E8B7AC', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: '#7A2018', lineHeight: '20px' }}>OUT</span>
                  : stockLow ? <span style={{ height: 20, padding: '0 8px', borderRadius: 999, background: '#F2D9D3', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: '#A33D28', lineHeight: '20px' }}>LOW</span>
                  : <span style={{ fontSize: 13, color: '#111' }}>{p.stock}</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ReceiptsTab() {
  const [items, setItems] = useState(initReceipts)
  const [chipFilter, setChipFilter] = useState('All')
  const visible = chipFilter === 'All' ? items : items.filter(r => r.status === chipFilter.toLowerCase())
  const totalSpent = items.reduce((s, r) => s + r.amount, 0)
  const waitingCount = items.filter(r => r.status === 'submitted').length

  function approve(id) {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 24px 24px' }}>
      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[
          { value: `€${totalSpent}`, label: 'Spent on this show' },
          { value: `€${receiptSummary.budget.toLocaleString()}`, label: 'Kit budget' },
          { value: waitingCount, label: 'Waiting for your approval', amber: true },
        ].map(c => (
          <div key={c.label} style={{ flex: 1, padding: '14px 16px', background: SF, border: `1px solid ${BD}`, borderRadius: 12 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: c.amber ? '#D4A853' : TX }}>{c.value}</div>
            <div style={{ fontSize: 12, color: MT, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter chips + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap', rowGap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Waiting', 'Approved'].map(f => (
            <button key={f} onClick={() => setChipFilter(f)}
              style={{ height: 32, padding: '0 14px', borderRadius: 999, border: 0, background: chipFilter === f ? TX : RL, color: chipFilter === f ? 'var(--sp-inverse-text)' : TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>
        <span style={{ flex: 1 }} />
        <button style={{ height: 36, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          EXPORT FOR ALEXIS
        </button>
        <button style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + ADD RECEIPT
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BD}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '130px minmax(120px,1fr) 130px minmax(100px,1fr) 80px 100px', alignItems: 'center', padding: '0 16px', height: 40, borderBottom: `1px solid ${BD}`, background: 'white' }}>
          {['When', 'Vendor', 'Submitted by', 'For', 'Amount', 'Status'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64' }}>{h}</span>
          ))}
        </div>
        {visible.map((r, i) => {
          const isSubmitted = r.status === 'submitted'
          return (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '130px minmax(120px,1fr) 130px minmax(100px,1fr) 80px 100px', alignItems: 'center', padding: '0 16px', minHeight: 48, borderBottom: i < visible.length - 1 ? `1px solid ${BD}` : 'none', background: 'white', cursor: isSubmitted ? 'pointer' : 'default' }}
              onClick={() => isSubmitted && approve(r.id)}>
              <span style={{ fontSize: 12, color: '#6E6A64' }}>{r.when}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{r.vendor}</span>
              <span style={{ fontSize: 12, color: '#6E6A64' }}>{r.submittedByName}</span>
              <span style={{ fontSize: 12, color: '#6E6A64', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.for}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>€{r.amount}</span>
              <span>
                {isSubmitted
                  ? <span style={{ height: 24, padding: '0 10px', borderRadius: 999, background: '#FEF3C7', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#92400E', lineHeight: '24px', display: 'inline-block', whiteSpace: 'nowrap' }}>SUBMITTED</span>
                  : <span style={{ height: 24, padding: '0 10px', borderRadius: 999, background: '#DCE8DD', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#3A5C3E', lineHeight: '24px', display: 'inline-block', whiteSpace: 'nowrap' }}>APPROVED</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IPadStudioSection() {
  const [looks, setLooks]           = useState(IPAD_LOOKS_INIT)
  const [selId, setSelId]           = useState('A')
  const [studioTab, setStudioTab]   = useState('looks')
  const [editingId, setEditingId]   = useState(null)
  const [addingNew, setAddingNew]   = useState(false)
  const [moreMenuId, setMoreMenuId] = useState(null)
  const [editName, setEditName]     = useState('')
  const [editArea, setEditArea]     = useState('Eyes')
  const [editAreaData, setEditAreaData] = useState({})
  const [prodQuery, setProdQuery]   = useState('')
  const [prodOpen, setProdOpen]     = useState(false)

  function startEdit(look) {
    setEditingId(look.id)
    setEditName(look.name)
    setEditArea('Eyes')
    setEditAreaData(JSON.parse(JSON.stringify(look.areas)))
    setProdQuery(''); setProdOpen(false)
  }

  function saveEdit() {
    setLooks(prev => prev.map(l => l.id === editingId ? { ...l, name: editName, areas: editAreaData } : l))
    setEditingId(null)
  }

  function updateEditHowTo(val) {
    setEditAreaData(prev => ({ ...prev, [editArea]: { ...prev[editArea], howTo: val } }))
  }

  function removeProduct(p) {
    setEditAreaData(prev => ({ ...prev, [editArea]: { ...prev[editArea], products: prev[editArea].products.filter(x => x !== p) } }))
  }

  function addProduct(p) {
    setEditAreaData(prev => {
      const cur = prev[editArea]?.products || []
      if (cur.includes(p)) return prev
      return { ...prev, [editArea]: { ...prev[editArea], products: [...cur, p] } }
    })
    setProdQuery(''); setProdOpen(false)
  }

  function sendToArtist(id) {
    setLooks(prev => prev.map(l => l.id === id ? { ...l, state: 'waiting', sentTo: 'Yadim', sentAt: '3:12' } : l))
  }

  function cancelRequest(id) {
    setLooks(prev => prev.map(l => l.id === id ? { ...l, state: 'draft' } : l))
  }

  function unshare(id) {
    setLooks(prev => prev.map(l => l.id === id ? { ...l, state: 'draft' } : l))
    setMoreMenuId(null)
  }

  function addNewLook() {
    const newId = String.fromCharCode(65 + looks.length)
    const blank = { id: newId, name: `Look ${newId}`, modelsCount: 0, mediaDesc: 'No demo yet', state: 'draft', noDemo: true, areasWritten: 0, areasTotal: 5, writtenBy: 'You', areas: { Eyes: { howTo:'',products:[],refs:0 }, Brows: { howTo:'',products:[],refs:0 }, Skin: { howTo:'',products:[],refs:0 }, Cheeks: { howTo:'',products:[],refs:0 }, Lips: { howTo:'',products:[],refs:0 } } }
    setLooks(prev => [...prev, blank])
    setAddingNew(false)
    startEdit(blank)
    setSelId(newId)
  }

  const selLook = looks.find(l => l.id === selId) || looks[0]
  const isEditing = editingId === selId
  const curEditAreaData = editAreaData[editArea] || { howTo: '', products: [], refs: 0 }
  const filteredSuggestions = prodQuery ? PRODUCT_SUGGESTIONS.filter(p => p.toLowerCase().includes(prodQuery.toLowerCase())) : PRODUCT_SUGGESTIONS

  function ProductChip({ p }) {
    const parts = p.split('~')
    const isGeneric = parts[1] === 'Generic'
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: BG, border: `1px solid ${BD}`, fontSize: 12, whiteSpace: 'nowrap' }}>
        {parts[0]}
        {isGeneric && <span style={{ fontSize: 10, letterSpacing: '.08em', color: MT, textTransform: 'uppercase' }}>Generic</span>}
      </span>
    )
  }

  function ByAreaRows({ look }) {
    return (
      <div>
        <Lbl>By area</Lbl>
        {LOOK_AREAS.map(area => {
          const a = look.areas[area] || {}
          const isEmpty = !a.howTo
          return (
            <div key={area} style={{ display: 'grid', gridTemplateColumns: '76px minmax(0,1fr) auto', gap: 12, padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 16 }}>{area}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: isEmpty ? M2 : TX }}>{isEmpty ? 'Not written yet.' : a.howTo}</span>
                {(a.products || []).length > 0 && (
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {a.products.map((p, i) => <ProductChip key={i} p={p} />)}
                  </span>
                )}
              </span>
              {a.refs > 0 && <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap' }}>{a.refs} reference{a.refs > 1 ? 's' : ''}</span>}
            </div>
          )
        })}
      </div>
    )
  }

  function LookDetail({ look }) {
    const st = look.state
    return (
      <div style={{ minHeight: 0, overflowY: 'auto', background: SF, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>{look.name}</span>
            <span style={{ fontSize: 12, color: MT }}>{look.modelsCount} models · written by {look.writtenBy}</span>
          </span>
          {st === 'shared' && <>
            <button onClick={() => startEdit(look)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>EDIT LOOK</button>
            <button onClick={() => setMoreMenuId(moreMenuId === look.id ? null : look.id)} aria-label="More" style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontSize: 18, color: TX, flexShrink: 0, cursor: 'pointer', position: 'relative' }}>⋯
              {moreMenuId === look.id && (
                <div style={{ position: 'absolute', right: 0, top: 46, background: SF, border: `1px solid ${BD}`, borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,.14)', padding: 6, zIndex: 10, minWidth: 200, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                  {[['Duplicate look', false], ['Assign models', false], ['Unshare from the team', true]].map(([label, isRed]) => (
                    <button key={label} onClick={() => { if (isRed) unshare(look.id); else setMoreMenuId(null) }} style={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: 44, padding: '0 14px', border: 0, borderRadius: 8, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: isRed ? 'var(--sp-red-text)' : TX, cursor: 'pointer', textAlign: 'left' }}>{label}</button>
                  ))}
                </div>
              )}
            </button>
          </>}
          {st === 'waiting' && <>
            <button onClick={() => cancelRequest(look.id)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${TX.replace('var(--sp-text)', 'var(--sp-red-text)')}`, background: 'transparent', color: 'var(--sp-red-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>CANCEL REQUEST</button>
            <button onClick={() => startEdit(look)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>EDIT LOOK</button>
          </>}
          {st === 'draft' && <>
            <button onClick={() => startEdit(look)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>EDIT LOOK</button>
            <button onClick={() => sendToArtist(look.id)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>SEND TO YADIM</button>
          </>}
        </div>
        {/* Status bar */}
        {st === 'shared' && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--sp-green-surface)', fontSize: 12, lineHeight: 1.4, color: 'var(--sp-green-text)' }}>
          <span style={{ flex: 1 }}>Approved by {look.approvedBy} at {look.approvedAt} · Shared with {look.sharedWith} · {look.openedCount} opened</span>
          <button style={{ border: 0, background: 'none', padding: 0, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: 'var(--sp-green-text)', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>See who</button>
        </div>}
        {st === 'waiting' && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--sp-amber-surface)', fontSize: 12, lineHeight: 1.4, color: 'var(--sp-amber-text)' }}>
          <span style={{ flex: 1 }}>Sent to {look.sentTo} for approval at {look.sentAt} · Not opened yet. Only you and {look.sentTo} can see it.</span>
        </div>}
        {st === 'draft' && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: RL, fontSize: 12, lineHeight: 1.4, color: MT }}>
          <span style={{ flex: 1 }}>Draft · Only you can see this. {look.areasWritten} of {look.areasTotal} areas written.</span>
        </div>}
        {/* Demo */}
        {look.noDemo ? (
          <div style={{ height: 200, borderRadius: 12, border: `1px dashed ${DV}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>No demo yet</span>
            <span style={{ fontSize: 12, color: MT }}>Demo scheduled {look.mediaDesc}. Add photos or a video when it&apos;s done.</span>
          </div>
        ) : (
          <div style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: BD }}>
            <span style={{ position: 'absolute', left: 12, bottom: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(17,17,17,.75)', color: 'var(--sp-inverse-text)', fontSize: 12 }}>Full demo · Yadim and Aimi · 4:12</span>
          </div>
        )}
        {/* Photo strip (only if not noDemo) */}
        {!look.noDemo && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
            {[0,1,2,3,4].map(i => (
              <span key={i} style={{ width: 64, height: 64, borderRadius: 10, background: BD, flexShrink: 0, border: i === 0 ? `2px solid ${TX}` : '2px solid transparent', display: 'block' }} />
            ))}
          </div>
        )}
        {/* By area */}
        <ByAreaRows look={look} />
      </div>
    )
  }

  function EditDetail({ look }) {
    const curProds = curEditAreaData.products || []
    return (
      <div style={{ minHeight: 0, overflowY: 'auto', background: SF, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Name + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input value={editName} onChange={e => setEditName(e.target.value)} aria-label="Look name"
            style={{ flex: 1, minWidth: 0, height: 44, padding: '0 12px', border: `1px solid ${DV}`, borderRadius: 10, fontFamily: 'Georgia, serif', fontSize: 22, color: TX, background: SF, outline: 'none' }} />
          <button onClick={() => setEditingId(null)} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>CANCEL</button>
          <button onClick={saveEdit} style={{ minHeight: 40, padding: '0 16px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>SAVE DRAFT</button>
        </div>
        {/* Models */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: MT }}>
          <span>Models</span>
          {Array.from({length: Math.min(look.modelsCount, 3)}, (_,i) => (
            <span key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: BD, marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff', display: 'inline-block' }} />
          ))}
          {look.modelsCount > 3 && <span>+{look.modelsCount - 3} more · {look.modelsCount} models</span>}
          <button style={{ border: 0, background: 'none', padding: 0, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: TX, cursor: 'pointer' }}>Change</button>
        </div>
        {/* Area tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          {LOOK_AREAS.map(area => {
            const hasContent = (editAreaData[area]?.howTo || '') !== ''
            const isAct = area === editArea
            return (
              <button key={area} onClick={() => { setEditArea(area); setProdQuery(''); setProdOpen(false) }}
                style={{ minHeight: 40, padding: '0 14px', border: 0, borderBottom: isAct ? `2px solid ${TX}` : '2px solid transparent', background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: isAct ? TX : MT, cursor: 'pointer', marginBottom: -1 }}>
                {area}{hasContent ? ' ·' : ''}
              </button>
            )
          })}
        </div>
        {/* How to do it */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Lbl>How to do it</Lbl>
          <textarea rows={2} value={curEditAreaData.howTo || ''} onChange={e => updateEditHowTo(e.target.value)}
            style={{ padding: 12, border: `1px solid ${DV}`, borderRadius: 10, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, lineHeight: 1.45, resize: 'none', color: TX, background: SF, outline: 'none' }} />
        </div>
        {/* Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          <Lbl>Products</Lbl>
          {curProds.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {curProds.map((p, i) => {
                const parts = p.split('~')
                return (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: BG, border: `1px solid ${BD}`, fontSize: 12, whiteSpace: 'nowrap' }}>
                    {parts[0]}
                    {parts[1] === 'Generic' && <span style={{ fontSize: 10, letterSpacing: '.08em', color: MT, textTransform: 'uppercase' }}>Generic</span>}
                    <button onClick={() => removeProduct(p)} aria-label={`Remove ${parts[0]}`} style={{ border: 0, background: 'none', padding: 0, color: MT, cursor: 'pointer', lineHeight: 1 }}>×</button>
                  </span>
                )
              })}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 12px', border: `1px solid ${prodOpen ? TX : DV}`, borderRadius: 10, background: SF, fontSize: 14, color: TX }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MT} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              <input value={prodQuery} onChange={e => { setProdQuery(e.target.value); setProdOpen(true) }} onFocus={() => setProdOpen(true)}
                placeholder="Search products" style={{ flex: 1, border: 0, outline: 'none', background: 'none', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, color: TX }} />
            </span>
            {prodOpen && (
              <div style={{ position: 'absolute', left: 0, right: 0, top: 52, background: SF, border: `1px solid ${BD}`, borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,.14)', padding: 6, zIndex: 10 }}>
                {filteredSuggestions.map((p, i) => {
                  const parts = p.split('~')
                  const isGeneric = parts[1] === 'Generic'
                  return (
                    <button key={i} onClick={() => addProduct(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 48, padding: '6px 12px', border: 0, borderRadius: 8, background: i === 0 ? BG : 'transparent', textAlign: 'left', fontFamily: 'Inter,system-ui,sans-serif', color: TX, cursor: 'pointer' }}>
                      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 14 }}>{parts[0]}</span>
                        <span style={{ fontSize: 12, color: MT }}>{isGeneric ? `Generic · ${parts[2] || ''}` : (parts[1] || '')}</span>
                      </span>
                      {isGeneric && <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: MT }}>Generic</span>}
                    </button>
                  )
                })}
                <div style={{ padding: '8px 12px 4px', fontSize: 12, color: MT, borderTop: `1px solid ${BD}`, marginTop: 4 }}>
                  Can&apos;t find it? <button onClick={() => { addProduct(prodQuery); }} style={{ border: 0, background: 'none', padding: 0, textDecoration: 'underline', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Add &ldquo;{prodQuery || 'product'}&rdquo; as a new product</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* References */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Lbl>References</Lbl>
            <button style={{ border: 0, background: 'none', padding: 0, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, textDecoration: 'underline', color: TX, cursor: 'pointer' }}>Paste a link</button>
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(curEditAreaData.refs || 0) > 0 && Array.from({ length: curEditAreaData.refs }, (_,i) => (
              <span key={i} style={{ position: 'relative', flexShrink: 0 }}>
                <span style={{ width: 88, height: 88, borderRadius: 10, background: BD, display: 'block' }} />
                <span style={{ position: 'absolute', left: 6, right: 6, bottom: 6, fontSize: 10, color: 'var(--sp-inverse-text)', background: 'rgba(17,17,17,.7)', borderRadius: 4, padding: '2px 4px', textAlign: 'center' }}>Ref {i+1}</span>
              </span>
            ))}
            <button style={{ width: 88, height: 88, borderRadius: 10, border: `1px dashed ${DV}`, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, color: TX, flexShrink: 0, cursor: 'pointer' }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>Photo or video
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Section header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px 12px' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>Studio</span>
        <span style={{ fontSize: 12, color: MT }}>Makeup · {looks.length} looks · 30 models</span>
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: RL }}>
          {(['looks','inventory','receipts']).map(tab => (
            <button key={tab} onClick={() => setStudioTab(tab)}
              style={{ minHeight: 36, padding: '0 16px', borderRadius: 999, border: 0, background: studioTab === tab ? TX : 'transparent', color: studioTab === tab ? '#fff' : MT, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {studioTab === 'looks' && (
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '280px minmax(0,1fr)', gap: 20, padding: '0 24px 24px' }} onClick={() => { if (moreMenuId) setMoreMenuId(null); if (prodOpen) setProdOpen(false) }}>
          {/* Left: look list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflowY: 'auto' }}>
            {looks.map(look => {
              const isSel = look.id === selId
              const stateColor = look.state === 'shared' ? 'var(--sp-green-text)' : look.state === 'waiting' ? 'var(--sp-amber-text)' : MT
              const stateLabel = look.state === 'shared' ? 'Shared with the team' : look.state === 'waiting' ? `Waiting on Yadim` : 'Draft'
              return (
                <button key={look.id} onClick={() => { setSelId(look.id); if (editingId && editingId !== look.id) setEditingId(null) }}
                  style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 14, border: isSel ? `1.5px solid ${TX}` : `1px solid ${BD}`, background: SF, textAlign: 'left', fontFamily: 'Inter,system-ui,sans-serif', color: TX, cursor: 'pointer' }}>
                  <span style={{ width: 56, height: 72, borderRadius: 8, background: BD, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: MT, textAlign: 'center' }}>
                    {look.noDemo ? 'No demo' : ''}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{look.name}</span>
                    <span style={{ fontSize: 12, color: MT }}>{look.modelsCount} models · {look.mediaDesc}</span>
                    <span style={{ fontSize: 12, color: stateColor, fontWeight: 500 }}>{stateLabel}</span>
                  </span>
                </button>
              )
            })}
            <button onClick={() => setAddingNew(true)}
              style={{ minHeight: 48, borderRadius: 14, border: `1px dashed ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, color: TX, cursor: 'pointer' }}>
              + Add a look
            </button>
            {addingNew && (
              <div style={{ padding: '12px 14px', background: SF, border: `1px solid ${BD}`, borderRadius: 14 }}>
                <p style={{ fontSize: 13, color: MT, margin: '0 0 10px' }}>Add a new look?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addNewLook} style={{ flex: 1, height: 36, borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Add</button>
                  <button onClick={() => setAddingNew(false)} style={{ flex: 1, height: 36, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', color: TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          {/* Right: detail */}
          {selLook && (isEditing ? <EditDetail look={selLook} /> : <LookDetail look={selLook} />)}
        </div>
      )}

      {studioTab === 'inventory' && <InventoryTab />}

      {studioTab === 'receipts' && <ReceiptsTab />}
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

function IPadSettingsSection({ dark, onToggleDark, schedule, onScheduleChange, venue, onVenueChange, models: allModels }) {
  const [active, setActive] = useState('schedule')
  const [rows, setRows]     = useState(() => schedule || [])

  const [venueName,         setVenueName]         = useState(venue?.area?.name || '')
  const [venueAddress,      setVenueAddress]       = useState(venue?.pin?.address || '')
  const [backstageLocation, setBackstageLocation]  = useState(venue?.backstageLocation || '')
  const [teamEntrance,      setTeamEntrance]        = useState(venue?.teamEntrance || '')
  const [venueWifi,         setVenueWifi]           = useState(venue?.wifi || '')
  const [venueContact,      setVenueContact]        = useState(venue?.contact || '')
  const [venueNotes,        setVenueNotes]          = useState(venue?.teamNotes || '')

  function changeRow(idx, field, value) {
    setRows(prev => { const n = prev.map((r, i) => i === idx ? { ...r, [field]: value } : r); onScheduleChange?.(n); return n })
  }
  function addRow()       { setRows(prev => { const n = [...prev, { time: '', label: '' }]; onScheduleChange?.(n); return n }) }
  function deleteRow(idx) { setRows(prev => { const n = prev.filter((_, i) => i !== idx); onScheduleChange?.(n); return n }) }

  function handleSaveVenue() {
    onVenueChange?.({
      ...venue,
      area: { ...venue?.area, name: venueName },
      pin:  { ...venue?.pin,  address: venueAddress },
      backstageLocation, teamEntrance, wifi: venueWifi, contact: venueContact, teamNotes: venueNotes,
    })
  }

  const mkKeyArtist   = profiles.filter(p => p.role === 'artist' && p.specialty === SVC)
  const mkLeads       = profiles.filter(p => p.role === 'lead_assistant' && p.specialty === SVC)
  const mkAssistants  = profiles.filter(p => p.role === 'assistant' && p.specialty === SVC).sort((a, b) => a.name.localeCompare(b.name))
  const looks         = [...new Set((allModels || []).map(m => m.look))].sort()

  function TeamTable({ title, rows: pRows }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, margin: '0 0 8px' }}>{title}</p>
        <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BD}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px,2fr) 130px 100px 140px', alignItems: 'center', padding: '0 16px', height: 38, borderBottom: `1px solid ${BD}`, background: 'white' }}>
            {['Name', 'Phone', 'Station', 'With Art Partner'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64' }}>{h}</span>
            ))}
          </div>
          {pRows.map((p, i) => {
            const det = modelDetails?.[p.id]
            const pastCount = det?.pastShows?.count ?? 0
            const withLabel = pastCount > 0 ? `${pastCount} show${pastCount > 1 ? 's' : ''}` : '1st show'
            const roleLabel = p.role === 'artist' ? 'Key artist' : p.role === 'lead_assistant' ? 'Lead assistant' : 'Assistant'
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(160px,2fr) 130px 100px 140px', alignItems: 'center', padding: '0 16px', minHeight: 44, borderBottom: i < pRows.length - 1 ? `1px solid ${BD}` : 'none', background: 'white' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={p.avatar} alt={p.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: '#6E6A64' }}>{roleLabel}</span>
                  </span>
                </span>
                <span style={{ fontSize: 12, color: '#6E6A64' }}>{p.phone || ''}</span>
                <span style={{ fontSize: 12, color: '#6E6A64' }}>{p.station || ''}</span>
                <span style={{ fontSize: 12, color: '#6E6A64' }}>{withLabel}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BD}`, overflowY: 'auto' }}>
        {[['show', 'Show Setup'], ['prefs', 'Preferences']].map(([grp, grpLabel], gi) => (
          <div key={grp} style={{ padding: gi === 0 ? '16px 0 8px' : '24px 0 8px' }}>
            <Lbl s={{ padding: '0 12px', marginBottom: 4 }}>{grpLabel}</Lbl>
            {SETTINGS_ITEMS.filter(s => s.group === grp).map(s => {
              const isAct = active === s.id
              return (
                <div key={s.id} style={{ padding: '3px 8px' }}>
                  <button onClick={() => setActive(s.id)} style={{ width: '100%', height: 44, display: 'flex', alignItems: 'center', padding: '0 14px', borderRadius: 999, border: 0, background: isAct ? TX : 'transparent', color: isAct ? 'var(--sp-inverse-text)' : TX, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, fontWeight: isAct ? 600 : 400, cursor: 'pointer', textAlign: 'left' }}>
                    {s.label}
                  </button>
                </div>
              )
            })}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                ['Venue name', venueName, setVenueName],
                ['Address', venueAddress, setVenueAddress],
                ['Backstage location', backstageLocation, setBackstageLocation],
                ['Team entrance', teamEntrance, setTeamEntrance],
                ['Wi-Fi', venueWifi, setVenueWifi],
                ['Venue contact', venueContact, setVenueContact],
              ].map(([label, val, setter]) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Lbl>{label}</Lbl>
                  <input value={val} onChange={e => setter(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', height: 44, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, padding: '0 14px', color: TX, outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <Lbl>Notes for the team</Lbl>
              <textarea value={venueNotes} onChange={e => setVenueNotes(e.target.value)} rows={3}
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: `1px solid ${BD}`, borderRadius: 8, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, lineHeight: 1.5, color: TX, outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              <Lbl>Floor plan</Lbl>
              <div style={{ height: 80, borderRadius: 8, border: `1px dashed ${DV}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                <span style={{ fontSize: 13, color: MT }}>{venue?.floorPlanImage ? venue.floorPlanImage : 'No file uploaded'}</span>
                <button style={{ height: 34, padding: '0 14px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: TX, cursor: 'pointer' }}>REPLACE FILE</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ height: 44, padding: '0 20px', borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, letterSpacing: '.08em', color: TX, cursor: 'pointer' }}>CANCEL</button>
              <button onClick={handleSaveVenue} style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, letterSpacing: '.08em', cursor: 'pointer' }}>SAVE VENUE</button>
            </div>
          </div>
        )}
        {active === 'models' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: 0 }}>Models</p>
                <p style={{ fontSize: 12, color: MT, margin: '2px 0 0' }}>{(allModels || []).length} models · {looks.length} looks</p>
              </div>
              <span style={{ flex: 1 }} />
              <button style={{ height: 36, padding: '0 14px', borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}>IMPORT CSV</button>
              <button style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ ADD MODEL</button>
            </div>
            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BD}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(140px,2fr) 50px 110px 160px minmax(100px,1fr)', alignItems: 'center', padding: '0 16px', height: 38, borderBottom: `1px solid ${BD}`, background: 'white', position: 'sticky', top: 0 }}>
                {['#', 'Model', 'Look', 'Phone', 'Shows with Art Partner', 'Notes'].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64' }}>{h}</span>
                ))}
              </div>
              {(allModels || []).map((m, i) => {
                const det = modelDetails?.[m.id] || {}
                const pastCount = det.pastShows?.count ?? 0
                const pastLabel = pastCount > 0 ? `${pastCount} · ${det.pastShows.shows}` : 'First time'
                const allergyNote = m.notes?.find(n => n.isAllergy)
                const otherNote = m.notes?.find(n => !n.isAllergy)
                return (
                  <div key={m.id} onClick={() => {}} style={{ display: 'grid', gridTemplateColumns: '36px minmax(140px,2fr) 50px 110px 160px minmax(100px,1fr)', alignItems: 'center', padding: '0 16px', minHeight: 44, borderBottom: i < (allModels.length - 1) ? `1px solid ${BD}` : 'none', background: 'white', cursor: 'pointer' }}>
                    <span style={{ fontSize: 12, color: '#6E6A64' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={m.avatar} alt={m.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                    </span>
                    <span style={{ fontSize: 12, color: '#6E6A64' }}>Look {m.look}</span>
                    <span style={{ fontSize: 12, color: '#6E6A64' }}>{det.phone || ''}</span>
                    <span style={{ fontSize: 12, color: '#6E6A64', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pastLabel}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {allergyNote && <span style={{ height: 20, padding: '0 8px', borderRadius: 999, background: '#F8E9E5', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', color: '#A33D28', lineHeight: '20px', whiteSpace: 'nowrap' }}>ALLERGY</span>}
                      {otherNote && <span style={{ fontSize: 11, color: '#6E6A64', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherNote.text}</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {active === 'team' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: 0 }}>Team</p>
                <p style={{ fontSize: 12, color: MT, margin: '2px 0 0' }}>Makeup · {mkKeyArtist.length} key artist · {mkLeads.length} leads · {mkAssistants.length} assistants</p>
              </div>
              <span style={{ flex: 1 }} />
              <button style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ ADD PERSON</button>
            </div>
            <TeamTable title="Key artist and leads" rows={[...mkKeyArtist, ...mkLeads]} />
            <TeamTable title={`Makeup assistants · ${mkAssistants.length}`} rows={mkAssistants} />
          </div>
        )}
        {active === 'notifications' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Notifications</p>
            {[['Status alerts', 'Notify when model status changes'], ['Pings', 'Notify when an assistant sends a ping']].map(([label, desc]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BD}` }}>
                <div><div style={{ fontSize: 14, color: TX }}>{label}</div><div style={{ fontSize: 12, color: MT, marginTop: 2 }}>{desc}</div></div>
                <span style={{ width: 44, height: 24, borderRadius: 999, background: TX, position: 'relative', flexShrink: 0, display: 'inline-block' }}><span style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: SF, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} /></span>
              </div>
            ))}
          </div>
        )}
        {active === 'appearance' && (
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 20px' }}>Appearance</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BD}` }}>
              <span style={{ fontSize: 14, color: TX }}>Dark mode</span>
              <button onClick={onToggleDark} style={{ width: 44, height: 24, borderRadius: 999, background: dark ? '#7A9E7E' : BD, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 150ms', flexShrink: 0 }}>
                <span style={{ position: 'absolute', top: 3, left: dark ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: dark ? '#F0EDE8' : SF, transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
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
  onVenueChange,
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

  const [panelCollapsed, setPanelCollapsedRaw] = useState(() =>
    localStorage.getItem('sp_panelCollapsed') === 'true'
  )
  const [pairToast, setPairToast] = useState(null)

  useEffect(() => { localStorage.removeItem('sp_panelWidth') }, [])

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

  useEffect(() => {
    if (!pairToast) return
    const t = setTimeout(() => setPairToast(null), 5000)
    return () => clearTimeout(t)
  }, [pairToast])

  const wkActive  = walkthroughPhase === 'in_progress'
  const producer  = profiles.find(p => p.role === 'lead') || profiles[0]

  const isPortrait      = windowSize.w <= windowSize.h
  const effectivePanelW = isPortrait ? 0 : (panelCollapsed ? 72 : 340)
  const mainWidth       = windowSize.w - effectivePanelW
  const narrowMain      = mainWidth < 720
  const drawerHeight    = drawerOpen ? 470 : 160

  const readyCount      = models.filter(m => m.services.hair.status === 'done' && m.services.makeup.status === 'done' && m.services.nails.status === 'done').length
  const notArrivedCount = models.filter(m => !m.arrived).length
  const notPairedCount  = models.filter(m => m.arrived && !m.services[SVC].assistantId).length
  const needsCount      = models.filter(m => m.flagged || m.services[SVC]?.reviewRequestedAt).length
  const toCheckCount    = toCheckQueue.length

  useEffect(() => {
    if (filter === 'needs_attention' && needsCount === 0)       { setFilter('all'); setPanel('default') }
    else if (filter === 'not_arrived' && notArrivedCount === 0) { setFilter('all'); setPanel('default') }
    else if (filter === 'not_paired' && notPairedCount === 0)   { setFilter('all'); setPanel('default') }
  }, [needsCount, notArrivedCount, notPairedCount, filter])

  const filtered = models.filter(m => {
    switch (filter) {
      case 'needs_attention': return m.flagged
      case 'not_arrived':     return !m.arrived
      case 'not_paired':      return m.arrived && !m.services[SVC].assistantId
      case 'ready':           return m.services.hair.status === 'done' && m.services.makeup.status === 'done' && m.services.nails.status === 'done'
      case 'to_check':        return toCheckQueue.some(c => c.modelId === m.id)
      default:                return true
    }
  }).sort((a, b) => models.indexOf(a) - models.indexOf(b))

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
    const aid = m.services[SVC].assistantId
    const suffix = aid ? ` · ${getAssistantName(aid) || ''}` : ' · Not paired'
    return { text: `Arrived ${m.arrivedAt}${suffix}`, red: false }
  }
  function handlePair(m) {
    setPairModel(m); setPairAssist(null)
    setFilter('not_paired'); setPanel('pairing')
    if (panelCollapsed) expandPanel()
  }
  function handleConfirmPair() {
    if (!pairModel || !pairAssist) return
    const assistantName = profiles.find(p => p.id === pairAssist)?.name || ''
    const modelId = pairModel.id
    const modelName = pairModel.name
    setModels(prev => prev.map(m => m.id === modelId ? { ...m, services: { ...m.services, [SVC]: { ...m.services[SVC], assistantId: pairAssist } } } : m))
    const remainingAfter = models.filter(m => m.arrived && !m.services[SVC].assistantId && m.id !== modelId).length
    if (remainingAfter > 0) { setPairModel(null); setPairAssist(null); setPanel('not_paired_list') }
    else { setPairModel(null); setPairAssist(null); setFilter('all'); setPanel('default') }
    setPairToast({ modelId, modelName, assistantName })
  }
  function handleUndoPair() {
    if (!pairToast) return
    setModels(prev => prev.map(m => m.id === pairToast.modelId ? { ...m, services: { ...m.services, [SVC]: { ...m.services[SVC], assistantId: null } } } : m))
    setFilter('not_paired'); setPanel('not_paired_list')
    setPairToast(null)
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

  const gridCols = '40px 40px minmax(0,1fr) 104px 104px 104px'
  const showRight  = panel === 'default' || panel === 'confirm' || panel === 'arrivals' || panel === 'to_check'

  const _hairDS = { done: 0, ip: 0, pa: 0 }, _makeupDS = { done: 0, ip: 0, pa: 0 }, _nailsDS = { done: 0, ip: 0, pa: 0 }
  let _fullyReady = 0
  for (const m of models) {
    const hs = m.services.hair?.status, ms = m.services.makeup?.status, ns = m.services.nails?.status
    if (hs === 'done') _hairDS.done++; else if (hs === 'in_progress') _hairDS.ip++; else if (hs === 'paused') _hairDS.pa++
    if (ms === 'done') _makeupDS.done++; else if (ms === 'in_progress') _makeupDS.ip++; else if (ms === 'paused') _makeupDS.pa++
    if (ns === 'done') _nailsDS.done++; else if (ns === 'in_progress') _nailsDS.ip++; else if (ns === 'paused') _nailsDS.pa++
    if (hs === 'done' && ms === 'done' && ns === 'done') _fullyReady++
  }
  const DS = { ready: _fullyReady, hair: _hairDS, makeup: _makeupDS, nails: _nailsDS }
  const total = models.length
  const modelOrderMap = Object.fromEntries(models.map((m, i) => [m.id, String(i + 1).padStart(2, '0')]))
  const orderedSvcs = [SVC, ...['hair', 'makeup', 'nails'].filter(s => s !== SVC)]

  const showToggleBar = filter === 'not_arrived' || filter === 'needs_attention' || filter === 'not_paired'
  const _tbMap = {
    not_arrived:     { label: 'Arrivals',   count: notArrivedCount, filterPanel: 'arrivals'        },
    needs_attention: { label: 'Attention',  count: needsCount,      filterPanel: 'attention'       },
    not_paired:      { label: 'Not paired', count: notPairedCount,  filterPanel: 'not_paired_list' },
  }
  const tbCfg = showToggleBar ? _tbMap[filter] : null
  const leftTabActive = tbCfg ? (panel === tbCfg.filterPanel || (filter === 'not_paired' && panel === 'pairing')) : false

  return (
    <div className="sp-ipad" style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', color: TX }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', height: 56, borderBottom: `1px solid ${BD}` }}>
        {/* Menu button M3/M4 */}
        <button
          onClick={() => { const next = !menuOpen; setMenuOpen(next); lsSet('sp_ipad_menu', next) }}
          style={{ height: 44, padding: '0 14px 0 12px', borderRadius: 12, border: `1px solid ${TX}`, background: menuOpen ? TX : SF, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sp-inverse-text)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
            <div style={{ position: 'absolute', top: 48, right: 0, width: 320, background: SF, border: `1px solid ${BD}`, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 350, overflow: 'hidden' }}>
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
            <div className="sp-profile-menu" style={{ position: 'absolute', top: 48, right: 0, background: SF, border: `1px solid ${BD}`, borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.12)', minWidth: 220, zIndex: 350, overflow: 'hidden' }}>
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
                <span style={{ width: 36, height: 20, borderRadius: 999, background: dark ? '#7A9E7E' : BD, position: 'relative', flexShrink: 0, transition: 'background 150ms', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', top: 3, left: dark ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: dark ? '#F0EDE8' : SF, transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                </span>
              </button>
              <button onClick={() => { setShowHistoryOpen(true); setProfileMenuOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: TX }}>Show history</button>
              <button onClick={() => { setProfileMenuOpen(false); onLogOut?.() }} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', borderTop: `1px solid ${BD}`, cursor: 'pointer', fontSize: 13, color: 'var(--sp-red-text)', fontWeight: 500 }}>Log out</button>
            </div>
          )}
        </div>
      </div>

      {/* Body: nav + sections */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* Docked nav M4 */}
        {menuOpen && (
          <nav aria-label="Main navigation" style={{ width: 96, flexShrink: 0, borderRight: `1px solid ${BD}`, background: RL, display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
            {IPAD_SECTIONS.map(s => {
              const isActive = ipadSection === s.id
              return (
                <button key={s.id} onClick={() => { setIpadSection(s.id); lsSet('sp_ipad_section', s.id) }} aria-current={isActive ? 'page' : undefined} style={{ width: 76, minHeight: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: isActive ? TX : 'transparent', border: 'none', cursor: 'pointer', borderRadius: 14, margin: '0 10px' }}>
                  <NavIcon id={s.id} active={isActive} />
                  <span style={{ fontSize: 11, fontFamily: 'Inter,system-ui,sans-serif', color: isActive ? 'var(--sp-inverse-text)' : TX }}>{s.label}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Section content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {/* NON-HOME SECTIONS */}
          {ipadSection === 'assistants' && <IPadAssistantsSection models={models} profiles={profiles} />}
          {ipadSection === 'lineup'     && <IPadLineupSection models={models} setModels={setModels} />}
          {ipadSection === 'studio'     && <IPadStudioSection />}
          {ipadSection === 'settings'   && <IPadSettingsSection dark={dark} onToggleDark={onToggleDark} schedule={schedule} onScheduleChange={onScheduleChange} venue={venue} models={models} />}

          {/* HOME */}
          {ipadSection === 'home' && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>
            {/* Main content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '16px 24px 0', paddingBottom: isPortrait ? drawerHeight : 0 }}>

          {/* Metric card K */}
          {(() => {
            const readyFrac = DS.ready / total
            const r = 37.5, circ = +(2 * Math.PI * r).toFixed(1)
            const arc = +(readyFrac * circ).toFixed(1)
            const gap = +(circ - arc).toFixed(1)
            const pctLabel = Math.round(readyFrac * 100) + '%'
            const svcDS = DS[SVC]
            const showIn = timeUntilShow(show.showtime, currentTime)
            const barTrack = dark ? '#4A4743' : '#F0EDE8'
            return (
              <div style={{ flexShrink: 0, background: dark ? SF : '#fff', border: `1px solid ${dark ? BD : '#E0DDD8'}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingRight: 22, borderRight: `1px solid ${dark ? BD : '#E0DDD8'}`, flexShrink: 0 }}>
                  <span style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
                    <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
                      <circle cx="42" cy="42" r="37.5" fill="none" stroke={dark ? '#4A4743' : '#E8E4DF'} strokeWidth="9" />
                      <circle cx="42" cy="42" r="37.5" fill="none" stroke="#7A9E7E" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${arc} ${gap}`} transform="rotate(-90 42 42)" />
                    </svg>
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 20 }}>{pctLabel}</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: MT, whiteSpace: 'nowrap' }}>
                    <span>Fully ready <b style={{ color: TX }}>{DS.ready} of {total}</b></span>
                    {showIn && <span>Show in <b style={{ color: TX }}>{showIn}</b></span>}
                    <span>Not arrived <b style={{ color: TX }}>{notArrivedCount}</b></span>
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{SVC_LABEL}</span>
                    <span style={{ fontSize: 12, color: MT }}>Your team</span>
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr) 64px', columnGap: 14, rowGap: 8, alignItems: 'center' }}>
                    {[{ label: 'Done', n: svcDS.done, c: '#7A9E7E' }, { label: 'In progress', n: svcDS.ip, c: '#D4A853' }, { label: 'Paused', n: svcDS.pa, c: '#8A9BB0' }].map(({ label, n, c }) => (
                      <Fragment key={label}>
                        <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{label}</span>
                        <span style={{ height: 10, borderRadius: 5, background: barTrack, overflow: 'hidden', display: 'block' }}>
                          <span style={{ display: 'block', height: '100%', width: pct(n, total), background: c, borderRadius: 5 }} />
                        </span>
                        <span style={{ fontSize: 13, textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <b style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400 }}>{n}</b>
                          <span style={{ color: MT }}> /{total}</span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Count tiles */}
          <div style={{ flexShrink: 0, display: 'flex', flexWrap: 'nowrap', gap: 8, padding: '10px 0 6px', overflowX: 'auto' }}>
            {[
              { id: 'all',             label: 'Models',           count: models.length, countColor: TX,                            always: true  },
              { id: 'needs_attention', label: 'Needs attention',  count: needsCount,    countColor: 'var(--sp-red-text)',           always: false },
              { id: 'not_arrived',     label: 'Not arrived',      count: notArrivedCount, countColor: TX,                          always: false },
              { id: 'not_paired',      label: 'Not paired',       count: notPairedCount,  countColor: TX,                          always: false },
              { id: 'ready',           label: 'Ready',            count: readyCount,    countColor: 'var(--sp-green-text)',         always: true  },
            ].filter(f => f.always || f.count > 0).map(f => {
              const isActive = filter === f.id
              const openPanel = f.id === 'not_arrived' ? 'arrivals' : f.id === 'needs_attention' ? 'attention' : f.id === 'not_paired' ? 'not_paired_list' : 'default'
              return (
                <button key={f.id} onClick={() => { setFilter(f.id); setPanel(openPanel); if (panelCollapsed) expandPanel() }}
                  style={{ flex: '1 1 0', minWidth: 0, maxWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 52, padding: '0 14px', borderRadius: 12, border: isActive ? `1px solid ${TX}` : `1px solid ${dark ? BD : '#E0DDD8'}`, background: isActive ? TX : (dark ? SF : '#fff'), fontFamily: 'Inter,system-ui,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 24, lineHeight: 1, color: isActive ? 'var(--sp-inverse-text)' : f.countColor }}>{f.count}</span>
                  <span style={{ fontSize: 12, lineHeight: 1.2, color: isActive ? (dark ? M2 : '#E8E4DF') : MT }}>{f.label}</span>
                </button>
              )
            })}
          </div>

          {/* Model table */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center', columnGap: 10, position: 'sticky', top: 0, background: BG, padding: '8px 0', borderBottom: `1px solid ${DV}` }}>
              {['#', '', 'Model', ...orderedSvcs.map(s => s.charAt(0).toUpperCase() + s.slice(1))].map((h, i) => <Lbl key={i}>{h}</Lbl>)}
            </div>
            {filtered.map(m => {
              const note      = getModelNote(m)
              const chipMap   = { hair: svcChip(m.services.hair, wkActive), makeup: svcChip(m.services.makeup, wkActive), nails: svcChip(m.services.nails, wkActive) }
              const needsPair = m.arrived && !m.services[SVC].assistantId
              return (
                <div key={m.id} onClick={() => setActiveModel(m)} style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center', columnGap: 10, minHeight: 58, borderBottom: `1px solid ${BD}`, cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap' }}>{modelOrderMap[m.id]}</span>
                  <Avatar src={m.avatar} name={m.name} size={36} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: note.red ? 'var(--sp-red-text)' : MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.text}</span>
                  </span>
                  {orderedSvcs.map(svc => {
                    const chip = chipMap[svc]
                    return (svc === SVC && needsPair)
                      ? <button key={svc} onClick={e => { e.stopPropagation(); handlePair(m) }} style={{ justifySelf: 'start', minHeight: 32, padding: '0 12px', borderRadius: 999, border: 0, background: TX, color: 'var(--sp-inverse-text)', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', whiteSpace: 'nowrap', cursor: 'pointer' }}>+ PAIR</button>
                      : <Chip key={svc} c={chip.c} t={chip.t} />
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Landscape panel */}
        {!isPortrait && (
          <>
            <div style={{ width: 1, flexShrink: 0, background: BD }} />
            <aside style={{ width: panelCollapsed ? 72 : 340, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {panelCollapsed ? (
                <CollapsedRail onExpand={expandPanel} onStartWalkthrough={() => setPanel('confirm')} />
              ) : (
                <>
                  {showToggleBar && tbCfg ? (
                    <div style={{ flexShrink: 0, padding: '12px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, background: dark ? BD : '#ECE8E3', borderRadius: 12, padding: 3, display: 'flex', gap: 3 }}>
                        <button
                          onClick={() => setPanel(tbCfg.filterPanel)}
                          style={{ flex: 1, height: 40, borderRadius: 9, border: 0, background: leftTabActive ? (dark ? SF : '#fff') : 'transparent', boxShadow: leftTabActive ? '0 1px 2px rgba(0,0,0,.10)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, fontWeight: leftTabActive ? 600 : 400, color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {tbCfg.label}
                          <span style={{ minWidth: 20, height: 20, borderRadius: 10, padding: '0 6px', background: leftTabActive ? (dark ? '#fff' : '#111') : '#D9D4CE', color: leftTabActive ? (dark ? '#111' : '#fff') : '#111', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{tbCfg.count}</span>
                        </button>
                        <button
                          onClick={() => setPanel('default')}
                          style={{ flex: 1, height: 40, borderRadius: 9, border: 0, background: !leftTabActive ? (dark ? SF : '#fff') : 'transparent', boxShadow: !leftTabActive ? '0 1px 2px rgba(0,0,0,.10)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 13, fontWeight: !leftTabActive ? 600 : 400, color: TX, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Timeline
                        </button>
                      </div>
                      <button onClick={collapsePanel} aria-label="Collapse panel" style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, border: `1px solid ${dark ? BD : '#E0DDD8'}`, background: dark ? SF : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  ) : (
                    <div style={{ flexShrink: 0, padding: '8px 12px 0', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={collapsePanel} aria-label="Collapse panel" style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  )}
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    {(panel === 'pairing' || panel === 'not_paired_list') && (
                      <NotPairedPanel
                        models={models}
                        pairModel={pairModel}
                        pairAssist={pairAssist}
                        assistants={mkAssistants}
                        modelOrderMap={modelOrderMap}
                        onSelectModel={(m) => { setPairModel(m); setPairAssist(null); setPanel('pairing') }}
                        onSelectAssist={setPairAssist}
                        onConfirm={handleConfirmPair}
                        onBack={() => { setPairModel(null); setPairAssist(null); setPanel('not_paired_list') }}
                        dark={dark}
                      />
                    )}
                    {panel === 'compose' && (
                      <ComposePanel msg={composeMsg} onMsg={setComposeMsg} to={composeTo} onTo={setComposeTo} onSend={handleSend} onClose={() => setPanel('default')} />
                    )}
                    {panel === 'arrivals' && (
                      <ArrivalsPanel models={models} recentArrivals={recentArrivals} onArrived={handleArrivedLocal} onOpenRunningLate={(id) => setLateModalId(id)} onPair={handlePair} modelOrderMap={modelOrderMap} dark={dark} />
                    )}
                    {panel === 'to_check' && (
                      <ToCheckPanel toCheckQueue={toCheckQueue} profiles={profiles} onLooksGood={(id) => onLooksGood?.(id)} onOpenTouchup={handleOpenTouchup} onClose={() => setPanel('default')} />
                    )}
                    {panel === 'attention' && (
                      <AttentionPanel models={models} profiles={profiles} modelOrderMap={modelOrderMap} onOpenModel={setActiveModel} dark={dark} />
                    )}
                    {(panel === 'default' || panel === 'confirm') && (
                      wkActive ? (
                        <WalkthroughPanel elapsed={wkElapsed} startedAt={wkStartedAt} announcements={announcements} onModelsBack={handleModelsBack} onCompose={() => setPanel('compose')} />
                      ) : (
                        <DefaultPanel tlItems={tlItems} announcements={announcements} onStartWalkthrough={() => setPanel('confirm')} onCompose={() => setPanel('compose')} />
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

        {/* Pair toast */}
        {pairToast && (
          <div role="status" style={{ position: 'absolute', left: 24, bottom: 24, right: effectivePanelW + 14, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 12px 12px 18px', borderRadius: 12, background: '#111', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,.18)', zIndex: 50, pointerEvents: 'auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CC4A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14 }}>{pairToast.modelName} is paired with {pairToast.assistantName}</span>
              <span style={{ fontSize: 12, color: '#CFCAC4' }}>{pairToast.assistantName.split(' ')[0]} was notified with {pairToast.modelName.split(' ')[0]}&apos;s look and where to find them</span>
            </span>
            <button onClick={handleUndoPair} style={{ minHeight: 44, padding: '0 16px', borderRadius: 8, border: '1px solid #4A4743', background: 'transparent', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>UNDO</button>
          </div>
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

        {/* Model modal */}
        {activeModel && (
          <ModelModal
            model={models.find(m => m.id === activeModel.id) || activeModel}
            profiles={profiles}
            modelOrderMap={modelOrderMap}
            onClose={() => setActiveModel(null)}
            svc={SVC}
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
