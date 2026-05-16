import { useState } from 'react'
import { STATUS_META } from '../data/mockData'
import ModelDetailSheet from '../components/ModelDetailSheet'

const STATUS_BORDER = {
  not_started: 'transparent',
  in_progress: '#D4A853',
  paused: '#8A9BB0',
  needs_revisit: '#C4614A',
  done: '#7A9E7E',
}

export default function LineupView({ models, currentProfile, onStatusChange, onNote }) {
  const [selectedModel, setSelectedModel] = useState(null)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex-shrink-0">
        <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">SHOW ORDER — {models.length} LOOKS</p>
      </div>

      {/* Color key */}
      <div className="px-4 py-2 border-b border-[#E0DDD8] dark:border-[#2E2B28] flex items-center gap-3 flex-shrink-0 overflow-x-auto">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: key === 'not_started' ? '#C8C4BF' : meta.color }}
            />
            <span className="text-[9px] tracking-widest uppercase font-sans text-[#888580] whitespace-nowrap">{meta.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-4 gap-2">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="flex flex-col items-center outline-none"
            >
              <div className="relative w-full">
                <span className="absolute top-1 left-1 z-10 text-[9px] font-sans font-semibold text-white leading-none drop-shadow-sm">
                  {model.lookNumber}
                </span>
                <img
                  src={model.avatar}
                  alt={model.name}
                  className="w-full aspect-square object-cover"
                  style={{
                    border: `4px solid ${STATUS_BORDER[model.status]}`,
                  }}
                />
              </div>
              <span className="mt-1 text-[9px] tracking-widest uppercase font-sans text-[#111] dark:text-[#F0EDE8] truncate w-full text-center">
                {model.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Model detail */}
      {selectedModel && (
        <ModelDetailSheet
          model={models.find(m => m.id === selectedModel.id)}
          onClose={() => setSelectedModel(null)}
          onStatusChange={onStatusChange}
          onNote={onNote}
          currentProfile={currentProfile}
        />
      )}
    </div>
  )
}
