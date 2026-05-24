'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@/lib/store/types'

interface BreakthroughBarProps {
  runner: Player
  leftDefender: Player
  rightDefender: Player
  onHit: (power: number) => void
}

export default function BreakthroughBar({
  runner,
  leftDefender,
  rightDefender,
  onHit,
}: BreakthroughBarProps) {
  const [cursorPos, setCursorPos] = useState(0)   // 0..100
  const [hit, setHit] = useState(false)
  const dirRef = useRef(1)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Скорость курсора зависит от kush бегуна (больше кush = быстрее)
  const speed = 0.4 + (runner.kush / 10) * 0.5   // 0.4–0.9 % за кадр

  // Ширина зелёной зоны зависит от слабости защитников
  const chainAvg = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const greenWidth = Math.max(15, 40 - chainAvg * 2)   // 20%–40%
  const greenStart = 50 - greenWidth / 2

  const handleHit = useCallback(() => {
    if (hit) return
    setHit(true)
    cancelAnimationFrame(rafRef.current)
    onHit(posRef.current)
  }, [hit, onHit])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); handleHit() }
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

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[480px] max-w-[90vw] z-50">
      {/* Заголовок */}
      <div className="text-center mb-3">
        <span className="font-title text-[var(--steppe-gold)] text-sm tracking-widest uppercase">
          {runner.name} бежит!
        </span>
        <p className="text-gray-300 text-xs font-body mt-1">
          Нажми <kbd className="bg-white/20 px-2 py-0.5 rounded text-white font-mono">ПРОБЕЛ</kbd> или нажми на полосу
        </p>
      </div>

      {/* Полоса */}
      <div
        className="relative h-10 bg-[#0a0e1a]/80 border-2 border-[var(--steppe-gold)]/60 rounded-full overflow-hidden cursor-pointer"
        onClick={handleHit}
      >
        {/* Зелёная зона */}
        <div
          className="absolute top-0 h-full bg-green-500/50 rounded-full"
          style={{ left: `${greenStart}%`, width: `${greenWidth}%` }}
        />

        {/* Курсор */}
        <motion.div
          className={`absolute top-1 w-3 h-8 rounded-full shadow-lg ${inGreen ? 'bg-green-400' : 'bg-white'}`}
          style={{ left: `calc(${cursorPos}% - 6px)` }}
          animate={{ scale: inGreen ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3, repeat: inGreen ? Infinity : 0 }}
        />

        {/* Метка центра */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-[var(--steppe-gold)]/40" />
      </div>

      {/* Статы */}
      <div className="flex justify-between mt-2 text-xs text-gray-400 font-body px-1">
        <span>Күш: <span className="text-blue-400">{runner.kush}</span></span>
        <span>Цепь: <span className="text-red-400">{leftDefender.name} + {rightDefender.name}</span></span>
        <span>Қарсылық: <span className="text-red-400">{Math.round(chainAvg)}</span></span>
      </div>
    </div>
  )
}
