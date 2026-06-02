import { useState, useCallback } from 'react'
import { models as initModels, notifications as initNotifs, profiles } from './data/mockData'
import RoleSelect from './components/RoleSelect'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import NotificationDrawer from './components/NotificationDrawer'
import HomeView from './views/HomeView'
import ListView from './views/ListView'
import LineupView from './views/LineupView'
import DashboardView from './views/DashboardView'
import SettingsView from './views/SettingsView'

// Map role string → best matching profile
function profileForRole(role) {
  if (role === 'agent') return profiles.find(p => p.role === 'lead') || profiles[0]
  return profiles.find(p => p.role === role) || profiles[0]
}

export default function App() {
  const [selectedRole, setSelectedRole] = useState(null)   // null = show role select
  const [dark, setDark] = useState(false)
  const [tab, setTab] = useState('home')
  const [currentProfile, setCurrentProfile] = useState(profiles[0])
  const [models, setModels] = useState(initModels)
  const [notifications, setNotifications] = useState(initNotifs)
  const [toast, setToast] = useState(null)
  const [bellOpen, setBellOpen] = useState(false)
  const [venue, setVenue] = useState({ pin: null, area: null, floorPlanImage: null, zones: [], stationPins: [] })

  function handleRoleSelect(role) {
    setCurrentProfile(profileForRole(role))
    setSelectedRole(role)
    setTab('home')
  }

  function handleSwitchRole() {
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

  const showToast = useCallback((msg) => setToast(msg), [])

  // Show role select screen if no role chosen yet
  if (!selectedRole) {
    return <RoleSelect onSelect={handleRoleSelect} />
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
          onSwitchRole={handleSwitchRole}
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'home'      && <HomeView dark={dark} currentProfile={currentProfile} onToast={showToast} models={models} venue={venue} />}
          {tab === 'list'      && <ListView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'lineup'    && <LineupView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'dashboard' && <DashboardView models={models} team={profiles} notifications={notifications} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'settings'  && <SettingsView dark={dark} onToggleDark={toggleDark} venue={venue} onVenueChange={setVenue} />}
        </div>

        <BottomNav active={tab} onSelect={setTab} />
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />

      <NotificationDrawer
        open={bellOpen}
        onClose={() => setBellOpen(false)}
        notifications={notifications}
      />
    </div>
  )
}
