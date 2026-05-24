'use client'

import Link from 'next/link'
import { useState } from 'react'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function MobileNavbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-[80] px-3 pt-3 lg:hidden">
      <nav className="flex items-center justify-between rounded-xl border border-[var(--steppe-gold)]/25 bg-[#080b14]/88 px-3 py-2 backdrop-blur">
        <Link href="/" className="font-kazakh text-sm font-bold uppercase tracking-[0.18em] text-white">
          {t('teams.akserek')}
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setOpen((value) => !value)} className="rounded border border-white/15 px-3 py-2 text-white">
            ☰
          </button>
        </div>
      </nav>
      {open && (
        <div className="mt-2 rounded-xl border border-[var(--steppe-gold)]/25 bg-[#080b14]/95 p-2 shadow-2xl backdrop-blur">
          {[
            ['/', t('nav.home')],
            ['/game', t('nav.game')],
            ['/#rules', t('nav.rules')],
            ['/menu', t('nav.menu')],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded px-3 py-3 font-kazakh text-sm text-white/80 hover:bg-white/10">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
