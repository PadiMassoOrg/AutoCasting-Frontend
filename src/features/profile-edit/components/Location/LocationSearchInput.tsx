import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { locationApiCityAutocomplete } from '../../services/locationApiService';
import type { LocationInput } from '../../types/location.types';

export default function LocationSearchInput({
  label,
  placeholder,
  onPick,
  minLength = 4,
  delayMs = 5000,
  allowedCountries = ['AR'],
  prefill,
}: {
  label: string;
  placeholder: string;
  onPick: (loc: LocationInput) => void;
  minLength?: number;
  delayMs?: number;
  allowedCountries?: string[];
  prefill?: string;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(prefill ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [items, setItems] = useState<LocationInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // control de origen del cambio
  const skipNextEffect = useRef(false); // evita fetch por cambios programáticos (prefill/selección)
  const typedRef = useRef(false); // true solo si el usuario escribió
  const committedRef = useRef<string>(prefill ?? ''); // último valor confirmado (backend o selección)

  // sincronizar prefill (sin fetch ni abrir menú)
  useEffect(() => {
    if (prefill != null && prefill !== query) {
      skipNextEffect.current = true;
      typedRef.current = false;
      committedRef.current = prefill; // <- lo nuevo confirmado
      setQuery(prefill);
      setItems([]);
      setOpen(false);
      setLoading(false);
      setError(false);
      setTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const suggestions = useMemo(
    () =>
      items.map((loc, i) => {
        const text =
          loc.formatted ||
          (loc.suburb && loc.suburb !== loc.city
            ? `${loc.suburb}, ${loc.city}, ${loc.country}`
            : [loc.city, loc.state, loc.country].filter(Boolean).join(', ')); // 3 campos si no hay suburb
        return { id: String(i), text, loc };
      }),
    [items]
  );

  const updateMenuPos = () => {
    const el = inputRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gutter = 8;
    const top = rect.bottom + window.scrollY + gutter; // absoluto respecto al documento
    const left = rect.left + window.scrollX;
    setMenuPos({ top, left, width: rect.width });
  };

  // búsqueda: SOLO si el usuario escribió
  useEffect(() => {
    if (skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    if (!typedRef.current) return; // cambios programáticos no disparan fetch

    const q = query.trim();

    if (q.length < minLength) {
      setOpen(false);
      setItems([]);
      setActive(0);
      setLoading(false);
      setError(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    abortRef.current?.abort();

    setLoading(true);
    setTouched(true);
    setError(false);
    setOpen(true);
    updateMenuPos();

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
        setActive(0);
        updateMenuPos();
        setError(false);
      } catch {
        setItems([]);
        setActive(0);
        updateMenuPos();
        setError(true);
      } finally {
        setLoading(false);
        typedRef.current = false; // consumimos este “ciclo” de tipeo
      }
    }, delayMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, minLength, delayMs, allowedCountries.join('|')]);

  // click-away: cerrar y restaurar el último valor confirmado si no hubo selección
  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
      // si el usuario estaba tipeando y no confirmo, restauramos el último confirmado
      if (query !== committedRef.current) {
        skipNextEffect.current = true;
        typedRef.current = false;
        setQuery(committedRef.current);
      }
    };
    window.addEventListener('mousedown', onClickAway);
    return () => window.removeEventListener('mousedown', onClickAway);
  }, [query]);

  // reposicionar en scroll/resize
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

  const selectSuggestion = (text: string, loc: LocationInput) => {
    // confirmar y cerrar
    committedRef.current = text;
    skipNextEffect.current = true;
    typedRef.current = false;
    setQuery(text);
    onPick(loc);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      // restaurar si estaba tipeando sin confirmar
      if (query !== committedRef.current) {
        skipNextEffect.current = true;
        typedRef.current = false;
        setQuery(committedRef.current);
      }
      (document.activeElement as HTMLElement | null)?.blur?.();
      return;
    }

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
        selectSuggestion(pick.text, pick.loc);
      } else {
        // sin item activo → cerrar y restaurar último confirmado
        setOpen(false);
        if (query !== committedRef.current) {
          skipNextEffect.current = true;
          typedRef.current = false;
          setQuery(committedRef.current);
        }
      }
    }
  };

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
          onChange={(e) => {
            typedRef.current = true; // SOLO aquí: el usuario escribió
            setQuery(e.target.value);
          }}
          onFocus={() => {
            // abrir solo si hay resultados previos y el usuario decide reabrir (sin fetch)
            if (items.length > 0) {
              setOpen(true);
              updateMenuPos();
            }
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full h-14 px-5 py-3 rounded-xl text-base placeholder:text-[var(--color-secondary-grey)] placeholder:font-normal placeholder:text-base border border-[var(--color-secondary-outline)] focus:outline-none focus:ring-0 focus:border-[var(--color-primary-black)] disabled:bg-[var(--color-secondary-offwhite)] disabled:cursor-not-allowed transition-colors"
        />
        {open &&
          menuPos &&
          createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'absolute', // ⬅️ ahora absoluto respecto al documento
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
                <div className="px-4 py-3 text-sm text-[var(--color-secondary-grey)]">
                  {t('state.loading_suggestions')}
                </div>
              )}

              {!loading && error && (
                <div className="px-4 py-3 text-sm text-[var(--color-secondary-grey)]">{t('state.server_err')}</div>
              )}

              {!loading && !error && suggestions.length === 0 && touched && (
                <div className="px-4 py-3 text-sm text-[var(--color-secondary-grey)]">{t('state.no_results')}</div>
              )}

              {!loading &&
                !error &&
                suggestions.map((s, i) => (
                  <button
                    key={`${s.id}-${s.text}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // evita perder foco antes del click
                    onClick={() => selectSuggestion(s.text, s.loc)}
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
          )}
      </div>
    </div>
  );
}
