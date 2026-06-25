import { useState, useCallback } from 'react'
import { models as initModels, notifications as initNotifs, profiles, schedule as initSchedule } from './data/mockData'
import RoleSelect from './components/RoleSelect'
import ShowHistory from './components/ShowHistory'
import AgentDesktopView from './views/AgentDesktopView'
import { useIsDesktop } from './hooks/useIsDesktop'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import NotificationDrawer from './components/NotificationDrawer'
import HomeView from './views/HomeView'
import ListView from './views/ListView'
import LineupView from './views/LineupView'
import DashboardView from './views/DashboardView'
import SettingsView from './views/SettingsView'
import StudioView from './views/StudioView'

// Default venue — Agger Fish Building, Brooklyn, NY
// Zones have both a centroid (xPct/yPct) and a polygon array for proper SVG rendering
const DEFAULT_VENUE = {
  pin: { lat: 40.6782, lng: -73.9442, address: 'Agger Fish Building, 640 Columbia St, Brooklyn, NY' },
  area: { name: 'Agger Fish Building', geometry: null },
  floorPlanImage: null,
  zones: [
    {
      id: 'dz-runway', type: 'runway', label: 'Runway', color: '#C8C4BF',
      xPct: 50, yPct: 53,
      polygon: [{xPct:30,yPct:36},{xPct:70,yPct:36},{xPct:70,yPct:70},{xPct:30,yPct:70}],
    },
    {
      id: 'dz-backstage', type: 'backstage', label: 'Backstage', color: '#888580',
      xPct: 50, yPct: 76,
      polygon: [{xPct:7,yPct:70},{xPct:93,yPct:70},{xPct:93,yPct:82},{xPct:7,yPct:82}],
    },
    {
      id: 'dz-hair', type: 'hair', label: 'Hair', color: '#D4A853',
      xPct: 17, yPct: 48,
      polygon: [{xPct:7,yPct:26},{xPct:28,yPct:26},{xPct:28,yPct:70},{xPct:7,yPct:70}],
    },
    {
      id: 'dz-makeup', type: 'makeup', label: 'Makeup', color: '#C4614A',
      xPct: 83, yPct: 48,
      polygon: [{xPct:72,yPct:26},{xPct:93,yPct:26},{xPct:93,yPct:70},{xPct:72,yPct:70}],
    },
    {
      id: 'dz-holding', type: 'holding', label: 'Holding', color: '#7A9E7E',
      xPct: 50, yPct: 30,
      polygon: [{xPct:30,yPct:26},{xPct:70,yPct:26},{xPct:70,yPct:36},{xPct:30,yPct:36}],
    },
  ],
  stationPins: [
    { id: 'ds-hair1', type: 'station_hair',   label: 'Hair Station',   color: '#D4A853', xPct: 13, yPct: 38 },
    { id: 'ds-hair2', type: 'station_hair',   label: 'Hair Station',   color: '#D4A853', xPct: 13, yPct: 58 },
    { id: 'ds-mk1',   type: 'station_makeup', label: 'Makeup Station', color: '#C4614A', xPct: 87, yPct: 38 },
    { id: 'ds-mk2',   type: 'station_makeup', label: 'Makeup Station', color: '#C4614A', xPct: 87, yPct: 58 },
    { id: 'ds-ent',   type: 'entrance',       label: 'Entrance',       color: '#7A9E7E', xPct: 40, yPct: 29 },
    { id: 'ds-exit',  type: 'exit',           label: 'Exit',           color: '#C4614A', xPct: 60, yPct: 29 },
  ],
}

function profileForRole(role) {
  if (role === 'agent') return profiles.find(p => p.role === 'lead') || profiles[0]
  return profiles.find(p => p.role === role) || profiles[0]
}

export default function App() {
  const isDesktop = useIsDesktop()
  const [selectedRole, setSelectedRole]     = useState(null)
  const [dark, setDark]                     = useState(false)
  const [tab, setTab]                       = useState('home')
  const [currentProfile, setCurrentProfile] = useState(profiles[0])
  const [models, setModels]                 = useState(initModels)
  const [notifications, setNotifications]   = useState(initNotifs)
  const [toast, setToast]                   = useState(null)
  const [bellOpen, setBellOpen]             = useState(false)
  const [venue, setVenue]                   = useState(DEFAULT_VENUE)
  const [schedule, setSchedule]             = useState(initSchedule)
  const [showHistoryOpen, setShowHistoryOpen] = useState(false)

  function handleRoleSelect(role) {
    setCurrentProfile(profileForRole(role))
    setSelectedRole(role)
    setTab('home')
  }

  function handleLogOut() {
    setSelectedRole(null)
  }

  function toggleDark() {
    setDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  function handleStatusChange(modelId, newStatus) {
    setModels(prev => prev.map(m => {
      if (m.id !== modelId) return m
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const newEntry = { status: newStatus, timestamp: timeStr, updatedBy: currentProfile.name }
      return { ...m, status: newStatus, statusLog: [...m.statusLog, newEntry] }
    }))
  }

  // notes is now an array; ModelDetailSheet passes the full updated array
  function handleNote(modelId, newNotesArray) {
    setModels(prev => prev.map(m => m.id === modelId ? { ...m, notes: newNotesArray } : m))
  }

  function handleAssignArtists(modelId, { hair, makeup }) {
    setModels(prev => prev.map(m => {
      if (m.id !== modelId) return m
      const artists = [hair, makeup].filter(Boolean)
      return { ...m, assignedArtists: artists, hairArtist: hair, makeupArtist: makeup }
    }))
  }

  const showToast = useCallback((msg) => setToast(msg), [])

  if (!selectedRole) {
    return <RoleSelect onSelect={handleRoleSelect} />
  }

  // Agent on desktop → full separate layout
  if (selectedRole === 'agent' && isDesktop) {
    return <AgentDesktopView dark={dark} onToggleDark={toggleDark} onLogOut={handleLogOut} />
  }

  return (
    <div className={`flex flex-col h-[100dvh] ${dark ? 'dark' : ''}`}>
      <div className="flex flex-col h-full bg-greige dark:bg-greige-dark text-[#111] dark:text-[#F0EDE8]">
        <TopBar
          dark={dark}
          onToggleDark={toggleDark}
          currentProfile={currentProfile}
          onSwitchProfile={setCurrentProfile}
          notifications={notifications}
          onBell={() => setBellOpen(true)}
          onShowHistory={() => setShowHistoryOpen(true)}
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'home'      && <HomeView dark={dark} currentProfile={currentProfile} onToast={showToast} models={models} venue={venue} schedule={schedule} />}
          {tab === 'list'      && <ListView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'lineup'    && <LineupView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'dashboard' && (
            <DashboardView
              models={models}
              team={profiles}
              notifications={notifications}
              currentProfile={currentProfile}
              onStatusChange={handleStatusChange}
              onNote={handleNote}
              onAssignArtists={handleAssignArtists}
              dark={dark}
            />
          )}
          {tab === 'studio'    && <StudioView currentProfile={currentProfile} models={models} />}
          {tab === 'settings'  && <SettingsView dark={dark} onToggleDark={toggleDark} venue={venue} onVenueChange={setVenue} onLogOut={handleLogOut} currentProfile={currentProfile} schedule={schedule} onScheduleChange={setSchedule} />}
        </div>

        <BottomNav active={tab} onSelect={setTab} role={currentProfile.role} />
      </div>

      {/* Show history full-screen overlay */}
      {showHistoryOpen && (
        <ShowHistory
          onClose={() => setShowHistoryOpen(false)}
          currentProfile={currentProfile}
          dark={dark}
        />
      )}

      <Toast message={toast} onDone={() => setToast(null)} />

      <NotificationDrawer
        open={bellOpen}
        onClose={() => setBellOpen(false)}
        notifications={notifications}
      />
    </div>
  )
}
