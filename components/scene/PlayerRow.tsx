'use client'

import { Team, Player as PlayerType } from '@/lib/store/types'
import Player from './Player'

interface PlayerRowProps {
  team: Team
  zOffset: number
  highlightedId?: string
  runnerId?: string       // этот игрок скрыт из ряда (он бежит отдельно)
  onPlayerClick?: (player: PlayerType) => void
}

export default function PlayerRow({
  team,
  zOffset,
  highlightedId,
  runnerId,
  onPlayerClick,
}: PlayerRowProps) {
  // Показываем только тех, кто НЕ бежит прямо сейчас
  const visiblePlayers = team.players.filter(p => p.id !== runnerId)
  const count = visiblePlayers.length

  return (
    <group>
      {visiblePlayers.map((player, i) => {
        const x = (i - (count - 1) / 2) * 2
        return (
          <group key={player.id} position={[x, 0, zOffset]}>
            <Player
              player={player}
              isHighlighted={player.id === highlightedId}
              onClick={onPlayerClick ? () => onPlayerClick(player) : undefined}
            />
          </group>
        )
      })}
    </group>
  )
}
