import { useState, useRef } from 'react'
import VenuePinMap from '../components/VenuePinMap'
import VenueZonePlacer from '../components/VenueZonePlacer'
import { useIsTablet } from '../hooks/useIsTablet'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 rounded-full outline-none"
      style={{
        width: 40, height: 22,
        backgroundColor: value ? '#7A9E7E' : '#4A4742',
        transition: 'background-color 150ms ease',
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        backgroundColor: 'white',
        transition: 'left 150ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </button>
  )
}

function UploadRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0">
      <div>
        <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">{label}</p>
        <p className="text-[11px] font-sans text-[#888580] mt-0.5">{value || 'No file uploaded'}</p>
      </div>
      <label className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] cursor-pointer flex-shrink-0">
        UPLOAD
        <input type="file" className="hidden" onChange={e => onChange(e.target.files[0]?.name)} />
      </label>
    </div>
  )
}

export default function SettingsView({ dark, onToggleDark, venue, onVenueChange, onLogOut, currentProfile, schedule, onScheduleChange }) {
  const isTablet = useIsTablet()
  const isLead   = currentProfile?.role === 'lead'
  const isLeadOrAssistant = currentProfile?.role === 'lead' || currentProfile?.role === 'assistant'
  const [files, setFiles] = useState({ callSheet: null, runningOrder: null, faceCharts: null })
  const [pings, setPings] = useState(true)
  const [statusAlerts, setStatusAlerts] = useState(true)
  const [showScheduleEditor, setShowScheduleEditor] = useState(false)
  const [localSchedule, setLocalSchedule] = useState(schedule || [])

  function handleScheduleChange(idx, field, value) {
    const updated = localSchedule.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    setLocalSchedule(updated)
    onScheduleChange?.(updated)
  }
  function deleteScheduleRow(idx) {
    const updated = localSchedule.filter((_, i) => i !== idx)
    setLocalSchedule(updated)
    onScheduleChange?.(updated)
  }
  function addScheduleRow() {
    const updated = [...localSchedule, { time: '', label: '' }]
    setLocalSchedule(updated)
    onScheduleChange?.(updated)
  }

  // Venue setup overlay states
  const [showVenueMap, setShowVenueMap] = useState(false)
  const [showZonePlacer, setShowZonePlacer] = useState(false)
  const floorPlanUploadRef = useRef(null)

  function setFile(key, name) {
    setFiles(s => ({ ...s, [key]: name }))
  }

  function handleFloorPlanUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc).')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      onVenueChange(v => ({ ...v, floorPlanImage: ev.target.result }))
      setShowZonePlacer(true)
    }
    reader.readAsDataURL(file)
  }

  const shortAddress = venue.pin?.address
    ? venue.pin.address.split(',').slice(0, 2).join(',')
    : null

  const zoneCount = venue.zones.length
  const stationCount = venue.stationPins.length
  const hasFloorPlan = !!(venue.floorPlanImage || venue.area)

  return (
    <>
      <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: isTablet ? 'center' : 'stretch' }}>
      <div style={{ width: '100%', maxWidth: isTablet ? 600 : undefined, padding: isTablet ? '24px 32px' : '16px' }}>

        {/* Show setup — Lead only */}
        {isLead && (
          <>
            <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">SHOW SETUP</p>
            <div className="mb-6">
              <UploadRow label="Call Sheet"    value={files.callSheet}    onChange={n => setFile('callSheet', n)} />
              <UploadRow label="Running Order" value={files.runningOrder} onChange={n => setFile('runningOrder', n)} />
              <UploadRow label="Face Charts"   value={files.faceCharts}   onChange={n => setFile('faceCharts', n)} />
              {/* Schedule Editor */}
              <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
                <div>
                  <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Schedule Editor</p>
                  <p className="text-[11px] font-sans text-[#888580] mt-0.5">Edit today's call times and events</p>
                </div>
                <button onClick={() => setShowScheduleEditor(true)} className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] flex-shrink-0">
                  EDIT
                </button>
              </div>
            </div>
          </>
        )}

        {/* Venue setup — Lead only */}
        {isLead && <>
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">VENUE SETUP</p>
        <div className="mb-6">

          {/* Venue row */}
          <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
            <div style={{ flex: 1, paddingRight: 12 }}>
              <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Venue</p>
              <p className="text-[11px] font-sans text-[#888580] mt-0.5">
                {shortAddress || 'Find your venue and set up your backstage map'}
              </p>
            </div>
            <button
              onClick={() => setShowVenueMap(true)}
              className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] flex-shrink-0"
            >
              {venue.pin ? 'EDIT' : 'SET UP'}
            </button>
          </div>

          {/* Floor plan row — shown once a pin is set */}
          {venue.pin && (
            <div className="py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
              <div className="flex items-center justify-between">
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Floor plan</p>
                  <p className="text-[11px] font-sans text-[#888580] mt-0.5">
                    {venue.area
                      ? (venue.area.name && venue.area.name !== 'Custom area' ? venue.area.name : 'Building footprint') + ' selected'
                      : venue.floorPlanImage
                      ? 'Image uploaded'
                      : 'Select a building or upload an image'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {/* Select building — reopens the map */}
                  <button
                    onClick={() => setShowVenueMap(true)}
                    className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8]"
                  >
                    SELECT
                  </button>
                  {/* Upload image */}
                  <label className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] cursor-pointer">
                    UPLOAD
                    <input ref={floorPlanUploadRef} type="file" accept="image/*" className="hidden" onChange={handleFloorPlanUpload} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Zones row — always visible once a pin is set */}
          {venue.pin && (
            <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
              <div style={{ flex: 1, paddingRight: 12 }}>
                <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Zones & stations</p>
                <p className="text-[11px] font-sans text-[#888580] mt-0.5">
                  {zoneCount + stationCount === 0
                    ? 'Tap to place zones on your floor plan'
                    : `${zoneCount} zone${zoneCount !== 1 ? 's' : ''}${stationCount ? ` · ${stationCount} station${stationCount !== 1 ? 's' : ''}` : ''}`}
                </p>
              </div>
              <button
                onClick={() => setShowZonePlacer(true)}
                className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] flex-shrink-0"
              >
                {zoneCount + stationCount > 0 ? 'EDIT' : 'ADD ZONES'}
              </button>
            </div>
          )}
        </div>
        </>}

        {/* App preferences */}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">APP PREFERENCES</p>
        <div>
          <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
            <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Dark mode</p>
            <Toggle value={dark} onChange={onToggleDark} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
            <div>
              <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Pings</p>
              <p className="text-[11px] font-sans text-[#888580]">Receive pings from team members</p>
            </div>
            <Toggle value={pings} onChange={setPings} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Status alerts</p>
              <p className="text-[11px] font-sans text-[#888580]">Notify when model status changes</p>
            </div>
            <Toggle value={statusAlerts} onChange={setStatusAlerts} />
          </div>
        </div>

        {/* App info */}
        <div className="mt-8 pt-4 border-t border-[#E0DDD8] dark:border-[#2E2B28]">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">SHOW PARTNER</p>
          <p className="text-[11px] font-sans text-[#B0ACA7] mt-1">Version 1.0 · Valentino SS26</p>
        </div>

        {/* Log out */}
        <div className="mt-8 pt-2">
          <button
            onClick={onLogOut}
            className="w-full text-center"
            style={{
              fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#888580',
              background: 'none', border: 'none', cursor: 'pointer',
              outline: 'none', padding: '14px 0',
            }}
          >
            Log out
          </button>
        </div>
      </div>
      </div>

      {/* Schedule editor overlay — Lead only */}
      {showScheduleEditor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'var(--greige, #F5F2EE)', display: 'flex', flexDirection: 'column' }} className="bg-greige dark:bg-greige-dark">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
            <button onClick={() => setShowScheduleEditor(false)} className="text-[9px] tracking-widest uppercase font-sans text-[#888580] outline-none border-none bg-transparent cursor-pointer">CANCEL</button>
            <p className="text-[9px] tracking-widest uppercase font-sans text-[#888580]">SCHEDULE EDITOR</p>
            <button onClick={() => setShowScheduleEditor(false)} className="text-[9px] tracking-widest uppercase font-sans text-[#111] dark:text-[#F0EDE8] outline-none border border-[#C8C4BF] dark:border-[#3A3632] rounded px-3 py-1 bg-transparent cursor-pointer">DONE</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div className="px-4 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
              <p className="text-[10px] font-sans text-[#888580]">Edits reflect on the Home tab immediately.</p>
            </div>
            {localSchedule.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]" style={{ minHeight: 52 }}>
                <input
                  value={item.time}
                  onChange={e => handleScheduleChange(idx, 'time', e.target.value)}
                  placeholder="9:00 AM"
                  className="text-[11px] font-sans text-[#888580] bg-transparent border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-0.5 w-[76px] flex-shrink-0"
                />
                <input
                  value={item.label}
                  onChange={e => handleScheduleChange(idx, 'label', e.target.value)}
                  placeholder="Event label…"
                  className={`flex-1 text-sm font-sans text-[#111] dark:text-[#F0EDE8] bg-transparent border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-0.5 ${item.isShowtime ? 'font-serif' : ''}`}
                />
                <button onClick={() => deleteScheduleRow(idx)} className="text-[#888580] outline-none bg-transparent border-none cursor-pointer p-1 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>
                </button>
              </div>
            ))}
            <button onClick={addScheduleRow} className="w-full text-left px-4 py-3 text-[9px] tracking-widest uppercase font-sans text-[#888580] border-b border-[#E0DDD8] dark:border-[#2E2B28] bg-transparent outline-none cursor-pointer">
              + ADD EVENT
            </button>
          </div>
        </div>
      )}

      {/* Venue map overlay */}
      {showVenueMap && (
        <VenuePinMap
          initialPin={venue.pin}
          onSave={(pin) => {
            onVenueChange(v => ({ ...v, pin }))
            setShowVenueMap(false)
          }}
          onCapture={(svgUrl, pinData) => {
            onVenueChange(v => ({ ...v, pin: pinData, floorPlanImage: svgUrl, area: pinData.area || v.area }))
            setShowVenueMap(false)
            setShowZonePlacer(true)
          }}
          onClose={() => setShowVenueMap(false)}
        />
      )}

      {/* Zone placer overlay */}
      {showZonePlacer && (
        <VenueZonePlacer
          baseImage={venue.floorPlanImage}
          initialZones={venue.zones}
          initialStations={venue.stationPins}
          onSave={(zones, stationPins) => {
            onVenueChange(v => ({ ...v, zones, stationPins }))
            setShowZonePlacer(false)
          }}
          onClose={() => setShowZonePlacer(false)}
        />
      )}
    </>
  )
}
