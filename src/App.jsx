import { useState, useCallback } from 'react'
import { models as initModels, notifications as initNotifs, profiles } from './data/mockData'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import NotificationDrawer from './components/NotificationDrawer'
import HomeView from './views/HomeView'
import ListView from './views/ListView'
import LineupView from './views/LineupView'
import DashboardView from './views/DashboardView'
import SettingsView from './views/SettingsView'

export default function App() {
  const [dark, setDark] = useState(false)
  const [tab, setTab] = useState('home')
  const [currentProfile, setCurrentProfile] = useState(profiles[0])
  const [models, setModels] = useState(initModels)
  const [notifications, setNotifications] = useState(initNotifs)
  const [toast, setToast] = useState(null)
  const [bellOpen, setBellOpen] = useState(false)

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
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'home'      && <HomeView dark={dark} currentProfile={currentProfile} onToast={showToast} models={models} />}
          {tab === 'list'      && <ListView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'lineup'    && <LineupView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'dashboard' && <DashboardView models={models} team={profiles} notifications={notifications} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />}
          {tab === 'settings'  && <SettingsView dark={dark} onToggleDark={toggleDark} />}
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
