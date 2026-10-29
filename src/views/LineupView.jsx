import { useState } from 'react'
import { STATUS_META, profiles as allProfiles } from '../data/mockData'
import ModelProfileOverlay from '../components/ModelProfileOverlay'

const TX = '#111', MT = '#4A4743', M2 = '#6E6A64', BD = '#E0DDD8', BG = '#F5F2EE', DV = '#CFCAC4'

const CHIP_STATUS = {
  not_started: { c: '#E8E4DF', t: 'Not started' },
  in_progress:  { c: '#D4A853', t: 'In progress' },
  paused:       { c: '#8A9BB0', t: 'Paused'      },
  done:         { c: '#7A9E7E', t: 'Done'         },
  to_check:     { c: '#DCE8DD', t: 'To check'    },
}

const STATUS_BORDER = {
  not_started: 'transparent',
  in_progress: '#D4A853',
  paused: '#8A9BB0',
  needs_revisit: '#C4614A',
  done: '#7A9E7E',
}

function ChipEl({ c, t }) {
  return (
    <span style={{
      fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600,
      letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999,
      padding: '4px 8px', color: TX, background: c, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {t}
    </span>
  )
}

function PhoneModelSheet({ model, onClose, onNote }) {
  const [addingNote, setAddingNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [localNotes, setLocalNotes] = useState([])

  const DISCIPLINES = ['makeup', 'hair', 'nails']

  function chipFor(svc) {
    if (!svc) return CHIP_STATUS.not_started
    return CHIP_STATUS[svc.status] || CHIP_STATUS.not_started
  }

  function assistantNameFor(svc) {
    if (!svc?.assistantId) return null
    return allProfiles.find(p => p.id === svc.assistantId)?.name || null
  }

  function saveNote() {
    const text = noteText.trim()
    if (!text) return
    const now = new Date()
    const h = now.getHours(), m = now.getMinutes()
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
    const time = `${h12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
    setLocalNotes(prev => [...prev, { time, text }])
    onNote?.(model.id, text)
    setNoteText('')
    setAddingNote(false)
  }

  const statusLog = model.statusLog || []
  const allUpdates = [...localNotes, ...statusLog]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxHeight: '90dvh', background: BG, borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ width: 44, height: 5, borderRadius: 3, background: DV, display: 'block' }} />
        </div>

        <div style={{ padding: '0 20px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <img
            src={model.avatar}
            alt={model.name}
            style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, marginBottom: 4 }}>
              Look {model.look || model.lookNumber}
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.2 }}>{model.name}</div>
          </div>
          <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 22, color: M2, cursor: 'pointer', padding: 4, lineHeight: 1, flexShrink: 0 }}>
            x
          </button>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, marginBottom: 12 }}>
            Where they're at
          </div>
          {DISCIPLINES.map((disc, i) => {
            const svc = model.services?.[disc]
            const chip = chipFor(svc)
            const asstName = assistantNameFor(svc)
            const label = disc.charAt(0).toUpperCase() + disc.slice(1)
            return (
              <div key={disc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < DISCIPLINES.length - 1 ? `1px solid ${BD}` : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontFamily: 'Georgia, serif' }}>{label}</div>
                  {asstName && <div style={{ fontSize: 11, color: MT, marginTop: 2 }}>{asstName}</div>}
                </div>
                <ChipEl c={chip.c} t={chip.t} />
              </div>
            )
          })}
        </div>

        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, marginBottom: 12 }}>
            Notes
          </div>
          {(model.notes || []).map((n, i) => (
            <div key={i} style={{ fontSize: 13, color: TX, marginBottom: 6, lineHeight: 1.45 }}>{n}</div>
          ))}
          {localNotes.map((n, i) => (
            <div key={`ln-${i}`} style={{ fontSize: 13, color: TX, marginBottom: 6, lineHeight: 1.45 }}>{n.text}</div>
          ))}
          {addingNote ? (
            <div>
              <textarea
                autoFocus
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note..."
                style={{ width: '100%', boxSizing: 'border-box', minHeight: 72, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, padding: '10px 12px', color: TX, outline: 'none', resize: 'none' }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={saveNote} style={{ flex: 1, height: 40, borderRadius: 8, border: 0, background: TX, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}>SAVE</button>
                <button onClick={() => { setAddingNote(false); setNoteText('') }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, color: TX, cursor: 'pointer' }}>CANCEL</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingNote(true)} style={{ height: 36, padding: '0 16px', borderRadius: 999, border: `1px solid ${DV}`, background: 'transparent', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 12, color: MT, cursor: 'pointer', marginTop: 4 }}>
              + Add a note
            </button>
          )}
        </div>

        {allUpdates.length > 0 && (
          <div style={{ padding: '16px 20px', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: M2, marginBottom: 12 }}>
              Earlier updates
            </div>
            {allUpdates.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < allUpdates.length - 1 ? `1px solid ${BD}` : 'none' }}>
                <span style={{ fontSize: 11, color: MT, whiteSpace: 'nowrap', flexShrink: 0 }}>{u.time}</span>
                <span style={{ fontSize: 13, color: TX }}>{u.text}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 24, flexShrink: 0 }} />
      </div>
    </div>
  )
}

export default function LineupView({ models, currentProfile, profiles, onStatusChange, onNote }) {
  const [selectedModel, setSelectedModel] = useState(null)
  const isAssistantRole = currentProfile?.role === 'assistant' || currentProfile?.role === 'lead_assistant'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">SHOW ORDER -- {models.length} LOOKS</p>
      </div>

      <div className="px-4 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex items-center gap-3 flex-shrink-0 overflow-x-auto">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: key === 'not_started' ? '#C8C4BF' : meta.color }}
            />
            <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580] whitespace-nowrap">{meta.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-4 gap-2">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="flex flex-col items-center outline-none"
            >
              <div className="relative w-full">
                <span className="absolute top-1 left-1 z-10 font-sans font-medium leading-none" style={{ fontSize: 12, color: '#111', backgroundColor: 'white', padding: '1px 4px', borderRadius: 2 }}>
                  {model.lookNumber}
                </span>
                <img
                  src={model.avatar}
                  alt={model.name}
                  className="w-full aspect-square object-cover"
                  style={{ border: `4px solid ${STATUS_BORDER[model.status] || 'transparent'}` }}
                />
              </div>
              <span className="mt-1 text-[9px] tracking-widest uppercase font-sans text-[#111] dark:text-[#F0EDE8] truncate w-full text-center">
                {model.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedModel && isAssistantRole && (
        <ModelProfileOverlay
          model={models.find(m => m.id === selectedModel.id)}
          currentProfile={currentProfile}
          profiles={profiles || allProfiles}
          onClose={() => setSelectedModel(null)}
          onNote={onNote}
        />
      )}
      {selectedModel && !isAssistantRole && (
        <PhoneModelSheet
          model={models.find(m => m.id === selectedModel.id)}
          onClose={() => setSelectedModel(null)}
          onNote={onNote}
        />
      )}
    </div>
  )
}
