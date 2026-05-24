'use client'

import { TournamentStage } from '@/lib/game/tournament'

const STAGES: Array<{ id: TournamentStage; label: string }> = [
  { id: 'quarter', label: 'Quarter Final' },
  { id: 'semi', label: 'Semi Final' },
  { id: 'final', label: 'Grand Final' },
]

export default function TournamentBracket({ stage }: { stage: TournamentStage }) {
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
            <p className="font-title text-sm text-white">{item.label}</p>
            <p className="font-body text-xs text-white/50">{done ? 'Won' : active ? 'Current match' : 'Locked'}</p>
          </div>
        )
      })}
    </div>
  )
}
