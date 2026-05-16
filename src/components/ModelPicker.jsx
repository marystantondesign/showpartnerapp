import { useState } from 'react'
import BottomSheet from './BottomSheet'

export default function ModelPicker({ models, onSend, onClose }) {
  const [selected, setSelected] = useState([])

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <BottomSheet open onClose={onClose} height="70%">
      <div className="pb-2">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-4">Select models</p>
        {models.map(m => (
          <label key={m.id} className="flex items-center gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] cursor-pointer">
            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="flex-1 font-serif text-sm text-[#111] dark:text-[#F0EDE8]">{m.name}</span>
            <input
              type="checkbox"
              checked={selected.includes(m.id)}
              onChange={() => toggle(m.id)}
              className="accent-[#111] w-4 h-4"
            />
          </label>
        ))}
        <button
          disabled={selected.length === 0}
          onClick={() => onSend(selected)}
          className="mt-4 w-full py-3 text-[11px] tracking-widest uppercase font-sans bg-[#111] dark:bg-[#F0EDE8] text-white dark:text-[#111] rounded disabled:opacity-30"
        >
          SEND PING
        </button>
      </div>
    </BottomSheet>
  )
}
