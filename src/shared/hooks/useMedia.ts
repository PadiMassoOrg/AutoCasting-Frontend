import { useEffect, useState } from 'react';

export const LG_SCREEN_SIZE = '(min-width: 1024px)';
export const XL_SCREEN_SIZE = '(min-width: 1300px)';

export function useMedia(query: string) {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}
