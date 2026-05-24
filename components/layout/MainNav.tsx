'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import KazakhOrnament from '@/components/shared/KazakhOrnament'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/useTranslation'
import MobileNavbar from '@/components/mobile/MobileNavbar'

const links = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/menu', labelKey: 'nav.menu' },
  { href: '/game', labelKey: 'nav.game' },
  { href: '/#rules', labelKey: 'nav.rules' },
]

export default function MainNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <>
    <MobileNavbar />
    <header className="fixed left-0 right-0 top-0 z-50 hidden px-3 pt-3 sm:px-6 lg:block">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 border border-[var(--steppe-gold)]/25 bg-[#080b14]/80 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Ақсерек-Көксерек">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--steppe-gold)] bg-[var(--steppe-gold)] text-[#080b14]">
            <span className="h-4 w-4 rotate-45 border-2 border-[#080b14]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-kazakh text-sm font-bold uppercase tracking-[0.22em] text-white">
              {t('teams.akserek')}
            </span>
            <span className="block truncate font-kazakh text-xs uppercase tracking-[0.2em] text-[var(--steppe-gold)]">
              {t('teams.kokserek')}
            </span>
          </span>
        </Link>

        <KazakhOrnament className="hidden h-5 w-44 text-[var(--steppe-gold)]/50 lg:block" />

        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : !link.href.includes('#') && pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3 py-2 font-kazakh text-xs font-semibold uppercase tracking-[0.16em] transition sm:text-sm ${
                  active
                    ? 'bg-[var(--steppe-gold)] text-[#080b14]'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            )
          })}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
    </>
  )
}
