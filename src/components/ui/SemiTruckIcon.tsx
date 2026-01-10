interface SemiTruckIconProps {
  className?: string
}

export function SemiTruckIcon({ className = 'h-6 w-6' }: SemiTruckIconProps) {
  return (
    <svg
      viewBox="0 0 64 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Trailer - large rectangle */}
      <rect x="1" y="4" width="36" height="20" rx="1" />

      {/* Cab - connected to trailer */}
      <path d="M37 10 L37 24 L54 24 L54 16 L48 10 L37 10" />

      {/* Windshield diagonal line */}
      <line x1="48" y1="10" x2="54" y2="16" />

      {/* Trailer wheel 1 */}
      <circle cx="10" cy="28" r="4" />
      {/* Trailer wheel 2 */}
      <circle cx="22" cy="28" r="4" />

      {/* Cab wheel */}
      <circle cx="46" cy="28" r="4" />

      {/* Undercarriage lines */}
      <line x1="6" y1="24" x2="14" y2="24" />
      <line x1="18" y1="24" x2="26" y2="24" />
      <line x1="37" y1="24" x2="42" y2="24" />
    </svg>
  )
}
