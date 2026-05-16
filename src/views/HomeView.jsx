import { useState, useEffect } from 'react'
import { show, team, models, notifications as initNotifs, schedule, parseScheduleTime, STATUS_META } from '../data/mockData'
import BottomSheet from '../components/BottomSheet'
import ContactSheet from '../components/ContactSheet'
import FloorPlanSVG from '../components/FloorPlanSVG'


function formatTime(date) {
  let h = date.getHours(), m = date.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDateLine(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
}

function currentMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}

function paceSnippet(nowMins) {
  const showtimeMins = 18 * 60
  const diff = showtimeMins - nowMins
  if (diff <= 0) return { text: 'Show complete', past: true }
  const h = Math.floor(diff / 60)
  const m = diff % 60
  const parts = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  return { text: `${parts.join(' ')} until showtime`, past: false }
}

// Satellite-style venue map
function VenueMap({ dark, currentProfile, team, models, onToast, trackLocation }) {
  const [tooltip, setTooltip] = useState(null)

  // Artist station pins — hair near HAIR zone, makeup near MAKEUP zone
  const artistPins = [
    { person: team.find(p => p.name === 'Aria Chen'),   x: 100, y: 75 },
    { person: team.find(p => p.name === 'David Kim'),   x: 128, y: 58 },
    { person: team.find(p => p.name === 'Priya Osei'),  x: 150, y: 92 },
    { person: team.find(p => p.name === 'Marcus Lee'),  x: 182, y: 70 },
    { person: team.find(p => p.name === 'Zoe Park'),    x: 210, y: 55 },
    { person: team.find(p => p.name === 'Luna Torres'), x: 230, y: 88 },
  ]

  // Assistant location pins — active tracking vs lost signal
  const assistantPins = [
    { person: team.find(p => p.name === 'Sophia Rivera'), x: 272, y: 143, drift: true  },
    { person: team.find(p => p.name === 'Cleo Marsh'),    x: 215, y: 158, drift: false },
    { person: team.find(p => p.name === 'James Kim'),     x: 78,  y: 205, drift: false },
    { person: team.find(p => p.name === 'Ben Adeyemi'),   x: 152, y: 192, drift: false },
  ]

  function handlePinTap(e, pin) {
    e.stopPropagation()
    if (tooltip?.person?.id === pin.person?.id) { setTooltip(null); return }
    setTooltip({ person: pin.person, x: pin.x, y: pin.y })
  }

  return (
    <div className="relative w-full" style={{ height: 260 }} onClick={() => setTooltip(null)}>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes drift {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(3px, -2px); }
          50%  { transform: translate(5px, 1px); }
          75%  { transform: translate(2px, 3px); }
          100% { transform: translate(0px, 0px); }
        }
      `}</style>

      {/* Satellite background */}
      <svg viewBox="0 0 340 260" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <rect width="340" height="260" fill="#2B2F38" />
        <rect x="0"   y="0"   width="340" height="8"   fill="#3A3F4E" />
        <rect x="0"   y="252" width="340" height="8"   fill="#3A3F4E" />
        <rect x="0"   y="0"   width="8"   height="260" fill="#3A3F4E" />
        <rect x="332" y="0"   width="8"   height="260" fill="#3A3F4E" />
        <rect x="12"  y="12"  width="55"  height="42"  fill="#363A45" rx="1" />
        <rect x="72"  y="12"  width="60"  height="42"  fill="#363A45" rx="1" />
        <rect x="138" y="12"  width="50"  height="42"  fill="#363A45" rx="1" />
        <rect x="194" y="12"  width="60"  height="42"  fill="#363A45" rx="1" />
        <rect x="260" y="12"  width="68"  height="42"  fill="#363A45" rx="1" />
        <rect x="12"  y="80"  width="35"  height="80"  fill="#363A45" rx="1" />
        <rect x="295" y="80"  width="35"  height="80"  fill="#363A45" rx="1" />
        <rect x="12"  y="220" width="80"  height="30"  fill="#363A45" rx="1" />
        <rect x="100" y="220" width="60"  height="30"  fill="#363A45" rx="1" />
        <rect x="168" y="220" width="70"  height="30"  fill="#363A45" rx="1" />
        <rect x="246" y="220" width="84"  height="30"  fill="#363A45" rx="1" />
        <rect x="52"  y="60"  width="20"  height="16"  fill="#2C3828" rx="2" />
        <rect x="265" y="60"  width="24"  height="18"  fill="#2C3828" rx="2" />
        <rect x="16"  y="60"  width="308" height="155" fill="#3F4452" rx="2" />
        <rect x="20"  y="64"  width="300" height="147" fill="#454B5A" rx="1" />
        <rect x="24"  y="68"  width="290" height="2"   fill="#525869" />
        <rect x="24"  y="68"  width="2"   height="139" fill="#525869" />
        <rect x="312" y="68"  width="2"   height="139" fill="#525869" />
        <rect x="24"  y="205" width="290" height="2"   fill="#525869" />
        <line x1="82"  y1="68" x2="82"  y2="140" stroke="#525869" strokeWidth="0.5" />
        <line x1="162" y1="68" x2="162" y2="140" stroke="#525869" strokeWidth="0.5" />
        <line x1="242" y1="68" x2="242" y2="140" stroke="#525869" strokeWidth="0.5" />
        <line x1="24"  y1="140" x2="314" y2="140" stroke="#525869" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="24"  y1="162" x2="314" y2="162" stroke="#525869" strokeWidth="0.5" />
      </svg>

      {/* Floor plan overlay at 30% opacity */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.28, padding: '8px 10px' }}>
        <FloorPlanSVG dark={false} />
      </div>

      {/* Artist station pins — neutral dot, emoji icon, first name */}
      {artistPins.map((pin, i) => {
        if (!pin.person) return null
        const isHair = pin.person.specialty === 'hair'
        return (
          <div
            key={i}
            style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)', zIndex: 10 }}
          >
            <button
              onClick={(e) => handlePinTap(e, pin)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, background: 'none', border: 'none', outline: 'none', padding: 0, cursor: 'pointer' }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: 'rgba(245,242,238,0.95)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, lineHeight: 1,
              }}>{isHair ? '✂' : '💄'}</div>
              <span style={{ fontSize: 7, fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.9)', marginTop: 1 }}>
                {pin.person.name.split(' ')[0]}
              </span>
            </button>
          </div>
        )
      })}

      {/* Assistant location pins — active tracking vs lost signal */}
      {assistantPins.map((pin, i) => {
        if (!pin.person) return null
        const isActive = pin.person.trackingState === 'active'
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pin.x,
              top: pin.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              animation: pin.drift ? 'drift 6s ease-in-out infinite' : 'none',
            }}
          >
            <button
              onClick={(e) => handlePinTap(e, pin)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', outline: 'none', padding: 0, cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
                {isActive && (
                  <div style={{
                    position: 'absolute', inset: -3,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(245,242,238,0.6)',
                    animation: 'pulse-ring 2s ease-out infinite',
                  }} />
                )}
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  backgroundColor: isActive ? '#D4A853' : '#888780',
                  border: isActive ? '1.5px solid rgba(255,255,255,0.6)' : '1.5px solid rgba(136,135,128,0.35)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }} />
                {!isActive && (
                  <div style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: '#C4614A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 5, color: 'white', fontWeight: 700, lineHeight: 1,
                  }}>!</div>
                )}
              </div>
              <span style={{
                fontSize: 7, fontFamily: 'Inter, system-ui, sans-serif',
                color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(160,158,152,0.9)',
                fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}>
                {pin.person.name.split(' ')[0]}
              </span>
              {!isActive && pin.person.lastSeenMins && (
                <span style={{
                  fontSize: 6, fontFamily: 'Inter, system-ui, sans-serif',
                  color: 'rgba(136,135,128,0.75)', whiteSpace: 'nowrap',
                  textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                }}>
                  {pin.person.lastSeenMins}m ago
                </span>
              )}
            </button>
          </div>
        )
      })}

      {/* My location pin — shown when trackLocation is on */}
      {trackLocation && currentProfile && (() => {
        const myPin = { person: currentProfile, x: 118, y: 155 }
        return (
          <div
            style={{
              position: 'absolute',
              left: myPin.x,
              top: myPin.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 11,
              animation: 'drift 5s ease-in-out infinite',
            }}
          >
            <button
              onClick={(e) => handlePinTap(e, myPin)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', outline: 'none', padding: 0, cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -3,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(212,168,83,0.7)',
                  animation: 'pulse-ring 2s ease-out infinite',
                }} />
                <img
                  src={currentProfile.avatar}
                  style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4A853', boxShadow: '0 1px 4px rgba(0,0,0,0.6)', position: 'relative' }}
                  alt=""
                />
              </div>
              <span style={{
                fontSize: 7, fontFamily: 'Inter, system-ui, sans-serif',
                color: '#D4A853',
                fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}>
                YOU
              </span>
            </button>
          </div>
        )
      })()}

      {/* Pin tooltip */}
      {tooltip && tooltip.person && (() => {
        const p = tooltip.person
        const tipX = Math.min(Math.max(tooltip.x, 80), 260)
        const tipY = tooltip.y > 160 ? tooltip.y - 80 : tooltip.y + 22
        const isActive = p.trackingState === 'active'
        const isLost = p.trackingState === 'lost'
        const roleLabel = p.specialty ? p.specialty.toUpperCase() : 'ASSISTANT'
        const statusLine = isActive
          ? { text: 'Active · tracking', color: '#7A9E7E' }
          : isLost
          ? { text: `Last seen ${p.lastSeenMins}m ago`, color: '#C4614A' }
          : null
        return (
          <div
            style={{
              position: 'absolute',
              left: tipX,
              top: tipY,
              transform: 'translateX(-50%)',
              zIndex: 20,
              background: 'rgba(26,24,22,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 148,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img src={p.avatar} alt={p.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11, fontFamily: 'Inter, system-ui', color: '#F0EDE8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'Inter, system-ui', color: '#888580', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{roleLabel}</p>
              {statusLine && (
                <p style={{ margin: '1px 0 0', fontSize: 9, fontFamily: 'Inter, system-ui', color: statusLine.color }}>{statusLine.text}</p>
              )}
            </div>
            <button
              onClick={() => { onToast(`Ping sent to ${p.name}`); setTooltip(null) }}
              style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3, padding: '3px 6px', background: 'none', cursor: 'pointer', flexShrink: 0, outline: 'none' }}
            >
              PING
            </button>
          </div>
        )
      })()}
    </div>
  )
}

export default function HomeView({ dark, currentProfile, onToast, models: modelsProp }) {
  const [now, setNow] = useState(new Date())
  const [checked, setChecked] = useState(() => {
    const cur = currentMinutes(new Date())
    return schedule.reduce((acc, item) => {
      acc[item.time] = parseScheduleTime(item.time) < cur
      return acc
    }, {})
  })
  const [expandedSections, setExpandedSections] = useState({ lead: true, assistants: true, artists: true, models: false })
  const [expandNotifs, setExpandNotifs] = useState(true)
  const [mapOpen, setMapOpen] = useState(false)
  const [contactPerson, setContactPerson] = useState(null)
  const [trackLocation, setTrackLocation] = useState(false)
  const [stationLogged, setStationLogged] = useState(null)

  const liveModels = modelsProp || models

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  function toggleCheck(time) {
    setChecked(s => ({ ...s, [time]: !s[time] }))
  }

  function toggleSection(key) {
    setExpandedSections(s => ({ ...s, [key]: !s[key] }))
  }

  const leads = team.filter(p => p.role === 'lead')
  const assistants = team.filter(p => p.role === 'assistant')
  const artists = team.filter(p => p.role === 'artist')

  const SECTIONS = [
    { key: 'lead', label: 'LEAD', count: leads.length, people: leads },
    { key: 'assistants', label: 'ASSISTANTS', count: assistants.length, people: assistants },
    { key: 'artists', label: 'ARTISTS', count: artists.length, people: artists },
    { key: 'models', label: 'MODELS', count: liveModels.length, people: liveModels.map(m => ({ ...m, role: `Look ${m.lookNumber}` })) },
  ]

  const allNotifs = initNotifs
  const nowMins = currentMinutes(now)
  const pace = paceSnippet(nowMins)

  // Pace block calculations
  const showtimeMins = 18 * 60
  const dayStartMins = 9 * 60
  const dayDuration = showtimeMins - dayStartMins
  const total = liveModels.length
  const done = liveModels.filter(m => m.status === 'done').length
  const remaining = total - done
  const avgMins = 34
  const workRemainingMins = remaining * avgMins
  const estFinishMins = nowMins + workRemainingMins
  const minsUntilShow = Math.max(0, showtimeMins - nowMins)
  const clamp = v => Math.min(100, Math.max(0, v))
  const progressPct  = clamp((nowMins - dayStartMins) / dayDuration * 100)
  const estFinishPct = clamp((estFinishMins - dayStartMins) / dayDuration * 100)

  function fmtMins(m) {
    if (m <= 0) return '0m'
    const h = Math.floor(m / 60); const mm = m % 60
    return h > 0 ? `${h}h ${mm}m` : `${mm}m`
  }
  function fmtAbsTime(totalMins) {
    const h = Math.floor(totalMins / 60) % 24; const m = totalMins % 60
    const ap = h >= 12 ? 'PM' : 'AM'; const hh = h % 12 || 12
    return `${hh}:${String(m).padStart(2,'0')} ${ap}`
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* 1. Full Pace Block */}
      <div className="px-4 pt-5 pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">{formatDateLine(now)}</p>
        <p className={`font-serif text-[28px] leading-tight mb-1 ${pace.past ? 'text-[#888580]' : 'text-[#111] dark:text-[#F0EDE8]'}`}>
          {pace.text}
        </p>
        <p className="text-[11px] font-sans text-[#888580] mb-4">{formatTime(now)}</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
            <p className="font-serif text-xl text-[#111] dark:text-[#F0EDE8] leading-none">{remaining}</p>
            <p className="text-[10px] font-sans text-[#888580] mt-1">models remaining</p>
          </div>
          <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
            <p className="font-serif text-xl leading-none" style={{ color: workRemainingMins > minsUntilShow ? '#C4614A' : '#7A9E7E' }}>
              {fmtMins(minsUntilShow)}
            </p>
            <p className="text-[10px] font-sans text-[#888580] mt-1">until showtime</p>
          </div>
        </div>

        {/* Timeline bar */}
        <div className="relative mb-1">
          <div className="w-full rounded-full bg-[#E0DDD8] dark:bg-[#2E2B28] relative overflow-visible" style={{ height: 6 }}>
            <div className="absolute left-0 top-0 h-full rounded-full bg-[#7A9E7E]" style={{ width: `${progressPct}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 rounded" style={{ left: `${estFinishPct}%`, width: 2, height: 12, backgroundColor: '#7A9E7E', opacity: 0.5 }} />
            <div className="absolute top-1/2 -translate-y-1/2 rounded" style={{ left: 'calc(100% - 1px)', width: 2, height: 14, backgroundColor: '#111' }} />
          </div>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[9px] font-sans text-[#888580]">9 AM</span>
          <span className="text-[9px] font-sans text-[#888580]">now · {formatTime(now)}</span>
          <span className="text-[9px] font-sans text-[#888580]">6 PM</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7A9E7E] inline-block" />
            <span className="text-[9px] font-sans text-[#888580]">progress</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#7A9E7E', opacity: 0.45 }} />
            <span className="text-[9px] font-sans text-[#888580]">est. finish {fmtAbsTime(estFinishMins)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#111] dark:bg-[#F0EDE8] inline-block" />
            <span className="text-[9px] font-sans text-[#888580]">showtime 6 PM</span>
          </span>
        </div>
      </div>

      {/* 2. Venue + Inline Map */}
      <div className="border-b border-[#E0DDD8] dark:border-[#2E2B28]">
        <div className="px-4 pt-4 pb-3">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">{show.name}</p>
          <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] mb-3">{show.address}</p>
          <button
            onClick={() => setMapOpen(s => !s)}
            className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] flex items-center gap-1.5 outline-none focus:outline-none"
          >
            SHOW MAP
            <svg
              width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              style={{ transform: mapOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
            >
              <polyline points="1 2.5 4 5.5 7 2.5" />
            </svg>
          </button>
        </div>

        {/* Inline map + legend — expands below button */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: mapOpen ? 340 : 0,
            transition: 'max-height 200ms ease',
          }}
        >
          <VenueMap
            dark={dark}
            currentProfile={currentProfile}
            team={team}
            models={liveModels}
            onToast={onToast}
            trackLocation={trackLocation}
          />
          {/* Pin legend */}
          <div className="px-3 py-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <span className="text-[9px] leading-none">✂</span>
              <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">Hair station</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[9px] leading-none">💄</span>
              <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">Makeup station</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: '#D4A853' }} />
              <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">Active tracking</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: '#888780' }} />
              <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">Last known</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Location / station */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#E0DDD8] dark:border-[#2E2B28]">
        {currentProfile.role === 'artist' ? (
          <div className="flex items-center gap-3 w-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#888580] flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] flex-1">
              {stationLogged ? `Station logged at ${stationLogged}` : 'LOG MY STATION'}
            </span>
            {!stationLogged && (
              <button
                onClick={() => { setStationLogged(formatTime(new Date())); onToast('Station logged') }}
                className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1 rounded text-[#111] dark:text-[#F0EDE8] flex-shrink-0"
              >
                LOG
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#888580] flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] flex-1">TRACK MY LOCATION</span>
            {/* Fixed toggle */}
            <button
              onClick={() => setTrackLocation(s => !s)}
              className="flex-shrink-0 relative rounded-full outline-none"
              style={{
                width: 40,
                height: 22,
                backgroundColor: trackLocation ? '#7A9E7E' : '#D0CCC7',
                transition: 'background-color 150ms ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: trackLocation ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  transition: 'left 150ms ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="px-4 pt-4 pb-2 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">TODAY'S SCHEDULE</p>
        {schedule.map(item => (
          <div
            key={item.time}
            className={`flex items-center py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 ${
              item.isShowtime ? 'border-t border-[#E0DDD8] dark:border-[#2E2B28] mt-1' : ''
            }`}
          >
            <span className="w-[72px] text-[11px] font-sans text-[#888580] tabular-nums flex-shrink-0">{item.time}</span>
            <span className={`flex-1 text-sm font-sans ${item.isShowtime ? 'font-serif' : ''} text-[#111] dark:text-[#F0EDE8] ${checked[item.time] ? 'line-through text-[#B0ACA7]' : ''}`}>
              {item.label}
            </span>
            <button
              onClick={() => toggleCheck(item.time)}
              className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center outline-none ${
                checked[item.time] ? 'bg-[#7A9E7E] border-[#7A9E7E]' : 'border-[#C8C4BF] dark:border-[#3A3632] bg-transparent'
              }`}
            >
              {checked[item.time] && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="px-4 pt-4 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">TEAM</p>
        {SECTIONS.map(sec => (
          <div key={sec.key} className="border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <button
              onClick={() => toggleSection(sec.key)}
              className="flex items-center w-full py-3 outline-none"
            >
              <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] flex-1">{sec.label} · {sec.count}</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                className={`text-[#888580] ${expandedSections[sec.key] ? 'rotate-180' : ''}`}
                style={{ transition: 'transform 150ms ease' }}
              >
                <polyline points="2 4 6 8 10 4"/>
              </svg>
            </button>
            {expandedSections[sec.key] && sec.people.map(p => (
              <button
                key={p.id}
                onClick={() => setContactPerson(p)}
                className="flex items-center gap-3 w-full py-2.5 border-t border-[#E0DDD8] dark:border-[#2E2B28] outline-none"
              >
                <div className="relative flex-shrink-0">
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                  {(p.role === 'lead' || p.role === 'assistant') && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white dark:border-[#1A1816] bg-[#7A9E7E]" />
                  )}
                  {p.role === 'artist' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white dark:border-[#1A1816] bg-[#D0CCC7]" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">{p.name}</p>
                  <p className="text-[10px] tracking-wide uppercase font-sans text-[#888580]">{p.role}</p>
                </div>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#B0ACA7]">
                  <polyline points="2 1 6 4 2 7"/>
                </svg>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="px-4 pt-4 pb-6">
        <button
          onClick={() => setExpandNotifs(s => !s)}
          className="flex items-center w-full mb-2 outline-none"
        >
          <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] flex-1">NOTIFICATIONS</span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
            className={`text-[#888580] ${expandNotifs ? 'rotate-180' : ''}`}
            style={{ transition: 'transform 150ms ease' }}
          >
            <polyline points="2 4 6 8 10 4"/>
          </svg>
        </button>
        {expandNotifs && allNotifs.map(n => (
          <div
            key={n.id}
            className={`flex items-start gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 ${
              !n.read ? 'border-l-[2px] border-l-[#D4A853] pl-3 -ml-3' : ''
            }`}
          >
            <div
              className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: n.status ? STATUS_META[n.status]?.color : '#C8C4BF' }}
            />
            <p className="flex-1 text-xs font-sans text-[#111] dark:text-[#F0EDE8] leading-snug">{n.text}</p>
            <span className="text-[10px] font-sans text-[#888580] flex-shrink-0 whitespace-nowrap">{n.timestamp}</span>
          </div>
        ))}
        {allNotifs.length === 0 && (
          <p className="text-xs text-[#888580] font-sans">No new notifications.</p>
        )}
      </div>

      {/* Contact sheet */}
      <BottomSheet open={!!contactPerson} onClose={() => setContactPerson(null)} height="auto">
        {contactPerson && (
          <ContactSheet
            person={contactPerson}
            onClose={() => setContactPerson(null)}
            onToast={onToast}
            models={liveModels}
          />
        )}
      </BottomSheet>
    </div>
  )
}
