'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface SubtitlesProps {
  text: string
}

export default function Subtitles({ text }: SubtitlesProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-xl text-center pointer-events-none">
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="bg-black/70 border border-[var(--steppe-gold)]/30 rounded-lg px-5 py-2.5"
          >
            <p className="font-kazakh text-white text-base leading-snug">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
