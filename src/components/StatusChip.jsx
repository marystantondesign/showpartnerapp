import { STATUS_META } from '../data/mockData'

export default function StatusChip({ status, onClick, small = false }) {
  const meta = STATUS_META[status] || STATUS_META.not_started
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: meta.color, color: meta.textColor }}
      className={`inline-flex items-center rounded-full font-sans font-semibold tracking-widest uppercase whitespace-nowrap border-0 outline-none cursor-pointer ${
        small
          ? 'text-[9px] px-2 py-[3px]'
          : 'text-[10px] px-3 py-[5px]'
      }`}
    >
      {meta.label}
    </button>
  )
}
