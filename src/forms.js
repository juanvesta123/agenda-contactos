export const acceptedPhotos = 'image/jpeg,image/png,image/webp'
export const usernamePattern = '[A-Za-z0-9_.\\-]{3,50}'
export const phonePattern = '\\+?[0-9\\(\\). \\-]*[0-9][0-9\\(\\). \\-]*'

export function validatePhoto(file) {
  if (!file) return ''
  if (!acceptedPhotos.split(',').includes(file.type)) return 'Usa una foto JPG, PNG o WEBP.'
  if (file.size > 2 * 1024 * 1024) return 'La foto debe pesar como máximo 2 MB.'
  return ''
}
