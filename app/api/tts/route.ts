import { NextResponse } from 'next/server'

const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'

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

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID

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
