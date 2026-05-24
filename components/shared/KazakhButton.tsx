'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface KazakhButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export default function KazakhButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: KazakhButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`
        relative px-8 py-3 font-title text-sm tracking-widest uppercase
        border-2 transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isPrimary
          ? 'bg-[var(--steppe-gold)] border-[var(--steppe-gold)] text-[#0a0e1a] hover:bg-amber-400'
          : 'bg-transparent border-[var(--steppe-gold)] text-[var(--steppe-gold)] hover:bg-[var(--steppe-gold)]/10'
        }
        ${className}
      `}
    >
      {/* Угловые орнаменты */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current -translate-x-[2px] -translate-y-[2px]" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current translate-x-[2px] -translate-y-[2px]" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current -translate-x-[2px] translate-y-[2px]" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current translate-x-[2px] translate-y-[2px]" />

      {children}
    </motion.button>
  )
}
