import { load } from 'cheerio'
import { DateTime } from 'luxon'
import { getTeamBySlug } from '../../shared/teams.js'
import type { Match, TeamMatchesResponse, TeamSlug } from '../../shared/types/match.js'

const BUDAPEST_TIMEZONE = 'Europe/Budapest'
const CACHE_MAX_AGE_MS = 60 * 60 * 1000
const STALE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const REQUEST_TIMEOUT_MS = 8_000
const SCORE_PATTERN = /^(\d+)\s*-\s*(\d+)$/

export interface ParsedMatch extends Match {
  timestamp: number
  isInfo: boolean
}

interface CachedTeamMatches {
  value: TeamMatchesResponse
  expiresAt: number
  staleUntil: number
}

const cache = new Map<TeamSlug, CachedTeamMatches>()
const refreshes = new Map<TeamSlug, Promise<TeamMatchesResponse>>()

export function clearMlszMatchCacheForTesting() {
  cache.clear()
  refreshes.clear()
}

function cleanText(value: string | undefined): string {
  return (value || '').replace(/\s+/g, ' ').trim()
}

function parseDate(value: string): { date: string, timestamp: number } | null {
  const normalized = cleanText(value)
  const parsed = DateTime.fromFormat(normalized, 'yyyy. MM. dd. HH:mm', {
    locale: 'hu-HU',
    zone: BUDAPEST_TIMEZONE,
  })

  if (!parsed.isValid) return null

  return {
    date: parsed.toISO({ suppressMilliseconds: true }) || parsed.toUTC().toISO(),
    timestamp: parsed.toMillis(),
  }
}

function absoluteUrl(value: string | undefined, sourceUrl: string): string | undefined {
  if (!value) return undefined

  try {
    return new URL(value, sourceUrl).toString()
  }
  catch {
    return undefined
  }
}

export function parseMlszSchedule(html: string, slug: TeamSlug): ParsedMatch[] {
  const team = getTeamBySlug(slug)
  if (!team) return []

  const $ = load(html)
  const matches: ParsedMatch[] = []

  $('.team-sorsolas .schedule').each((_, element) => {
    const row = $(element)
    const parsedDate = parseDate(cleanText(row.find('.team_sorsolas_date').first().text()))
    const homeTeam = cleanText(row.find('.home_team').first().text())
    const awayTeam = cleanText(row.find('.away_team').first().text())
    const venue = cleanText(row.find('.team_sorsolas_arena').first().text())
    const scoreText = cleanText(row.find('.schedule-points').first().text())
    const score = scoreText.match(SCORE_PATTERN)
    const isInfo = scoreText.toUpperCase() === 'INFO'

    if (!parsedDate || !homeTeam || !awayTeam || !venue) return

    const sourceUrl = absoluteUrl(
      row.find('.team_sorsolas_date a, .result-cont a').first().attr('href'),
      team.sourceUrl,
    )

    matches.push({
      id: cleanText(row.attr('rel')) || `${slug}-${parsedDate.timestamp}-${homeTeam}-${awayTeam}`,
      date: parsedDate.date,
      timestamp: parsedDate.timestamp,
      isInfo,
      competition: team.competition,
      homeTeam,
      awayTeam,
      venue,
      status: score ? 'finished' : 'upcoming',
      ...(score ? { homeScore: Number(score[1]), awayScore: Number(score[2]) } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
    })
  })

  return matches
}

export function selectRelevantMatches(schedule: ParsedMatch[], now = Date.now()) {
  const lastMatch = schedule
    .filter(match => match.status === 'finished')
    .sort((left, right) => right.timestamp - left.timestamp)[0] || null
  const nextMatch = schedule
    .filter(match => match.status === 'upcoming' && !match.isInfo && match.timestamp > now)
    .sort((left, right) => left.timestamp - right.timestamp)[0] || null

  return { lastMatch, nextMatch }
}

async function fetchSchedule(sourceUrl: string): Promise<string> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(sourceUrl, {
        headers: {
          accept: 'text/html,application/xhtml+xml',
          'user-agent': 'Sarisapi-BSE-match-display/1.0',
        },
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`MLSZ HTTP ${response.status}`)
      return await response.text()
    }
    catch (error) {
      lastError = error
    }
    finally {
      clearTimeout(timeout)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Az MLSZ oldal nem érhető el.')
}

export async function getMlszTeamSchedule(slug: TeamSlug): Promise<ParsedMatch[]> {
  const team = getTeamBySlug(slug)
  if (!team) throw new Error(`Ismeretlen csapat: ${slug}`)

  const schedule = parseMlszSchedule(await fetchSchedule(team.sourceUrl), slug)
  if (!schedule.length) throw new Error(`Az MLSZ nem adott feldolgozható menetrendet: ${team.name}`)

  return schedule
}

async function refreshTeamMatches(slug: TeamSlug): Promise<TeamMatchesResponse> {
  const team = getTeamBySlug(slug)
  if (!team) throw new Error(`Ismeretlen csapat: ${slug}`)

  const schedule = await getMlszTeamSchedule(slug)
  const now = Date.now()
  const { lastMatch, nextMatch } = selectRelevantMatches(schedule, now)

  const stripInternalFields = ({ timestamp: _timestamp, isInfo: _isInfo, ...match }: ParsedMatch): Match => match
  const value: TeamMatchesResponse = {
    team: {
      slug,
      name: team.name,
      competition: team.competition,
      sourceUrl: team.sourceUrl,
    },
    lastMatch: lastMatch ? stripInternalFields(lastMatch) : null,
    nextMatch: nextMatch ? stripInternalFields(nextMatch) : null,
    fetchedAt: new Date().toISOString(),
    stale: false,
  }

  cache.set(slug, {
    value,
    expiresAt: now + CACHE_MAX_AGE_MS,
    staleUntil: now + STALE_MAX_AGE_MS,
  })

  return value
}

export async function getMlszTeamMatches(slug: TeamSlug): Promise<TeamMatchesResponse> {
  const cached = cache.get(slug)
  const now = Date.now()

  if (cached && cached.expiresAt > now) return { ...cached.value, stale: false }

  let refresh = refreshes.get(slug)
  if (!refresh) {
    refresh = refreshTeamMatches(slug)
    refreshes.set(slug, refresh)
  }

  try {
    return await refresh
  }
  catch (error) {
    if (cached && cached.staleUntil > now) return { ...cached.value, stale: true }
    throw error
  }
  finally {
    refreshes.delete(slug)
  }
}
