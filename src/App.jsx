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
  const [venue, setVenue]                   = useState({ pin: null, area: null, floorPlanImage: null, zones: [], stationPins: [] })
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

  function handleNote(modelId, note) {
    setModels(prev => prev.map(m => m.id === modelId ? { ...m, notes: note } : m))
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
          {tab === 'settings'  && <SettingsView dark={dark} onToggleDark={toggleDark} venue={venue} onVenueChange={setVenue} onLogOut={handleLogOut} currentProfile={currentProfile} schedule={schedule} onScheduleChange={setSchedule} />}
        </div>

        <BottomNav active={tab} onSelect={setTab} />
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
