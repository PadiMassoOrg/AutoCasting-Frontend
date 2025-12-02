import { useEffect, useState } from 'react';

type ChromeBoxHeights = {
  header: number;
  footer: number;
};

export function useChromeBoxHeights(): ChromeBoxHeights {
  const [dims, setDims] = useState<ChromeBoxHeights>({ header: 0, footer: 0 });

  useEffect(() => {
    const header = document.querySelector('[data-site-header]') as HTMLElement | null;
    const footer = document.querySelector('[data-site-footer]') as HTMLElement | null;

    const read = () => {
      setDims({
        header: header?.getBoundingClientRect().height ?? 0,
        footer: footer?.getBoundingClientRect().height ?? 0,
      });
    };

    read();

    const roH = header ? new ResizeObserver(read) : null;
    const roF = footer ? new ResizeObserver(read) : null;

    if (header && roH) {
      roH.observe(header);
    }
    if (footer && roF) {
      roF.observe(footer);
    }

    window.addEventListener('resize', read, { passive: true });

    return () => {
      roH?.disconnect();
      roF?.disconnect();
      window.removeEventListener('resize', read);
    };
  }, []);

  return dims;
}
