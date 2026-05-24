import { create } from 'zustand'
import { GameState, GamePhase, Player, Team, BreakthroughResult } from './types'

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void
  setTeams: (playerTeam: Team, enemyTeam: Team) => void
  setRunner: (runner: Player) => void
  setTarget: (left: Player, right: Player) => void
  setLastResult: (result: BreakthroughResult) => void
  setCommentary: (text: string, loading?: boolean) => void
  setSubtitle: (text: string) => void
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
  playerTeam: defaultPlayerTeam,
  enemyTeam: defaultEnemyTeam,
  round: 1,
  currentRunner: undefined,
  currentTarget: undefined,
  lastResult: undefined,
  commentaryText: '',
  subtitleText: '',
  isCommentaryLoading: false,
  highlights: [],
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setTeams: (playerTeam, enemyTeam) => set({ playerTeam, enemyTeam }),

  setRunner: (runner) => set({ currentRunner: runner }),

  setTarget: (left, right) => set({ currentTarget: { left, right } }),

  setLastResult: (result) => set({ lastResult: result }),

  setCommentary: (text, loading = false) =>
    set({ commentaryText: text, isCommentaryLoading: loading }),

  setSubtitle: (text) => set({ subtitleText: text }),

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

  resetGame: () => set(initialState),
}))
