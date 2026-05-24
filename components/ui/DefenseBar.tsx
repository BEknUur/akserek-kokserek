'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@/lib/store/types'

interface DefenseBarProps {
  runner: Player          // бегущий враг
  leftDefender: Player   // наш левый защитник
  rightDefender: Player  // наш правый защитник
  onHit: (accuracy: number) => void
}

export default function DefenseBar({ runner, leftDefender, rightDefender, onHit }: DefenseBarProps) {
  const [cursorPos, setCursorPos] = useState(0)
  const [hit, setHit] = useState(false)
  const [showFlash, setShowFlash] = useState(true)
  const dirRef = useRef(1)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Скорость курсора — зависит от kush бегущего врага (сильнее = быстрее)
  const speed = 0.45 + (runner.kush / 10) * 0.6

  // Ширина зелёной зоны — зависит от нашей защиты (выше karsylyk = шире зона)
  const chainAvg = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const greenWidth = Math.max(15, chainAvg * 3.5)  // 15%–31%
  const greenStart = 50 - greenWidth / 2

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
      {/* Flash-баннер "ЦЕП ҰСТА!" */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="font-title text-red-400 text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                ЦЕП ҰСТА!
              </p>
              <p className="text-white text-xl mt-2 font-body">
                {runner.name} бежит на нашу цепь!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Полоса защиты */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[560px] max-w-[92vw] z-50">
        <div className="text-center mb-4">
          <span className="font-title text-red-400 text-base tracking-widest uppercase">
            {runner.name} атакует нашу цепь!
          </span>
          <p className="text-white text-sm font-body mt-1.5 bg-black/60 inline-block px-3 py-1 rounded-full">
            Нажми{' '}
            <kbd className="bg-red-500 text-white px-2 py-0.5 rounded font-mono font-bold">
              ПРОБЕЛ
            </kbd>{' '}
            в <span className="text-red-400 font-semibold">зелёной зоне</span> — удержи цепь!
          </p>
        </div>

        <div
          className="relative h-14 bg-[#0a0e1a]/90 border-2 border-red-500/70 rounded-full overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          onClick={handleHit}
        >
          {/* Зелёная зона (защита) */}
          <motion.div
            className="absolute top-0 h-full bg-green-500/60 rounded-full"
            style={{ left: `${greenStart}%`, width: `${greenWidth}%` }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 text-green-200 text-[10px] font-bold pointer-events-none"
            style={{ left: `${greenStart + greenWidth / 2}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          >
            🛡 ДЕРЖИ
          </div>

          {/* Курсор */}
          <motion.div
            className={`absolute top-1.5 w-4 h-11 rounded-full shadow-xl ${inGreen ? 'bg-green-300 shadow-green-400/60' : 'bg-red-300'}`}
            style={{ left: `calc(${cursorPos}% - 8px)` }}
            animate={inGreen ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: inGreen ? Infinity : 0 }}
          />
        </div>

        {/* Статы */}
        <div className="flex justify-between mt-2.5 text-xs text-gray-400 font-body px-1">
          <span>⚡ Атака: <span className="text-red-400 font-semibold">{runner.name} ({runner.kush})</span></span>
          <span>🛡 Защита: <span className="text-green-400 font-semibold">{leftDefender.name} + {rightDefender.name}</span></span>
        </div>
      </div>
    </>
  )
}
