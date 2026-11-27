<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest } from '../api'
import { useAuthStore } from '../stores/auth'
import { usernamePattern } from '../forms'

const props = defineProps({ registro: Boolean })
const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
const notice = ref(props.registro ? '' : auth.takeNotice())

async function submit() {
  error.value = ''
  notice.value = ''
  const bytes = new TextEncoder().encode(password.value).length
  if (props.registro && (bytes < 6 || bytes > 72 || password.value.includes('\0'))) {
    error.value = 'Escribe una contraseña de 6 a 72 bytes.'
    return
  }
  busy.value = true
  const endpoint = props.registro ? 'registrar' : 'login'
  try {
    const result = await apiRequest(`auth/${endpoint}.php`, {
      method: 'POST',
      data: { nombre_de_usuario: username.value.trim(), password: password.value },
    })
    if (props.registro) {
      auth.notice = result.message || 'Cuenta creada. Ya puedes iniciar sesión.'
      await router.push('/login')
    } else {
      if (!result.token || !result.usuario) throw new Error('El servidor no devolvió una sesión válida.')
      auth.startSession(result)
      auth.notice = result.message || 'Sesión iniciada.'
      await router.push('/agenda')
    }
  } catch (failure) {
    error.value = failure.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="narrow auth-page panel">
    <h1>{{ registro ? 'Registro de usuario' : 'Iniciar sesión' }}</h1>
    <p v-if="notice" class="feedback" role="status">{{ notice }}</p>
    <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
    <form class="stacked-form" @submit.prevent="submit">
      <div class="field">
        <label for="usuario">Nombre de usuario</label>
        <input id="usuario" v-model="username" autocomplete="username"
          maxlength="50" :pattern="registro ? usernamePattern : undefined" required
          :aria-describedby="registro ? 'usuario-ayuda' : undefined">
        <small v-if="registro" id="usuario-ayuda">De 3 a 50 caracteres. Usa letras, números, punto, guion o guion bajo.</small>
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password"
          :autocomplete="registro ? 'new-password' : 'current-password'"
          :minlength="registro ? 6 : undefined" maxlength="72" required
          :aria-describedby="registro ? 'contrasena-ayuda' : undefined">
        <small v-if="registro" id="contrasena-ayuda">Mínimo 6 caracteres.</small>
      </div>
      <button class="primary" :disabled="busy">{{ registro ? 'Crear cuenta' : 'Entrar' }}</button>
    </form>
    <p v-if="registro" class="auth-link">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
    <p v-else class="auth-link">¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
  </section>
</template>
