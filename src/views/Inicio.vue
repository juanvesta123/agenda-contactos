<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="panel home">
    <div class="home-copy">
      <h1>Tu agenda de contactos</h1>
      <p>Guarda, consulta y actualiza tus contactos en un solo lugar.</p>
      <div class="actions">
        <RouterLink v-if="auth.token" class="button primary" to="/agenda">Abrir mi agenda</RouterLink>
        <template v-else>
          <RouterLink class="button primary" to="/login">Iniciar sesión</RouterLink>
          <RouterLink class="button secondary" to="/registro">Registrarse</RouterLink>
        </template>
      </div>
    </div>
    <div class="home-notebook" aria-hidden="true">
      <span class="notebook-label"></span>
    </div>
  </section>
</template>
