'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import KazakhButton from '@/components/shared/KazakhButton'
import KazakhOrnament from '@/components/shared/KazakhOrnament'
import dynamic from 'next/dynamic'

const PreviewScene = dynamic(() => import('@/components/scene/PreviewScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0e1a]" />,
})

export default function Hero() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      {/* 3D степь на фоне */}
      <div className="absolute inset-0 z-0">
        <PreviewScene />
      </div>

      {/* Градиенты для читаемости без перекрытия всей сцены */}
      <div className="absolute inset-y-0 left-0 z-10 w-full bg-gradient-to-r from-[#05070d]/95 via-[#05070d]/70 to-transparent lg:w-[68%]" />
      <div className="absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-[#05070d]/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0e1a] to-transparent z-10" />

      {/* Контент */}
      <div className="relative z-20 flex min-h-[calc(100vh-6rem)] items-end px-4 pb-24 pt-14 sm:px-8 lg:items-center lg:pb-12">
        <div className="max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <KazakhOrnament className="mb-7 h-6 w-64 max-w-full text-[var(--steppe-gold)]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-kazakh text-sm font-semibold uppercase tracking-[0.3em] text-[var(--steppe-gold)]"
          >
            Қазақтың халық ойыны
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4 }}
            className="mt-4 font-kazakh text-4xl font-bold uppercase leading-[1.05] tracking-[0.12em] text-white sm:text-6xl lg:text-7xl"
          >
            Ақсерек
            <span className="mt-2 block text-[var(--steppe-gold)]">Көксерек</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 max-w-lg text-base leading-8 text-white/78 sm:text-lg"
          >
            Қазақтың халық ойыны: шепті бұзып өт, қарсы топтан ойыншы ал және өз жағыңды жеңіске жеткіз.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <KazakhButton onClick={() => router.push('/game')} variant="primary">
              Ойынды бастау
            </KazakhButton>
            <KazakhButton onClick={() => router.push('/menu')} variant="secondary">
              Мәзір
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
        </div>
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
