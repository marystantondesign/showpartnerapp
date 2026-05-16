import { useState } from 'react'
import { STATUS_META } from '../data/mockData'
import DonutChart from '../components/DonutChart'
import StatusChip from '../components/StatusChip'
import ModelDetailSheet from '../components/ModelDetailSheet'

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
  const diffMs = Date.now() - t.getTime()
  const diffMins = Math.max(0, Math.floor(diffMs / 60000))
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

function LeadDashboard({ models, team, notifications, onStatusChange, onNote }) {
  const [detailModel, setDetailModel] = useState(null)
  const [expandedArtist, setExpandedArtist] = useState(null)

  function toggleArtist(id) {
    setExpandedArtist(prev => prev === id ? null : id)
  }

  const total = models.length
  const done = models.filter(m => m.status === 'done').length
  const remaining = total - done

  const attentionNeeded = models.filter(m => m.status === 'paused' || m.status === 'needs_revisit')
  const artists = team.filter(p => p.role === 'artist' || p.role === 'lead')

  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const showtimeMins = 18 * 60  // 6:00 PM
  const dayStartMins = 9 * 60   // 9:00 AM
  const dayDuration = showtimeMins - dayStartMins

  // Pace calculation: avg time per completed model
  const completedModels = models.filter(m => m.status === 'done')
  const avgMins = completedModels.length > 0 ? 34 : 38  // mock avg based on log data
  const workRemainingMins = remaining * avgMins
  const estFinishMins = nowMins + workRemainingMins
  const minsAheadBehind = showtimeMins - estFinishMins  // positive = ahead
  const isAhead = minsAheadBehind >= 0
  const minsUntilShow = Math.max(0, showtimeMins - nowMins)

  // Timeline bar percents (clamped 0–100)
  const clamp = (v) => Math.min(100, Math.max(0, v))
  const progressPct   = clamp((nowMins - dayStartMins) / dayDuration * 100)
  const estFinishPct  = clamp((estFinishMins - dayStartMins) / dayDuration * 100)
  // showtime always at 100%

  // Build activity from statusLogs across all models
  const allActivity = []
  models.forEach(m => {
    m.statusLog.forEach(entry => {
      allActivity.push({
        id: `${m.id}-${entry.timestamp}`,
        modelName: m.name,
        artistName: entry.updatedBy,
        status: entry.status,
        timestamp: entry.timestamp,
      })
    })
  })
  // Sort newest first using mock timestamps
  const recentActivity = allActivity.slice(-5).reverse()

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">

      {/* 1. ATTENTION NEEDED */}
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

      {/* 2. PACE TO SHOWTIME */}
      <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">PACE TO SHOWTIME</p>

        {/* Top row: countdown + donut */}
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

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
            <p className="font-serif text-2xl text-[#111] dark:text-[#F0EDE8] leading-none">{remaining}</p>
            <p className="text-[10px] font-sans text-[#888580] mt-1">models remaining</p>
          </div>
          <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2.5">
            <p
              className="font-serif text-2xl leading-none"
              style={{ color: workRemainingMins > minsUntilShow ? '#C4614A' : '#7A9E7E' }}
            >
              {formatMins(minsUntilShow)}
            </p>
            <p className="text-[10px] font-sans text-[#888580] mt-1">until showtime</p>
          </div>
        </div>

        {/* Timeline bar */}
        <div className="relative mb-1">
          {/* Track */}
          <div className="w-full h-1.5 rounded-full bg-[#E0DDD8] dark:bg-[#2E2B28] relative overflow-visible">
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#7A9E7E]"
              style={{ width: `${progressPct}%` }}
            />
            {/* Est finish marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#7A9E7E] opacity-50 rounded"
              style={{ left: `${estFinishPct}%` }}
            />
            {/* Showtime marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#111] dark:bg-[#F0EDE8] rounded"
              style={{ left: `calc(100% - 1px)` }}
            />
          </div>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[9px] font-sans text-[#888580]">9 AM</span>
          <span className="text-[9px] font-sans text-[#888580]">now · {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="text-[9px] font-sans text-[#888580]">6 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7A9E7E] inline-block" />
            <span className="text-[9px] font-sans text-[#888580]">progress</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7A9E7E] opacity-40 inline-block" />
            <span className="text-[9px] font-sans text-[#888580]">est. finish {fmtTime(estFinishMins)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#111] dark:bg-[#F0EDE8] inline-block" />
            <span className="text-[9px] font-sans text-[#888580]">showtime 6 PM</span>
          </span>
        </div>
      </div>

      {/* 3. BY ARTIST */}
      <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">BY ARTIST</p>
        {artists.map(artist => {
          const assigned = models.filter(m => m.assignedArtists.includes(artist.name))
          const artistDone = assigned.filter(m => m.status === 'done').length
          const isOpen = expandedArtist === artist.id
          return (
            <div key={artist.id} className="border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
              {/* Tappable header row */}
              <button
                onClick={() => toggleArtist(artist.id)}
                className="w-full outline-none pt-3 pb-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={artist.avatar} alt={artist.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <span className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] flex-1 text-left">{artist.name}</span>
                  <span className="text-[11px] font-sans text-[#888580] mr-1">{artistDone}/{assigned.length}</span>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                    className="text-[#888580] flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
                  >
                    <polyline points="2 3.5 5 6.5 8 3.5" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-1 pl-10">
                  {assigned.map(m => (
                    <span
                      key={m.id}
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: STATUS_DOT_COLOR[m.status] || '#C8C4BF' }}
                    />
                  ))}
                </div>
              </button>

              {/* Expanded model list */}
              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? assigned.length * 36 + 8 : 0,
                  transition: 'max-height 150ms ease',
                }}
              >
                <div className="pl-10 pb-3 pt-1">
                  {assigned.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setDetailModel(m)}
                      className="flex items-center gap-2 w-full py-1.5 outline-none text-left"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUS_DOT_COLOR[m.status] || '#C8C4BF' }}
                      />
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

      {/* 4. RECENT ACTIVITY */}
      <div className="pb-6">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">RECENT ACTIVITY</p>
        {recentActivity.map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <div
              className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: STATUS_DOT_COLOR[a.status] || '#C8C4BF' }}
            />
            <p className="flex-1 text-xs font-sans text-[#111] dark:text-[#F0EDE8] leading-snug">
              {a.artistName} marked {a.modelName} as {STATUS_META[a.status]?.label}
            </p>
            <span className="text-[10px] font-sans text-[#888580] flex-shrink-0 whitespace-nowrap">{a.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Model detail sheet from dot tap */}
      {detailModel && (
        <ModelDetailSheet
          model={models.find(m => m.id === detailModel.id)}
          onClose={() => setDetailModel(null)}
          onStatusChange={(id, s) => { onStatusChange(id, s); setDetailModel(null) }}
          onNote={onNote}
        />
      )}
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
  const done = myModels.filter(m => m.status === 'done').length
  const peers = team.filter(p => (p.role === 'artist' || p.role === 'lead') && p.id !== currentProfile.id)

  const totalTime = myModels.reduce((acc, m) => {
    if (m.statusLog.length >= 2) return acc + 34
    if (m.statusLog.length === 1) return acc + 20
    return acc
  }, 0)
  const avg = myModels.length > 0 ? Math.round(totalTime / myModels.length) : 0

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* Your models */}
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

      {/* Your team */}
      <div className="pb-6">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">YOUR TEAM</p>
        {peers.map(a => <ArtistCard key={a.id} artist={a} models={models} />)}
      </div>
    </div>
  )
}

export default function DashboardView({ models, team, notifications, currentProfile, onStatusChange, onNote }) {
  const isArtist = currentProfile.role === 'artist'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {isArtist
        ? <ArtistDashboard models={models} team={team} currentProfile={currentProfile} />
        : <LeadDashboard models={models} team={team} notifications={notifications} onStatusChange={onStatusChange} onNote={onNote} />
      }
    </div>
  )
}
