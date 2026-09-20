import { useCallback, useEffect, useRef } from 'react';

/**
 * DetailsView (autocasting-ui-library-padimasso) always resets window scroll to top when it
 * opens — it looks for an `#app-scroll-root` container this app doesn't have, and falls back to
 * `window.scrollTo(0, 0)` (this app's layout scrolls at the window level, so that fallback is
 * otherwise correct, just not desired here). That reset would otherwise discard the caller's
 * place in a paginated/infinite-scroll list every time its details overlay opens.
 *
 * Call `captureScroll()` right before opening the overlay (e.g. in the handler that flips
 * `open` to true), then pass the overlay's own `open` boolean as `restoreWhen` — the previous
 * scroll position is restored on the next animation frame after it becomes true, which runs
 * after DetailsView's own mount effect (child effects flush before parent effects in the same
 * commit).
 */
export function usePreservedScroll(restoreWhen: boolean) {
  const scrollYRef = useRef(0);

  const captureScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    if (!restoreWhen) return;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(rafId);
  }, [restoreWhen]);

  return { captureScroll };
}
