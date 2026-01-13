'use client'

import { useEffect, useState } from 'react'

interface SuccessCheckmarkProps {
  size?: number
  className?: string
  onAnimationComplete?: () => void
}

export function SuccessCheckmark({
  size = 80,
  className = '',
  onAnimationComplete
}: SuccessCheckmarkProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Trigger callback after full animation completes
    const timer = setTimeout(() => {
      setAnimationComplete(true)
      onAnimationComplete?.()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onAnimationComplete])

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label="Success checkmark"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        className="success-checkmark"
      >
        {/* Background circle that draws itself */}
        <circle
          className="success-checkmark-circle"
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Checkmark path that draws after circle */}
        <path
          className="success-checkmark-check"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 16-16"
        />
      </svg>

      <style jsx>{`
        .success-checkmark {
          color: #16a34a;
        }

        .success-checkmark-circle {
          stroke-dasharray: 151;
          stroke-dashoffset: 151;
          animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .success-checkmark-check {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: draw-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
        }

        @keyframes draw-circle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Scale animation for the whole checkmark */
        .success-checkmark {
          animation: success-scale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;
          transform: scale(0.9);
        }

        @keyframes success-scale {
          to {
            transform: scale(1);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .success-checkmark-circle,
          .success-checkmark-check,
          .success-checkmark {
            animation: none;
            stroke-dashoffset: 0;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Alternative version with green filled background
export function SuccessCheckmarkFilled({
  size = 80,
  className = '',
  onAnimationComplete
}: SuccessCheckmarkProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete?.()
    }, 1200)

    return () => clearTimeout(timer)
  }, [onAnimationComplete])

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label="Success checkmark"
    >
      <div className="success-container">
        <svg
          width={size}
          height={size}
          viewBox="0 0 52 52"
          className="success-checkmark-filled"
        >
          {/* Green filled circle that scales in */}
          <circle
            className="success-circle-bg"
            cx="26"
            cy="26"
            r="24"
            fill="#16a34a"
          />

          {/* White circle border that draws */}
          <circle
            className="success-circle-border"
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
          />

          {/* White checkmark */}
          <path
            className="success-check-white"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l7 7 16-16"
          />
        </svg>
      </div>

      <style jsx>{`
        .success-container {
          animation: container-scale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform: scale(0);
        }

        .success-circle-bg {
          transform-origin: center;
          animation: circle-fill 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          transform: scale(0);
        }

        .success-circle-border {
          stroke-dasharray: 151;
          stroke-dashoffset: 151;
          animation: draw-border 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
        }

        .success-check-white {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: draw-check-white 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
        }

        @keyframes container-scale {
          to {
            transform: scale(1);
          }
        }

        @keyframes circle-fill {
          to {
            transform: scale(1);
          }
        }

        @keyframes draw-border {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-check-white {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Pulse effect after completion */
        .success-checkmark-filled {
          animation: success-pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s;
        }

        @keyframes success-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .success-container,
          .success-circle-bg,
          .success-circle-border,
          .success-check-white,
          .success-checkmark-filled {
            animation: none;
            transform: scale(1);
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
