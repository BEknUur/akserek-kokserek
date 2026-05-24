import { Player, BreakthroughResult } from '@/lib/store/types'

export function calculateBreakthrough(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number  // 0–100 из BreakthroughBar
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const attackPower = runner.kush * (timerHitPower / 100)
  const randomFactor = 0.85 + Math.random() * 0.3  // ±15%
  const required = chainStrength * 0.7
  const success = attackPower * randomFactor > required

  return {
    success,
    power: Math.round(attackPower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: success ? leftDefender : undefined,
  }
}

// Для фазы ENEMY_RUNS — симулируем бросок AI
export function simulateEnemyBreakthrough(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player
): BreakthroughResult {
  // AI попадает в зону с вероятностью, зависящей от силы бегуна
  const hitChance = 0.3 + (runner.kush / 10) * 0.4  // 30%–70%
  const timerHitPower = Math.random() < hitChance
    ? 50 + Math.random() * 50   // попал в хорошую зону
    : Math.random() * 40         // мимо

  return calculateBreakthrough(runner, leftDefender, rightDefender, timerHitPower)
}
