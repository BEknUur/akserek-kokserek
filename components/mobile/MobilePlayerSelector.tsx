'use client'

import { Player, Team } from '@/lib/store/types'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function MobilePlayerSelector({
  team,
  selectedId,
  onSelect,
}: {
  team: Team
  selectedId?: string
  onSelect: (player: Player) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {team.players.map((player) => (
        <button
          key={player.id}
          onClick={() => onSelect(player)}
          className={`min-w-[150px] rounded-xl border p-4 text-left ${
            selectedId === player.id
              ? 'border-[var(--steppe-gold)] bg-[var(--steppe-gold)]/15'
              : 'border-white/15 bg-white/8'
          }`}
        >
          <p className="truncate font-kazakh text-base font-semibold text-white">{player.name}</p>
          <div className="mt-3 flex gap-3 text-sm">
            <span className="text-blue-300">⚡ {player.kush}</span>
            <span className="text-red-300">🛡 {player.karsylyk}</span>
          </div>
          <span className="mt-4 block rounded bg-[var(--steppe-gold)] px-3 py-2 text-center font-title text-xs uppercase tracking-widest text-[#080b14]">
            {t('game.tap')}
          </span>
        </button>
      ))}
    </div>
  )
}
