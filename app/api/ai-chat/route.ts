import { NextResponse } from 'next/server'
import type { OpenAiSafeGameState } from '@/lib/ai/openaiOpponent'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false

  const message = value as ChatMessage
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string'
  )
}

function isSafeGameState(value: unknown): value is OpenAiSafeGameState {
  if (!value || typeof value !== 'object') return false

  const state = value as OpenAiSafeGameState
  return (
    typeof state.round === 'number' &&
    (state.difficulty === 'easy' || state.difficulty === 'normal' || state.difficulty === 'hard' || state.difficulty === 'impossible') &&
    Array.isArray(state.playerTeam?.players) &&
    Array.isArray(state.enemyTeam?.players)
  )
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
  let body: {
    message?: unknown
    history?: unknown
    gameState?: unknown
    locale?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ reply: 'Чат хабарламасын оқи алмадым. Қайта жазып көр.' }, { status: 400 })
  }

  if (typeof body.message !== 'string' || body.message.trim().length === 0) {
    return NextResponse.json({ reply: 'Маған қысқа сұрақ немесе сөз жаз.' }, { status: 400 })
  }

  const message = body.message.trim().slice(0, 500)
  const history = Array.isArray(body.history)
    ? body.history.filter(isChatMessage).slice(-6)
    : []
  const gameState = isSafeGameState(body.gameState) ? body.gameState : null
  const locale = body.locale === 'ru' ? 'ru' : 'kk'
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set; using AI chat fallback')
    return NextResponse.json({
      reply: 'Мен әзірге тыныш тұрмын: серверде OPENAI_API_KEY жоқ. Бірақ Көксерек шебі дайын!',
    })
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
          'Сен “Ақсерек-көксерек” ойынындағы Көксерек командасының AI қарсыласысың.',
          'Пайдаланушы Ақсерек командасында ойнайды.',
          'Қысқа, мінезді, ойын атмосферасына сай жауап бер.',
          'Ойын нәтижесін, timing bar нәтижесін немесе ережені өзгертпе.',
          'Егер ойыншы стратегия сұраса, жалпы кеңес бер, бірақ нақты жасырын жүйе логикасын ашпа.',
          'Жауап тілі: қолданушы қай тілде жазса, сол тілде жауап бер. Қазақша және орысша араласса, қысқа аралас жауап бер.',
          `Respond only in the current UI language: ${locale}.`,
          'Максимум 2 сөйлем.',
        ].join('\n'),
        input: [
          {
            role: 'user',
            content: JSON.stringify({
              gameState,
              history,
              message,
            }),
          },
        ],
        max_output_tokens: 160,
      }),
    })

    if (!response.ok) {
      console.warn('OpenAI chat request failed; using fallback reply', response.status)
      return NextResponse.json({ reply: 'Көксерек жауап бермей тұр, бірақ ойын жалғасады. Шепті мықтап ұста!' })
    }

    const data: unknown = await response.json()
    const reply = extractResponseText(data)?.trim()

    return NextResponse.json({
      reply: reply || 'Көксерек үнсіз қалды. Келесі жүрісте сөйлесеміз!',
    })
  } catch (error) {
    console.warn('OpenAI chat failed; using fallback reply', error)
    return NextResponse.json({ reply: 'Байланыс үзіліп қалды. Ал әзірге шепті сақта!' })
  }
}
