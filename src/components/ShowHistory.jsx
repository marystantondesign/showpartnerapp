import { useState } from 'react'
import { showHistory } from '../data/mockData'

function Stars({ n }) {
  return (
    <span style={{ fontFamily: 'Inter, system-ui', fontSize: 11, letterSpacing: 2, color: '#D4A853' }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

function ShowDetail({ show, isLead, onBack, dark }) {
  const [notes, setNotes] = useState(show.notes || '')
  const bg      = dark ? '#1A1816' : '#F5F2EE'
  const card    = dark ? '#242220' : '#FFFFFF'
  const text    = dark ? '#F0EDE8' : '#111111'
  const muted   = dark ? '#888580' : '#888580'
  const border  = dark ? '#2E2B28' : '#E0DDD8'

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: bg, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 4, display: 'flex', alignItems: 'center', color: muted }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 17, color: text, lineHeight: 1.1 }}>{show.name}</p>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginTop: 2 }}>{show.city} · {show.date}</p>
        </div>
        <span style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A9E7E', backgroundColor: '#7A9E7E22', border: '1px solid #7A9E7E66', borderRadius: 20, padding: '4px 8px' }}>
          COMPLETED
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>

        {/* Venue */}
        <div style={{ paddingTop: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 4 }}>VENUE</p>
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 15, color: text }}>{show.venue}</p>
        </div>

        {/* Artists */}
        <div style={{ paddingTop: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 12 }}>ARTIST ROSTER</p>
          {show.artists.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, marginBottom: i < show.artists.length - 1 ? 12 : 0, borderBottom: i < show.artists.length - 1 ? `1px solid ${border}` : 'none' }}>
              <div>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text }}>{a.name}</p>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted, marginTop: 2 }}>{a.specialty}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <Stars n={a.stars} />
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A9E7E' }}>INVITE BACK</p>
              </div>
            </div>
          ))}
        </div>

        {/* Incidents */}
        <div style={{ paddingTop: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 10 }}>INCIDENTS</p>
          {show.incidents.length === 0 ? (
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, color: '#7A9E7E' }}>None logged</p>
          ) : show.incidents.map((inc, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', backgroundColor: '#C4614A18', borderLeft: '2px solid #C4614A', borderRadius: '0 4px 4px 0', marginBottom: 8 }}>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 12, color: text, lineHeight: 1.5 }}>{inc}</p>
            </div>
          ))}
        </div>

        {/* Receipts */}
        <div style={{ paddingTop: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
          <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 10 }}>RECEIPTS SUMMARY</p>
          <div style={{ backgroundColor: card, borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 22, color: text }}>{show.receipts.total}</p>
            {show.receipts.breakdown.map((line, i) => (
              <p key={i} style={{ margin: '0 0 4px', fontFamily: 'Inter, system-ui', fontSize: 11, color: muted }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ paddingTop: 20 }}>
          <p style={{ margin: '0 0 10px', fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>
            NOTES {!isLead && <span style={{ color: '#B0ACA7' }}>· READ ONLY</span>}
          </p>
          {isLead ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this show…"
              style={{
                width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${border}`,
                outline: 'none', resize: 'none', fontFamily: 'Inter, system-ui', fontSize: 13,
                color: text, lineHeight: 1.6, paddingBottom: 8,
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 13, color: text, lineHeight: 1.6 }}>
              {notes || <span style={{ color: muted }}>No notes.</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShowHistory({ onClose, currentProfile, dark }) {
  const [selectedShow, setSelectedShow] = useState(null)

  const isLead  = currentProfile?.role === 'lead'
  const bg      = dark ? '#1A1816' : '#F5F2EE'
  const card    = dark ? '#242220' : '#FFFFFF'
  const text    = dark ? '#F0EDE8' : '#111111'
  const muted   = dark ? '#888580' : '#888580'
  const border  = dark ? '#2E2B28' : '#E0DDD8'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150, backgroundColor: bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 4, display: 'flex', alignItems: 'center', color: muted }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>
          SHOW HISTORY
        </p>
      </div>

      {/* Title */}
      <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontSize: 32, color: text, lineHeight: 1 }}>Valentino</p>
        <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>Art Partner</p>
      </div>

      {/* Show list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 32px', position: 'relative' }}>
        {showHistory.map(show => (
          <button
            key={show.id}
            onClick={() => setSelectedShow(show)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              backgroundColor: card, borderRadius: 10, padding: '16px 18px',
              marginBottom: 10, border: 'none', cursor: 'pointer', outline: 'none',
              boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ margin: '0 0 3px', fontFamily: 'Georgia, serif', fontSize: 17, color: text }}>{show.name}</p>
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>{show.date} · {show.venue} · {show.city}</p>
              </div>
              <span style={{ fontFamily: 'Inter, system-ui', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A9E7E', backgroundColor: '#7A9E7E22', border: '1px solid #7A9E7E66', borderRadius: 20, padding: '3px 8px', flexShrink: 0, marginLeft: 12 }}>
                COMPLETED
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, color: muted }}>
                {show.artists.length} artist{show.artists.length !== 1 ? 's' : ''}
              </p>
              {show.incidents.length > 0 && (
                <p style={{ margin: 0, fontFamily: 'Inter, system-ui', fontSize: 10, color: '#C4614A' }}>
                  {show.incidents.length} incident{show.incidents.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </button>
        ))}

        {/* Detail panel — slides in over the list */}
        {selectedShow && (
          <ShowDetail
            show={selectedShow}
            isLead={isLead}
            onBack={() => setSelectedShow(null)}
            dark={dark}
          />
        )}
      </div>
    </div>
  )
}
