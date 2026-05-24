'use client'

import { Canvas } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Steppe from './Steppe'
import Yurt from './Yurt'
import Eagle from './Eagle'
import PlayerRow from './PlayerRow'
import Chain from './Chain'
import CameraRig from './CameraRig'
import Runner from './Runner'

import PhaseIndicator from '@/components/ui/PhaseIndicator'
import TeamRoster from '@/components/ui/TeamRoster'
import EnemyRoster from '@/components/ui/EnemyRoster'
import Subtitles from '@/components/ui/Subtitles'
import Commentator from '@/components/ui/Commentator'
import BreakthroughBar from '@/components/ui/BreakthroughBar'
import GameOver from '@/components/ui/GameOver'

import { useGameStore } from '@/lib/store/gameStore'
import { useGameLoop } from '@/lib/game/useGameLoop'

// ─── 3D Сцена ────────────────────────────────────────────────────────────────

function SceneContent() {
  const { phase, playerTeam, enemyTeam, currentRunner, currentTarget } = useGameStore()

  const runnerProgress = phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS' ? 0.85 : 0

  return (
    <>
      <ambientLight intensity={0.35} color="#ffe4b5" />
      <directionalLight
        position={[50, 30, -20]}
        intensity={2.5}
        color="#ff8c42"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-20, 15, 20]} intensity={0.4} color="#4a7abf" />

      <Sky
        sunPosition={[100, 8, -100]}
        turbidity={10}
        rayleigh={4}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49}
        azimuth={0.25}
      />
      <Environment preset="sunset" />

      <Steppe />
      <Yurt position={[-22, -1, -28]} scale={1.2} />
      <Yurt position={[18, -1, -35]} scale={0.9} />
      <Yurt position={[-10, -1, -40]} scale={0.7} />
      <Eagle />

      {playerTeam.players.length > 0 && (
        <>
          <PlayerRow team={playerTeam} zOffset={4} runnerId={currentRunner?.team === 'blue' ? currentRunner?.id : undefined} />
          <Chain team={playerTeam} zOffset={4} />
        </>
      )}

      {enemyTeam.players.length > 0 && (
        <>
          <PlayerRow
            team={enemyTeam}
            zOffset={-4}
            highlightedId={currentTarget?.left.id}
            runnerId={currentRunner?.team === 'red' ? currentRunner?.id : undefined}
          />
          <Chain team={enemyTeam} zOffset={-4} />
        </>
      )}

      {/* Бегун в движении */}
      {currentRunner && (phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS') && (
        <Runner
          runner={currentRunner}
          targetZ={currentRunner.team === 'blue' ? -4 : 4}
          progress={runnerProgress}
        />
      )}

      <CameraRig phase={phase} />

      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.75} luminanceSmoothing={0.9} />
        <Vignette darkness={0.45} offset={0.3} />
      </EffectComposer>
    </>
  )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function GameScene() {
  const router = useRouter()
  const {
    phase, playerTeam, enemyTeam, round,
    commentaryText, isCommentaryLoading, subtitleText,
    currentRunner, currentTarget,
  } = useGameStore()

  const {
    startGame,
    handlePlayerHit,
    onCommentaryDone,
    handlePlayerChooses,
    resetGame,
  } = useGameLoop()

  // Автостарт при монтировании
  useEffect(() => {
    startGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        shadows
        style={{ width: '100vw', height: '100vh', background: '#1a0a2e' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* ── HUD слой ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Фаза + раунд */}
        <PhaseIndicator phase={phase} round={round} />

        {/* Команда игрока */}
        {playerTeam.players.length > 0 && (
          <TeamRoster team={playerTeam} />
        )}

        {/* Команда врага */}
        {enemyTeam.players.length > 0 && (
          <div className="pointer-events-auto">
            <EnemyRoster
              team={enemyTeam}
              isSelectable={phase === 'PLAYER_CHOOSES'}
              highlightedId={currentTarget?.left.id}
              onSelect={handlePlayerChooses}
            />
          </div>
        )}

        {/* Субтитры */}
        <Subtitles text={subtitleText} />

        {/* Аташка */}
        <Commentator
          text={commentaryText}
          isLoading={isCommentaryLoading}
          onDone={onCommentaryDone}
        />

        {/* Timing-механика */}
        {phase === 'PLAYER_RUNS' && currentRunner && currentTarget && (
          <div className="pointer-events-auto">
            <BreakthroughBar
              runner={currentRunner}
              leftDefender={currentTarget.left}
              rightDefender={currentTarget.right}
              onHit={handlePlayerHit}
            />
          </div>
        )}

        {/* Кнопка назад */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 text-gray-500 hover:text-white text-xs font-body
                     bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded transition-colors
                     pointer-events-auto"
        >
          ← Басты бет
        </button>
      </div>

      {/* Game Over — поверх всего */}
      {phase === 'GAME_OVER' && (
        <div className="absolute inset-0 z-50">
          <GameOver
            won={enemyTeam.players.length === 0}
            playerTeamName={playerTeam.name}
            enemyTeamName={enemyTeam.name}
            onRestart={() => { resetGame(); startGame() }}
          />
        </div>
      )}
    </div>
  )
}
