import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locationApiCityAutocomplete } from '../../services/locationApiService';
import type { LocationInput } from '../../types/location.types';

export default function LocationSearchInput({
  label,
  placeholder,
  onPick,
  minLength = 4,
  delayMs = 5000, // ← 5s por defecto
  allowedCountries = ['AR'],
}: {
  label: string;
  placeholder?: string;
  onPick: (loc: LocationInput) => void;
  minLength?: number;
  delayMs?: number;
  allowedCountries?: string[];
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [items, setItems] = useState<LocationInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const suggestions = useMemo(
    () =>
      items.map((loc, i) => {
        const text =
          loc.formatted ||
          (loc.suburb && loc.suburb !== loc.city
            ? `${loc.suburb}, ${loc.city}, ${loc.country}`
            : `${loc.city}, ${loc.country}`);
        return { id: String(i), text, loc };
      }),
    [items]
  );

  const updateMenuPos = () => {
    const el = inputRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const gutter = 8;
    const viewportH = window.innerHeight;
    const maxH = 240;

    let top = rect.bottom + gutter;
    if (top + maxH > viewportH - gutter) {
      top = Math.max(gutter, rect.top - maxH - gutter);
    }
    setMenuPos({ top, left: rect.left, width });
  };

  // Debounce + cancelación + fetch (UNA request tras 5s sin teclear)
  useEffect(() => {
    const q = query.trim();

    if (q.length < minLength) {
      setOpen(false);
      setItems([]);
      setActive(0);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    abortRef.current?.abort();

    setLoading(true);
    setTouched(true);

    timerRef.current = window.setTimeout(async () => {
      try {
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const res = await locationApiCityAutocomplete(q, {
          signal: ctrl.signal,
          countryCodes: allowedCountries,
          lang: 'es',
          limit: 8,
        });
        setItems(res);
        setOpen(true);
        setActive(0);
        updateMenuPos();
      } catch {
        setItems([]);
        setOpen(true);
        setActive(0);
        updateMenuPos();
      } finally {
        setLoading(false);
      }
    }, delayMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, minLength, delayMs, allowedCountries.join('|')]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener('mousedown', onClickAway);
    return () => window.removeEventListener('mousedown', onClickAway);
  }, []);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (open) updateMenuPos();
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(0, suggestions.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = suggestions[active];
      if (pick) {
        onPick(pick.loc);
        setQuery('');
        setOpen(false);
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      (document.activeElement as HTMLElement | null)?.blur?.();
    }
  };

  const dropdown =
    open && menuPos
      ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              maxHeight: 310,
              overflow: 'auto',
              zIndex: 2147483647,
            }}
            className="rounded-lg border border-[var(--color-secondary-outline)] bg-white shadow"
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-[var(--color-secondary-grey)]">Cargando sugerencias…</div>
            )}

            {!loading && suggestions.length === 0 && touched && (
              <div className="px-4 py-3 text-sm text-[var(--color-secondary-grey)]">No hay sugerencias</div>
            )}

            {!loading &&
              suggestions.map((s, i) => (
                <button
                  key={`${s.id}-${s.text}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(s.loc);
                    setOpen(false);
                    setQuery('');
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`w-full text-left px-4 py-3 cursor-pointer ${
                    i === active ? 'bg-[var(--color-primary-light-grey)]' : ''
                  }`}
                >
                  {s.text}
                </button>
              ))}
          </div>,
          document.body
        )
      : null;

  return (
    <div className="flex flex-col gap-2" ref={wrapRef}>
      <label className="font-semibold text-sm" htmlFor="location-search">
        {label}
      </label>
      <div className="relative">
        <input
          id="location-search"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Ej. “Palermo”'}
          className="w-full h-14 px-5 py-3 rounded-xl text-base placeholder:text-[var(--color-secondary-grey)] placeholder:font-normal placeholder:text-base border border-[var(--color-secondary-outline)] focus:outline-none focus:ring-0 focus:border-[var(--color-primary-black)] disabled:bg-[var(--color-secondary-offwhite)] disabled:cursor-not-allowed transition-colors"
        />
        {dropdown}
      </div>
    </div>
  );
}
