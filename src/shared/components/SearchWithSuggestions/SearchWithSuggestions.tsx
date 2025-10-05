import { useEffect, useMemo, useRef, useState } from 'react';

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

  const skillText = (s: Suggestion) => {
    const parts = s.text.split(':');
    return (parts.length > 1 ? parts.slice(1).join(':') : s.text).trim();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return suggestions.filter((s) => skillText(s).toLowerCase().includes(q)).slice(0, 12);
  }, [query, suggestions]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClickAway);
    return () => window.removeEventListener('mousedown', onClickAway);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasQuery = query.trim().length > 0;
    if (!open && hasQuery && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setOpen(true);
    if (!filtered.length) return;

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
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

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
          onChange={(e) => {
            const q = e.target.value;
            setQuery(q);
            setOpen(q.trim().length > 0);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full h-12 rounded-lg border-2 border-[var(--color-secondary-outline)] px-4 outline-none focus:border-[var(--color-primary-green)]"
        />

        {open && (
          <div
            className="
              absolute left-0 right-0 top-full mt-2
              max-h-32 overflow-auto
              rounded-lg border border-[var(--color-secondary-outline)]
              bg-white shadow z-[999]
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
          </div>
        )}
      </div>
    </div>
  );
}
