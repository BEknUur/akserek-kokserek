import { Player, BreakthroughResult } from '@/lib/store/types'

/**
 * АТАКА: наш игрок бежит на вражескую цепь
 *
 * Формула: attackPower = kush × (0.5 + accuracy × 0.6)
 *   - даже 0% timing даёт 50% от силы (базовая инерция)
 *   - 100% timing даёт 110% от силы (прыжок в момент удара)
 *
 * required = chainStrength × 0.55
 *   - при kush=4, accuracy=75%: 4×0.95=3.8 vs 7×0.55=3.85 → на грани
 *   - при kush=4, accuracy=90%: 4×1.04=4.16 > 3.85 → УСПЕХ
 *   - при kush=7, accuracy=50%: 7×0.8=5.6 > 3.85 → лёгкий успех
 */
export function calculateBreakthrough(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number   // 0–100 из BreakthroughBar
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const attackPower = runner.kush * (0.5 + accuracy * 0.6)
  const randomFactor = 0.85 + Math.random() * 0.3
  const required = chainStrength * 0.55
  const success = attackPower * randomFactor > required

  return {
    success,
    power: Math.round(attackPower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: success ? leftDefender : undefined,
  }
}

/**
 * ЗАЩИТА: враг бежит, мы жмём ПРОБЕЛ чтобы удержать цепь
 *
 * defensePower = chainStrength × (0.5 + accuracy × 0.6)
 * required = runner.kush × 0.55
 * success = true → цепь устояла (враг пойман)
 */
export function calculateDefense(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const defensePower = chainStrength * (0.5 + accuracy * 0.6)
  const randomFactor = 0.85 + Math.random() * 0.3
  const required = runner.kush * 0.55
  const defended = defensePower * randomFactor > required

  return {
    success: defended,
    power: Math.round(defensePower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: defended ? runner : leftDefender,
  }
}
