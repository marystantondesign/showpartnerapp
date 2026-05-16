export default function FloorPlanSVG({ dark }) {
  const stroke = dark ? '#F0EDE8' : '#111111'
  const bg = dark ? '#1A1816' : '#F5F2EE'
  const muted = dark ? '#8A8480' : '#888580'

  return (
    <svg viewBox="0 0 340 260" width="100%" style={{ display: 'block' }} fill="none">
      {/* Outer boundary */}
      <rect x="10" y="10" width="320" height="240" stroke={stroke} strokeWidth="1.5" rx="2" />

      {/* DRESSING ROOMS */}
      <rect x="10" y="10" width="70" height="120" stroke={stroke} strokeWidth="1" />
      <text x="45" y="42" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">DRESSING</text>
      <text x="45" y="53" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">ROOMS</text>
      <circle cx="38" cy="75" r="4" fill={stroke} />
      <text x="38" y="87" textAnchor="middle" fill={muted} fontSize="6.5" letterSpacing="1" fontFamily="Inter,system-ui,sans-serif">READY</text>

      {/* HAIR */}
      <rect x="80" y="10" width="80" height="120" stroke={stroke} strokeWidth="1" />
      <text x="120" y="32" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">HAIR</text>
      <circle cx="100" cy="60" r="4" fill="#D4A853" />
      <text x="100" y="72" textAnchor="middle" fill={muted} fontSize="6.5" letterSpacing="1" fontFamily="Inter,system-ui,sans-serif">HAIR 1</text>
      <circle cx="140" cy="82" r="4" fill="#D4A853" />
      <text x="140" y="94" textAnchor="middle" fill={muted} fontSize="6.5" letterSpacing="1" fontFamily="Inter,system-ui,sans-serif">HAIR 2</text>

      {/* MAKEUP */}
      <rect x="160" y="10" width="80" height="120" stroke={stroke} strokeWidth="1" />
      <text x="200" y="32" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">MAKEUP</text>
      <circle cx="180" cy="55" r="4" fill="#C4614A" />
      <text x="180" y="67" textAnchor="middle" fill={muted} fontSize="6.5" letterSpacing="1" fontFamily="Inter,system-ui,sans-serif">MAKEUP 1</text>
      <circle cx="220" cy="78" r="4" fill="#C4614A" />
      <text x="220" y="90" textAnchor="middle" fill={muted} fontSize="6.5" letterSpacing="1" fontFamily="Inter,system-ui,sans-serif">MAKEUP 2</text>

      {/* BATHROOMS */}
      <rect x="240" y="10" width="90" height="120" stroke={stroke} strokeWidth="1" />
      <text x="285" y="32" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">BATH</text>
      <text x="285" y="43" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">ROOMS</text>
      <circle cx="285" cy="76" r="4" fill={stroke} />

      {/* BACKSTAGE dashed line */}
      <line x1="10" y1="136" x2="330" y2="136" stroke={muted} strokeWidth="1" strokeDasharray="4 4" />
      <text x="170" y="150" textAnchor="middle" fill={muted} fontSize="7.5" letterSpacing="2" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">BACKSTAGE</text>

      {/* STAGE */}
      <rect x="10" y="158" width="320" height="72" stroke={stroke} strokeWidth="1" />
      <text x="170" y="197" textAnchor="middle" fill={stroke} fontSize="10" letterSpacing="3" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">STAGE</text>

      {/* ENTRANCE / EXIT */}
      <text x="22" y="248" fill={muted} fontSize="7" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif">ENTRANCE</text>
      <text x="318" y="248" textAnchor="end" fill={muted} fontSize="7" letterSpacing="1.5" fontFamily="Inter,system-ui,sans-serif">EXIT</text>
    </svg>
  )
}
