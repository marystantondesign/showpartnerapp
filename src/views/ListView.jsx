import { useState } from 'react'
import { STATUS_META, STATUS_ORDER, cycleStatus } from '../data/mockData'
import StatusChip from '../components/StatusChip'
import ModelDetailSheet from '../components/ModelDetailSheet'
import { useIsTablet } from '../hooks/useIsTablet'

function statusSummary(models) {
  const counts = {}
  STATUS_ORDER.forEach(s => { counts[s] = 0 })
  models.forEach(m => { counts[m.status]++ })
  return counts
}

const SHORT_LABEL = {
  not_started: 'NOT STARTED',
  in_progress: 'IN PROG',
  paused: 'PAUSED',
  needs_revisit: 'REVISIT',
  done: 'DONE',
}

export default function ListView({ models, currentProfile, onStatusChange, onNote }) {
  const [filterStatus, setFilterStatus] = useState(null)
  const [gridView, setGridView] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const isTablet = useIsTablet()

  const assignedToMe = currentProfile.role === 'artist'
    ? models.filter(m => m.assignedArtists.includes(currentProfile.name))
    : models

  const visible = filterStatus
    ? assignedToMe.filter(m => m.status === filterStatus)
    : assignedToMe

  const counts = statusSummary(assignedToMe)
  const activeCounts = STATUS_ORDER.filter(s => counts[s] > 0)

  // ── Shared: filter bar ───────────────────────────────────────────────────
  const filterBar = (
    <div className="px-4 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
      <div className="flex items-start gap-2">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {activeCounts.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(f => f === s ? null : s)}
              style={{
                backgroundColor: STATUS_META[s].color,
                outline: filterStatus === s ? '2px solid #111' : 'none',
                outlineOffset: 1,
                minHeight: isTablet ? 32 : undefined,
              }}
              className="text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-[4px] rounded-full text-[#111] whitespace-nowrap flex-shrink-0"
            >
              {counts[s]} {SHORT_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          <button onClick={() => setGridView(false)} className={`outline-none ${!gridView ? 'text-[#111] dark:text-[#F0EDE8]' : 'text-[#B0ACA7]'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="1" y1="12" x2="15" y2="12"/>
            </svg>
          </button>
          <button onClick={() => setGridView(true)} className={`outline-none ${gridView ? 'text-[#111] dark:text-[#F0EDE8]' : 'text-[#B0ACA7]'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/>
              <rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  // ── Shared: model list/grid ───────────────────────────────────────────────
  const modelList = (
    <div className="flex-1 overflow-y-auto">
      {!gridView ? (
        visible.map(model => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            style={{ minHeight: isTablet ? 64 : undefined }}
            className={`flex items-center gap-3 w-full px-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none text-left ${isTablet ? 'py-4' : 'py-3'} ${selectedModel?.id === model.id && isTablet ? 'bg-white/50 dark:bg-white/5' : ''}`}
          >
            <img src={model.avatar} alt={model.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-sans text-[#888580] tabular-nums">{model.lookNumber}</span>
                <span className="font-serif text-base text-[#111] dark:text-[#F0EDE8] truncate">{model.name}</span>
              </div>
              <p className="text-[11px] font-sans text-[#888580] truncate">{model.assignedArtists.join(', ')}</p>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 gap-1">
              <StatusChip
                status={model.status}
                onClick={(e) => { e.stopPropagation(); onStatusChange(model.id, cycleStatus(model.status)) }}
                small
              />
              {model.statusLog.length > 0 && (
                <span className="text-[10px] font-sans text-[#B0ACA7]">
                  {model.statusLog[model.statusLog.length - 1].timestamp}
                </span>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className="grid grid-cols-2 gap-px bg-[#E0DDD8] dark:bg-[#2E2B28]">
          {visible.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="flex flex-col bg-greige dark:bg-greige-dark outline-none p-3 gap-2"
            >
              <img src={model.avatar} alt={model.name} className="w-full aspect-square object-cover rounded" />
              <div>
                <p className="font-serif text-sm text-[#111] dark:text-[#F0EDE8] truncate">{model.name}</p>
                <p className="text-[10px] tracking-wide font-sans text-[#888580]">LOOK {model.lookNumber}</p>
              </div>
              <StatusChip status={model.status} small />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // ── Tablet: two-column layout ─────────────────────────────────────────────
  if (isTablet) {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: filter + list (fixed 400px) */}
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid', borderColor: 'var(--border, #E0DDD8)' }} className="border-[#E0DDD8] dark:border-[#2E2B28]">
          {filterBar}
          {modelList}
        </div>

        {/* Right: detail panel */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {selectedModel ? (
            <ModelDetailSheet
              model={models.find(m => m.id === selectedModel.id)}
              onClose={() => setSelectedModel(null)}
              onStatusChange={onStatusChange}
              onNote={onNote}
              currentProfile={currentProfile}
              panel
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[#C8C4BF]">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <p style={{ fontFamily: 'Inter, system-ui', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0ACA7' }}>Select a model</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Mobile: original layout ───────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {filterBar}
      {modelList}
      {selectedModel && (
        <ModelDetailSheet
          model={models.find(m => m.id === selectedModel.id)}
          onClose={() => setSelectedModel(null)}
          onStatusChange={onStatusChange}
          onNote={onNote}
          currentProfile={currentProfile}
        />
      )}
    </div>
  )
}
