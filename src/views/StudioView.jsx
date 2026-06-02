import { useState, useEffect, useRef } from 'react'

// ─── Seeded data ───────────────────────────────────────────────────────────────
const REFERENCE_PHOTOS = {
  // Marcus Lee's first 3 assigned models (by model id)
  'm1': { caption: 'Bleached brows, glass skin, red tooth gems',    url: '/models/Sofia-Andersen-1.png' },
  'm5': { caption: 'Natural wave, loose braid, gold pins',          url: '/models/Aaliyah-Jones-1.png'  },
  'm9': { caption: 'Bold liner, nude lip, defined cheekbone',       url: '/models/Priya-Sharma-1.png'   },
}

const SEEDED_INVENTORY = {
  'Marcus Lee': [
    { id: 'inv-ml-1', item: 'Hair Extensions',   unit: 'units',   allocated: 60, used: 80 },
    { id: 'inv-ml-2', item: 'Setting Spray',     unit: 'bottles', allocated: 4,  used: 3  },
    { id: 'inv-ml-3', item: 'Bobby Pins (pack)', unit: 'packs',   allocated: 10, used: 10 },
  ],
  'Zoe Park': [
    { id: 'inv-zp-1', item: 'Foundation',     unit: 'bottles', allocated: 8,  used: 6  },
    { id: 'inv-zp-2', item: 'Setting Powder', unit: 'bottles', allocated: 5,  used: 7  },
    { id: 'inv-zp-3', item: 'Mascara',        unit: 'tubes',   allocated: 12, used: 14 },
  ],
}

const SEEDED_RECEIPTS = {
  'Marcus Lee': [
    { id: 'rec-ml-1', merchant: 'Hair Supply Co', amount: 312, category: 'Products',       date: 'Apr 12, 2026', thumb: null },
    { id: 'rec-ml-2', merchant: 'Uber to venue',  amount: 48,  category: 'Transportation', date: 'Apr 12, 2026', thumb: null },
  ],
}

const CATEGORIES = ['Products', 'Transportation', 'Meals', 'Equipment', 'Other']

// ─── Helpers ───────────────────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function fmt(n) { return `$${Number(n).toLocaleString()}` }

// ─── Look Documentation Sheet (full-screen overlay) ───────────────────────────
function LookSheet({ model, artistId, onClose }) {
  const lsKey = `showpartner_looks_${artistId}_${model.id}`
  const [docs, setDocs] = useState(() => lsGet(lsKey, []))
  const [editCaption, setEditCaption] = useState({}) // { photoId: string }
  const fileInputRef = useRef(null)

  const refPhoto = REFERENCE_PHOTOS[model.id]

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        url: ev.target.result,
        caption: '',
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      }
      const updated = [...docs, newDoc]
      setDocs(updated)
      lsSet(lsKey, updated)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function updateCaption(id, caption) {
    const updated = docs.map(d => d.id === id ? { ...d, caption } : d)
    setDocs(updated)
    lsSet(lsKey, updated)
  }

  function removeDoc(id) {
    const updated = docs.filter(d => d.id !== id)
    setDocs(updated)
    lsSet(lsKey, updated)
  }

  return (
    <div className="fixed inset-0 z-50 bg-greige dark:bg-greige-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <button onClick={onClose} className="outline-none p-1 -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[#888580]">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base text-[#111] dark:text-[#F0EDE8] leading-tight truncate">{model.name}</p>
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">LOOK {model.lookNumber}</p>
        </div>
        {model.avatar && (
          <img src={model.avatar} alt="" className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Reference photos */}
        <div className="mb-6">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">REFERENCE PHOTOS</p>
          {refPhoto ? (
            <div className="rounded-xl overflow-hidden mb-2">
              <img src={refPhoto.url} alt="" className="w-full object-cover" style={{ maxHeight: 220, objectPosition: 'center top' }} />
              {refPhoto.caption && (
                <p className="text-[11px] font-sans text-[#888580] px-3 py-2 bg-white/60 dark:bg-white/5">{refPhoto.caption}</p>
              )}
            </div>
          ) : (
            <p className="text-sm font-sans text-[#B0ACA7] italic">No reference photos uploaded yet.</p>
          )}
        </div>

        {/* My documentation */}
        <div className="mb-4">
          <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-3">MY DOCUMENTATION</p>
          {docs.length === 0 && (
            <p className="text-sm font-sans text-[#B0ACA7] italic mb-4">No photos added yet.</p>
          )}
          {docs.map(doc => (
            <div key={doc.id} className="mb-4 rounded-xl overflow-hidden border border-[#E0DDD8] dark:border-[#2E2B28]">
              <img src={doc.url} alt="" className="w-full object-cover" style={{ maxHeight: 220, objectPosition: 'center top' }} />
              <div className="px-3 py-2 bg-white/60 dark:bg-white/5">
                <input
                  value={editCaption[doc.id] ?? doc.caption}
                  onChange={e => {
                    setEditCaption(c => ({ ...c, [doc.id]: e.target.value }))
                    updateCaption(doc.id, e.target.value)
                  }}
                  placeholder="Add a caption…"
                  className="w-full bg-transparent text-[11px] font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] outline-none border-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-sans text-[#B0ACA7]">{doc.timestamp}</span>
                  <button onClick={() => removeDoc(doc.id)} className="text-[9px] tracking-widest uppercase font-sans text-[#C4614A] bg-transparent border-none outline-none cursor-pointer">REMOVE</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add photo */}
        <label className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-[#C8C4BF] dark:border-[#3A3632] rounded-xl cursor-pointer">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]">
            <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
          </svg>
          <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">ADD PHOTO</span>
        </label>
      </div>
    </div>
  )
}

// ─── Receipt upload sheet ──────────────────────────────────────────────────────
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
      <div className="w-full bg-greige dark:bg-greige-dark rounded-t-2xl px-4 pt-3 pb-8" onClick={e => e.stopPropagation()}>
        <div className="w-8 h-1 rounded-full bg-[#C8C4BF] dark:bg-[#3A3632] mx-auto mb-4" />
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-4">UPLOAD RECEIPT</p>

        {/* File picker */}
        <label className="flex items-center gap-3 py-3 mb-4 border-b border-[#E0DDD8] dark:border-[#2E2B28] cursor-pointer">
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          {thumb ? (
            <img src={thumb} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded border border-dashed border-[#C8C4BF] dark:border-[#3A3632] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#888580]">
                <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
              </svg>
            </div>
          )}
          <span className="text-sm font-sans text-[#888580]">{thumb ? 'Photo attached' : 'Choose photo or file'}</span>
        </label>

        {/* Merchant */}
        <input
          value={merchant}
          onChange={e => setMerchant(e.target.value)}
          placeholder="Merchant name"
          className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-2 mb-4"
        />

        {/* Amount */}
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-2 mb-4"
        />

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="text-[10px] tracking-widest uppercase font-sans rounded-full px-3 py-1 outline-none border"
              style={{
                backgroundColor: category === cat ? '#111' : 'transparent',
                borderColor: category === cat ? '#111' : '#C8C4BF',
                color: category === cat ? '#F5F2EE' : '#888580',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!merchant.trim() || !amount}
          className="w-full py-3 text-[10px] tracking-widest uppercase font-sans rounded-lg font-semibold outline-none border-none cursor-pointer"
          style={{ backgroundColor: (!merchant.trim() || !amount) ? '#D0CCC7' : '#111', color: '#F5F2EE' }}
        >
          SAVE
        </button>
      </div>
    </div>
  )
}

// ─── Main StudioView ───────────────────────────────────────────────────────────
export default function StudioView({ currentProfile, models: allModels }) {
  const [section, setSection] = useState('LOOKS')
  const [lookModel, setLookModel] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const artistId = currentProfile?.id || 'unknown'
  const artistName = currentProfile?.name || ''

  // Models assigned to this artist
  const myModels = allModels.filter(m =>
    m.hairArtist === artistName ||
    m.makeupArtist === artistName ||
    m.nailArtist === artistName ||
    m.assignedArtists?.includes(artistName)
  )

  // Inventory (localStorage → seeded defaults)
  const invKey = `showpartner_inventory_${artistId}`
  const [inventory, setInventory] = useState(() => {
    const saved = lsGet(invKey, null)
    if (saved) return saved
    return (SEEDED_INVENTORY[artistName] || []).map(i => ({ ...i }))
  })

  function updateUsed(id, val) {
    const updated = inventory.map(i => i.id === id ? { ...i, used: Math.max(0, val) } : i)
    setInventory(updated)
    lsSet(invKey, updated)
  }

  const overages = inventory.filter(i => i.used > i.allocated)
  const hasOverage = overages.length > 0

  function handleSubmit() {
    // Persist final state and mark submitted
    lsSet(invKey, inventory)
    setSubmitted(true)
  }

  // Receipts (localStorage → seeded defaults)
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Section toggle */}
      <div className="flex border-b border-[#E0DDD8] dark:border-[#2E2B28] px-4 flex-shrink-0">
        {['LOOKS', 'INVENTORY', 'RECEIPTS'].map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className="flex-1 py-3 text-[10px] tracking-widest uppercase font-sans outline-none border-none bg-transparent cursor-pointer"
            style={{
              color: section === s ? '#111' : '#888580',
              borderBottom: section === s ? '1.5px solid #111' : '1.5px solid transparent',
              fontWeight: section === s ? 600 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── LOOKS ─────────────────────────────────────────────────────────── */}
      {section === 'LOOKS' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {myModels.length === 0 && (
            <p className="text-sm font-sans text-[#B0ACA7] italic">No models assigned to you today.</p>
          )}
          {myModels.map(model => (
            <div key={model.id} className="flex items-center gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
              <img src={model.avatar} alt={model.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ objectPosition: 'center top' }} />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-[#111] dark:text-[#F0EDE8] truncate">{model.name}</p>
                <p className="text-[10px] font-sans text-[#888580]">LOOK {model.lookNumber}</p>
              </div>
              <button
                onClick={() => setLookModel(model)}
                className="text-[9px] tracking-widest uppercase font-sans border border-[#C8C4BF] dark:border-[#3A3632] px-3 py-1.5 rounded text-[#111] dark:text-[#F0EDE8] bg-transparent outline-none cursor-pointer flex-shrink-0"
              >
                DOCUMENT LOOK
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── INVENTORY ─────────────────────────────────────────────────────── */}
      {section === 'INVENTORY' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {inventory.length === 0 && (
            <p className="text-sm font-sans text-[#B0ACA7] italic">No inventory allocated for this show.</p>
          )}

          {inventory.map(item => {
            const over = item.used > item.allocated
            const atBudget = item.used === item.allocated
            const statusColor = over ? '#C4614A' : atBudget ? '#D4A853' : '#7A9E7E'
            const statusLabel = over ? 'OVER BUDGET' : atBudget ? 'AT BUDGET' : 'UNDER BUDGET'
            return (
              <div key={item.id} className="py-4 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-sans font-medium text-[#111] dark:text-[#F0EDE8]">{item.item}</p>
                    <p className="text-[11px] font-sans text-[#888580]">Allocated: {item.allocated} {item.unit}</p>
                  </div>
                  <span className="text-[8px] tracking-widest uppercase font-sans rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: statusColor + '22', color: statusColor }}>
                    {statusLabel}
                  </span>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-sans text-[#888580]">Used:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateUsed(item.id, item.used - 1)}
                      className="w-8 h-8 rounded-full border border-[#C8C4BF] dark:border-[#3A3632] flex items-center justify-center text-[#111] dark:text-[#F0EDE8] outline-none bg-transparent cursor-pointer text-lg leading-none"
                    >−</button>
                    <input
                      type="number"
                      value={item.used}
                      onChange={e => updateUsed(item.id, parseInt(e.target.value) || 0)}
                      className="w-14 text-center text-sm font-sans font-medium text-[#111] dark:text-[#F0EDE8] bg-transparent border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none tabular-nums py-1"
                    />
                    <button
                      onClick={() => updateUsed(item.id, item.used + 1)}
                      className="w-8 h-8 rounded-full border border-[#C8C4BF] dark:border-[#3A3632] flex items-center justify-center text-[#111] dark:text-[#F0EDE8] outline-none bg-transparent cursor-pointer text-lg leading-none"
                    >+</button>
                  </div>
                </div>

                {/* Overage banner */}
                {over && (
                  <div className="mt-3 px-3 py-2 rounded-lg text-[11px] font-sans" style={{ backgroundColor: '#C4614A22', color: '#C4614A' }}>
                    You've exceeded your allocation by {item.used - item.allocated} {item.unit}. This will be flagged for adjustment.
                  </div>
                )}
              </div>
            )
          })}

          {inventory.length > 0 && (
            <div className="mt-6">
              {submitted ? (
                <div className="text-center py-3 rounded-lg text-[11px] font-sans" style={{ backgroundColor: '#7A9E7E22', color: '#7A9E7E' }}>
                  ✓ Inventory submitted{hasOverage ? ' — overages flagged for review' : ''}
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 text-[10px] tracking-widest uppercase font-sans rounded-lg font-semibold outline-none border-none cursor-pointer"
                  style={{ backgroundColor: '#111', color: '#F5F2EE' }}
                >
                  SUBMIT INVENTORY
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── RECEIPTS ──────────────────────────────────────────────────────── */}
      {section === 'RECEIPTS' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 relative">
          {receipts.length === 0 && (
            <p className="text-sm font-sans text-[#B0ACA7] italic">No receipts uploaded yet.</p>
          )}
          {receipts.map(rec => (
            <div key={rec.id} className="flex items-center gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28]">
              {rec.thumb ? (
                <img src={rec.thumb} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-white/60 dark:bg-white/5 border border-[#E0DDD8] dark:border-[#2E2B28] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[#888580]">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans text-[#111] dark:text-[#F0EDE8] truncate">{rec.merchant}</p>
                <p className="text-[10px] font-sans text-[#888580]">{rec.category} · {rec.date}</p>
              </div>
              <p className="font-serif text-base text-[#111] dark:text-[#F0EDE8] flex-shrink-0">{fmt(rec.amount)}</p>
            </div>
          ))}

          {/* Floating upload button */}
          <button
            onClick={() => setShowUpload(true)}
            className="fixed bottom-24 right-4 w-12 h-12 rounded-full flex items-center justify-center outline-none border-none cursor-pointer shadow-lg z-10"
            style={{ backgroundColor: '#111' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
              <line x1="9" y1="3" x2="9" y2="15"/><line x1="3" y1="9" x2="15" y2="9"/>
            </svg>
          </button>
        </div>
      )}

      {/* Look documentation sheet */}
      {lookModel && (
        <LookSheet model={lookModel} artistId={artistId} onClose={() => setLookModel(null)} />
      )}

      {/* Receipt upload sheet */}
      {showUpload && (
        <ReceiptUploadSheet onSave={handleSaveReceipt} onClose={() => setShowUpload(false)} />
      )}
    </div>
  )
}
