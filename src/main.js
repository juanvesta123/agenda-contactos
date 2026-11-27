import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { loadApiUrl } from './config/api'
import { useAuthStore } from './stores/auth'
import router from './router'
import './styles.css'

async function start() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  try {
    useAuthStore(pinia).restore(await loadApiUrl())
    app.use(router)
    app.mount('#app')
  } catch {
    document.querySelector('#app').textContent =
      'No se pudo cargar la agenda. Comprueba la URL del API en public/config.json y recarga la página.'
  }
}

start()
