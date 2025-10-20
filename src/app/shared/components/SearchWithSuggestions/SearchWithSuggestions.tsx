import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Suggestion = { id: string; text: string };

export default function SearchWithSuggestions({
  label,
  placeholder,
  suggestions,
  onSelect,
}: {
  label: string;
  placeholder?: string;
  suggestions: Suggestion[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Posición del menú en viewport coords
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Solo buscar por la parte de la skill (después de ":")
  const skillText = (s: Suggestion) => {
    const parts = s.text.split(':');
    return (parts.length > 1 ? parts.slice(1).join(':') : s.text).trim();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return suggestions.filter((s) => skillText(s).toLowerCase().includes(q)).slice(0, 12);
  }, [query, suggestions]);

  const updateMenuPos = () => {
    const el = inputRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const gutter = 8;
    const viewportH = window.innerHeight;

    // Altura máxima (no “choca” el borde inferior del modal/viewport)
    const maxH = 240; // ~max-h-60
    let top = rect.bottom + gutter;

    // Si no entra abajo, lo “flip” hacia arriba
    if (top + maxH > viewportH - gutter) {
      top = Math.max(gutter, rect.top - maxH - gutter);
    }

    setMenuPos({ top, left: rect.left, width });
  };

  // Abrimos/cerramos según query y actualizamos posición
  useEffect(() => {
    const hasQuery = query.trim().length > 0;
    setOpen(hasQuery);
    if (hasQuery) updateMenuPos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Click-away que contempla también el portal
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

  // Reposicionar en scroll/resize
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
    if (!open || !filtered.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = filtered[active];
      if (pick) {
        onSelect(pick.id);
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
            className="
            rounded-lg border border-[var(--color-secondary-outline)]
            bg-white shadow
          "
          >
            {filtered.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(s.id);
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
      <label className="font-bold" htmlFor="skill-search">
        {label}
      </label>
      <div className="relative">
        <input
          id="skill-search"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full h-14 px-5 py-3 rounded-xl text-base placeholder:text-[var(--color-secondary-grey)] placeholder:font-normal placeholder:text-base border border-[var(--color-secondary-outline)] focus:outline-none focus:ring-0 focus:border-[var(--color-primary-black)] disabled:bg-[var(--color-secondary-offwhite)] disabled:cursor-not-allowed transition-colors"
        />
        {dropdown}
      </div>
    </div>
  );
}
