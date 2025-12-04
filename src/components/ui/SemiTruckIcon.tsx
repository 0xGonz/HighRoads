interface SemiTruckIconProps {
  className?: string
}

export function SemiTruckIcon({ className = 'h-6 w-6' }: SemiTruckIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Trailer */}
      <rect x="1" y="6" width="12" height="10" rx="1" />
      {/* Cab */}
      <path d="M13 10h5l3 4v2h-8v-6z" />
      {/* Cab window */}
      <path d="M14 10v4h3.5" />
      {/* Wheels */}
      <circle cx="5" cy="18" r="2" />
      <circle cx="18.5" cy="18" r="2" />
      {/* Trailer wheel */}
      <circle cx="10" cy="18" r="2" />
      {/* Connection */}
      <line x1="13" y1="14" x2="13" y2="16" />
    </svg>
  )
}
