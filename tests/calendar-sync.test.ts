import { describe, expect, it } from 'vitest'
import { teamDefinitions } from '../shared/teams'
import type { TeamSlug } from '../shared/types/match'
import {
  getCalendarEventId,
  syncMlszCalendar,
  toCalendarEvent,
  type CalendarEventInput,
  type CalendarSyncClient,
  type ManagedCalendarEvent,
} from '../server/utils/calendar-sync'
import type { ParsedMatch } from '../server/utils/mlsz'

function match(id: string, date = '2026-09-05T16:30:00+02:00'): ParsedMatch {
  return {
    id,
    date,
    timestamp: Date.parse(date),
    isInfo: false,
    competition: 'Teszt bajnokság',
    homeTeam: 'Sárisápi BSE',
    awayTeam: 'Vendég SE',
    venue: 'Sárisápi Sporttelep',
    status: 'upcoming',
    sourceUrl: `https://adatbank.mlsz.hu/match/${id}`,
  }
}

function toManagedEvent(event: CalendarEventInput): ManagedCalendarEvent {
  return { ...event }
}

function createClient(initial: ManagedCalendarEvent[] = []) {
  const events = new Map(initial.map(event => [event.id, event]))
  const calls = { created: 0, updated: 0, deleted: 0, active: 0, maxActive: 0 }
  const recordWrite = async (operation: () => void) => {
    calls.active += 1
    calls.maxActive = Math.max(calls.maxActive, calls.active)
    await new Promise(resolve => setTimeout(resolve, 1))
    operation()
    calls.active -= 1
  }
  const client: CalendarSyncClient = {
    async listManagedEvents() { return [...events.values()] },
    async createEvent(event) { await recordWrite(() => { calls.created += 1; events.set(event.id, toManagedEvent(event)) }); return 'created' as const },
    async updateEvent(eventId, event) { await recordWrite(() => { calls.updated += 1; events.set(eventId, { ...toManagedEvent(event), id: eventId }) }) },
    async deleteEvent(eventId) { await recordWrite(() => { calls.deleted += 1; events.delete(eventId) }) },
  }
  return { client, events, calls }
}

function schedules(overrides: Partial<Record<TeamSlug, ParsedMatch[]>> = {}) {
  return new Map(teamDefinitions.map(team => [team.slug, overrides[team.slug] || [match(`${team.slug}-match`)]]))
}

describe('MLSZ calendar sync', () => {
  it('maps a match to a stable, two-hour Budapest calendar event', () => {
    const team = teamDefinitions[0]
    const event = toCalendarEvent(team, match('stable-id'))

    expect(event.id).toBe(getCalendarEventId(team.slug, 'stable-id'))
    expect(event.id).toMatch(/^sbse[a-f0-9]+$/)
    expect(event.summary).toBe('Mérkőzés · Sárisápi BSE – Vendég SE')
    expect(event.end.dateTime).toBe('2026-09-05T18:30:00+02:00')
    expect(event.extendedProperties.private).toMatchObject({ managedBy: 'sarisap-mlsz', teamSlug: team.slug, mlszMatchId: 'stable-id' })
  })

  it('creates once, then updates changed MLSZ events without touching manual events', async () => {
    const manualEvent: ManagedCalendarEvent = { id: 'manual-training', summary: 'U16 edzés', start: { dateTime: '2026-09-06T17:00:00+02:00' } }
    const { client, events, calls } = createClient([manualEvent])
    const source = schedules()
    const loadSchedule = async (slug: TeamSlug) => source.get(slug) || []

    const first = await syncMlszCalendar({ client, loadSchedule, now: Date.parse('2026-09-01T00:00:00+02:00') })
    expect(calls.created).toBe(teamDefinitions.length)
    expect(first.teams.every(team => team.created === 1)).toBe(true)

    await syncMlszCalendar({ client, loadSchedule, now: Date.parse('2026-09-01T00:00:00+02:00') })
    expect(calls.created).toBe(teamDefinitions.length)
    expect(calls.updated).toBe(0)

    source.set('u16', [match('u16-match', '2026-09-06T18:00:00+02:00')])
    await syncMlszCalendar({ client, loadSchedule, now: Date.parse('2026-09-01T00:00:00+02:00') })
    expect(calls.updated).toBe(1)
    expect(events.get('manual-training')).toEqual(manualEvent)
    expect(calls.maxActive).toBe(1)
  })

  it('counts a duplicate-id recovery as an update', async () => {
    const { client, calls } = createClient()
    client.createEvent = async () => 'updated'

    const result = await syncMlszCalendar({ client, loadSchedule: async () => [match('conflict')] })

    expect(result.teams.every(team => team.created === 0 && team.updated === 1)).toBe(true)
    expect(calls.created).toBe(0)
  })

  it('loads MLSZ schedules in parallel while serializing calendar writes', async () => {
    const { client, calls } = createClient()
    let activeLoads = 0
    let maxActiveLoads = 0

    await syncMlszCalendar({
      client,
      loadSchedule: async slug => {
        activeLoads += 1
        maxActiveLoads = Math.max(maxActiveLoads, activeLoads)
        await new Promise(resolve => setTimeout(resolve, 1))
        activeLoads -= 1
        return [match(`${slug}-match`)]
      },
    })

    expect(maxActiveLoads).toBe(teamDefinitions.length)
    expect(calls.maxActive).toBe(1)
  })

  it('deletes only a successfully loaded team\'s missing future managed event and reports a failed source', async () => {
    const stale = toCalendarEvent(teamDefinitions[0], match('removed-match', '2026-09-10T16:30:00+02:00'))
    const { client, events, calls } = createClient([toManagedEvent(stale)])
    const source = schedules({ 'nb-iii': [match('replacement-match')] })

    const result = await syncMlszCalendar({
      client,
      loadSchedule: async (slug) => {
        if (slug === 'u13') throw new Error('MLSZ átmenetileg nem elérhető')
        return source.get(slug) || []
      },
      now: Date.parse('2026-09-01T00:00:00+02:00'),
    })

    expect(calls.deleted).toBe(1)
    expect(events.has(stale.id)).toBe(false)
    expect(result.teams.find(team => team.team === 'u13')?.error).toContain('átmenetileg')
  })
})
