<script setup>
import { onUnmounted, ref } from 'vue'
import Avatar from './Avatar.vue'
import { acceptedPhotos, validatePhoto } from '../forms'

defineProps({ photo: String, name: String, required: Boolean, label: String })
const emit = defineEmits(['change'])
const preview = ref('')
const error = ref('')

function clearPreview() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = ''
}

function selectPhoto(event) {
  const file = event.target.files[0]
  error.value = validatePhoto(file)
  event.target.setCustomValidity(error.value)
  clearPreview()
  if (file && !error.value) preview.value = URL.createObjectURL(file)
  emit('change', error.value ? null : file)
}

onUnmounted(clearPreview)
</script>

<template>
  <div class="photo-field">
    <div v-if="preview" class="avatar avatar-large">
      <img :src="preview" alt="Vista previa de la foto">
    </div>
    <Avatar v-else :photo="photo" :name="name" large />
    <div class="field">
      <label for="foto">{{ label }}</label>
      <input id="foto" type="file" :accept="acceptedPhotos" :required="required" aria-describedby="foto-ayuda" @change="selectPhoto">
      <small id="foto-ayuda">JPG, PNG o WEBP, hasta 2 MB.</small>
      <small v-if="error" role="alert" class="field-error">{{ error }}</small>
    </div>
  </div>
</template>
