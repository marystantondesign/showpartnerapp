import { useState, useEffect } from 'react'

// Mock data — matches Fix-MobileSheet design source
const TOTAL = 30
const READY = 8
const NOT_ARRIVED = 3
const TEAMS = [
  { name: 'Hair',   done: 14, inProg: 9,  paused: 2 },
  { name: 'Makeup', done: 17, inProg: 8,  paused: 0 },
  { name: 'Nails',  done: 9,  inProg: 6,  paused: 0 },
]
const NEXT_UP = [
  { label: 'Walkthrough', time: '4:00 PM', bold: true },
  { label: 'Dressing',    time: '5:00 PM', bold: false },
  { label: 'Show',        time: '6:00 PM', bold: false },
]
// Show wraps at 7:30 PM; before then the page is live
const SHOW_H = 18   // 6 PM
const WRAP_H = 19
const WRAP_M = 30

const CIRC = 2 * Math.PI * 78  // ≈ 490.09

function ringDash(n, total) {
  const len = (n / total) * CIRC
  return `${len.toFixed(1)} ${CIRC.toFixed(1)}`
}

function fmtNow() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function getCountdown() {
  const now = new Date()
  const show = new Date(now)
  show.setHours(SHOW_H, 0, 0, 0)
  const diff = show - now
  if (diff <= 0) return 'Now'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function getIsEnded() {
  const now = new Date()
  return now.getHours() > WRAP_H || (now.getHours() === WRAP_H && now.getMinutes() >= WRAP_M)
}

const LBL = { fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64', fontFamily: 'Inter, system-ui, sans-serif', margin: 0 }
const STATUS_C = { done: '#7A9E7E', inProg: '#D4A853', paused: '#8A9BB0', notStarted: '#E8E4DF' }

export default function StatusLinkView() {
  const [updatedAt, setUpdatedAt] = useState(fmtNow)
  const [ended, setEnded]         = useState(getIsEnded)

  useEffect(() => {
    const id = setInterval(() => {
      setEnded(getIsEnded())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  function handleRefresh() {
    setUpdatedAt(fmtNow())
  }

  if (ended) {
    return (
      <div style={{ minHeight: '100dvh', background: '#F5F2EE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={LBL}>Show Partner · backstage beauty</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#111', margin: '14px 0 10px', textAlign: 'center' }}>Reymont SS26</p>
        <p style={{ fontSize: 14, color: '#4A4743', textAlign: 'center', lineHeight: 1.5 }}>This show has ended.</p>
      </div>
    )
  }

  const readyPct = Math.round((READY / TOTAL) * 100)
  const dash = ringDash(READY, TOTAL)
  const countdown = getCountdown()

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Header */}
        <p style={{ ...LBL, marginBottom: 6 }}>Show Partner · backstage beauty</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 32, margin: '0 0 10px', lineHeight: 1.1 }}>Reymont SS26</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5E8A63', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#4A4743' }}>Live · updated {updatedAt}</span>
          <button
            onClick={handleRefresh}
            style={{ marginLeft: 'auto', height: 36, padding: '0 14px', border: '1px solid #CFCAC4', borderRadius: 999, background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#111', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>

        {/* Ring card */}
        <div style={{ background: '#fff', border: '1px solid #E0DDD8', borderRadius: 18, padding: '24px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* SVG ring */}
            <svg width="150" height="150" viewBox="0 0 180 180" aria-label={`${readyPct}% fully ready`}>
              <circle cx="90" cy="90" r="78" fill="none" stroke="#E8E4DF" strokeWidth="14" />
              <circle
                cx="90" cy="90" r="78"
                fill="none"
                stroke="#7A9E7E"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={dash}
                transform="rotate(-90 90 90)"
              />
              <text x="90" y="83" textAnchor="middle" fontFamily="Georgia, serif" fontSize="40" fill="#111">{readyPct}%</text>
              <text x="90" y="101" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill="#4A4743">fully ready</text>
            </svg>

            {/* Stats */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={LBL}>Ready</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, margin: '2px 0 0', color: '#111' }}>{READY} of {TOTAL}</p>
              </div>
              <div>
                <p style={LBL}>Show in</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, margin: '2px 0 0', color: '#111' }}>{countdown}</p>
              </div>
              <div>
                <p style={LBL}>Not arrived</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, margin: '2px 0 0', color: '#111' }}>{NOT_ARRIVED}</p>
              </div>
            </div>
          </div>
        </div>

        {/* By team */}
        <div style={{ background: '#fff', border: '1px solid #E0DDD8', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
          <p style={{ ...LBL, marginBottom: 14 }}>By team</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TEAMS.map(({ name, done, inProg, paused }) => {
              const notStarted = TOTAL - done - inProg - paused
              const pct = n => `${(n / TOTAL * 100).toFixed(0)}%`
              return (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: 12, color: '#4A4743' }}>{done} of {TOTAL} done</span>
                  </div>
                  {/* Stacked bar */}
                  <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: '#E8E4DF', gap: 2 }}>
                    {done > 0      && <span style={{ width: pct(done),      background: STATUS_C.done,       borderRadius: 5 }} />}
                    {inProg > 0    && <span style={{ width: pct(inProg),    background: STATUS_C.inProg,     borderRadius: 5 }} />}
                    {paused > 0    && <span style={{ width: pct(paused),    background: STATUS_C.paused,     borderRadius: 5 }} />}
                    {notStarted > 0 && <span style={{ width: pct(notStarted), background: STATUS_C.notStarted, borderRadius: 5 }} />}
                  </div>
                  <p style={{ fontSize: 11, color: '#4A4743', margin: '5px 0 0' }}>
                    {inProg} in progress{paused > 0 ? ` · ${paused} paused` : ''} · {notStarted} not started
                  </p>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', marginTop: 16, paddingTop: 14, borderTop: '1px solid #E0DDD8' }}>
            {[['Done', STATUS_C.done], ['In progress', STATUS_C.inProg], ['Paused', STATUS_C.paused], ['Not started', '#CFCAC4']].map(([lbl, bg]) => (
              <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4A4743' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: bg, flexShrink: 0 }} />
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Next up */}
        <div style={{ background: '#fff', border: '1px solid #E0DDD8', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
          <p style={{ ...LBL, marginBottom: 10 }}>Next up</p>
          {NEXT_UP.map(({ label, time, bold }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, borderBottom: '1px solid #E0DDD8' }}>
              <span style={{ fontSize: 13, fontWeight: bold ? 600 : 400 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#4A4743' }}>{time}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ fontSize: 11, color: '#4A4743', lineHeight: 1.6, marginTop: 8 }}>
          Shared by Jen P., Makeup Producer. This link stops working when the show ends.
        </p>
      </div>
    </div>
  )
}
