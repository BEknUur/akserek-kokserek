'use client'

import { motion } from 'framer-motion'
import { Team, Player } from '@/lib/store/types'
import PlayerCard from './PlayerCard'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface TeamRosterProps {
  team: Team
  isSelectable?: boolean
  selectedId?: string     // выделить уже выбранного
  onSelect?: (player: Player) => void
}

export default function TeamRoster({ team, isSelectable, selectedId, onSelect }: TeamRosterProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`absolute bottom-6 left-4 z-40 w-44 ${isSelectable ? 'pointer-events-auto' : ''}`}
    >
      <div className={`bg-[var(--ui-bg)] border rounded-lg p-2 ${isSelectable ? 'border-[var(--steppe-gold)]/60' : 'border-blue-500/40'}`}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-title text-blue-400 text-xs tracking-wider">{team.color === 'blue' ? t('teams.akserek') : team.name}</p>
          <span className="text-gray-400 text-xs font-body">{team.players.length}</span>
        </div>
        {isSelectable && (
          <p className="text-[var(--steppe-gold)] text-[10px] font-body mb-1.5 text-center">
            ↑ {t('game.chooseOwnPlayer')}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {team.players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              size="sm"
              isHighlighted={p.id === selectedId}
              isClickable={isSelectable}
              onClick={() => onSelect?.(p)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
