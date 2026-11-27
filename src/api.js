import { getApiUrl } from './config/api'
import { useAuthStore } from './stores/auth'

export async function apiRequest(endpoint, { method = 'GET', data, protectedRoute = false } = {}) {
  if (!getApiUrl()) throw new Error('La URL del API no está disponible.')

  const auth = useAuthStore()
  const headers = { Accept: 'application/json' }
  const isForm = data instanceof FormData
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (protectedRoute) headers.Authorization = `Bearer ${auth.token}`

  let response
  try {
    response = await fetch(`${getApiUrl()}/${endpoint}`, {
      method,
      headers,
      body: data === undefined || isForm ? data : JSON.stringify(data),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
  }

  const result = await response.json().catch(() => null)
  if (protectedRoute && response.status === 401) auth.endSession('Tu sesión terminó. Vuelve a entrar.')
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'El servidor no devolvió una respuesta válida.')
  }
  return result
}
