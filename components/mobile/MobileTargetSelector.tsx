'use client'

import { Team, Player } from '@/lib/store/types'

export default function MobileTargetSelector({
  team,
  onSelect,
}: {
  team: Team
  onSelect: (target: Player) => void
}) {
  const pairs = team.players.slice(0, -1).map((left, index) => ({
    left,
    right: team.players[index + 1],
  }))

  return (
    <div className="grid gap-2">
      {pairs.map(({ left, right }) => (
        <button
          key={`${left.id}-${right.id}`}
          onClick={() => onSelect(left)}
          className="rounded-xl border border-white/15 bg-white/8 px-4 py-4 text-left active:border-[var(--steppe-gold)]"
        >
          <p className="font-kazakh text-base font-semibold text-white">
            {left.name} + {right.name}
          </p>
          <p className="mt-1 text-xs text-white/50">
            🛡 {left.karsylyk + right.karsylyk} · ⚡ {left.kush + right.kush}
          </p>
        </button>
      ))}
    </div>
  )
}
