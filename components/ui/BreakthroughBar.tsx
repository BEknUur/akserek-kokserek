'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [cursorPos, setCursorPos] = useState(0)
  const [hit, setHit] = useState(false)
  const [showFlash, setShowFlash] = useState(true)
  const dirRef = useRef(1)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)

  const speed = 0.4 + (runner.kush / 10) * 0.5
  const chainAvg = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const greenWidth = Math.max(18, 42 - chainAvg * 2)
  const greenStart = 50 - greenWidth / 2

  // Flash-баннер исчезает через 1.2с
  useEffect(() => {
    const t = setTimeout(() => setShowFlash(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleHit = useCallback(() => {
    if (hit) return
    setHit(true)
    cancelAnimationFrame(rafRef.current)
    onHit(posRef.current)
  }, [hit, onHit])

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

  return (
    <>
      {/* Flash-баннер "ЖАРЫП ӨТ!" */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="font-title text-[var(--steppe-gold)] text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]">
                ЖАРЫП ӨТ!
              </p>
              <p className="text-white text-xl mt-2 font-body">
                {runner.name} бежит!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основная полоса */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[560px] max-w-[92vw] z-50">
        <div className="text-center mb-4">
          <span className="font-title text-[var(--steppe-gold)] text-base tracking-widest uppercase">
            {runner.name} бежит на цепь!
          </span>
          <p className="text-white text-sm font-body mt-1.5 bg-black/60 inline-block px-3 py-1 rounded-full">
            Нажми{' '}
            <kbd className="bg-[var(--steppe-gold)] text-black px-2 py-0.5 rounded font-mono font-bold">
              ПРОБЕЛ
            </kbd>{' '}
            или <span className="text-[var(--steppe-gold)] font-semibold">кликни на полосу</span> в зелёной зоне!
          </p>
        </div>

        {/* Полоса */}
        <div
          className="relative h-14 bg-[#0a0e1a]/90 border-2 border-[var(--steppe-gold)]/70 rounded-full overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          onClick={handleHit}
        >
          {/* Зелёная зона с пульсацией */}
          <motion.div
            className="absolute top-0 h-full bg-green-500/60 rounded-full"
            style={{ left: `${greenStart}%`, width: `${greenWidth}%` }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Текст "СЮДА" в зелёной зоне */}
          <div
            className="absolute top-1/2 -translate-y-1/2 text-green-200 text-[10px] font-bold pointer-events-none"
            style={{ left: `${greenStart + greenWidth / 2}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          >
            ✓ СЮДА
          </div>

          {/* Курсор */}
          <motion.div
            className={`absolute top-1.5 w-4 h-11 rounded-full shadow-xl ${inGreen ? 'bg-green-300 shadow-green-400/60' : 'bg-white'}`}
            style={{ left: `calc(${cursorPos}% - 8px)` }}
            animate={inGreen ? { scale: [1, 1.15, 1], boxShadow: ['0 0 8px #4ade80', '0 0 20px #4ade80', '0 0 8px #4ade80'] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: inGreen ? Infinity : 0 }}
          />
        </div>

        {/* Статы */}
        <div className="flex justify-between mt-2.5 text-xs text-gray-400 font-body px-1">
          <span>⚡ Күш: <span className="text-blue-400 font-semibold">{runner.kush}</span></span>
          <span>🛡 {leftDefender.name} + {rightDefender.name}</span>
          <span>🛡 Қарсылық: <span className="text-red-400 font-semibold">{Math.round(chainAvg)}</span></span>
        </div>
      </div>
    </>
  )
}
