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

function makeTeam(teamName: string, color: 'blue' | 'red', names: string[]): Team {
  const players: Player[] = names.map((name, i) => ({
    id: `${color}-${i}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    kush: Math.floor(Math.random() * 6) + 3,
    karsylyk: Math.floor(Math.random() * 6) + 3,
    description: '',
    isCaptain: i === 0,
    team: color,
    position: i,
  }))
  return { name: teamName, players, color }
}

// Генерирует обе команды из одного пула имён — никаких дублей между командами
export async function getFallbackTeams(): Promise<[Team, Team]> {
  const names = await getNames()
  const allNames = [...names.male, ...names.female]
  const shuffled = [...allNames].sort(() => Math.random() - 0.5)

  const blueNames = shuffled.slice(0, 5)
  const redNames = shuffled.slice(5, 10)

  return [
    makeTeam('Ақсерек', 'blue', blueNames),
    makeTeam('Көксерек', 'red', redNames),
  ]
}

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
