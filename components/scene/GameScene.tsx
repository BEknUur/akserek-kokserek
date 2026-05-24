'use client'

import { Canvas } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Suspense, useEffect, useState } from 'react'
import { Player } from '@/lib/store/types'
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
import DefenseBar from '@/components/ui/DefenseBar'
import TeamSelect from '@/components/ui/TeamSelect'
import GameOver from '@/components/ui/GameOver'

import { useGameStore } from '@/lib/store/gameStore'
import { useGameLoop } from '@/lib/game/useGameLoop'

// ─── 3D сцена ─────────────────────────────────────────────────────────────────

function SceneContent({ onBreakthroughAnimDone, onEnemyAnimDone }: {
  onBreakthroughAnimDone: () => void
  onEnemyAnimDone: () => void
}) {
  const { phase, playerTeam, enemyTeam, currentRunner, currentTarget, lastResult } = useGameStore()

  const isRunning   = phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS' || phase === 'BREAKTHROUGH_ANIM'
  const chainBroken = (phase === 'RESULT' || phase === 'BREAKTHROUGH_ANIM') && !!lastResult?.success
  const isPlayerAnim = phase === 'BREAKTHROUGH_ANIM' && currentRunner?.team === 'blue'
  const isEnemyAnim  = phase === 'BREAKTHROUGH_ANIM' && currentRunner?.team === 'red'

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

      <Sky sunPosition={[100, 8, -100]} turbidity={10} rayleigh={4} mieCoefficient={0.005} mieDirectionalG={0.8} inclination={0.49} azimuth={0.25} />
      <Environment preset="sunset" />

      <Steppe />
      <Yurt position={[-22, -1, -28]} scale={1.2} />
      <Yurt position={[18, -1, -35]} scale={0.9} />
      <Yurt position={[-10, -1, -40]} scale={0.7} />
      <Eagle />

      {playerTeam.players.length > 0 && (
        <>
          <PlayerRow team={playerTeam} zOffset={4} runnerId={currentRunner?.team === 'blue' ? currentRunner.id : undefined} />
          <Chain
            team={playerTeam}
            zOffset={4}
            brokenBetween={currentRunner?.team === 'red' && chainBroken && lastResult?.success === false ? currentTarget ?? undefined : undefined}
            isBroken={currentRunner?.team === 'red' && !lastResult?.success && chainBroken}
          />
        </>
      )}

      {enemyTeam.players.length > 0 && (
        <>
          <PlayerRow team={enemyTeam} zOffset={-4} highlightedId={currentTarget?.left.id} runnerId={currentRunner?.team === 'red' ? currentRunner.id : undefined} />
          <Chain
            team={enemyTeam}
            zOffset={-4}
            brokenBetween={currentRunner?.team === 'blue' && chainBroken ? currentTarget ?? undefined : undefined}
            isBroken={currentRunner?.team === 'blue' && chainBroken}
          />
        </>
      )}

      {currentRunner && isRunning && (
        <Runner
          runner={currentRunner}
          targetZ={currentRunner.team === 'blue' ? -4 : 4}
          phase={phase}
          success={lastResult?.success}
          onAnimDone={isPlayerAnim ? onBreakthroughAnimDone : isEnemyAnim ? onEnemyAnimDone : undefined}
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
    currentRunner, currentTarget, lastResult,
  } = useGameStore()
  const store = useGameStore()

  const {
    startWithTeam,
    handlePlayerHit,
    handleDefenseHit,
    onBreakthroughAnimDone,
    onEnemyAnimDone,
    onCommentaryDone,
    handlePlayerChooses,
    resetGame,
  } = useGameLoop()

  // 2-шаговый выбор атаки: сначала наш игрок, потом цель
  const [pendingRunner, setPendingRunner] = useState<Player | null>(null)

  // При смене фазы сбрасываем pendingRunner
  useEffect(() => {
    if (phase !== 'PLAYER_CHOOSES') setPendingRunner(null)
  }, [phase])

  // При монтировании — показываем выбор команды
  useEffect(() => {
    store.setPhase('TEAM_SELECT')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 5, 14], fov: 60 }}
        shadows
        style={{ width: '100vw', height: '100vh', background: '#1a0a2e' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SceneContent
            onBreakthroughAnimDone={onBreakthroughAnimDone}
            onEnemyAnimDone={onEnemyAnimDone}
          />
        </Suspense>
      </Canvas>

      {/* ── HUD слой ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Фаза + раунд */}
        {phase !== 'TEAM_SELECT' && <PhaseIndicator phase={phase} round={round} />}

        {/* Наша команда — шаг 1: выбрать бегуна */}
        {playerTeam.players.length > 0 && (
          <div className={phase === 'PLAYER_CHOOSES' ? 'pointer-events-auto' : ''}>
            <TeamRoster
              team={playerTeam}
              isSelectable={phase === 'PLAYER_CHOOSES' && !pendingRunner}
              selectedId={pendingRunner?.id}
              onSelect={(p) => setPendingRunner(p)}
            />
          </div>
        )}

        {/* Команда врага — шаг 2: выбрать цель (только после выбора своего) */}
        {enemyTeam.players.length > 0 && (
          <div className="pointer-events-auto">
            <EnemyRoster
              team={enemyTeam}
              isSelectable={phase === 'PLAYER_CHOOSES' && !!pendingRunner}
              highlightedId={currentTarget?.left.id}
              onSelect={(enemyTarget) => {
                if (pendingRunner) handlePlayerChooses(pendingRunner, enemyTarget)
              }}
            />
          </div>
        )}

        {/* Субтитры */}
        <Subtitles text={subtitleText} />

        {/* Аташка */}
        <Commentator text={commentaryText} isLoading={isCommentaryLoading} onDone={onCommentaryDone} />

        {/* АТАКА: наш игрок бежит → жмём ПРОБЕЛ чтобы разбить цепь */}
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

        {/* ЗАЩИТА: враг бежит → жмём ПРОБЕЛ чтобы удержать цепь */}
        {phase === 'ENEMY_RUNS' && currentRunner && currentTarget && (
          <div className="pointer-events-auto">
            <DefenseBar
              runner={currentRunner}
              leftDefender={currentTarget.left}
              rightDefender={currentTarget.right}
              onHit={handleDefenseHit}
            />
          </div>
        )}

        {/* PLAYER_CHOOSES — 2-шаговый оверлей */}
        {phase === 'PLAYER_CHOOSES' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30">
            <div className="bg-black/75 border border-[var(--steppe-gold)]/60 rounded-2xl px-8 py-5 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
              {!pendingRunner ? (
                <>
                  <p className="font-title text-[var(--steppe-gold)] text-xl mb-1">ШАГ 1: КІМ БАРАДЫ?</p>
                  <p className="text-white text-sm font-body mb-1">Кто побежит ломать цепь?</p>
                  <p className="text-blue-300 text-xs font-body">← Выбери своего игрока слева</p>
                </>
              ) : (
                <>
                  <p className="font-title text-[var(--steppe-gold)] text-xl mb-1">ШАГ 2: КІМГЕ?</p>
                  <p className="text-white text-sm font-body mb-1">
                    <span className="text-blue-300">{pendingRunner.name}</span> атакует — куда?
                  </p>
                  <p className="text-red-300 text-xs font-body">Выбери врага справа →</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Результат хода */}
        {phase === 'RESULT' && lastResult && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30">
            <div className={`rounded-2xl px-8 py-4 border ${lastResult.success ? 'bg-green-900/80 border-green-400/60' : 'bg-red-900/80 border-red-400/60'}`}>
              <p className={`font-title text-3xl ${lastResult.success ? 'text-green-300' : 'text-red-300'}`}>
                {lastResult.success ? '✓ ЖАРЫП ӨТТІ!' : '✗ ТОҚТАТЫЛДЫ'}
              </p>
              <p className="text-gray-300 text-sm font-body mt-1">
                {lastResult.success ? 'Прорыв удался!' : 'Прорыв не удался'}
              </p>
            </div>
          </div>
        )}

        {/* Кнопка назад */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 text-gray-500 hover:text-white text-xs font-body
                     bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded transition-colors pointer-events-auto"
        >
          ← Басты бет
        </button>
      </div>

      {/* Выбор команды */}
      {phase === 'TEAM_SELECT' && (
        <TeamSelect onSelect={startWithTeam} />
      )}

      {/* Game Over */}
      {phase === 'GAME_OVER' && (
        <div className="absolute inset-0 z-50">
          <GameOver
            won={enemyTeam.players.length === 0}
            playerTeamName={playerTeam.name}
            enemyTeamName={enemyTeam.name}
            onRestart={() => { resetGame(); store.setPhase('TEAM_SELECT') }}
          />
        </div>
      )}
    </div>
  )
}
