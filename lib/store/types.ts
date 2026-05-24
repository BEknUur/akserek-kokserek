export type GamePhase =
  | 'LANDING'
  | 'TEAM_SELECT'
  | 'SETUP'
  | 'PLAYER_CHOOSES'      // игрок выбирает runner + gap
  | 'PLAYER_RUNS'         // timing bar: ATTACK
  | 'BOT_CHOOSING'        // бот выбирает (автo 1.5s)
  | 'ENEMY_RUNS'          // timing bar: DEFENSE
  | 'BREAKTHROUGH_ANIM'   // анимация прорыва/отскока
  | 'RESULT'              // показ результата
  | 'GAME_OVER'

export interface Player {
  id: string
  name: string
  kush: number        // ⚡ сила атаки
  karsylyk: number    // 🛡 сила защиты
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
  mode: 'attack' | 'defense'
  success: boolean   // attack: прорыв удался | defense: цепь устояла
  message: string
  subMessage: string
  power: number
  required: number
  capturedPlayer?: Player
}

export interface GameState {
  phase: GamePhase
  playerTeam: Team
  enemyTeam: Team
  round: number
  opponentType: 'bot' | 'openai'
  currentRunner?: Player
  currentTarget?: { left: Player; right: Player }
  lastResult?: BreakthroughResult
  subtitleText: string
  commentaryText: string
  isCommentaryLoading: boolean
  isAiThinking: boolean
  aiCommentary: string
  isVoiceEnabled: boolean
  volume: number
  isSpeaking: boolean
  highlights: string[]
}
