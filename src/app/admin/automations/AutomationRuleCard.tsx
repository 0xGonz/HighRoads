'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Play, Pause, Clock, Loader2 } from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  description: string | null
  trigger_type: string
  trigger_status: string | null
  trigger_days: number | null
  action_template_id: string | null
  action_channel: 'email' | 'sms'
  stop_on_response: boolean
  stop_on_status_change: boolean
  max_sends: number
  delay_minutes: number
  is_active: boolean
  priority: number
  created_at: string
  message_templates?: {
    id: string
    name: string
  } | null
}

interface AutomationRuleCardProps {
  rule: AutomationRule
}

export function AutomationRuleCard({ rule }: AutomationRuleCardProps) {
  const [isActive, setIsActive] = useState(rule.is_active)
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      const response = await fetch(`/api/automations/${rule.id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        setIsActive(!isActive)
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            rule.action_channel === 'email' ? 'bg-blue-50' : 'bg-green-50'
          }`}>
            {rule.action_channel === 'email' ? (
              <Mail className="h-5 w-5 text-blue-600" />
            ) : (
              <MessageSquare className="h-5 w-5 text-green-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{rule.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {isActive ? 'Active' : 'Paused'}
              </span>
            </div>
            {rule.description && (
              <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <TriggerBadge rule={rule} />
              {rule.message_templates && (
                <span>Template: {rule.message_templates.name}</span>
              )}
              {rule.max_sends > 1 && (
                <span>Max {rule.max_sends} sends</span>
              )}
              {rule.stop_on_response && (
                <span className="text-green-600">Stops on reply</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          } disabled:opacity-50`}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isActive ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Enable
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function TriggerBadge({ rule }: { rule: AutomationRule }) {
  const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    carrier_app: 'Carrier App',
    pending: 'Pending',
    complete: 'Complete',
    disqualified: 'Disqualified',
  }

  switch (rule.trigger_type) {
    case 'status_change':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-700">
          When status → {statusLabels[rule.trigger_status || ''] || rule.trigger_status}
        </span>
      )
    case 'days_in_status':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700">
          <Clock className="h-3 w-3" />
          {rule.trigger_days} days in {statusLabels[rule.trigger_status || ''] || rule.trigger_status}
        </span>
      )
    case 'missing_documents':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-700">
          <Clock className="h-3 w-3" />
          {rule.trigger_days} days with missing docs
        </span>
      )
    case 'no_response':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700">
          <Clock className="h-3 w-3" />
          {rule.trigger_days} days no response
        </span>
      )
    default:
      return null
  }
}
