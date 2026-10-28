import { useIsTablet } from '../hooks/useIsTablet'

// Outline icons (inactive / tablet active)
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

// Filled icons — used in the black pill on phone active state
const ICONS_FILLED = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect fill="currentColor" x="3" y="3" width="7" height="7" rx="1"/>
      <rect fill="currentColor" x="14" y="3" width="7" height="7" rx="1"/>
      <rect fill="currentColor" x="3" y="14" width="7" height="7" rx="1"/>
      <rect fill="currentColor" x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect fill="currentColor" x="3" y="5" width="18" height="2.5" rx="1"/>
      <rect fill="currentColor" x="3" y="10.75" width="18" height="2.5" rx="1"/>
      <rect fill="currentColor" x="3" y="16.5" width="18" height="2.5" rx="1"/>
    </svg>
  ),
  lineup: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect fill="currentColor" x="3" y="3" width="5" height="5" rx="1"/>
      <rect fill="currentColor" x="10" y="3" width="5" height="5" rx="1"/>
      <rect fill="currentColor" x="17" y="3" width="4" height="5" rx="1"/>
      <rect fill="currentColor" x="3" y="10" width="5" height="5" rx="1"/>
      <rect fill="currentColor" x="10" y="10" width="5" height="5" rx="1"/>
      <rect fill="currentColor" x="17" y="10" width="4" height="5" rx="1"/>
    </svg>
  ),
  studio: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 1.08H5v-.92l9.56-9.56.92.92-9.56 9.56zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54C14.44 5.17 14.24 5 14 5h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 11.47c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  ),
}

// Producer: ASSISTANTS tab, no STUDIO
const TABS_LEAD = [
  { id: 'home',      label: 'HOME'       },
  { id: 'dashboard', label: 'ASSISTANTS' },
  { id: 'list',      label: 'MGMT'       },
  { id: 'lineup',    label: 'LINEUP'     },
  { id: 'settings',  label: 'SETTINGS'   },
]

// Artist: HOME + STUDIO + SETTINGS only (3 tabs)
const TABS_ARTIST = [
  { id: 'home',     label: 'HOME'     },
  { id: 'studio',   label: 'STUDIO'   },
  { id: 'settings', label: 'SETTINGS' },
]

// Assistant: no ASSISTANTS tab
const TABS_ASSISTANT = [
  { id: 'home',      label: 'HOME'     },
  { id: 'list',      label: 'MGMT'     },
  { id: 'lineup',    label: 'LINEUP'   },
  { id: 'studio',    label: 'STUDIO'   },
  { id: 'settings',  label: 'SETTINGS' },
]

export default function BottomNav({ active, onSelect, role }) {
  const isTablet = useIsTablet()
  const TABS = role === 'lead' ? TABS_LEAD : role === 'artist' ? TABS_ARTIST : TABS_ASSISTANT

  return (
    <div className="flex items-stretch border-t border-[#E0DDD8] dark:border-[#2E2B28] bg-greige dark:bg-greige-dark flex-shrink-0">
      {TABS.map(tab => {
        const isActive = active === tab.id
        const usePill  = isActive && !isTablet
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            style={{ minHeight: isTablet ? 60 : undefined }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 outline-none ${
              isTablet ? 'py-3.5' : 'py-2.5'
            } ${
              isTablet
                ? isActive ? 'text-[#111] dark:text-[#F0EDE8]' : 'text-[#B0ACA7] dark:text-[#5A5652]'
                : isActive ? 'text-[#111]' : 'text-[#6E6A64]'
            }`}
          >
            {/* Icon: pill on phone active, plain otherwise */}
            {usePill ? (
              <div style={{
                width: 56, height: 30, borderRadius: 15,
                backgroundColor: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}>
                {ICONS_FILLED[tab.id] ?? ICONS[tab.id]}
              </div>
            ) : (
              <div style={{
                height: isTablet ? undefined : 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {ICONS[tab.id]}
              </div>
            )}
            {/* Label */}
            <span
              className={`font-sans tracking-widest uppercase mt-0.5 pb-0.5 ${
                isTablet ? 'text-[9px]' : 'text-[8px]'
              } ${
                !isTablet && isActive ? 'font-bold' : 'font-semibold'
              } ${
                isTablet && isActive ? 'border-b border-[#111] dark:border-[#F0EDE8]' : ''
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
