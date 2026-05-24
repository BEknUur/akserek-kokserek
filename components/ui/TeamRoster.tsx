'use client'

import { motion } from 'framer-motion'
import { Team } from '@/lib/store/types'
import PlayerCard from './PlayerCard'

interface TeamRosterProps {
  team: Team
}

export default function TeamRoster({ team }: TeamRosterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute bottom-6 left-4 z-40 w-44"
    >
      <div className="bg-[var(--ui-bg)] border border-blue-500/40 rounded-lg p-2">
        <div className="flex items-center justify-between mb-2">
          <p className="font-title text-blue-400 text-xs tracking-wider">
            {team.name}
          </p>
          <span className="text-gray-400 text-xs font-body">{team.players.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          {team.players.map((p) => (
            <PlayerCard key={p.id} player={p} size="sm" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
