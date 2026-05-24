'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@/lib/store/types'
import { useGameStore } from '@/lib/store/gameStore'
import { DIFFICULTY_CONFIG } from '@/lib/game/difficulty'

export type TimingMode = 'attack' | 'defense'

interface TimingBarProps {
  mode: TimingMode
  runner: Player
  leftDefender: Player
  rightDefender: Player
  onHit: (power: number, hitGreen: boolean) => void
}

export default function TimingBar({ mode, runner, leftDefender, rightDefender, onHit }: TimingBarProps) {
  const difficulty = useGameStore((state) => state.difficulty)
  const config = DIFFICULTY_CONFIG[difficulty]
  const [cursorPos, setCursorPos] = useState(0)
  const [hit, setHit] = useState(false)
  const [showFlash, setShowFlash] = useState(true)
  const dirRef  = useRef(1)
  const posRef  = useRef(0)
  const rafRef  = useRef<number>(0)

  const isAttack = mode === 'attack'

  // Скорость курсора
  const baseSpeed = isAttack
    ? 0.4 + (runner.kush / 10) * 0.6          // атака: сила бегуна
    : 0.45 + (runner.kush / 10) * 0.55         // защита: сила атакующего бота
  const speed = baseSpeed * config.timingSpeed

  // Ширина зелёной зоны
  const chainAvg = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const baseGreenWidth = isAttack
    ? Math.max(18, 42 - chainAvg * 2)           // атака: зона уже при сильных защитниках
    : Math.max(15, chainAvg * 3.2)              // защита: зона шире при сильной цепи
  const greenWidth = Math.max(5, Math.min(34, baseGreenWidth * (config.greenZoneSize / 0.2)))
  const greenStart = 50 - greenWidth / 2

  useEffect(() => {
    const t = setTimeout(() => setShowFlash(false), 1100)
    return () => clearTimeout(t)
  }, [])

  const handleHit = useCallback(() => {
    if (hit) return
    setHit(true)
    cancelAnimationFrame(rafRef.current)
    const hitGreen = posRef.current >= greenStart && posRef.current <= greenStart + greenWidth
    onHit(posRef.current, hitGreen)
  }, [greenStart, greenWidth, hit, onHit])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleHit() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleHit])

  useEffect(() => {
    if (hit) return
    let last = performance.now()
    const animate = (now: number) => {
      const dt = Math.min((now - last) / 16, 3)
      last = now
      posRef.current += dirRef.current * speed * dt
      if (posRef.current >= 100) { posRef.current = 100; dirRef.current = -1 }
      if (posRef.current <= 0)   { posRef.current = 0;   dirRef.current = 1 }
      setCursorPos(posRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hit, speed])

  const inGreen = cursorPos >= greenStart && cursorPos <= greenStart + greenWidth

  const accentColor = isAttack ? 'var(--steppe-gold)' : '#f87171'
  const flashText   = isAttack ? 'ЖАРЫП ӨТ!'  : 'ЦЕП ҰСТА!'
  const flashSub    = isAttack ? `${runner.name} бежит на цепь!` : `${runner.name} атакует нашу цепь!`
  const barLabel    = isAttack ? `${runner.name} атакует!` : `Защити цепь от ${runner.name}!`

  return (
    <>
      {/* Вспышка */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="font-title text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]"
                 style={{ color: accentColor }}>
                {flashText}
              </p>
              <p className="text-white text-xl mt-2 font-body">{flashSub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Полоса */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[560px] max-w-[92vw] z-50">
        <div className="text-center mb-4">
          <span className="font-title text-base tracking-widest uppercase" style={{ color: accentColor }}>
            {barLabel}
          </span>
          <p className="text-white text-sm font-body mt-1.5 bg-black/60 inline-block px-3 py-1 rounded-full">
            Нажми{' '}
            <kbd className="px-2 py-0.5 rounded font-mono font-bold text-black"
                 style={{ background: accentColor }}>
              ПРОБЕЛ
            </kbd>{' '}
            в <span className="font-semibold" style={{ color: '#4ade80' }}>зелёной зоне</span>!
          </p>
        </div>

        <div
          className="relative h-14 bg-[#0a0e1a]/90 border-2 rounded-full overflow-hidden cursor-pointer"
          style={{ borderColor: `${accentColor}88`, boxShadow: `0 0 20px ${accentColor}22` }}
          onClick={handleHit}
        >
          {/* Зелёная зона */}
          <motion.div
            className="absolute top-0 h-full bg-green-500/60 rounded-full"
            style={{ left: `${greenStart}%`, width: `${greenWidth}%` }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 0.75, repeat: Infinity }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 text-green-200 text-[10px] font-bold pointer-events-none"
            style={{ left: `${greenStart + greenWidth / 2}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          >
            {isAttack ? '✓ СЮДА' : '🛡 ДЕРЖИ'}
          </div>

          {/* Курсор */}
          <motion.div
            className="absolute top-1.5 w-4 h-11 rounded-full shadow-xl"
            style={{
              left: `calc(${cursorPos}% - 8px)`,
              background: inGreen ? '#4ade80' : 'white',
              boxShadow: inGreen ? '0 0 16px #4ade80' : undefined,
            }}
            animate={inGreen ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: inGreen ? Infinity : 0 }}
          />
        </div>

        {/* Статы */}
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-body px-1">
          {isAttack ? (
            <>
              <span>⚡ Атака: <span className="text-blue-400 font-semibold">{runner.kush}</span></span>
              <span>🛡 Цепь: <span className="text-red-400">{leftDefender.name} + {rightDefender.name}</span></span>
              <span>🛡 Сила: <span className="text-red-400 font-semibold">{Math.round(chainAvg)}</span></span>
            </>
          ) : (
            <>
              <span>⚡ Бот: <span className="text-red-400 font-semibold">{runner.kush}</span></span>
              <span>🛡 Ваша цепь: <span className="text-blue-400">{leftDefender.name} + {rightDefender.name}</span></span>
              <span>🛡 Защита: <span className="text-blue-400 font-semibold">{Math.round(chainAvg)}</span></span>
            </>
          )}
        </div>
        <div className="mt-1 text-center font-body text-[10px] uppercase tracking-widest text-white/45">
          Difficulty: {difficulty}
        </div>
      </div>
    </>
  )
}
