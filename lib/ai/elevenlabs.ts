const speechCache = new Map<string, string>()

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

export async function generateSpeech(text: string): Promise<string> {
  const normalized = normalizeText(text)
  if (!normalized) throw new Error('Cannot generate speech for empty text')

  const cachedUrl = speechCache.get(normalized)
  if (cachedUrl) return cachedUrl

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: normalized }),
  })

  if (!response.ok) {
    throw new Error(`TTS request failed with ${response.status}`)
  }

  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  speechCache.set(normalized, audioUrl)

  return audioUrl
}
