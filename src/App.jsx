import { useState, useCallback, Component } from 'react'
import { models as initModels, notifications as initNotifs, profileNotifications, profiles, schedule as initSchedule, announcements as initAnnouncements, timeline } from './data/mockData'
import RoleSelect from './components/RoleSelect'
import ShowHistory from './components/ShowHistory'
import AgentDesktopView from './views/AgentDesktopView'
import ProducerIPadView from './views/ProducerIPadView'
import { useIsDesktop } from './hooks/useIsDesktop'
import { useIsTablet } from './hooks/useIsTablet'
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
import AssistantHomeView from './views/AssistantHomeView'
import AssistantTodayView from './views/AssistantTodayView'
import ArtistHomeView from './views/ArtistHomeView'
import StatusLinkView from './views/StatusLinkView'

// Default venue — Agger Fish Building, Brooklyn, NY
// Zones have both a centroid (xPct/yPct) and a polygon array for proper SVG rendering
const DEFAULT_VENUE = {
  pin: { lat: 40.6782, lng: -73.9442, address: 'Agger Fish Building, 640 Columbia St, Brooklyn, NY' },
  area: { name: 'Agger Fish Building', geometry: null },
  floorPlanImage: null,
  backstageLocation: '',
  teamEntrance: '',
  wifi: '',
  contact: '',
  teamNotes: '',
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

function fmtNow() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

class TabBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(err) { return { error: err } }
  componentDidCatch(err, info) { console.error('[TabBoundary]', err, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#111' }}>Something went wrong on this screen</p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ height: 48, padding: '0 24px', borderRadius: 8, border: 0, background: '#111', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer' }}
          >
            RELOAD
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  const isDesktop = useIsDesktop()
  const isTablet  = useIsTablet()
  const [selectedRole, setSelectedRole]     = useState(null)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('sp_dark') === 'true'
    document.documentElement.classList.toggle('dark', saved)
    document.documentElement.setAttribute('data-theme', saved ? 'dark' : 'light')
    return saved
  })
  const [tab, setTab]                       = useState('home')
  const [currentProfile, setCurrentProfile] = useState(profiles[0])
  const [models, setModels]                 = useState(initModels)
  const [notifications, setNotifications]   = useState(initNotifs)
  const [toast, setToast]                   = useState(null)
  const [bellOpen, setBellOpen]             = useState(false)
  const [venue, setVenue]                   = useState(DEFAULT_VENUE)
  const [schedule, setSchedule]             = useState(initSchedule)
  const [showHistoryOpen, setShowHistoryOpen] = useState(false)
  const [walkthroughPhase, setWalkthroughPhase] = useState('upcoming')
  const [announcements, setAnnouncements]   = useState(() => initAnnouncements.map(a => ({ ...a, ackedBy: [] })))
  const [leadChecks, setLeadChecks]         = useState([])
  const [secondOpinionRequests, setSecondOpinionRequests] = useState([
    {
      id: 'sor-seed-1',
      modelId: 'm17',
      modelName: 'Sana Park',
      modelLook: 'A',
      modelArea: 'Eyes',
      modelAvatar: null,
      assistantId: 'p17',
      assistantName: 'Sofia Reyes',
      assistantFirstName: 'Sofia',
      leadId: 'p5',
      leadName: 'Iona',
      leadFirstName: 'Iona',
      leadNote: 'Third coat on lower lashes. Not sure if this reads from runway.',
      createdAt: '2:45 PM',
      status: 'pending',
    },
  ])
  const [toCheckQueue, setToCheckQueue]     = useState([])
  const [touchupNotes, setTouchupNotes]     = useState([])
  const [runningLates, setRunningLates]     = useState({})
  const [recentArrivals, setRecentArrivals] = useState([])

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
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      localStorage.setItem('sp_dark', String(next))
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

  function handleAckAnnouncement(annId) {
    setAnnouncements(prev => prev.map(a =>
      a.id === annId ? { ...a, ackedBy: [...(a.ackedBy || []), currentProfile.id] } : a
    ))
  }

  function handleLeadCheck(modelId, elapsed, look, modelName, specialty) {
    const model = models.find(m => m.id === modelId)
    setLeadChecks(prev => [...prev, {
      id: `check-${Date.now()}`,
      modelId,
      modelName,
      modelLook: look,
      modelAvatar: model?.avatar || null,
      assistantId: currentProfile.id,
      assistantName: currentProfile.name,
      assistantFirstName: currentProfile.name.split(' ')[0],
      specialty,
      elapsedMins: elapsed,
      createdAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      claimedBy: null,
      claimedAt: null,
    }])
  }

  function handleClaimCheck(checkId) {
    setLeadChecks(prev => prev.map(c =>
      c.id === checkId
        ? { ...c, claimedBy: currentProfile.id, claimedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }
        : c
    ))
  }

  function handleEscalateCheck(checkId) {
    const check = leadChecks.find(c => c.id === checkId)
    if (check) {
      const model = models.find(m => m.id === check.modelId)
      setSecondOpinionRequests(prev => [...prev, {
        id: `sor-${Date.now()}`,
        modelId: check.modelId,
        modelName: check.modelName,
        modelLook: check.modelLook,
        modelArea: check.specialty || 'Makeup',
        modelAvatar: model?.avatar || null,
        assistantId: check.assistantId,
        assistantName: check.assistantName,
        assistantFirstName: check.assistantFirstName || check.assistantName?.split(' ')[0],
        leadId: currentProfile.id,
        leadName: currentProfile.name,
        leadFirstName: currentProfile.name.split(' ')[0],
        leadNote: check.note || '',
        createdAt: fmtNow(),
        status: 'pending',
      }])
    }
    setLeadChecks(prev => prev.filter(c => c.id !== checkId))
  }

  function handleAcceptSecondOpinion(reqId) {
    setSecondOpinionRequests(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'on_my_way' } : r
    ))
  }

  function handleDismissSecondOpinion(reqId) {
    setSecondOpinionRequests(prev => prev.filter(r => r.id !== reqId))
  }

  function handleLooksGoodArtist(reqId) {
    setSecondOpinionRequests(prev => prev.filter(r => r.id !== reqId))
  }

  function handleMarkDoneToCheck(modelId, elapsed, specialty) {
    const model = models.find(m => m.id === modelId)
    if (!model) return
    setToCheckQueue(prev => [...prev, {
      id: `tc-${Date.now()}`,
      modelId,
      modelName: model.name,
      modelLook: model.look,
      modelAvatar: model.avatar || null,
      specialty,
      assistantId: currentProfile.id,
      assistantName: currentProfile.name,
      doneAt: fmtNow(),
    }])
  }

  function handleLooksGood(checkId) {
    const check = toCheckQueue.find(c => c.id === checkId)
    if (!check) return
    setModels(prev => prev.map(m =>
      m.id === check.modelId
        ? { ...m, services: { ...m.services, [check.specialty]: { ...m.services[check.specialty], status: 'done' } } }
        : m
    ))
    setToCheckQueue(prev => prev.filter(c => c.id !== checkId))
  }

  function handleSendTouchup(checkId, areas, note) {
    const check = toCheckQueue.find(c => c.id === checkId)
    if (!check) return
    const now = fmtNow()
    setTouchupNotes(prev => [...prev, {
      id: `tp-${Date.now()}`,
      checkId,
      modelId: check.modelId,
      assistantId: check.assistantId,
      areas,
      note,
      sentAt: now,
    }])
    setModels(prev => prev.map(m =>
      m.id === check.modelId
        ? { ...m, services: { ...m.services, [check.specialty]: { ...m.services[check.specialty], status: 'in_progress' } } }
        : m
    ))
    setToCheckQueue(prev => prev.filter(c => c.id !== checkId))
  }

  function handleArrived(modelId) {
    const model = models.find(m => m.id === modelId)
    if (!model) return
    const now = fmtNow()
    setModels(prev => prev.map(m =>
      m.id === modelId ? { ...m, arrived: true, arrivedAt: now } : m
    ))
    setRecentArrivals(prev => [...prev, { id: `arr-${Date.now()}`, modelId, modelName: model.name, arrivedAt: now }])
  }

  function handleRunningLate(modelId, newEta) {
    setModels(prev => prev.map(m =>
      m.id === modelId ? { ...m, eta: newEta } : m
    ))
    setRunningLates(prev => ({ ...prev, [modelId]: { eta: newEta } }))
  }

  const showToast = useCallback((msg) => setToast(msg), [])

  if (!selectedRole) {
    return <RoleSelect onSelect={handleRoleSelect} />
  }

  // Agent on desktop → full separate layout
  if (selectedRole === 'agent' && isDesktop) {
    return <AgentDesktopView dark={dark} onToggleDark={toggleDark} onLogOut={handleLogOut} />
  }

  // Producer on tablet/desktop → full-screen iPad layout
  if (selectedRole === 'lead' && isTablet) {
    return (
      <ProducerIPadView
        models={models} setModels={setModels}
        walkthroughPhase={walkthroughPhase} setWalkthroughPhase={setWalkthroughPhase}
        announcements={announcements} setAnnouncements={setAnnouncements}
        toCheckQueue={toCheckQueue}
        touchupNotes={touchupNotes}
        runningLates={runningLates}
        recentArrivals={recentArrivals}
        onLooksGood={handleLooksGood}
        onSendTouchup={handleSendTouchup}
        onArrived={handleArrived}
        onRunningLate={handleRunningLate}
        onLogOut={handleLogOut}
        dark={dark}
        onToggleDark={toggleDark}
        schedule={schedule}
        onScheduleChange={setSchedule}
        venue={venue}
        onVenueChange={setVenue}
      />
    )
  }

  return (
    <div className={`flex flex-col h-[100dvh] ${dark ? 'dark' : ''}`}>
      <div className="flex flex-col h-full bg-greige dark:bg-greige-dark text-[#111] dark:text-[#F0EDE8]">
        <TopBar
          dark={dark}
          onToggleDark={toggleDark}
          currentProfile={currentProfile}
          onSwitchProfile={setCurrentProfile}
          notifications={profileNotifications[currentProfile.id] ?? notifications}
          onBell={() => setBellOpen(true)}
          onShowHistory={() => setShowHistoryOpen(true)}
        />

        <TabBoundary>
        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'home' && (currentProfile.role === 'assistant' || currentProfile.role === 'lead_assistant') && (
            <AssistantTodayView
              currentProfile={currentProfile}
              profiles={profiles}
              schedule={schedule}
              venue={venue}
            />
          )}
          {tab === 'home' && currentProfile.role === 'artist' && (
            <ArtistHomeView
              currentProfile={currentProfile}
              models={models}
              secondOpinionRequests={secondOpinionRequests}
              onAcceptRequest={handleAcceptSecondOpinion}
              onDismissRequest={handleDismissSecondOpinion}
              onLooksGood={handleLooksGoodArtist}
              onSuggestChange={handleDismissSecondOpinion}
              onToast={showToast}
            />
          )}
          {tab === 'home' && currentProfile.role !== 'assistant' && currentProfile.role !== 'lead_assistant' && currentProfile.role !== 'artist' && (
            <HomeView dark={dark} currentProfile={currentProfile} onToast={showToast} models={models} venue={venue} schedule={schedule} />
          )}
          {tab === 'list' && (currentProfile.role === 'assistant' || currentProfile.role === 'lead_assistant') && (
            <AssistantHomeView
              currentProfile={currentProfile}
              models={models} setModels={setModels}
              walkthroughPhase={walkthroughPhase}
              announcements={announcements}
              onAckAnnouncement={handleAckAnnouncement}
              leadChecks={leadChecks}
              onLeadCheck={handleLeadCheck}
              onClaimCheck={handleClaimCheck}
              onEscalateCheck={handleEscalateCheck}
              onToast={showToast}
              profiles={profiles}
              timeline={timeline}
              toCheckQueue={toCheckQueue}
              touchupNotes={touchupNotes}
              onMarkDoneToCheck={handleMarkDoneToCheck}
              onLooksGood={handleLooksGood}
              onSendTouchup={handleSendTouchup}
            />
          )}
          {tab === 'list' && currentProfile.role !== 'assistant' && currentProfile.role !== 'lead_assistant' && (
            <ListView models={models} currentProfile={currentProfile} onStatusChange={handleStatusChange} onNote={handleNote} />
          )}
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
        </TabBoundary>

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
        notifications={profileNotifications[currentProfile.id] ?? notifications}
      />
    </div>
  )
}

export default function App() {
  if (/^\/status\//.test(window.location.pathname)) return <StatusLinkView />
  return <AppInner />
}
