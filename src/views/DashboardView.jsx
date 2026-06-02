import { useState } from 'react'
import { STATUS_META } from '../data/mockData'
import DonutChart from '../components/DonutChart'
import StatusChip from '../components/StatusChip'
import ModelDetailSheet from '../components/ModelDetailSheet'
import ManageAssignments from '../components/ManageAssignments'
import BottomSheet from '../components/BottomSheet'
import { useIsTablet } from '../hooks/useIsTablet'

function specialtyLabel(artist) {
  if (!artist.specialty) return 'ARTIST'
  return artist.specialty.toUpperCase()
}

function ArtistDetailSheet({ artist, models, open, onClose }) {
  if (!artist) return null
  const assigned = models.filter(m => m.assignedArtists.includes(artist.name))
  return (
    <BottomSheet open={open} onClose={onClose} height="auto">
      <div className="pt-2 pb-6">
        <div className="flex items-center gap-4 px-4 mb-4">
          <img src={artist.avatar} alt={artist.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="font-serif text-xl text-[#111] dark:text-[#F0EDE8]">{artist.name}</p>
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mt-0.5">{specialtyLabel(artist)}</p>
          </div>
        </div>
        {artist.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 mb-5">
            {artist.tags.map(tag => (
              <span key={tag} className="text-[10px] font-sans text-[#888580] border border-[#D0CCC7] dark:border-[#3A3632] rounded-full px-2.5 py-1">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] px-4 mb-2">TODAY'S MODELS</p>
        {assigned.length === 0 ? (
          <p className="text-xs font-sans text-[#888580] px-4">No models assigned.</p>
        ) : assigned.map(m => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <span className="flex-1 font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{m.name}</span>
            <span className="text-[10px] font-sans text-[#888580] mr-2">LOOK {m.lookNumber}</span>
            <StatusChip status={m.status} small />
          </div>
        ))}
      </div>
    </BottomSheet>
  )
}

const STATUS_DOT_COLOR = {
  not_started:  '#C8C4BF',
  in_progress:  '#D4A853',
  paused:       '#8A9BB0',
  needs_revisit:'#C4614A',
  done:         '#7A9E7E',
}

function parseLogTime(timeStr) {
  if (!timeStr) return null
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function timeInState(model) {
  if (!model.statusLog.length) return null
  const last = model.statusLog[model.statusLog.length - 1]
  const t = parseLogTime(last.timestamp)
  if (!t) return null
  const diffMins = Math.max(0, Math.floor((Date.now() - t.getTime()) / 60000))
  if (diffMins < 60) return `${diffMins}m`
  return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`
}

function formatMins(mins) {
  if (mins <= 0) return '0m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtTime(totalMins) {
  const h = Math.floor(totalMins / 60) % 24
  const m = totalMins % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 || 12
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

function LeadDashboard({ models, team, notifications, onStatusChange, onNote, onAssignArtists, dark }) {
  const [detailModel, setDetailModel] = useState(null)
  const [expandedArtist, setExpandedArtist] = useState(null)
  const [assignmentsOpen, setAssignmentsOpen] = useState(false)
  const [artistDetail, setArtistDetail] = useState(null)
  const isTablet = useIsTablet()

  function toggleArtist(id) {
    setExpandedArtist(prev => prev === id ? null : id)
  }

  const total     = models.length
  const done      = models.filter(m => m.status === 'done').length
  const remaining = total - done

  const attentionNeeded = models.filter(m => m.status === 'paused' || m.status === 'needs_revisit')
  // Lead excluded — BY ARTIST shows working artists only
  const artists = team.filter(p => p.role === 'artist')

  const now = new Date()
  const nowMins      = now.getHours() * 60 + now.getMinutes()
  const showtimeMins = 18 * 60
  const dayStartMins = 9 * 60
  const dayDuration  = showtimeMins - dayStartMins

  const avgMins          = 34
  const workRemainingMins = remaining * avgMins
  const estFinishMins    = nowMins + workRemainingMins
  const minsAheadBehind  = showtimeMins - estFinishMins
  const isAhead          = minsAheadBehind >= 0
  const minsUntilShow    = Math.max(0, showtimeMins - nowMins)

  const clamp       = v => Math.min(100, Math.max(0, v))
  const progressPct = clamp((nowMins - dayStartMins) / dayDuration * 100)
  const estFinishPct = clamp((estFinishMins - dayStartMins) / dayDuration * 100)

  const allActivity = []
  models.forEach(m => {
    m.statusLog.forEach(entry => {
      allActivity.push({ id: `${m.id}-${entry.timestamp}`, modelName: m.name, artistName: entry.updatedBy, status: entry.status, timestamp: entry.timestamp })
    })
  })
  const recentActivity = allActivity.slice(-5).reverse()

  // ── Section: Attention Needed ─────────────────────────────────────────────
  const sAttention = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">ATTENTION NEEDED</p>
      {attentionNeeded.length === 0 ? (
        <p className="text-xs font-sans text-[#7A9E7E]">All clear ✓</p>
      ) : attentionNeeded.map(model => {
        const elapsed = timeInState(model)
        return (
          <div
            key={model.id}
            className="flex items-center gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0"
            style={{ borderLeft: '2px solid #C4614A', paddingLeft: 10, marginLeft: -12 }}
          >
            <img src={model.avatar} alt={model.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-[#111] dark:text-[#F0EDE8] leading-none">{model.name}</p>
              <p className="text-[10px] font-sans text-[#888580] mt-0.5">
                {model.assignedArtists[0]} · LOOK {model.lookNumber}
                {elapsed && <span className="ml-1">· {elapsed}</span>}
              </p>
            </div>
            <StatusChip status={model.status} small />
          </div>
        )
      })}
    </div>
  )

  // ── Section: Pace to Showtime ─────────────────────────────────────────────
  const sPace = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">PACE TO SHOWTIME</p>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-sans text-[#888580] mb-0.5">Estimated finish</p>
          <p className="font-serif text-3xl text-[#7A9E7E] leading-none">{fmtTime(estFinishMins)}</p>
          <p className="text-[11px] font-sans mt-1" style={{ color: isAhead ? '#7A9E7E' : '#C4614A' }}>
            {isAhead ? '↑' : '↓'} {formatMins(Math.abs(minsAheadBehind))} {isAhead ? 'ahead of' : 'behind'} showtime
          </p>
        </div>
        <div className="flex flex-col items-center">
          <DonutChart done={done} total={total} size={72} />
          <p className="text-[9px] tracking-widest uppercase font-sans text-[#888580] mt-1">COMPLETE</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
          <p className="font-serif text-2xl text-[#111] dark:text-[#F0EDE8] leading-none">{remaining}</p>
          <p className="text-[10px] font-sans text-[#888580] mt-1">models remaining</p>
        </div>
        <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
          <p className="font-serif text-2xl leading-none" style={{ color: workRemainingMins > minsUntilShow ? '#C4614A' : '#7A9E7E' }}>
            {formatMins(minsUntilShow)}
          </p>
          <p className="text-[10px] font-sans text-[#888580] mt-1">until showtime</p>
        </div>
      </div>
      <div className="relative mb-1">
        <div className="w-full h-1.5 rounded-full bg-[#E0DDD8] dark:bg-[#2E2B28] relative overflow-visible">
          <div className="absolute left-0 top-0 h-full rounded-full bg-[#7A9E7E]" style={{ width: `${progressPct}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#7A9E7E] opacity-50 rounded" style={{ left: `${estFinishPct}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#111] dark:bg-[#F0EDE8] rounded" style={{ left: 'calc(100% - 1px)' }} />
        </div>
      </div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[9px] font-sans text-[#888580]">9 AM</span>
        <span className="text-[9px] font-sans text-[#888580]">now · {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        <span className="text-[9px] font-sans text-[#888580]">6 PM</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7A9E7E] inline-block" /><span className="text-[9px] font-sans text-[#888580]">progress</span></span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7A9E7E] opacity-40 inline-block" /><span className="text-[9px] font-sans text-[#888580]">est. finish {fmtTime(estFinishMins)}</span></span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#111] dark:bg-[#F0EDE8] inline-block" /><span className="text-[9px] font-sans text-[#888580]">showtime 6 PM</span></span>
      </div>
    </div>
  )

  // ── Section: Manage Assignments button ───────────────────────────────────
  const sManageBtn = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <button
        onClick={() => setAssignmentsOpen(true)}
        className="w-full text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] rounded-lg text-[#111] dark:text-[#F0EDE8] outline-none"
        style={{ padding: '12px', cursor: 'pointer', background: 'none', minHeight: 44 }}
      >
        MANAGE ASSIGNMENTS
      </button>
    </div>
  )

  // ── Section: By Artist ────────────────────────────────────────────────────
  const sArtists = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">BY ARTIST</p>
      {artists.map(artist => {
        const assigned   = models.filter(m => m.assignedArtists.includes(artist.name))
        const artistDone = assigned.filter(m => m.status === 'done').length
        const isOpen     = expandedArtist === artist.id
        return (
          <div key={artist.id} className="border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            {/* Tappable header row — opens expand AND artist detail sheet */}
            <div className="flex items-center pt-3 pb-2 gap-2">
              <button
                onClick={() => setArtistDetail(artist)}
                className="flex items-center gap-2 flex-1 outline-none text-left min-w-0"
              >
                <img src={artist.avatar} alt={artist.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] block truncate">{artist.name}</span>
                  <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">{specialtyLabel(artist)}</span>
                </div>
              </button>
              <span className="text-[11px] font-sans text-[#888580]">{artistDone}/{assigned.length}</span>
              <button onClick={() => toggleArtist(artist.id)} className="outline-none p-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#888580]" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>
                  <polyline points="2 3.5 5 6.5 8 3.5" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-1 pl-10 pb-2">
              {assigned.map(m => <span key={m.id} className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: STATUS_DOT_COLOR[m.status] || '#C8C4BF' }} />)}
            </div>
            <div style={{ overflow: 'hidden', maxHeight: isOpen ? assigned.length * 36 + 8 : 0, transition: 'max-height 150ms ease' }}>
              <div className="pl-10 pb-3 pt-1">
                {assigned.map(m => (
                  <button key={m.id} onClick={() => setDetailModel(m)} className="flex items-center gap-2 w-full py-1.5 outline-none text-left">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_DOT_COLOR[m.status] || '#C8C4BF' }} />
                    <span className="text-[11px] font-sans text-[#111] dark:text-[#F0EDE8]">{m.name}</span>
                    <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] ml-1">· {STATUS_META[m.status]?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  // ── Section: Recent Activity ──────────────────────────────────────────────
  const sActivity = (
    <div className="pb-6">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">RECENT ACTIVITY</p>
      {recentActivity.map((a, i) => (
        <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
          <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: STATUS_DOT_COLOR[a.status] || '#C8C4BF' }} />
          <p className="flex-1 text-xs font-sans text-[#111] dark:text-[#F0EDE8] leading-snug">
            {a.artistName} marked {a.modelName} as {STATUS_META[a.status]?.label}
          </p>
          <span className="text-[10px] font-sans text-[#888580] flex-shrink-0 whitespace-nowrap">{a.timestamp}</span>
        </div>
      ))}
    </div>
  )

  const detailSheet = detailModel && (
    <ModelDetailSheet
      model={models.find(m => m.id === detailModel.id)}
      onClose={() => setDetailModel(null)}
      onStatusChange={(id, s) => { onStatusChange(id, s); setDetailModel(null) }}
      onNote={onNote}
    />
  )

  const artistDetailSheet = (
    <ArtistDetailSheet
      artist={artistDetail}
      models={models}
      open={!!artistDetail}
      onClose={() => setArtistDetail(null)}
    />
  )

  const assignmentsSheet = (
    <ManageAssignments
      open={assignmentsOpen}
      onClose={() => setAssignmentsOpen(false)}
      models={models}
      onAssignArtists={onAssignArtists}
      dark={dark}
    />
  )

  // ── Tablet: two-column ────────────────────────────────────────────────────
  if (isTablet) {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: attention + by artist + manage */}
        <div style={{ flex: '0 0 45%', overflowY: 'auto', padding: '16px 24px', borderRight: '1px solid' }} className="border-[#E0DDD8] dark:border-[#2E2B28]">
          {sAttention}
          {sArtists}
          {sManageBtn}
          {sActivity}
        </div>
        {/* Right: pace + stats */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {sPace}
        </div>
        {detailSheet}
        {assignmentsSheet}
        {artistDetailSheet}
      </div>
    )
  }

  // ── Mobile: single column (unchanged) ────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {sAttention}
      {sPace}
      {sArtists}
      {sManageBtn}
      {sActivity}
      {detailSheet}
      {assignmentsSheet}
      {artistDetailSheet}
    </div>
  )
}

function ArtistCard({ artist, models }) {
  const assigned = models.filter(m => m.assignedArtists.includes(artist.name))
  const done = assigned.filter(m => m.status === 'done').length
  return (
    <div className="flex items-center py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 gap-3">
      <img src={artist.avatar} alt={artist.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">{artist.name}</p>
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">{artist.role}</p>
        <div className="flex -space-x-1 mt-1">
          {assigned.slice(0, 5).map(m => (
            <img key={m.id} src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#1A1816]" />
          ))}
        </div>
      </div>
      <DonutChart done={done} total={assigned.length} size={60} />
    </div>
  )
}

function ArtistDashboard({ models, team, currentProfile }) {
  const myModels = models.filter(m => m.assignedArtists.includes(currentProfile.name))
  const done  = myModels.filter(m => m.status === 'done').length
  const peers = team.filter(p => (p.role === 'artist' || p.role === 'lead') && p.id !== currentProfile.id)

  const totalTime = myModels.reduce((acc, m) => {
    if (m.statusLog.length >= 2) return acc + 34
    if (m.statusLog.length === 1) return acc + 20
    return acc
  }, 0)
  const avg = myModels.length > 0 ? Math.round(totalTime / myModels.length) : 0

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxWidth: 700, width: '100%', margin: '0 auto' }}>
      <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">YOUR MODELS TODAY</p>
        <p className="text-xs font-sans text-[#888580] mb-3">{done} of {myModels.length} complete · avg {avg} min/model</p>
        {myModels.map(model => (
          <div key={model.id} className="flex items-center gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <img src={model.avatar} alt={model.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{model.name}</p>
              <p className="text-[10px] font-sans text-[#888580]">LOOK {model.lookNumber}</p>
            </div>
            <StatusChip status={model.status} small />
          </div>
        ))}
      </div>
      <div className="pb-6">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">YOUR TEAM</p>
        {peers.map(a => <ArtistCard key={a.id} artist={a} models={models} />)}
      </div>
    </div>
  )
}

export default function DashboardView({ models, team, notifications, currentProfile, onStatusChange, onNote, onAssignArtists, dark }) {
  const isArtist = currentProfile.role === 'artist'
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {isArtist
        ? <ArtistDashboard models={models} team={team} currentProfile={currentProfile} />
        : <LeadDashboard models={models} team={team} notifications={notifications} onStatusChange={onStatusChange} onNote={onNote} onAssignArtists={onAssignArtists} dark={dark} />
      }
    </div>
  )
}
