import { NextResponse } from 'next/server'
import type { AiMove, OpenAiSafeGameState } from '@/lib/ai/openaiOpponent'

type SafePlayer = OpenAiSafeGameState['playerTeam']['players'][number]

function fallbackMove(gameState: OpenAiSafeGameState): AiMove {
  const runner = [...gameState.enemyTeam.players].sort((a, b) => b.kush - a.kush)[0]
  const defenders = chooseWeakestAdjacentPair(gameState.playerTeam.players)

  return {
    runnerId: runner?.id ?? '',
    targetLeftId: defenders.left?.id ?? '',
    targetRightId: defenders.right?.id ?? defenders.left?.id ?? '',
    strategy: 'fallback_bot_logic',
    taunt: 'Бүгін сенің шебің сыналады!',
  }
}

function chooseWeakestAdjacentPair(players: SafePlayer[]): { left?: SafePlayer; right?: SafePlayer } {
  if (players.length === 0) return {}
  if (players.length === 1) return { left: players[0], right: players[0] }

  let bestIndex = 0
  let bestScore = Number.POSITIVE_INFINITY

  for (let i = 0; i < players.length - 1; i++) {
    const score = players[i].karsylyk + players[i + 1].karsylyk
    if (score < bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return { left: players[bestIndex], right: players[bestIndex + 1] }
}

function isSafeGameState(value: unknown): value is OpenAiSafeGameState {
  if (!value || typeof value !== 'object') return false

  const state = value as OpenAiSafeGameState
  return (
    typeof state.round === 'number' &&
    typeof state.difficulty === 'string' &&
    Array.isArray(state.playerTeam?.players) &&
    Array.isArray(state.enemyTeam?.players)
  )
}

function isAiMove(value: unknown): value is AiMove {
  if (!value || typeof value !== 'object') return false

  const move = value as AiMove
  return (
    typeof move.runnerId === 'string' &&
    typeof move.targetLeftId === 'string' &&
    typeof move.targetRightId === 'string' &&
    typeof move.strategy === 'string' &&
    typeof move.taunt === 'string'
  )
}

function validateMove(gameState: OpenAiSafeGameState, move: AiMove): boolean {
  const runnerExists = gameState.enemyTeam.players.some((player) => player.id === move.runnerId)
  const leftIndex = gameState.playerTeam.players.findIndex((player) => player.id === move.targetLeftId)
  const rightIndex = gameState.playerTeam.players.findIndex((player) => player.id === move.targetRightId)

  return runnerExists && leftIndex >= 0 && rightIndex === leftIndex + 1
}

function extractResponseText(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const response = data as {
    output_text?: unknown
    output?: Array<{
      content?: Array<{
        text?: unknown
      }>
    }>
  }

  if (typeof response.output_text === 'string') return response.output_text

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') return content.text
    }
  }

  return undefined
}

export async function POST(request: Request) {
  let gameState: OpenAiSafeGameState

  try {
    const body: unknown = await request.json()
    if (!isSafeGameState(body)) {
      return NextResponse.json({ error: 'Invalid game state' }, { status: 400 })
    }
    gameState = body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const fallback = fallbackMove(gameState)
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set; using fallback move')
    return NextResponse.json(fallback)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        instructions: [
          'Ты AI-соперник в казахской народной игре “Ақсерек-көксерек”.',
          'Ты играешь за команду “Көксерек”.',
          'Пользователь играет за “Ақсерек”.',
          '',
          'Твоя задача — выбрать лучший ход:',
          '1. Выбери одного игрока из своей команды как runner.',
          '2. Выбери двух соседних игроков из команды пользователя как цель для прорыва цепи.',
          '3. Играй стратегически:',
          '- ищи слабую цепь по низкому karsylyk;',
          '- иногда выбирай сильного runner по kush;',
          '- если проигрываешь, играй рискованнее;',
          '- если выигрываешь, играй осторожнее.',
          '4. Верни только JSON без markdown.',
        ].join('\n'),
        input: JSON.stringify(gameState),
        text: {
          format: {
            type: 'json_schema',
            name: 'ai_move',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['runnerId', 'targetLeftId', 'targetRightId', 'strategy', 'taunt'],
              properties: {
                runnerId: { type: 'string' },
                targetLeftId: { type: 'string' },
                targetRightId: { type: 'string' },
                strategy: { type: 'string' },
                taunt: { type: 'string' },
              },
            },
          },
        },
        max_output_tokens: 180,
      }),
    })

    if (!response.ok) {
      console.warn('OpenAI API request failed; using fallback move', response.status)
      return NextResponse.json(fallback)
    }

    const responseData: unknown = await response.json()
    const text = extractResponseText(responseData)
    const move: unknown = text ? JSON.parse(text) : null

    if (!isAiMove(move) || !validateMove(gameState, move)) {
      console.warn('OpenAI returned invalid move; using fallback move')
      return NextResponse.json(fallback)
    }

    return NextResponse.json(move)
  } catch (error) {
    console.warn('OpenAI move generation failed; using fallback move', error)
    return NextResponse.json(fallback)
  }
}
