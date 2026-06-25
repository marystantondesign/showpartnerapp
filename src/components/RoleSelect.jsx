import { useState, useEffect } from 'react'

function useDeviceType() {
  function classify(w) {
    if (w >= 1024) return 'desktop'
    if (w >= 768)  return 'tablet'
    return 'mobile'
  }
  const [device, setDevice] = useState(() => classify(window.innerWidth))
  useEffect(() => {
    const handler = () => setDevice(classify(window.innerWidth))
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return device
}

function useSystemDark() {
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
  const [dark, setDark] = useState(() => mq?.matches ?? false)
  useEffect(() => {
    if (!mq) return
    const handler = (e) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return dark
}

function Card({ name, descriptor, disabled, agentBorder, onClick, dark }) {
  const [hovered, setHovered] = useState(false)

  const cardBg    = dark ? '#242220' : '#FFFFFF'
  const textColor = dark ? '#F0EDE8' : '#1A1A1A'
  const mutedColor = dark ? '#666260' : '#AAAAAA'

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        borderRadius: 10,
        border: agentBorder ? '1.5px solid #8A9E89' : '1.5px solid transparent',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        opacity: disabled ? 0.32 : 1,
        boxShadow: hovered && !disabled
          ? '0 6px 20px rgba(0,0,0,0.10)'
          : dark
          ? '0 1px 4px rgba(0,0,0,0.3)'
          : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'box-shadow 150ms ease, opacity 150ms ease',
        outline: 'none',
        width: '100%',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 28,
        fontWeight: 400,
        color: textColor,
        lineHeight: 1,
        marginBottom: descriptor ? 10 : 0,
      }}>
        {name}
      </span>
      {descriptor && (
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 8,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: disabled ? mutedColor : mutedColor,
          lineHeight: 1,
          textAlign: 'center',
        }}>
          {descriptor}
        </span>
      )}
    </button>
  )
}

export default function RoleSelect({ onSelect }) {
  const device    = useDeviceType()
  const dark      = useSystemDark()

  const bg          = dark ? '#1A1816' : '#F5F2EE'
  const textColor   = dark ? '#F0EDE8' : '#1A1A1A'
  const mutedColor  = dark ? '#666260' : '#999999'
  const dividerColor = dark ? '#2E2B28' : '#DDDDDD'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
    }}>
      {/* Logo */}
      <h1 style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: device === 'mobile' ? 28 : 36,
        fontWeight: 400,
        color: textColor,
        margin: 0,
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}>
        Show Partner
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: mutedColor,
        margin: '10px 0 20px',
      }}>
        Select your role
      </p>

      {/* Divider */}
      <div style={{ width: 40, height: 1, backgroundColor: dividerColor, marginBottom: 32 }} />

      {/* Cards — layout switches by device */}
      {device === 'mobile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {[
            { role: 'lead',      name: 'Producer'  },
            { role: 'artist',    name: 'Artist'    },
            { role: 'assistant', name: 'Assistant' },
          ].map(({ role, name }) => (
            <Card
              key={role}
              name={name}
              dark={dark}
              onClick={() => onSelect(role)}
            />
          ))}
        </div>
      )}

      {device === 'tablet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 540 }}>
          <Card name="Producer"  descriptor="Show producer"       dark={dark} onClick={() => onSelect('lead')} />
          <Card name="Artist"    descriptor="Hair · Makeup · Nails" dark={dark} onClick={() => onSelect('artist')} />
          <Card name="Assistant" descriptor="On-site support"    dark={dark} onClick={() => onSelect('assistant')} />
          {/* Ghost cell — invisible spacer matching card size */}
          <div style={{ borderRadius: 10, background: 'transparent' }} />
        </div>
      )}

      {device === 'desktop' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 560 }}>
          <Card
            name="Agent"
            descriptor="Off-site coordination"
            agentBorder
            dark={dark}
            onClick={() => onSelect('agent')}
          />
          <Card
            name="Producer"
            descriptor="Coming soon"
            disabled
            dark={dark}
          />
        </div>
      )}
    </div>
  )
}
