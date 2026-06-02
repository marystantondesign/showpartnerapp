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

export default function ManageAssignments({ open, onClose, models, onAssignArtists, dark }) {
  const hairArtists   = profiles.filter(p => p.specialty === 'hair')
  const makeupArtists = profiles.filter(p => p.specialty === 'makeup')
  const nailArtists   = profiles.filter(p => p.specialty === 'nails')

  const border = dark ? '#2E2B28' : '#E0DDD8'
  const muted  = '#888580'
  const text   = dark ? '#F0EDE8' : '#111'

  function getAssigned(model) {
    const hair   = model.assignedArtists.find(name => hairArtists.some(p => p.name === name)) || ''
    const makeup = model.assignedArtists.find(name => makeupArtists.some(p => p.name === name)) || ''
    const nails  = model.assignedArtists.find(name => nailArtists.some(p => p.name === name)) || ''
    return { hair, makeup, nails }
  }

  function handleAssign(modelId, field, value) {
    const model   = models.find(m => m.id === modelId)
    const current = getAssigned(model)
    const next    = { ...current, [field]: value }
    onAssignArtists(modelId, next)
  }

  return (
    <BottomSheet open={open} onClose={onClose} height="92%" noPadding>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>
          MODEL ASSIGNMENTS
        </p>
      </div>

      {/* Hint */}
      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${border}` }}>
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
        <p style={{ margin: 0, flex: 1, fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>NAILS</p>
      </div>

      {/* Model rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {models.map(model => {
          const { hair, makeup, nails } = getAssigned(model)
          return (
            <div key={model.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${border}`, minHeight: 56 }}>
              <p style={{ margin: 0, width: 40, fontFamily: 'Inter, system-ui', fontSize: 11, color: muted, flexShrink: 0 }}>{model.lookNumber}</p>
              <img src={model.avatar} alt={model.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <p style={{ margin: 0, flex: 1, fontFamily: 'Georgia, serif', fontSize: 13, color: text, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{model.name}</p>
              <select value={hair}   onChange={e => handleAssign(model.id, 'hair',   e.target.value)} style={selectStyle(dark)}>
                <option value="">{EMPTY}</option>
                {hairArtists.map(p => <option key={p.id} value={p.name}>{p.name.split(' ')[0]}</option>)}
              </select>
              <select value={makeup} onChange={e => handleAssign(model.id, 'makeup', e.target.value)} style={selectStyle(dark)}>
                <option value="">{EMPTY}</option>
                {makeupArtists.map(p => <option key={p.id} value={p.name}>{p.name.split(' ')[0]}</option>)}
              </select>
              <select value={nails}  onChange={e => handleAssign(model.id, 'nails',  e.target.value)} style={selectStyle(dark)}>
                <option value="">{EMPTY}</option>
                {nailArtists.map(p => <option key={p.id} value={p.name}>{p.name.split(' ')[0]}</option>)}
              </select>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}
