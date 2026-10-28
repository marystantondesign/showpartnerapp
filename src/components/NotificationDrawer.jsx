import BottomSheet from './BottomSheet'

const DOT_COLORS = {
  red:  '#C4614A',
  gold: '#D4A853',
  gray: '#CFCAC4',
}

export default function NotificationDrawer({ open, onClose, notifications }) {
  return (
    <BottomSheet open={open} onClose={onClose} height="auto" maxHeight="70dvh" noPadding>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 12px', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#111' }}>
          Notifications
        </span>
        <button
          onClick={onClose}
          style={{
            width: 44, height: 44, border: 'none', background: 'transparent',
            fontSize: 22, color: '#6E6A64', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
          aria-label="Close notifications"
        >
          ×
        </button>
      </div>

      {/* Notification list */}
      <div style={{ padding: '0 20px 24px' }}>
        {notifications.length === 0 && (
          <p style={{ fontSize: 14, color: '#6E6A64', margin: 0 }}>No notifications.</p>
        )}
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 0',
              borderBottom: '1px solid #F0EDE8',
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              marginTop: 5, flexShrink: 0,
              background: n.read ? DOT_COLORS.gray : (DOT_COLORS[n.dot] ?? DOT_COLORS.gray),
            }} />
            <p style={{
              flex: 1, fontSize: 14, lineHeight: 1.4, margin: 0,
              fontWeight: n.read ? 400 : 600,
              color: n.read ? '#4A4743' : '#111',
            }}>
              {n.text}
            </p>
            <span style={{ fontSize: 12, color: '#6E6A64', flexShrink: 0, marginTop: 1 }}>
              {n.timestamp}
            </span>
          </div>
        ))}
      </div>
    </BottomSheet>
  )
}
