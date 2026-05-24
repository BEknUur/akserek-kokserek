'use client'

import dynamic from 'next/dynamic'

function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0e1a]">
      <div className="font-title text-[var(--steppe-gold)] text-2xl animate-pulse">
        АҚСЕРЕК-КӨКСЕРЕК
      </div>
      <p className="font-kazakh text-gray-400 text-sm mt-3">Жүктелуде...</p>
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
