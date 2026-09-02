import { createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import { teamDefinitions, type TeamDefinition } from '../../shared/teams.js'
import type { TeamSlug } from '../../shared/types/match.js'
import type { ParsedMatch } from './mlsz.js'

const TIMEZONE = 'Europe/Budapest'
const MANAGED_BY = 'sarisap-mlsz'

export interface CalendarEventInput {
  id: string
  summary: string
  description: string
  location: string
  start: { dateTime: string, timeZone: string }
  end: { dateTime: string, timeZone: string }
  extendedProperties: { private: Record<string, string> }
}

export interface ManagedCalendarEvent {
  id: string
  summary?: string | null
  description?: string | null
  location?: string | null
  start?: { dateTime?: string | null }
  end?: { dateTime?: string | null }
  extendedProperties?: { private?: Record<string, string> | null } | null
}

export interface CalendarSyncClient {
  listManagedEvents(): Promise<ManagedCalendarEvent[]>
  createEvent(event: CalendarEventInput): Promise<'created' | 'updated'>
  updateEvent(eventId: string, event: CalendarEventInput): Promise<void>
  deleteEvent(eventId: string): Promise<void>
}

export interface TeamSyncResult {
  team: TeamSlug
  created: number
  updated: number
  unchanged: number
  deleted: number
  error?: string
}

export interface CalendarSyncResult {
  teams: TeamSyncResult[]
}

type LoadedTeam =
  | { team: TeamDefinition, schedule: ParsedMatch[] }
  | { team: TeamDefinition, error: string }

export function getCalendarEventId(teamSlug: TeamSlug, matchId: string): string {
  const digest = createHash('sha256').update(`${teamSlug}:${matchId}`).digest('hex')
  return `sbse${digest}`
}

export function toCalendarEvent(team: TeamDefinition, match: ParsedMatch): CalendarEventInput {
  const start = DateTime.fromISO(match.date, { zone: TIMEZONE })
  if (!start.isValid) throw new Error(`Érvénytelen MLSZ időpont: ${match.date}`)

  const score = match.status === 'finished' && match.homeScore !== undefined && match.awayScore !== undefined
    ? `\nEredmény: ${match.homeScore}–${match.awayScore}`
    : ''
  const source = match.sourceUrl ? `\nMLSZ: ${match.sourceUrl}` : ''
  const privateProperties = {
    managedBy: MANAGED_BY,
    mlszMatchId: match.id,
    teamSlug: team.slug,
  }

  return {
    id: getCalendarEventId(team.slug, match.id),
    summary: `Mérkőzés · ${match.homeTeam} – ${match.awayTeam}`,
    description: `Csapat: ${team.name}\nBajnokság: ${match.competition}${score}${source}`,
    location: match.venue,
    start: { dateTime: start.toISO({ suppressMilliseconds: true })!, timeZone: TIMEZONE },
    end: { dateTime: start.plus({ hours: 2 }).toISO({ suppressMilliseconds: true })!, timeZone: TIMEZONE },
    extendedProperties: { private: privateProperties },
  }
}

function getManagedEventKey(event: ManagedCalendarEvent): string | undefined {
  const properties = event.extendedProperties?.private
  if (properties?.managedBy !== MANAGED_BY || !properties.teamSlug || !properties.mlszMatchId) return undefined
  return `${properties.teamSlug}:${properties.mlszMatchId}`
}

function isSameEvent(existing: ManagedCalendarEvent, desired: CalendarEventInput): boolean {
  const existingProperties = existing.extendedProperties?.private || {}
  return existing.summary === desired.summary
    && existing.description === desired.description
    && existing.location === desired.location
    && existing.start?.dateTime === desired.start.dateTime
    && existing.end?.dateTime === desired.end.dateTime
    && Object.entries(desired.extendedProperties.private).every(([key, value]) => existingProperties[key] === value)
}

function isFutureEvent(event: ManagedCalendarEvent, now: number): boolean {
  const dateTime = event.start?.dateTime
  return Boolean(dateTime && Date.parse(dateTime) > now)
}

function emptyTeamResult(team: TeamSlug): TeamSyncResult {
  return { team, created: 0, updated: 0, unchanged: 0, deleted: 0 }
}

export async function syncMlszCalendar({
  client,
  loadSchedule,
  now = Date.now(),
}: {
  client: CalendarSyncClient
  loadSchedule: (slug: TeamSlug) => Promise<ParsedMatch[]>
  now?: number
}): Promise<CalendarSyncResult> {
  const loadedTeams: LoadedTeam[] = await Promise.all(teamDefinitions.map(async (team): Promise<LoadedTeam> => {
    try {
      const schedule = (await loadSchedule(team.slug)).filter(match => !match.isInfo)
      if (!schedule.length) throw new Error('Az MLSZ menetrend nem tartalmaz feldolgozható mérkőzést.')
      return { team, schedule }
    }
    catch (error) {
      return { team, error: error instanceof Error ? error.message : 'Ismeretlen MLSZ hiba.' }
    }
  }))

  if (!loadedTeams.some(result => 'schedule' in result)) throw new Error('Egyetlen MLSZ menetrend sem volt feldolgozható.')

  const existingByKey = new Map(
    (await client.listManagedEvents())
      .map(event => [getManagedEventKey(event), event] as const)
      .filter((entry): entry is [string, ManagedCalendarEvent] => Boolean(entry[0])),
  )

  const teams: TeamSyncResult[] = []

  for (const loaded of loadedTeams) {
      const result = emptyTeamResult(loaded.team.slug)
      if ('error' in loaded) {
        teams.push({ ...result, error: loaded.error })
        continue
      }

      const desiredEvents = loaded.schedule.map(match => toCalendarEvent(loaded.team, match))
      const desiredKeys = new Set(loaded.schedule.map(match => `${loaded.team.slug}:${match.id}`))

      for (const event of desiredEvents) {
        const existing = existingByKey.get(`${loaded.team.slug}:${event.extendedProperties.private.mlszMatchId}`)
        if (!existing) {
          const action = await client.createEvent(event)
          result[action] += 1
        }
        else if (isSameEvent(existing, event)) {
          result.unchanged += 1
        }
        else {
          await client.updateEvent(existing.id, event)
          result.updated += 1
        }
      }

      const staleEvents = [...existingByKey.entries()]
        .filter(([key, event]) => key.startsWith(`${loaded.team.slug}:`) && !desiredKeys.has(key) && isFutureEvent(event, now))
        .map(([, event]) => event)

      for (const event of staleEvents) {
        await client.deleteEvent(event.id)
        result.deleted += 1
      }

      teams.push(result)
  }

  return { teams }
}
