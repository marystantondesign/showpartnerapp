import { useState, useEffect } from 'react'
import { show, timeline, profileNotifications } from '../data/mockData'
import AssistantProfileOverlay from '../components/AssistantProfileOverlay'

const SHOW_HOUR = 18
const SHOW_MIN  = 0

function parseTimeMins(timeStr) {
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function fmtCountdown(totalMin) {
  if (totalMin <= 0) return 'Showtime!'
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0 && m > 0) return `${h}h ${m}m until showtime`
  if (h > 0) return `${h}h until showtime`
  return `${m}m until showtime`
}

function fmtDateLabel(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
}

function fmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function roleLabel(p) {
  if (p.role === 'lead')            return 'Producer'
  if (p.role === 'artist')          return 'Key artist'
  if (p.role === 'lead_assistant')  return 'Lead assistant'
  return ''
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64', marginBottom: 14, margin: '0 0 14px' }}>
      {children}
    </p>
  )
}

function GroupLabel({ children }) {
  return (
    <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6E6A64', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="13" cy="13" r="13" fill="#7A9E7E"/>
      <path d="M7.5 13.5l4 4 7-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function EmptyCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="13" cy="13" r="12" stroke="#CFCAC4" strokeWidth="1.5"/>
    </svg>
  )
}

function ScheduleRow({ item, isPast, isNext, minsTil }) {
  if (isNext) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', height: 52, gap: 8,
        background: '#111', borderRadius: 12, padding: '0 14px', marginBottom: 4,
      }}>
        <span style={{ width: 70, fontSize: 13, color: '#fff', flexShrink: 0 }}>{item.time}</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#fff' }}>{item.label}</span>
        <span style={{ fontSize: 12, color: '#E8C77A', flexShrink: 0 }}>in {minsTil}m</span>
      </div>
    )
  }
  if (isPast) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 8, padding: '0 14px', marginBottom: 4 }}>
        <span style={{ width: 70, fontSize: 13, color: '#8A857F', textDecoration: 'line-through', flexShrink: 0 }}>{item.time}</span>
        <span style={{ flex: 1, fontSize: 15, color: '#8A857F', textDecoration: 'line-through' }}>{item.label}</span>
        <CheckCircleIcon />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 8, padding: '0 14px', marginBottom: 4 }}>
      <span style={{ width: 70, fontSize: 13, color: '#6E6A64', flexShrink: 0 }}>{item.time}</span>
      <span style={{ flex: 1, fontSize: 15, color: '#111' }}>{item.label}</span>
      <EmptyCircleIcon />
    </div>
  )
}

function TeamCard({ person, label, isMe, meLabel, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '12px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        border: isMe ? '1.5px solid #111' : '1.5px solid transparent',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
      }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={person.avatar}
          alt={person.name}
          style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 11, height: 11, borderRadius: '50%',
          background: '#7A9E7E', border: '2px solid #fff',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111', textAlign: 'center', lineHeight: 1.25 }}>
        {person.name}
      </span>
      <span style={{ fontSize: 11, color: '#6E6A64', textAlign: 'center', lineHeight: 1.25 }}>
        {isMe ? meLabel : label}
      </span>
    </div>
  )
}

function VenueMap({ venue }) {
  const W = 320, H = 200
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', background: '#E8E4DF', borderRadius: 8 }}
    >
      {venue?.zones?.map(z => {
        if (!z.polygon) return null
        const points = z.polygon.map(p => `${(p.xPct / 100) * W},${(p.yPct / 100) * H}`).join(' ')
        return (
          <g key={z.id}>
            <polygon points={points} fill={z.color} opacity={0.5} />
            <text
              x={(z.xPct / 100) * W}
              y={(z.yPct / 100) * H}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#111"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {z.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function AssistantTodayView({ currentProfile, profiles, schedule, venue, models }) {
  const [now, setNow] = useState(() => new Date())
  const [mapOpen, setMapOpen] = useState(false)
  const [profilePerson, setProfilePerson] = useState(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const nowMins = now.getHours() * 60 + now.getMinutes()
  const showtimeMins = SHOW_HOUR * 60 + SHOW_MIN
  const minsUntilShow = showtimeMins - nowMins

  // Determine next timeline item index
  let nextIdx = -1
  for (let i = 0; i < timeline.length; i++) {
    if (parseTimeMins(timeline[i].time) > nowMins) {
      nextIdx = i
      break
    }
  }

  const isAssistant = currentProfile.role === 'assistant'
  const isLeadAssistant = currentProfile.role === 'lead_assistant'

  // LEADS group: producer + key makeup artist + lead assistants
  const producer       = profiles.find(p => p.role === 'lead')
  const keyArtist      = profiles.find(p => p.role === 'artist' && p.specialty === 'makeup')
  const leadAssistants = profiles.filter(p => p.role === 'lead_assistant' && p.specialty === 'makeup')
  const leads          = [producer, keyArtist, ...leadAssistants].filter(Boolean)

  // MAKEUP ASSISTANTS group: alphabetical
  const makeupAssistants = profiles
    .filter(p => p.role === 'assistant' && p.specialty === 'makeup')
    .sort((a, b) => a.name.localeCompare(b.name))

  const isMine = (p) => p.id === currentProfile.id

  return (
    <>
    <div className="flex-1 overflow-y-auto" style={{ background: '#F5F2EE', paddingBottom: 32 }}>
      <div style={{ padding: '24px 20px 0' }}>

        {/* Countdown */}
        <div style={{ marginBottom: 30 }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64', margin: '0 0 6px' }}>
            {fmtDateLabel(now)}
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, lineHeight: 1.15, color: '#111', margin: '0 0 6px' }}>
            {fmtCountdown(minsUntilShow)}
          </p>
          <p style={{ fontSize: 14, color: '#6E6A64', margin: 0 }}>
            {fmtTime(now)}
          </p>
        </div>

        {/* TODAY'S SCHEDULE */}
        <section style={{ marginBottom: 30 }}>
          <SectionLabel>Today's Schedule</SectionLabel>
          {timeline.map((item, i) => {
            const itemMins = parseTimeMins(item.time)
            const isPast = itemMins < nowMins
            const isNext = i === nextIdx
            const minsTil = itemMins - nowMins
            return (
              <ScheduleRow
                key={item.id}
                item={item}
                isPast={isPast}
                isNext={isNext}
                minsTil={minsTil}
              />
            )
          })}
        </section>

        {/* CONTACT MY TEAM */}
        <section style={{ marginBottom: 0 }}>
          <SectionLabel>Contact My Team</SectionLabel>

          {/* LEADS */}
          <GroupLabel>LEADS · {leads.length}</GroupLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {leads.map(p => (
              <TeamCard
                key={p.id}
                person={p}
                label={roleLabel(p)}
                isMe={isMine(p)}
                meLabel={`You · ${roleLabel(p)}`}
                onClick={isLeadAssistant && !isMine(p) ? () => setProfilePerson(p) : undefined}
              />
            ))}
          </div>

          {/* MAKEUP ASSISTANTS */}
          <GroupLabel>MAKEUP ASSISTANTS · {makeupAssistants.length}</GroupLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {makeupAssistants.map(p => (
              <TeamCard
                key={p.id}
                person={p}
                label={p.station}
                isMe={isMine(p) && isAssistant}
                meLabel={`You · ${p.station}`}
                onClick={isLeadAssistant && !isMine(p) ? () => setProfilePerson(p) : undefined}
              />
            ))}
          </div>
        </section>

        {/* VENUE */}
        <div style={{ borderTop: '1px solid #E0DDD8', paddingTop: 20, marginTop: 30 }}>
          <SectionLabel>Venue</SectionLabel>
          <p style={{ fontSize: 16, color: '#111', lineHeight: 1.4, margin: '0 0 14px' }}>
            {show.address}
          </p>
          <button
            onClick={() => setMapOpen(v => !v)}
            style={{
              width: '100%', height: 44, borderRadius: 6,
              border: '1.5px solid #111', background: 'transparent',
              fontSize: 12, fontWeight: 600, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#111', cursor: 'pointer',
            }}
          >
            {mapOpen ? 'HIDE MAP' : 'SHOW MAP'}
          </button>
          {mapOpen && (
            <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
              <VenueMap venue={venue} />
            </div>
          )}
        </div>

      </div>
    </div>
    {profilePerson && (
      <AssistantProfileOverlay
        person={profilePerson}
        currentProfile={currentProfile}
        profiles={profiles}
        models={models || []}
        onClose={() => setProfilePerson(null)}
      />
    )}
    </>
  )
}
