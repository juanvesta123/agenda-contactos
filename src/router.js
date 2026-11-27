import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Inicio from './views/Inicio.vue'
import Acceso from './views/Acceso.vue'
import Agenda from './views/Agenda.vue'
import Contacto from './views/Contacto.vue'
import Perfil from './views/Perfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Inicio },
    { path: '/login', component: Acceso, meta: { guest: true } },
    { path: '/registro', component: Acceso, props: { registro: true }, meta: { guest: true } },
    { path: '/agenda', component: Agenda, meta: { protected: true } },
    { path: '/agenda/crear', component: Contacto, meta: { protected: true } },
    { path: '/agenda/:id', component: Contacto, meta: { protected: true } },
    { path: '/perfil', component: Perfil, meta: { protected: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.protected && !auth.token) {
    if (!auth.notice) auth.notice = 'Inicia sesión para acceder a esa página.'
    return '/login'
  }
  if (to.meta.guest && auth.token) return '/agenda'
})

export default router
