'use client'

import KazakhButton from '@/components/shared/KazakhButton'
import TournamentBracket from './TournamentBracket'
import { useGameStore } from '@/lib/store/gameStore'
import { getTournamentDifficulty, TOURNAMENT_STAGES } from '@/lib/game/tournament'

export default function TournamentProgress({ onContinue }: { onContinue: () => void }) {
  const { tournamentStage, setDifficulty, setCommentary } = useGameStore()
  const completed = tournamentStage === 'completed'

  const handleContinue = () => {
    if (!completed) setDifficulty(getTournamentDifficulty(tournamentStage))
    onContinue()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/78 px-4">
      <div className="w-full max-w-xl rounded-xl border border-[var(--steppe-gold)]/60 bg-[var(--ui-bg)] p-7 text-center shadow-2xl">
        <p className="font-kazakh text-sm uppercase tracking-[0.3em] text-[var(--steppe-gold)]">
          Tournament Mode
        </p>
        <h2 className="mt-2 font-title text-3xl text-white">
          {completed ? 'Чемпион!' : `${TOURNAMENT_STAGES[tournamentStage].label} unlocked`}
        </h2>
        <p className="mt-2 font-body text-sm text-white/65">
          {completed
            ? 'Ақсерек барлық кезеңнен өтті. Аташка жеңіс жырын бастайды.'
            : `Next match difficulty: ${getTournamentDifficulty(tournamentStage).toUpperCase()}`}
        </p>

        <div className="my-6">
          <TournamentBracket stage={tournamentStage} />
        </div>

        {completed ? (
          <KazakhButton
            variant="primary"
            onClick={() => setCommentary('Бүгін Ақсерек даланың даңқын асырды. Бұл жеңіс ел есінде қалады!')}
          >
            Финальная речь
          </KazakhButton>
        ) : (
          <KazakhButton variant="primary" onClick={handleContinue}>
            Келесі матч
          </KazakhButton>
        )}
      </div>
    </div>
  )
}
