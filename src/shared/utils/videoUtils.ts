type Provider = 'youtube' | 'vimeo' | 'unknown';

export function detectProvider(url: string): Provider {
  try {
    const u = new URL(url);
    if (/youtube\.com|youtu\.be/i.test(u.hostname)) return 'youtube';
    if (/vimeo\.com/i.test(u.hostname)) return 'vimeo';
  } catch {}
  return 'unknown';
}

export function getYouTubeId(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    const v = u.searchParams.get('v');
    if (v) return v;
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?#]+)/i);
    return m?.[2];
  } catch {}
  return undefined;
}

export function getVimeoId(url: string): string | undefined {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const candidate = parts.reverse().find((p) => /^\d+$/.test(p));
    return candidate;
  } catch {}
  return undefined;
}
