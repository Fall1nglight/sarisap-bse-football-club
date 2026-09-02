import { describe, expect, it } from 'vitest'
import { applyJerseyNumberOverrides, normalizePlayerName } from '../shared/jerseyNumbers'

const players = [
  { name: 'Barta Dániel' },
  { name: 'Fekete Áron' },
]

describe('jersey number overrides', () => {
  it('uses null jersey numbers when the optional file is missing or empty', () => {
    const expected = [
      { name: 'Barta Dániel', number: null },
      { name: 'Fekete Áron', number: null },
    ]

    expect(applyJerseyNumberOverrides(players, 0, undefined, 5)).toEqual(expected)
    expect(applyJerseyNumberOverrides(players, 0, '', 5)).toEqual(expected)
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

    expect(applyJerseyNumberOverrides(players, 0, source, 5)).toEqual([
      { name: 'Barta Dániel', number: null },
      { name: 'Fekete Áron', number: null },
    ])
  })

  it('uses the last valid matching line', () => {
    const source = '0: Barta Dániel: 12\n0: Barta Dániel: 16'

    expect(applyJerseyNumberOverrides(players, 0, source, 5)[0].number).toBe(16)
  })

  it('does not override an ambiguous normalized name', () => {
    const duplicatePlayers = [
      { name: 'Kiss Áron' },
      { name: 'Kiss Aron' },
    ]

    expect(applyJerseyNumberOverrides(duplicatePlayers, 0, '0: Kiss Áron: 9', 5)).toEqual([
      { name: 'Kiss Áron', number: null },
      { name: 'Kiss Aron', number: null },
    ])
  })
})
