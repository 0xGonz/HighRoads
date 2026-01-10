'use client'

import React, { ReactNode, ElementType } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade'

interface AnimateInProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  as?: ElementType
  threshold?: number
}

const animationClasses: Record<AnimationType, { initial: string; animate: string }> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    initial: 'opacity-0 -translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    initial: 'opacity-0 -translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    initial: 'opacity-0 translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
  'scale': {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
  },
  'fade': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
}

export function AnimateIn({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className,
  as = 'div',
  threshold = 0.1,
}: AnimateInProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold })

  const { initial, animate } = animationClasses[animation]

  return React.createElement(
    as,
    {
      ref: ref,
      className: cn(
        'transition-all ease-out',
        isVisible ? animate : initial,
        className
      ),
      style: {
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      },
    },
    children
  )
}

// Stagger container for multiple items
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  animation?: AnimationType
  as?: ElementType
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  animation = 'fade-up',
  as = 'div',
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const { initial, animate } = animationClasses[animation]

  // Clone children and add stagger delays
  const staggeredChildren = Array.isArray(children)
    ? children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all duration-500 ease-out',
            isVisible ? animate : initial
          )}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
          }}
        >
          {child}
        </div>
      ))
    : children

  return React.createElement(
    as,
    {
      ref: ref,
      className: className,
    },
    staggeredChildren
  )
}
