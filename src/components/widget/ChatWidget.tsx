'use client'

import { useState, useRef, useCallback } from 'react'
import { ChatButton } from './ChatButton'
import { ChatPanel } from './ChatPanel'

export interface MessageAction {
  label: string
  href: string
  icon: 'apply' | 'info' | 'phone' | 'question'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: MessageAction[]
  image?: string // base64 image data
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

  const handleSendMessage = useCallback((text: string, image?: string) => {
    // Add user message
    addMessage({ role: 'user', content: text, image })

    // If Vapi is connected, send through voice
    if (vapiRef.current && isConnected) {
      // Vapi handles this through voice, so just show the message
      return
    }

    // Simple keyword-based responses for text chat
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      let response = ""
      let actions: MessageAction[] = []

      // Handle image uploads
      if (image) {
        response = "Thanks for sharing that screenshot! I can see you're looking for help. If you're stuck on the application or have questions about a specific step, let me know! Otherwise, here are some helpful links:"
        actions = [
          { label: "Start Application", href: "/apply", icon: "apply" },
          { label: "How It Works", href: "/how-it-works", icon: "info" },
          { label: "FAQ", href: "/faq", icon: "question" }
        ]
      } else if (lowerText.includes("get started") || lowerText.includes("how do i") || lowerText.includes("apply") || lowerText.includes("start")) {
        response = "Getting started is easy! The application takes about 5 minutes and there's no credit check required. You'll need a valid CDL-A, current DOT medical card, and at least 12 months of driving experience."
        actions = [
          { label: "Apply Now", href: "/apply", icon: "apply" },
          { label: "See Requirements", href: "/how-it-works", icon: "info" }
        ]
      } else if (lowerText.includes("requirement") || lowerText.includes("qualify") || lowerText.includes("need") || lowerText.includes("cdl")) {
        response = "To qualify you'll need: valid Class A CDL, current DOT medical card, 12+ months OTR experience, clean MVR (no DUI/DWI in past 5 years), and US work eligibility. No credit check required!"
        actions = [
          { label: "Check If You Qualify", href: "/apply", icon: "apply" },
          { label: "Learn More", href: "/how-it-works", icon: "info" }
        ]
      } else if (lowerText.includes("payment") || lowerText.includes("cost") || lowerText.includes("price") || lowerText.includes("down") || lowerText.includes("money") || lowerText.includes("split") || lowerText.includes("profit")) {
        response = "No down payment required! After a 4-week Proving Ground, net revenue is split 50/50 between you and High Road Capital. Your share builds equity toward ownership. At $2,000/week to HRC, you can own in just 1 year!"
        actions = [
          { label: "Apply Now", href: "/apply", icon: "apply" },
          { label: "How It Works", href: "/how-it-works", icon: "info" }
        ]
      } else if (lowerText.includes("truck") || lowerText.includes("vehicle") || lowerText.includes("equipment")) {
        response = "We offer 2020-2021 Peterbilt 579 sleeper trucks, serviced by our partner TLG Peterbilt of Charleston. All trucks are inspected and fully maintained. Once approved, we'll help you select your truck!"
        actions = [
          { label: "Start Application", href: "/apply", icon: "apply" },
          { label: "View Program Details", href: "/how-it-works", icon: "info" }
        ]
      } else if (lowerText.includes("carrier") || lowerText.includes("freight") || lowerText.includes("load") || lowerText.includes("haul")) {
        response = "We partner with top-paying carriers for consistent freight. Choose from dry van, refrigerated, or flatbed. Our carriers offer competitive rates and consistent miles."
        actions = [
          { label: "Get Started", href: "/apply", icon: "apply" },
          { label: "About Us", href: "/about", icon: "info" }
        ]
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
        response = "Hello! Welcome to High Road Capital. I'm here to help you learn about our performance-based truck ownership program. What would you like to know?"
        actions = [
          { label: "Apply Now", href: "/apply", icon: "apply" },
          { label: "How It Works", href: "/how-it-works", icon: "info" },
          { label: "FAQ", href: "/faq", icon: "question" }
        ]
      } else if (lowerText.includes("own") || lowerText.includes("ownership") || lowerText.includes("how long") || lowerText.includes("timeline")) {
        response = "Ownership timeline depends on performance. At $1,000/week to HRC = 3 years. At $1,500/week = 2 years. At $2,000/week = just 1 year. The better you perform, the faster you own!"
        actions = [
          { label: "Apply Now", href: "/apply", icon: "apply" },
          { label: "Ownership Details", href: "/how-it-works", icon: "info" }
        ]
      } else {
        response = "Thanks for your question! Our performance-based ownership program helps drivers earn their truck through a 50/50 profit split. No credit check, no down payment. How can I help you?"
        actions = [
          { label: "Apply Now", href: "/apply", icon: "apply" },
          { label: "How It Works", href: "/how-it-works", icon: "info" },
          { label: "FAQ", href: "/faq", icon: "question" }
        ]
      }

      addMessage({ role: 'assistant', content: response, actions })
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
