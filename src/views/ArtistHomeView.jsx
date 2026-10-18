import { useState, useEffect } from 'react'

function fmtTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function mkImg(bg, label = '') {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='${bg}'/>${label ? `<text x='200' y='210' text-anchor='middle' font-family='Georgia,serif' font-size='36' fill='rgba(255,255,255,0.65)'>${label}</text>` : ''}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(s)}`
}

const MODEL_PHOTO = mkImg('#2E2C29', 'Model')

// ─── Earlier log mock ─────────────────────────────────────────────────────────
const EARLIER_LOG = [
  { id: 'e1', avatarBg: '#D4A853', initials: 'SR', text: 'Sofia R marked Look A done for Mia Chen', time: '2:43 PM' },
  { id: 'e2', avatarBg: '#7A9E7E', initials: 'IO', text: 'Iona sent Look B to assistants', time: '2:30 PM' },
  { id: 'e3', avatarBg: '#C4614A', initials: 'KW', text: 'Kenji W. flagged a touch-up on Look C', time: '2:12 PM' },
  { id: 'e4', avatarBg: '#8A9BB0', initials: 'LN', text: 'Lena S. approved inventory count', time: '1:58 PM' },
]

function AvatarCircle({ src, initials, bg = '#8A9BB0', size = 32 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: size * 0.34, fontWeight: 500, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>{initials}</span>
      }
    </span>
  )
}

// ─── K1 — in-app notification banner ─────────────────────────────────────────
function NotifyBanner({ req, onAccept, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '56px 16px 0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      aria-modal="true" role="dialog" aria-label="Second opinion request"
    >
      <div style={{
        width: '100%', maxWidth: 390,
        background: 'rgba(245,242,238,.96)', borderRadius: 18,
        padding: '16px 16px 20px',
        boxShadow: '0 16px 48px rgba(0,0,0,.25)',
      }}>
        {/* App chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{
            padding: '3px 8px', borderRadius: 6, border: '1px solid #E0DDD8',
            fontSize: 10, letterSpacing: '.12em', color: '#6E6A64', fontWeight: 600,
          }}>SHOW PARTNER</span>
        </div>

        {/* Content row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
          <span style={{ width: 44, height: 44, borderRadius: 8, background: '#E0DDD8', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={req.modelAvatar || mkImg('#C8C4BF', req.modelName?.[0] || '?')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 600, color: '#111' }}>
              {req.assistantFirstName} · {req.modelName}
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#4A4743', lineHeight: 1.4 }}>
              {req.leadFirstName} is asking about Look {req.modelLook} {req.modelArea}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onAccept}
            style={{ flex: 1, minHeight: 52, borderRadius: 10, border: 0, background: '#111', color: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.1em', fontWeight: 600, cursor: 'pointer' }}
          >
            ON MY WAY
          </button>
          <button
            onClick={onDismiss}
            style={{ flex: 1, minHeight: 52, borderRadius: 10, border: 0, background: '#E0DDD8', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.1em', cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── K3 — at the station ──────────────────────────────────────────────────────
function StationScreen({ req, onLooksGood, onTouchup, onOpenLook }) {
  const leadFirstName = req.leadFirstName || req.leadName
  const assistantFirstName = req.assistantFirstName || req.assistantName

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top line */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 0' }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Second opinion</p>
        <p style={{ margin: 0, fontSize: 11, color: '#4A4743' }}>{leadFirstName}</p>
      </div>

      {/* Status line */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 14px' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5E8A63', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#4A4743' }}>
          {leadFirstName} and {assistantFirstName} know you're coming
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* Model card */}
        <div style={{ margin: '0 16px', borderRadius: 16, border: '1px solid #E0DDD8', background: '#fff', overflow: 'hidden', marginBottom: 16 }}>
          {/* Model photo */}
          <div style={{ height: 260, overflow: 'hidden', background: '#2E2C29' }}>
            <img
              src={req.modelAvatar || MODEL_PHOTO}
              alt={req.modelName}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
          </div>
          {/* Model info */}
          <div style={{ padding: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>
              LOOK {req.modelLook} · {req.assistantFirstName}
            </p>
            <p style={{ margin: '0 0 8px', fontFamily: 'Georgia, serif', fontSize: 24, color: '#111' }}>
              {req.modelName}
            </p>
            {req.leadNote && (
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#2E2C29' }}>{req.leadNote}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onLooksGood}
            style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.1em', fontWeight: 600, cursor: 'pointer' }}
          >
            LOOKS GOOD
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onTouchup}
              style={{ flex: 1, minHeight: 48, borderRadius: 8, border: '1px solid #CFCAC4', background: 'transparent', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', cursor: 'pointer' }}
            >
              TOUCH-UP
            </button>
            <button
              onClick={onOpenLook}
              style={{ flex: 1, minHeight: 48, borderRadius: 8, border: '1px solid #CFCAC4', background: 'transparent', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', cursor: 'pointer' }}
            >
              OPEN LOOK {req.modelLook}
            </button>
          </div>

          {/* Lead's call button */}
          <button
            onClick={() => {}}
            style={{ width: '100%', minHeight: 44, borderRadius: 8, border: '1px solid #5A5652', background: 'transparent', color: '#4A4743', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer' }}
          >
            {leadFirstName.toUpperCase()}, YOUR CALL
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── K2 — artist home main ────────────────────────────────────────────────────
function ArtistHomeMain({ currentProfile, requests, models, onAccept, onLeadCall, onShowNotify }) {
  const firstName = currentProfile?.name?.split(' ')[0] || 'Artist'
  const pendingReq = requests.find(r => r.status === 'pending' || r.status === 'on_my_way')

  const makeupDone = models.filter(m => m.services?.makeup?.status === 'done').length
  const toCheck = models.filter(m => m.services?.makeup?.status === 'to_check').length
  const dressingMins = 35

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Page header */}
      <div style={{ flexShrink: 0, padding: '14px 16px 10px', borderBottom: '1px solid #E0DDD8' }}>
        <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 26, color: '#111' }}>
          {firstName}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6E6A64', letterSpacing: '.04em' }}>
          Key Artist · makeup
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Second opinion card (dark) */}
        {pendingReq && (
          <div style={{ background: '#111', borderRadius: 16, padding: 16 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C9C4BE' }}>
                Second opinion · from {pendingReq.assistantFirstName}
              </p>
              <span style={{ fontSize: 11, color: '#8A8480' }}>{pendingReq.createdAt}</span>
            </div>

            {/* Model row */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ width: 72, height: 72, borderRadius: 12, background: '#3A3734', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={pendingReq.modelAvatar || mkImg('#3A3734', pendingReq.modelName?.[0] || '?')}
                  alt={pendingReq.modelName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>
              <div>
                <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontSize: 24, color: '#F5F2EE' }}>
                  {pendingReq.modelName}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#E0DDD8' }}>
                  Look {pendingReq.modelLook} · {pendingReq.modelArea}
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            {pendingReq.status === 'pending' ? (
              <>
                <button
                  onClick={() => onAccept(pendingReq.id)}
                  style={{ width: '100%', minHeight: 56, borderRadius: 8, border: 0, background: '#F5F2EE', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.1em', fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
                >
                  ON MY WAY
                </button>
                <button
                  onClick={() => onLeadCall(pendingReq.id)}
                  style={{ width: '100%', minHeight: 48, borderRadius: 8, border: '1px solid #5A5652', background: 'transparent', color: '#F5F2EE', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer' }}
                >
                  {pendingReq.leadFirstName.toUpperCase()}, YOUR CALL
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5E8A63', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#C9C4BE' }}>On your way to {pendingReq.assistantFirstName}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Makeup done', val: makeupDone },
            { label: 'To check',    val: toCheck },
            { label: 'Dressing in', val: `${dressingMins}m` },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '14px 12px', border: '1px solid #E0DDD8' }}>
              <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64' }}>{label}</p>
              <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 28, color: '#111' }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Earlier log */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Earlier</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EARLIER_LOG.map(entry => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, borderBottom: '1px solid #E0DDD8' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: entry.avatarBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{entry.initials}</span>
                </span>
                <span style={{ flex: 1, fontSize: 13, color: '#111', lineHeight: 1.35 }}>{entry.text}</span>
                <span style={{ fontSize: 11, color: '#6E6A64', flexShrink: 0 }}>{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ArtistHomeView({
  currentProfile,
  models,
  secondOpinionRequests,
  onAcceptRequest,
  onDismissRequest,
  onLooksGood,
  onSuggestChange,
  onToast,
}) {
  const [screen, setScreen] = useState('home')
  const [activeReqId, setActiveReqId] = useState(null)
  const [notifyBannerShown, setNotifyBannerShown] = useState(false)

  const pendingReq = secondOpinionRequests.find(r => r.status === 'pending')
  const onMyWayReq = secondOpinionRequests.find(r => r.status === 'on_my_way')

  // Show notify banner when a new pending request arrives
  useEffect(() => {
    if (pendingReq && !notifyBannerShown) {
      setNotifyBannerShown(true)
    }
  }, [pendingReq?.id])

  const activeReq = activeReqId
    ? secondOpinionRequests.find(r => r.id === activeReqId)
    : (onMyWayReq || pendingReq)

  function handleAccept(reqId) {
    setNotifyBannerShown(false)
    onAcceptRequest(reqId)
    setActiveReqId(reqId)
    setScreen('station')
  }

  function handleDismiss(reqId) {
    setNotifyBannerShown(false)
    onDismissRequest(reqId)
  }

  function handleLeadCall(reqId) {
    onDismissRequest(reqId)
    onToast?.('Sent decision to lead')
  }

  function handleLooksGood() {
    if (activeReq) {
      onLooksGood(activeReq.id)
      onToast?.('Approved — assistants can continue')
    }
    setScreen('home')
    setActiveReqId(null)
  }

  function handleTouchup() {
    onToast?.('Touch-up note sent')
    setScreen('home')
    setActiveReqId(null)
  }

  function handleOpenLook() {
    onToast?.(`Opening Look ${activeReq?.modelLook || ''}`)
  }

  if (screen === 'station' && activeReq) {
    return (
      <StationScreen
        req={activeReq}
        onLooksGood={handleLooksGood}
        onTouchup={handleTouchup}
        onOpenLook={handleOpenLook}
      />
    )
  }

  return (
    <>
      <ArtistHomeMain
        currentProfile={currentProfile}
        requests={secondOpinionRequests}
        models={models}
        onAccept={handleAccept}
        onLeadCall={handleLeadCall}
        onShowNotify={() => setNotifyBannerShown(true)}
      />

      {notifyBannerShown && pendingReq && (
        <NotifyBanner
          req={pendingReq}
          onAccept={() => handleAccept(pendingReq.id)}
          onDismiss={() => handleDismiss(pendingReq.id)}
        />
      )}
    </>
  )
}
