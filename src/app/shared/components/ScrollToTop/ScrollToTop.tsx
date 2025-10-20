import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type Props = {
  selector?: string | null;
  smooth?: boolean;
  tries?: number;
  intervalMs?: number;
};

export function ScrollToTop({ selector = null, smooth = false, tries = 5, intervalMs = 50 }: Props) {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const getTargets = () => {
    const t: (Window | HTMLElement)[] = [];
    if (selector) {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) t.push(el);
    }
    t.push(window);
    const se = document.scrollingElement;
    if (se && se !== document.documentElement) t.push(se as HTMLElement);
    t.push(document.documentElement, document.body);
    return t;
  };

  const forceTop = (behavior: ScrollBehavior) => {
    const targets = getTargets();

    targets.forEach((target) => {
      if (target === window) {
        window.scrollTo(0, 0);
        try {
          window.scrollTo({ top: 0, left: 0, behavior });
        } catch {}
      } else {
        const el = target as HTMLElement;
        el.scrollTop = 0;
        try {
          el.scrollTo({ top: 0, left: 0, behavior });
        } catch {}
      }
    });
  };

  const scheduleForce = (behavior: ScrollBehavior) => {
    clearTimers();
    requestAnimationFrame(() => forceTop(behavior));
    for (let i = 0; i < tries; i++) {
      const id = window.setTimeout(() => forceTop(behavior), i * intervalMs);
      timers.current.push(id);
    }
  };

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !hash) scheduleForce('auto');
    };
    window.addEventListener('pageshow', onPageShow as any);
    return () => window.removeEventListener('pageshow', onPageShow as any);
  }, [hash]);

  useEffect(() => {
    const onPop = () => {
      if (!hash) scheduleForce('auto');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [hash]);

  useLayoutEffect(() => {
    if (hash) return;
    const behavior: ScrollBehavior = navType === 'POP' ? 'auto' : smooth ? 'smooth' : 'auto';
    forceTop(behavior);
  }, [pathname, search, navType, hash, smooth]);

  useEffect(() => {
    if (hash) return;
    const behavior: ScrollBehavior = navType === 'POP' ? 'auto' : smooth ? 'smooth' : 'auto';
    scheduleForce(behavior);
    return clearTimers;
  }, [pathname, search, navType, hash, smooth]);

  return null;
}
