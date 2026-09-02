export interface Match {
  id: string
  date: string
  competition: string
  homeTeam: string
  awayTeam: string
  venue: string
  status: 'upcoming' | 'finished'
  homeScore?: number
  awayScore?: number
  sourceUrl?: string
}

export interface TeamPlayer {
  name: string
  age: number | null
  sourceUrl: string
}

export interface TeamDataResponse {
  team: {
    slug: TeamSlug
    name: string
    competition: string
    sourceUrl: string
  }
  lastMatch: Match | null
  nextMatch: Match | null
  players: TeamPlayer[]
  fetchedAt: string
  stale: boolean
}

export type TeamSlug = 'u19' | 'u16' | 'u13' | 'felnott-ii' | 'nb-iii'
