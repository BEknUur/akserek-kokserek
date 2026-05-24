'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import KazakhButton from '@/components/shared/KazakhButton'
import dynamic from 'next/dynamic'

const PreviewScene = dynamic(() => import('@/components/scene/PreviewScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0e1a]" />,
})

export default function Hero() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D степь на фоне */}
      <div className="absolute inset-0 z-0">
        <PreviewScene />
      </div>

      {/* Градиент снизу для читаемости */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0e1a] to-transparent z-10" />

      {/* Контент */}
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
        {/* Орнаментальная линия сверху */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-6 w-32 h-0.5 bg-[var(--steppe-gold)]"
        />

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-kazakh text-[var(--steppe-gold)] text-sm tracking-widest uppercase mb-3"
        >
          Қазақтың халық ойыны
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-title text-5xl md:text-7xl text-white leading-tight mb-2"
        >
          АҚСЕРЕК
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-title text-5xl md:text-7xl text-[var(--steppe-gold)] leading-tight mb-6"
        >
          КӨКСЕРЕК
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-gray-300 font-body text-lg mb-10 max-w-lg mx-auto"
        >
          Казахская народная игра — прорви цепь, захвати воинов, победи врага!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <KazakhButton onClick={() => router.push('/game')} variant="primary">
            Ойынды бастау
          </KazakhButton>
          <KazakhButton
            onClick={() => {
              document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="secondary"
          >
            Ережелер
          </KazakhButton>
        </motion.div>

        {/* Орнаментальная линия снизу */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mx-auto mt-8 w-32 h-0.5 bg-[var(--steppe-gold)]"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-gray-400 text-xs font-body">↓</span>
        <span className="text-gray-400 text-xs font-body">Ережелер</span>
      </motion.div>
    </div>
  )
}
