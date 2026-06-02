import { useState, useRef, useEffect } from 'react'
import { profiles } from '../data/mockData'
import BottomSheet from './BottomSheet'
import { useIsTablet } from '../hooks/useIsTablet'

export default function TopBar({ dark, onToggleDark, currentProfile, onSwitchProfile, notifications, onBell, onSwitchRole }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const unread    = notifications.filter(n => !n.read).length
  const isTablet  = useIsTablet()

  return (
    <div className={`flex items-center justify-between border-b border-[#E0DDD8] dark:border-[#2E2B28] bg-greige dark:bg-greige-dark flex-shrink-0 ${isTablet ? 'px-6 py-4' : 'px-4 py-3'}`}>
      {/* Show name + switch role */}
      <div className="flex flex-col gap-0.5">
        <span
          className="font-serif text-[#111] dark:text-[#F0EDE8] leading-none"
          style={{ fontSize: isTablet ? 28 : 18 }}
        >Valentino SS26</span>
        {onSwitchRole && (
          <button
            onClick={onSwitchRole}
            style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0, textAlign: 'left' }}
          >
            Switch role
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Profile switcher */}
        <button
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-1.5 outline-none"
        >
          <img src={currentProfile.avatar} alt={currentProfile.name} className="w-8 h-8 rounded-full object-cover" />
          <span className="text-[11px] font-sans text-[#111] dark:text-[#F0EDE8] leading-none">{currentProfile.name}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Bell */}
        <button onClick={onBell} className="relative outline-none text-[#111] dark:text-[#F0EDE8]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C4614A] rounded-full text-white text-[7px] flex items-center justify-center font-sans font-bold">
              {unread}
            </span>
          )}
        </button>

        {/* Dark mode toggle */}
        <button onClick={onToggleDark} className="outline-none text-[#111] dark:text-[#F0EDE8]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {dark
              ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
              : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            }
          </svg>
        </button>
      </div>

      {/* Profile switcher sheet */}
      <BottomSheet open={profileOpen} onClose={() => setProfileOpen(false)} height="auto">
        <div className="pb-2">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => { onSwitchProfile(p); setProfileOpen(false) }}
              className="flex items-center gap-3 w-full py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0"
            >
              <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex flex-col items-start">
                <span className="font-sans text-sm text-[#111] dark:text-[#F0EDE8]">{p.name}</span>
                <span className="text-[10px] tracking-widest uppercase font-sans text-[#888580]">{p.role}</span>
              </div>
              {currentProfile.id === p.id && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
