import { useState } from 'react'
import BottomSheet from './BottomSheet'
import StatusChip from './StatusChip'
import { STATUS_META, STATUS_ORDER, cycleStatus } from '../data/mockData'

export default function ModelDetailSheet({ model, onClose, onStatusChange, onNote, currentProfile }) {
  const [note, setNote] = useState(model?.notes || '')
  const [photos, setPhotos] = useState(model?.photos || [])
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  if (!model) return null

  const allStatuses = STATUS_ORDER

  function handleUpload() {
    const newPhoto = {
      id: `ph-${Date.now()}`,
      url: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
      uploadedBy: currentProfile?.name || 'You',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      label: 'Today',
    }
    setPhotos(prev => [...prev, newPhoto])
  }

  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <BottomSheet open onClose={onClose} height="88%" noPadding>
      {/* Expanded photo overlay */}
      {expandedPhoto && (
        <div
          className="absolute inset-0 z-50 flex flex-col bg-black"
          style={{ borderRadius: 'inherit' }}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
            <span className="text-[10px] tracking-widest uppercase font-sans text-white/60">
              {expandedPhoto.label} · {expandedPhoto.timestamp}
            </span>
            <button
              onClick={() => setExpandedPhoto(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 outline-none"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-8">
            <img
              src={expandedPhoto.url}
              alt={expandedPhoto.label}
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: '70vh' }}
            />
          </div>
          <div className="px-4 pb-6 flex-shrink-0">
            <p className="text-[11px] font-sans text-white/50">by {expandedPhoto.uploadedBy}</p>
          </div>
        </div>
      )}

      {/* Photo header */}
      <div className="relative w-full flex-shrink-0" style={{ height: 224 }}>
        <img src={model.avatar} alt={model.name} className="w-full h-full object-cover object-top" />
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

        {/* Photos */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">PHOTOS</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {photos.map(photo => (
              <button
                key={photo.id}
                onClick={() => setExpandedPhoto(photo)}
                className="flex-shrink-0 flex flex-col gap-1 outline-none"
              >
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="rounded-lg object-cover"
                  style={{ width: 80, height: 80 }}
                />
                <span className="text-[9px] font-sans text-[#888580] text-center w-20 truncate">{photo.label} · {photo.timestamp}</span>
              </button>
            ))}
            {/* Upload button */}
            <button
              onClick={handleUpload}
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#C8C4BF] dark:border-[#3A3632] outline-none gap-1"
              style={{ width: 80, height: 80 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]">
                <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
              </svg>
              <span className="text-[8px] tracking-widest uppercase font-sans text-[#888580]">UPLOAD</span>
            </button>
          </div>
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
