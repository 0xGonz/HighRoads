'use client'

import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatButtonProps {
  isOpen: boolean
  onClick: () => void
  hasUnread?: boolean
}

export function ChatButton({ isOpen, onClick, hasUnread }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'bg-gradient-to-b from-accent to-accent-600 text-white',
        'shadow-soft-lg hover:shadow-glow-accent',
        'transition-all duration-300 ease-smooth',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Icon transition */}
      <span className="relative w-6 h-6">
        <MessageCircle
          className={cn(
            'w-6 h-6 absolute inset-0 transition-all duration-300',
            isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <X
          className={cn(
            'w-6 h-6 absolute inset-0 transition-all duration-300',
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </span>

      {/* Unread indicator */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      )}

      {/* Subtle pulse ring when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" style={{ animationDuration: '3s' }} />
      )}
    </button>
  )
}
