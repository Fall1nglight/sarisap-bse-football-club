import { describe, expect, it } from 'vitest'
import { applyJerseyNumberOverrides, normalizePlayerName } from '../shared/jerseyNumbers'

const players = [
  { name: 'Barta Dániel', number: 1, position: 'Kapus' },
  { name: 'Fekete Áron', number: 2, position: 'Védő' },
]

describe('jersey number overrides', () => {
  it('keeps the source numbers when the optional file is missing or empty', () => {
    expect(applyJerseyNumberOverrides(players, 0, undefined, 5)).toEqual(players)
    expect(applyJerseyNumberOverrides(players, 0, '', 5)).toEqual(players)
  })

  it('matches names independently of case, accents, punctuation, and whitespace', () => {
    const result = applyJerseyNumberOverrides(players, 0, '0:  barta   daniel : 18', 5)

    expect(result[0].number).toBe(18)
    expect(normalizePlayerName('Barta Dániel')).toBe(normalizePlayerName('  BARTA-daniel  '))
  })

  it('ignores malformed, out-of-range, unknown, and invalid-number entries', () => {
    const source = [
      'hibás sor',
      '5: Barta Dániel: 12',
      '0: Ismeretlen Játékos: 12',
      '0: Barta Dániel: 0',
      '0: Barta Dániel: 12.5',
    ].join('\n')

    expect(applyJerseyNumberOverrides(players, 0, source, 5)).toEqual(players)
  })

  it('uses the last valid matching line', () => {
    const source = '0: Barta Dániel: 12\n0: Barta Dániel: 16'

    expect(applyJerseyNumberOverrides(players, 0, source, 5)[0].number).toBe(16)
  })

  it('does not override an ambiguous normalized name', () => {
    const duplicatePlayers = [
      { name: 'Kiss Áron', number: 3 },
      { name: 'Kiss Aron', number: 4 },
    ]

    expect(applyJerseyNumberOverrides(duplicatePlayers, 0, '0: Kiss Áron: 9', 5)).toEqual(duplicatePlayers)
  })
})
