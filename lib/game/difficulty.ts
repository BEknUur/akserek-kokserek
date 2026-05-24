export type Difficulty = 'easy' | 'normal' | 'hard' | 'impossible'

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  timingSpeed: number
  greenZoneSize: number
  aiAccuracy: number
  aiReactionDelay: number
  aiAggression: number
}> = {
  easy: {
    timingSpeed: 0.8,
    greenZoneSize: 0.28,
    aiAccuracy: 0.55,
    aiReactionDelay: 1200,
    aiAggression: 0.4,
  },
  normal: {
    timingSpeed: 1.2,
    greenZoneSize: 0.20,
    aiAccuracy: 0.72,
    aiReactionDelay: 800,
    aiAggression: 0.6,
  },
  hard: {
    timingSpeed: 1.8,
    greenZoneSize: 0.13,
    aiAccuracy: 0.87,
    aiReactionDelay: 500,
    aiAggression: 0.82,
  },
  impossible: {
    timingSpeed: 2.8,
    greenZoneSize: 0.07,
    aiAccuracy: 0.97,
    aiReactionDelay: 150,
    aiAggression: 1,
  },
}

export function simulateAiTiming(difficulty: Difficulty): boolean {
  return Math.random() < DIFFICULTY_CONFIG[difficulty].aiAccuracy
}
