'use client'

import { useRef, useEffect, useState } from 'react'
import { X, Mic, Phone, PhoneOff, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from './ChatMessage'
import { VoiceIndicator } from './VoiceIndicator'
import type { Message } from './ChatWidget'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  isConnected: boolean
  isListening: boolean
  isSpeaking: boolean
  volumeLevel: number
  onToggleCall: () => void
  onSendMessage: (text: string) => void
}

export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isConnected,
  isListening,
  isSpeaking,
  volumeLevel,
  onToggleCall,
  onSendMessage
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      onSendMessage(inputText.trim())
      setInputText('')
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className={cn(
        'fixed bottom-24 right-6 z-40',
        'w-[380px] max-w-[calc(100vw-48px)]',
        'bg-white rounded-2xl shadow-soft-xl',
        'flex flex-col overflow-hidden',
        'transition-all duration-300 ease-smooth',
        'border border-gray-100',
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      style={{ height: 'min(500px, calc(100vh - 160px))' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white px-4 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            {isConnected && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-700" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">High Road Assistant</h3>
            <p className="text-xs text-white/70">
              {isConnected ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Click mic to start'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-center px-6">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Mic className="w-8 h-8 text-accent" />
              </div>
              <p className="font-medium text-gray-700 mb-2">Voice Assistant Ready</p>
              <p className="text-sm">
                Click the microphone below to start a conversation about our lease-to-own trucking program.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input controls */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 flex-shrink-0">
        {/* Voice indicator when connected */}
        {isConnected && (
          <div className="mb-3">
            <VoiceIndicator
              isListening={isListening}
              isSpeaking={isSpeaking}
              volumeLevel={volumeLevel}
            />
          </div>
        )}

        {/* Text input + voice button */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className={cn(
              'flex-1 px-4 py-2.5 rounded-full',
              'border border-gray-200 bg-gray-50',
              'focus:outline-none focus:border-accent focus:bg-white',
              'transition-all duration-200',
              'text-sm placeholder:text-gray-400'
            )}
          />

          {/* Send button (shows when typing) */}
          {inputText.trim() ? (
            <button
              type="submit"
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-gradient-to-b from-accent to-accent-600 text-white',
                'hover:shadow-glow-accent transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
              )}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            /* Voice button (shows when not typing) */
            <button
              type="button"
              onClick={onToggleCall}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                  : 'bg-gradient-to-b from-primary-600 to-primary-700 hover:shadow-soft-lg text-white focus:ring-primary'
              )}
              aria-label={isConnected ? 'End call' : 'Start voice call'}
            >
              {isConnected ? (
                <PhoneOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}
        </form>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 mt-2">
          Type to chat or tap <Mic className="w-3 h-3 inline" /> for voice
        </p>
      </div>
    </div>
  )
}
