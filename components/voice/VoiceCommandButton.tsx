'use client'

import { useEffect, useState } from 'react'
import { createSpeechCommandRecognizer, isSpeechRecognitionSupported, VoiceCommand } from '@/lib/voice/speechRecognition'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function VoiceCommandButton({ onCommand }: { onCommand: (command: VoiceCommand) => void }) {
  const { t } = useTranslation()
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported())
  }, [])

  if (!supported) return null

  const start = () => {
    const recognition = createSpeechCommandRecognizer((command) => {
      onCommand(command)
      setListening(false)
    })
    if (!recognition) return
    recognition.onend = () => setListening(false)
    setListening(true)
    recognition.start()
  }

  return (
    <button
      type="button"
      onClick={start}
      title="Ақсерек, Көксерек, Шабуыл, Алға"
      className={`absolute left-4 top-24 z-40 rounded-lg border px-3 py-2 font-body text-xs pointer-events-auto ${
        listening
          ? 'border-green-400/70 bg-green-900/50 text-green-100'
          : 'border-[var(--steppe-gold)]/45 bg-black/55 text-[var(--steppe-gold)]'
      }`}
    >
      {listening ? t('game.listening') : t('game.voice')}
    </button>
  )
}
