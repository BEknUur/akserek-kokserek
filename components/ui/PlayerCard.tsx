'use client'

import { motion } from 'framer-motion'
import { Player } from '@/lib/store/types'

interface PlayerCardProps {
  player: Player
  isHighlighted?: boolean
  isClickable?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function PlayerCard({
  player,
  isHighlighted,
  isClickable,
  onClick,
  size = 'sm',
}: PlayerCardProps) {
  const teamColor = player.team === 'blue' ? 'border-blue-500' : 'border-red-500'
  const highlightBg = isHighlighted ? 'bg-[var(--steppe-gold)]/20 border-[var(--steppe-gold)]' : `bg-[var(--ui-bg)] ${teamColor}/40`

  return (
    <motion.div
      onClick={isClickable ? onClick : undefined}
      whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
      className={`
        relative border rounded-lg transition-colors duration-200
        ${size === 'sm' ? 'p-2' : 'p-3'}
        ${highlightBg}
        ${isClickable ? 'cursor-pointer' : ''}
        ${isHighlighted ? 'shadow-[0_0_12px_rgba(255,215,0,0.4)]' : ''}
      `}
    >
      {/* Капитанская звезда */}
      {player.isCaptain && (
        <span className="absolute -top-1.5 -right-1.5 text-[var(--steppe-gold)] text-xs">★</span>
      )}

      {/* Имя */}
      <p className={`font-kazakh text-white font-semibold truncate ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {player.name}
      </p>

      {/* Статы */}
      <div className="flex gap-2 mt-1">
        <div className="flex items-center gap-0.5">
          <span className="text-blue-400 text-[10px]">⚡</span>
          <span className="text-blue-300 text-[10px] font-body">{player.kush}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-red-400 text-[10px]">🛡</span>
          <span className="text-red-300 text-[10px] font-body">{player.karsylyk}</span>
        </div>
      </div>
    </motion.div>
  )
}
