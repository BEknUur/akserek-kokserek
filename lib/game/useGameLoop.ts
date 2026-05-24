'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getFallbackTeams, getFallbackCommentary, TeamProfile } from './fallbackContent'
import { calculateBreakthrough, calculateDefense } from './breakthrough'
import { aiChooseVictim, chooseDefenders } from './aiOpponent'
import { checkWinCondition } from './stateMachine'
import { Player } from '@/lib/store/types'

export function useGameLoop() {
  const store = useGameStore()

  // ─── 1. СТАРТ: выбрали команду ──────────────────────────────────────
  const startWithTeam = useCallback(async (profile: TeamProfile) => {
    store.setPhase('SETUP')
    const [playerTeam, enemyTeam] = await getFallbackTeams(profile)
    store.setTeams(playerTeam, enemyTeam)
    store.setPhase('PLAYER_CHOOSES')
  }, []) // eslint-disable-line

  // ─── 2. PLAYER_CHOOSES → PLAYER_RUNS ────────────────────────────────
  // Игрок выбрал своего бегуна и gap во вражеской цепи
  const handlePlayerAttackChoice = useCallback((ourRunner: Player, enemyGapTarget: Player) => {
    const { enemyTeam } = useGameStore.getState()
    const idx = enemyTeam.players.findIndex(p => p.id === enemyGapTarget.id)
    // Защитники — соседи выбранного (они держат цепь слева и справа)
    const li = Math.max(0, idx - 1)
    const ri = Math.min(enemyTeam.players.length - 1, idx + 1)
    store.setRunner(ourRunner)
    store.setTarget(enemyTeam.players[li], enemyTeam.players[ri])
    store.setSubtitle(`${ourRunner.name} бежит на цепь!`)
    setTimeout(() => store.setSubtitle(''), 1500)
    store.setPhase('PLAYER_RUNS')
  }, []) // eslint-disable-line

  // ─── 3. PLAYER_RUNS: игрок нажал SPACE (атака) ──────────────────────
  const handleAttackTimingHit = useCallback((power: number) => {
    const { currentRunner, currentTarget } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return
    const result = calculateBreakthrough(currentRunner, currentTarget.left, currentTarget.right, power)
    store.setLastResult(result)
    store.setPhase('BREAKTHROUGH_ANIM')
  }, []) // eslint-disable-line

  // ─── 4. Анимация атаки завершена → применяем результат ──────────────
  const onPlayerAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')
    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      // Успех: захватываем врага
      const captured = enemyTeam.players.find(p => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'blue')
    } else {
      // Провал: наш бегун идёт к врагу
      const runner = playerTeam.players.find(p => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'red')
    }

    const { playerTeam: pt, enemyTeam: et } = useGameStore.getState()
    const winner = checkWinCondition(pt, et)

    const event = lastResult.success ? 'successful_breakthrough' : 'failed_breakthrough'
    const commentary = await getFallbackCommentary(event)
    store.setCommentary(commentary)

    setTimeout(() => {
      store.setCommentary('')
      if (winner) { store.setPhase('GAME_OVER'); return }
      startBotTurn()
    }, 2500)
  }, []) // eslint-disable-line

  // ─── 5. BOT_CHOOSING → ENEMY_RUNS ───────────────────────────────────
  const startBotTurn = useCallback(() => {
    const { enemyTeam, playerTeam } = useGameStore.getState()
    if (enemyTeam.players.length < 2) { store.setPhase('GAME_OVER'); return }

    // Бот выбирает своего лучшего атакующего
    const botRunner = aiChooseVictim(playerTeam, enemyTeam) // он "атакует" нашу команду
    // Бот выбирает gap в нашей цепи
    const defenders = chooseDefenders(playerTeam)

    store.setRunner(botRunner)
    store.setTarget(defenders.left, defenders.right)
    store.setSubtitle(`${botRunner.name} атакует вашу цепь!`)
    store.setPhase('BOT_CHOOSING')

    setTimeout(() => {
      store.setSubtitle('')
      store.setPhase('ENEMY_RUNS')  // → игрок жмёт ПРОБЕЛ для ЗАЩИТЫ
    }, 2000)
  }, []) // eslint-disable-line

  // ─── 6. ENEMY_RUNS: игрок нажал SPACE (защита) ──────────────────────
  const handleDefenseTimingHit = useCallback((power: number) => {
    const { currentRunner, currentTarget } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return
    // success = true → цепь устояла (бот пойман)
    const result = calculateDefense(currentRunner, currentTarget.left, currentTarget.right, power)
    store.setLastResult(result)
    store.setPhase('BREAKTHROUGH_ANIM')
  }, []) // eslint-disable-line

  // ─── 7. Анимация защиты завершена → применяем результат ─────────────
  const onBotAnimDone = useCallback(async () => {
    const { currentRunner, currentTarget, lastResult } = useGameStore.getState()
    if (!currentRunner || !currentTarget || !lastResult) return

    store.setPhase('RESULT')
    const { enemyTeam, playerTeam } = useGameStore.getState()

    if (lastResult.success) {
      // Защита удалась: бот идёт к нам
      const runner = enemyTeam.players.find(p => p.id === currentRunner.id)
      if (runner) store.transferPlayer(runner, 'blue')
    } else {
      // Бот прорвался: наш защитник уходит к врагу
      const captured = playerTeam.players.find(p => p.id === currentTarget.left.id)
      if (captured) store.transferPlayer(captured, 'red')
    }

    const { playerTeam: pt, enemyTeam: et } = useGameStore.getState()
    const winner = checkWinCondition(pt, et)

    const event = lastResult.success ? 'team_winning' : 'enemy_fails'
    const commentary = await getFallbackCommentary(event)
    store.setCommentary(commentary)

    setTimeout(() => {
      store.setCommentary('')
      if (winner) { store.setPhase('GAME_OVER'); return }
      store.setPhase('PLAYER_CHOOSES')
    }, 2500)
  }, []) // eslint-disable-line

  const resetGame = useCallback(() => {
    store.resetGame()
  }, []) // eslint-disable-line

  return {
    startWithTeam,
    handlePlayerAttackChoice,
    handleAttackTimingHit,
    handleDefenseTimingHit,
    onPlayerAnimDone,
    onBotAnimDone,
    resetGame,
  }
}
