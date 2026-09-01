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

export interface TeamMatchesResponse {
  team: {
    slug: TeamSlug
    name: string
    competition: string
    sourceUrl: string
  }
  lastMatch: Match | null
  nextMatch: Match | null
  fetchedAt: string
  stale: boolean
}

export type TeamSlug = 'u19' | 'u16' | 'u13' | 'felnott-ii' | 'nb-iii'
