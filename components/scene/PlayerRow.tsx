'use client'

import { Team, Player as PlayerType } from '@/lib/store/types'
import Player from './Player'

interface PlayerRowProps {
  team: Team
  zOffset: number
  highlightedId?: string
  runnerId?: string
  onPlayerClick?: (player: PlayerType) => void
}

export default function PlayerRow({
  team,
  zOffset,
  highlightedId,
  runnerId,
  onPlayerClick,
}: PlayerRowProps) {
  const count = team.players.length

  return (
    <group>
      {team.players.map((player, i) => {
        const x = (i - (count - 1) / 2) * 2
        return (
          <group key={player.id} position={[x, 0, zOffset]}>
            <Player
              player={player}
              isHighlighted={player.id === highlightedId}
              isRunner={player.id === runnerId}
              onClick={onPlayerClick ? () => onPlayerClick(player) : undefined}
            />
          </group>
        )
      })}
    </group>
  )
}
