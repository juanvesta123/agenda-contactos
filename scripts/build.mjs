import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { build } from 'vite'

const base = process.argv[2] ?? '/'
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error('La ruta base debe empezar y terminar con /.')
}
await build({ base })
await mkdir('dist/public', { recursive: true })
await copyFile('public/config.json', 'dist/public/config.json')
await writeFile('dist/.nojekyll', '')
await writeFile('dist/404.html', `<!doctype html>
<html lang="es"><meta charset="UTF-8"><title>Agenda de contactos</title>
<script>
  const base = '${base}'
  if (location.pathname.startsWith(base) && location.pathname !== base) {
    const ruta = location.pathname + location.search + location.hash
    location.replace(base + '?ruta=' + encodeURIComponent(ruta))
  }
</script>
<a href="${base}">Ir al inicio</a>
</html>
`)
