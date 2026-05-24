'use client'

import MobileBottomSheet from './MobileBottomSheet'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useGameStore } from '@/lib/store/gameStore'

export default function MobileSettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { isVoiceEnabled, volume, setVoiceEnabled, setVolume } = useGameStore()

  return (
    <MobileBottomSheet open={open} title={t('nav.menu')} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/50">{t('nav.rules')}</p>
          <LanguageSwitcher />
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/50">{isVoiceEnabled ? t('game.mute') : t('game.unmute')}</p>
          <button
            onClick={() => setVoiceEnabled(!isVoiceEnabled)}
            className="min-h-12 w-full rounded-lg border border-[var(--steppe-gold)]/45 px-4 text-left text-[var(--steppe-gold)]"
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
            className="mt-4 w-full accent-[var(--steppe-gold)]"
          />
        </div>
      </div>
    </MobileBottomSheet>
  )
}
