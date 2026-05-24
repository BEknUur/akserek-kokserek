import { Difficulty } from './difficulty'

export type GameMode = 'single' | 'ai' | 'tournament'
export type TournamentStage = 'quarter' | 'semi' | 'final' | 'completed'

export const TOURNAMENT_STAGES: Record<Exclude<TournamentStage, 'completed'>, {
  label: string
  difficulty: Difficulty
  next: TournamentStage
}> = {
  quarter: {
    label: 'Quarter Final',
    difficulty: 'normal',
    next: 'semi',
  },
  semi: {
    label: 'Semi Final',
    difficulty: 'hard',
    next: 'final',
  },
  final: {
    label: 'Grand Final',
    difficulty: 'impossible',
    next: 'completed',
  },
}

export function getTournamentDifficulty(stage: TournamentStage): Difficulty {
  if (stage === 'completed') return 'impossible'
  return TOURNAMENT_STAGES[stage].difficulty
}

export function getNextTournamentStage(stage: TournamentStage): TournamentStage {
  if (stage === 'completed') return 'completed'
  return TOURNAMENT_STAGES[stage].next
}
