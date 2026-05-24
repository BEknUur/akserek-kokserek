import { Team, Player } from '@/lib/store/types'
import { Difficulty, DIFFICULTY_CONFIG } from './difficulty'

/**
 * AI выбирает кого вызвать из команды игрока.
 * Стратегия: с вероятностью 60% — атакует самого сильного (kush),
 * с 40% — ищет слабое звено (минимальный karsylyk).
 */
export function aiChooseVictim(enemyTeam: Team, playerTeam: Team): Player {
  const targets = playerTeam.players
  if (targets.length === 0) throw new Error('No targets')

  const strategy = Math.random()

  if (strategy < 0.6) {
    // Убрать самую большую угрозу — максимальный kush
    return [...targets].sort((a, b) => b.kush - a.kush)[0]
  } else {
    // Атаковать слабое звено — минимальный karsylyk
    return [...targets].sort((a, b) => a.karsylyk - b.karsylyk)[0]
  }
}

export function chooseAiRunner(enemyTeam: Team, playerTeam: Team, difficulty: Difficulty): Player {
  const players = enemyTeam.players
  if (players.length === 0) throw new Error('No AI runners')

  const config = DIFFICULTY_CONFIG[difficulty]
  const aiIsLosing = enemyTeam.players.length < playerTeam.players.length
  const aggression = Math.min(1, config.aiAggression + (aiIsLosing ? 0.15 : -0.08))

  if (difficulty === 'impossible' || Math.random() < aggression) {
    return [...players].sort((a, b) => b.kush - a.kush)[0]
  }

  if (difficulty === 'easy' && Math.random() > config.aiAccuracy) {
    return players[Math.floor(Math.random() * players.length)]
  }

  const topRunners = [...players].sort((a, b) => b.kush - a.kush).slice(0, Math.max(1, Math.ceil(players.length / 2)))
  return topRunners[Math.floor(Math.random() * topRunners.length)]
}

/**
 * Выбирает двух защитников цепи, в которую врезается бегун.
 * Берём центральную пару или случайных соседей.
 */
export function chooseDefenders(
  defenderTeam: Team,
  runnerTargetIndex?: number
): { left: Player; right: Player } {
  const players = defenderTeam.players
  if (players.length < 2) {
    return { left: players[0], right: players[0] }
  }

  // Выбираем точку атаки — случайный зазор между соседними игроками
  const idx = runnerTargetIndex !== undefined
    ? Math.min(runnerTargetIndex, players.length - 2)
    : Math.floor(Math.random() * (players.length - 1))

  return {
    left: players[idx],
    right: players[idx + 1],
  }
}

export function chooseAiDefenders(
  defenderTeam: Team,
  enemyTeam: Team,
  difficulty: Difficulty
): { left: Player; right: Player } {
  const players = defenderTeam.players
  if (players.length < 2) {
    return { left: players[0], right: players[0] }
  }

  const config = DIFFICULTY_CONFIG[difficulty]
  const aiIsLosing = enemyTeam.players.length < defenderTeam.players.length
  const aggression = Math.min(1, config.aiAggression + (aiIsLosing ? 0.12 : 0))

  if (difficulty === 'easy' && Math.random() > config.aiAccuracy) {
    return chooseDefenders(defenderTeam)
  }

  const pairs = players.slice(0, -1).map((left, index) => {
    const right = players[index + 1]
    return {
      left,
      right,
      weakScore: left.karsylyk + right.karsylyk,
      threatScore: left.kush + right.kush,
    }
  })

  const ranked = pairs.sort((a, b) => {
    const aScore = a.weakScore - a.threatScore * aggression * 0.15
    const bScore = b.weakScore - b.threatScore * aggression * 0.15
    return aScore - bScore
  })

  if (difficulty === 'impossible') {
    return { left: ranked[0].left, right: ranked[0].right }
  }

  const poolSize = difficulty === 'hard' ? 2 : 3
  const pool = ranked.slice(0, Math.min(poolSize, ranked.length))
  const pick = pool[Math.floor(Math.random() * pool.length)]
  return { left: pick.left, right: pick.right }
}
