import { useEffect, useRef } from 'react';

type Props = {
  enabled: boolean;
  onVisible: () => void;
};

export default function LoadMoreSentinel({ enabled, onVisible }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onVisible]);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}
