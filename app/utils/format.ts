export const formatDate = (value: string, options: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Budapest',
    ...options,
  }).format(new Date(value))

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('hu-HU', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Europe/Budapest',
  }).format(new Date(value))

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat('hu-HU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Budapest',
  }).format(new Date(value))
