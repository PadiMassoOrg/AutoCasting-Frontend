import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

export function useRouteTracking() {
  const { pathname, search, hash } = useLocation();
  const lastPath = useRef<string | undefined>(undefined);

  useEffect(() => {
    const path = `${pathname}${search}${hash}`;

    // Evita el doble-disparo en dev por React.StrictMode
    if (lastPath.current === path) return;
    lastPath.current = path;

    // GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'pageview', // Trigger en GTM: "Evento personalizado" = pageview
      page_path: path,
      page_title: document.title, // opcional
    });

    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, search, hash]);
}
