'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import KazakhButton from '@/components/shared/KazakhButton'
import KazakhOrnament from '@/components/shared/KazakhOrnament'
import dynamic from 'next/dynamic'
import { useGameStore } from '@/lib/store/gameStore'
import { Difficulty } from '@/lib/game/difficulty'
import { WeatherType, resolveWeather } from '@/lib/game/weatherSystem'
import { useTranslation } from '@/lib/i18n/useTranslation'

const PreviewScene = dynamic(() => import('@/components/scene/PreviewScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0e1a]" />,
})

export default function Hero() {
  const router = useRouter()
  const { t } = useTranslation()
  const setOpponentType = useGameStore((state) => state.setOpponentType)
  const difficulty = useGameStore((state) => state.difficulty)
  const setDifficulty = useGameStore((state) => state.setDifficulty)
  const weather = useGameStore((state) => state.weather)
  const setWeather = useGameStore((state) => state.setWeather)
  const setGameMode = useGameStore((state) => state.setGameMode)
  const setTournamentStage = useGameStore((state) => state.setTournamentStage)

  useEffect(() => {
    const saved = window.localStorage.getItem('akserek-difficulty')
    if (saved === 'easy' || saved === 'normal' || saved === 'hard' || saved === 'impossible') {
      setDifficulty(saved)
    }
    const savedWeather = window.localStorage.getItem('akserek-weather')
    if (savedWeather === 'random' || savedWeather === 'sunny' || savedWeather === 'rain' || savedWeather === 'fog' || savedWeather === 'night' || savedWeather === 'storm') {
      setWeather(savedWeather)
    }
  }, [setDifficulty, setWeather])

  const startGame = (opponentType: 'bot' | 'openai') => {
    if (weather === 'random') setWeather(resolveWeather('random'))
    setOpponentType(opponentType)
    setGameMode(opponentType === 'openai' ? 'ai' : 'single')
    router.push('/game')
  }

  const startTournament = () => {
    if (weather === 'random') setWeather(resolveWeather('random'))
    setGameMode('tournament')
    setOpponentType('bot')
    setTournamentStage('quarter')
    setDifficulty('normal')
    router.push('/game')
  }

  const difficulties: Array<{
    id: Difficulty
    labelKey: string
    descriptionKey: string
  }> = [
    { id: 'easy', labelKey: 'difficulty.easy', descriptionKey: 'difficulty.easyDescription' },
    { id: 'normal', labelKey: 'difficulty.normal', descriptionKey: 'difficulty.normalDescription' },
    { id: 'hard', labelKey: 'difficulty.hard', descriptionKey: 'difficulty.hardDescription' },
    { id: 'impossible', labelKey: 'difficulty.impossible', descriptionKey: 'difficulty.impossibleDescription' },
  ]
  const difficultyDot: Record<Difficulty, string> = {
    easy: 'bg-green-400',
    normal: 'bg-yellow-400',
    hard: 'bg-orange-500',
    impossible: 'bg-red-500',
  }
  const weatherOptions: Array<{ id: WeatherType; label: string }> = [
    { id: 'random', label: 'weather.random' },
    { id: 'sunny', label: 'weather.sunny' },
    { id: 'rain', label: 'weather.rain' },
    { id: 'fog', label: 'weather.fog' },
    { id: 'night', label: 'weather.night' },
    { id: 'storm', label: 'weather.storm' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      {/* 3D степь на фоне */}
      <div className="absolute inset-0 z-0">
        <PreviewScene />
      </div>

      {/* Градиенты для читаемости без перекрытия всей сцены */}
      <div className="absolute inset-y-0 left-0 z-10 w-full bg-gradient-to-r from-[#05070d]/95 via-[#05070d]/70 to-transparent lg:w-[68%]" />
      <div className="absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-[#05070d]/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0e1a] to-transparent z-10" />

      {/* Контент */}
      <div className="relative z-20 flex min-h-[calc(100vh-6rem)] items-end px-4 pb-24 pt-14 sm:px-8 lg:items-center lg:pb-12">
        <div className="max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <KazakhOrnament className="mb-7 h-6 w-64 max-w-full text-[var(--steppe-gold)]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-kazakh text-sm font-semibold uppercase tracking-[0.3em] text-[var(--steppe-gold)]"
          >
            {t('landing.subtitle')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4 }}
            className="mt-4 font-kazakh text-4xl font-bold uppercase leading-[1.05] tracking-[0.12em] text-white sm:text-6xl lg:text-7xl"
          >
            {t('landing.titleLine1')}
            <span className="mt-2 block text-[var(--steppe-gold)]">{t('landing.titleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 max-w-lg text-base leading-8 text-white/78 sm:text-lg"
          >
            {t('landing.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8"
          >
            <div className="grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
              {difficulties.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDifficulty(item.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    difficulty === item.id
                      ? 'border-[var(--steppe-gold)] bg-black/55'
                      : 'border-white/15 bg-black/30 hover:border-white/35'
                  }`}
                >
                  <span className="flex items-center gap-2 font-title text-sm uppercase tracking-widest text-white">
                    <span className={`h-2.5 w-2.5 rounded-full ${difficultyDot[item.id]}`} />
                    {t(item.labelKey)}
                  </span>
                  <span className="mt-1 block font-body text-xs leading-relaxed text-white/62">
                    {t(item.descriptionKey)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex max-w-2xl flex-wrap gap-2">
              {weatherOptions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWeather(item.id)}
                  className={`rounded border px-3 py-1.5 font-body text-xs transition-colors ${
                    weather === item.id
                      ? 'border-[var(--steppe-gold)] bg-[var(--steppe-gold)]/15 text-[var(--steppe-gold)]'
                      : 'border-white/15 bg-black/30 text-white/65 hover:border-white/35'
                  }`}
                >
                  {t(item.label)}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <KazakhButton onClick={() => startGame('bot')} variant="primary">
                {t('landing.normalGame')}
              </KazakhButton>
              <KazakhButton onClick={() => startGame('openai')} variant="primary">
                {t('landing.playWithAi')}
              </KazakhButton>
              <KazakhButton onClick={startTournament} variant="primary">
                {t('landing.tournament')}
              </KazakhButton>
              <KazakhButton onClick={() => router.push('/menu')} variant="secondary">
                {t('nav.menu')}
              </KazakhButton>
              <KazakhButton
                onClick={() => {
                  document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })
                }}
                variant="secondary"
              >
                {t('landing.rules')}
              </KazakhButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-gray-400 text-xs font-body">↓</span>
        <span className="text-gray-400 text-xs font-body">{t('landing.rules')}</span>
      </motion.div>
    </div>
  )
}
