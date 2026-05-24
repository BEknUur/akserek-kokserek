import { GamePhase, Team } from '@/lib/store/types'

export function checkWinCondition(playerTeam: Team, enemyTeam: Team): 'player' | 'enemy' | null {
  // Цепь нужна минимум из 2 человек — при 1 игроке нет цепи → команда проигрывает
  if (enemyTeam.players.length <= 1) return 'player'
  if (playerTeam.players.length <= 1) return 'enemy'
  return null
}

export function getNextPhaseAfterResult(
  resultIsPlayerTurn: boolean,
  winner: 'player' | 'enemy' | null
): GamePhase {
  if (winner) return 'GAME_OVER'
  // После хода игрока → ход врага (ENEMY_CRY)
  // После хода врага → ход игрока (PLAYER_CHOOSES)
  return resultIsPlayerTurn ? 'ENEMY_CRY' : 'PLAYER_CHOOSES'
}

// Задержки между фазами (мс)
export const PHASE_DELAYS: Partial<Record<GamePhase, number>> = {
  ENEMY_CRY:      2500,
  ENEMY_CHOOSES:  2000,
  RESULT:         2200,
  COMMENTARY:     0,     // ждём пока юзер закроет
  SETUP:          500,
}
