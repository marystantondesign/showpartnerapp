import { STATUS_META } from '../data/mockData'
import BottomSheet from './BottomSheet'

export default function NotificationDrawer({ open, onClose, notifications }) {
  return (
    <BottomSheet open={open} onClose={onClose} height="60%">
      <p className="text-[10px] tracking-widest uppercase font-sans text-[#888580] mb-4">NOTIFICATIONS</p>
      {notifications.length === 0 && (
        <p className="text-xs text-[#888580] font-sans">No new notifications.</p>
      )}
      {notifications.map(n => (
        <div
          key={n.id}
          className={`flex items-start gap-3 py-3 border-b border-[#E0DDD8] dark:border-[#2E2B28] last:border-0 ${
            !n.read ? 'border-l-2 border-l-[#D4A853] pl-3' : ''
          }`}
        >
          {n.status && (
            <div
              className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: STATUS_META[n.status]?.color || '#888' }}
            />
          )}
          {!n.status && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0 bg-[#C8C4BF]" />}
          <div className="flex-1">
            <p className="text-xs font-sans text-[#111] dark:text-[#F0EDE8] leading-snug">{n.text}</p>
          </div>
          <span className="text-[10px] font-sans text-[#888580] flex-shrink-0 mt-0.5">{n.timestamp}</span>
        </div>
      ))}
    </BottomSheet>
  )
}
