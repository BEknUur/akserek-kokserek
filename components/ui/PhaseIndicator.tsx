'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GamePhase } from '@/lib/store/types'

const PHASE_LABELS: Partial<Record<GamePhase, { kz: string; ru: string }>> = {
  SETUP:             { kz: 'Дайындалуда...', ru: 'Подготовка...' },
  PLAYER_CHOOSES:    { kz: 'Сенің кезің!',   ru: 'Твой ход' },
  PLAYER_RUNS:       { kz: 'ЖАРЫП ӨТ!',      ru: 'ПРОРЫВАЙСЯ!' },
  BOT_CHOOSING:      { kz: 'Бот таңдайды...', ru: 'Бот выбирает...' },
  ENEMY_RUNS:        { kz: 'ЦЕП ҰСТА!',      ru: 'ДЕРЖИ ЦЕПЬ!' },
  BREAKTHROUGH_ANIM: { kz: 'ЖАРЫП ӨТУДЕ...', ru: 'Прорыв!' },
  RESULT:            { kz: 'Нәтиже',          ru: 'Результат' },
  GAME_OVER:         { kz: 'ОЙЫН АЯҚТАЛДЫ',  ru: 'Игра окончена' },
}

interface PhaseIndicatorProps {
  phase: GamePhase
  round: number
}

export default function PhaseIndicator({ phase, round }: PhaseIndicatorProps) {
  const label = PHASE_LABELS[phase]
  if (!label) return null

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div key={phase}
          initial={{ opacity: 0, y: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="bg-[var(--ui-bg)] border border-[var(--steppe-gold)]/40 rounded-lg px-5 py-2">
          <p className="font-title text-[var(--steppe-gold)] text-xs tracking-widest uppercase">{label.kz}</p>
          <p className="text-gray-400 text-xs font-body mt-0.5">{label.ru}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-1.5 text-gray-500 text-xs font-body">Раунд {round}</div>
    </div>
  )
}
