import { useMemo } from 'react';
import { detectProvider, getVimeoId, getYouTubeId } from '../../utils/videoUtils';

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
        params.set('playlist', id);
      }
      if (start && start > 0) params.set('start', String(start));
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
      return `https://player.vimeo.com/video/${id}?${params.toString()}`;
    }

    return undefined;
  }, [provider, url, autoplay, controls, muted, loop, start]);

  if (!src) {
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
