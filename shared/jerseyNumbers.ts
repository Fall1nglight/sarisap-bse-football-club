export interface NamedPlayer {
  name: string
}

export interface NumberedPlayer extends NamedPlayer {
  number: number | null
}

interface JerseyNumberOverride {
  teamIndex: number
  normalizedName: string
  number: number
}

export function normalizePlayerName(name: string) {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('hu-HU')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function parseJerseyNumberOverrides(source: string | undefined, teamCount: number) {
  if (!source) return [] as JerseyNumberOverride[]

  return source.split(/\r?\n/).flatMap((line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return []

    const match = /^(\d+)\s*:\s*(.+?)\s*:\s*(\d+)\s*$/.exec(trimmedLine)
    if (!match) return []

    const teamIndexValue = match[1] || ''
    const name = match[2] || ''
    const numberValue = match[3] || ''
    const teamIndex = Number(teamIndexValue)
    const number = Number(numberValue)
    const normalizedName = normalizePlayerName(name)

    if (!Number.isInteger(teamIndex) || teamIndex < 0 || teamIndex >= teamCount
      || !Number.isInteger(number) || number < 1 || !normalizedName) return []

    return [{ teamIndex, normalizedName, number }]
  })
}

export function applyJerseyNumberOverrides<T extends NamedPlayer>(
  players: readonly T[],
  teamIndex: number,
  source: string | undefined,
  teamCount: number,
): Array<T & NumberedPlayer> {
  const overrides = parseJerseyNumberOverrides(source, teamCount)
  const resolvedPlayers = players.map(player => ({ ...player, number: null }) as T & NumberedPlayer)

  for (const override of overrides) {
    if (override.teamIndex !== teamIndex) continue

    const matchingIndexes = resolvedPlayers
      .map((player, index) => normalizePlayerName(player.name) === override.normalizedName ? index : -1)
      .filter(index => index >= 0)

    if (matchingIndexes.length !== 1) continue

    const index = matchingIndexes[0]
    if (index === undefined) continue
    const player = resolvedPlayers[index]
    if (!player) continue
    resolvedPlayers[index] = { ...player, number: override.number }
  }

  return resolvedPlayers
}
