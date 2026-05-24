'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getFallbackTeams, getFallbackCry, getFallbackCommentary } from './fallbackContent'
import { calculateBreakthrough, simulateEnemyBreakthrough } from './breakthrough'
import { aiChooseVictim, chooseDefenders } from './aiOpponent'
import { checkWinCondition } from './stateMachine'

export function useGameLoop() {
  const store = useGameStore()

  // ── SETUP ──────────────────────────────────────────────────────────────
  const startGame = useCallback(async () => {
    // Guard: не запускать если игра уже началась
    if (useGameStore.getState().phase !== 'LANDING') return

    store.setPhase('SETUP')
    store.setCommentary('', true)

    const [playerTeam, enemyTeam] = await getFallbackTeams()
    store.setTeams(playerTeam, enemyTeam)
    store.setCommentary('', false)

    startEnemyCry()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_CRY ──────────────────────────────────────────────────────────
  const startEnemyCry = useCallback(async () => {
    store.setPhase('ENEMY_CRY')
    const cry = await getFallbackCry()
    store.setSubtitle(cry.cry_kz)
    setTimeout(() => {
      store.setSubtitle('')
      startEnemyChooses()
    }, 2500)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_CHOOSES ──────────────────────────────────────────────────────
  const startEnemyChooses = useCallback(() => {
    store.setPhase('ENEMY_CHOOSES')
    const { enemyTeam, playerTeam } = useGameStore.getState()

    const victim = aiChooseVictim(enemyTeam, playerTeam)
    store.setSubtitle(`«${victim.name}» — сені шақырады!`)

    setTimeout(() => {
      store.setSubtitle('')
      const { enemyTeam: latest } = useGameStore.getState()
      const defenders = chooseDefenders(latest)
      store.setRunner(victim)
      store.setTarget(defenders.left, defenders.right)
      store.setPhase('PLAYER_RUNS')
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_RUNS: игрок нажал SPACE → считаем результат, запускаем анимацию
  const handlePlayerHit = useCallback((power: number) => {
    const { currentRunner, currentTarget } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return

    const result = calculateBreakthrough(
      currentRunner,
      currentTarget.left,
      currentTarget.right,
      power
    )
    store.setLastResult(result)
    // Переходим в анимационную фазу — Runner сам доиграет и вызовет onBreakthroughAnimDone
    store.setPhase('BREAKTHROUGH_ANIM')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Вызывается из Runner.tsx когда анимация прорыва/отскока завершена
  const onBreakthroughAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')

    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      const captured = enemyTeam.players.find((p) => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'blue')
      store.addHighlight(`${currentRunner.name} жарып өтті!`)
    } else {
      const runner = playerTeam.players.find((p) => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'red')
      store.addHighlight(`${currentRunner.name} тұтқынға түсті!`)
    }

    const winner = checkWinCondition(
      useGameStore.getState().playerTeam,
      useGameStore.getState().enemyTeam
    )

    setTimeout(async () => {
      const event = lastResult.success ? 'successful_breakthrough' : 'failed_breakthrough'
      const commentary = await getFallbackCommentary(event)
      store.setCommentary(commentary)
      store.setPhase('COMMENTARY')
      if (winner) setTimeout(() => store.setPhase('GAME_OVER'), 4000)
    }, 1500)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── COMMENTARY done ────────────────────────────────────────────────────
  const onCommentaryDone = useCallback(() => {
    const { playerTeam, enemyTeam } = useGameStore.getState()
    const winner = checkWinCondition(playerTeam, enemyTeam)
    if (winner) { store.setPhase('GAME_OVER'); return }
    store.setCommentary('')
    store.setPhase('PLAYER_CHOOSES')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_CHOOSES ─────────────────────────────────────────────────────
  const handlePlayerChooses = useCallback((targetPlayer: import('@/lib/store/types').Player) => {
    const { playerTeam, enemyTeam } = useGameStore.getState()

    const runner = [...playerTeam.players].sort((a, b) => b.kush - a.kush)[0]
    if (!runner) return

    const idx = enemyTeam.players.findIndex((p) => p.id === targetPlayer.id)
    const leftIdx = Math.max(0, idx - 1)
    const rightIdx = Math.min(enemyTeam.players.length - 1, idx + 1)

    store.setRunner(runner)
    store.setTarget(enemyTeam.players[leftIdx], enemyTeam.players[rightIdx])
    store.setPhase('ENEMY_CRY')
    store.setSubtitle(`${runner.name}: «${targetPlayer.name}-ді жеңемін!»`)

    setTimeout(() => {
      store.setSubtitle('')
      store.setPhase('ENEMY_RUNS')
      simulateEnemyRun()
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_RUNS: симулируем и запускаем анимацию
  const simulateEnemyRun = useCallback(() => {
    setTimeout(() => {
      const { currentRunner, currentTarget } = useGameStore.getState()
      if (!currentRunner || !currentTarget) return

      const result = simulateEnemyBreakthrough(
        currentRunner,
        currentTarget.left,
        currentTarget.right
      )
      store.setLastResult(result)
      store.setPhase('BREAKTHROUGH_ANIM')
    }, 1800)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Вызывается из Runner.tsx когда анимация врага завершена
  const onEnemyAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')

    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      const captured = playerTeam.players.find((p) => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'red')
      store.addHighlight(`${currentRunner.name} жарып өтті!`)
    } else {
      const runner = enemyTeam.players.find((p) => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'blue')
      store.addHighlight(`${currentRunner.name} тоқтатылды!`)
    }

    const winner = checkWinCondition(
      useGameStore.getState().playerTeam,
      useGameStore.getState().enemyTeam
    )

    setTimeout(async () => {
      const event = lastResult.success ? 'enemy_fails' : 'team_winning'
      const commentary = await getFallbackCommentary(event)
      store.setCommentary(commentary)
      store.setPhase('COMMENTARY')
      if (winner) setTimeout(() => store.setPhase('GAME_OVER'), 4000)
    }, 1500)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resetGame = useCallback(() => {
    store.resetGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    startGame,
    startEnemyCry,
    handlePlayerHit,
    onBreakthroughAnimDone,
    onEnemyAnimDone,
    onCommentaryDone,
    handlePlayerChooses,
    resetGame,
  }
}
