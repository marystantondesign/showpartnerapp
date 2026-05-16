import { useState } from 'react'
import BottomSheet from './BottomSheet'
import ModelPicker from './ModelPicker'

const QUICK_PINGS = ['Call me', 'Where are you?', 'Come find me', 'Check this model ›', 'FaceTime me']

export default function ContactSheet({ person, onClose, onToast, models }) {
  const [showPicker, setShowPicker] = useState(false)

  if (!person) return null

  function handlePing(phrase) {
    if (phrase === 'Check this model ›') {
      setShowPicker(true)
      return
    }
    onToast(`Ping sent to ${person.name}`)
    onClose()
  }

  return (
    <>
      <div className="flex flex-col items-center pt-4 pb-2 gap-1">
        <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-full object-cover mb-2" />
        <span className="font-serif text-xl text-[#111] dark:text-[#F0EDE8]">{person.name}</span>
        <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">{person.role}</span>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-4 border-t border-[#E0DDD8] dark:border-[#2E2B28]">
        {QUICK_PINGS.map(p => (
          <button
            key={p}
            onClick={() => handlePing(p)}
            className="text-[11px] font-sans tracking-wide px-3 py-[6px] rounded-full border border-[#D0CCC7] dark:border-[#3A3632] text-[#111] dark:text-[#F0EDE8] bg-transparent"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-3 px-4 pb-6 border-t border-[#E0DDD8] dark:border-[#2E2B28] pt-4">
        <a
          href={`tel:${person.phone || ''}`}
          className="flex-1 flex items-center justify-center gap-2 border border-[#D0CCC7] dark:border-[#3A3632] rounded py-3 text-[11px] font-sans tracking-widest uppercase text-[#111] dark:text-[#F0EDE8]"
        >
          CALL
        </a>
        <a
          href={`sms:${person.phone || ''}`}
          className="flex-1 flex items-center justify-center gap-2 border border-[#D0CCC7] dark:border-[#3A3632] rounded py-3 text-[11px] font-sans tracking-widest uppercase text-[#111] dark:text-[#F0EDE8]"
        >
          TEXT
        </a>
      </div>

      {showPicker && (
        <ModelPicker
          models={models}
          onSend={(selected) => {
            setShowPicker(false)
            onToast(`Ping sent to ${person.name} about ${selected.length} model${selected.length !== 1 ? 's' : ''}`)
            onClose()
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
