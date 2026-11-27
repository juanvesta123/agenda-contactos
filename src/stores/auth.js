import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const usuario = ref(null)
  const notice = ref('')
  let storageKey = ''

  function restore(apiUrl) {
    storageKey = `agenda:${apiUrl}`
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey))
      if (saved?.token && saved.usuario) {
        token.value = saved.token
        usuario.value = saved.usuario
      }
    } catch {
      // Si el navegador bloquea el almacenamiento, Pinia mantiene la sesión en memoria.
    }
  }

  function storeSession() {
    try {
      if (token.value) {
        sessionStorage.setItem(storageKey, JSON.stringify({ token: token.value, usuario: usuario.value }))
      } else {
        sessionStorage.removeItem(storageKey)
      }
    } catch {
      // La sesión sigue disponible en Pinia.
    }
  }

  function startSession(data) {
    token.value = data.token
    usuario.value = data.usuario
    notice.value = ''
    storeSession()
  }

  function updateUser(user) {
    usuario.value = user
    storeSession()
  }

  function endSession(message = '') {
    token.value = ''
    usuario.value = null
    notice.value = message
    storeSession()
  }

  function takeNotice() {
    const message = notice.value
    notice.value = ''
    return message
  }

  return { token, usuario, notice, restore, startSession, updateUser, endSession, takeNotice }
})
