'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  useEffect(() => {
    const saved = window.localStorage.getItem('akserek-locale')
    if (saved === 'kk' || saved === 'ru') {
      setLocale(saved)
    } else {
      document.documentElement.lang = 'kk'
    }
  }, [setLocale])

  return (
    <div className="flex overflow-hidden border border-[var(--steppe-gold)]/40 bg-black/30">
      {([
        ['kk', 'ҚАЗ'],
        ['ru', 'RU'],
      ] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setLocale(id)}
          className={`px-2.5 py-1.5 font-kazakh text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            locale === id
              ? 'bg-[var(--steppe-gold)] text-[#080b14]'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
