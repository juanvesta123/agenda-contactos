<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiRequest } from './api'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const error = ref('')
const busy = ref(false)

watch(() => auth.token, (token) => {
  if (!token && route.meta.protected) router.replace('/login')
})

async function logout() {
  busy.value = true
  error.value = ''
  try {
    const result = await apiRequest('auth/logout.php', { method: 'POST', protectedRoute: true })
    auth.endSession(result.message || 'Sesión cerrada.')
    await router.replace('/login')
  } catch (failure) {
    if (auth.token) error.value = failure.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/">Agenda de contactos</RouterLink>
      <nav aria-label="Navegación principal">
        <template v-if="auth.token">
          <RouterLink to="/agenda">Mi agenda</RouterLink>
          <RouterLink to="/perfil">Perfil</RouterLink>
          <button class="nav-button" type="button" :disabled="busy" @click="logout">Salir</button>
        </template>
        <template v-else>
          <RouterLink to="/">Inicio</RouterLink>
        </template>
      </nav>
    </div>
  </header>
  <main class="page">
    <p v-if="error" role="alert" class="feedback error">{{ error }}</p>
    <RouterView :key="route.fullPath" />
  </main>
</template>
