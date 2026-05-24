'use client'

import { ReactNode } from 'react'

interface OrnamentFrameProps {
  children: ReactNode
  className?: string
}

export default function OrnamentFrame({ children, className = '' }: OrnamentFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Угловые казахские орнаменты */}
      <svg className="absolute top-0 left-0 w-12 h-12 text-[var(--steppe-gold)] opacity-70" viewBox="0 0 48 48" fill="none">
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <path d="M6 10 L10 10 L10 14 L14 14 L14 10 L18 10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute top-0 right-0 w-12 h-12 text-[var(--steppe-gold)] opacity-70 rotate-90" viewBox="0 0 48 48" fill="none">
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <path d="M6 10 L10 10 L10 14 L14 14 L14 10 L18 10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-12 h-12 text-[var(--steppe-gold)] opacity-70 -rotate-90" viewBox="0 0 48 48" fill="none">
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <path d="M6 10 L10 10 L10 14 L14 14 L14 10 L18 10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-12 h-12 text-[var(--steppe-gold)] opacity-70 rotate-180" viewBox="0 0 48 48" fill="none">
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <path d="M6 10 L10 10 L10 14 L14 14 L14 10 L18 10" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="border border-[var(--steppe-gold)]/30 p-6">
        {children}
      </div>
    </div>
  )
}
