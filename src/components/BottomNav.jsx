import { useIsTablet } from '../hooks/useIsTablet'

// Icons shared across tab sets
const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  lineup: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="5" height="5"/><rect x="10" y="3" width="5" height="5"/><rect x="17" y="3" width="4" height="5"/>
      <rect x="3" y="10" width="5" height="5"/><rect x="10" y="10" width="5" height="5"/><rect x="17" y="10" width="4" height="5"/>
    </svg>
  ),
  studio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
}

// Default tabs (Lead + Assistant)
const TABS_DEFAULT = [
  { id: 'home',      label: 'HOME'     },
  { id: 'dashboard', label: 'ARTISTS'  },
  { id: 'list',      label: 'MGMT'     },
  { id: 'lineup',    label: 'LINEUP'   },
  { id: 'settings',  label: 'SETTINGS' },
]

// Artist-role tabs: replaces ARTISTS with STUDIO
const TABS_ARTIST = [
  { id: 'home',     label: 'HOME'     },
  { id: 'list',     label: 'MGMT'     },
  { id: 'lineup',   label: 'LINEUP'   },
  { id: 'studio',   label: 'STUDIO'   },
  { id: 'settings', label: 'SETTINGS' },
]

export default function BottomNav({ active, onSelect, isArtist }) {
  const isTablet = useIsTablet()
  const TABS = isArtist ? TABS_ARTIST : TABS_DEFAULT

  return (
    <div className="flex items-stretch border-t border-[#E0DDD8] dark:border-[#2E2B28] bg-greige dark:bg-greige-dark flex-shrink-0">
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{ minHeight: isTablet ? 60 : undefined }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 outline-none ${
              isTablet ? 'py-3.5' : 'py-2.5'
            } ${
              isActive
                ? 'text-[#111] dark:text-[#F0EDE8]'
                : 'text-[#B0ACA7] dark:text-[#5A5652]'
            }`}
          >
            {ICONS[tab.id]}
            <span
              className={`font-sans font-semibold tracking-widest uppercase mt-0.5 pb-0.5 ${
                isTablet ? 'text-[9px]' : 'text-[8px]'
              } ${
                isActive ? 'border-b border-[#111] dark:border-[#F0EDE8]' : ''
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
