import { useEffect } from 'react';

export function useViewportVhVar(freeze = false) {
  useEffect(() => {
    if (freeze) return;
    const apply = () => {
      const h = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${h}px`);
    };
    apply();
    const vv = window.visualViewport;
    window.addEventListener('resize', apply);
    vv?.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      vv?.removeEventListener('resize', apply);
    };
  }, [freeze]);
}
