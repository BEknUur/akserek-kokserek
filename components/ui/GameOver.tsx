'use client'

import { motion } from 'framer-motion'
import KazakhButton from '@/components/shared/KazakhButton'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface GameOverProps {
  won: boolean
  playerTeamName: string
  enemyTeamName: string
  onRestart: () => void
}

export default function GameOver({ won, playerTeamName, enemyTeamName, onRestart }: GameOverProps) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-[var(--ui-bg)] border-2 border-[var(--steppe-gold)]/60 rounded-2xl p-10 text-center max-w-md w-full mx-4"
      >
        {/* Эмодзи результата */}
        <div className="text-6xl mb-4">
          {won ? '🏆' : '😔'}
        </div>

        {/* Заголовок */}
        <h1 className="font-title text-3xl mb-2" style={{ color: won ? 'var(--steppe-gold)' : '#f87171' }}>
          {won ? t('game.victory') : t('game.defeat')}
        </h1>
        <p className="text-gray-300 font-body text-lg mb-1">
          {t('game.gameOver')}
        </p>
        <p className="text-gray-500 text-sm font-body mb-8">
          {won
            ? `${t('teams.akserek') || playerTeamName}: ${t('game.victory')}`
            : `${enemyTeamName}: ${t('game.defeat')}`
          }
        </p>

        {/* Орнаментальный разделитель */}
        <div className="flex items-center gap-3 mb-8 opacity-40">
          <div className="flex-1 h-px bg-[var(--steppe-gold)]" />
          <span className="text-[var(--steppe-gold)] text-lg">✦</span>
          <div className="flex-1 h-px bg-[var(--steppe-gold)]" />
        </div>

        <KazakhButton onClick={onRestart} variant="primary">
          {t('game.restart')}
        </KazakhButton>
      </motion.div>
    </div>
  )
}
