import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearMlszMatchCacheForTesting,
  getMlszTeamMatches,
  parseMlszSchedule,
  selectRelevantMatches,
} from '../server/utils/mlsz'

function scheduleRow({
  id,
  date,
  home = 'Sárisápi BSE',
  away = 'Vendég SE',
  venue = 'Sárisápi Bányász SE Sporttelep',
  score = '',
}: {
  id: string
  date: string
  home?: string
  away?: string
  venue?: string
  score?: string
}) {
  return `
    <div class="schedule" rel="${id}">
      <span class="home_team">${home}</span>
      <span class="away_team">${away}</span>
      <span class="team_sorsolas_date"><a href="/match/${id}">${date}</a></span>
      <span class="team_sorsolas_arena">${venue}</span>
      <span class="schedule-points">${score}</span>
    </div>
  `
}

describe('MLSZ schedule parser', () => {
  it('parses finished and future matches while ignoring incomplete rows', () => {
    const html = `
      <div class="team-sorsolas">
        ${scheduleRow({ id: 'finished', date: '2026. 08. 30. 17:30', score: '3 - 1' })}
        ${scheduleRow({ id: 'future', date: '2026. 09. 05. 16:30' })}
        ${scheduleRow({ id: 'incomplete', date: 'hibás dátum', venue: '' })}
      </div>
    `

    const matches = parseMlszSchedule(html, 'nb-iii')

    expect(matches).toHaveLength(2)
    expect(matches[0]).toMatchObject({
      id: 'finished',
      status: 'finished',
      homeScore: 3,
      awayScore: 1,
      sourceUrl: 'https://adatbank.mlsz.hu/match/finished',
    })
    expect(matches[1]).toMatchObject({ id: 'future', status: 'upcoming', isInfo: false })
  })

  it('selects by date rather than source order and excludes INFO and unscored past rows', () => {
    const html = `
      <div class="team-sorsolas">
        ${scheduleRow({ id: 'future-later', date: '2026. 09. 20. 16:30' })}
        ${scheduleRow({ id: 'finished-old', date: '2026. 08. 10. 16:30', score: '2-0' })}
        ${scheduleRow({ id: 'info', date: '2026. 09. 03. 16:30', score: 'INFO' })}
        ${scheduleRow({ id: 'past-unscored', date: '2026. 08. 31. 16:30' })}
        ${scheduleRow({ id: 'finished-new', date: '2026. 08. 30. 16:30', score: '1-1' })}
        ${scheduleRow({ id: 'future-next', date: '2026. 09. 05. 16:30' })}
      </div>
    `

    const selected = selectRelevantMatches(
      parseMlszSchedule(html, 'nb-iii'),
      Date.parse('2026-09-01T10:00:00+02:00'),
    )

    expect(selected.lastMatch?.id).toBe('finished-new')
    expect(selected.nextMatch?.id).toBe('future-next')
  })
})

describe('MLSZ match cache', () => {
  afterEach(() => {
    clearMlszMatchCacheForTesting()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('uses a fresh cache entry and returns the last good entry as stale after a failed refresh', async () => {
    let now = Date.parse('2026-09-01T10:00:00+02:00')
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const fetchMock = vi.fn().mockResolvedValue(new Response(`
      <div class="team-sorsolas">
        ${scheduleRow({ id: 'finished', date: '2026. 08. 30. 16:30', score: '1-0' })}
        ${scheduleRow({ id: 'future', date: '2026. 09. 05. 16:30' })}
      </div>
    `))
    vi.stubGlobal('fetch', fetchMock)

    const first = await getMlszTeamMatches('nb-iii')
    const cached = await getMlszTeamMatches('nb-iii')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(cached).toEqual(first)

    now += 60 * 60 * 1000 + 1
    fetchMock.mockRejectedValue(new Error('MLSZ nem elérhető'))

    await expect(getMlszTeamMatches('nb-iii')).resolves.toMatchObject({
      stale: true,
      lastMatch: { id: 'finished' },
      nextMatch: { id: 'future' },
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
