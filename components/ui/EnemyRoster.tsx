'use client'

import { motion } from 'framer-motion'
import { Team, Player } from '@/lib/store/types'
import PlayerCard from './PlayerCard'

interface EnemyRosterProps {
  team: Team
  isSelectable?: boolean
  highlightedId?: string
  onSelect?: (player: Player) => void
}

export default function EnemyRoster({
  team,
  isSelectable,
  highlightedId,
  onSelect,
}: EnemyRosterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute bottom-6 right-4 z-40 w-44"
    >
      <div className={`bg-[var(--ui-bg)] border rounded-lg p-2 ${isSelectable ? 'border-[var(--steppe-gold)]/60' : 'border-red-500/40'}`}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-title text-red-400 text-xs tracking-wider">
            {team.name}
          </p>
          <span className="text-gray-400 text-xs font-body">{team.players.length}</span>
        </div>
        {isSelectable && (
          <p className="text-[var(--steppe-gold)] text-[10px] font-body mb-1.5 text-center">
            ↓ Выбери кого вызвать
          </p>
        )}
        <div className="flex flex-col gap-1">
          {team.players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              size="sm"
              isHighlighted={p.id === highlightedId}
              isClickable={isSelectable}
              onClick={() => onSelect?.(p)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
