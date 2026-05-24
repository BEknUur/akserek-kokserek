import { Player, BreakthroughResult } from '@/lib/store/types'

/**
 * Атака: наш игрок бежит на вражескую цепь
 * timerHitPower 0–100 — точность попадания в BreakthroughBar
 * Успех: kush × точность × rand > chainStrength × 0.7
 */
export function calculateBreakthrough(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const attackPower = runner.kush * accuracy
  const randomFactor = 0.8 + Math.random() * 0.4
  const required = chainStrength * 0.65
  const success = attackPower * randomFactor > required

  return {
    success,
    power: Math.round(attackPower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: success ? leftDefender : undefined,
  }
}

/**
 * Защита: враг бежит на нашу цепь, мы жмём ПРОБЕЛ
 * timerHitPower 0–100 — точность защиты (DefenseBar)
 * Враг НЕ прорывается если: chainStrength × accuracy × rand > runner.kush × 0.65
 * То есть: success = true означает "цепь устояла" (мы успешно защитились)
 */
export function calculateDefense(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const defensePower = chainStrength * accuracy
  const randomFactor = 0.8 + Math.random() * 0.4
  const required = runner.kush * 0.65
  // success = true → мы успешно защитились (враг не прорвался)
  const defended = defensePower * randomFactor > required

  return {
    success: defended,   // true = chain held = runner captured
    power: Math.round(defensePower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: defended ? runner : leftDefender,
  }
}
