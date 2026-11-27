# Agenda de contactos · Interfaz

Agenda web en Vue 3, Vue Router y Pinia. Permite registrarse, iniciar sesión, gestionar contactos y actualizar la foto de perfil.

1. Inicia el backend e indica su URL hasta `/api` en `public/config.json`.
2. Con Node.js 22.13 o posterior y pnpm 11, ejecuta `pnpm install` y `pnpm dev`. Abre la URL que indica Vite.

Para verificar una compilación ejecuta `pnpm build` y luego `pnpm preview`. Para GitHub Pages bajo `/agenda-contactos/`, ejecuta `pnpm build /agenda-contactos/` y publica el contenido de `dist/` en la rama `gh-pages`.

Para usar el backend de otro equipo cambia `API_URL` en `public/config.json` del sitio servido y recarga la página. En una compilación local estará en `dist/public/config.json`. El cambio se lee en tiempo de ejecución. Inicia sesión con un usuario del backend elegido.

Sitio publicado en [GitHub Pages](https://juanvesta123.github.io/agenda-contactos/). En Pages, el ajuste de `API_URL` se guarda en `public/config.json` de la rama `gh-pages`.
