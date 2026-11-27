<script setup>
import { computed, ref, watch } from 'vue'
import { photoUrl } from '../config/api'

const props = defineProps({ photo: String, name: String, large: Boolean })
const failed = ref(false)
const image = computed(() => photoUrl(props.photo))
const initial = computed(() => props.name?.trim().charAt(0).toUpperCase() || '?')
watch(image, () => { failed.value = false })
</script>

<template>
  <div class="avatar" :class="{ 'avatar-large': large }">
    <img v-if="image && !failed" :src="image" :alt="name ? 'Foto de ' + name : 'Foto'" @error="failed = true">
    <span v-else aria-hidden="true">{{ initial }}</span>
  </div>
</template>
