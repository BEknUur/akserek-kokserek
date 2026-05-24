import Hero from '@/components/landing/Hero'
import Rules from '@/components/landing/Rules'

export default function LandingPage() {
  return (
    <main className="bg-[#0a0e1a] min-h-screen">
      <Hero />

      <section id="rules" className="bg-[#0a0e1a]">
        <Rules />
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-[var(--steppe-gold)]/20">
        <p className="font-kazakh text-[var(--steppe-gold)] text-sm tracking-widest">
          АҚСЕРЕК-КӨКСЕРЕК
        </p>
        <p className="text-gray-500 text-xs mt-1 font-body">
          Қазақтың халық ойыны · Казахская народная игра
        </p>
      </footer>
    </main>
  )
}
