import { describe, expect, it } from 'vitest'
import { withCalendarRateLimitRetry } from '../netlify/functions/sync-calendar'

function calendarError(status: number, reason: string) {
  return { code: status, response: { data: { error: { errors: [{ reason }] } } } }
}

describe('Google Calendar request retry', () => {
  it('retries rate-limit errors with increasing exponential delays', async () => {
    let attempts = 0
    const delays: number[] = []

    await expect(withCalendarRateLimitRetry(
      async () => {
        attempts += 1
        if (attempts < 4) throw calendarError(403, 'rateLimitExceeded')
        return 'ok'
      },
      { sleep: async milliseconds => { delays.push(milliseconds) }, random: () => 0 },
    )).resolves.toBe('ok')

    expect(attempts).toBe(4)
    expect(delays).toEqual([1000, 2000, 4000])
  })

  it('does not retry non-rate-limit errors', async () => {
    let attempts = 0
    const error = calendarError(403, 'requiredAccessLevel')

    await expect(withCalendarRateLimitRetry(async () => {
      attempts += 1
      throw error
    }, { sleep: async () => { throw new Error('should not wait') } })).rejects.toBe(error)

    expect(attempts).toBe(1)
  })
})
