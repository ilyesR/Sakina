'use client'
interface Props {
  value: number
  max: number
  size?: number
  stroke?: number
  color?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({ value, max, size = 80, stroke = 7, color = '#0d7a5f', label, sublabel }: Props) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dash = pct * circ
  const cx = size / 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={cx} cy={cx} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      {label && (
        <div style={{ textAlign: 'center', marginTop: -4 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>
          {sublabel && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{sublabel}</div>}
        </div>
      )}
    </div>
  )
}
