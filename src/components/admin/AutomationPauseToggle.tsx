'use client'

import { useState } from 'react'
import { Zap, ZapOff, Loader2 } from 'lucide-react'

interface AutomationPauseToggleProps {
  applicantId: string
  initialPaused: boolean
  variant?: 'default' | 'compact'
}

export function AutomationPauseToggle({
  applicantId,
  initialPaused,
  variant = 'default',
}: AutomationPauseToggleProps) {
  const [isPaused, setIsPaused] = useState(initialPaused)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automation_paused: !isPaused,
        }),
      })

      if (response.ok) {
        setIsPaused(!isPaused)
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
          isPaused
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50`}
        title={isPaused ? 'Resume automations' : 'Pause automations'}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPaused ? (
          <>
            <ZapOff className="h-4 w-4" />
            Paused
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Auto
          </>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        {isPaused ? (
          <ZapOff className="h-4 w-4 text-gray-400" />
        ) : (
          <Zap className="h-4 w-4 text-purple-600" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            Automations {isPaused ? 'Paused' : 'Active'}
          </p>
          <p className="text-xs text-gray-500">
            {isPaused
              ? 'No automated messages will be sent'
              : 'Follow-up messages enabled'}
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isPaused
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } disabled:opacity-50`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPaused ? (
          'Resume'
        ) : (
          'Pause'
        )}
      </button>
    </div>
  )
}
