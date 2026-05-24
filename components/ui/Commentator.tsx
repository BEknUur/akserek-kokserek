'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CommentatorProps {
  text: string
  isLoading: boolean
  onDone?: () => void
}

function TypewriterText({ text, speed = 35, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setFinished(false)
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setFinished(true)
        setTimeout(() => onDone?.(), 1800)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onDone])

  return (
    <>
      <span>{displayed}</span>
      {/* Мигающий курсор пока печатает */}
      {!finished && <span className="animate-pulse ml-0.5 opacity-70">▌</span>}
    </>
  )
}

export default function Commentator({ text, isLoading, onDone }: CommentatorProps) {
  const [showContinue, setShowContinue] = useState(false)

  useEffect(() => {
    setShowContinue(false)
    if (!text || isLoading) return
    const t = setTimeout(() => setShowContinue(true), 2000)
    return () => clearTimeout(t)
  }, [text, isLoading])

  return (
    <div className="absolute top-4 right-4 z-40 w-72">
      <AnimatePresence>
        {(text || isLoading) && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="bg-[var(--ui-bg)] border border-[var(--steppe-gold)]/50 rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">👴🏽</span>
              <div>
                <p className="font-title text-[var(--steppe-gold)] text-xs">Аташка</p>
                <p className="text-gray-500 text-[10px] font-body">Комментатор</p>
              </div>
            </div>

            <div className="text-gray-200 text-sm font-kazakh leading-relaxed min-h-[40px]">
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ● ● ●
                </motion.span>
              ) : (
                <TypewriterText text={text} onDone={onDone} />
              )}
            </div>

            {/* Кнопка "продолжить" появляется через 2 сек */}
            <AnimatePresence>
              {showContinue && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={onDone}
                  className="mt-3 w-full text-xs font-body text-[var(--steppe-gold)] border border-[var(--steppe-gold)]/40
                             rounded py-1.5 hover:bg-[var(--steppe-gold)]/10 transition-colors cursor-pointer"
                >
                  Жалғастыру →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
