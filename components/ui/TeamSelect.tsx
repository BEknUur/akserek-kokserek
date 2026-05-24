'use client'

import { motion } from 'framer-motion'
import { TeamProfile, PROFILES } from '@/lib/game/fallbackContent'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface TeamSelectProps {
  onSelect: (profile: TeamProfile) => void
}

const CARDS: { profile: TeamProfile; icon: string; color: string; border: string }[] = [
  { profile: 'attack',   icon: '⚔️',  color: 'from-red-900/60 to-red-800/40',     border: 'border-red-500/60' },
  { profile: 'balanced', icon: '🏹',  color: 'from-amber-900/60 to-amber-800/40', border: 'border-amber-400/60' },
  { profile: 'defense',  icon: '🛡️',  color: 'from-blue-900/60 to-blue-800/40',   border: 'border-blue-500/60' },
]

export default function TeamSelect({ onSelect }: TeamSelectProps) {
  const { t, locale } = useTranslation()

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 w-full max-w-3xl"
      >
        {/* Заголовок */}
        <p className="font-kazakh text-[var(--steppe-gold)] text-sm tracking-widest uppercase mb-2">
          {t('game.selectTeam')}
        </p>
        <h2 className="font-title text-3xl text-white mb-1">{t('game.whoAreYou')}</h2>
        <p className="text-gray-400 text-sm font-body mb-8">{t('game.chooseStyle')}</p>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {CARDS.map(({ profile, icon, color, border }, i) => {
            const info = PROFILES[profile]
            return (
              <motion.button
                key={profile}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(profile)}
                className={`bg-gradient-to-b ${color} border ${border} rounded-xl p-5 text-left cursor-pointer`}
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-title text-white text-base mb-0.5">{locale === 'kk' ? info.label : info.labelRu}</h3>
                <p className="text-gray-400 text-xs font-body mb-4">{locale === 'kk' ? info.labelRu : info.label}</p>

                {/* Стат-бары */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-body mb-0.5">
                      <span className="text-blue-300">⚡ {t('game.kushStat')}</span>
                      <span className="text-blue-300">{info.kushRange[0]}–{info.kushRange[1]}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${(info.kushRange[1] / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-body mb-0.5">
                      <span className="text-red-300">🛡 {t('game.karsylykStat')}</span>
                      <span className="text-red-300">{info.karRange[0]}–{info.karRange[1]}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{ width: `${(info.karRange[1] / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <p className="text-gray-600 text-xs font-body">
          {t('game.statHint')}
        </p>
      </motion.div>
    </div>
  )
}
