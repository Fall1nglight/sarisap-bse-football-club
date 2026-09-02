import type { Config } from '@netlify/functions'
import { google } from 'googleapis'
import { syncMlszCalendar, type CalendarEventInput, type CalendarSyncClient, type ManagedCalendarEvent } from '../../server/utils/calendar-sync.js'
import { getMlszTeamSchedule } from '../../server/utils/mlsz.js'

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'

function getConfiguration() {
  const calendarId = process.env.NUXT_PUBLIC_GOOGLE_CALENDAR_ID
  const encodedCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64

  if (!calendarId) throw new Error('Hiányzik a NUXT_PUBLIC_GOOGLE_CALENDAR_ID környezeti változó.')
  if (!encodedCredentials) throw new Error('Hiányzik a GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64 környezeti változó.')

  try {
    return {
      calendarId,
      credentials: JSON.parse(Buffer.from(encodedCredentials, 'base64').toString('utf8')) as { client_email: string, private_key: string },
    }
  }
  catch {
    throw new Error('A GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64 nem érvényes base64-kódolt JSON.')
  }
}

function createClient(calendarId: string, credentials: { client_email: string, private_key: string }): CalendarSyncClient {
  const auth = new google.auth.GoogleAuth({ credentials, scopes: [CALENDAR_SCOPE] })
  const calendar = google.calendar({ version: 'v3', auth })

  return {
    async listManagedEvents() {
      const events: ManagedCalendarEvent[] = []
      let pageToken: string | undefined

      do {
        const response = await calendar.events.list({
          calendarId,
          privateExtendedProperty: ['managedBy=sarisap-mlsz'],
          showDeleted: false,
          singleEvents: true,
          maxResults: 2500,
          pageToken,
        })
        events.push(...(response.data.items || []).filter((event): event is ManagedCalendarEvent => Boolean(event.id)))
        pageToken = response.data.nextPageToken || undefined
      } while (pageToken)

      return events
    },
    async createEvent(event: CalendarEventInput) {
      await calendar.events.insert({ calendarId, requestBody: event })
    },
    async updateEvent(eventId: string, event: CalendarEventInput) {
      const { id: _id, ...resource } = event
      await calendar.events.update({ calendarId, eventId, requestBody: resource })
    },
    async deleteEvent(eventId: string) {
      await calendar.events.delete({ calendarId, eventId })
    },
  }
}

export default async () => {
  const { calendarId, credentials } = getConfiguration()
  const result = await syncMlszCalendar({
    client: createClient(calendarId, credentials),
    loadSchedule: getMlszTeamSchedule,
  })

  console.log(JSON.stringify({ event: 'mlsz-calendar-sync', ...result }))
  return new Response(null, { status: 204 })
}

export const config: Config = { schedule: '@hourly' }
