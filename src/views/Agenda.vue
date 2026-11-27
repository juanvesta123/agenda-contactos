<script setup>
import { onMounted, ref } from 'vue'
import Avatar from '../components/Avatar.vue'
import { apiRequest } from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const contactos = ref([])
const loading = ref(true)
const error = ref('')
const notice = ref(auth.takeNotice())

onMounted(async () => {
  try {
    const data = await apiRequest('contactos/index.php', { protectedRoute: true })
    if (!Array.isArray(data.contactos)) throw new Error('El API no devolvió la lista de contactos.')
    contactos.value = data.contactos
  } catch (failure) {
    error.value = failure.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Mi agenda</h1>
        <p v-if="!loading && !error" class="muted">{{ contactos.length }} {{ contactos.length === 1 ? 'contacto' : 'contactos' }}</p>
      </div>
      <RouterLink class="button primary" to="/agenda/crear">Nuevo contacto</RouterLink>
    </div>

    <p v-if="notice" class="feedback" role="status">{{ notice }}</p>
    <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
    <p v-if="loading" class="muted" role="status">Cargando contactos…</p>
    <div v-else-if="!error && !contactos.length" class="panel empty">
      <h2>Tu agenda está vacía</h2>
      <p class="muted">Usa «Nuevo contacto» para guardar el primero.</p>
    </div>
    <ul v-else-if="contactos.length" class="contact-list" aria-label="Contactos">
      <li v-for="contacto in contactos" :key="contacto.id" class="contact-row">
        <Avatar :photo="contacto.foto" :name="contacto.nombre" />
        <div class="contact-text">
          <h2>{{ contacto.nombre }}{{ contacto.apellido ? ' ' + contacto.apellido : '' }}</h2>
          <p>{{ contacto.telefono }}<span v-if="contacto.email" class="contact-email">{{ contacto.email }}</span></p>
        </div>
        <RouterLink class="button secondary" :aria-label="'Editar ' + contacto.nombre" :to="'/agenda/' + contacto.id">Editar</RouterLink>
      </li>
    </ul>
  </section>
</template>
