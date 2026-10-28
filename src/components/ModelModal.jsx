import { useEffect, useRef } from 'react'
import { modelHistory } from '../data/mockData'

const CHIP = {
  done:        { c: '#7A9E7E', t: 'Done'        },
  in_progress: { c: '#D4A853', t: 'In progress' },
  paused:      { c: '#8A9BB0', t: 'Paused'      },
  not_started: { c: '#E0DDD8', t: 'Not started' },
}

const DISC_LABEL = { makeup: 'Makeup', hair: 'Hair', nails: 'Nails' }

function parseTimeToMins(t) {
  if (!t) return 0
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  return h * 60 + min
}

export default function ModelModal({ model, profiles, modelOrderMap, onClose, svc }) {
  const backdropRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const profileById = id => profiles.find(p => p.id === id)
  const orderNum = modelOrderMap[model.id] || '??'
  const orderedDiscs = [svc, ...['hair', 'makeup', 'nails'].filter(d => d !== svc)]

  const svcAssistant = model.services[svc]?.assistantId ? profileById(model.services[svc].assistantId) : null

  function shortName(profile) {
    if (!profile) return ''
    const parts = profile.name.split(' ')
    return parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '')
  }

  function discDetailText(disc) {
    const s = model.services[disc]
    if (!s) return 'Not paired'
    const asst = s.assistantId ? profileById(s.assistantId) : null
    const sn = asst ? shortName(asst) : null
    switch (s.status) {
      case 'done':        return sn ? `${sn} · done` : 'Done'
      case 'in_progress': return sn ? `${sn} · in progress` : 'In progress'
      case 'paused':      return s.pausedAt ? `${sn || ''} · paused at ${s.pausedAt}`.replace(/^ · /, '') : (sn ? `${sn} · paused` : 'Paused')
      case 'not_started': return sn ? `${sn} is up next` : 'Not paired'
      default:            return 'Not paired'
    }
  }

  const doneCount = orderedDiscs.filter(d => model.services[d]?.status === 'done').length

  function statusSummary() {
    const parts = orderedDiscs
      .filter(d => model.services[d]?.status !== 'done')
      .map(d => {
        const st = model.services[d]?.status
        if (st === 'in_progress') return `${DISC_LABEL[d].toLowerCase()} in progress`
        if (st === 'paused')      return `${DISC_LABEL[d].toLowerCase()} paused`
        if (st === 'not_started') return `${DISC_LABEL[d].toLowerCase()} not started`
        return null
      })
      .filter(Boolean)
    return parts.length ? parts.join(', ') : 'all done'
  }

  function computeUpdates() {
    const events = []
    for (const disc of ['makeup', 'hair', 'nails']) {
      const s = model.services[disc]
      if (!s) continue
      const asst = s.assistantId ? profileById(s.assistantId) : null
      const sn = asst ? shortName(asst) : null
      if (s.startedAt) {
        events.push({
          time: s.startedAt,
          sort: parseTimeToMins(s.startedAt),
          text: `${DISC_LABEL[disc]} started${sn ? ' · ' + sn : ''}`,
          chipStatus: 'in_progress',
          chipLabel: `${DISC_LABEL[disc]} in progress`,
        })
      }
      if (s.pausedAt) {
        events.push({
          time: s.pausedAt,
          sort: parseTimeToMins(s.pausedAt),
          text: `${DISC_LABEL[disc]} paused${sn ? ' · ' + sn : ''}`,
          chipStatus: 'paused',
          chipLabel: `${DISC_LABEL[disc]} paused`,
        })
      }
    }
    if (model.arrivedAt) {
      const txt = model.comingFrom ? `Arrived, came from ${model.comingFrom}` : 'Arrived'
      events.push({ time: model.arrivedAt, sort: parseTimeToMins(model.arrivedAt), text: txt, chipStatus: null, chipLabel: null })
    }
    return events.sort((a, b) => b.sort - a.sort)
  }

  const updates = computeUpdates()
  const latestUpdate = updates[0]

  const pastShows = modelHistory[model.id] || []
  const pastShowNames = pastShows.map(s => s.showName).join(', ')

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const TX  = 'var(--sp-text)'
  const MT  = 'var(--sp-muted)'
  const BD  = 'var(--sp-border)'
  const SF  = 'var(--sp-surface)'
  const BG  = 'var(--sp-bg)'
  const allergyBg   = isDark ? '#3A1E1B' : '#F8E9E5'
  const allergyText = isDark ? '#E8826B' : '#A33D28'
  const borderMuted = isDark ? 'var(--sp-border)' : '#CFCAC4'

  function Chip({ status, label }) {
    const ch = CHIP[status] || CHIP.not_started
    return (
      <span style={{
        fontFamily: 'Inter,system-ui,sans-serif', fontSize: 9, fontWeight: 600,
        letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 999,
        padding: '4px 8px', background: ch.c, color: '#111', whiteSpace: 'nowrap',
      }}>
        {label || ch.t}
      </span>
    )
  }

  function Lbl({ children, style }) {
    return (
      <p style={{
        fontFamily: 'Inter,system-ui,sans-serif', fontSize: 10, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#6E6A64', margin: 0, ...style,
      }}>{children}</p>
    )
  }

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={model.name}
        style={{
          width: 940, height: 640, background: BG, borderRadius: 18,
          overflow: 'hidden', display: 'grid',
          gridTemplateColumns: '460px minmax(0,1fr)',
        }}
      >
        {/* ── Left column (no overall scroll) ── */}
        <div style={{
          background: SF, borderRight: `1px solid ${BD}`, padding: 24,
          display: 'flex', flexDirection: 'column',
          height: '100%', boxSizing: 'border-box', overflow: 'hidden',
        }}>
          {/* Model + Assistant cards */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 12 }}>
            {/* Model card */}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <img
                src={model.avatar}
                alt={model.name}
                style={{ width: '100%', height: 128, borderRadius: 12, objectFit: 'cover', objectPosition: '50% 20%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: 22, lineHeight: 1.15, color: TX, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.name}</span>
                <span style={{ fontSize: 13, color: MT }}>Model</span>
                <span style={{ fontSize: 13, color: MT }}>#{orderNum} &middot; Look {model.look}</span>
              </div>
            </div>
            {/* Assistant card */}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {svcAssistant ? (
                <>
                  <img
                    src={svcAssistant.avatar}
                    alt={svcAssistant.name}
                    style={{ width: '100%', height: 128, borderRadius: 12, objectFit: 'cover', objectPosition: '50% 20%' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: 'Georgia,serif', fontSize: 22, lineHeight: 1.15, color: TX, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{svcAssistant.name}</span>
                    <span style={{ fontSize: 13, color: MT }}>Assistant</span>
                    {svcAssistant.station && <span style={{ fontSize: 13, color: MT }}>{svcAssistant.station}</span>}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: '100%', height: 128, borderRadius: 12, background: BD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      style={{
                        minHeight: 36, padding: '0 16px', borderRadius: 999,
                        border: `1px solid ${TX}`, background: 'transparent',
                        fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, fontWeight: 600,
                        letterSpacing: '.1em', color: TX, cursor: 'pointer',
                      }}
                    >
                      + PAIR
                    </button>
                  </div>
                  <span style={{ fontSize: 13, color: MT }}>Not paired</span>
                </>
              )}
            </div>
          </div>

          {/* Where they're at */}
          <div style={{ flexShrink: 0, marginTop: 14 }}>
            <Lbl style={{ marginBottom: 2 }}>Where they're at</Lbl>
            {orderedDiscs.map(disc => (
              <div key={disc} style={{
                display: 'grid', gridTemplateColumns: '76px minmax(0,1fr) auto',
                gap: 10, alignItems: 'center', minHeight: 40, borderBottom: `1px solid ${BD}`,
              }}>
                <span style={{ fontSize: 13, color: TX }}>{DISC_LABEL[disc]}</span>
                <span style={{ fontSize: 12, color: MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {discDetailText(disc)}
                </span>
                <Chip status={model.services[disc]?.status || 'not_started'} />
              </div>
            ))}
          </div>

          {/* Earlier updates — only this section scrolls */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: 12 }}>
            <Lbl style={{ marginBottom: 2 }}>Earlier updates</Lbl>
            {updates.length === 0
              ? <span style={{ fontSize: 12, color: MT }}>No updates yet</span>
              : updates.map((u, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', gap: 10, padding: '5px 0', fontSize: 12 }}>
                  <span style={{ color: MT }}>{u.time}</span>
                  <span style={{ color: TX }}>{u.text}</span>
                </div>
              ))
            }
          </div>

          {/* Past shows — pinned to bottom */}
          <button
            onClick={() => {}}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              minHeight: 56, padding: '10px 14px', borderRadius: 12,
              border: `1px solid ${BD}`, background: BG,
              fontFamily: 'Inter,system-ui,sans-serif', textAlign: 'left',
              color: TX, cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14 }}>
                Past shows with you{pastShows.length > 0 ? ` · ${pastShows.length}` : ''}
              </span>
              {pastShowNames && <span style={{ fontSize: 12, color: MT }}>{pastShowNames}</span>}
            </span>
            <span aria-hidden style={{ fontSize: 18, color: MT }}>&rsaquo;</span>
          </button>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Header */}
          <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px 12px 28px', borderBottom: `1px solid ${BD}`,
          }}>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span style={{ fontSize: 13, color: TX, whiteSpace: 'nowrap' }}>{doneCount} of {orderedDiscs.length} done</span>
              <span style={{ fontSize: 12, color: '#4A4743', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                &middot; {statusSummary()}
              </span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 44, height: 44, borderRadius: 12, border: `1px solid ${BD}`,
                background: 'transparent', fontSize: 20, color: '#4A4743',
                flexShrink: 0, cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif',
              }}
            >×</button>
          </div>

          {/* Scrollable body */}
          <div style={{
            flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 28px',
            display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            columnGap: 28, rowGap: 20, alignContent: 'start',
          }}>
            {/* Latest card — chip and text from the same event */}
            {latestUpdate && (
              <div style={{
                gridColumn: '1 / -1', background: SF, border: `1px solid ${BD}`,
                borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Lbl>Latest &middot; {latestUpdate.time}</Lbl>
                  {latestUpdate.chipStatus && (
                    <Chip status={latestUpdate.chipStatus} label={latestUpdate.chipLabel} />
                  )}
                </div>
                <span style={{ fontSize: 15, lineHeight: 1.45, color: TX }}>{latestUpdate.text}</span>
              </div>
            )}

            {/* Notes */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Lbl>Notes</Lbl>
              {(model.notes || []).map(note => (
                note.isAllergy ? (
                  <div key={note.id} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '10px 12px', borderRadius: 10, background: allergyBg,
                    fontSize: 13, lineHeight: 1.4,
                  }}>
                    <b style={{ color: allergyText, fontSize: 11, letterSpacing: '.08em', paddingTop: 1, whiteSpace: 'nowrap', fontWeight: 600 }}>ALLERGY</b>
                    <span style={{ color: TX }}>{note.text}</span>
                  </div>
                ) : (
                  <div key={note.id} style={{
                    padding: '10px 12px', borderRadius: 10,
                    background: SF, border: `1px solid ${BD}`,
                    fontSize: 13, lineHeight: 1.4, color: TX,
                  }}>
                    {note.text}
                  </div>
                )
              ))}
              <button
                style={{
                  alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
                  minHeight: 44, padding: '0 16px', borderRadius: 8,
                  border: `1px solid ${borderMuted}`,
                  background: SF, color: TX,
                  fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer',
                }}
              >
                <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                ADD A NOTE
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            flexShrink: 0, display: 'flex', gap: 10,
            padding: '14px 28px 18px', borderTop: `1px solid ${BD}`,
          }}>
            <button style={{
              minHeight: 48, padding: '0 18px', borderRadius: 8,
              border: `1px solid ${borderMuted}`,
              background: 'transparent', color: TX,
              fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer',
            }}>PING ASSISTANT</button>
            <span style={{ flex: 1 }} />
            <button style={{
              minHeight: 48, padding: '0 22px', borderRadius: 8,
              border: 0, background: TX, color: 'var(--sp-inverse-text)',
              fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, letterSpacing: '.1em', cursor: 'pointer',
            }}>UPDATE STATUS</button>
          </div>
        </div>
      </div>
    </div>
  )
}
