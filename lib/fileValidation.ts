export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

export const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i

export const MAX_CERT_FILE_SIZE = 10 * 1024 * 1024  // 10 MB
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (file.size > maxBytes) {
    return `File size must be less than ${maxBytes / (1024 * 1024)}MB`
  }
  if (
    !ALLOWED_IMAGE_MIME_TYPES.has(file.type) ||
    !ALLOWED_IMAGE_EXTENSIONS.test(file.name)
  ) {
    return "Only JPEG, PNG, WebP, and GIF images are permitted"
  }
  return null
}
