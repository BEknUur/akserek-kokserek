import { Player, BreakthroughResult } from '@/lib/store/types'
import { Locale } from '@/lib/i18n/types'

export function resolveTimingResult(mode: 'attack' | 'defense', hitGreen: boolean, locale: Locale = 'kk') {
  if (mode === 'attack') {
    return {
      success: hitGreen,
      message: hitGreen
        ? locale === 'kk' ? 'ЖАРЫП ӨТТІ!' : 'ПРОРВАЛСЯ!'
        : locale === 'kk' ? 'ҰСТАЛЫП ҚАЛДЫ!' : 'НЕ СМОГ ПРОРВАТЬСЯ!',
      subMessage: hitGreen
        ? locale === 'kk' ? 'Ақсерек шепті бұзды!' : 'Игрок прорвался!'
        : locale === 'kk' ? 'Бегун тоқтатылды!' : 'Бегун остановлен!',
    }
  }

  return {
    success: hitGreen,
    message: hitGreen
      ? locale === 'kk' ? 'ҚОРҒАНЫС СӘТТІ!' : 'ЗАЩИТА УСПЕШНА!'
      : locale === 'kk' ? 'ЖАРЫП ӨТТІ!' : 'ПРОРВАЛСЯ!',
    subMessage: hitGreen
      ? locale === 'kk' ? 'Шеп ұсталды!' : 'Цепь удержана!'
      : locale === 'kk' ? 'Көксерек шепті бұзды!' : 'Бот прорвал цепь!',
  }
}

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
 *
 * Исход хода определяется попаданием в зелёную зону; расчёт силы оставлен
 * для отображения и баланса тайминг-бара.
 */
export function calculateBreakthrough(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number,   // 0–100 из BreakthroughBar
  hitGreen: boolean,
  locale: Locale = 'kk'
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const attackPower = runner.kush * (0.5 + accuracy * 0.6)
  const randomFactor = 0.85 + Math.random() * 0.3
  const required = chainStrength * 0.55
  const outcome = resolveTimingResult('attack', hitGreen, locale)

  return {
    mode: 'attack',
    ...outcome,
    power: Math.round(attackPower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: outcome.success ? leftDefender : undefined,
  }
}

/**
 * ЗАЩИТА: враг бежит, мы жмём ПРОБЕЛ чтобы удержать цепь
 *
 * defensePower = chainStrength × (0.5 + accuracy × 0.6)
 * required = runner.kush × 0.55
 * success = true → цепь устояла (враг пойман)
 *
 * В режиме защиты success означает успех пользователя, а не успех бота.
 */
export function calculateDefense(
  runner: Player,
  leftDefender: Player,
  rightDefender: Player,
  timerHitPower: number,
  hitGreen: boolean,
  locale: Locale = 'kk'
): BreakthroughResult {
  const chainStrength = (leftDefender.karsylyk + rightDefender.karsylyk) / 2
  const accuracy = timerHitPower / 100
  const defensePower = chainStrength * (0.5 + accuracy * 0.6)
  const randomFactor = 0.85 + Math.random() * 0.3
  const required = runner.kush * 0.55
  const outcome = resolveTimingResult('defense', hitGreen, locale)

  return {
    mode: 'defense',
    ...outcome,
    power: Math.round(defensePower * randomFactor * 10),
    required: Math.round(required * 10),
    capturedPlayer: outcome.success ? runner : leftDefender,
  }
}
