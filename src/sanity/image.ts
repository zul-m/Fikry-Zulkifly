// Resizes and reformats (WebP/AVIF) via Sanity's CDN instead of serving the original upload.
export function sanityImageUrl(url: string, width: number): string {
  return `${url}?w=${width}&auto=format`;
}
