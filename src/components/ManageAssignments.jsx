import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { profiles } from '../data/mockData'

const EMPTY = '— unassigned —'

function selectStyle(dark) {
  return {
    fontFamily: 'Inter, system-ui',
    fontSize: 11,
    color: dark ? '#F0EDE8' : '#111',
    backgroundColor: dark ? '#2A2724' : '#F5F2EE',
    border: `1px solid ${dark ? '#3A3632' : '#C8C4BF'}`,
    borderRadius: 5,
    padding: '5px 8px',
    outline: 'none',
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
    appearance: 'none',
    WebkitAppearance: 'none',
  }
}

export default function ManageAssignments({ open, onClose, models, schedule, onAssignArtists, onScheduleChange, dark }) {
  const [tab, setTab] = useState('assignments')
  const [localSchedule, setLocalSchedule] = useState(schedule)

  const hairArtists  = profiles.filter(p => p.specialty === 'hair')
  const makeupArtists = profiles.filter(p => p.specialty === 'makeup')

  // Derive current hair/makeup from model.assignedArtists
  function getAssigned(model) {
    const hair   = model.assignedArtists.find(name => hairArtists.some(p => p.name === name)) || ''
    const makeup = model.assignedArtists.find(name => makeupArtists.some(p => p.name === name)) || ''
    return { hair, makeup }
  }

  function handleAssign(modelId, field, value) {
    const model   = models.find(m => m.id === modelId)
    const current = getAssigned(model)
    const next    = { ...current, [field]: value }
    onAssignArtists(modelId, next)
  }

  function handleScheduleChange(idx, field, value) {
    const updated = localSchedule.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    )
    setLocalSchedule(updated)
    onScheduleChange(updated)
  }

  function deleteRow(idx) {
    const updated = localSchedule.filter((_, i) => i !== idx)
    setLocalSchedule(updated)
    onScheduleChange(updated)
  }

  function addRow() {
    const updated = [...localSchedule, { time: '', label: '' }]
    setLocalSchedule(updated)
    onScheduleChange(updated)
  }

  const border = dark ? '#2E2B28' : '#E0DDD8'
  const muted  = dark ? '#888580' : '#888580'
  const text   = dark ? '#F0EDE8' : '#111'

  return (
    <BottomSheet open={open} onClose={onClose} height="92%" noPadding>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        {[
          { key: 'assignments', label: 'MODEL ASSIGNMENTS' },
          { key: 'schedule',    label: 'SCHEDULE EDITOR' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '14px 8px',
              fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: tab === t.key ? text : muted,
              background: 'none', border: 'none',
              borderBottom: tab === t.key ? `1.5px solid ${text}` : '1.5px solid transparent',
              cursor: 'pointer', outline: 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MODEL ASSIGNMENTS ────────────────────────────────────────────── */}
      {tab === 'assignments' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}` }}>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>
              Changes apply immediately across the app.
            </p>
          </div>

          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${border}` }}>
            <div style={{ width: 40, flexShrink: 0 }} />
            <div style={{ width: 44, flexShrink: 0 }} />
            <div style={{ flex: 1 }} />
            <p style={{ margin: 0, flex: 1, fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>HAIR</p>
            <p style={{ margin: 0, flex: 1, fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>MAKEUP</p>
          </div>

          {models.map(model => {
            const { hair, makeup } = getAssigned(model)
            return (
              <div key={model.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${border}`, minHeight: 56 }}>
                {/* Look number */}
                <p style={{ margin: 0, width: 40, fontFamily: 'Inter, system-ui', fontSize: 11, color: muted, flexShrink: 0, tabularNums: true }}>{model.lookNumber}</p>
                {/* Avatar */}
                <img src={model.avatar} alt={model.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                {/* Name */}
                <p style={{ margin: 0, flex: 1, fontFamily: 'Georgia, serif', fontSize: 13, color: text, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{model.name}</p>
                {/* Hair dropdown */}
                <select
                  value={hair}
                  onChange={e => handleAssign(model.id, 'hair', e.target.value)}
                  style={selectStyle(dark)}
                >
                  <option value="">{EMPTY}</option>
                  {hairArtists.map(p => <option key={p.id} value={p.name}>{p.name.split(' ')[0]}</option>)}
                </select>
                {/* Makeup dropdown */}
                <select
                  value={makeup}
                  onChange={e => handleAssign(model.id, 'makeup', e.target.value)}
                  style={selectStyle(dark)}
                >
                  <option value="">{EMPTY}</option>
                  {makeupArtists.map(p => <option key={p.id} value={p.name}>{p.name.split(' ')[0]}</option>)}
                </select>
              </div>
            )
          })}
        </div>
      )}

      {/* ── SCHEDULE EDITOR ──────────────────────────────────────────────── */}
      {tab === 'schedule' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}` }}>
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>
              Edits reflect on the Home tab itinerary immediately.
            </p>
          </div>

          {localSchedule.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderBottom: `1px solid ${border}`, minHeight: 52 }}>
              {/* Time field */}
              <input
                value={item.time}
                onChange={e => handleScheduleChange(idx, 'time', e.target.value)}
                placeholder="9:00 AM"
                style={{
                  width: 76, fontFamily: 'Inter, system-ui', fontSize: 11, color: muted,
                  background: 'transparent', border: 'none', outline: 'none', borderBottom: `1px solid ${border}`,
                  padding: '3px 0', flexShrink: 0,
                }}
              />
              {/* Label field */}
              <input
                value={item.label}
                onChange={e => handleScheduleChange(idx, 'label', e.target.value)}
                placeholder="Event label…"
                style={{
                  flex: 1, fontFamily: item.isShowtime ? 'Georgia, serif' : 'Inter, system-ui',
                  fontSize: 13, color: text,
                  background: 'transparent', border: 'none', outline: 'none',
                  borderBottom: `1px solid ${border}`, padding: '3px 0',
                }}
              />
              {/* Delete */}
              <button
                onClick={() => deleteRow(idx)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 4, color: muted, flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
                </svg>
              </button>
            </div>
          ))}

          {/* Add event */}
          <button
            onClick={addRow}
            style={{
              display: 'block', width: '100%', padding: '14px 16px',
              fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: muted, background: 'none', border: 'none', borderBottom: `1px solid ${border}`,
              cursor: 'pointer', outline: 'none', textAlign: 'left',
            }}
          >
            + ADD EVENT
          </button>
        </div>
      )}
    </BottomSheet>
  )
}
