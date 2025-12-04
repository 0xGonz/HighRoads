'use client'

import { cn } from '@/lib/utils'

interface VoiceIndicatorProps {
  isListening: boolean
  isSpeaking: boolean
  volumeLevel: number
}

export function VoiceIndicator({ isListening, isSpeaking, volumeLevel }: VoiceIndicatorProps) {
  // Create bars for the visualizer
  const bars = 5
  const normalizedLevel = Math.min(volumeLevel, 1)

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: bars }).map((_, index) => {
        // Calculate height based on volume and position (middle bars taller)
        const positionMultiplier = 1 - Math.abs(index - (bars - 1) / 2) / ((bars - 1) / 2) * 0.5
        const baseHeight = isSpeaking ? normalizedLevel * positionMultiplier : 0.2
        const height = Math.max(0.15, baseHeight)

        return (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all duration-100',
              isSpeaking ? 'bg-accent' : isListening ? 'bg-primary-400' : 'bg-gray-300'
            )}
            style={{
              height: `${height * 100}%`,
              minHeight: '4px',
              maxHeight: '100%',
              transitionDelay: `${index * 20}ms`
            }}
          />
        )
      })}

      {/* Status text */}
      <span
        className={cn(
          'ml-3 text-xs font-medium',
          isSpeaking ? 'text-accent' : isListening ? 'text-primary-600' : 'text-gray-500'
        )}
      >
        {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
      </span>
    </div>
  )
}
