import { Player, Team } from '@/lib/store/types'

let namesCache: { male: string[]; female: string[] } | null = null
let criesCache: { cry_kz: string; cry_ru: string }[] | null = null
let commentariesCache: Record<string, string[]> | null = null

async function getNames() {
  if (!namesCache) {
    const res = await fetch('/ai-content/names.json')
    namesCache = await res.json()
  }
  return namesCache!
}

async function getCries() {
  if (!criesCache) {
    const res = await fetch('/ai-content/cries.json')
    criesCache = await res.json()
  }
  return criesCache!
}

async function getCommentaries() {
  if (!commentariesCache) {
    const res = await fetch('/ai-content/commentaries.json')
    commentariesCache = await res.json()
  }
  return commentariesCache!
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export type TeamProfile = 'attack' | 'balanced' | 'defense'

const PROFILES: Record<TeamProfile, { kushRange: [number, number]; karRange: [number, number]; label: string; labelRu: string }> = {
  attack:   { kushRange: [6, 9], karRange: [2, 5], label: 'Батыл батырлар', labelRu: 'Отважные батыры' },
  balanced: { kushRange: [4, 7], karRange: [4, 7], label: 'Дала жауынгерлері', labelRu: 'Воины степи' },
  defense:  { kushRange: [2, 5], karRange: [6, 9], label: 'Берік қорғаныш', labelRu: 'Стойкая защита' },
}

function makeTeamFromProfile(
  names: string[],
  color: 'blue' | 'red',
  teamName: string,
  profile: TeamProfile
): Team {
  const { kushRange, karRange } = PROFILES[profile]
  const players: Player[] = names.map((name, i) => ({
    id: `${color}-${i}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    kush: rand(kushRange[0], kushRange[1]),
    karsylyk: rand(karRange[0], karRange[1]),
    description: '',
    isCaptain: i === 0,
    team: color,
    position: i,
  }))
  return { name: teamName, players, color }
}

// Генерирует обе команды из одного пула — нет дублей имён
export async function getFallbackTeams(playerProfile: TeamProfile = 'balanced'): Promise<[Team, Team]> {
  const names = await getNames()
  const allNames = [...names.male, ...names.female]
  const shuffled = [...allNames].sort(() => Math.random() - 0.5)

  return [
    makeTeamFromProfile(shuffled.slice(0, 5), 'blue', 'Ақсерек', playerProfile),
    makeTeamFromProfile(shuffled.slice(5, 10), 'red', 'Көксерек', 'balanced'),
  ]
}

export { PROFILES }
export type { TeamProfile as TProfile }

export async function getFallbackCry(): Promise<{ cry_kz: string; cry_ru: string }> {
  const cries = await getCries()
  return pick(cries)
}

export async function getFallbackCommentary(event: string): Promise<string> {
  const comms = await getCommentaries()
  const list = comms[event]
  if (list?.length) return pick(list)
  return 'Жарайсың, балам!'
}
