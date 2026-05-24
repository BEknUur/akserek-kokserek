'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import KazakhOrnament from '@/components/shared/KazakhOrnament'

const links = [
  { href: '/', label: 'Басты бет' },
  { href: '/menu', label: 'Мәзір' },
  { href: '/game', label: 'Ойын' },
  { href: '/#rules', label: 'Ережелер' },
]

export default function MainNav() {
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 border border-[var(--steppe-gold)]/25 bg-[#080b14]/80 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Ақсерек-Көксерек басты бет">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--steppe-gold)] bg-[var(--steppe-gold)] text-[#080b14]">
            <span className="h-4 w-4 rotate-45 border-2 border-[#080b14]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-kazakh text-sm font-bold uppercase tracking-[0.22em] text-white">
              Ақсерек
            </span>
            <span className="block truncate font-kazakh text-xs uppercase tracking-[0.2em] text-[var(--steppe-gold)]">
              Көксерек
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
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
