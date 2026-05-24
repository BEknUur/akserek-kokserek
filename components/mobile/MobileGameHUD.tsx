'use client'

import { useState } from 'react'
import { Player } from '@/lib/store/types'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useGameStore } from '@/lib/store/gameStore'
import MobileBottomSheet from './MobileBottomSheet'
import MobilePlayerSelector from './MobilePlayerSelector'
import MobileTargetSelector from './MobileTargetSelector'
import MobileSettingsDrawer from './MobileSettingsDrawer'
import Subtitles from '@/components/ui/Subtitles'

export default function MobileGameHUD({
  pendingRunner,
  setPendingRunner,
  onTargetSelect,
}: {
  pendingRunner: Player | null
  setPendingRunner: (player: Player | null) => void
  onTargetSelect: (player: Player) => void
}) {
  const { t } = useTranslation()
  const { phase, round, playerTeam, enemyTeam, subtitleText } = useGameStore()
  const [sheet, setSheet] = useState<'player' | 'target' | 'ours' | 'enemy' | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const shouldPickPlayer = phase === 'PLAYER_CHOOSES' && !pendingRunner
  const shouldPickTarget = phase === 'PLAYER_CHOOSES' && !!pendingRunner

  return (
    <div className="pointer-events-none absolute inset-0 z-50 lg:hidden">
      <div className="pointer-events-auto absolute left-3 right-3 top-3 rounded-xl border border-[var(--steppe-gold)]/35 bg-black/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-title text-xs uppercase tracking-widest text-[var(--steppe-gold)]">
              {t('game.round')} {round}
            </p>
            <p className="text-xs text-white/60">{phase}</p>
          </div>
          <p className="font-kazakh text-sm text-white">
            {t('teams.akserek')} {playerTeam.players.length} : {enemyTeam.players.length} {t('teams.kokserek')}
          </p>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded border border-white/15 px-3 py-2 text-xs text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {phase === 'PLAYER_CHOOSES' && (
        <div className="pointer-events-auto absolute bottom-20 left-3 right-3 flex gap-2">
          <button
            onClick={() => setSheet(shouldPickTarget ? 'target' : 'player')}
            className="min-h-12 flex-1 rounded-xl bg-[var(--steppe-gold)] px-4 font-title text-xs uppercase tracking-widest text-[#080b14]"
          >
            {shouldPickPlayer ? t('game.choosePlayer') : t('game.chooseTarget')}
          </button>
          <button onClick={() => setSheet('ours')} className="min-h-12 rounded-xl border border-blue-400/50 bg-black/65 px-3 text-xs text-blue-100">
            {t('teams.akserek')}
          </button>
          <button onClick={() => setSheet('enemy')} className="min-h-12 rounded-xl border border-red-400/50 bg-black/65 px-3 text-xs text-red-100">
            {t('teams.kokserek')}
          </button>
        </div>
      )}

      <div className="absolute bottom-32 left-4 right-4">
        <Subtitles text={subtitleText} />
      </div>

      <MobileBottomSheet open={sheet === 'player'} title={t('game.choosePlayer')} onClose={() => setSheet(null)}>
        <MobilePlayerSelector
          team={playerTeam}
          selectedId={pendingRunner?.id}
          onSelect={(player) => {
            setPendingRunner(player)
            setSheet('target')
          }}
        />
      </MobileBottomSheet>

      <MobileBottomSheet open={sheet === 'target'} title={t('game.chooseTarget')} onClose={() => setSheet(null)}>
        <MobileTargetSelector
          team={enemyTeam}
          onSelect={(player) => {
            onTargetSelect(player)
            setSheet(null)
          }}
        />
      </MobileBottomSheet>

      <MobileBottomSheet open={sheet === 'ours'} title={t('teams.akserek')} onClose={() => setSheet(null)}>
        <MobilePlayerSelector team={playerTeam} onSelect={() => undefined} />
      </MobileBottomSheet>

      <MobileBottomSheet open={sheet === 'enemy'} title={t('teams.kokserek')} onClose={() => setSheet(null)}>
        <MobilePlayerSelector team={enemyTeam} onSelect={() => undefined} />
      </MobileBottomSheet>

      <MobileSettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
