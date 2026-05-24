import { BreakthroughResult, Player, Team } from '@/lib/store/types'
import { Difficulty } from '@/lib/game/difficulty'

export type AiMove = {
  runnerId: string
  targetLeftId: string
  targetRightId: string
  strategy: string
  taunt: string
}

type SafePlayer = Pick<Player, 'id' | 'name' | 'kush' | 'karsylyk'>

export type OpenAiSafeGameState = {
  round: number
  playerTeam: {
    players: SafePlayer[]
  }
  enemyTeam: {
    players: SafePlayer[]
  }
  lastResult?: Pick<BreakthroughResult, 'mode' | 'success' | 'message'> | null
  difficulty: Difficulty
}

export function toOpenAiSafeGameState(params: {
  round: number
  playerTeam: Team
  enemyTeam: Team
  lastResult?: BreakthroughResult
  difficulty?: Difficulty
}): OpenAiSafeGameState {
  const mapPlayer = ({ id, name, kush, karsylyk }: Player): SafePlayer => ({
    id,
    name,
    kush,
    karsylyk,
  })

  return {
    round: params.round,
    playerTeam: {
      players: params.playerTeam.players.map(mapPlayer),
    },
    enemyTeam: {
      players: params.enemyTeam.players.map(mapPlayer),
    },
    lastResult: params.lastResult
      ? {
          mode: params.lastResult.mode,
          success: params.lastResult.success,
          message: params.lastResult.message,
        }
      : null,
    difficulty: params.difficulty ?? 'normal',
  }
}

function isValidAiMove(value: unknown): value is AiMove {
  if (!value || typeof value !== 'object') return false

  const move = value as Partial<Record<keyof AiMove, unknown>>
  return (
    typeof move.runnerId === 'string' &&
    typeof move.targetLeftId === 'string' &&
    typeof move.targetRightId === 'string' &&
    typeof move.strategy === 'string' &&
    typeof move.taunt === 'string'
  )
}

export async function getOpenAiMove(gameState: OpenAiSafeGameState): Promise<AiMove> {
  const response = await fetch('/api/openai-move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameState),
  })

  if (!response.ok) {
    throw new Error(`OpenAI move request failed with ${response.status}`)
  }

  const data: unknown = await response.json()
  if (!isValidAiMove(data)) {
    throw new Error('OpenAI move response is not a valid AiMove')
  }

  return data
}
