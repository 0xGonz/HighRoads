'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Communication {
  id: string
  channel: 'email' | 'sms'
  direction: 'inbound' | 'outbound'
  subject: string | null
  body: string
  status: string
  is_automated: boolean
  sent_at: string | null
  created_at: string
  admin_users?: {
    name: string
  } | null
  message_templates?: {
    name: string
  } | null
}

interface ApplicantCommunicationsProps {
  applicantId: string
}

export function ApplicantCommunications({ applicantId }: ApplicantCommunicationsProps) {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await fetch(`/api/communications?applicantId=${applicantId}`)
        if (response.ok) {
          const data = await response.json()
          setCommunications(data.communications || [])
        } else {
          setError('Failed to load communications')
        }
      } catch (err) {
        setError('Failed to load communications')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunications()
  }, [applicantId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        {error}
      </div>
    )
  }

  if (communications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-2" />
        <p>No communications yet</p>
        <p className="text-sm">Messages will appear here once sent</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {communications.map((comm) => (
        <div
          key={comm.id}
          className={`p-3 rounded-lg border ${
            comm.direction === 'inbound'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
              comm.channel === 'email' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {comm.channel === 'email' ? (
                <Mail className="h-4 w-4 text-blue-600" />
              ) : (
                <MessageSquare className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {comm.direction}
                </span>
                <StatusBadge status={comm.status} />
                {comm.is_automated && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                    Auto
                  </span>
                )}
              </div>
              {comm.channel === 'email' && comm.subject && (
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {comm.subject}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap line-clamp-3">
                {comm.body}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(comm.created_at)}
                </span>
                {comm.admin_users && (
                  <span>by {comm.admin_users.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    pending: {
      icon: <Clock className="h-3 w-3" />,
      className: 'bg-yellow-100 text-yellow-700',
    },
    sent: {
      icon: <CheckCircle className="h-3 w-3" />,
      className: 'bg-blue-100 text-blue-700',
    },
    delivered: {
      icon: <CheckCircle className="h-3 w-3" />,
      className: 'bg-green-100 text-green-700',
    },
    failed: {
      icon: <XCircle className="h-3 w-3" />,
      className: 'bg-red-100 text-red-700',
    },
    bounced: {
      icon: <AlertCircle className="h-3 w-3" />,
      className: 'bg-orange-100 text-orange-700',
    },
  }

  const { icon, className } = config[status] || {
    icon: null,
    className: 'bg-gray-100 text-gray-700',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${className}`}>
      {icon}
      {status}
    </span>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
