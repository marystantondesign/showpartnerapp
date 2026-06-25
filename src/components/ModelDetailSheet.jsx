import { useState } from 'react'
import BottomSheet from './BottomSheet'
import StatusChip from './StatusChip'
import { STATUS_META, STATUS_ORDER, cycleStatus, modelHistory } from '../data/mockData'

// ─── Helpers ───────────────────────────────────────────────────────────────────────────
function formatPhotoTs(ts) {
  // Just show the timestamp as stored — seeded photos now use "Apr 12, 2026" format
  return ts || ''
}

function roleChip(authorRole, authorSpecialty) {
  if (authorRole === 'lead') return 'PRODUCER'
  if (authorRole === 'artist' && authorSpecialty) return authorSpecialty.toUpperCase()
  return authorRole?.toUpperCase() || 'TEAM'
}

function fmtCreatedAt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// ─── Main component ─────────────────────────────────────────────────────────────────────
export default function ModelDetailSheet({ model, onClose, onStatusChange, onNote, currentProfile, panel }) {
  const [photos, setPhotos]               = useState(model?.photos || [])
  const [expandedPhoto, setExpandedPhoto] = useState(null)
  const [deletePhotoId, setDeletePhotoId] = useState(null)  // confirm deletion

  // Notes — stored as array
  const [notes, setNotes]               = useState(() => Array.isArray(model?.notes) ? model.notes : [])
  const [addingNote, setAddingNote]     = useState(false)
  const [editingNote, setEditingNote]   = useState(null)  // note object being edited
  const [noteText, setNoteText]         = useState('')

  const [showHistoryOpen, setShowHistoryOpen] = useState(false)

  if (!model) return null

  const allStatuses  = STATUS_ORDER
  const isLead       = currentProfile?.role === 'lead'
  const isAssistant  = currentProfile?.role === 'assistant'
  const isArtist     = currentProfile?.role === 'artist'

  // Filtered notes by visibility rules
  const visibleNotes = notes.filter(n => {
    if (isLead || isAssistant) return true
    // Artist: only lead notes and own notes
    return n.authorRole === 'lead' || n.authorId === currentProfile?.id
  })

  const history = modelHistory?.[model.id] || []

  // ── Photo helpers ─────────────────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const now     = new Date()
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const newPhoto = {
        id:         `ph-${Date.now()}`,
        url:        ev.target.result,
        uploadedBy: currentProfile?.name || 'You',
        uploaderId: currentProfile?.id,
        timestamp:  `${dateStr} · ${timeStr}`,
        label:      '',
      }
      const updated = [...photos, newPhoto]
      setPhotos(updated)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function confirmDeletePhoto(id) { setDeletePhotoId(id) }
  function executeDeletePhoto() {
    const updated = photos.filter(p => p.id !== deletePhotoId)
    setPhotos(updated)
    setDeletePhotoId(null)
  }

  const canDeletePhoto = (photo) => isLead || photo.uploaderId === currentProfile?.id

  // ── Notes helpers ───────────────────────────────────────────────────────────────────
  function openAddNote() { setNoteText(''); setEditingNote(null); setAddingNote(true) }
  function openEditNote(n) { setNoteText(n.text); setEditingNote(n); setAddingNote(true) }
  function cancelNote() { setAddingNote(false); setEditingNote(null); setNoteText('') }

  function saveNote() {
    if (!noteText.trim()) return
    let updated
    if (editingNote) {
      updated = notes.map(n => n.id === editingNote.id ? { ...n, text: noteText.trim() } : n)
    } else {
      const now = new Date()
      updated = [...notes, {
        id:              `note-${Date.now()}`,
        text:            noteText.trim(),
        authorId:        currentProfile?.id || 'unknown',
        authorName:      currentProfile?.name || 'You',
        authorRole:      currentProfile?.role || 'team',
        authorSpecialty: currentProfile?.specialty || null,
        createdAt:       now.toISOString(),
      }]
    }
    setNotes(updated)
    onNote && onNote(model.id, updated)
    cancelNote()
  }

  function deleteNote(id) {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    onNote && onNote(model.id, updated)
  }

  // ── Hero photo ──────────────────────────────────────────────────────────────────────
  const heroPhotos = photos.length >= 2 ? photos.slice(0, 3) : null
  const singleSrc  = photos[0]?.url || model.avatar

  const heroJSX = (
    <div className="relative w-full flex-shrink-0" style={{ height: 200 }}>
      {heroPhotos ? (
        <div style={{ display: 'flex', height: '100%', gap: 2 }}>
          {heroPhotos.map(photo => (
            <div key={photo.id} style={{ flex: 1, overflow: 'hidden' }}>
              <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
          ))}
        </div>
      ) : (
        <img src={singleSrc} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-4">
        <h2 className="font-serif text-2xl text-white leading-tight">{model.name}</h2>
        <span className="text-[10px] tracking-widest uppercase font-sans text-white/70">LOOK {model.lookNumber}</span>
      </div>
    </div>
  )

  // ── Photo strip ──────────────────────────────────────────────────────────────────
  const photoStripJSX = (
    <div className="mb-5">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">PHOTOS</p>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {photos.map(photo => (
          <div key={photo.id} className="flex-shrink-0 flex flex-col gap-1 relative">
            <button onClick={() => setExpandedPhoto(photo)} className="outline-none">
              <img src={photo.url} alt="" className="rounded-lg object-cover" style={{ width: 80, height: 80, objectPosition: 'center top' }} />
            </button>
            {/* Delete button */}
            {canDeletePhoto(photo) && (
              <button
                onClick={e => { e.stopPropagation(); confirmDeletePhoto(photo.id) }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center outline-none"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/>
                </svg>
              </button>
            )}
            <span className="text-[9px] font-sans text-[#888580] text-center w-20 truncate">{formatPhotoTs(photo.timestamp)}</span>
          </div>
        ))}
        {/* Upload */}
        <label className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#C8C4BF] dark:border-[#3A3632] outline-none gap-1 cursor-pointer" style={{ width: 80, height: 80 }}>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]">
            <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
          </svg>
          <span className="text-[8px] tracking-widest uppercase font-sans text-[#888580]">UPLOAD</span>
        </label>
      </div>
    </div>
  )

  // ── Notes section ────────────────────────────────────────────────────────────────
  const notesSectionJSX = (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">NOTES</p>
        <button onClick={openAddNote} className="text-[9px] tracking-widest uppercase font-sans text-[#888580] border border-[#C8C4BF] dark:border-[#3A3632] px-2.5 py-1 rounded outline-none bg-transparent cursor-pointer">
          ADD NOTE
        </button>
      </div>
      {visibleNotes.length === 0 ? (
        <p className="text-xs font-sans text-[#B0ACA7]">No notes yet.</p>
      ) : [...visibleNotes].reverse().map(n => {
        const isMine = n.authorId === currentProfile?.id
        return (
          <div key={n.id} className="py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-sans font-medium text-[#111] dark:text-[#F0EDE8]">{n.authorName}</span>
              <span className="text-[8px] tracking-widest uppercase font-sans text-[#888580] border border-[#D0CCC7] dark:border-[#3A3632] rounded-full px-1.5 py-0.5">
                {roleChip(n.authorRole, n.authorSpecialty)}
              </span>
              <span className="text-[10px] font-sans text-[#B0ACA7] ml-auto">{fmtCreatedAt(n.createdAt)}</span>
            </div>
            <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] leading-snug mb-1">{n.text}</p>
            {isMine && (
              <div className="flex gap-3">
                <button onClick={() => openEditNote(n)} className="text-[9px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border-none cursor-pointer outline-none">EDIT</button>
                <button onClick={() => deleteNote(n.id)} className="text-[9px] tracking-widest uppercase font-sans text-[#C4614A] bg-transparent border-none cursor-pointer outline-none">DELETE</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // ── History section (Lead + Assistant only) ────────────────────────────────────────
  const historyJSX = (isLead || isAssistant) && history.length > 0 ? (
    <div className="mt-5">
      <button
        onClick={() => setShowHistoryOpen(h => !h)}
        className="flex items-center w-full py-3 border-t border-[#E0DDD8] dark:border-[#2E2B28] outline-none"
      >
        <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580] flex-1">SHOW HISTORY</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={`text-[#888580] ${showHistoryOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 150ms' }}>
          <polyline points="2 4 6 8 10 4"/>
        </svg>
      </button>
      {showHistoryOpen && (
        <div className="pb-4">
          {history.map((h, i) => (
            <div key={i} className="py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{h.showName}</span>
                <span className="text-[10px] font-sans text-[#888580]">{h.date} · {h.city}</span>
              </div>
              {h.artists.length > 0 && <p className="text-[11px] font-sans text-[#888580] mb-0.5">Artists: {h.artists.join(', ')}</p>}
              {h.assistants.length > 0 && <p className="text-[11px] font-sans text-[#888580] mb-0.5">Assistants: {h.assistants.join(', ')}</p>}
              {h.notes && <p className="text-xs font-sans text-[#888580] italic mt-1">"{h.notes}"</p>}
              {h.incidents.length > 0 && h.incidents.map((inc, j) => (
                <p key={j} className="text-[11px] font-sans text-[#C4614A] mt-1">⚠ {inc}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null

  // ── Expanded photo overlay ──────────────────────────────────────────────────────────────
  const expandedOverlayJSX = expandedPhoto && (
    <div className="absolute inset-0 z-50 flex flex-col bg-black" style={{ borderRadius: 'inherit' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <span className="text-[10px] tracking-widest uppercase font-sans text-white/60">{formatPhotoTs(expandedPhoto.timestamp)}</span>
        <button onClick={() => setExpandedPhoto(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 outline-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <img src={expandedPhoto.url} alt="" className="w-full rounded-lg object-contain" style={{ maxHeight: '70vh' }} />
      </div>
      <div className="px-4 pb-6 flex-shrink-0">
        <p className="text-[11px] font-sans text-white/50">by {expandedPhoto.uploadedBy}</p>
      </div>
    </div>
  )

  // ── Photo delete confirm overlay ──────────────────────────────────────────────────────
  const deletePhotoConfirmJSX = deletePhotoId && (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40" style={{ borderRadius: 'inherit' }}>
      <div className="w-full bg-greige dark:bg-greige-dark rounded-t-2xl p-6">
        <p className="font-serif text-lg text-[#111] dark:text-[#F0EDE8] mb-2">Remove this photo?</p>
        <p className="text-sm font-sans text-[#888580] mb-5">This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={executeDeletePhoto} className="flex-1 py-3 text-[10px] tracking-widest uppercase font-sans text-white bg-[#C4614A] border-none rounded-lg cursor-pointer outline-none font-semibold">REMOVE</button>
          <button onClick={() => setDeletePhotoId(null)} className="flex-1 py-3 text-[10px] tracking-widest uppercase font-sans text-[#111] dark:text-[#F0EDE8] bg-transparent border border-[#D0CCC7] dark:border-[#3A3632] rounded-lg cursor-pointer outline-none">CANCEL</button>
        </div>
      </div>
    </div>
  )

  // ── Add/Edit note overlay ───────────────────────────────────────────────────────────────
  const noteEditorJSX = addingNote && (
    <div className="absolute inset-0 z-50 flex flex-col bg-greige dark:bg-greige-dark" style={{ borderRadius: 'inherit' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <button onClick={cancelNote} className="text-[9px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border-none cursor-pointer outline-none">CANCEL</button>
        <p className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">{editingNote ? 'EDIT NOTE' : 'ADD NOTE'}</p>
        <button onClick={saveNote} className="text-[9px] tracking-widest uppercase font-sans text-[#111] dark:text-[#F0EDE8] border border-[#C8C4BF] dark:border-[#3A3632] rounded px-3 py-1 bg-transparent cursor-pointer outline-none">SAVE</button>
      </div>
      <div className="flex-1 p-4">
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Write a note about this model…"
          autoFocus
          className="w-full h-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border-none outline-none"
        />
      </div>
    </div>
  )

  // ── Shared content body ─────────────────────────────────────────────────────────────────
  const bodyContent = (
    <div className="px-4 pt-4 pb-8">
      <div className="mb-4">
        <StatusChip status={model.status} onClick={() => onStatusChange(model.id, cycleStatus(model.status))} />
      </div>
      <div className="mb-5">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">ARTISTS</p>
        <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">{model.assignedArtists.join(', ')}</p>
      </div>
      {photoStripJSX}
      <div className="h-px bg-[#E0DDD8] dark:bg-[#2E2B28] mb-5" />
      <div className="mb-5">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">UPDATE STATUS</p>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map(s => (
            <button key={s} onClick={() => onStatusChange(model.id, s)} style={{ backgroundColor: STATUS_META[s].color, outline: model.status === s ? '2px solid #111' : 'none', outlineOffset: 2 }} className="text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-[4px] rounded-full text-[#111]">{STATUS_META[s].label}</button>
          ))}
        </div>
      </div>
      <div className="h-px bg-[#E0DDD8] dark:bg-[#2E2B28] mb-5" />
      <div className="mb-5">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">TIMELINE</p>
        {model.statusLog.length === 0 && <p className="text-xs text-[#888580] font-sans">No activity yet.</p>}
        {[...model.statusLog].reverse().map((entry, i) => {
          const meta = STATUS_META[entry.status]
          return (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
              <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: meta?.color || '#888' }} />
              <div className="flex-1">
                <span className="text-xs font-sans text-[#111] dark:text-[#F0EDE8]">
                  {entry.status === 'in_progress' ? `Sat in ${entry.updatedBy}'s chair` :
                   entry.status === 'done' ? `Marked Done by ${entry.updatedBy}` :
                   entry.status === 'paused' ? 'Paused' :
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
      {notesSectionJSX}
      {historyJSX}
    </div>
  )

  // ── Panel mode (tablet list view) ─────────────────────────────────────────────────────
  if (panel) {
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-greige dark:bg-greige-dark">
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {expandedOverlayJSX}
          {deletePhotoConfirmJSX}
          {noteEditorJSX}
          {heroJSX}
          {bodyContent}
        </div>
      </div>
    )
  }

  // ── BottomSheet mode (mobile + tablet modal) ────────────────────────────────────────────
  return (
    <BottomSheet open onClose={onClose} height="88%" noPadding>
      {expandedOverlayJSX}
      {deletePhotoConfirmJSX}
      {noteEditorJSX}
      {heroJSX}
      {bodyContent}
    </BottomSheet>
  )
}
