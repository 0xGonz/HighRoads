'use client'

import { cn } from '@/lib/utils'
import type { Message } from './ChatWidget'

interface ChatMessageProps {
  message: Message
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
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
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
