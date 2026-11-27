<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="panel home">
    <h1>Tu agenda de contactos</h1>
    <p>Guarda, consulta y actualiza tus contactos en un solo lugar.</p>
    <div class="actions">
      <RouterLink v-if="auth.token" class="button primary" to="/agenda">Abrir mi agenda</RouterLink>
      <template v-else>
        <RouterLink class="button primary" to="/login">Iniciar sesión</RouterLink>
        <RouterLink class="button secondary" to="/registro">Registrarse</RouterLink>
      </template>
    </div>
  </section>
</template>
