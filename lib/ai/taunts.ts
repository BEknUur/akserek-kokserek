import { BreakthroughResult, Team } from '@/lib/store/types'
import { Difficulty } from '@/lib/game/difficulty'

type TauntContext = {
  result?: BreakthroughResult
  playerTeam: Team
  enemyTeam: Team
  difficulty: Difficulty
}

const TAUNTS = {
  winning: [
    'Сен дайын емессің.',
    'Бұл деңгей сен үшін емес.',
    'Келесіде құлайсың.',
  ],
  losing: [
    'Кездейсоқ болды.',
    'Әлі біткен жоқ.',
    'Мен қайта ораламын.',
  ],
  playerMissed: [
    'Көрдің бе? Шебің әлсіз.',
    'Бұлай жеңе алмайсың.',
    'Қадамың ауырлап қалды.',
  ],
  perfectHit: [
    'Мықты екенсің... бірақ бұл соңы емес.',
    'Жақсы соққы. Енді менің кезегім.',
    'Күшің бар екен.',
  ],
  impossible: [
    'Сен дайын емессің.',
    'Бұл деңгей сен үшін емес.',
    'Мен сені сындырамын.',
  ],
}

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)]
}

export function getAiTaunt({ result, playerTeam, enemyTeam, difficulty }: TauntContext): string {
  const aiWinning = enemyTeam.players.length > playerTeam.players.length
  const aiLosing = enemyTeam.players.length < playerTeam.players.length

  if (difficulty === 'impossible' && Math.random() < 0.45) {
    return pick(TAUNTS.impossible)
  }

  if (result?.mode === 'attack' && !result.success) return pick(TAUNTS.playerMissed)
  if (result?.mode === 'attack' && result.success && result.power >= result.required + 10) return pick(TAUNTS.perfectHit)
  if (aiWinning) return pick(TAUNTS.winning)
  if (aiLosing) return pick(TAUNTS.losing)

  return pick([...TAUNTS.winning, ...TAUNTS.losing])
}
