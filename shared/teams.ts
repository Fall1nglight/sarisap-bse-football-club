import type { TeamSlug } from './types/match.js'

export interface TeamDefinition {
  id: number
  slug: TeamSlug
  name: string
  competition: string
  sourceUrl: string
  profile: 'adult' | 'youth'
  ageGroup?: 'U13' | 'U16' | 'U19'
}

export const teamDefinitions: readonly TeamDefinition[] = [
  {
    id: 0,
    slug: 'nb-iii',
    name: 'Sárisápi BSE',
    competition: 'NB III. Észak-Nyugati csoport',
    sourceUrl: 'https://adatbank.mlsz.hu/club/67/0/34055/7/328718.html',
    profile: 'adult',
  },
  {
    id: 1,
    slug: 'felnott-ii',
    name: 'Sárisápi BSE II.',
    competition: 'T.I.O. FFI FELNŐTT ALAPSZAKASZ',
    sourceUrl: 'https://adatbank.mlsz.hu/club/67/12/33789/3/331829.html',
    profile: 'adult',
  },
  {
    id: 2,
    slug: 'u19',
    name: 'Sárisápi BSE U19',
    competition: 'T.II.O. UP FFI U-19 ALAPSZAKASZ',
    sourceUrl: 'https://adatbank.mlsz.hu/club/67/12/33797/1/333249.html',
    profile: 'youth',
    ageGroup: 'U19',
  },
  {
    id: 3,
    slug: 'u16',
    name: 'Sárisápi BSE U16',
    competition: 'T.II.O. UP FIÚ U-16 ÉSZAK ALAPSZAKASZ',
    sourceUrl: 'https://adatbank.mlsz.hu/club/67/12/33799/1/335015.html',
    profile: 'youth',
    ageGroup: 'U16',
  },
  {
    id: 4,
    slug: 'u13',
    name: 'Sárisápi BSE U13',
    competition: 'UP FIÚ U-13 ÉSZAK',
    sourceUrl: 'https://adatbank.mlsz.hu/club/67/12/34480/1/336503.html',
    profile: 'youth',
    ageGroup: 'U13',
  },
]

export const teamNavigation = teamDefinitions.map(team => ({
  label: team.competition,
  to: `/csapatok/${team.slug}`,
}))

export function getTeamBySlug(slug: string): TeamDefinition | undefined {
  return teamDefinitions.find(team => team.slug === slug)
}
