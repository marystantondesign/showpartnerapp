import { useState } from 'react'
import FloorPlanAnnotator from '../components/FloorPlanAnnotator'
import VenuePinMap from '../components/VenuePinMap'

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
      <label className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] cursor-pointer">
        UPLOAD
        <input type="file" className="hidden" onChange={e => onChange(e.target.files[0]?.name)} />
      </label>
    </div>
  )
}

export default function SettingsView({ dark, onToggleDark }) {
  const [files, setFiles] = useState({ callSheet: null, runningOrder: null, faceCharts: null })
  const [pings, setPings] = useState(true)
  const [statusAlerts, setStatusAlerts] = useState(true)

  // Floor plan state
  const [floorPlanImage, setFloorPlanImage] = useState(null)   // raw data URL of uploaded image
  const [annotatedImage, setAnnotatedImage] = useState(null)   // canvas output after annotation
  const [showAnnotator, setShowAnnotator] = useState(false)

  // Venue pin state
  const [venuePin, setVenuePin] = useState(null)  // { lat, lng, address }
  const [showPinMap, setShowPinMap] = useState(false)

  function setFile(key, name) {
    setFiles(s => ({ ...s, [key]: name }))
  }

  function handleFloorPlanUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc). For PDFs, take a screenshot first.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setFloorPlanImage(ev.target.result)
      setAnnotatedImage(null)
      setShowAnnotator(true)
    }
    reader.readAsDataURL(file)
  }

  const displayImage = annotatedImage || floorPlanImage

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Show setup */}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">SHOW SETUP</p>
        <div className="mb-6">
          <UploadRow label="Call Sheet"    value={files.callSheet}    onChange={n => setFile('callSheet', n)} />
          <UploadRow label="Running Order" value={files.runningOrder} onChange={n => setFile('runningOrder', n)} />
          <UploadRow label="Face Charts"   value={files.faceCharts}   onChange={n => setFile('faceCharts', n)} />

          {/* Floor Plan — custom uploader */}
          <div className="py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Floor Plan</p>
                <p className="text-[11px] font-sans text-[#888580] mt-0.5">
                  {displayImage ? 'Image uploaded · tap to annotate' : 'Upload an image to annotate'}
                </p>
              </div>
              <label className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] cursor-pointer flex-shrink-0">
                UPLOAD
                <input type="file" accept="image/*" className="hidden" onChange={handleFloorPlanUpload} />
              </label>
            </div>

            {/* Preview + annotate button */}
            {displayImage && (
              <div className="relative mt-2 rounded overflow-hidden" style={{ height: 120 }}>
                <img src={displayImage} alt="Floor plan" className="w-full h-full object-cover" />
                <button
                  onClick={() => setShowAnnotator(true)}
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.35)', fontSize: 9, fontFamily: 'Inter, system-ui',
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  ✏ ANNOTATE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Venue pin */}
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-2">VENUE LOCATION</p>
        <div className="mb-6">
          <div className="flex items-center justify-between py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
            <div>
              <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8]">Drop a pin</p>
              <p className="text-[11px] font-sans text-[#888580] mt-0.5 pr-4" style={{ maxWidth: 230 }}>
                {venuePin ? venuePin.address.split(',').slice(0, 2).join(',') : 'No pin set'}
              </p>
            </div>
            <button
              onClick={() => setShowPinMap(true)}
              className="text-[10px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] flex-shrink-0"
            >
              {venuePin ? 'EDIT' : 'SET PIN'}
            </button>
          </div>
        </div>

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
      </div>

      {/* Floor plan annotator overlay */}
      {showAnnotator && floorPlanImage && (
        <FloorPlanAnnotator
          imageUrl={floorPlanImage}
          onClose={(saved) => {
            if (saved) setAnnotatedImage(saved)
            setShowAnnotator(false)
          }}
        />
      )}

      {/* Venue pin map overlay */}
      {showPinMap && (
        <VenuePinMap
          initialPin={venuePin}
          onSave={(pin) => { setVenuePin(pin); setShowPinMap(false) }}
          onClose={() => setShowPinMap(false)}
        />
      )}
    </>
  )
}
