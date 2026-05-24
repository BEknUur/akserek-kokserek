'use client'

import Spectator from './Spectator'
import { useGameStore } from '@/lib/store/gameStore'

export default function CrowdGroup({ performanceMode = false }: { performanceMode?: boolean }) {
  const { phase, lastResult, difficulty } = useGameStore()
  const reaction = phase === 'GAME_OVER'
    ? 'hype'
    : phase === 'RESULT' && lastResult?.success
      ? 'cheer'
      : phase === 'RESULT'
        ? 'disappointed'
        : difficulty === 'impossible' && (phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS')
          ? 'hype'
          : 'idle'

  const allSpectators = [
    [-11, -0.85, 9], [-13, -0.85, 11], [-15, -0.85, 8],
    [11, -0.85, 9], [13, -0.85, 11], [15, -0.85, 8],
    [-20, -0.85, -14], [-22, -0.85, -16], [22, -0.85, -13],
  ] as Array<[number, number, number]>
  const spectators = performanceMode ? allSpectators.slice(0, 4) : allSpectators
  const colors = ['#1f3b5f', '#7c2d2d', '#365f3a', '#6b4a2b', '#334155']

  return (
    <group>
      {spectators.map((position, index) => (
        <Spectator
          key={index}
          position={position}
          reaction={reaction}
          color={colors[index % colors.length]}
        />
      ))}
    </group>
  )
}
