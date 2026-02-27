'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageSquare, Send, Loader2, Check, AlertCircle } from 'lucide-react'

interface Template {
  id: string
  name: string
  channel: 'email' | 'sms'
  category: string
  subject: string | null
  body: string
}

interface SendMessageFormProps {
  applicantId: string
  applicantEmail: string
  applicantPhone: string
  applicantFirstName: string
  smsOptedIn: boolean
  defaultChannel?: 'email' | 'sms'
}

export function SendMessageForm({
  applicantId,
  applicantEmail,
  applicantPhone,
  applicantFirstName,
  smsOptedIn,
  defaultChannel = 'email',
}: SendMessageFormProps) {
  const [channel, setChannel] = useState<'email' | 'sms'>(defaultChannel)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Update channel when defaultChannel prop changes
  useEffect(() => {
    setChannel(defaultChannel)
  }, [defaultChannel])

  // Fetch templates when channel changes
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/templates?channel=${channel}`)
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || [])
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
    setSelectedTemplate('')
    setSubject('')
    setMessage('')
  }, [channel])

  // Update form when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate)
      if (template) {
        // Replace variables with actual values
        let body = template.body
        body = body.replace(/\{\{\s*first_name\s*\}\}/gi, applicantFirstName)
        body = body.replace(/\{\{\s*admin_name\s*\}\}/gi, 'High Road Capital Team')

        if (channel === 'email' && template.subject) {
          let subj = template.subject
          subj = subj.replace(/\{\{\s*first_name\s*\}\}/gi, applicantFirstName)
          setSubject(subj)
        }
        setMessage(body)
      }
    }
  }, [selectedTemplate, templates, channel, applicantFirstName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSending(true)

    try {
      const response = await fetch('/api/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId,
          channel,
          templateId: selectedTemplate || undefined,
          subject: channel === 'email' ? subject : undefined,
          message,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setSuccess(true)
      setSelectedTemplate('')
      setSubject('')
      setMessage('')

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Channel Selection */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setChannel('email')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            channel === 'email'
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setChannel('sms')}
          disabled={!smsOptedIn}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            channel === 'sms'
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          } ${!smsOptedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!smsOptedIn ? 'Applicant has not opted in for SMS' : ''}
        >
          <MessageSquare className="h-4 w-4" />
          SMS
        </button>
      </div>

      {!smsOptedIn && channel === 'email' && (
        <p className="text-xs text-gray-500">
          SMS is disabled because applicant has not opted in.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            disabled={isLoading}
          >
            <option value="">Custom message...</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject (Email only) */}
        {channel === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              required
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={channel === 'email' ? 'Type your email message...' : 'Type your SMS (160 chars recommended)...'}
            rows={channel === 'email' ? 6 : 3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
            required
          />
          {channel === 'sms' && (
            <p className={`text-xs mt-1 ${message.length > 160 ? 'text-amber-600' : 'text-gray-500'}`}>
              {message.length}/160 characters
            </p>
          )}
        </div>

        {/* Recipient Info */}
        <div className="text-xs text-gray-500">
          Sending to: {channel === 'email' ? applicantEmail : applicantPhone}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <Check className="h-4 w-4 flex-shrink-0" />
            Message sent successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSending || !message || (channel === 'email' && !subject)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send {channel === 'email' ? 'Email' : 'SMS'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
