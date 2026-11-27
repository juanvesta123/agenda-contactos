<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="home">
    <div>
      <h1>Tu agenda de<br class="desktop-break"> contactos</h1>
      <p>Guarda nombres, teléfonos y fotos. Consulta y actualiza tus contactos cuando lo necesites.</p>
      <div class="actions">
        <RouterLink v-if="auth.token" class="button primary" to="/agenda">Abrir mi agenda</RouterLink>
        <template v-else>
          <RouterLink class="button primary" to="/login">Iniciar sesión</RouterLink>
          <RouterLink class="button secondary" to="/registro">Crear cuenta</RouterLink>
        </template>
      </div>
    </div>
    <div class="book" aria-hidden="true">
      <div class="book-lines"><i></i><i></i><i></i></div>
      <span class="book-tab"></span>
      <span class="book-tab"></span>
      <span class="book-tab"></span>
    </div>
  </section>
</template>
