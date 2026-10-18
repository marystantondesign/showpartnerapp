import { useState, useRef, useEffect, useCallback } from 'react'
import { profiles } from '../data/mockData'
import { SHOW_LOOKS } from '../data/showLooks'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function fmt(n) { return `$${Number(n).toLocaleString()}` }

// ─── Placeholder image helper ──────────────────────────────────────────────────
function mkImg(bg, label = '') {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='${bg}'/>${label ? `<text x='200' y='210' text-anchor='middle' font-family='Georgia,serif' font-size='36' fill='rgba(255,255,255,0.65)'>${label}</text>` : ''}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(s)}`
}

// ─── Area chips ────────────────────────────────────────────────────────────────
const AREA_CHIPS = ['Full look', 'Eyes', 'Brows', 'Skin', 'Cheeks', 'Lips']

// ─── Seeded look media ────────────────────────────────────────────────────────
const P = {
  demo:   mkImg('#2E2C29', 'Demo'),
  eyes1:  mkImg('#3A5A7A'),
  eyes2:  mkImg('#4A6A8A'),
  eyesV:  mkImg('#2A4A6A'),
  brows:  mkImg('#7A6048'),
  skin:   mkImg('#C4A882'),
  lips:   mkImg('#6A3048'),
  cheeks: mkImg('#C4827A'),
  demoB:  mkImg('#4A3820', 'Demo'),
  eyesB:  mkImg('#3A2810'),
  skinB:  mkImg('#A89070'),
  demoC:  mkImg('#2A4A30', 'Demo'),
}

const SEEDED_LOOK_MEDIA = {
  A: [
    { id: 'sa0', type: 'video', dataUrl: P.demo,  areaTag: 'Full look', addedBy: 'Yadim',  addedAt: '1:30 PM', note: '', duration: '4:12', isNew: false },
    { id: 'sa1', type: 'photo', dataUrl: P.eyes1, areaTag: 'Eyes',      addedBy: 'Sofia R', addedAt: '2:05 PM', note: 'Third coat, bottom lashes', duration: null, isNew: false },
    { id: 'sa2', type: 'photo', dataUrl: P.eyes2, areaTag: 'Eyes',      addedBy: 'Lena S',  addedAt: '2:15 PM', note: '', duration: null, isNew: false },
    { id: 'sa3', type: 'video', dataUrl: P.eyesV, areaTag: 'Eyes',      addedBy: 'Sofia R', addedAt: '2:20 PM', note: '', duration: '0:38', isNew: false },
    { id: 'sa4', type: 'photo', dataUrl: P.brows, areaTag: 'Brows',     addedBy: 'Sofia R', addedAt: '2:25 PM', note: '', duration: null, isNew: false },
    { id: 'sa5', type: 'photo', dataUrl: P.skin,  areaTag: 'Skin',      addedBy: 'Lena S',  addedAt: '2:30 PM', note: '', duration: null, isNew: false },
    { id: 'sa6', type: 'video', dataUrl: P.eyesV, areaTag: 'Eyes',      addedBy: 'Lena S',  addedAt: '2:40 PM', note: '', duration: '1:05', isNew: false },
    { id: 'sa7', type: 'photo', dataUrl: P.lips,  areaTag: 'Lips',      addedBy: 'Sofia R', addedAt: '2:45 PM', note: '', duration: null, isNew: false },
  ],
  B: [
    { id: 'sb0', type: 'video', dataUrl: P.demoB, areaTag: 'Full look', addedBy: 'Yadim',  addedAt: '1:35 PM', note: '', duration: '3:47', isNew: false },
    { id: 'sb1', type: 'photo', dataUrl: P.eyesB, areaTag: 'Eyes',      addedBy: 'Kenji W', addedAt: '2:10 PM', note: '', duration: null, isNew: false },
    { id: 'sb2', type: 'photo', dataUrl: P.skinB, areaTag: 'Skin',      addedBy: 'Kenji W', addedAt: '2:20 PM', note: '', duration: null, isNew: false },
    { id: 'sb3', type: 'photo', dataUrl: P.brows, areaTag: 'Brows',     addedBy: 'Dara O',  addedAt: '2:30 PM', note: '', duration: null, isNew: false },
    { id: 'sb4', type: 'photo', dataUrl: P.lips,  areaTag: 'Lips',      addedBy: 'Dara O',  addedAt: '2:35 PM', note: '', duration: null, isNew: false },
    { id: 'sb5', type: 'video', dataUrl: P.eyesB, areaTag: 'Eyes',      addedBy: 'Kenji W', addedAt: '2:42 PM', note: '', duration: '0:52', isNew: false },
  ],
  C: [
    { id: 'sc0', type: 'video', dataUrl: P.demoC, areaTag: 'Full look', addedBy: 'Yadim',  addedAt: '2:15 PM', note: '', duration: '4:05', isNew: false },
  ],
  D: [],
}

// Mock camera roll items (pool of images for the picker)
const MOCK_ROLL = [
  { id: 'r0', dataUrl: P.demo,  type: 'video', duration: '4:12' },
  { id: 'r1', dataUrl: P.eyes1, type: 'photo', duration: null },
  { id: 'r2', dataUrl: P.skin,  type: 'photo', duration: null },
  { id: 'r3', dataUrl: P.eyesV, type: 'video', duration: '0:38' },
  { id: 'r4', dataUrl: P.brows, type: 'photo', duration: null },
  { id: 'r5', dataUrl: P.lips,  type: 'photo', duration: null },
  { id: 'r6', dataUrl: P.demoB, type: 'video', duration: '3:47' },
  { id: 'r7', dataUrl: P.cheeks,type: 'photo', duration: null },
  { id: 'r8', dataUrl: P.eyes2, type: 'photo', duration: null },
  { id: 'r9', dataUrl: P.skinB, type: 'photo', duration: null },
  { id: 'r10',dataUrl: P.eyesB, type: 'photo', duration: null },
  { id: 'r11',dataUrl: P.demoC, type: 'video', duration: '1:05' },
]

// ─── Mock product inventory for authoring flow ───────────────────────────────
const MOCK_PRODUCTS = [
  { id: 'mp1',  name: 'Volumizing mascara',  shade: 'Blackest Black', sw: '#111',    stock: 'In kits · 6 left',             out: false, cat: 'Mascara' },
  { id: 'mp2',  name: 'Lower lash mascara',  shade: 'Soft Black',     sw: '#2B2522', stock: 'Specialty · 2 left, ask Aimi', out: false, cat: 'Mascara' },
  { id: 'mp3',  name: 'Lengthening mascara', shade: 'Black',          sw: '#1A1A1A', stock: 'In kits · 9 left',             out: false, cat: 'Mascara' },
  { id: 'mp4',  name: 'Tubing mascara',      shade: 'Black',          sw: '#141414', stock: 'Out of stock',                 out: true,  cat: 'Mascara' },
  { id: 'mp5',  name: 'Clear lash gel',      shade: 'Clear',          sw: '#EDEAE6', stock: 'In kits · 7 left',             out: false, cat: 'Lashes'  },
  { id: 'mp6',  name: 'Eyeliner',            shade: 'Midnight',       sw: '#0A0808', stock: 'In kits · 8 left',             out: false, cat: 'Liner'   },
  { id: 'mp7',  name: 'Eye shadow',          shade: 'Espresso',       sw: '#3B2A1A', stock: 'In kits · 3 left',             out: false, cat: 'Shadow'  },
  { id: 'mp8',  name: 'Brow gel',            shade: 'Clear',          sw: '#C8C0B0', stock: 'In kits · 5 left',             out: false, cat: 'Brows'   },
  { id: 'mp9',  name: 'Brow pencil',         shade: 'Taupe',          sw: '#8A7A6A', stock: 'In kits · 4 left',             out: false, cat: 'Brows'   },
  { id: 'mp10', name: 'Foundation',          shade: '125 N',          sw: '#D4A87A', stock: 'In kits · 6 left',             out: false, cat: 'Skin'    },
  { id: 'mp11', name: 'Setting powder',      shade: 'Translucent',    sw: '#F0EDE8', stock: 'In kits · 8 left',             out: false, cat: 'Skin'    },
  { id: 'mp12', name: 'Blush',               shade: 'Coral Glow',     sw: '#D4826A', stock: 'In kits · 2 left',             out: false, cat: 'Lips'    },
  { id: 'mp13', name: 'Lip stain',           shade: 'Sheer Red',      sw: '#C4524A', stock: 'In kits · 5 left',             out: false, cat: 'Lips'    },
]
const INV_CATS = ['All', 'Mascara', 'Liner', 'Shadow', 'Lashes', 'Brows', 'Skin', 'Lips']

// ─── Media summary helper ─────────────────────────────────────────────────────
function mediaSummary(items) {
  if (!items.length) return 'No media yet'
  const hasDemo = items[0]?.areaTag === 'Full look'
  const photos = items.filter(m => m.type === 'photo').length
  const clips = items.filter(m => m.type === 'video' && m.areaTag !== 'Full look').length
  if (hasDemo) {
    const parts = []
    if (photos) parts.push(`${photos} photo${photos !== 1 ? 's' : ''}`)
    if (clips)  parts.push(`${clips} clip${clips !== 1 ? 's' : ''}`)
    if (parts.length === 0) return `Demo at ${items[0].addedAt}`
    return `Demo + ${parts.join(' · ')}`
  }
  const parts = []
  if (photos) parts.push(`${photos} photo${photos !== 1 ? 's' : ''}`)
  if (clips)  parts.push(`${clips} clip${clips !== 1 ? 's' : ''}`)
  return parts.join(' · ') || 'No media yet'
}

// ─── Area counts helper ───────────────────────────────────────────────────────
function areaCount(items, areaName) {
  const matching = items.filter(m => m.areaTag === areaName || (areaName === 'Full look' && m.areaTag === 'Full look'))
  const photos = matching.filter(m => m.type === 'photo').length
  const clips  = matching.filter(m => m.type === 'video').length
  const parts  = []
  if (photos) parts.push(`${photos} photo${photos !== 1 ? 's' : ''}`)
  if (clips)  parts.push(`${clips} clip${clips !== 1 ? 's' : ''}`)
  return parts.join(' · ')
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M15 6l-6 6 6 6"/>
  </svg>
)
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6l6 6-6 6"/>
  </svg>
)
const PlayIcon = ({ size = 24, color = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M8 5v14l11-7z"/>
  </svg>
)
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#111" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>
  </svg>
)
const XIcon = ({ color = '#fff' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
)
const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>
  </svg>
)

// ─── Full-screen media viewer (S3) ────────────────────────────────────────────
function MediaViewer({ items, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex || 0)
  const [playing, setPlaying] = useState(false)
  const item = items[idx]

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIdx(i => Math.min(items.length - 1, i + 1))
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length, onClose])

  if (!item) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}
      aria-modal="true" role="dialog" aria-label="Media viewer"
    >
      {/* media */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, bottom: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* top bar */}
      <div style={{ position: 'relative', zIndex: 1, padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ width: 44, height: 44, borderRadius: '50%', border: 0, background: 'rgba(245,242,238,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <XIcon />
        </button>
        <span style={{ fontSize: 13, color: '#F5F2EE' }}>{idx + 1} of {items.length}</span>
        <span style={{ width: 44 }} />
      </div>

      {/* bottom info */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 20px 34px', display: 'flex', flexDirection: 'column', gap: 14, color: '#F5F2EE' }}>
        {/* video controls */}
        {item.type === 'video' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setPlaying(p => !p)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: 0, background: '#F5F2EE', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon /> : <PlayIcon size={14} />}
            </button>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(245,242,238,.3)' }}>
              <div style={{ width: '45%', height: '100%', borderRadius: 2, background: '#F5F2EE' }} />
            </div>
            <span style={{ fontSize: 11, flexShrink: 0 }}>{item.duration || '0:00'}</span>
          </div>
        )}

        {/* tag + metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '3px 8px', borderRadius: 999, background: '#F5F2EE', color: '#111', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {item.areaTag}
            </span>
            <span style={{ fontSize: 12, color: '#C9C4BE' }}>Added by {item.addedBy} · {item.addedAt}</span>
          </span>
          {item.note && <span style={{ fontSize: 15 }}>{item.note}</span>}
        </div>

        {/* page dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to item ${i + 1}`}
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                borderRadius: i === idx ? 3 : '50%',
                background: i === idx ? '#F5F2EE' : 'rgba(245,242,238,.4)',
                border: 0, padding: 0, cursor: 'pointer', transition: 'width 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* prev/next tap zones */}
      {idx > 0 && (
        <button onClick={() => setIdx(i => i - 1)} aria-label="Previous" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 80, height: 120, background: 'transparent', border: 0, cursor: 'pointer' }} />
      )}
      {idx < items.length - 1 && (
        <button onClick={() => setIdx(i => i + 1)} aria-label="Next" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 80, height: 120, background: 'transparent', border: 0, cursor: 'pointer' }} />
      )}
    </div>
  )
}

// ─── Camera screen (S5a) ──────────────────────────────────────────────────────
function CameraScreen({ lookName, capturedCount, onCapture, onDone, onClose }) {
  const [mode, setMode] = useState('VIDEO')
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const fileRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recording])

  function fmtTimer(s) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const isVid = file.type.startsWith('video/')
    const reader = new FileReader()
    reader.onload = ev => {
      onCapture({ dataUrl: ev.target.result, type: isVid ? 'video' : 'photo', duration: isVid ? '0:00' : null })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setRecording(false)
    setElapsed(0)
  }

  function handleShutterClick() {
    if (mode === 'VIDEO') {
      if (recording) {
        setRecording(false)
        // Simulate a captured clip - add a mock item
        onCapture({ dataUrl: mkImg('#2A3A4A', 'Clip'), type: 'video', duration: fmtTimer(elapsed || 5) })
        setElapsed(0)
      } else {
        setRecording(true)
      }
    } else {
      // Photo mode - try real camera first via file input
      fileRef.current?.click()
    }
  }

  const placeholderBg = mkImg('#1A2A3A')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: '#000', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* viewfinder */}
      <img src={placeholderBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />

      {/* hidden real file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* top bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(rgba(0,0,0,.5), transparent)', zIndex: 1 }}>
        <button
          onClick={onClose}
          aria-label="Close camera"
          style={{ width: 44, height: 44, borderRadius: '50%', border: 0, background: 'rgba(17,17,17,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <XIcon />
        </button>
        {recording ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: 'rgba(17,17,17,.7)', color: '#F5F2EE', fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E5484D' }} />
            {fmtTimer(elapsed)}
          </span>
        ) : (
          <span style={{ padding: '5px 10px', borderRadius: 999, background: 'rgba(17,17,17,.7)', color: '#F5F2EE', fontSize: 11 }}>
            {lookName}
          </span>
        )}
        <span style={{ width: 44 }} />
      </div>

      {/* bottom controls */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 20px 40px', display: 'flex', flexDirection: 'column', gap: 18, background: 'linear-gradient(transparent, rgba(0,0,0,.7))' }}>
        {/* mode toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 22, fontSize: 12, letterSpacing: '.12em' }}>
          {['PHOTO', 'VIDEO'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setRecording(false); setElapsed(0) }}
              style={{
                background: 'none', border: 0, cursor: 'pointer', fontSize: 12, letterSpacing: '.12em',
                color: mode === m ? (m === 'VIDEO' ? '#E8C77A' : '#F5F2EE') : '#C9C4BE',
                fontWeight: mode === m ? 600 : 400,
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* shutter row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* last capture thumb */}
          <div style={{ position: 'relative', width: 52, height: 52, borderRadius: 10, overflow: 'hidden', border: '2px solid #fff', background: '#333', flexShrink: 0 }}>
            {capturedCount > 0 ? (
              <>
                <div style={{ width: '100%', height: '100%', background: mkImg('#2A3A4A') ? undefined : '#2A3A4A' }} />
                <span style={{ position: 'absolute', right: 2, top: 2, minWidth: 18, height: 18, borderRadius: 9, background: '#fff', color: '#111', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {capturedCount}
                </span>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#1A2830' }} />
            )}
          </div>

          {/* shutter */}
          <button
            onClick={handleShutterClick}
            aria-label={mode === 'VIDEO' ? (recording ? 'Stop recording' : 'Start recording') : 'Take photo'}
            style={{
              width: 78, height: 78, borderRadius: '50%', border: '4px solid #fff', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            {mode === 'VIDEO'
              ? recording
                ? <span style={{ width: 30, height: 30, borderRadius: 6, background: '#E5484D' }} />
                : <span style={{ width: 60, height: 60, borderRadius: '50%', background: '#E5484D', margin: 4 }} />
              : <span style={{ width: 64, height: 64, borderRadius: '50%', background: '#F5F2EE', margin: 6 }} />
            }
          </button>

          {/* done */}
          <button
            onClick={onDone}
            style={{ minWidth: 52, minHeight: 44, padding: '0 12px', borderRadius: 999, border: 0, background: '#fff', color: '#111', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Camera roll screen (S5b) ─────────────────────────────────────────────────
function RollScreen({ onCancel, onNext }) {
  const [selected, setSelected] = useState({})
  const fileRef = useRef(null)

  function toggle(id) {
    setSelected(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else {
        const order = Object.keys(next).length + 1
        next[id] = order
      }
      return next
    })
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || [])
    const items = files.map(f => ({
      dataUrl: null, type: f.type.startsWith('video/') ? 'video' : 'photo', duration: null, _file: f
    }))
    const promises = items.map(item => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = ev => resolve({ ...item, dataUrl: ev.target.result })
      reader.readAsDataURL(item._file)
    }))
    Promise.all(promises).then(resolved => onNext(resolved.map(({ _file, ...rest }) => rest)))
    e.target.value = ''
  }

  const selCount = Object.keys(selected).length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />

      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px', borderBottom: '1px solid #E0DDD8' }}>
        <button onClick={onCancel} style={{ minHeight: 44, padding: '0 10px', border: 0, background: 'none', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: '#111', cursor: 'pointer' }}>Cancel</button>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Camera roll</span>
        <button
          onClick={() => {
            const items = Object.entries(selected)
              .sort((a, b) => a[1] - b[1])
              .map(([id]) => {
                const m = MOCK_ROLL.find(r => r.id === id)
                return m ? { dataUrl: m.dataUrl, type: m.type, duration: m.duration } : null
              })
              .filter(Boolean)
            if (items.length) onNext(items)
          }}
          disabled={selCount === 0}
          style={{ minHeight: 44, padding: '0 10px', border: 0, background: 'none', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: selCount > 0 ? '#111' : '#C8C4BF', cursor: selCount > 0 ? 'pointer' : 'default' }}
        >
          {selCount > 0 ? `Next (${selCount})` : 'Next'}
        </button>
      </div>

      <p style={{ padding: '12px 16px 8px', margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Today</p>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, alignContent: 'start' }}>
        {MOCK_ROLL.map(item => {
          const order = selected[item.id]
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              style={{ position: 'relative', aspectRatio: '1', padding: 0, border: 0, background: '#E0DDD8', overflow: 'hidden', cursor: 'pointer' }}
            >
              <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: order ? 0.7 : 1 }} />
              {item.duration && (
                <span style={{ position: 'absolute', left: 6, bottom: 6, fontSize: 10, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,.6)' }}>{item.duration}</span>
              )}
              <span style={{
                position: 'absolute', right: 6, top: 6, width: 24, height: 24, borderRadius: '50%',
                border: '2px solid #fff', background: order ? '#111' : 'rgba(17,17,17,.15)',
                color: '#fff', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {order || ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tag screen (S6) ──────────────────────────────────────────────────────────
function TagScreen({ items, lookName, onBack, onAdd }) {
  const [areaTag, setAreaTag] = useState('Full look')
  const [note, setNote] = useState('')
  const n = items.length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
        <button onClick={onBack} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft />
        </button>
        <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>Add {n} to {lookName}</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* previews */}
        <div style={{ display: 'flex', gap: 8 }}>
          {items.slice(0, 3).map((item, i) => (
            <div key={i} style={{ position: 'relative', flex: 1, aspectRatio: '1', borderRadius: 10, overflow: 'hidden' }}>
              <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {item.type === 'video' && item.duration && (
                <span style={{ position: 'absolute', left: 6, bottom: 6, padding: '2px 6px', borderRadius: 999, background: 'rgba(17,17,17,.7)', color: '#F5F2EE', fontSize: 11 }}>
                  {item.duration}
                </span>
              )}
            </div>
          ))}
          {n > 3 && (
            <div style={{ flex: 1, borderRadius: 10, background: '#E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: '#4A4743' }}>+{n - 3}</span>
            </div>
          )}
        </div>

        {/* area chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>What does it show?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AREA_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setAreaTag(chip)}
                style={{
                  minHeight: 40, padding: '0 14px', borderRadius: 999,
                  border: `1px solid ${areaTag === chip ? '#111' : '#CFCAC4'}`,
                  background: areaTag === chip ? '#111' : 'transparent',
                  fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12,
                  color: areaTag === chip ? '#fff' : '#111',
                  cursor: 'pointer',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#4A4743' }}>Applies to all {n}.</span>
        </div>

        {/* note */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Note (optional)</span>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Third coat, bottom lashes"
            style={{ height: 44, padding: '0 12px', border: '1px solid #CFCAC4', borderRadius: 10, background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, outline: 'none' }}
          />
        </label>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 28px', borderTop: '1px solid #E0DDD8' }}>
        <button
          onClick={() => onAdd(areaTag, note)}
          style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}
        >
          ADD {n} TO {lookName.toUpperCase()}
        </button>
      </div>
    </div>
  )
}

// ─── Look detail (S2) ─────────────────────────────────────────────────────────
function LookDetailScreen({ look, media, myModelName, currentProfile, onBack, onMediaTap, onAdd, showToast, changeBanner }) {
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const capturers = look.capturers
    .map(id => profiles.find(p => p.id === id)?.name?.split(' ')[0] || id)
  const isCapturing = look.capturers.includes(currentProfile?.id)
  const capturerLine = capturers.map(n => n === currentProfile?.name?.split(' ')[0] ? 'you' : n).join(', ')

  const lookAreas = look.areas || []

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* header */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px 0' }}>
          <button onClick={onBack} aria-label="Back to looks" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft />
          </button>
          <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 22 }}>{look.name}</span>
          <span style={{ fontSize: 11, color: '#4A4743', paddingRight: 8 }}>
            {look.modelCount || ''}
          </span>
        </div>
        {/* A5 change banner */}
        {changeBanner && !bannerDismissed && (
          <div role="status" style={{ position: 'absolute', left: 12, right: 12, top: 96, background: '#111', color: '#F5F2EE', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 8px 24px rgba(0,0,0,.25)', zIndex: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{changeBanner.title}</span>
            <span style={{ fontSize: 12, lineHeight: 1.45, color: '#E0DDD8' }}>{changeBanner.description}</span>
            <button onClick={() => setBannerDismissed(true)} style={{ alignSelf: 'flex-start', minHeight: 36, padding: 0, border: 0, background: 'none', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, textDecoration: 'underline', color: '#F5F2EE', cursor: 'pointer' }}>See what changed</button>
          </div>
        )}

        {/* subheader */}
        {myModelName && (
          <div style={{ flexShrink: 0, padding: '0 16px 10px', fontSize: 12, color: '#4A4743' }}>
            {myModelName} gets this look{capturerLine ? ` · captured by ${capturerLine}` : ''}
          </div>
        )}

        {/* scrollable content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* demo / main media */}
          {media.length > 0 ? (
            <button
              onClick={() => onMediaTap(0)}
              style={{ position: 'relative', flexShrink: 0, height: 360, background: '#111', border: 0, padding: 0, cursor: 'pointer', display: 'block', width: '100%' }}
            >
              <img src={media[0].dataUrl} alt="Demo" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <span style={{ position: 'absolute', left: 12, top: 12, padding: '5px 10px', borderRadius: 999, background: 'rgba(17,17,17,.7)', color: '#F5F2EE', fontSize: 11 }}>
                {media[0].areaTag} · {media[0].addedBy}
              </span>
              <span style={{ position: 'absolute', right: 12, top: 12, padding: '5px 10px', borderRadius: 999, background: 'rgba(17,17,17,.7)', color: '#F5F2EE', fontSize: 11 }}>
                1 / {media.length}
              </span>
              {media[0].type === 'video' && (
                <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 68, height: 68, borderRadius: '50%', background: 'rgba(245,242,238,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayIcon size={24} />
                </span>
              )}
              {media[0].duration && (
                <span style={{ position: 'absolute', left: 12, bottom: 12, fontSize: 11, color: '#F5F2EE' }}>{media[0].duration} · tap to play full screen</span>
              )}
            </button>
          ) : (
            <div style={{ flexShrink: 0, height: 200, background: '#E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, color: '#6E6A64' }}>No demo yet</span>
            </div>
          )}

          {/* thumbnails */}
          {media.length > 1 && (
            <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto' }}>
              {media.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => onMediaTap(i)}
                  style={{ position: 'relative', flexShrink: 0, width: 60, height: 60, padding: 0, borderRadius: 8, overflow: 'hidden', border: i === 0 ? '2px solid #111' : '2px solid transparent', background: '#E0DDD8', cursor: 'pointer' }}
                >
                  <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {item.type === 'video' && (
                    <span style={{ position: 'absolute', right: 4, bottom: 4, width: 16, height: 16, borderRadius: '50%', background: 'rgba(17,17,17,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayIcon size={8} color="#fff" />
                    </span>
                  )}
                  {item.isNew && (
                    <span style={{ position: 'absolute', left: 4, top: 4, padding: '1px 5px', borderRadius: 4, background: '#111', color: '#fff', fontSize: 9, letterSpacing: '.08em' }}>NEW</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* add button + areas */}
          <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button
              onClick={() => setShowAddSheet(true)}
              style={{ minHeight: 48, borderRadius: 8, border: '1px solid #111', background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '.1em', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              <CameraIcon /> ADD PHOTO OR VIDEO
            </button>

            <p style={{ margin: '6px 0 0', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>By area</p>

            {lookAreas.filter(a => a.notes).map(area => (
              <div key={area.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 12, borderBottom: '1px solid #E0DDD8' }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{area.name}</span>
                  <span style={{ fontSize: 11, color: '#4A4743' }}>{areaCount(media, area.name)}</span>
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: '#2E2C29' }}>{area.notes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* add sheet overlay */}
      {showAddSheet && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowAddSheet(false)}
        >
          <div
            role="dialog"
            aria-label={`Add to ${look.name}`}
            style={{ width: '100%', background: '#F5F2EE', borderRadius: '16px 16px 0 0', paddingBottom: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowAddSheet(false)} aria-label="Drag down to close" style={{ width: '100%', height: 28, background: 'none', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ width: 40, height: 5, borderRadius: 3, background: '#B9B4AE' }} />
            </button>
            <div style={{ padding: '0 16px 16px' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>Add to {look.name}</span>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => { setShowAddSheet(false); onAdd('camera') }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 72, padding: '0 16px', borderRadius: 12, border: '1px solid #CFCAC4', background: '#fff', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>Take photo or video</span>
                  <span style={{ fontSize: 12, color: '#4A4743' }}>Opens the camera, everything you shoot goes to {look.name}</span>
                </span>
              </button>
              <button
                onClick={() => { setShowAddSheet(false); onAdd('roll') }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 72, padding: '0 16px', borderRadius: 12, border: '1px solid #CFCAC4', background: '#fff', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 16l5-5 4 4 3-3 4 4"/></svg>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>Choose from camera roll</span>
                  <span style={{ fontSize: 12, color: '#4A4743' }}>For anything you already shot during the demo</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Looks list (S1) ──────────────────────────────────────────────────────────
function LooksListScreen({ looks, lookMedia, myLookId, currentProfile, models, onSelectLook }) {
  function getMyModelForLook(lookId) {
    if (!currentProfile || !models) return null
    return models.find(m =>
      m.look === lookId &&
      m.arrived &&
      m.services?.makeup?.assistantId === currentProfile.id
    ) || null
  }

  function getCapturerLine(look) {
    if (!look.capturers?.length) return ''
    const myName = currentProfile?.name
    const names = look.capturers.map(id => {
      const p = profiles.find(pr => pr.id === id)
      if (!p) return null
      return p.id === currentProfile?.id ? 'you' : (p.name?.split(' ')[0] || '')
    }).filter(Boolean)
    if (names.includes('you')) return `Capturing: ${names.join(', ')}`
    return `Capturing: ${names.join(', ')}`
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Looks</p>
      {looks.map(look => {
        const media = lookMedia[look.id] || []
        const isMine = look.id === myLookId
        const capLine = getCapturerLine(look)
        return (
          <button
            key={look.id}
            onClick={() => onSelectLook(look.id)}
            style={{
              display: 'flex', gap: 14, padding: 12, borderRadius: 12,
              border: isMine ? '1.5px solid #111' : '1px solid #E0DDD8',
              background: '#fff', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer',
            }}
          >
            {/* cover */}
            <span style={{ position: 'relative', width: 84, height: 104, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: '#E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {media.length > 0
                ? <img src={media[0].dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 10, color: '#4A4743', textAlign: 'center', padding: 6 }}>No demo yet</span>
              }
            </span>

            {/* info */}
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>{look.name}</span>
              </span>
              <span style={{ fontSize: 12, color: '#2E2C29' }}>{mediaSummary(media)}</span>
              {capLine && <span style={{ fontSize: 11, color: '#4A4743' }}>{capLine}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Upload toast ──────────────────────────────────────────────────────────────
function UploadToast({ count, lookName, areaTag, onDone }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = 1200
    const step = 40
    let current = 0
    const id = setInterval(() => {
      current += step + Math.random() * 30
      if (current >= total) {
        setProgress(100)
        clearInterval(id)
        setTimeout(onDone, 600)
      } else {
        setProgress(Math.round((current / total) * 100))
      }
    }, 80)
    return () => clearInterval(id)
  }, [onDone])

  return (
    <div
      role="status"
      style={{
        position: 'absolute', left: 12, right: 12, bottom: 84,
        background: '#111', color: '#F5F2EE', borderRadius: 12,
        padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,.25)', zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>{count} added to {lookName} · {areaTag}</span>
        <span style={{ color: '#C9C4BE' }}>
          {progress < 100 ? `Uploading...` : 'Done'}
        </span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: '#3A3734' }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 2, background: '#F5F2EE', transition: 'width 0.1s' }} />
      </div>
    </div>
  )
}

// ─── Assistant studio flow ────────────────────────────────────────────────────
function AssistantStudioFlow({ currentProfile, models }) {
  const [screen, setScreen] = useState('looks')
  const [activeLookId, setActiveLookId] = useState(null)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [pendingItems, setPendingItems] = useState([])
  const [cameraCaptured, setCameraCaptured] = useState([])
  const [toastInfo, setToastInfo] = useState(null)

  const mediaKey = id => `showpartner_look_media_${id}`

  const [lookMedia, setLookMedia] = useState(() => {
    const result = {}
    for (const look of SHOW_LOOKS) {
      const saved = lsGet(mediaKey(look.id), null)
      if (saved) {
        result[look.id] = [...(SEEDED_LOOK_MEDIA[look.id] || []), ...saved]
      } else {
        result[look.id] = SEEDED_LOOK_MEDIA[look.id] || []
      }
    }
    return result
  })

  const activeLook = SHOW_LOOKS.find(l => l.id === activeLookId)
  const activeMedia = activeLookId ? (lookMedia[activeLookId] || []) : []

  const myActiveModel = models?.find(m =>
    m.arrived &&
    m.services?.makeup?.assistantId === currentProfile?.id &&
    (m.services?.makeup?.status === 'in_progress' || m.services?.makeup?.status === 'paused')
  )
  const myLookId = myActiveModel?.look || null

  const addItems = useCallback((items, areaTag, note, lookId) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const newItems = items.map((item, i) => ({
      id: `user-${Date.now()}-${i}`,
      type: item.type,
      dataUrl: item.dataUrl,
      areaTag,
      addedBy: currentProfile?.name?.split(' ')[0] || 'You',
      addedAt: timeStr,
      note: i === 0 ? note : '',
      duration: item.duration || null,
      isNew: true,
    }))

    setLookMedia(prev => {
      const existing = prev[lookId] || []
      const updated = [...newItems, ...existing]
      const userItems = updated.filter(m => !SEEDED_LOOK_MEDIA[lookId]?.some(s => s.id === m.id))
      lsSet(mediaKey(lookId), userItems)
      return { ...prev, [lookId]: updated }
    })

    setToastInfo({ count: items.length, lookName: activeLook?.name || lookId, areaTag })
    setScreen('look-detail')
    setPendingItems([])
    setCameraCaptured([])
  }, [activeLook, currentProfile])

  function dismissNewBadges() {
    setLookMedia(prev => {
      const updated = { ...prev }
      if (activeLookId) {
        updated[activeLookId] = prev[activeLookId].map(m => ({ ...m, isNew: false }))
      }
      return updated
    })
  }

  if (screen === 'viewer') {
    return (
      <MediaViewer
        items={activeMedia}
        initialIndex={viewerIndex}
        onClose={() => setScreen('look-detail')}
      />
    )
  }

  if (screen === 'camera') {
    return (
      <CameraScreen
        lookName={activeLook?.name || ''}
        capturedCount={cameraCaptured.length}
        onCapture={item => setCameraCaptured(prev => [...prev, item])}
        onDone={() => {
          if (cameraCaptured.length > 0) {
            setPendingItems(cameraCaptured)
            setScreen('tag')
          } else {
            setCameraCaptured([])
            setScreen('look-detail')
          }
        }}
        onClose={() => { setCameraCaptured([]); setScreen('look-detail') }}
      />
    )
  }

  if (screen === 'roll') {
    return (
      <RollScreen
        onCancel={() => setScreen('look-detail')}
        onNext={items => { setPendingItems(items); setScreen('tag') }}
      />
    )
  }

  if (screen === 'tag') {
    return (
      <TagScreen
        items={pendingItems}
        lookName={activeLook?.name || ''}
        onBack={() => setScreen('look-detail')}
        onAdd={(areaTag, note) => addItems(pendingItems, areaTag, note, activeLookId)}
      />
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Studio header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid #E0DDD8' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 24 }}>Studio</span>
        <span style={{ fontSize: 11, color: '#4A4743' }}>Valentino SS26 · makeup</span>
      </div>

      {screen === 'looks' && (
        <LooksListScreen
          looks={SHOW_LOOKS}
          lookMedia={lookMedia}
          myLookId={myLookId}
          currentProfile={currentProfile}
          models={models}
          onSelectLook={id => {
            setActiveLookId(id)
            dismissNewBadges()
            setScreen('look-detail')
          }}
        />
      )}

      {screen === 'look-detail' && activeLook && (
        <LookDetailScreen
          look={activeLook}
          media={activeMedia}
          myModelName={myActiveModel && activeLook.id === myLookId ? myActiveModel.name : null}
          currentProfile={currentProfile}
          onBack={() => setScreen('looks')}
          onMediaTap={i => { setViewerIndex(i); setScreen('viewer') }}
          onAdd={source => setScreen(source === 'camera' ? 'camera' : 'roll')}
          changeBanner={activeLook.id === 'A' ? { title: 'Look A updated · 2:48 PM', description: 'Aimi changed Lips: now a sheer red stain, tapped on with a finger.' } : null}
        />
      )}

      {toastInfo && (
        <UploadToast
          count={toastInfo.count}
          lookName={toastInfo.lookName}
          areaTag={toastInfo.areaTag}
          onDone={() => setToastInfo(null)}
        />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Artist / existing studio (unchanged below)
// ══════════════════════════════════════════════════════════════════════════════

// ─── Authoring flow (A1-A5) ───────────────────────────────────────────────────
const DEFAULT_AREAS = ['Eyes', 'Brows', 'Skin', 'Cheeks', 'Lips']
const AUTHOR_KEY = 'showpartner_author_v1'

function getDefaultAuthorData() {
  const mkLook = () => ({
    areas: Object.fromEntries(DEFAULT_AREAS.map(a => [a, { notes: '', products: [], refs: [] }])),
    shared: false,
    pendingApproval: false,
    changes: [],
  })
  const seededB = {
    areas: {
      Eyes:   { notes: 'Smoky liner extended 3mm past the outer corner. Build in two passes.', products: [], refs: [] },
      Brows:  { notes: 'Feathered with clear gel, no fill.', products: [], refs: [] },
      Skin:   { notes: 'Dewy base, minimal powder only on T-zone.', products: [], refs: [] },
      Cheeks: { notes: '', products: [], refs: [] },
      Lips:   { notes: 'Nude gloss, center placement only.', products: [], refs: [] },
    },
    shared: false,
    pendingApproval: true,
    changes: [],
  }
  return {
    lookCount: 3,
    lookNames: { A: 'Look A', B: 'Look B', C: 'Look C', D: 'Look D' },
    looks: { A: mkLook(), B: seededB, C: mkLook(), D: mkLook() },
    assignments: {},
  }
}

function AuthoringFlow({ currentProfile, models }) {
  const role = currentProfile?.role
  const [screen, setScreen] = useState('list')
  const [activeLookId, setActiveLookId] = useState('A')
  const [activeAreaName, setActiveAreaName] = useState(null)
  const [showInventoryPicker, setShowInventoryPicker] = useState(false)
  const [invSearch, setInvSearch] = useState('')
  const [invCat, setInvCat] = useState('All')
  const [invSelected, setInvSelected] = useState([])
  const [addAreaPrompt, setAddAreaPrompt] = useState(false)
  const [localAssign, setLocalAssign] = useState({})
  const [filterLook, setFilterLook] = useState(null)
  const [newAreaName, setNewAreaName] = useState('')
  const [listenActive, setListenActive] = useState(false)
  const recogRef = useRef(null)

  const [data, setData] = useState(() => lsGet(AUTHOR_KEY, getDefaultAuthorData()))
  function save(next) { setData(next); lsSet(AUTHOR_KEY, next) }

  const hasSpeech = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  function startListen(areaName) {
    if (!hasSpeech) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new SR()
    r.continuous = true
    r.interimResults = false
    r.onresult = e => {
      const transcript = Array.from(e.results).map(res => res[0].transcript).join(' ')
      save({
        ...data,
        looks: {
          ...data.looks,
          [activeLookId]: {
            ...data.looks[activeLookId],
            areas: {
              ...data.looks[activeLookId].areas,
              [areaName]: {
                ...data.looks[activeLookId].areas[areaName],
                notes: (data.looks[activeLookId].areas[areaName]?.notes || '') + ' ' + transcript,
              }
            }
          }
        }
      })
    }
    r.onend = () => setListenActive(false)
    r.start()
    recogRef.current = r
    setListenActive(true)
  }

  function stopListen() {
    recogRef.current?.stop()
    setListenActive(false)
  }

  const lookIds = ['A', 'B', 'C', 'D'].slice(0, data.lookCount)

  // A1 - Set up looks
  if (screen === 'setup') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
          <button onClick={() => setScreen('list')} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft />
          </button>
          <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>Set up looks</span>
          <span style={{ fontSize: 11, color: '#4A4743', paddingRight: 8 }}>{currentProfile?.name?.split(' ')[0]} · {role}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>How many makeup looks today?</span>
            <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#E8E4DF' }}>
              {[1, 2, 3, 4].map(n => (
                <button key={n} onClick={() => save({ ...data, lookCount: n })} style={{ flex: 1, minHeight: 44, border: 0, borderRadius: 8, background: data.lookCount === n ? '#111' : 'transparent', color: data.lookCount === n ? '#fff' : '#111', fontFamily: 'Georgia, serif', fontSize: 18, cursor: 'pointer' }}>{n}</button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#4A4743' }}>You can add or remove one later.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Name them</p>
            {['A', 'B', 'C', 'D'].slice(0, data.lookCount).map(id => (
              <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderBottom: '1px solid #E0DDD8' }}>
                <span style={{ width: 24, fontFamily: 'Georgia, serif', fontSize: 18 }}>{id}</span>
                <input
                  value={data.lookNames[id] || ''}
                  onChange={e => save({ ...data, lookNames: { ...data.lookNames, [id]: e.target.value } })}
                  placeholder={`Look ${id}`}
                  style={{ flex: 1, height: 44, padding: '0 12px', border: '1px solid #CFCAC4', borderRadius: 10, background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, outline: 'none' }}
                />
              </label>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { setActiveLookId('A'); setScreen('look') }} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}>
            NEXT: WRITE LOOK A
          </button>
        </div>
      </div>
    )
  }

  // A2 - Write a look
  if (screen === 'look') {
    const lookData = data.looks[activeLookId] || { areas: {}, shared: false, pendingApproval: false }
    const areaNames = Object.keys(lookData.areas)
    const writtenCount = areaNames.filter(a => lookData.areas[a]?.notes?.trim()).length
    const lookMedia = SEEDED_LOOK_MEDIA[activeLookId] || []
    const capturers = (SHOW_LOOKS.find(l => l.id === activeLookId)?.capturers || [])
      .map(id => profiles.find(p => p.id === id)?.name?.split(' ')[0]).filter(Boolean)
    const modelAssignedCount = Object.values(data.assignments).filter(v => v === activeLookId).length
    const allModelsCount = models?.length || 0
    const lookName = data.lookNames[activeLookId] || `Look ${activeLookId}`

    const isLeadAssistant = role === 'lead_assistant'
    const ctaLabel = isLeadAssistant ? 'SEND TO YADIM TO APPROVE' : 'SHARE WITH ASSISTANTS'
    const ctaSubtext = isLeadAssistant
      ? 'Assistants see it once Yadim approves. Empty areas stay hidden.'
      : role === 'artist'
        ? 'Goes straight to all assistants. No approval needed.'
        : 'Empty areas stay hidden.'

    function handleShare() {
      const next = {
        ...data,
        looks: {
          ...data.looks,
          [activeLookId]: {
            ...lookData,
            shared: !isLeadAssistant,
            pendingApproval: isLeadAssistant,
          }
        }
      }
      save(next)
      setScreen('list')
    }

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
          <button onClick={() => setScreen('list')} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft />
          </button>
          <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>{lookName}</span>
          <span style={{ fontSize: 11, color: '#4A4743', paddingRight: 8 }}>{currentProfile?.name?.split(' ')[0]} · {role}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Media card */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, borderRadius: 12, background: '#fff', border: '1px solid #E0DDD8' }}>
            <div style={{ width: 56, height: 56, borderRadius: 8, background: '#E0DDD8', flexShrink: 0, overflow: 'hidden' }}>
              {lookMedia[0] && <img src={lookMedia[0].dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{lookMedia.length ? `Demo video and ${lookMedia.filter(m => m.type === 'photo').length} photos` : 'No media yet'}</span>
              {capturers.length > 0 && <span style={{ fontSize: 11, color: '#4A4743' }}>Captured by {capturers.join(', ')}</span>}
            </span>
            <ChevronRight />
          </div>

          {/* Areas */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Areas</p>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>{writtenCount} of {areaNames.length} written</p>
            </div>
            {areaNames.map(aname => {
              const aData = lookData.areas[aname] || { notes: '', products: [], refs: [] }
              const refCount = aData.refs?.length || 0
              return (
                <button
                  key={aname}
                  onClick={() => { setActiveAreaName(aname); setScreen('area') }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderBottom: '1px solid #E0DDD8', width: '100%', padding: 0, borderLeft: 0, borderRight: 0, borderTop: 0, background: 'none', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
                >
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 0' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{aname}</span>
                    {aData.notes?.trim()
                      ? <span style={{ fontSize: 12, color: '#2E2C29' }}>{aData.notes.slice(0, 80)}{aData.notes.length > 80 ? '...' : ''}</span>
                      : <span style={{ fontSize: 12, color: '#A33D28' }}>No notes yet</span>
                    }
                    {refCount > 0 && <span style={{ fontSize: 11, color: '#4A4743' }}>{refCount} reference{refCount !== 1 ? 's' : ''}</span>}
                  </span>
                  <ChevronRight />
                </button>
              )
            })}
            {addAreaPrompt ? (
              <div style={{ display: 'flex', gap: 8, padding: '8px 0', alignItems: 'center' }}>
                <input
                  autoFocus
                  value={newAreaName}
                  onChange={e => setNewAreaName(e.target.value)}
                  placeholder="e.g. Lashes, Liner"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newAreaName.trim()) {
                      const aName = newAreaName.trim()
                      const newLookData = { ...lookData, areas: { ...lookData.areas, [aName]: { notes: '', products: [], refs: [] } } }
                      save({ ...data, looks: { ...data.looks, [activeLookId]: newLookData } })
                      setNewAreaName('')
                      setAddAreaPrompt(false)
                    }
                    if (e.key === 'Escape') { setAddAreaPrompt(false); setNewAreaName('') }
                  }}
                  style={{ flex: 1, height: 40, padding: '0 10px', border: '1px solid #CFCAC4', borderRadius: 8, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, outline: 'none' }}
                />
                <button onClick={() => { setAddAreaPrompt(false); setNewAreaName('') }} style={{ border: 0, background: 'none', cursor: 'pointer', fontSize: 13, color: '#4A4743' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setAddAreaPrompt(true)} style={{ alignSelf: 'flex-start', minHeight: 44, padding: 0, border: 0, background: 'none', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, textDecoration: 'underline', color: '#111', cursor: 'pointer' }}>
                + Add an area (lashes, liner...)
              </button>
            )}
          </div>

          {/* Models row */}
          <button
            onClick={() => { setLocalAssign({ ...data.assignments }); setFilterLook(null); setScreen('assign') }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderBottom: '1px solid #E0DDD8', width: '100%', padding: 0, borderLeft: 0, borderRight: 0, borderTop: 0, background: 'none', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
          >
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 0' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>Models getting {lookName}</span>
              <span style={{ fontSize: 12, color: '#4A4743' }}>{modelAssignedCount || (allModelsCount ? `${allModelsCount} models` : 'None assigned')}</span>
            </span>
            <ChevronRight />
          </button>
        </div>

        <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleShare} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}>
            {ctaLabel}
          </button>
          <span style={{ fontSize: 11, color: '#4A4743', textAlign: 'center' }}>{ctaSubtext}</span>
        </div>
      </div>
    )
  }

  // A3 - Write one area
  if (screen === 'area' && activeAreaName) {
    const lookData = data.looks[activeLookId] || { areas: {} }
    const aData = lookData.areas[activeAreaName] || { notes: '', products: [], refs: [] }
    const lookName = data.lookNames[activeLookId] || `Look ${activeLookId}`
    const lookMedia = SEEDED_LOOK_MEDIA[activeLookId] || []
    const sortedMedia = [...lookMedia.filter(m => m.areaTag === activeAreaName), ...lookMedia.filter(m => m.areaTag !== activeAreaName)]

    function updateAreaField(field, val) {
      save({
        ...data,
        looks: {
          ...data.looks,
          [activeLookId]: {
            ...lookData,
            areas: { ...lookData.areas, [activeAreaName]: { ...aData, [field]: val } }
          }
        }
      })
    }

    const productsInArea = MOCK_PRODUCTS.filter(p => aData.products.includes(p.id))

    function removeProduct(pid) {
      updateAreaField('products', aData.products.filter(id => id !== pid))
    }

    function toggleRef(mediaId) {
      const refs = aData.refs || []
      updateAreaField('refs', refs.includes(mediaId) ? refs.filter(id => id !== mediaId) : [...refs, mediaId])
    }

    function handleSave() {
      setScreen('look')
    }

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
          <button onClick={() => setScreen('look')} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft />
          </button>
          <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>{activeAreaName} · {lookName}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>How it is done</p>
            <div style={{ position: 'relative' }}>
              <textarea
                rows={6}
                value={aData.notes}
                onChange={e => updateAreaField('notes', e.target.value)}
                placeholder={`Notes for ${activeAreaName}...`}
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 12px 48px', border: '1px solid #111', borderRadius: 10, background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, lineHeight: 1.5, resize: 'none', color: '#111', outline: 'none' }}
              />
              {hasSpeech && (
                <button
                  aria-label={listenActive ? 'Stop dictation' : 'Start dictation'}
                  onClick={() => listenActive ? stopListen() : startListen(activeAreaName)}
                  style={{ position: 'absolute', right: 8, bottom: 8, width: 40, height: 40, borderRadius: '50%', border: 0, background: listenActive ? '#A33D28' : '#E8E4DF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={listenActive ? '#fff' : '#111'} strokeWidth="1.8" aria-hidden="true">
                    <rect x="9" y="3" width="6" height="11" rx="3"/>
                    <path d="M5 11a7 7 0 0014 0M12 18v3"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Products */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Products (optional)</p>
            {productsInArea.map(prod => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '0 8px 0 12px', border: '1px solid #E0DDD8', borderRadius: 10, background: '#fff' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: prod.sw, border: '2px solid #E0DDD8', flexShrink: 0 }} />
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{prod.name}</span>
                  <span style={{ fontSize: 11, color: '#4A4743' }}>Shade: {prod.shade} · {prod.stock}</span>
                </span>
                <button onClick={() => removeProduct(prod.id)} aria-label="Remove product" style={{ width: 40, height: 40, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A4743" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => { setInvSelected(aData.products || []); setInvSearch(''); setInvCat('All'); setShowInventoryPicker(true) }}
              style={{ minHeight: 44, borderRadius: 10, border: '1px dashed #8A8580', background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#111', cursor: 'pointer' }}
            >
              + Add from inventory
            </button>
          </div>

          {/* References */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>References</p>
              <span style={{ fontSize: 11, color: '#4A4743' }}>From {lookName}'s photos and clips</span>
            </div>
            {sortedMedia.length === 0
              ? <span style={{ fontSize: 12, color: '#4A4743' }}>No media captured for {lookName} yet.</span>
              : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
                    {sortedMedia.map(item => {
                      const selected = (aData.refs || []).includes(item.id)
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleRef(item.id)}
                          style={{ position: 'relative', aspectRatio: '1', padding: 0, borderRadius: 8, overflow: 'hidden', border: 0, background: '#E0DDD8', cursor: 'pointer' }}
                        >
                          <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selected ? 1 : 0.85 }} />
                          <span style={{ position: 'absolute', right: 4, top: 4, width: 20, height: 20, borderRadius: '50%', border: '2px solid #fff', background: selected ? '#111' : 'rgba(17,17,17,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>}
                          </span>
                          {item.areaTag && <span style={{ position: 'absolute', left: 4, bottom: 4, padding: '1px 5px', borderRadius: 4, background: 'rgba(17,17,17,.75)', color: '#fff', fontSize: 9 }}>{item.areaTag}</span>}
                        </button>
                      )
                    })}
                  </div>
                  <span style={{ fontSize: 12, color: '#4A4743' }}>Photos tagged {activeAreaName} are suggested first.</span>
                </>
              )
            }
          </div>
        </div>

        <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSave} style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}>
            SAVE {activeAreaName.toUpperCase()}
          </button>
        </div>

        {/* A3b - Inventory picker sheet */}
        {showInventoryPicker && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.35)' }} onClick={() => setShowInventoryPicker(false)}>
            <div role="dialog" aria-label="Add from inventory" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: '#F5F2EE', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <button aria-label="Close" style={{ flexShrink: 0, height: 28, background: 'none', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ width: 40, height: 5, borderRadius: 3, background: '#B9B4AE' }} />
              </button>
              <div style={{ flexShrink: 0, padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid #E0DDD8' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 22 }}>Add from inventory</span>
                  <span style={{ fontSize: 11, color: '#4A4743' }}>for {activeAreaName} · {data.lookNames[activeLookId] || `Look ${activeLookId}`}</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 14px', background: '#fff', border: '1px solid #E0DDD8', borderRadius: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6A64" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
                  <input
                    value={invSearch}
                    onChange={e => setInvSearch(e.target.value)}
                    placeholder="Search product or shade"
                    style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14 }}
                  />
                </label>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                  {INV_CATS.map(cat => (
                    <button key={cat} onClick={() => setInvCat(cat)} style={{ flexShrink: 0, minHeight: 40, padding: '0 14px', borderRadius: 999, border: invCat === cat ? '1px solid #111' : '1px solid #CFCAC4', background: invCat === cat ? '#111' : 'transparent', color: invCat === cat ? '#fff' : '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, cursor: 'pointer' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px' }}>
                {MOCK_PRODUCTS
                  .filter(p => (invCat === 'All' || p.cat === invCat) && (!invSearch || p.name.toLowerCase().includes(invSearch.toLowerCase()) || p.shade.toLowerCase().includes(invSearch.toLowerCase())))
                  .map(prod => (
                    <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 68, borderBottom: '1px solid #E0DDD8', cursor: 'pointer' }}>
                      <span style={{ width: 36, height: 36, borderRadius: '50%', background: prod.sw, border: '2px solid #E0DDD8', flexShrink: 0 }} />
                      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{prod.name}</span>
                        <span style={{ fontSize: 12, color: '#2E2C29' }}>Shade: {prod.shade}</span>
                        <span style={{ fontSize: 11, color: prod.out ? '#A33D28' : '#4A4743' }}>{prod.stock}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={invSelected.includes(prod.id)}
                        onChange={() => setInvSelected(prev => prev.includes(prod.id) ? prev.filter(id => id !== prod.id) : [...prev, prod.id])}
                        style={{ width: 22, height: 22, accentColor: '#111', cursor: 'pointer' }}
                      />
                    </label>
                  ))
                }
              </div>
              <div style={{ flexShrink: 0, padding: '12px 16px 28px', borderTop: '1px solid #E0DDD8' }}>
                <button
                  onClick={() => {
                    updateAreaField('products', invSelected)
                    setShowInventoryPicker(false)
                  }}
                  style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}
                >
                  ADD {invSelected.length} TO {activeAreaName.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // A4 - Assign models
  if (screen === 'assign') {
    const lookName = data.lookNames[activeLookId] || `Look ${activeLookId}`
    const allIds = ['A', 'B', 'C', 'D'].slice(0, data.lookCount)

    const counts = {}
    allIds.forEach(id => { counts[id] = Object.values(localAssign).filter(v => v === id).length })
    const notSet = (models?.length || 0) - Object.values(localAssign).filter(v => allIds.includes(v)).length
    const displayModels = models?.length
      ? (filterLook === 'NOT_SET'
          ? models.filter(m => !localAssign[m.id] || !allIds.includes(localAssign[m.id]))
          : filterLook
            ? models.filter(m => localAssign[m.id] === filterLook)
            : models)
      : []

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
          <button onClick={() => setScreen('look')} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft />
          </button>
          <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>Who gets which look</span>
          <span style={{ fontSize: 11, color: '#4A4743', paddingRight: 8 }}>{models?.length || 0} models</span>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto' }}>
          {allIds.map(id => (
            <button key={id} onClick={() => setFilterLook(filterLook === id ? null : id)} style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 999, border: filterLook === id ? '1px solid #111' : '1px solid #CFCAC4', background: filterLook === id ? '#111' : 'transparent', color: filterLook === id ? '#fff' : '#111', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
              {id} · {counts[id] || 0}
            </button>
          ))}
          {notSet > 0 && (
            <button onClick={() => setFilterLook(filterLook === 'NOT_SET' ? null : 'NOT_SET')} style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 999, border: filterLook === 'NOT_SET' ? '1px solid #A33D28' : '1px solid #A33D28', background: filterLook === 'NOT_SET' ? '#A33D28' : 'transparent', color: filterLook === 'NOT_SET' ? '#fff' : '#A33D28', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Not set · {notSet}
            </button>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px' }}>
          {displayModels.length === 0 && (
            <p style={{ padding: '16px 0', fontSize: 13, color: '#4A4743' }}>No models in the lineup yet.</p>
          )}
          {displayModels.map(model => {
            const assigned = localAssign[model.id]
            const initials = model.name?.split(' ').map(w => w[0]).join('') || '?'
            return (
              <div key={model.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderBottom: '1px solid #E0DDD8' }}>
                {model.avatar
                  ? <img src={model.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{initials}</span>
                }
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 15 }}>{model.name}</span>
                  <span style={{ fontSize: 11, color: assigned ? '#4A4743' : '#A33D28' }}>{assigned ? `Look ${assigned}` : 'not set'}</span>
                </span>
                <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 8, background: '#E8E4DF' }}>
                  {allIds.map(id => (
                    <button
                      key={id}
                      onClick={() => setLocalAssign(prev => ({ ...prev, [model.id]: id }))}
                      style={{ width: 36, height: 36, border: 0, borderRadius: 6, background: assigned === id ? '#111' : 'transparent', color: assigned === id ? '#fff' : '#111', fontFamily: 'Georgia, serif', fontSize: 15, cursor: 'pointer' }}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => { save({ ...data, assignments: localAssign }); setScreen('look') }}
            style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.12em', cursor: 'pointer' }}
          >
            SAVE · ASSISTANTS SEE IT ON THEIR MODEL
          </button>
        </div>
      </div>
    )
  }

  // List screen (default)
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Looks</p>
        <button onClick={() => setScreen('setup')} style={{ border: 0, background: 'none', fontSize: 12, color: '#111', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>Set up</button>
      </div>
      {lookIds.map(id => {
        const lookData = data.looks[id] || { areas: {} }
        const areaNames = Object.keys(lookData.areas)
        const writtenCount = areaNames.filter(a => lookData.areas[a]?.notes?.trim()).length
        const lookName = data.lookNames[id] || `Look ${id}`
        return (
          <button
            key={id}
            onClick={() => { setActiveLookId(id); setScreen('look') }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 12, border: '1px solid #E0DDD8', background: '#fff', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#6E6A64', width: 28, flexShrink: 0 }}>{id}</span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{lookName}</span>
              <span style={{ fontSize: 12, color: writtenCount > 0 ? '#4A4743' : '#A33D28' }}>
                {writtenCount} of {areaNames.length} area{areaNames.length !== 1 ? 's' : ''} written
              </span>
            </span>
            <ChevronRight />
          </button>
        )
      })}
    </div>
  )
}

// ─── Lead assistant: LOOKS + MY WORK tabs ────────────────────────────────────
function LeadAssistantStudioView({ currentProfile, models }) {
  const [tab, setTab] = useState('LOOKS')

  function TabBar() {
    return (
      <div className="flex border-b border-[#E0DDD8] px-4 flex-shrink-0">
        {['LOOKS', 'MY WORK'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 text-[10px] tracking-widest uppercase font-sans outline-none border-none bg-transparent cursor-pointer" style={{ color: tab === t ? '#111' : '#888580', borderBottom: tab === t ? '1.5px solid #111' : '1.5px solid transparent', fontWeight: tab === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>
    )
  }

  if (tab === 'MY WORK') {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabBar />
        <AssistantStudioFlow currentProfile={currentProfile} models={models} />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TabBar />
      <AuthoringFlow currentProfile={currentProfile} models={models} />
    </div>
  )
}

const SHOW_INVENTORY = [
  { id: 'si-1',  item: 'Hair Extensions (clip-in sets)',    unit: 'sets',    allocated: 12, used: 0 },
  { id: 'si-2',  item: 'Hairspray (travel size)',           unit: 'cans',    allocated: 24, used: 0 },
  { id: 'si-3',  item: 'Bobby Pins',                        unit: 'pack',    allocated: 8,  used: 0 },
  { id: 'si-4',  item: 'Mascara (Maybelline Sky High)',     unit: 'tubes',   allocated: 10, used: 0 },
  { id: 'si-5',  item: 'Foundation (Armani Luminous Silk)', unit: 'bottles', allocated: 6,  used: 0 },
  { id: 'si-6',  item: 'Setting Powder',                    unit: 'jars',    allocated: 4,  used: 0 },
  { id: 'si-7',  item: 'Lip Liner (deep berry)',            unit: 'pencils', allocated: 14, used: 0 },
  { id: 'si-8',  item: 'Acrylic Nail Tips',                 unit: 'packs',   allocated: 20, used: 0 },
  { id: 'si-9',  item: 'Nail Glue',                         unit: 'tubes',   allocated: 16, used: 0 },
  { id: 'si-10', item: 'Nail File',                         unit: 'pieces',  allocated: 30, used: 0 },
  { id: 'si-11', item: 'Lash Glue',                         unit: 'tubes',   allocated: 8,  used: 0 },
  { id: 'si-12', item: 'Individual Lashes',                 unit: 'sets',    allocated: 18, used: 0 },
]
const SEEDED_INVENTORY = {}
const SEEDED_RECEIPTS = {
  'Marcus Lee': [
    { id: 'rec-ml-1', merchant: 'Hair Supply Co', amount: 312, category: 'Products',       date: 'Apr 12, 2026', thumb: null },
    { id: 'rec-ml-2', merchant: 'Uber to venue',  amount: 48,  category: 'Transportation', date: 'Apr 12, 2026', thumb: null },
  ],
}
const CATEGORIES = ['Products', 'Transportation', 'Meals', 'Equipment', 'Other']

const NAME_TO_AVATAR = Object.fromEntries(profiles.map(p => [p.name, p.avatar]))

function LookCard({ look }) {
  const [expanded, setExpanded] = useState(false)
  const [photos, setPhotos] = useState(() => lsGet(`showpartner_look_photos_${look.id}`, [null, null, null]))

  function handlePhotoChange(e, slotIndex) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const updated = photos.map((p, i) => i === slotIndex ? ev.target.result : p)
      setPhotos(updated)
      lsSet(`showpartner_look_photos_${look.id}`, updated)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemovePhoto(slotIndex) {
    if (!window.confirm('Remove this photo?')) return
    const updated = photos.map((p, i) => i === slotIndex ? null : p)
    setPhotos(updated)
    lsSet(`showpartner_look_photos_${look.id}`, updated)
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <p className="text-[11px] tracking-widest uppercase font-sans text-[#888580]" style={{ marginBottom: 6 }}>LOOK {look.number || look.id}</p>
      <p className="font-serif text-[#111]" style={{ fontSize: 18, lineHeight: 1.3, marginBottom: 14 }}>{look.title || look.name}</p>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {(look.steps || look.areas?.map(a => a.notes) || []).map((step, i) => (
          <li key={i} className="font-sans text-[#444]" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>
            <span className="text-[#888580]">{i + 1}. </span>{step}
          </li>
        ))}
      </ol>
      <button
        onClick={() => setExpanded(e => !e)}
        className="font-sans text-[#888580] bg-transparent border-none outline-none cursor-pointer p-0"
        style={{ marginTop: 16, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        MODELS ASSIGNED {expanded ? '▴' : '▾'}
      </button>
      {expanded && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
          {(look.models || []).map(name => {
            const avatar = NAME_TO_AVATAR[name]
            return (
              <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {avatar
                  ? <img src={avatar} alt={name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="font-sans text-[#888580]" style={{ fontSize: 9 }}>{name.charAt(0)}</span></div>
                }
                <span className="font-sans text-[#888580]" style={{ fontSize: 13 }}>{name}</span>
              </li>
            )
          })}
        </ul>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
        {photos.map((photo, slotIndex) => (
          <div key={slotIndex} style={{ position: 'relative', paddingTop: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
              {photo ? (
                <button onClick={() => handleRemovePhoto(slotIndex)} style={{ width: '100%', height: '100%', padding: 0, border: 'none', cursor: 'pointer', background: 'none', display: 'block' }}>
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ) : (
                <label style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #C8C4BF', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.4)' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoChange(e, slotIndex)} />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReceiptUploadSheet({ onSave, onClose }) {
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount]     = useState('')
  const [category, setCategory] = useState('Products')
  const [thumb, setThumb]       = useState(null)
  const fileRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setThumb(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleSave() {
    if (!merchant.trim() || !amount) return
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    onSave({ id: `rec-${Date.now()}`, merchant: merchant.trim(), amount: parseFloat(amount), category, date: today, thumb })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full bg-greige rounded-t-2xl px-4 pt-3 pb-8" onClick={e => e.stopPropagation()}>
        <div className="w-8 h-1 rounded-full bg-[#C8C4BF] mx-auto mb-4" />
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-4">UPLOAD RECEIPT</p>
        <label className="flex items-center gap-3 py-3 mb-4 border-b border-[#E0DDD8] cursor-pointer">
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          {thumb ? (
            <img src={thumb} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded border border-dashed border-[#C8C4BF] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
            </div>
          )}
          <span className="text-sm font-sans text-[#888580]">{thumb ? 'Photo attached' : 'Choose photo or file'}</span>
        </label>
        <input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="Merchant name" className="w-full bg-transparent text-sm font-sans text-[#111] placeholder-[#B0ACA7] border-b border-[#E0DDD8] outline-none pb-2 mb-4" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" inputMode="decimal" className="w-full bg-transparent text-sm font-sans text-[#111] placeholder-[#B0ACA7] border-b border-[#E0DDD8] outline-none pb-2 mb-4" />
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className="text-[10px] tracking-widest uppercase font-sans rounded-full px-3 py-1 outline-none border" style={{ backgroundColor: category === cat ? '#111' : 'transparent', borderColor: category === cat ? '#111' : '#C8C4BF', color: category === cat ? '#F5F2EE' : '#888580' }}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={handleSave} disabled={!merchant.trim() || !amount} className="w-full py-3 text-[10px] tracking-widest uppercase font-sans rounded-lg font-semibold outline-none border-none cursor-pointer" style={{ backgroundColor: (!merchant.trim() || !amount) ? '#D0CCC7' : '#111', color: '#F5F2EE' }}>
          SAVE
        </button>
      </div>
    </div>
  )
}

// ─── K4 — approve a look ──────────────────────────────────────────────────────
function ApproveScreen({ lookId, lookName, data, onApprove, onSuggestChange, onBack }) {
  const lookData = data?.looks?.[lookId] || { areas: {} }
  const areaNames = Object.keys(lookData.areas || {})
  const writtenAreas = areaNames.filter(a => lookData.areas[a]?.notes?.trim())
  const lookMedia = SEEDED_LOOK_MEDIA[lookId] || []
  const coverMedia = lookMedia[0]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F5F2EE', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderBottom: '1px solid #E0DDD8' }}>
        <button onClick={onBack} aria-label="Back" style={{ width: 44, height: 44, border: 0, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft />
        </button>
        <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 20 }}>{lookName}</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {/* Header */}
        <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Waiting on you</p>
        <p style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 26, color: '#111' }}>{lookName}</p>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#4A4743' }}>
          Written by Iona · {writtenAreas.length} area{writtenAreas.length !== 1 ? 's' : ''} · {lookMedia.filter(m => m.type === 'photo').length + lookMedia.filter(m => m.type === 'video').length} media
        </p>

        {/* Cover image */}
        <div style={{ height: 180, borderRadius: 12, overflow: 'hidden', background: '#2E2C29', marginBottom: 16 }}>
          {coverMedia
            ? <img src={coverMedia.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: '#8A8480' }}>No demo yet</span></div>
          }
        </div>

        {/* Areas */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
          {writtenAreas.map(aName => {
            const aData = lookData.areas[aName]
            return (
              <div key={aName} style={{ padding: '12px 0', borderBottom: '1px solid #E0DDD8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>{aName}</span>
                  <span style={{ fontSize: 11, color: '#4A4743' }}>Iona · 2:18 PM</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#2E2C29' }}>{aData.notes}</p>
              </div>
            )
          })}
          {writtenAreas.length === 0 && (
            <p style={{ fontSize: 13, color: '#888580', fontStyle: 'italic', padding: '12px 0' }}>No areas written yet.</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ flexShrink: 0, padding: '12px 16px 28px', borderTop: '1px solid #E0DDD8', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onApprove}
          style={{ width: '100%', minHeight: 52, borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.1em', fontWeight: 600, cursor: 'pointer' }}
        >
          APPROVE · SHARE WITH ASSISTANTS
        </button>
        <button
          onClick={onSuggestChange}
          style={{ width: '100%', minHeight: 48, borderRadius: 8, border: '1px solid #CFCAC4', background: 'transparent', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '.08em', cursor: 'pointer' }}
        >
          SUGGEST A CHANGE
        </button>
      </div>
    </div>
  )
}

// ─── Artist / lead studio view ────────────────────────────────────────────────
function ArtistStudioView({ currentProfile }) {
  const isArtist = currentProfile?.role === 'artist'

  const [section, setSection] = useState('LOOKS')
  const [showUpload, setShowUpload] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [approveScreenLookId, setApproveScreenLookId] = useState(null)

  const studioTabs = isArtist ? ['LOOKS', 'INVENTORY', 'RECEIPTS'] : ['LOOKS', 'INVENTORY']

  const artistId = currentProfile?.id || 'unknown'
  const artistName = currentProfile?.name || ''

  const invKey = `showpartner_inventory_${artistId}`
  const [inventory, setInventory] = useState(() => {
    const saved = lsGet(invKey, null)
    if (saved) return saved
    return (SEEDED_INVENTORY[artistName] || SHOW_INVENTORY).map(i => ({ ...i }))
  })

  function updateUsed(id, val) {
    const updated = inventory.map(i => i.id === id ? { ...i, used: Math.max(0, val) } : i)
    setInventory(updated)
    lsSet(invKey, updated)
  }

  const overages = inventory.filter(i => i.used > i.allocated)
  const hasOverage = overages.length > 0

  function handleSubmit() {
    lsSet(invKey, inventory)
    setSubmitted(true)
  }

  const recKey = `showpartner_receipts_${artistId}`
  const [receipts, setReceipts] = useState(() => {
    const saved = lsGet(recKey, null)
    if (saved) return saved
    return (SEEDED_RECEIPTS[artistName] || []).map(r => ({ ...r }))
  })

  function handleSaveReceipt(rec) {
    const updated = [rec, ...receipts]
    setReceipts(updated)
    lsSet(recKey, updated)
    setShowUpload(false)
  }

  const [authorData, setAuthorData] = useState(() => lsGet(AUTHOR_KEY, getDefaultAuthorData()))

  const pendingApprovalLooks = isArtist
    ? ['A', 'B', 'C', 'D'].filter(id => authorData?.looks?.[id]?.pendingApproval)
    : []

  function handleApprove(lookId) {
    const next = {
      ...authorData,
      looks: {
        ...authorData.looks,
        [lookId]: { ...authorData.looks[lookId], pendingApproval: false, shared: true },
      },
    }
    setAuthorData(next)
    lsSet(AUTHOR_KEY, next)
    setApproveScreenLookId(null)
  }

  function handleSuggestChange(lookId) {
    const next = {
      ...authorData,
      looks: {
        ...authorData.looks,
        [lookId]: { ...authorData.looks[lookId], pendingApproval: false },
      },
    }
    setAuthorData(next)
    lsSet(AUTHOR_KEY, next)
    setApproveScreenLookId(null)
  }

  if (approveScreenLookId) {
    const lName = authorData?.lookNames?.[approveScreenLookId] || `Look ${approveScreenLookId}`
    return (
      <ApproveScreen
        lookId={approveScreenLookId}
        lookName={lName}
        data={authorData}
        onApprove={() => handleApprove(approveScreenLookId)}
        onSuggestChange={() => handleSuggestChange(approveScreenLookId)}
        onBack={() => setApproveScreenLookId(null)}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex border-b border-[#E0DDD8] px-4 flex-shrink-0">
        {studioTabs.map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className="flex-1 py-3 text-[10px] tracking-widest uppercase font-sans outline-none border-none bg-transparent cursor-pointer"
            style={{ color: section === s ? '#111' : '#888580', borderBottom: section === s ? '1.5px solid #111' : '1.5px solid transparent', fontWeight: section === s ? 600 : 400 }}
          >
            {s}
          </button>
        ))}
      </div>

      {section === 'LOOKS' && pendingApprovalLooks.length > 0 && (
        <div style={{ flexShrink: 0, borderBottom: '1px solid #E0DDD8', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6E6A64' }}>Waiting on you</p>
          {pendingApprovalLooks.map(id => {
            const lName = authorData?.lookNames?.[id] || `Look ${id}`
            return (
              <button
                key={id}
                onClick={() => setApproveScreenLookId(id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1.5px solid #D4A853', background: '#FFFBF2', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', color: '#111', cursor: 'pointer' }}
              >
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: 'Georgia, serif', fontSize: 18 }}>{lName}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#4A4743', marginTop: 2 }}>Written by Iona · approve to share with assistants</span>
                </span>
                <ChevronRight />
              </button>
            )
          })}
        </div>
      )}
      {section === 'LOOKS' && (
        <AuthoringFlow currentProfile={currentProfile} models={[]} />
      )}

      {section === 'INVENTORY' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {inventory.length === 0 && <p className="text-sm font-sans text-[#B0ACA7] italic">No inventory allocated for this show.</p>}
          {inventory.map(item => {
            const over = item.used > item.allocated
            const atBudget = item.used === item.allocated
            const statusColor = over ? '#C4614A' : atBudget ? '#D4A853' : '#7A9E7E'
            const statusLabel = over ? 'OVER BUDGET' : atBudget ? 'AT BUDGET' : 'UNDER BUDGET'
            return (
              <div key={item.id} className="py-4 border-b border-[#E0DDD8]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-sans font-medium text-[#111]">{item.item}</p>
                    <p className="text-[11px] font-sans text-[#888580]">Allocated: {item.allocated} {item.unit}</p>
                  </div>
                  <span className="text-[8px] tracking-widest uppercase font-sans rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: statusColor + '22', color: statusColor }}>{statusLabel}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-sans text-[#888580]">Used:</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateUsed(item.id, item.used - 1)} className="w-8 h-8 rounded-full border border-[#C8C4BF] flex items-center justify-center text-[#111] outline-none bg-transparent cursor-pointer text-lg leading-none">−</button>
                    <input type="number" value={item.used} onChange={e => updateUsed(item.id, parseInt(e.target.value) || 0)} className="w-14 text-center text-sm font-sans font-medium text-[#111] bg-transparent border-b border-[#E0DDD8] outline-none tabular-nums py-1" />
                    <button onClick={() => updateUsed(item.id, item.used + 1)} className="w-8 h-8 rounded-full border border-[#C8C4BF] flex items-center justify-center text-[#111] outline-none bg-transparent cursor-pointer text-lg leading-none">+</button>
                  </div>
                </div>
                {over && <div className="mt-3 px-3 py-2 rounded-lg text-[11px] font-sans" style={{ backgroundColor: '#C4614A22', color: '#C4614A' }}>You've exceeded your allocation by {item.used - item.allocated} {item.unit}. This will be flagged for adjustment.</div>}
              </div>
            )
          })}
          {inventory.length > 0 && (
            <div className="mt-6">
              {submitted
                ? <div className="text-center py-3 rounded-lg text-[11px] font-sans" style={{ backgroundColor: '#7A9E7E22', color: '#7A9E7E' }}>Inventory submitted{hasOverage ? ' -- overages flagged for review' : ''}</div>
                : <button onClick={handleSubmit} className="w-full py-3 text-[10px] tracking-widest uppercase font-sans rounded-lg font-semibold outline-none border-none cursor-pointer" style={{ backgroundColor: '#111', color: '#F5F2EE' }}>SUBMIT INVENTORY</button>
              }
            </div>
          )}
        </div>
      )}

      {section === 'RECEIPTS' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 relative">
          {receipts.length === 0 && <p className="text-sm font-sans text-[#B0ACA7] italic">No receipts uploaded yet.</p>}
          {receipts.map(rec => (
            <div key={rec.id} className="flex items-center gap-3 py-3 border-b border-[#E0DDD8]">
              {rec.thumb
                ? <img src={rec.thumb} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                : <div className="w-10 h-10 rounded bg-white/60 border border-[#E0DDD8] flex items-center justify-center flex-shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[#888580]"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans text-[#111] truncate">{rec.merchant}</p>
                <p className="text-[10px] font-sans text-[#888580]">{rec.category} · {rec.date}</p>
              </div>
              <p className="font-serif text-base text-[#111] flex-shrink-0">{fmt(rec.amount)}</p>
            </div>
          ))}
          <button
            onClick={() => setShowUpload(true)}
            className="fixed bottom-24 right-4 w-12 h-12 rounded-full flex items-center justify-center outline-none border-none cursor-pointer shadow-lg z-10"
            style={{ backgroundColor: '#111' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><line x1="9" y1="3" x2="9" y2="15"/><line x1="3" y1="9" x2="15" y2="9"/></svg>
          </button>
        </div>
      )}

      {showUpload && <ReceiptUploadSheet onSave={handleSaveReceipt} onClose={() => setShowUpload(false)} />}
    </div>
  )
}

// ─── Main StudioView ───────────────────────────────────────────────────────────
export default function StudioView({ currentProfile, models: allModels }) {
  const role = currentProfile?.role
  if (role === 'lead_assistant') return <LeadAssistantStudioView currentProfile={currentProfile} models={allModels} />
  if (role === 'assistant') return <AssistantStudioFlow currentProfile={currentProfile} models={allModels} />
  return <ArtistStudioView currentProfile={currentProfile} />
}
