let apiUrl = ''

export async function loadApiUrl() {
  const response = await fetch(`${import.meta.env.BASE_URL}public/config.json`, { cache: 'no-store' })
  if (!response.ok) throw new Error('No se pudo leer public/config.json.')

  const config = await response.json()
  const url = new URL(config.API_URL)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('API_URL debe ser una URL HTTP o HTTPS válida.')
  }
  apiUrl = url.href.replace(/\/+$/, '')
  return apiUrl
}

export function getApiUrl() {
  return apiUrl
}

export function photoUrl(value) {
  if (!value || !apiUrl) return ''
  try {
    const url = new URL(value, `${apiUrl}/`)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}
