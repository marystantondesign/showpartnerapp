import { useState } from 'react'
import { STATUS_META, cycleStatus } from '../data/mockData'
import StatusChip from '../components/StatusChip'
import BottomSheet from '../components/BottomSheet'
import { useIsTablet } from '../hooks/useIsTablet'

const SPEC_ICON = { hair: '✂', makeup: '💄', nails: '💅' }

function specialtyLabel(person) {
  if (!person.specialty) return person.role?.toUpperCase() || 'TEAM'
  const icon = SPEC_ICON[person.specialty] || ''
  return `${icon} ${person.specialty.charAt(0).toUpperCase() + person.specialty.slice(1)}`
}

const STATUS_DOT_COLOR = {
  not_started:   '#C8C4BF',
  in_progress:   '#D4A853',
  paused:        '#8A9BB0',
  needs_revisit: '#C4614A',
  done:          '#7A9E7E',
}

const INCIDENT_TYPES = ['Late Arrival', 'Left Early', 'No Show', 'Medical', 'Other']

// ─── Assistant detail sheet ───────────────────────────────────────────────────
function AssistantDetailSheet({ assistant, models, open, onClose }) {
  const [stars, setStars]       = useState(0)
  const [note, setNote]         = useState('')
  const [incidents, setIncidents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ type: 'Late Arrival', notes: '' })
  const [pending, setPending]   = useState(null)
  const isTablet = useIsTablet()

  if (!assistant) return null

  const assigned = models.filter(m => m.assistant === assistant.name)

  function handleSubmit() {
    const inc = {
      id:    Date.now(),
      type:  form.type,
      notes: form.notes,
      time:  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
    setPending(inc)
    setShowForm(false)
    setForm({ type: 'Late Arrival', notes: '' })
  }

  function handleConfirm() {
    if (pending) { setIncidents(prev => [...prev, pending]); setPending(null) }
  }

  function handleDelete(id) {
    setIncidents(prev => prev.filter(i => i.id !== id))
  }

  const body = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-4 pb-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <img src={assistant.avatar} alt={assistant.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
        <div>
          <p className="font-serif text-xl text-[#111] dark:text-[#F0EDE8]">{assistant.name}</p>
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mt-0.5">{specialtyLabel(assistant)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Models */}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">TODAY'S MODELS</p>
        {assigned.length === 0 ? (
          <p className="text-xs font-sans text-[#888580] mb-5">No models assigned.</p>
        ) : (
          <div className="mb-5">
            {assigned.map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
                <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <span className="flex-1 font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{m.name}</span>
                <span className="text-[10px] font-sans text-[#888580] mr-2">LOOK {m.lookNumber}</span>
                <StatusChip status={m.status} small />
              </div>
            ))}
          </div>
        )}

        {/* Stars */}
        <div className="mb-5">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">RATE THIS ASSISTANT</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setStars(stars === n ? 0 : n)}
                className="outline-none"
                style={{ fontSize: 30, color: n <= stars ? '#D4A853' : '#D0CCC7', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px' }}
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
            placeholder="Performance notes for post-show review..."
            rows={4}
            className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border border-[#D0CCC7] dark:border-[#3A3632] rounded-lg px-3 py-2.5 outline-none"
          />
        </div>

        {/* Incident form */}
        {showForm && (
          <div className="border border-[#D0CCC7] dark:border-[#3A3632] rounded-lg p-4 mb-4">
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">FLAG INCIDENT</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {INCIDENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="text-[10px] font-sans tracking-wide px-2.5 py-1 rounded-full border outline-none"
                  style={{
                    borderColor:     form.type === t ? '#111' : '#D0CCC7',
                    backgroundColor: form.type === t ? '#111' : 'transparent',
                    color:           form.type === t ? '#F0EDE8' : '#888580',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="What happened?"
              rows={3}
              className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] resize-none border border-[#D0CCC7] dark:border-[#3A3632] rounded px-2 py-1.5 outline-none mb-3"
            />
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-[#111] bg-[#D4A853] border-none rounded cursor-pointer outline-none font-semibold">
                CONTINUE →
              </button>
              <button onClick={() => { setShowForm(false); setForm({ type: 'Late Arrival', notes: '' }) }} className="flex-1 py-2.5 text-[10px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border border-[#D0CCC7] dark:border-[#3A3632] rounded cursor-pointer outline-none">
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Confirm incident */}
        {pending && (
          <div className="border border-[#C4614A] rounded-lg p-4 mb-4">
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#C4614A] mb-2">CONFIRM INCIDENT</p>
            <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] mb-1">
              <span className="font-medium">{pending.type}</span>{pending.notes ? ` — ${pending.notes}` : ''}
            </p>
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

        {/* Incident log */}
        {incidents.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">INCIDENT LOG</p>
            {incidents.map(inc => (
              <div key={inc.id} className="flex items-start gap-3 py-2.5 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0" style={{ borderLeft: '2px solid #C4614A', paddingLeft: 10, marginLeft: -12 }}>
                <div className="flex-1">
                  <p className="text-[11px] font-sans text-[#C4614A] font-medium">{inc.type}</p>
                  <p className="text-xs font-sans text-[#888580]">{inc.notes}</p>
                  <p className="text-[10px] font-sans text-[#B0ACA7] mt-0.5">{inc.time}</p>
                </div>
                <button onClick={() => handleDelete(inc.id)} className="text-[9px] tracking-widest uppercase font-sans text-[#C4614A] bg-transparent border-none cursor-pointer outline-none flex-shrink-0">
                  DELETE
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FLAG INCIDENT button — always at bottom when form not open */}
        {!showForm && !pending && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 text-[10px] tracking-widest uppercase font-sans border border-[#C4614A] text-[#C4614A] rounded-lg bg-transparent cursor-pointer outline-none"
          >
            FLAG INCIDENT
          </button>
        )}
      </div>
    </div>
  )

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

// ─── Assistants roster ────────────────────────────────────────────────────────
function AssistantsDashboard({ models, team }) {
  const [assistantDetail, setAssistantDetail] = useState(null)
  const isTablet = useIsTablet()

  const assistants = team.filter(p => p.role === 'assistant')

  // Group by specialty
  const SPEC_ORDER = ['hair', 'makeup', 'nails']
  const groups = SPEC_ORDER.map(key => ({
    key,
    label: SPEC_ICON[key] + ' ' + key.charAt(0).toUpperCase() + key.slice(1),
    people: assistants.filter(a => a.specialty === key),
  })).filter(g => g.people.length > 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={isTablet ? 'px-6 py-4' : 'px-4 py-4'}>
        {groups.map((group, gi) => (
          <div key={group.key} className={gi > 0 ? 'mt-6' : ''}>
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">{group.label}</p>
            {group.people.map(a => {
              const assigned = models.filter(m => m.assistant === a.name)
              const done = assigned.filter(m => m.status === 'done').length
              return (
                <button
                  key={a.id}
                  onClick={() => setAssistantDetail(a)}
                  className="flex items-center gap-3 w-full py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 outline-none text-left"
                  style={{ minHeight: 56 }}
                >
                  <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base text-[#111] dark:text-[#F0EDE8] truncate">{a.name}</p>
                    <p className="text-[10px] font-sans text-[#888580] mt-0.5">
                      {assigned.length === 0 ? 'No models assigned' : `${done} / ${assigned.length} complete`}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 mr-1">
                    {assigned.map(m => (
                      <span key={m.id} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: STATUS_DOT_COLOR[m.status] || '#C8C4BF' }} />
                    ))}
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#888580] flex-shrink-0">
                    <polyline points="3 2 7 5 3 8" />
                  </svg>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <AssistantDetailSheet
        assistant={assistantDetail}
        models={models}
        open={!!assistantDetail}
        onClose={() => setAssistantDetail(null)}
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DashboardView({ models, team }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AssistantsDashboard models={models} team={team} />
    </div>
  )
}
