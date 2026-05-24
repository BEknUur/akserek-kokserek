'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getFallbackTeams, getFallbackCry, getFallbackCommentary, TeamProfile } from './fallbackContent'
import { calculateBreakthrough, calculateDefense } from './breakthrough'
import { aiChooseVictim, chooseDefenders } from './aiOpponent'
import { checkWinCondition } from './stateMachine'

export function useGameLoop() {
  const store = useGameStore()

  // ── TEAM_SELECT → SETUP ───────────────────────────────────────────────
  const startWithTeam = useCallback(async (profile: TeamProfile) => {
    store.setPhase('SETUP')
    store.setCommentary('', true)
    const [playerTeam, enemyTeam] = await getFallbackTeams(profile)
    store.setTeams(playerTeam, enemyTeam)
    store.setCommentary('', false)
    startEnemyCry()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_CRY ─────────────────────────────────────────────────────────
  const startEnemyCry = useCallback(async () => {
    store.setPhase('ENEMY_CRY')
    const cry = await getFallbackCry()
    store.setSubtitle(cry.cry_kz)
    setTimeout(() => {
      store.setSubtitle('')
      startEnemyChooses()
    }, 2500)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_CHOOSES ─────────────────────────────────────────────────────
  const startEnemyChooses = useCallback(() => {
    store.setPhase('ENEMY_CHOOSES')
    const { enemyTeam, playerTeam } = useGameStore.getState()
    const victim = aiChooseVictim(enemyTeam, playerTeam)
    store.setSubtitle(`«${victim.name}» — сені шақырады!`)
    setTimeout(() => {
      store.setSubtitle('')
      // Враг (victim) атакует нашу (playerTeam) цепь
      const { playerTeam: latest } = useGameStore.getState()
      const defenders = chooseDefenders(latest)
      store.setRunner(victim)
      store.setTarget(defenders.left, defenders.right)
      store.setPhase('ENEMY_RUNS')  // → игрок жмёт ПРОБЕЛ для ЗАЩИТЫ
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_RUNS: игрок жмёт ПРОБЕЛ → атака ───────────────────────────
  const handlePlayerHit = useCallback((power: number) => {
    const { currentRunner, currentTarget } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return

    const result = calculateBreakthrough(currentRunner, currentTarget.left, currentTarget.right, power)
    store.setLastResult(result)
    store.setPhase('BREAKTHROUGH_ANIM')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── После анимации атаки ─────────────────────────────────────────────
  const onBreakthroughAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')
    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      // Успех атаки: захватываем защитника
      const captured = enemyTeam.players.find(p => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'blue')
      store.addHighlight(`${currentRunner.name} жарып өтті!`)
    } else {
      // Провал атаки: наш игрок попадает в плен
      const runner = playerTeam.players.find(p => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'red')
      store.addHighlight(`${currentRunner.name} тұтқынға түсті!`)
    }

    await showCommentary(lastResult.success ? 'successful_breakthrough' : 'failed_breakthrough')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── COMMENTARY done ───────────────────────────────────────────────────
  const onCommentaryDone = useCallback(() => {
    const { playerTeam, enemyTeam } = useGameStore.getState()
    const winner = checkWinCondition(playerTeam, enemyTeam)
    if (winner) { store.setPhase('GAME_OVER'); return }
    store.setCommentary('')
    store.setPhase('PLAYER_CHOOSES')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_CHOOSES: игрок выбрал своего бегуна и цель в enemy ────────
  // ourRunner = наш игрок который побежит
  // enemyTarget = враг между чьими соседями будем рвать
  const handlePlayerChooses = useCallback((
    ourRunner: import('@/lib/store/types').Player,
    enemyTarget: import('@/lib/store/types').Player
  ) => {
    const { enemyTeam } = useGameStore.getState()

    const idx = enemyTeam.players.findIndex(p => p.id === enemyTarget.id)
    const leftIdx  = Math.max(0, idx - 1)
    const rightIdx = Math.min(enemyTeam.players.length - 1, idx + 1)

    store.setRunner(ourRunner)
    store.setTarget(enemyTeam.players[leftIdx], enemyTeam.players[rightIdx])

    store.setPhase('ENEMY_CRY')
    store.setSubtitle(`${ourRunner.name}: «${enemyTarget.name}-ді жеңемін!»`)

    setTimeout(() => {
      store.setSubtitle('')
      store.setPhase('PLAYER_RUNS')  // → игрок жмёт ПРОБЕЛ для АТАКИ
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_RUNS: игрок жмёт ПРОБЕЛ → защита ───────────────────────────
  const handleDefenseHit = useCallback((accuracy: number) => {
    const { currentRunner, currentTarget } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return

    // success = true → цепь устояла (враг не прорвался)
    const result = calculateDefense(currentRunner, currentTarget.left, currentTarget.right, accuracy)
    store.setLastResult(result)
    store.setPhase('BREAKTHROUGH_ANIM')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── После анимации защиты ─────────────────────────────────────────────
  const onEnemyAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')
    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      // Цепь устояла: враг идёт к нам в команду
      const runner = enemyTeam.players.find(p => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'blue')
      store.addHighlight(`${currentRunner.name} тоқтатылды!`)
    } else {
      // Цепь прорвана: наш защитник попадает к врагу
      const captured = playerTeam.players.find(p => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'red')
      store.addHighlight(`${currentRunner.name} жарып өтті!`)
    }

    await showCommentary(lastResult.success ? 'team_winning' : 'enemy_fails')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Вспомогательная: показ комментария + смена фазы ──────────────────
  const showCommentary = async (event: string) => {
    const winner = checkWinCondition(
      useGameStore.getState().playerTeam,
      useGameStore.getState().enemyTeam
    )
    setTimeout(async () => {
      const text = await getFallbackCommentary(event)
      store.setCommentary(text)
      store.setPhase('COMMENTARY')
      if (winner) setTimeout(() => store.setPhase('GAME_OVER'), 4000)
    }, 1200)
  }

  const resetGame = useCallback(() => {
    store.resetGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    startWithTeam,
    handlePlayerHit,
    handleDefenseHit,
    onBreakthroughAnimDone,
    onEnemyAnimDone,
    onCommentaryDone,
    handlePlayerChooses,
    resetGame,
  }
}
