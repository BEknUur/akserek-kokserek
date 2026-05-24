'use client'

import { useGameStore } from '@/lib/store/gameStore'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function VoiceControls() {
  const { t } = useTranslation()
  const {
    isVoiceEnabled,
    volume,
    isSpeaking,
    setVoiceEnabled,
    setVolume,
  } = useGameStore()

  return (
    <div className="absolute top-[116px] left-4 z-40 flex items-center gap-3 rounded-lg border border-[var(--steppe-gold)]/35 bg-black/55 px-3 py-2 pointer-events-auto backdrop-blur">
      <button
        type="button"
        onClick={() => setVoiceEnabled(!isVoiceEnabled)}
        className="rounded border border-[var(--steppe-gold)]/45 px-2 py-1 font-body text-xs text-[var(--steppe-gold)] transition-colors hover:bg-[var(--steppe-gold)]/10"
      >
        {isVoiceEnabled ? t('game.mute') : t('game.unmute')}
      </button>

      <input
        aria-label="Voice volume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        className="w-24 accent-[var(--steppe-gold)]"
      />

      {isSpeaking && isVoiceEnabled && (
        <span className="whitespace-nowrap font-kazakh text-xs text-white/80">
          🎤 {t('game.speaking')}
        </span>
      )}
    </div>
  )
}
