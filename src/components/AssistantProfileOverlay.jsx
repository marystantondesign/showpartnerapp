import { useState } from 'react'

const RATINGS_KEY = 'showpartner_ratings_v1'

function loadRating(leadId, assistantId) {
  try {
    const data = JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}')
    return data[`${leadId}_${assistantId}`] || null
  } catch { return null }
}

function storeRating(leadId, assistantId, rating) {
  try {
    const data = JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}')
    data[`${leadId}_${assistantId}`] = rating
    localStorage.setItem(RATINGS_KEY, JSON.stringify(data))
  } catch {}
}

function parseTimeMins(timeStr) {
  if (!timeStr) return 0
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function addMinsToTime(timeStr, mins) {
  const total = parseTimeMins(timeStr) + mins
  const h24 = Math.floor(total / 60) % 24
  const m = total % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

function modelTimeStr(svc, now) {
  if (!svc) return ''
  if (svc.status === 'done' && svc.startedAt && svc.elapsedMins) {
    const endTime = addMinsToTime(svc.startedAt, svc.elapsedMins)
    return `${svc.startedAt} to ${endTime} · ${svc.elapsedMins} min`
  }
  if (svc.status === 'in_progress' && svc.startedAt) {
    const startMins = parseTimeMins(svc.startedAt)
    const nowMins = now.getHours() * 60 + now.getMinutes()
    const elapsed = Math.max(1, nowMins - startMins)
    return `Started ${svc.startedAt} · ${elapsed} min so far`
  }
  return ''
}

function modelChip(svc) {
  if (!svc) return { c: '#E0DDD8', t: 'Not started' }
  return (
    { in_progress: { c: '#D4A853', t: 'In progress' },
      paused:      { c: '#8A9BB0', t: 'Paused'      },
      done:        { c: '#7A9E7E', t: 'Done'         },
    }[svc.status] || { c: '#E0DDD8', t: 'Not started' }
  )
}

function StarIcon({ filled, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ width: 36, height: 36, padding: 3, border: 0, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-label={filled ? 'Remove star' : 'Add star'}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill={filled ? '#C9A24A' : 'none'} stroke={filled ? '#C9A24A' : '#CFCAC4'} strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
      </svg>
    </button>
  )
}

export default function AssistantProfileOverlay({ person, currentProfile, profiles, models, onClose }) {
  if (!person) return null

  const specialty = person.specialty || 'makeup'
  const producerName = profiles?.find(p => p.role === 'lead')?.name?.split(' ')[0] || 'the producer'
  const showCount = person.showCount || 1
  const agency = 'Art Partner'

  const saved = loadRating(currentProfile.id, person.id)
  const [stars, setStars] = useState(saved?.stars ?? 0)
  const [note, setNote] = useState(saved?.note ?? '')
  const [inviteBack, setInviteBack] = useState(saved?.inviteBack ?? false)

  const now = new Date()

  const workedModels = (models || []).filter(m => {
    const svc = m.services?.[specialty]
    return svc?.assistantId === person.id && ['done', 'in_progress', 'paused'].includes(svc?.status)
  })

  const doneModels = workedModels.filter(m => m.services?.[specialty]?.status === 'done')
  const modelsToday = workedModels.length
  const avgTime = doneModels.length > 0
    ? Math.round(doneModels.reduce((sum, m) => sum + (m.services[specialty].elapsedMins || 0), 0) / doneModels.length)
    : 0
  const avgTimeStr = avgTime > 0 ? (avgTime >= 60 ? `${Math.floor(avgTime / 60)}h ${avgTime % 60}m` : `${avgTime}m`) : '--'

  function handleSave() {
    storeRating(currentProfile.id, person.id, { stars, note, inviteBack })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #E0DDD8' }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -10, cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>{person.name}</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Person block */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {person.avatar
            ? <img src={person.avatar} alt={person.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E0DDD8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#6E6A64' }}>
                {person.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
          }
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>{person.name}</span>
            <span style={{ fontSize: 13, color: '#4A4743' }}>
              {specialty.charAt(0).toUpperCase() + specialty.slice(1)} assistant{person.station ? ` · ${person.station}` : ''}
            </span>
            <span style={{ fontSize: 13, color: '#4A4743' }}>{showCount === 1 ? '1st' : showCount === 2 ? '2nd' : showCount === 3 ? '3rd' : `${showCount}th`} show with {agency}</span>
          </div>
        </div>

        {/* PING / TEXT / CALL */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 10, border: '1px solid #CFCAC4', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', color: '#111', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            </svg>
            PING
          </button>
          <a href="sms:" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 10, border: '1px solid #CFCAC4', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', color: '#111', cursor: 'pointer', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
            TEXT
          </a>
          <a href="tel:" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 10, border: '1px solid #CFCAC4', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', color: '#111', cursor: 'pointer', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
            CALL
          </a>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: 12, borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>{modelsToday}</span>
            <span style={{ fontSize: 11, color: '#4A4743' }}>Models today</span>
          </div>
          <div style={{ flex: 1, padding: 12, borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>{avgTimeStr}</span>
            <span style={{ fontSize: 11, color: '#4A4743' }}>Avg time</span>
          </div>
          <div style={{ flex: 1, padding: 12, borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>0</span>
            <span style={{ fontSize: 11, color: '#4A4743' }}>Touch-ups</span>
          </div>
        </div>

        {/* Your rating */}
        <div style={{ padding: 14, borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>Your rating</span>
            <span style={{ fontSize: 12, color: '#4A4743' }}>Private. The producer and agent see it after the show.</span>
          </span>
          <div style={{ display: 'flex', gap: 2, marginLeft: -3 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <StarIcon key={n} filled={n <= stars} onClick={() => setStars(n === stars ? 0 : n)} />
            ))}
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            style={{ height: 76, padding: '10px 12px', border: '1px solid #CFCAC4', borderRadius: 10, background: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.4, resize: 'none', outline: 'none', color: '#111', width: '100%', boxSizing: 'border-box' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#EEF3EE', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={inviteBack}
              onChange={e => setInviteBack(e.target.checked)}
              style={{ width: 22, height: 22, margin: 0, accentColor: '#3F6B45', cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Recommend inviting back</span>
              <span style={{ fontSize: 12, color: '#4A4743' }}>Shared with {producerName} and the agent when the show wraps</span>
            </span>
          </label>
        </div>

        {/* TODAY'S MODELS */}
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Today's models</p>
          {workedModels.length === 0 && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#4A4743' }}>No models yet today.</p>
          )}
          {workedModels.map(m => {
            const svc = m.services?.[specialty]
            const chip = modelChip(svc)
            const timeStr = modelTimeStr(svc, now)
            const modelNum = m.id.replace('m', '').padStart(2, '0')
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, borderBottom: '1px solid #E0DDD8' }}>
                {m.avatar
                  ? <img src={m.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E0DDD8', flexShrink: 0 }} />
                }
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14 }}>{m.name} · Look {modelNum}</span>
                  {timeStr && <span style={{ fontSize: 12, color: '#4A4743' }}>{timeStr}</span>}
                </span>
                <span style={{ padding: '4px 9px', borderRadius: 999, background: chip.c, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#111', flexShrink: 0 }}>{chip.t}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ flexShrink: 0, padding: '12px 16px 18px', borderTop: '1px solid #E0DDD8' }}>
        <button
          onClick={handleSave}
          style={{ width: '100%', minHeight: 54, borderRadius: 10, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.14em', cursor: 'pointer' }}
        >
          SAVE RATING
        </button>
      </div>
    </div>
  )
}
