'use client'

import { TournamentStage } from '@/lib/game/tournament'
import { useTranslation } from '@/lib/i18n/useTranslation'

const STAGES: Array<{ id: TournamentStage; labelKey: string }> = [
  { id: 'quarter', labelKey: 'tournament.quarter' },
  { id: 'semi', labelKey: 'tournament.semi' },
  { id: 'final', labelKey: 'tournament.final' },
]

export default function TournamentBracket({ stage }: { stage: TournamentStage }) {
  const { t } = useTranslation()
  const order = ['quarter', 'semi', 'final', 'completed']
  const currentIndex = order.indexOf(stage)

  return (
    <div className="flex flex-col gap-2">
      {STAGES.map((item, index) => {
        const done = currentIndex > index
        const active = stage === item.id
        return (
          <div
            key={item.id}
            className={`rounded-lg border px-4 py-3 ${
              done ? 'border-green-400/50 bg-green-900/25' : active ? 'border-[var(--steppe-gold)]/70 bg-black/55' : 'border-white/15 bg-white/5'
            }`}
          >
            <p className="font-title text-sm text-white">{t(item.labelKey)}</p>
            <p className="font-body text-xs text-white/50">{done ? t('tournament.won') : active ? t('tournament.currentMatch') : t('tournament.locked')}</p>
          </div>
        )
      })}
    </div>
  )
}
