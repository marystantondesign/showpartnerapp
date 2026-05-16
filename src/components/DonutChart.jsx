export default function DonutChart({ done, total, size = 72 }) {
  const stroke = 6
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0
  const dash = pct * circ
  const cx = size / 2

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#D9D5CF" strokeWidth={stroke} />
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke="#7A9E7E"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x="50%" y="50%"
        dominantBaseline="middle" textAnchor="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontFamily: 'Georgia, serif', fontSize: size * 0.22, fill: 'currentColor' }}
      >
        {done}/{total}
      </text>
    </svg>
  )
}
