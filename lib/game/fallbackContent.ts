import { Player, Team } from '@/lib/store/types'
import { Locale, defaultLocale } from '@/lib/i18n/types'

let namesCache: { male: string[]; female: string[] } | null = null
const criesCache: Partial<Record<Locale, { cry_kz: string; cry_ru: string }[]>> = {}
const commentariesCache: Partial<Record<Locale, Record<string, string[]>>> = {}

async function getNames() {
  if (!namesCache) {
    const res = await fetch('/ai-content/names.json')
    namesCache = await res.json()
  }
  return namesCache!
}

async function getCries(locale: Locale = defaultLocale) {
  if (!criesCache[locale]) {
    const res = await fetch(`/ai-content/cries.${locale}.json`)
    criesCache[locale] = await res.json()
  }
  return criesCache[locale]!
}

async function getCommentaries(locale: Locale = defaultLocale) {
  if (!commentariesCache[locale]) {
    const res = await fetch(`/ai-content/commentaries.${locale}.json`)
    commentariesCache[locale] = await res.json()
  }
  return commentariesCache[locale]!
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

let generatingTeams = false  // guard против двойного вызова (StrictMode)

// Генерирует обе команды из одного пула — нет дублей имён
export async function getFallbackTeams(playerProfile: TeamProfile = 'balanced'): Promise<[Team, Team]> {
  if (generatingTeams) {
    // Вернём пустышку — guard сработал
    return [
      makeTeamFromProfile([], 'blue', 'Ақсерек', playerProfile),
      makeTeamFromProfile([], 'red', 'Көксерек', 'balanced'),
    ]
  }
  generatingTeams = true

  const names = await getNames()
  // Убираем дубли из обоих списков перед объединением
  const allNames = [...new Set([...names.male, ...names.female])]
  const shuffled = [...allNames].sort(() => Math.random() - 0.5)

  const blueNames = shuffled.slice(0, 5)
  const redNames  = shuffled.slice(5, 10)

  generatingTeams = false
  return [
    makeTeamFromProfile(blueNames, 'blue', 'Ақсерек', playerProfile),
    makeTeamFromProfile(redNames,  'red',  'Көксерек', 'balanced'),
  ]
}

export { PROFILES }
export type { TeamProfile as TProfile }

export async function getFallbackCry(locale: Locale = defaultLocale): Promise<{ cry_kz: string; cry_ru: string }> {
  const cries = await getCries(locale)
  return pick(cries)
}

export async function getFallbackCommentary(event: string, locale: Locale = defaultLocale): Promise<string> {
  const comms = await getCommentaries(locale)
  const list = comms[event]
  if (list?.length) return pick(list)
  return locale === 'kk' ? 'Жарайсың, балам!' : 'Молодец, сынок!'
}
