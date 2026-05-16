import { useState, useRef } from 'react'

const ZONE_DEFS = [
  { type: 'runway',    label: 'Runway',      color: '#C8C4BF' },
  { type: 'backstage', label: 'Backstage',   color: '#888580' },
  { type: 'hair',      label: 'Hair',        color: '#D4A853' },
  { type: 'makeup',    label: 'Makeup',      color: '#C4614A' },
  { type: 'styling',   label: 'Styling',     color: '#8A9BB0' },
  { type: 'holding',   label: 'Holding',     color: '#7A9E7E' },
  { type: 'dressing',  label: 'Dressing',    color: '#B09A78' },
  { type: 'bathrooms', label: 'Bathrooms',   color: '#6B8F71' },
  { type: 'craft',     label: 'Craft Svcs',  color: '#C8A87A' },
  { type: 'entrance',  label: 'Entrance',    color: '#7A9E7E' },
  { type: 'exit',      label: 'Exit',        color: '#C4614A' },
  { type: 'checkin',   label: 'Check-In',    color: '#D4A853' },
]

const STATION_DEFS = [
  { type: 'station_makeup',   label: 'Makeup Station', color: '#C4614A' },
  { type: 'station_hair',     label: 'Hair Station',   color: '#D4A853' },
  { type: 'station_styling',  label: 'Styling',        color: '#8A9BB0' },
  { type: 'station_security', label: 'Security',       color: '#888580' },
  { type: 'station_checkin',  label: 'Check-In',       color: '#7A9E7E' },
  { type: 'station_runner',   label: 'Runner',         color: '#B09A78' },
  { type: 'station_photo',    label: 'Photography',    color: '#C8C4BF' },
]

export default function VenueZonePlacer({ baseImage, initialZones = [], initialStations = [], onSave, onClose }) {
  const [zones, setZones] = useState(initialZones)
  const [stations, setStations] = useState(initialStations)
  const [activeTab, setActiveTab] = useState('zones')
  const [activeType, setActiveType] = useState(ZONE_DEFS[0])
  const planRef = useRef(null)

  const defs = activeTab === 'zones' ? ZONE_DEFS : STATION_DEFS

  function handlePlanTap(e) {
    if (!planRef.current) return
    const rect = planRef.current.getBoundingClientRect()
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    const xPct = Math.round(((clientX - rect.left) / rect.width) * 1000) / 10
    const yPct = Math.round(((clientY - rect.top) / rect.height) * 1000) / 10
    const item = { id: Date.now() + Math.random(), type: activeType.type, label: activeType.label, color: activeType.color, xPct, yPct }
    if (activeTab === 'zones') setZones(z => [...z, item])
    else setStations(s => [...s, item])
  }

  function removeItem(id) {
    setZones(z => z.filter(x => x.id !== id))
    setStations(s => s.filter(x => x.id !== id))
  }

  const allItems = [...zones, ...stations]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#1A1816', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2E2B28', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', border: 'none', background: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}
        >
          CANCEL
        </button>
        <p style={{ margin: 0, fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888580' }}>
          PLACE ZONES
        </p>
        <button
          onClick={() => onSave(zones, stations)}
          style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 5, padding: '5px 10px', background: 'none', cursor: 'pointer', outline: 'none' }}
        >
          DONE
        </button>
      </div>

      {/* Hint */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #2E2B28', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 10, fontFamily: 'Inter, system-ui', color: '#888580' }}>
          Select a zone type, then tap to place. Tap a placed zone to remove.
        </p>
        {allItems.length > 0 && (
          <button
            onClick={() => { setZones([]); setStations([]) }}
            style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C4614A', background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none', flexShrink: 0, marginLeft: 12 }}
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Floor plan area */}
      <div
        ref={planRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'crosshair', touchAction: 'none' }}
        onTouchEnd={handlePlanTap}
        onClick={handlePlanTap}
      >
        {baseImage ? (
          <img
            src={baseImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.6, display: 'block', pointerEvents: 'none', userSelect: 'none' }}
          />
        ) : (
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2E2B28" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}

        {/* Placed zones and stations */}
        {allItems.map(item => (
          <button
            key={item.id}
            onTouchEnd={e => { e.stopPropagation(); removeItem(item.id) }}
            onClick={e => { e.stopPropagation(); removeItem(item.id) }}
            style={{
              position: 'absolute',
              left: `${item.xPct}%`,
              top: `${item.yPct}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              border: `1.5px solid ${item.color}`,
              borderRadius: 4,
              padding: '3px 7px',
              cursor: 'pointer',
              background: item.color + '22',
              outline: 'none',
              touchAction: 'none',
            }}
          >
            <span style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.08em', textTransform: 'uppercase', color: item.color, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom panel */}
      <div style={{ borderTop: '1px solid #2E2B28', flexShrink: 0, backgroundColor: '#1A1816' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #2E2B28' }}>
          {[
            { key: 'zones',    label: `ZONES${zones.length ? ` · ${zones.length}` : ''}` },
            { key: 'stations', label: `STATIONS${stations.length ? ` · ${stations.length}` : ''}` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setActiveType(tab.key === 'zones' ? ZONE_DEFS[0] : STATION_DEFS[0]) }}
              style={{
                flex: 1, padding: '10px', fontSize: 9, fontFamily: 'Inter, system-ui',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: activeTab === tab.key ? '#F0EDE8' : '#888580',
                borderBottom: activeTab === tab.key ? '1.5px solid #F0EDE8' : '1.5px solid transparent',
                background: 'none', border: 'none',
                cursor: 'pointer', outline: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Zone type chips */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {defs.map(def => {
            const isActive = activeType.type === def.type
            return (
              <button
                key={def.type}
                onClick={() => setActiveType(def)}
                style={{
                  flexShrink: 0,
                  padding: '6px 11px',
                  fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: isActive ? '#111111' : def.color,
                  backgroundColor: isActive ? def.color : 'transparent',
                  border: `1px solid ${def.color}`,
                  borderRadius: 5,
                  cursor: 'pointer', outline: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 100ms ease, color 100ms ease',
                }}
              >
                {def.label}
              </button>
            )
          })}
        </div>

        {/* Active type indicator */}
        <p style={{ margin: 0, padding: '2px 16px 12px', fontSize: 10, fontFamily: 'Inter, system-ui', color: '#888580' }}>
          Placing: <span style={{ color: activeType.color }}>{activeType.label}</span>
        </p>
      </div>
    </div>
  )
}
