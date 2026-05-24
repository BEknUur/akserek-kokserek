'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getFallbackTeam, getFallbackCry, getFallbackCommentary } from './fallbackContent'
import { calculateBreakthrough, simulateEnemyBreakthrough } from './breakthrough'
import { aiChooseVictim, chooseDefenders } from './aiOpponent'
import { checkWinCondition } from './stateMachine'

export function useGameLoop() {
  const store = useGameStore()

  // ── SETUP: генерируем команды ──────────────────────────────────────────
  const startGame = useCallback(async () => {
    store.setPhase('SETUP')
    store.setCommentary('', true)

    const [playerTeam, enemyTeam] = await Promise.all([
      getFallbackTeam('Ақсерек', 'blue'),
      getFallbackTeam('Көксерек', 'red'),
    ])
    store.setTeams(playerTeam, enemyTeam)
    store.setCommentary('', false)

    // Первый ход: враг кричит клич
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
      // Выбираем в кого врезаться
      const defenders = chooseDefenders(enemyTeam)
      store.setRunner(victim)
      store.setTarget(defenders.left, defenders.right)
      store.setPhase('PLAYER_RUNS')
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_RUNS: игрок нажал SPACE ────────────────────────────────────
  const handlePlayerHit = useCallback((power: number) => {
    const { currentRunner, currentTarget, playerTeam, enemyTeam } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return

    const result = calculateBreakthrough(
      currentRunner,
      currentTarget.left,
      currentTarget.right,
      power
    )
    store.setLastResult(result)
    store.setPhase('RESULT')

    if (result.success) {
      // Забираем игрока из цепи врага
      const capturedIdx = enemyTeam.players.findIndex(
        (p) => p.id === currentTarget.left.id
      )
      if (capturedIdx !== -1) {
        store.transferPlayer(enemyTeam.players[capturedIdx], 'blue')
      }
      store.addHighlight(`${currentRunner.name} прорвал цепь!`)
    } else {
      // Бегун переходит в плен к врагу
      store.transferPlayer(currentRunner, 'red')
      store.addHighlight(`${currentRunner.name} пойман!`)
    }

    // Проверяем победу
    const state = useGameStore.getState()
    const winner = checkWinCondition(state.playerTeam, state.enemyTeam)

    setTimeout(async () => {
      const event = result.success ? 'successful_breakthrough' : 'failed_breakthrough'
      const commentary = await getFallbackCommentary(event)
      store.setCommentary(commentary)
      store.setPhase('COMMENTARY')

      if (winner) {
        setTimeout(() => store.setPhase('GAME_OVER'), 3000)
      }
    }, 2200)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── COMMENTARY: аташка закончил говорить ──────────────────────────────
  const onCommentaryDone = useCallback(() => {
    const { playerTeam, enemyTeam } = useGameStore.getState()
    const winner = checkWinCondition(playerTeam, enemyTeam)
    if (winner) {
      store.setPhase('GAME_OVER')
      return
    }
    store.setCommentary('')
    store.setPhase('PLAYER_CHOOSES')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── PLAYER_CHOOSES: игрок выбрал кого вызвать ─────────────────────────
  const handlePlayerChooses = useCallback((targetPlayer: import('@/lib/store/types').Player) => {
    const { playerTeam, enemyTeam } = useGameStore.getState()

    // Выбираем капитана или лучшего атакующего из нашей команды
    const runner = [...playerTeam.players].sort((a, b) => b.kush - a.kush)[0]
    if (!runner) return

    // Защитники — соседи вызванного
    const idx = enemyTeam.players.findIndex((p) => p.id === targetPlayer.id)
    const leftIdx = Math.max(0, idx - 1)
    const rightIdx = Math.min(enemyTeam.players.length - 1, idx + 1)

    store.setRunner(runner)
    store.setTarget(
      enemyTeam.players[leftIdx],
      enemyTeam.players[rightIdx]
    )

    // Показываем клич
    store.setPhase('ENEMY_CRY')
    store.setSubtitle(`${runner.name}, ${targetPlayer.name}-ді жеңесің бе?`)

    setTimeout(() => {
      store.setSubtitle('')
      store.setPhase('ENEMY_RUNS')
      simulateEnemyRun()
    }, 2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── ENEMY_RUNS: симулируем бросок врага ───────────────────────────────
  const simulateEnemyRun = useCallback(() => {
    const { currentRunner, currentTarget, playerTeam, enemyTeam } = useGameStore.getState()
    if (!currentRunner || !currentTarget) return

    setTimeout(async () => {
      const result = simulateEnemyBreakthrough(
        currentRunner,
        currentTarget.left,
        currentTarget.right
      )
      store.setLastResult(result)
      store.setPhase('RESULT')

      if (result.success) {
        store.transferPlayer(currentTarget.left, 'red')
        store.addHighlight(`${currentRunner.name} прорвал нашу цепь!`)
      } else {
        store.transferPlayer(currentRunner, 'blue')
        store.addHighlight(`Мы остановили ${currentRunner.name}!`)
      }

      const state = useGameStore.getState()
      const winner = checkWinCondition(state.playerTeam, state.enemyTeam)

      setTimeout(async () => {
        const event = result.success ? 'enemy_fails' : 'team_winning'
        const commentary = await getFallbackCommentary(event)
        store.setCommentary(commentary)
        store.setPhase('COMMENTARY')

        if (winner) {
          setTimeout(() => store.setPhase('GAME_OVER'), 3000)
        }
      }, 2200)
    }, 1800)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resetGame = useCallback(() => {
    store.resetGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    startGame,
    startEnemyCry,
    handlePlayerHit,
    onCommentaryDone,
    handlePlayerChooses,
    resetGame,
  }
}
