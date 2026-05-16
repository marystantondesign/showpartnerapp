import { useState } from 'react'
import BottomSheet from './BottomSheet'
import StatusChip from './StatusChip'
import { STATUS_META, STATUS_ORDER, cycleStatus } from '../data/mockData'

export default function ModelDetailSheet({ model, onClose, onStatusChange, onNote }) {
  const [note, setNote] = useState(model?.notes || '')

  if (!model) return null

  const allStatuses = STATUS_ORDER

  return (
    <BottomSheet open onClose={onClose} height="88%" noPadding>
      {/* Photo header */}
      <div className="relative w-full h-48 flex-shrink-0">
        <img src={model.avatar} alt={model.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h2 className="font-serif text-2xl text-white leading-tight">{model.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] tracking-widest uppercase font-sans text-white/70">LOOK {model.lookNumber}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8">
        {/* Current status chip */}
        <div className="mb-4">
          <StatusChip status={model.status} onClick={() => onStatusChange(model.id, cycleStatus(model.status))} />
        </div>

        {/* Artists */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">ARTISTS</p>
          <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">{model.assignedArtists.join(', ')}</p>
        </div>

        <div className="h-px bg-[#E0DDD8] dark:bg-[#2E2B28] mb-5" />

        {/* Update status row */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">UPDATE STATUS</p>
          <div className="flex flex-wrap gap-2">
            {allStatuses.map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(model.id, s)}
                style={{
                  backgroundColor: STATUS_META[s].color,
                  outline: model.status === s ? '2px solid #111' : 'none',
                  outlineOffset: 2,
                }}
                className="text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-[4px] rounded-full text-[#111]"
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#E0DDD8] dark:bg-[#2E2B28] mb-5" />

        {/* Timeline */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">TIMELINE</p>
          {model.statusLog.length === 0 && (
            <p className="text-xs text-[#888580] font-sans">No activity yet.</p>
          )}
          {[...model.statusLog].reverse().map((entry, i) => {
            const meta = STATUS_META[entry.status]
            return (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: meta?.color || '#888' }} />
                <div className="flex-1">
                  <span className="text-xs font-sans text-[#111] dark:text-[#F0EDE8]">
                    {entry.status === 'in_progress' ? `Sat in ${entry.updatedBy}'s chair` :
                     entry.status === 'done' ? `Marked Done by ${entry.updatedBy}` :
                     entry.status === 'paused' ? `Paused` :
                     entry.status === 'needs_revisit' ? `Marked Needs Revisit by ${entry.updatedBy}` :
                     meta?.label}
                  </span>
                </div>
                <span className="text-[10px] font-sans text-[#888580] flex-shrink-0">{entry.timestamp}</span>
              </div>
            )
          })}
        </div>

        <div className="h-px bg-[#E0DDD8] dark:bg-[#2E2B28] mb-5" />

        {/* Notes */}
        <div>
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">NOTES</p>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); onNote && onNote(model.id, e.target.value) }}
            placeholder="Add a note..."
            rows={3}
            className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border-0 outline-none border-b border-[#E0DDD8] dark:border-[#2E2B28] pb-1"
          />
        </div>
      </div>
    </BottomSheet>
  )
}
