'use client'

import dynamic from 'next/dynamic'
import { useTranslation } from '@/lib/i18n/useTranslation'

function LoadingScreen() {
  const { t } = useTranslation()

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0e1a]">
      <div className="font-title text-[var(--steppe-gold)] text-2xl animate-pulse">
        {t('landing.titleLine1')}-{t('landing.titleLine2')}
      </div>
      <p className="font-kazakh text-gray-400 text-sm mt-3">{t('game.loading')}</p>
    </div>
  )
}

const GameScene = dynamic(() => import('./GameScene'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function GameClient() {
  return <GameScene />
}
