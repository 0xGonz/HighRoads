'use client'

import { useState, useRef, useCallback } from 'react'
import { ChatButton } from './ChatButton'
import { ChatPanel } from './ChatPanel'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Define Vapi type for dynamic import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VapiInstance = any

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const vapiRef = useRef<VapiInstance | null>(null)
  const vapiInitializedRef = useRef(false)

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date()
    }])
  }, [])

  // Initialize Vapi lazily (only when needed)
  const initializeVapi = useCallback(async () => {
    if (vapiInitializedRef.current || vapiRef.current) return vapiRef.current

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
    if (!publicKey) {
      console.warn('Vapi public key not configured')
      return null
    }

    try {
      // Dynamically import Vapi only on client side
      const VapiModule = await import('@vapi-ai/web')
      const Vapi = VapiModule.default

      const vapi = new Vapi(publicKey)
      vapiRef.current = vapi
      vapiInitializedRef.current = true

      // Event listeners
      vapi.on('call-start', () => {
        setIsConnected(true)
        addMessage({
          role: 'assistant',
          content: "Hi! I'm your High Road assistant. I can help you learn about our lease-to-own trucking program, answer questions about requirements, and guide you through the application process. How can I help you today?"
        })
      })

      vapi.on('call-end', () => {
        setIsConnected(false)
        setIsListening(false)
        setIsSpeaking(false)
      })

      vapi.on('speech-start', () => {
        setIsSpeaking(true)
      })

      vapi.on('speech-end', () => {
        setIsSpeaking(false)
      })

      vapi.on('volume-level', (level: unknown) => {
        setVolumeLevel(level as number)
      })

      vapi.on('message', (message: unknown) => {
        const msg = message as { type: string; role?: string; transcript?: string; transcriptType?: string }
        if (msg.type === 'transcript' && msg.transcriptType === 'final') {
          if (msg.role === 'user' && msg.transcript) {
            addMessage({ role: 'user', content: msg.transcript })
          } else if (msg.role === 'assistant' && msg.transcript) {
            addMessage({ role: 'assistant', content: msg.transcript })
          }
        }
      })

      vapi.on('error', (error: unknown) => {
        console.error('Vapi error:', error)
        addMessage({
          role: 'assistant',
          content: "I'm having trouble connecting. Please try again or call us directly at the number on our website."
        })
      })

      return vapi
    } catch (error) {
      console.error('Failed to initialize Vapi:', error)
      return null
    }
  }, [addMessage])

  const startCall = useCallback(async () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

    // Initialize Vapi if not already done
    const vapi = await initializeVapi()

    if (!vapi || !assistantId) {
      console.warn('Vapi not initialized or assistant ID not configured')
      // Show a demo message if not configured
      addMessage({
        role: 'assistant',
        content: "Hi! I'm your High Road assistant. I can help you learn about our lease-to-own trucking program. Note: Voice features require Vapi configuration. How can I help you today?"
      })
      return
    }

    try {
      setIsListening(true)
      await vapi.start(assistantId)
    } catch (error) {
      console.error('Failed to start call:', error)
      setIsListening(false)
      addMessage({
        role: 'assistant',
        content: "I couldn't start the voice call. Please make sure your microphone is enabled and try again."
      })
    }
  }, [addMessage, initializeVapi])

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const toggleCall = useCallback(() => {
    if (isConnected) {
      endCall()
    } else {
      startCall()
    }
  }, [isConnected, startCall, endCall])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    // Auto-start call when opening if not connected
    if (!isConnected && messages.length === 0) {
      startCall()
    }
  }, [isConnected, messages.length, startCall])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSendMessage = useCallback((text: string) => {
    // Add user message
    addMessage({ role: 'user', content: text })

    // If Vapi is connected, send through voice
    if (vapiRef.current && isConnected) {
      // Vapi handles this through voice, so just show the message
      return
    }

    // Otherwise, show a helpful response (since we don't have a text-only API)
    setTimeout(() => {
      const responses = [
        "Thanks for your message! For the best experience, click the microphone button to talk with me directly. I can answer all your questions about our lease-to-own trucking program.",
        "I'd love to help you! Click the mic button to start a voice conversation - it's the fastest way to get your questions answered about truck ownership.",
        "Great question! I work best over voice. Tap the microphone to chat with me about CDL requirements, weekly payments, and how to get started.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addMessage({ role: 'assistant', content: randomResponse })
    }, 500)
  }, [addMessage, isConnected])

  return (
    <>
      <ChatButton
        isOpen={isOpen}
        onClick={isOpen ? handleClose : handleOpen}
        hasUnread={false}
      />
      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isConnected={isConnected}
        isListening={isListening}
        isSpeaking={isSpeaking}
        volumeLevel={volumeLevel}
        onToggleCall={toggleCall}
        onSendMessage={handleSendMessage}
      />
    </>
  )
}
