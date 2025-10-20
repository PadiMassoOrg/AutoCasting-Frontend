export function normalizeExternalUrl(raw?: string | null): string | null {
  if (!raw) return null;
  let url = raw.trim();

  if (!/^https?:\/\//i.test(url)) {
    if (/^[\w.-]+\.[a-z]{2,}([\/?#].*)?$/i.test(url)) {
      url = `https://${url}`;
    } else {
      return null;
    }
  }

  const lower = url.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return null;

  return url;
}
