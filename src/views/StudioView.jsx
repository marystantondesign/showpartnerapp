Here's the complete new `src/views/StudioView.jsx` — replace the entire file with this:

```jsx
import { useState, useRef } from 'react'

// ─── Show looks ────────────────────────────────────────────────────────────────
const SHOW_LOOKS = [
  {
    id: 'look-01',
    number: '01',
    title: 'Dewy Skin, Graphic Liner',
    steps: [
      'Apply hydrating primer to clean skin.',
      'Press sheer luminous foundation with fingers for a second-skin finish.',
      'Draw a precise graphic liner wing in deep black.',
      'Brush clear brow gel through arches.',
      'Apply a single coat of black mascara on upper lashes only.',
    ],
    models: ['Luna Torres', 'Priya Osei'],
  },
  {
    id: 'look-02',
    number: '02',
    title: 'Matte Base, Smoked Eye',
    steps: [
      'Apply mattifying primer across T-zone.',
      'Build medium-coverage foundation with a damp sponge.',
      'Press a deep espresso shadow into the crease and lower lash line.',
      'Smudge a black kohl pencil along the waterline.',
      'Finish with two coats of volumizing mascara.',
    ],
    models: ['David Kim', 'Zoe Park'],
  },
  {
    id: 'look-03',
    number: '03',
    title: 'Bare Skin, Bold Lip',
    steps: [
      'Use a tinted moisturizer for minimal coverage.',
      'Conceal only where needed under eyes and around nose.',
      'Set lightly with a translucent powder.',
      'Line lips slightly overdrawn with a deep berry liner.',
      'Fill with a satin berry-red lipstick.',
    ],
    models: ['Marcus Lee', 'Luna Torres', 'Priya Osei'],
  },
]

// ─── Seeded data ───────────────────────────────────────────────────────────────
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function fmt(n) { return `$${Number(n).toLocaleString()}` }

// ─── Look card ────────────────────────────────────────────────────────────────
function LookCard({ look }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-2xl border border-[#E0DDD8] dark:border-[#2E2B28] bg-white/60 dark:bg-white/5 px-5 py-5 mb-4">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-1">LOOK {look.number}</p>
      <p className="font-serif text-[18px] text-[#111] dark:text-[#F0EDE8] leading-snug mb-3">{look.title}</p>
      <ol className="list-none p-0 m-0 space-y-1">
        {look.steps.map((step, i) => (
          <li key={i} className="text-[13px] font-sans text-[#444] dark:text-[#C8C4BF] leading-relaxed">
            <span className="text-[#888580] mr-1.5">{i + 1}.</span>{step}
          </li>
        ))}
      </ol>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-4 text-[11px] tracking-widest uppercase font-sans text-[#888580] bg-transparent border-none outline-none cursor-pointer p-0"
      >
        MODELS ASSIGNED
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={`inline-block ml-1.5 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <polyline points="2 3 5 7 8 3"/>
        </svg>
      </button>
      {expanded && (
        <ul className="mt-2 list-none p-0 m-0 space-y-1">
          {look.models.map(name => (
            <li key={name} className="text-[13px] font-sans text-[#111] dark:text-[#F0EDE8] pl-3 before:content-['·'] before:mr-2 before:text-[#888580]">{name}</li>
          ))}
        </ul>
      )}
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

        <input
          value={merchant}
          onChange={e => setMerchant(e.target.value)}
          placeholder="Merchant name"
          className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-2 mb-4"
        />
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent text-sm font-sans text-[#111] dark:text-[#F0EDE8] placeholder-[#B0ACA7] border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none pb-2 mb-4"
        />

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
  const [showUpload, setShowUpload] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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

      {section === 'LOOKS' && (
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {SHOW_LOOKS.map(look => (
            <LookCard key={look.id} look={look} />
          ))}
        </div>
      )}

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
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-sans text-[#888580]">Used:</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateUsed(item.id, item.used - 1)} className="w-8 h-8 rounded-full border border-[#C8C4BF] dark:border-[#3A3632] flex items-center justify-center text-[#111] dark:text-[#F0EDE8] outline-none bg-transparent cursor-pointer text-lg leading-none">−</button>
                    <input type="number" value={item.used} onChange={e => updateUsed(item.id, parseInt(e.target.value) || 0)} className="w-14 text-center text-sm font-sans font-medium text-[#111] dark:text-[#F0EDE8] bg-transparent border-b border-[#E0DDD8] dark:border-[#2E2B28] outline-none tabular-nums py-1" />
                    <button onClick={() => updateUsed(item.id, item.used + 1)} className="w-8 h-8 rounded-full border border-[#C8C4BF] dark:border-[#3A3632] flex items-center justify-center text-[#111] dark:text-[#F0EDE8] outline-none bg-transparent cursor-pointer text-lg leading-none">+</button>
                  </div>
                </div>
                {over && (
                  <div className="mt-3 px-3 py-2 rounded-lg text-[11px] font-sans" style={{ backgroundColor: '#C4614A22', color: '#C4614A' }}>
                    You
