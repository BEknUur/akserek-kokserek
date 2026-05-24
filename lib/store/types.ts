export type GamePhase =
  | 'LANDING'
  | 'TUTORIAL'
  | 'SETUP'
  | 'ENEMY_CRY'
  | 'ENEMY_CHOOSES'
  | 'PLAYER_RUNS'
  | 'BREAKTHROUGH_ANIM'   // промежуточная: анимация прорыва/отскока
  | 'RESULT'
  | 'COMMENTARY'
  | 'PLAYER_CHOOSES'
  | 'ENEMY_RUNS'
  | 'GAME_OVER'

export interface Player {
  id: string
  name: string
  kush: number        // Күш: сила прорыва (1-10)
  karsylyk: number    // Қарсылық: сопротивление (1-10)
  description: string
  isCaptain: boolean
  team: 'blue' | 'red'
  position: number
}

export interface Team {
  name: string
  players: Player[]
  color: 'blue' | 'red'
}

export interface BreakthroughResult {
  success: boolean
  power: number
  required: number
  capturedPlayer?: Player
}

export interface GameState {
  phase: GamePhase
  playerTeam: Team
  enemyTeam: Team
  round: number
  currentRunner?: Player
  currentTarget?: { left: Player; right: Player }
  lastResult?: BreakthroughResult
  commentaryText: string
  subtitleText: string
  isCommentaryLoading: boolean
  highlights: string[]
}
