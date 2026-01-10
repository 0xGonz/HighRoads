'use client'

import Link from 'next/link'
import { ArrowRight, FileText, HelpCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from './ChatWidget'

interface ChatMessageProps {
  message: Message
}

const iconMap = {
  apply: ArrowRight,
  info: FileText,
  question: HelpCircle,
  phone: Phone,
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          'animate-fade-in',
          isUser
            ? 'bg-accent text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md shadow-soft border border-gray-100'
        )}
      >
        {/* Image if present */}
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded screenshot"
            className="max-w-full rounded-lg mb-2"
          />
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {message.actions.map((action) => {
              const Icon = iconMap[action.icon]
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                    'bg-primary-50 text-primary-700 hover:bg-primary-100',
                    'transition-colors duration-200'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {action.label}
                </Link>
              )
            })}
          </div>
        )}

        <p
          className={cn(
            'text-xs mt-1.5',
            isUser ? 'text-white/70' : 'text-gray-400'
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
