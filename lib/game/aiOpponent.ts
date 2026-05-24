import { Team, Player } from '@/lib/store/types'

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
