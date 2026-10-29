import { useState, Fragment } from 'react'

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function svcChip(svc) {
  if (!svc) return { c: '#E0DDD8', t: 'Not started' }
  return (
    { in_progress: { c: '#D4A853', t: 'In progress' },
      paused:      { c: '#8A9BB0', t: 'Paused'      },
      done:        { c: '#7A9E7E', t: 'Done'         },
      not_started: { c: '#E0DDD8', t: 'Not started'  },
    }[svc.status] || { c: '#E0DDD8', t: 'Not started' }
  )
}

function parseTimeMins(timeStr) {
  if (!timeStr) return 0
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function offsetTime(timeStr, deltaMins) {
  const totalMins = parseTimeMins(timeStr) + deltaMins
  if (totalMins < 0) return timeStr
  const h24 = Math.floor(totalMins / 60) % 24
  const m = totalMins % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

function fmtNoteTime(createdAt) {
  if (!createdAt) return ''
  try {
    const d = new Date(createdAt)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch { return '' }
}

function buildTodayEvents(model, currentProfile, profiles) {
  const specialty = currentProfile?.specialty || 'makeup'
  const events = []

  if (model.arrivedAt) {
    events.push({ time: model.arrivedAt, label: 'Arrived', mins: parseTimeMins(model.arrivedAt) })
  }

  const mySvc = model.services?.[specialty]
  if (mySvc?.assistantId === currentProfile?.id && mySvc?.startedAt) {
    const pairMins = parseTimeMins(mySvc.startedAt) - 3
    events.push({ time: offsetTime(mySvc.startedAt, -3), label: 'Paired with you', mins: pairMins })
  }

  for (const d of ['hair', 'makeup', 'nails']) {
    const dsvc = model.services?.[d]
    if (!dsvc?.startedAt) continue
    const isMe = dsvc.assistantId === currentProfile?.id
    const dLabel = d.charAt(0).toUpperCase() + d.slice(1)
    const assistName = dsvc.assistantId ? profiles?.find(p => p.id === dsvc.assistantId)?.name?.split(' ')[0] : null
    const label = isMe
      ? `You started ${d}`
      : `${dLabel} started${assistName ? ` · ${assistName}` : ''}`
    events.push({ time: dsvc.startedAt, label, mins: parseTimeMins(dsvc.startedAt) })
  }

  events.sort((a, b) => b.mins - a.mins)
  return events
}

export default function ModelProfileOverlay({ model, currentProfile, profiles, onClose, onNote }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  if (!model) return null

  const specialty = currentProfile?.specialty || 'makeup'
  const specialtyLabel = specialty.charAt(0).toUpperCase() + specialty.slice(1)
  const svc = model.services?.[specialty]
  const chipBase = svcChip(svc)
  const chip = {
    c: chipBase.c,
    t: svc?.status === 'in_progress' ? `${specialtyLabel} in progress`
      : svc?.status === 'paused' ? `${specialtyLabel} paused`
      : svc?.status === 'done' ? `${specialtyLabel} done`
      : 'Not started',
  }

  const modelNum = model.id.replace('m', '').padStart(2, '0')
  const myStation = currentProfile?.station || ''

  const allNotes = model.notes || []
  const allergyNotes = allNotes.filter(n => n.isAllergy)
  const otherNotes = allNotes.filter(n => !n.isAllergy)
  const hasNotes = allergyNotes.length > 0 || otherNotes.length > 0

  const otherServices = ['hair', 'makeup', 'nails'].filter(s => s !== specialty)
  const todayEvents = buildTodayEvents(model, currentProfile, profiles || [])

  function handleAddNote() {
    const text = noteText.trim()
    if (!text) return
    const newNote = {
      id: `note-${Date.now()}`,
      text,
      isAllergy: false,
      authorId: currentProfile.id,
      authorName: currentProfile.name,
      authorRole: currentProfile.role,
      createdAt: new Date().toISOString(),
    }
    onNote?.(model.id, [...allNotes, newNote])
    setNoteText('')
    setNoteOpen(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #E0DDD8' }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -10, cursor: 'pointer' }}>
          <ChevronLeft />
        </button>
        <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>{model.name}</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Model block */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {model.avatar
            ? <img src={model.avatar} alt={model.name} style={{ width: 104, height: 132, borderRadius: 12, objectFit: 'cover', objectPosition: '50% 25%', flexShrink: 0 }} />
            : <div style={{ width: 104, height: 132, borderRadius: 12, background: '#E0DDD8', flexShrink: 0 }} />
          }
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 26, lineHeight: 1.1 }}>{model.name}</span>
            <span style={{ fontSize: 13, color: '#4A4743' }}>#{modelNum} · Look {model.look} · {myStation}</span>
            <span style={{ fontSize: 13, color: '#4A4743' }}>Arrived {model.arrivedAt}</span>
            <span style={{ alignSelf: 'flex-start', marginTop: 4, padding: '4px 9px', borderRadius: 999, background: chip.c, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#111' }}>
              {chip.t}
            </span>
          </div>
        </div>

        {/* KNOW BEFORE YOU START */}
        {hasNotes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Know before you start</p>
            {allergyNotes.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: '#F8E9E5' }}>
                <b style={{ color: '#A33D28', fontSize: 11, letterSpacing: '.08em', paddingTop: 2, flexShrink: 0 }}>ALLERGY</b>
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>{n.text}</span>
              </div>
            ))}
            {otherNotes.map(n => (
              <div key={n.id} style={{ padding: '12px 14px', borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8', fontSize: 14, lineHeight: 1.45 }}>
                {n.text}
                <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: '#4A4743' }}>
                  Note from {n.authorName} · {fmtNoteTime(n.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Look row */}
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, border: '1px solid #E0DDD8', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'left', color: '#111', cursor: 'pointer' }}>
          {model.avatar
            ? <img src={model.avatar} alt="" style={{ width: 48, height: 60, borderRadius: 8, objectFit: 'cover', objectPosition: '50% 25%', flexShrink: 0 }} />
            : <div style={{ width: 48, height: 60, borderRadius: 8, background: '#E0DDD8', flexShrink: 0 }} />
          }
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>Look {model.look}</span>
            <span style={{ fontSize: 12, color: '#4A4743' }}>Steps, products and photos</span>
          </span>
          <ChevronRight />
        </button>

        {/* OTHER SERVICES */}
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Other services</p>
          {otherServices.map(s => {
            const osvc = model.services?.[s]
            const oChip = svcChip(osvc)
            const assistId = osvc?.assistantId
            const assistName = assistId ? (profiles?.find(p => p.id === assistId)?.name || '') : ''
            const sLabel = s.charAt(0).toUpperCase() + s.slice(1)
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, borderBottom: '1px solid #E0DDD8' }}>
                <span style={{ flex: 1, fontSize: 14 }}>{sLabel}</span>
                {assistName && <span style={{ fontSize: 12, color: '#4A4743' }}>{assistName}</span>}
                <span style={{ padding: '4px 9px', borderRadius: 999, background: oChip.c, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#111' }}>{oChip.t}</span>
              </div>
            )
          })}
        </div>

        {/* TODAY */}
        {todayEvents.length > 0 && (
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Today</p>
            <div style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)' }}>
              {todayEvents.map((ev, i) => (
                <Fragment key={i}>
                  <span style={{ fontSize: 13, color: '#4A4743', padding: '7px 0' }}>{ev.time}</span>
                  <span style={{ fontSize: 13, padding: '7px 0' }}>{ev.label}</span>
                </Fragment>
              ))}
            </div>
          </div>
        )}

        {/* + ADD A NOTE */}
        {noteOpen ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              autoFocus
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note visible to the producer and lead assistants..."
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #CFCAC4', borderRadius: 10, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.45, resize: 'none', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAddNote} style={{ flex: 1, height: 44, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer' }}>SAVE NOTE</button>
              <button onClick={() => { setNoteOpen(false); setNoteText('') }} style={{ height: 44, padding: '0 16px', borderRadius: 8, border: '1px solid #CFCAC4', background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#111', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNoteOpen(true)}
            style={{ minHeight: 48, borderRadius: 10, border: '1px solid #CFCAC4', background: '#fff', width: '100%', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', color: '#111', cursor: 'pointer' }}
          >
            + ADD A NOTE
          </button>
        )}
      </div>
    </div>
  )
}
