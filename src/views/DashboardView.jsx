import { useState } from 'react'
import { STATUS_META, cycleStatus } from '../data/mockData'
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

// ─── Artist detail — bottom sheet (mobile) or right panel (tablet) ────────────
function ArtistDetailSheet({ artist, models, open, onClose, currentProfile }) {
  const [stars, setStars]         = useState(0)
  const [note, setNote]           = useState('')
  const [incidents, setIncidents] = useState([])
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ type: 'Late Arrival', notes: '' })
  const [pending, setPending]     = useState(null)   // waiting for confirm
  const [editId, setEditId]       = useState(null)   // id being edited (lead only)
  const isTablet  = useIsTablet()
  const isLead    = currentProfile?.role === 'lead'

  if (!artist) return null
  const assigned = models.filter(m => m.assignedArtists.includes(artist.name))

  function handleSubmit() {
    const inc = { id: Date.now(), artist: artist.name, type: form.type, notes: form.notes, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }
    if (editId != null) {
      setIncidents(prev => prev.map(i => i.id === editId ? inc : i))
      setEditId(null)
    } else {
      setPending(inc)
    }
    setShowForm(false)
    setForm({ type: 'Late Arrival', notes: '' })
  }

  function handleConfirm() {
    if (pending) { setIncidents(prev => [...prev, pending]); setPending(null) }
  }

  function handleEdit(inc) {
    setForm({ type: inc.type, notes: inc.notes })
    setEditId(inc.id)
    setShowForm(true)
  }

  function handleDelete(id) {
    setIncidents(prev => prev.filter(i => i.id !== id))
  }

  const TYPES = ['Late Arrival', 'Left Early', 'No Show', 'Medical', 'Other']

  const body = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-4 pb-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <img src={artist.avatar} alt={artist.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
        <div>
          <p className="font-serif text-xl text-[#111] dark:text-[#F0EDE8]">{artist.name}</p>
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mt-0.5">{specialtyLabel(artist)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Skill tags */}
        {artist.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {artist.tags.map(tag => (
              <span key={tag} className="text-[10px] font-sans text-[#888580] border border-[#D0CCC7] dark:border-[#3A3632] rounded-full px-2.5 py-1">{tag}</span>
            ))}
          </div>
        )}

        {/* Models */}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">TODAY'S MODELS</p>
        {assigned.length === 0 ? (
          <p className="text-xs font-sans text-[#888580] mb-5">No models assigned.</p>
        ) : assigned.map(m => (
          <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 mb-0">
            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <span className="flex-1 font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{m.name}</span>
            <span className="text-[10px] font-sans text-[#888580] mr-2">LOOK {m.lookNumber}</span>
            <StatusChip status={m.status} small />
          </div>
        ))}

        {/* Stars rating */}
        <div className="mt-5 mb-4">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">RATE THIS ARTIST</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setStars(stars === n ? 0 : n)}
                className="outline-none"
                style={{ fontSize: 24, color: n <= stars ? '#D4A853' : '#D0CCC7', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', transition: 'color 100ms' }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">NOTES</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Performance notes for post-show review…"
            rows={3}
            className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border-0 outline-none border-b border-[#E0DDD8] dark:border-[#2E2B28] pb-1"
          />
        </div>

        {/* FLAG INCIDENT */}
        {!showForm && !pending && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 text-[10px] tracking-widest uppercase font-sans border border-[#C4614A] rounded-lg text-[#C4614A] bg-transparent outline-none cursor-pointer mb-4"
            style={{ transition: 'opacity 150ms' }}
          >
            FLAG INCIDENT
          </button>
        )}

        {/* Incident form */}
        {showForm && (
          <div className="border border-[#E0DDD8] dark:border-[#2E2B28] rounded-lg p-4 mb-4">
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">{editId != null ? 'EDIT INCIDENT' : 'FLAG INCIDENT'}</p>
            <div className="mb-3">
              <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">TYPE</p>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] border border-[#D0CCC7] dark:border-[#3A3632] rounded px-2 py-1.5 outline-none"
              >
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">NOTES</p>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="What happened?"
                rows={3}
                className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border border-[#D0CCC7] dark:border-[#3A3632] rounded px-2 py-1.5 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-[#111] bg-[#D4A853] border-none rounded cursor-pointer outline-none font-semibold">
                {editId != null ? 'SAVE' : 'CONTINUE →'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm({ type: 'Late Arrival', notes: '' }) }} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border border-[#D0CCC7] dark:border-[#3A3632] rounded cursor-pointer outline-none">
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Confirmation dialog */}
        {pending && (
          <div className="border border-[#C4614A] rounded-lg p-4 mb-4">
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#C4614A] mb-2">CONFIRM INCIDENT</p>
            <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] mb-1">
              <span className="font-medium">{pending.type}</span> — {pending.notes}
            </p>
            {!isLead && (
              <p className="text-[11px] font-sans text-[#888580] mb-3">Only the Producer can edit this once submitted.</p>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={handleConfirm} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-white bg-[#C4614A] border-none rounded cursor-pointer outline-none font-semibold">
                YES, SUBMIT
              </button>
              <button onClick={() => setPending(null)} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border border-[#D0CCC7] dark:border-[#3A3632] rounded cursor-pointer outline-none">
                GO BACK
              </button>
            </div>
          </div>
        )}

        {/* Logged incidents */}
        {incidents.length > 0 && (
          <div>
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">INCIDENT LOG</p>
            {incidents.map(inc => (
              <div key={inc.id} className="flex items-start gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0" style={{ borderLeft: '2px solid #C4614A', paddingLeft: 10, marginLeft: -12 }}>
                <div className="flex-1">
                  <p className="text-[11px] font-sans text-[#C4614A] font-medium">{inc.type}</p>
                  <p className="text-xs font-sans text-[#888580]">{inc.notes}</p>
                  <p className="text-[10px] font-sans text-[#B0ACA7] mt-0.5">{inc.time}</p>
                </div>
                {isLead && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(inc)} className="text-[9px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border-none cursor-pointer outline-none">EDIT</button>
                    <button onClick={() => handleDelete(inc.id)} className="text-[9px] tracking-widest uppercase font-sans text-[#C4614A] bg-transparent border-none cursor-pointer outline-none">DELETE</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Tablet: fixed right-side panel; Mobile: BottomSheet
  if (isTablet) {
    if (!open) return null
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={onClose}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 380 }}
          className="bg-greige dark:bg-greige-dark border-l border-[#E0DDD8] dark:border-[#2E2B28]"
          onClick={e => e.stopPropagation()}
        >
          {body}
        </div>
      </div>
    )
  }

  return (
    <BottomSheet open={open} onClose={onClose} height="85%" noPadding>
      {body}
    </BottomSheet>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
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
  const d = new Date(); d.setHours(h, m, 0, 0); return d
}

function timeInState(model) {
  if (!model.statusLog.length) return null
  const last = model.statusLog[model.statusLog.length - 1]
  const t = parseLogTime(last.timestamp)
  if (!t) return null
  const diffMins = Math.max(0, Math.floor((Date.now() - t.getTime()) / 60000))
  return diffMins < 60 ? `${diffMins}m` : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`
}

function formatMins(mins) {
  if (mins <= 0) return '0m'
  const h = Math.floor(mins / 60), m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtTime(totalMins) {
  const h = Math.floor(totalMins / 60) % 24, m = totalMins % 60
  const ampm = h >= 12 ? 'PM' : 'AM', hh = h % 12 || 12
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

// ─── Lead / Assistant Dashboard ───────────────────────────────────────────────
function LeadDashboard({ models, team, notifications, onStatusChange, onNote, onAssignArtists, dark, currentProfile }) {
  const [detailModel, setDetailModel]     = useState(null)
  const [expandedArtist, setExpandedArtist] = useState(null)
  const [assignmentsOpen, setAssignmentsOpen] = useState(false)
  const [artistDetail, setArtistDetail]   = useState(null)
  const isTablet  = useIsTablet()
  const isLead    = currentProfile?.role === 'lead'

  function toggleArtist(id) {
    setExpandedArtist(prev => prev === id ? null : id)
  }

  const total     = models.length
  const done      = models.filter(m => m.status === 'done').length
  const remaining = total - done

  // Role-scoped attention needed
  const attentionNeeded = isLead
    ? models.filter(m => m.status === 'paused' || m.status === 'needs_revisit')
    : models.filter(m => (m.status === 'paused' || m.status === 'needs_revisit') && m.assignedArtists.includes(currentProfile?.name))

  // BY ARTIST — Lead only; never includes lead profile
  const artists = isLead ? team.filter(p => p.role === 'artist') : []

  const now          = new Date()
  const nowMins      = now.getHours() * 60 + now.getMinutes()
  const showtimeMins = 18 * 60
  const dayStartMins = 9 * 60
  const dayDuration  = showtimeMins - dayStartMins

  const avgMins          = 34
  const workRemainingMins = remaining * avgMins
  const estFinishMins    = nowMins + workRemainingMins
  const minsAheadBehind  = showtimeMins - estFinishMins
  const isAhead          = minsAheadBehind >= 0

  const clamp        = v => Math.min(100, Math.max(0, v))
  const progressPct  = clamp((nowMins - dayStartMins) / dayDuration * 100)
  const estFinishPct = clamp((estFinishMins - dayStartMins) / dayDuration * 100)

  // Role-scoped activity feed
  const allActivity = []
  models.forEach(m => {
    m.statusLog.forEach(entry => {
      allActivity.push({ id: `${m.id}-${entry.timestamp}`, modelName: m.name, artistName: entry.updatedBy, status: entry.status, timestamp: entry.timestamp })
    })
  })
  const recentActivity = isLead
    ? allActivity.slice(-8).reverse()
    : allActivity.filter(a => a.artistName === currentProfile?.name).slice(-5).reverse()

  // ── Manage Assignments button ──────────────────────────────────────────────
  const sManageBtn = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <button
        onClick={() => setAssignmentsOpen(true)}
        className="w-full text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] rounded-lg text-[#111] dark:text-[#F0EDE8] outline-none bg-transparent cursor-pointer"
        style={{ padding: '12px', minHeight: 44 }}
      >
        MANAGE ASSIGNMENTS
      </button>
    </div>
  )

  // ── Attention Needed ──────────────────────────────────────────────────────
  const sAttention = (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">ATTENTION NEEDED</p>
      {attentionNeeded.length === 0 ? (
        <p className="text-xs font-sans text-[#7A9E7E]">All clear ✓</p>
      ) : attentionNeeded.map(model => {
        const elapsed = timeInState(model)
        return (
          <div key={model.id} className="flex items-center gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0" style={{ borderLeft: '2px solid #C4614A', paddingLeft: 10, marginLeft: -12 }}>
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

  // ── Pace to Showtime (simplified — no stat cards) ─────────────────────────
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
      {/* Timeline bar */}
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

  // ── BY ARTIST (Lead only) ─────────────────────────────────────────────────
  const sArtists = isLead ? (
    <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">BY ARTIST</p>
      {artists.map(artist => {
        const assigned   = models.filter(m => m.assignedArtists.includes(artist.name))
        const artistDone = assigned.filter(m => m.status === 'done').length
        const isOpen     = expandedArtist === artist.id
        return (
          <div key={artist.id} className="border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <div className="flex items-center pt-3 pb-2 gap-2">
              <button onClick={() => setArtistDetail(artist)} className="flex items-center gap-2 flex-1 outline-none text-left min-w-0">
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
  ) : null

  // ── Recent Activity ───────────────────────────────────────────────────────
  const sActivity = (
    <div className="pb-6">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">RECENT ACTIVITY</p>
      {recentActivity.length === 0 ? (
        <p className="text-xs font-sans text-[#888580]">No activity yet.</p>
      ) : recentActivity.map((a, i) => (
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

  const assignmentsSheet = (
    <ManageAssignments
      open={assignmentsOpen}
      onClose={() => setAssignmentsOpen(false)}
      models={models}
      onAssignArtists={onAssignArtists}
      dark={dark}
    />
  )

  const artistDetailSheet = (
    <ArtistDetailSheet
      artist={artistDetail}
      models={models}
      open={!!artistDetail}
      onClose={() => setArtistDetail(null)}
      currentProfile={currentProfile}
    />
  )

  // ── iPad two-column ───────────────────────────────────────────────────────
  if (isTablet) {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Manage Assignments + Attention Needed + BY ARTIST (Lead only) */}
        <div style={{ flex: '0 0 45%', overflowY: 'auto', padding: '16px 24px', borderRight: '1px solid' }} className="border-[#E0DDD8] dark:border-[#2E2B28]">
          {sManageBtn}
          {sAttention}
          {sArtists}
        </div>
        {/* Right: Pace (simplified) + Recent Activity */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {sPace}
          {sActivity}
        </div>
        {detailSheet}
        {assignmentsSheet}
        {artistDetailSheet}
      </div>
    )
  }

  // ── Mobile: single column ─────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {sManageBtn}
      {sAttention}
      {sPace}
      {sArtists}
      {sActivity}
      {detailSheet}
      {assignmentsSheet}
      {artistDetailSheet}
    </div>
  )
}

// ─── Artist Dashboard (artist role) ──────────────────────────────────────────
function ArtistDashboard({ models, currentProfile, onStatusChange, onNote }) {
  const [detailModel, setDetailModel] = useState(null)

  const myModels  = models.filter(m => m.assignedArtists.includes(currentProfile.name))
  const done      = myModels.filter(m => m.status === 'done').length
  const remaining = myModels.length - done

  // Average pace from completed models
  const avgMins = 34

  // Countdown
  const now      = new Date()
  const nowMins  = now.getHours() * 60 + now.getMinutes()
  const estDone  = nowMins + remaining * avgMins

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxWidth: 600, width: '100%', margin: '0 auto' }}>
      {/* Summary header */}
      <div className="pb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] mb-4">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">YOUR MODELS TODAY</p>
        <p className="text-xs font-sans text-[#888580] mb-2">
          {done} of {myModels.length} complete · avg {avgMins} min/model
        </p>
        {remaining > 0 ? (
          <p className="font-serif text-[22px] text-[#7A9E7E] leading-tight">
            Est. done by {fmtTime(estDone)}
          </p>
        ) : (
          <p className="font-serif text-[22px] text-[#7A9E7E] leading-tight">All done ✓</p>
        )}
      </div>

      {/* Model list */}
      {myModels.length === 0 ? (
        <p className="text-xs font-sans text-[#888580]">No models assigned to you today.</p>
      ) : myModels.map(model => (
        <button
          key={model.id}
          onClick={() => setDetailModel(model)}
          className="flex items-center gap-3 w-full py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none text-left"
          style={{ minHeight: 56 }}
        >
          <img src={model.avatar} alt={model.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-sans text-[#888580] tabular-nums">{model.lookNumber}</span>
              <span className="font-serif text-base text-[#111] dark:text-[#F0EDE8] truncate">{model.name}</span>
            </div>
            <p className="text-[11px] font-sans text-[#888580] truncate">{model.assignedArtists.filter(a => a !== currentProfile.name).join(', ') || '—'}</p>
          </div>
          <StatusChip
            status={model.status}
            onClick={e => { e.stopPropagation(); onStatusChange(model.id, cycleStatus(model.status)) }}
            small
          />
        </button>
      ))}

      {detailModel && (
        <ModelDetailSheet
          model={models.find(m => m.id === detailModel.id)}
          onClose={() => setDetailModel(null)}
          onStatusChange={onStatusChange}
          onNote={onNote}
          currentProfile={currentProfile}
        />
      )}
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DashboardView({ models, team, notifications, currentProfile, onStatusChange, onNote, onAssignArtists, dark }) {
  const isArtist = currentProfile.role === 'artist'
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {isArtist
        ? <ArtistDashboard models={models} currentProfile={currentProfile} onStatusChange={onStatusChange} onNote={onNote} />
        : <LeadDashboard models={models} team={team} notifications={notifications} onStatusChange={onStatusChange} onNote={onNote} onAssignArtists={onAssignArtists} dark={dark} currentProfile={currentProfile} />
      }
    </div>
  )
}
