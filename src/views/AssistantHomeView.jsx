import { useState, useEffect } from 'react'

const BG = '#F5F2EE', BD = '#E0DDD8', TX = '#111', MT = '#4A4743', M2 = '#6E6A64', DV = '#CFCAC4'

const CHIP_STATUS = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: '#E8E4DF', t: 'Not started' },
  to_check:    { c: '#DCE8DD', t: 'To check'    },
}

function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false)
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (err || !src) {
    return (
      <span style={{
        width: size, height: size, borderRadius: size > 48 ? 12 : '50%',
        background: '#E0DDD8', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
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
      style={{ width: size, height: size, borderRadius: size > 48 ? 12 : '50%', objectFit: 'cover', flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  )
}

function Chip({ c, t }) {
  return (
    <span style={{
      fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600,
      letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999,
      padding: '4px 8px', color: TX, background: c, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {t}
    </span>
  )
}

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

function calcElapsed(startedAtStr) {
  if (!startedAtStr) return 0
  const parts = startedAtStr.split(' ')
  if (parts.length < 2) return 0
  const [time, period] = parts
  const [h, m] = time.split(':').map(Number)
  let hours = h
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  const startMs = hours * 3600000 + m * 60000
  const now = new Date()
  const nowMs = now.getHours() * 3600000 + now.getMinutes() * 60000
  return Math.max(0, Math.floor((nowMs - startMs) / 60000))
}

function doneTime(startedAt, elapsedMins) {
  if (!startedAt || !elapsedMins) return null
  const parts = startedAt.split(' ')
  if (parts.length < 2) return null
  const [time, period] = parts
  const [h, m] = time.split(':').map(Number)
  let hours = h
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  const totalMins = hours * 60 + m + elapsedMins
  const dh = Math.floor(totalMins / 60) % 24
  const dm = totalMins % 60
  const dh12 = dh > 12 ? dh - 12 : dh === 0 ? 12 : dh
  return `${dh12}:${dm.toString().padStart(2, '0')}`
}

export default function AssistantHomeView({
  currentProfile,
  models, setModels,
  walkthroughPhase,
  announcements,
  onAckAnnouncement,
  leadChecks,
  onLeadCheck, onClaimCheck, onEscalateCheck,
  onToast,
  profiles,
  timeline,
  toCheckQueue,
  touchupNotes,
  onMarkDoneToCheck,
  onLooksGood,
  onSendTouchup,
}) {
  const specialty = currentProfile.specialty
  const profileId = currentProfile.id
  const isLeadAssistant = currentProfile.role === 'lead_assistant'
  const wkActive = walkthroughPhase === 'in_progress'

  const specialtyLabel = specialty ? (specialty.charAt(0).toUpperCase() + specialty.slice(1)) : ''

  const activeModel = models.find(m =>
    m.services[specialty]?.assistantId === profileId &&
    ['in_progress', 'paused'].includes(m.services[specialty]?.status)
  )
  const doneModels = models.filter(m =>
    m.services[specialty]?.assistantId === profileId &&
    m.services[specialty]?.status === 'done'
  )

  const svc = activeModel?.services[specialty]
  const startedAt = svc?.startedAt || null

  const [elapsed, setElapsed] = useState(() =>
    svc?.elapsedMins != null ? svc.elapsedMins : calcElapsed(startedAt)
  )

  useEffect(() => {
    if (!activeModel || wkActive) return
    const iv = setInterval(() => setElapsed(calcElapsed(startedAt)), 30000)
    return () => clearInterval(iv)
  }, [activeModel?.id, startedAt, wkActive])

  useEffect(() => {
    if (activeModel) {
      setElapsed(svc?.elapsedMins != null ? svc.elapsedMins : calcElapsed(startedAt))
    }
  }, [activeModel?.id])

  // These must live at top level — Rules of Hooks forbids useState inside conditionals
  const [touchupCheckId, setTouchupCheckId] = useState(null)
  const [touchupAreas, setTouchupAreas] = useState([])
  const [touchupNote, setTouchupNote] = useState('')

  const latestAnn = announcements?.[0] || null
  const showWarning = !wkActive && latestAnn &&
    latestAnn.text.toLowerCase().includes('walkthrough') &&
    !latestAnn.ackedBy?.includes(profileId)

  const producerProfile = profiles?.find(p => p.role === 'lead')
  const producerFirstName = producerProfile?.name?.split(' ')[0] || 'Jen'

  const artistProfile = profiles?.find(p => p.role === 'artist' && p.specialty === specialty)
  const artistFirstName = artistProfile?.name?.split(' ')[0] || null

  const showEntry = timeline?.find(t => t.id === 'show') || { time: '6:00 PM' }
  const walkthroughEntry = timeline?.find(t => t.id === 'walkthrough') || { time: '4:00 PM' }

  function svcChip(entry) {
    if (!entry) return CHIP_STATUS.not_started
    if (wkActive && entry.status === 'in_progress') return CHIP_STATUS.paused
    return CHIP_STATUS[entry.status] || CHIP_STATUS.not_started
  }

  function handleMarkDone() {
    if (!activeModel) return
    const firstName = activeModel.name.split(' ')[0]
    setModels(prev => prev.map(m =>
      m.id === activeModel.id
        ? { ...m, services: { ...m.services, [specialty]: { ...m.services[specialty], status: 'to_check', elapsedMins: elapsed } } }
        : m
    ))
    onMarkDoneToCheck?.(activeModel.id, elapsed, specialty)
    onToast?.(`${firstName} ready to check`)
  }

  function handlePause() {
    if (!activeModel) return
    setModels(prev => prev.map(m =>
      m.id === activeModel.id
        ? { ...m, services: { ...m.services, [specialty]: { ...m.services[specialty], status: 'paused', elapsedMins: elapsed } } }
        : m
    ))
  }

  function handleResume() {
    if (!activeModel) return
    setModels(prev => prev.map(m =>
      m.id === activeModel.id
        ? { ...m, services: { ...m.services, [specialty]: { ...m.services[specialty], status: 'in_progress' } } }
        : m
    ))
  }

  function handleLeadCheckRequest() {
    if (!activeModel) return
    onLeadCheck?.(activeModel.id, elapsed, activeModel.look, activeModel.name, specialty)
    onToast?.('Lead check requested')
  }

  // ── Lead Assistant View ───────────────────────────────────────────────────────
  if (isLeadAssistant) {
    const myChecks = (leadChecks || []).filter(c => c.claimedBy === null && c.specialty === specialty)
    const otherChecks = (leadChecks || []).filter(c => c.claimedBy !== null && c.claimedBy !== profileId && c.specialty === specialty)
    const myModel = models.find(m =>
      m.services[specialty]?.assistantId === profileId &&
      m.services[specialty]?.status === 'in_progress'
    )
    const pendingChecks = (toCheckQueue || []).filter(c => c.specialty === specialty)

    const touchupTarget = touchupCheckId ? pendingChecks.find(c => c.id === touchupCheckId) : null
    const WHERE_OPTIONS_LA = ['Eyes', 'Brows', 'Skin', 'Lips', 'Other']

    function sendTouchupLA() {
      if (!touchupCheckId) return
      onSendTouchup?.(touchupCheckId, touchupAreas, touchupNote)
      setTouchupCheckId(null); setTouchupAreas([]); setTouchupNote('')
    }

    return (
      <div style={{ flex: 1, overflowY: 'auto', background: BG, padding: '0 16px 24px' }}>
        <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* D4: Ready to check section */}
          {pendingChecks.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>Ready to check</div>
                <Lbl>{pendingChecks.length} waiting</Lbl>
              </div>
              {pendingChecks.map(check => (
                <div key={check.id} style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Avatar src={check.modelAvatar} name={check.modelName} size={56} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{check.assistantName.split(' ')[0]} · {check.modelName}</div>
                      <div style={{ fontSize: 12, color: MT }}>Look {check.modelLook} · done {check.doneAt}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      onClick={() => onLooksGood?.(check.id)}
                      style={{ minHeight: 48, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}
                    >
                      LOOKS GOOD
                    </button>
                    <button
                      onClick={() => { setTouchupCheckId(check.id); setTouchupAreas([]); setTouchupNote('') }}
                      style={{ minHeight: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
                    >
                      TOUCH-UP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Incoming lead check cards */}
          {myChecks.map(check => (
            <div key={check.id} style={{ background: '#fff', border: `1.5px solid ${TX}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <Lbl style={{ color: TX }}>Lead check · {check.createdAt}</Lbl>
                <Lbl>Lead assistants</Lbl>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar src={check.modelAvatar} name={check.modelName} size={64} />
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, marginBottom: 4 }}>
                    {check.assistantFirstName} · {check.modelName}
                  </div>
                  <div style={{ fontSize: 12, color: MT }}>
                    Look {check.modelLook} · {check.specialty} {check.elapsedMins} min
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => onClaimCheck?.(check.id)}
                  style={{ minHeight: 52, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: 'pointer' }}
                >
                  I'LL GO
                </button>
                {artistFirstName && (
                  <button
                    onClick={() => onEscalateCheck?.(check.id, artistProfile?.id)}
                    style={{ minHeight: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
                  >
                    ASK {artistFirstName.toUpperCase()} FOR A SECOND OPINION
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* No checks empty state */}
          {myChecks.length === 0 && otherChecks.length === 0 && (
            <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: '28px 20px' }}>
              <Lbl style={{ marginBottom: 10 }}>Lead checks</Lbl>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: M2 }}>No checks yet</div>
            </div>
          )}

          {/* Other checks */}
          {otherChecks.length > 0 && (
            <div>
              <Lbl style={{ marginBottom: 10 }}>Other checks</Lbl>
              {otherChecks.map(check => {
                const claimer = profiles?.find(p => p.id === check.claimedBy)
                const claimerFirst = claimer?.name?.split(' ')[0] || ''
                return (
                  <div key={check.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                    <Avatar src={check.modelAvatar} name={check.modelName} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13 }}>{check.assistantFirstName} · {check.modelName}</div>
                      <div style={{ fontSize: 11, color: MT }}>{claimerFirst} is going · {check.createdAt}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Your model */}
          {myModel && (
            <div>
              <Lbl style={{ marginBottom: 10 }}>Your model</Lbl>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar src={myModel.avatar} name={myModel.name} size={36} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
                  Look {myModel.look} · {myModel.name}
                </div>
                <Chip c='#D4A853' t='In progress' />
              </div>
            </div>
          )}
        </div>

        {/* D2/D3 touch-up sheet for lead assistant */}
        {touchupTarget && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 40 }}>
            <div style={{ width: '100%', background: BG, borderRadius: '16px 16px 0 0', paddingBottom: 32 }}>
              <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 44, height: 5, borderRadius: 3, background: DV }} />
              </div>
              <div style={{ padding: '0 20px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar src={touchupTarget.modelAvatar} name={touchupTarget.modelName} size={40} />
                <div style={{ flex: 1 }}>
                  <Lbl>Back to {touchupTarget.assistantName.split(' ')[0]}</Lbl>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>Touch-up for {touchupTarget.modelName.split(' ')[0]}</div>
                </div>
                <button onClick={() => setTouchupCheckId(null)} style={{ border: 0, background: 'none', fontSize: 18, color: M2, cursor: 'pointer', lineHeight: 1, padding: 4 }}>×</button>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Lbl style={{ marginBottom: 8 }}>Where</Lbl>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {WHERE_OPTIONS_LA.map(a => (
                      <button key={a} onClick={() => setTouchupAreas(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])} style={{ height: 36, padding: '0 16px', borderRadius: 999, border: touchupAreas.includes(a) ? 0 : `1px solid ${DV}`, background: touchupAreas.includes(a) ? TX : 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: touchupAreas.includes(a) ? '#fff' : TX, cursor: 'pointer' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Lbl style={{ marginBottom: 8 }}>What to fix</Lbl>
                  <input value={touchupNote} onChange={e => setTouchupNote(e.target.value)} placeholder="Describe what needs adjusting" style={{ width: '100%', boxSizing: 'border-box', height: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15, padding: '0 14px', color: TX, outline: 'none' }} />
                </div>
                <button onClick={sendTouchupLA} disabled={touchupAreas.length === 0 && !touchupNote.trim()} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: (touchupAreas.length > 0 || touchupNote.trim()) ? TX : DV, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: (touchupAreas.length > 0 || touchupNote.trim()) ? 'pointer' : 'default' }}>
                  SEND TO {touchupTarget.assistantName.split(' ')[0].toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Assistant — walkthrough in progress ──────────────────────────────────────
  if (wkActive) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: BG, padding: '0 16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 10px' }}>
          <span style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: TX, fontWeight: 600 }}>{specialtyLabel}</span>
          <span style={{ fontSize: 12, color: MT }}>Show {showEntry.time}</span>
        </div>

        {/* Dark walkthrough card */}
        <div style={{ background: TX, color: '#F5F2EE', borderRadius: 14, padding: '22px 20px', marginBottom: 14 }}>
          <Lbl style={{ color: '#C9C4BE', marginBottom: 6 }}>Walkthrough · started {walkthroughEntry.time}</Lbl>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, lineHeight: 1.2, marginBottom: 8 }}>
            Models are at the walkthrough
          </div>
          <div style={{ fontSize: 13, color: '#E0DDD8' }}>Enjoy your break! Hit up craft services, mama!</div>
        </div>

        {/* Model paused card */}
        {activeModel && (
          <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar src={activeModel.avatar} name={activeModel.name} size={56} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Lbl style={{ marginBottom: 4 }}>Your model · Look {activeModel.look}</Lbl>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, marginBottom: 6 }}>{activeModel.name}</div>
                <Chip c='#8A9BB0' t={`Paused at ${elapsed} min`} />
              </div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, color: MT, marginBottom: 16, lineHeight: 1.5 }}>
          {specialtyLabel} picks back up here when {producerFirstName} marks the models back.
        </div>

        {/* Coming up */}
        <Lbl style={{ marginBottom: 10 }}>Coming up</Lbl>
        {(timeline || []).filter(t => ['models_back', 'dressing', 'show'].includes(t.id)).map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BD}` }}>
            <span style={{ fontSize: 13 }}>{t.label}</span>
            <span style={{ fontSize: 13, color: MT }}>~{t.time}</span>
          </div>
        ))}
      </div>
    )
  }

  // ── Assistant — normal (waiting or working on) ────────────────────────────────
  return (
    <div style={{ position: 'relative', flex: 1, overflowY: 'auto', background: BG, padding: '0 16px 24px' }}>

      {/* Walkthrough warning overlay */}
      {showWarning && (
        <div style={{ position: 'absolute', left: 12, right: 12, top: 12, zIndex: 10 }}>
          <div style={{
            background: TX, color: '#F5F2EE', borderRadius: 16, padding: 20,
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: 12, color: '#C9C4BE', marginBottom: 10 }}>
              {producerProfile?.name} · to all assistants · {latestAnn.sentAt}
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, lineHeight: 1.2, marginBottom: 8 }}>
              {latestAnn.text}
            </div>
            <div style={{ fontSize: 13, color: '#E0DDD8', marginBottom: 16, lineHeight: 1.5 }}>
              At {walkthroughEntry.time}, the work must pause for the walkthrough. Models should be back around 4:30.
            </div>
            <button
              onClick={() => onAckAnnouncement?.(latestAnn.id)}
              style={{
                width: '100%', minHeight: 52, borderRadius: 8, border: 0,
                background: '#F5F2EE', color: TX,
                fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600,
                letterSpacing: '.12em', cursor: 'pointer',
              }}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* Content (dimmed when warning showing) */}
      <div style={{ opacity: showWarning ? 0.3 : 1, transition: 'opacity 150ms' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 10px' }}>
          <span style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: TX, fontWeight: 600 }}>
            {specialtyLabel}
          </span>
          <span style={{ fontSize: 12, color: MT }}>Show {showEntry.time} · 2h 15m</span>
        </div>

        {/* Walkthrough upcoming strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TX, borderRadius: 999, padding: '8px 14px', marginBottom: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F2EE" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 12, color: '#F5F2EE', flex: 1 }}>Walkthrough at {walkthroughEntry.time}</span>
          <span style={{ fontSize: 11, color: '#D4A853' }}>in 15 min</span>
        </div>

        {activeModel ? (
          <>
            {/* D3: Touch-up banner */}
            {(() => {
              const tp = (touchupNotes || []).find(n => n.modelId === activeModel.id && n.assistantId === profileId)
              if (!tp) return null
              return (
                <div style={{ background: TX, color: '#F5F2EE', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#C9C4BE', marginBottom: 6 }}>
                    Touch-up{tp.areas?.length > 0 ? ` · ${tp.areas.join(', ')}` : ''} · {tp.sentAt}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.35 }}>{tp.note || 'Please adjust and recheck.'}</div>
                </div>
              )
            })()}

            {/* Working on card */}
            <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: '20px 16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <Avatar src={activeModel.avatar} name={activeModel.name} size={72} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Lbl style={{ marginBottom: 4 }}>Now working on · Look {activeModel.look}</Lbl>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, marginBottom: 6 }}>{activeModel.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {(touchupNotes || []).some(n => n.modelId === activeModel.id && n.assistantId === profileId)
                      ? <Chip c='#D4A853' t='Touch-up' />
                      : <Chip c='#D4A853' t={`${specialtyLabel} in progress`} />}
                    <span style={{ fontSize: 11, color: MT }}>{elapsed} min</span>
                  </div>
                </div>
              </div>

              {/* Look link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: `1px solid ${BD}`, marginBottom: 14, cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: '#E8E4DF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={M2} strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <span style={{ flex: 1, fontSize: 13 }}>Look {activeModel.look} · Demo video and photos</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={M2} strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </div>

              {/* Mark done */}
              <button
                onClick={handleMarkDone}
                style={{ width: '100%', minHeight: 56, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', cursor: 'pointer', marginBottom: 6 }}
              >
                MARK {specialtyLabel.toUpperCase()} DONE
              </button>
              <div style={{ fontSize: 9, color: MT, textAlign: 'center', marginBottom: 14 }}>
                Lets {producerFirstName}, the lead assistants and key artist know your model is ready
              </div>

              {/* Pause + Lead check */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <button
                  onClick={svc?.status === 'paused' ? handleResume : handlePause}
                  style={{ minHeight: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
                >
                  {svc?.status === 'paused' ? 'RESUME' : 'PAUSE'}
                </button>
                <button
                  onClick={handleLeadCheckRequest}
                  style={{ minHeight: 48, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', color: TX, cursor: 'pointer' }}
                >
                  LEAD CHECK
                </button>
              </div>

              {/* Hand off */}
              <button style={{ width: '100%', height: 24, borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.08em', color: MT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                HAND OFF
              </button>
            </div>

            {/* Other services */}
            <div style={{ marginBottom: 14 }}>
              <Lbl style={{ marginBottom: 10 }}>{activeModel.name.split(' ')[0]}'s other services</Lbl>
              {['hair', 'makeup', 'nails'].filter(s => s !== specialty).map(s => {
                const sEntry = activeModel.services[s]
                const chip = svcChip(sEntry)
                const assistId = sEntry?.assistantId
                const assistName = assistId ? (profiles?.find(p => p.id === assistId)?.name || '') : ''
                const sLabel = s.charAt(0).toUpperCase() + s.slice(1)
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                    <span style={{ fontSize: 13, color: MT }}>{sLabel}{assistName ? ` · ${assistName}` : ''}</span>
                    <Chip c={chip.c} t={chip.t} />
                  </div>
                )
              })}
              <div style={{ fontSize: 11, color: M2, marginTop: 8 }}>Hair and nails are updated by their own teams.</div>
            </div>
          </>
        ) : (
          /* Waiting state */
          <>
            <div style={{ background: '#fff', border: `1px solid ${BD}`, borderRadius: 14, padding: '28px 20px', marginBottom: 14 }}>
              <Lbl style={{ marginBottom: 10 }}>Now working on</Lbl>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>Waiting for your next model</div>
            </div>

            {doneModels.length > 0 && (
              <div>
                <Lbl style={{ marginBottom: 10 }}>You finished today</Lbl>
                {doneModels.map(m => {
                  const entry = m.services[specialty]
                  const t = doneTime(entry?.startedAt, entry?.elapsedMins)
                  return (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                      <span style={{ fontSize: 13 }}>{m.name} · Look {m.look}</span>
                      <Chip c='#7A9E7E' t={t ? `Done ${t}` : 'Done'} />
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
