'use client'

import { Canvas } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import Steppe from './Steppe'
import Yurt from './Yurt'
import Eagle from './Eagle'
import Altibakan from './Altibakan'
import AmbientParticles from './AmbientParticles'
import BackgroundMountains from './BackgroundMountains'
import Campfire from './Campfire'
import Cart from './Cart'
import Horses from './Horses'
import SteppeDecor from './SteppeDecor'
import PlayerRow from './PlayerRow'
import Chain from './Chain'
import CameraRig from './CameraRig'
import Runner from './Runner'

import TimingBar from '@/components/ui/TimingBar'
import TeamRoster from '@/components/ui/TeamRoster'
import EnemyRoster from '@/components/ui/EnemyRoster'
import Subtitles from '@/components/ui/Subtitles'
import Commentator from '@/components/ui/Commentator'
import TeamSelect from '@/components/ui/TeamSelect'
import GameOver from '@/components/ui/GameOver'
import AiChat from '@/components/ui/AiChat'
import VoiceControls from '@/components/ui/VoiceControls'
import VoiceNarrator from '@/components/ui/VoiceNarrator'
import WeatherEffects from '@/components/weather/WeatherEffects'
import CrowdGroup from '@/components/crowd/CrowdGroup'
import FestivalDecor from '@/components/crowd/FestivalDecor'
import CrowdAudio from '@/components/crowd/CrowdAudio'
import TournamentProgress from '@/components/tournament/TournamentProgress'
import VoiceCommandButton from '@/components/voice/VoiceCommandButton'

import { useGameStore } from '@/lib/store/gameStore'
import { useGameLoop } from '@/lib/game/useGameLoop'
import { Player } from '@/lib/store/types'
import { VoiceCommand } from '@/lib/voice/speechRecognition'

// ─── 3D сцена ─────────────────────────────────────────────────────────────────

function SceneContent({ onPlayerAnimDone, onBotAnimDone }: {
  onPlayerAnimDone: () => void
  onBotAnimDone: () => void
}) {
  const { phase, playerTeam, enemyTeam, currentRunner, currentTarget, lastResult } = useGameStore()

  const isRunning   = phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS' || phase === 'BREAKTHROUGH_ANIM'
  const chainBroken = phase === 'BREAKTHROUGH_ANIM' && !!lastResult?.success

  // Чей бегун? (для скрытия из шеренги и анимации)
  const playerRunning = isRunning && currentRunner?.team === 'blue'
  const botRunning    = isRunning && currentRunner?.team === 'red'

  // Какую цепь рвут и результат
  const enemyChainBroken = playerRunning && chainBroken   // наш игрок прорвал вражескую цепь
  const playerChainBroken = botRunning && !lastResult?.success && phase === 'BREAKTHROUGH_ANIM'
  const runnerBrokeThrough = botRunning ? !lastResult?.success : lastResult?.success

  const isPlayerAnim = phase === 'BREAKTHROUGH_ANIM' && currentRunner?.team === 'blue'
  const isBotAnim    = phase === 'BREAKTHROUGH_ANIM' && currentRunner?.team === 'red'

  return (
    <>
      <fog attach="fog" args={['#c07a45', 36, 118]} />
      <ambientLight intensity={0.28} color="#ffe2b3" />
      <hemisphereLight color="#ffcf8a" groundColor="#314a32" intensity={0.55} />
      <directionalLight position={[50, 24, -36]} intensity={3.0} color="#ff8c42" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={100}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={20} shadow-camera-bottom={-20} />
      <directionalLight position={[-24, 14, 18]} intensity={0.55} color="#5c8ad8" />

      <Sky sunPosition={[100, 8, -100]} turbidity={10} rayleigh={4}
           mieCoefficient={0.005} mieDirectionalG={0.8} inclination={0.49} azimuth={0.25} />
      <Environment preset="sunset" />

      <BackgroundMountains />
      <Steppe />
      <Yurt position={[-24, -1, -29]} scale={1.18} />
      <Yurt position={[18, -1, -33]} scale={0.95} />
      <Yurt position={[-8, -1, -42]} scale={0.72} />
      <Yurt position={[31, -1, -36]} scale={0.62} />
      <Altibakan />
      <Cart />
      <Campfire />
      <Horses />
      <SteppeDecor />
      <FestivalDecor />
      <AmbientParticles />
      <WeatherEffects />
      <CrowdGroup />
      <Eagle />

      {/* Наша шеренга (синие) */}
      {playerTeam.players.length > 0 && (
        <>
          <PlayerRow
            team={playerTeam}
            zOffset={4}
            runnerId={playerRunning ? currentRunner!.id : undefined}
          />
          <Chain
            team={playerTeam}
            zOffset={4}
            isBroken={playerChainBroken}
            brokenBetween={playerChainBroken ? currentTarget : undefined}
          />
        </>
      )}

      {/* Вражеская шеренга (красные) */}
      {enemyTeam.players.length > 0 && (
        <>
          <PlayerRow
            team={enemyTeam}
            zOffset={-4}
            highlightedId={playerRunning ? currentTarget?.left.id : undefined}
            runnerId={botRunning ? currentRunner!.id : undefined}
          />
          <Chain
            team={enemyTeam}
            zOffset={-4}
            isBroken={enemyChainBroken}
            brokenBetween={enemyChainBroken ? currentTarget : undefined}
          />
        </>
      )}

      {/* Бегун */}
      {currentRunner && isRunning && (
        <Runner
          runner={currentRunner}
          targetZ={currentRunner.team === 'blue' ? -4 : 4}
          phase={phase}
          success={runnerBrokeThrough}
          onAnimDone={isPlayerAnim ? onPlayerAnimDone : isBotAnim ? onBotAnimDone : undefined}
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

const PHASE_LABELS: Partial<Record<string, string>> = {
  PLAYER_CHOOSES: 'Сенің кезің',
  PLAYER_RUNS:    'ЖАРЫП ӨТ!',
  BOT_CHOOSING:   'Бот таңдайды...',
  ENEMY_RUNS:     'ЦЕП ҰСТА!',
  RESULT:         'Нәтиже',
  SETUP:          'Дайындалуда...',
}

export default function GameScene() {
  const router = useRouter()
  const {
    phase, playerTeam, enemyTeam, round,
    commentaryText, isCommentaryLoading, subtitleText,
    isAiThinking, aiCommentary,
    difficulty,
    weather,
    currentRunner, currentTarget, lastResult,
  } = useGameStore()
  const store = useGameStore()

  const {
    startWithTeam,
    handlePlayerAttackChoice,
    handleAttackTimingHit,
    handleDefenseTimingHit,
    onPlayerAnimDone,
    onBotAnimDone,
    resetGame,
  } = useGameLoop()

  // 2-шаговый выбор: сначала свой игрок, потом цель
  const [pendingRunner, setPendingRunner] = useState<Player | null>(null)

  useEffect(() => {
    if (phase !== 'PLAYER_CHOOSES') setPendingRunner(null)
  }, [phase])

  useEffect(() => {
    store.setPhase('TEAM_SELECT')
    const saved = window.localStorage.getItem('akserek-difficulty')
    if (saved === 'easy' || saved === 'normal' || saved === 'hard' || saved === 'impossible') {
      store.setDifficulty(saved)
    }
    const savedWeather = window.localStorage.getItem('akserek-weather')
    if (savedWeather === 'random' || savedWeather === 'sunny' || savedWeather === 'rain' || savedWeather === 'fog' || savedWeather === 'night' || savedWeather === 'storm') {
      store.setWeather(savedWeather)
    }
  }, []) // eslint-disable-line

  const handleEnemyTargetClick = (enemyTarget: Player) => {
    if (!pendingRunner) return
    handlePlayerAttackChoice(pendingRunner, enemyTarget)
  }

  const impossiblePressure = difficulty === 'impossible' &&
    (phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS' || phase === 'BOT_CHOOSING')
  const stormPressure = weather === 'storm' && (phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS')

  const handleVoiceCommand = (command: VoiceCommand) => {
    store.setSubtitle(`${command}!`)
    if (phase === 'PLAYER_CHOOSES') {
      if (!pendingRunner) {
        const strongest = [...playerTeam.players].sort((a, b) => b.kush - a.kush)[0]
        if (strongest) setPendingRunner(strongest)
      } else {
        const weakest = [...enemyTeam.players].sort((a, b) => a.karsylyk - b.karsylyk)[0]
        if (weakest) handlePlayerAttackChoice(pendingRunner, weakest)
      }
    }
    if (phase === 'PLAYER_RUNS' && currentRunner && currentTarget) {
      handleAttackTimingHit(50, true)
    }
    if (phase === 'ENEMY_RUNS' && currentRunner && currentTarget) {
      handleDefenseTimingHit(50, true)
    }
    setTimeout(() => store.setSubtitle(''), 900)
  }

  return (
    <motion.div
      className={`relative w-screen h-screen overflow-hidden ${difficulty === 'impossible' ? 'bg-red-950' : ''}`}
      animate={impossiblePressure || stormPressure ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
      transition={impossiblePressure || stormPressure ? { duration: 0.22, repeat: Infinity, repeatDelay: 0.28 } : undefined}
    >
      {/* Canvas */}
      <Canvas camera={{ position: [0, 5, 14], fov: 60 }} shadows
        style={{ width: '100vw', height: '100vh', background: '#1a0a2e' }}
        gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <SceneContent onPlayerAnimDone={onPlayerAnimDone} onBotAnimDone={onBotAnimDone} />
        </Suspense>
      </Canvas>

      {difficulty === 'impossible' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.div
            className="absolute inset-0 border-4 border-red-500/25 shadow-[inset_0_0_90px_rgba(239,68,68,0.34)]"
            animate={impossiblePressure ? { opacity: [0.25, 0.65, 0.25] } : { opacity: 0.22 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {impossiblePressure && (
            <div className="absolute inset-0 overflow-hidden opacity-45">
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute h-px w-48 bg-gradient-to-r from-transparent via-red-300 to-transparent"
                  style={{ top: `${8 + index * 8}%`, left: '-20%' }}
                  animate={{ x: ['0vw', '140vw'] }}
                  transition={{ duration: 0.45 + index * 0.025, repeat: Infinity, ease: 'linear' }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {(weather === 'fog' || weather === 'night' || weather === 'storm') && (
        <div className={`absolute inset-0 z-20 pointer-events-none ${
          weather === 'fog' ? 'bg-slate-200/12 backdrop-blur-[1px]' : weather === 'night' ? 'bg-indigo-950/35' : 'bg-slate-950/20'
        }`} />
      )}

      {/* ── HUD ── */}
      <div className="absolute inset-0 pointer-events-none">
        <VoiceNarrator />
        <CrowdAudio />

        {/* Фаза + раунд */}
        {phase !== 'TEAM_SELECT' && PHASE_LABELS[phase] && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-center">
            <AnimatePresence mode="wait">
              <motion.div key={phase}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-[var(--ui-bg)] border border-[var(--steppe-gold)]/40 rounded-lg px-5 py-2">
                <p className="font-title text-[var(--steppe-gold)] text-xs tracking-widest uppercase">
                  {PHASE_LABELS[phase]}
                </p>
                <p className="text-gray-500 text-xs font-body mt-0.5">Раунд {round}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Наша команда — шаг 1 при выборе */}
        {playerTeam.players.length > 0 && (
          <div className={phase === 'PLAYER_CHOOSES' && !pendingRunner ? 'pointer-events-auto' : ''}>
            <TeamRoster
              team={playerTeam}
              isSelectable={phase === 'PLAYER_CHOOSES' && !pendingRunner}
              selectedId={pendingRunner?.id}
              onSelect={setPendingRunner}
            />
          </div>
        )}

        {/* Вражеская команда — шаг 2 при выборе */}
        {enemyTeam.players.length > 0 && (
          <div className={phase === 'PLAYER_CHOOSES' && !!pendingRunner ? 'pointer-events-auto' : ''}>
            <EnemyRoster
              team={enemyTeam}
              isSelectable={phase === 'PLAYER_CHOOSES' && !!pendingRunner}
              highlightedId={currentTarget?.left.id}
              onSelect={handleEnemyTargetClick}
            />
          </div>
        )}

        {/* Субтитры */}
        <Subtitles text={subtitleText} />

        {/* AI thinking indicator */}
        {isAiThinking && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[var(--steppe-gold)]/45 bg-black/70 px-4 py-2 text-center shadow-xl"
            >
              <p className="font-kazakh text-sm text-[var(--steppe-gold)]">
                AI қарсылас ойланып жатыр...
              </p>
              <p className="font-body text-xs text-white/60">AI думает...</p>
            </motion.div>
          </div>
        )}

        {/* Комментатор */}
        {(commentaryText || aiCommentary) && (
          <Commentator
            text={commentaryText || aiCommentary}
            isLoading={isCommentaryLoading}
            onDone={() => {
              store.setCommentary('')
              store.setAiCommentary('')
            }}
          />
        )}

        {/* TIMING BAR: атака (наш ход) */}
        {phase === 'PLAYER_RUNS' && currentRunner && currentTarget && (
          <div className="pointer-events-auto">
            <TimingBar
              mode="attack"
              runner={currentRunner}
              leftDefender={currentTarget.left}
              rightDefender={currentTarget.right}
              onHit={handleAttackTimingHit}
            />
          </div>
        )}

        {/* TIMING BAR: защита (ход бота) */}
        {phase === 'ENEMY_RUNS' && currentRunner && currentTarget && (
          <div className="pointer-events-auto">
            <TimingBar
              mode="defense"
              runner={currentRunner}
              leftDefender={currentTarget.left}
              rightDefender={currentTarget.right}
              onHit={handleDefenseTimingHit}
            />
          </div>
        )}

        {/* PLAYER_CHOOSES подсказка по шагам */}
        {phase === 'PLAYER_CHOOSES' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            <AnimatePresence mode="wait">
              <motion.div key={pendingRunner?.id ?? 'step1'}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-black/75 border border-[var(--steppe-gold)]/60 rounded-2xl px-8 py-5 text-center shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                {!pendingRunner ? (
                  <>
                    <p className="font-title text-[var(--steppe-gold)] text-xl mb-1">ШАГ 1</p>
                    <p className="text-white text-sm font-body">Кто побежит ломать цепь?</p>
                    <p className="text-blue-300 text-xs font-body mt-1">← Выбери своего игрока</p>
                  </>
                ) : (
                  <>
                    <p className="font-title text-[var(--steppe-gold)] text-xl mb-1">ШАГ 2</p>
                    <p className="text-white text-sm font-body">
                      <span className="text-blue-300 font-semibold">{pendingRunner.name}</span> атакует — куда?
                    </p>
                    <p className="text-red-300 text-xs font-body mt-1">Выбери цель в команде врага →</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Результат хода */}
        {phase === 'RESULT' && lastResult && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl px-10 py-5 text-center border ${
                lastResult.success ? 'bg-green-900/85 border-green-400/60' : 'bg-red-900/85 border-red-400/60'
              }`}>
              <p className={`font-title text-4xl ${lastResult.success ? 'text-green-300' : 'text-red-300'}`}>
                {lastResult.success ? '✓' : '✗'} {lastResult.message}
              </p>
              <p className="text-white/85 text-sm font-body mt-1">{lastResult.subMessage}</p>
            </motion.div>
          </div>
        )}

        {/* Кнопка назад */}
        <button onClick={() => router.push('/')}
          className="absolute top-4 left-4 text-gray-500 hover:text-white text-xs font-body
                     bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded transition-colors pointer-events-auto">
          ← Басты бет
        </button>

        {phase !== 'TEAM_SELECT' && (
          <>
            <VoiceControls />
            <VoiceCommandButton onCommand={handleVoiceCommand} />
            {phase !== 'GAME_OVER' && <AiChat />}
          </>
        )}
      </div>

      {/* Выбор команды */}
      {phase === 'TEAM_SELECT' && <TeamSelect onSelect={startWithTeam} />}

      {phase === 'TOURNAMENT_PROGRESS' && (
        <TournamentProgress
          onContinue={() => {
            resetGame()
            store.setPhase('TEAM_SELECT')
          }}
        />
      )}

      {/* Game Over */}
      {phase === 'GAME_OVER' && (
        <div className="absolute inset-0 z-50">
          <GameOver
            won={enemyTeam.players.length <= 1}
            playerTeamName={playerTeam.name}
            enemyTeamName={enemyTeam.name}
            onRestart={() => { resetGame(); store.setPhase('TEAM_SELECT') }}
          />
        </div>
      )}
    </motion.div>
  )
}
