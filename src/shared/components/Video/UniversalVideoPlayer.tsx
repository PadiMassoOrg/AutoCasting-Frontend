import React, { useMemo } from 'react';

type Provider = 'youtube' | 'vimeo' | 'unknown';

type Props = {
  url: string;
  title?: string; // accesible; por defecto "Video"
  autoplay?: boolean; // default: false
  controls?: boolean; // solo YT (default: true)
  muted?: boolean; // default: false
  loop?: boolean; // default: false
  start?: number; // segundos (solo YT)
  className?: string;
};

function detectProvider(url: string): Provider {
  try {
    const u = new URL(url);
    if (/youtube\.com|youtu\.be/i.test(u.hostname)) return 'youtube';
    if (/vimeo\.com/i.test(u.hostname)) return 'vimeo';
  } catch {}
  return 'unknown';
}

function getYouTubeId(url: string): string | undefined {
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

function getVimeoId(url: string): string | undefined {
  try {
    const u = new URL(url);
    // toma el último segmento numérico del path
    const parts = u.pathname.split('/').filter(Boolean);
    const candidate = parts.reverse().find((p) => /^\d+$/.test(p));
    return candidate;
  } catch {}
  return undefined;
}

export default function UniversalVideoPlayer({
  url,
  title = 'Video',
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  start,
  className,
}: Props) {
  const provider = useMemo(() => detectProvider(url), [url]);

  const src = useMemo(() => {
    if (provider === 'youtube') {
      const id = getYouTubeId(url);
      if (!id) return undefined;
      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        autoplay: autoplay ? '1' : '0',
        controls: controls ? '1' : '0',
        mute: muted ? '1' : '0',
      });
      if (loop) {
        params.set('loop', '1');
        params.set('playlist', id); // requisito de YT para loop
      }
      if (start && start > 0) params.set('start', String(start));
      // dominio de privacidad mejorada
      return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    }

    if (provider === 'vimeo') {
      const id = getVimeoId(url);
      if (!id) return undefined;
      const params = new URLSearchParams({
        byline: '0',
        portrait: '0',
        title: '0',
        dnt: '1',
        autoplay: autoplay ? '1' : '0',
        muted: muted ? '1' : '0',
        loop: loop ? '1' : '0',
      });
      // Nota: Vimeo no soporta "start" directo en el embed estándar
      return `https://player.vimeo.com/video/${id}?${params.toString()}`;
    }

    return undefined;
  }, [provider, url, autoplay, controls, muted, loop, start]);

  if (!src) {
    // Fallback seguro si la URL no es de YT/Vimeo
    return (
      <div className={`p-3 border rounded-2xl text-sm ${className ?? ''}`}>
        Proveedor no soportado.{' '}
        <a className="underline" href={url} target="_blank" rel="noreferrer">
          Abrir enlace
        </a>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video ${className ?? ''}`}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full rounded-2xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="origin-when-cross-origin"
      />
    </div>
  );
}
