import Link from 'next/link'
import KazakhOrnament from '@/components/shared/KazakhOrnament'

const menuItems = [
  {
    href: '/game',
    kicker: '01 · Жарыс',
    title: 'Ойынды бастау',
    desc: 'Команда жинап, қарсы жақтың шебін бұзатын негізгі 3D режим.',
  },
  {
    href: '/#rules',
    kicker: '02 · Дәстүр',
    title: 'Ережелер',
    desc: 'Шақыру, жүгіріс, тұтқын алу және жеңіс шарттары қысқа түрде.',
  },
  {
    href: '/',
    kicker: '03 · Сахна',
    title: 'Басты бет',
    desc: 'Дала көрінісі, атау және ойын атмосферасына жылдам оралу.',
  },
]

export default function MenuPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a12] px-4 pb-16 pt-32 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.16),transparent_34%),linear-gradient(180deg,#111827_0%,#070a12_46%,#03050a_100%)]" />
      <div className="ornament-grid absolute inset-0 opacity-[0.08]" />

      <section className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <KazakhOrnament className="mx-auto mb-7 h-6 w-64 text-[var(--steppe-gold)]" />
          <p className="font-kazakh text-sm font-semibold uppercase tracking-[0.32em] text-[var(--steppe-gold)]">
            Қазақы ойын мәзірі
          </p>
          <h1 className="mt-4 font-kazakh text-4xl font-bold uppercase tracking-[0.14em] text-white sm:text-6xl">
            Ақсерек · Көксерек
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Мәзір дала эстетикасына, ою-өрнек ырғағына және ойын интерфейсіне бейімделді.
            Барлық негізгі жолдар бір экранда: бастау, ереже, басты сахна.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative min-h-72 overflow-hidden border border-[var(--steppe-gold)]/30 bg-[#0b1020]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--steppe-gold)] hover:bg-[#111827]"
            >
              <span className="absolute left-6 right-6 top-6 h-px bg-[var(--steppe-gold)]/35" />
              <span className="absolute bottom-6 left-6 right-6 h-px bg-[var(--steppe-gold)]/35" />
              <span className="absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-[var(--steppe-gold)]/70" />
              <span className="absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-[var(--steppe-gold)]/70" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="font-kazakh text-xs font-bold uppercase tracking-[0.28em] text-[var(--steppe-gold)]">
                    {item.kicker}
                  </p>
                  <h2 className="mt-8 font-kazakh text-2xl font-bold uppercase tracking-[0.08em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/65">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <KazakhOrnament className="h-5 w-32 text-[var(--steppe-gold)]/55" />
                  <span className="grid h-10 w-10 place-items-center border border-[var(--steppe-gold)] text-[var(--steppe-gold)] transition group-hover:bg-[var(--steppe-gold)] group-hover:text-[#070a12]">
                    <span className="text-xl leading-none">›</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
