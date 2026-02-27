'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react'

interface MessageTemplate {
  id: string
  name: string
  channel: 'email' | 'sms'
  category: string
  subject: string | null
  body: string
  variables: string[]
  is_active: boolean
  created_at: string
}

interface TemplateListProps {
  templates: MessageTemplate[]
}

export function TemplateList({ templates }: TemplateListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (templates.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        <p>No templates yet.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {templates.map((template) => (
        <div key={template.id} className="px-6 py-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
          >
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    template.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 capitalize">{template.category.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {template.variables.length > 0 && (
                <div className="hidden md:flex items-center gap-1">
                  {template.variables.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600"
                    >
                      {v}
                    </span>
                  ))}
                  {template.variables.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{template.variables.length - 3} more
                    </span>
                  )}
                </div>
              )}
              {expandedId === template.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedId === template.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {template.channel === 'email' && template.subject && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm text-gray-900">{template.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Body</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {template.body}
                </pre>
              </div>
              {template.variables.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Variables</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((v) => (
                      <code
                        key={v}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-primary-50 text-primary-700"
                      >
                        {`{{${v}}}`}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
