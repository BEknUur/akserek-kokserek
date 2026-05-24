'use client'

import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Close" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute bottom-0 left-0 right-0 max-h-[72vh] overflow-hidden rounded-t-2xl border-t border-[var(--steppe-gold)]/50 bg-[#080b14]/95 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="font-title text-sm uppercase tracking-widest text-[var(--steppe-gold)]">{title}</p>
              <button onClick={onClose} className="rounded border border-white/15 px-3 py-1 text-sm text-white/75">
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
