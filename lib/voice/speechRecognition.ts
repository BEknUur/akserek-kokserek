export type VoiceCommand = 'Ақсерек' | 'Көксерек' | 'Шабуыл' | 'Алға'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const COMMANDS: VoiceCommand[] = ['Ақсерек', 'Көксерек', 'Шабуыл', 'Алға']

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function createSpeechCommandRecognizer(onCommand: (command: VoiceCommand) => void) {
  if (!isSpeechRecognitionSupported()) return null

  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!Recognition) return null

  const recognition = new Recognition()
  recognition.lang = 'kk-KZ'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript?.toLowerCase() ?? ''
    const command = COMMANDS.find((item) => transcript.includes(item.toLowerCase()))
    if (command) onCommand(command)
  }

  return recognition
}
