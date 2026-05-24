import { create } from 'zustand'
import { GameState, GamePhase, Player, Team, BreakthroughResult } from './types'
import { Difficulty } from '@/lib/game/difficulty'
import { WeatherType } from '@/lib/game/weatherSystem'
import { GameMode, TournamentStage } from '@/lib/game/tournament'
import { defaultLocale, Locale } from '@/lib/i18n/types'

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void
  setLocale: (locale: Locale) => void
  setOpponentType: (type: 'bot' | 'openai') => void
  setDifficulty: (difficulty: Difficulty) => void
  setGameMode: (mode: GameMode) => void
  setWeather: (weather: WeatherType) => void
  setTauntText: (text: string) => void
  setTournamentStage: (stage: TournamentStage) => void
  setTeams: (playerTeam: Team, enemyTeam: Team) => void
  setRunner: (runner: Player) => void
  setTarget: (left: Player, right: Player) => void
  setLastResult: (result: BreakthroughResult) => void
  setCommentary: (text: string, loading?: boolean) => void
  setSubtitle: (text: string) => void
  setAiThinking: (isThinking: boolean) => void
  setAiCommentary: (text: string) => void
  setVoiceEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
  setSpeaking: (isSpeaking: boolean) => void
  transferPlayer: (player: Player, toTeam: 'blue' | 'red') => void
  addHighlight: (event: string) => void
  resetGame: () => void
}

const defaultPlayerTeam: Team = {
  name: 'Ақсерек',
  players: [],
  color: 'blue',
}

const defaultEnemyTeam: Team = {
  name: 'Көксерек',
  players: [],
  color: 'red',
}

const initialState: GameState = {
  phase: 'LANDING',
  locale: defaultLocale,
  playerTeam: defaultPlayerTeam,
  enemyTeam: defaultEnemyTeam,
  round: 1,
  opponentType: 'bot',
  difficulty: 'normal',
  gameMode: 'single',
  weather: 'sunny',
  tauntText: '',
  tournamentStage: 'quarter',
  currentRunner: undefined,
  currentTarget: undefined,
  lastResult: undefined,
  commentaryText: '',
  subtitleText: '',
  isCommentaryLoading: false,
  isAiThinking: false,
  aiCommentary: '',
  isVoiceEnabled: true,
  volume: 0.8,
  isSpeaking: false,
  highlights: [],
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setLocale: (locale) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('akserek-locale', locale)
      document.documentElement.lang = locale
    }
    set({ locale })
  },

  setOpponentType: (type) => set({ opponentType: type }),

  setDifficulty: (difficulty) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('akserek-difficulty', difficulty)
    }
    set({ difficulty })
  },

  setGameMode: (mode) => set({ gameMode: mode }),

  setWeather: (weather) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('akserek-weather', weather)
    }
    set({ weather })
  },

  setTauntText: (text) => set({ tauntText: text }),

  setTournamentStage: (stage) => set({ tournamentStage: stage }),

  setTeams: (playerTeam, enemyTeam) => set({ playerTeam, enemyTeam }),

  setRunner: (runner) => set({ currentRunner: runner }),

  setTarget: (left, right) => set({ currentTarget: { left, right } }),

  setLastResult: (result) => set({ lastResult: result }),

  setCommentary: (text, loading = false) =>
    set({ commentaryText: text, isCommentaryLoading: loading }),

  setSubtitle: (text) => set({ subtitleText: text }),

  setAiThinking: (isThinking) => set({ isAiThinking: isThinking }),

  setAiCommentary: (text) => set({ aiCommentary: text }),

  setVoiceEnabled: (enabled) => set({ isVoiceEnabled: enabled }),

  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),

  setSpeaking: (isSpeaking) => set({ isSpeaking }),

  transferPlayer: (player, toTeam) =>
    set((state) => {
      const fromTeamKey = player.team === 'blue' ? 'playerTeam' : 'enemyTeam'
      const toTeamKey = toTeam === 'blue' ? 'playerTeam' : 'enemyTeam'

      const updatedPlayer: Player = { ...player, team: toTeam }

      const fromTeam = {
        ...state[fromTeamKey],
        players: state[fromTeamKey].players.filter((p) => p.id !== player.id),
      }

      const toTeamObj = {
        ...state[toTeamKey],
        players: [
          ...state[toTeamKey].players,
          { ...updatedPlayer, position: state[toTeamKey].players.length },
        ],
      }

      return {
        [fromTeamKey]: fromTeam,
        [toTeamKey]: toTeamObj,
      }
    }),

  addHighlight: (event) =>
    set((state) => ({ highlights: [...state.highlights, event] })),

  resetGame: () =>
    set((state) => ({
      ...initialState,
      difficulty: state.difficulty,
      locale: state.locale,
      opponentType: state.opponentType,
      gameMode: state.gameMode,
      weather: state.weather,
      tournamentStage: state.tournamentStage,
      isVoiceEnabled: state.isVoiceEnabled,
      volume: state.volume,
    })),
}))
