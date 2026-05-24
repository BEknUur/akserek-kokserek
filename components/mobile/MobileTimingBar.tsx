'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest('button,input,textarea,a,[role="button"]'))
}

export default function MobileTimingBar({
  active,
  onTap,
}: {
  active: boolean
  onTap: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!active) return

    const handleTouch = (event: TouchEvent) => {
      if (isInteractiveTarget(event.target)) return
      event.preventDefault()
      if ('vibrate' in navigator) navigator.vibrate(40)
      onTap()
    }

    window.addEventListener('touchstart', handleTouch, { passive: false })
    return () => window.removeEventListener('touchstart', handleTouch)
  }, [active, onTap])

  if (!active) return null

  return (
    <div className="fixed bottom-3 left-1/2 z-[55] w-[90vw] -translate-x-1/2 rounded-xl border border-[var(--steppe-gold)]/60 bg-black/80 p-3 text-center shadow-2xl lg:hidden">
      <p className="font-title text-sm uppercase tracking-widest text-[var(--steppe-gold)]">
        {t('game.tap')}
      </p>
      <p className="mt-1 text-xs text-white/65">{t('game.inGreenZone')}</p>
    </div>
  )
}
