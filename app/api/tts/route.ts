import { NextResponse } from 'next/server'

const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'
let cachedKazakhVoiceId: string | null | undefined

type ElevenLabsVoice = {
  voice_id?: string
  name?: string
  category?: string
  labels?: Record<string, string>
  description?: string
  verified_languages?: Array<{
    language?: string
    locale?: string
    accent?: string
  }>
}

function voiceKazakhScore(voice: ElevenLabsVoice): number {
  const fields = [
    voice.name,
    voice.description,
    voice.category,
    ...Object.values(voice.labels ?? {}),
    ...(voice.verified_languages ?? []).flatMap((language) => [
      language.language,
      language.locale,
      language.accent,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  let score = 0
  if (fields.includes('kazakh')) score += 100
  if (fields.includes('қазақ')) score += 100
  if (fields.includes('kk')) score += 35
  if (fields.includes('kazakhstan')) score += 35
  if (fields.includes('male')) score += 12
  if (fields.includes('old') || fields.includes('elder') || fields.includes('senior')) score += 10
  if (fields.includes('narration') || fields.includes('story')) score += 8
  if (fields.includes('professional')) score += 6

  return score
}

async function searchKazakhVoice(apiKey: string): Promise<string | null> {
  if (cachedKazakhVoiceId !== undefined) return cachedKazakhVoiceId

  const searches = ['Kazakh male narration', 'Kazakh', 'Қазақ', 'Kazakhstan']

  for (const search of searches) {
    try {
      const url = new URL('https://api.elevenlabs.io/v2/voices')
      url.searchParams.set('page_size', '100')
      url.searchParams.set('search', search)
      url.searchParams.set('voice_type', 'non-default')

      const response = await fetch(url, {
        headers: {
          'xi-api-key': apiKey,
        },
      })

      if (!response.ok) {
        console.warn('ElevenLabs voice search failed', response.status)
        continue
      }

      const data: unknown = await response.json()
      const voices = data && typeof data === 'object' && Array.isArray((data as { voices?: unknown }).voices)
        ? (data as { voices: ElevenLabsVoice[] }).voices
        : []

      const bestVoice = voices
        .filter((voice) => typeof voice.voice_id === 'string')
        .map((voice) => ({ voice, score: voiceKazakhScore(voice) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)[0]?.voice

      if (bestVoice?.voice_id) {
        cachedKazakhVoiceId = bestVoice.voice_id
        console.info(`Using ElevenLabs Kazakh voice: ${bestVoice.name ?? bestVoice.voice_id}`)
        return cachedKazakhVoiceId
      }
    } catch (error) {
      console.warn('ElevenLabs Kazakh voice search failed', error)
    }
  }

  cachedKazakhVoiceId = null
  return null
}

export async function POST(request: Request) {
  let text: string

  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object' || typeof (body as { text?: unknown }).text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }
    text = (body as { text: string }).text.trim().slice(0, 900)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    console.warn('ELEVENLABS_API_KEY is not set; skipping TTS')
    return NextResponse.json({ error: 'TTS is not configured' }, { status: 503 })
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? await searchKazakhVoice(apiKey) ?? DEFAULT_VOICE_ID

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.72,
            similarity_boost: 0.78,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok || !response.body) {
      console.warn('ElevenLabs TTS request failed', response.status)
      return NextResponse.json({ error: 'TTS failed' }, { status: 503 })
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.warn('ElevenLabs TTS request failed', error)
    return NextResponse.json({ error: 'TTS failed' }, { status: 503 })
  }
}
