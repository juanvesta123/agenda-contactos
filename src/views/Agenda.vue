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
  <section aria-labelledby="agenda-titulo">
    <div class="page-heading">
      <h1 id="agenda-titulo">Mis contactos</h1>
      <RouterLink class="button primary" to="/agenda/crear">
        <span aria-hidden="true">+</span> Nuevo contacto
      </RouterLink>
    </div>

    <p v-if="notice" class="feedback" role="status">{{ notice }}</p>
    <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
    <p v-if="loading" class="muted" role="status">Cargando contactos…</p>
    <div v-else-if="!error && !contactos.length" class="panel empty">
      <h2>Tu agenda está vacía</h2>
      <p class="muted">Usa «Nuevo contacto» para guardar el primero.</p>
    </div>
    <div v-else-if="contactos.length" class="table-frame">
      <table class="contact-table" aria-labelledby="agenda-titulo">
        <colgroup>
          <col class="photo-column">
          <col class="name-column">
          <col class="phone-column">
          <col>
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Foto</th>
            <th scope="col">Nombre</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contacto in contactos" :key="contacto.id">
            <td><Avatar :photo="contacto.foto" :name="contacto.nombre" /></td>
            <th scope="row" class="contact-name">
              {{ contacto.nombre }}{{ contacto.apellido ? ' ' + contacto.apellido : '' }}
            </th>
            <td class="contact-phone">{{ contacto.telefono }}</td>
            <td>
              <div class="contact-actions">
                <RouterLink class="button secondary compact" :aria-label="'Ver ' + contacto.nombre"
                  :to="{ path: '/agenda/' + contacto.id, query: { vista: 'detalle' } }">Ver</RouterLink>
                <RouterLink class="button edit compact" :aria-label="'Editar ' + contacto.nombre"
                  :to="'/agenda/' + contacto.id">Editar</RouterLink>
                <RouterLink class="button remove compact" :aria-label="'Eliminar ' + contacto.nombre"
                  :to="{ path: '/agenda/' + contacto.id, query: { vista: 'eliminar' } }">Eliminar</RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!loading && !error" class="contact-total">Total de contactos: {{ contactos.length }}</p>
  </section>
</template>
