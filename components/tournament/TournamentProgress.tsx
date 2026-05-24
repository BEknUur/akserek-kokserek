'use client'

import KazakhButton from '@/components/shared/KazakhButton'
import TournamentBracket from './TournamentBracket'
import { useGameStore } from '@/lib/store/gameStore'
import { getTournamentDifficulty } from '@/lib/game/tournament'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function TournamentProgress({ onContinue }: { onContinue: () => void }) {
  const { t, locale } = useTranslation()
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
          {t('tournament.title')}
        </p>
        <h2 className="mt-2 font-title text-3xl text-white">
          {completed ? t('tournament.completed') : t(`tournament.${tournamentStage}`)}
        </h2>
        <p className="mt-2 font-body text-sm text-white/65">
          {completed
            ? t('tournament.completedText')
            : `${t('tournament.nextDifficulty')}: ${t(`difficulty.${getTournamentDifficulty(tournamentStage)}`)}`}
        </p>

        <div className="my-6">
          <TournamentBracket stage={tournamentStage} />
        </div>

        {completed ? (
          <KazakhButton
            variant="primary"
            onClick={() => setCommentary(locale === 'kk' ? 'Бүгін Ақсерек даланың даңқын асырды. Бұл жеңіс ел есінде қалады!' : 'Сегодня Аксерек прославил степь. Эта победа останется в памяти!')}
          >
            {t('tournament.finalSpeech')}
          </KazakhButton>
        ) : (
          <KazakhButton variant="primary" onClick={handleContinue}>
            {t('tournament.nextMatch')}
          </KazakhButton>
        )}
      </div>
    </div>
  )
}
