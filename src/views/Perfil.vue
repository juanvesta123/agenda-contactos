<script setup>
import { onMounted, ref } from 'vue'
import { apiRequest } from '../api'
import { useAuthStore } from '../stores/auth'
import CampoFoto from '../components/CampoFoto.vue'
import { usernamePattern } from '../forms'

const auth = useAuthStore()
const name = ref('')
const photo = ref(null)
const loading = ref(true)
const available = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const photoRevision = ref(0)

async function loadProfile() {
  const result = await apiRequest('auth/perfil.php', { protectedRoute: true })
  if (!result.usuario) throw new Error('El API no devolvió el perfil.')
  auth.updateUser(result.usuario)
  name.value = result.usuario.nombre_de_usuario
}

onMounted(async () => {
  try {
    await loadProfile()
    available.value = true
  } catch (failure) {
    error.value = failure.message
  } finally {
    loading.value = false
  }
})

async function save() {
  notice.value = ''
  error.value = ''
  busy.value = true
  const username = name.value.trim()
  let data = { nombre_de_usuario: username }
  if (photo.value) {
    data = new FormData()
    data.append('nombre_de_usuario', username)
    data.append('foto', photo.value)
  }
  try {
    const result = await apiRequest('auth/editar.php', { method: 'POST', data, protectedRoute: true })
    if (result.usuario) {
      auth.updateUser(result.usuario)
      name.value = result.usuario.nombre_de_usuario
    } else {
      await loadProfile()
    }
    photo.value = null
    photoRevision.value++
    notice.value = result.message || 'Perfil actualizado.'
  } catch (failure) {
    error.value = failure.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="narrow panel">
    <RouterLink class="back-link" to="/agenda">← Volver a mi agenda</RouterLink>
    <h1>Mi perfil</h1>
    <p v-if="notice" class="feedback" role="status">{{ notice }}</p>
    <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
    <p v-if="loading" role="status" class="muted">Cargando perfil…</p>
    <form v-if="available" class="stacked-form" @submit.prevent="save">
      <CampoFoto :key="photoRevision" :photo="auth.usuario?.foto" :name="name"
        label="Foto de perfil" @change="photo = $event" />
      <div class="field">
        <label for="usuario">Nombre de usuario</label>
        <input id="usuario" v-model="name" autocomplete="username" :pattern="usernamePattern" required maxlength="50">
      </div>
      <button class="primary" :disabled="busy">Guardar cambios</button>
    </form>
  </section>
</template>
