import { Team } from '@/lib/store/types'

// Цепь нужна минимум из 2 человек — при 1 игроке нет цепи
export function checkWinCondition(playerTeam: Team, enemyTeam: Team): 'player' | 'enemy' | null {
  if (enemyTeam.players.length <= 1) return 'player'
  if (playerTeam.players.length <= 1) return 'enemy'
  return null
}
