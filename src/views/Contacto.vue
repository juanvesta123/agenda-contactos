<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiRequest } from '../api'
import { useAuthStore } from '../stores/auth'
import CampoFoto from '../components/CampoFoto.vue'
import { phonePattern } from '../forms'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const id = route.params.id
const fields = reactive({ nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: '' })
const currentPhoto = ref('')
const photo = ref(null)
const loading = ref(Boolean(id))
const available = ref(!id)
const busy = ref(false)
const error = ref('')
const confirmDelete = ref(false)
const cancelButton = ref(null)
const deleteButton = ref(null)

onMounted(async () => {
  if (!id) return
  try {
    const result = await apiRequest('contactos/detalle.php?id=' + encodeURIComponent(id), { protectedRoute: true })
    if (!result.contacto) throw new Error('El API no devolvió los datos del contacto.')
    for (const key of Object.keys(fields)) fields[key] = result.contacto[key] ?? ''
    currentPhoto.value = result.contacto.foto || ''
    available.value = true
  } catch (failure) {
    error.value = failure.message
  } finally {
    loading.value = false
  }
})

async function save() {
  error.value = ''
  if (!fields.nombre.trim()) {
    error.value = 'Escribe el nombre del contacto.'
    return
  }
  if (!photo.value && !currentPhoto.value) {
    error.value = 'Selecciona una foto.'
    return
  }

  const values = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()]))
  if (id) values.id = Number(id)
  let data = values
  if (photo.value) {
    data = new FormData()
    for (const [key, value] of Object.entries(values)) data.append(key, value)
    data.append('foto', photo.value)
  }

  busy.value = true
  try {
    const result = await apiRequest(`contactos/${id ? 'actualizar' : 'crear'}.php`, {
      method: 'POST', data, protectedRoute: true,
    })
    auth.notice = result.message || 'Contacto guardado.'
    await router.push('/agenda')
  } catch (failure) {
    error.value = failure.message
  } finally {
    busy.value = false
  }
}

async function showDelete(value) {
  confirmDelete.value = value
  await nextTick()
  if (value) cancelButton.value?.focus()
  else deleteButton.value?.focus()
}

async function remove() {
  busy.value = true
  error.value = ''
  try {
    const result = await apiRequest('contactos/eliminar.php', {
      method: 'POST', data: { id: Number(id) }, protectedRoute: true,
    })
    auth.notice = result.message || 'Contacto eliminado.'
    await router.push('/agenda')
  } catch (failure) {
    error.value = failure.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="form-page">
    <RouterLink class="back-link" to="/agenda">← Volver a mi agenda</RouterLink>
    <h1>{{ id ? 'Editar contacto' : 'Nuevo contacto' }}</h1>
    <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
    <p v-if="loading" role="status" class="muted">Cargando contacto…</p>
    <form v-if="available" class="panel stacked-form" @submit.prevent="save">
      <CampoFoto :photo="currentPhoto" :name="fields.nombre"
        :label="currentPhoto ? 'Cambiar foto' : 'Foto (obligatoria)'" :required="!currentPhoto" @change="photo = $event" />

      <div class="form-grid">
        <div class="field">
          <label for="nombre">Nombre (obligatorio)</label><input id="nombre" v-model="fields.nombre" required maxlength="100">
        </div>
        <div class="field">
          <label for="apellido">Apellido</label><input id="apellido" v-model="fields.apellido" maxlength="100">
        </div>
        <div class="field">
          <label for="telefono">Teléfono (obligatorio)</label>
          <input id="telefono" v-model="fields.telefono" type="tel" :pattern="phonePattern"
            title="Usa dígitos, espacios, paréntesis, punto, guion o un signo + al inicio." required maxlength="20">
        </div>
        <div class="field">
          <label for="email">Correo electrónico</label><input id="email" v-model="fields.email" type="email" maxlength="120">
        </div>
        <div class="field span-two">
          <label for="direccion">Dirección</label><input id="direccion" v-model="fields.direccion" maxlength="255">
        </div>
        <div class="field span-two">
          <label for="notas">Notas</label><textarea id="notas" v-model="fields.notas" maxlength="5000" rows="3"></textarea>
        </div>
      </div>

      <div class="form-actions">
        <div class="actions">
          <button class="primary" :disabled="busy || confirmDelete">Guardar contacto</button>
          <RouterLink class="button secondary" to="/agenda">Cancelar</RouterLink>
        </div>
        <button v-if="id && !confirmDelete" ref="deleteButton" type="button"
          class="delete-link" :disabled="busy" @click="showDelete(true)">Eliminar contacto</button>
      </div>

      <section v-if="confirmDelete" class="delete-box" aria-labelledby="confirmacion">
        <h2 id="confirmacion">¿Eliminar a {{ fields.nombre }}?</h2>
        <p>El contacto se quitará de tu agenda.</p>
        <div class="actions">
          <button ref="cancelButton" type="button" class="secondary" :disabled="busy" @click="showDelete(false)">Conservar contacto</button>
          <button type="button" class="danger" :disabled="busy" @click="remove">Sí, eliminar</button>
        </div>
      </section>
    </form>
  </section>
</template>
