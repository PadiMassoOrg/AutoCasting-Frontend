// shared/components/Pills/Pills.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { clsx } from 'clsx';

export type PillItem<K extends string = string> = {
  key: K;
  label: string;
};

type Props<K extends string = string> = {
  items: ReadonlyArray<PillItem<K>>;
  value: K;
  onChange: (key: K) => void;
  className?: string;
  listClassName?: string;
};

export default function Pills<K extends string = string>({
  items,
  value,
  onChange,
  className,
  listClassName,
}: Props<K>) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // índice actual (para teclas ← →)
  const idx = useMemo(() => items.findIndex((i) => i.key === value), [items, value]);
  const clamp = (n: number) => Math.max(0, Math.min(items.length - 1, n));

  // centro en vista la pill activa
  useEffect(() => {
    const el = btnRefs.current[String(value)];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [value]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!items.length) return;
    if (e.key === 'ArrowRight') {
      const next = clamp(idx + 1);
      onChange(items[next].key);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') {
      const prev = clamp(idx - 1);
      onChange(items[prev].key);
      e.preventDefault();
    }
    if (e.key === 'Home') {
      onChange(items[0].key);
      e.preventDefault();
    }
    if (e.key === 'End') {
      onChange(items[items.length - 1].key);
      e.preventDefault();
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <div className="flex items-center gap-2">
        <div
          ref={listRef}
          role="tablist"
          aria-label="pills"
          className={clsx('flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar snap-x', listClassName)}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {items.map(({ key, label }) => {
            const selected = key === value;
            return (
              <button
                key={String(key)}
                ref={(el) => (btnRefs.current[String(key)] = el)}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${String(key)}`}
                id={`tab-${String(key)}`}
                onClick={() => onChange(key)}
                className={clsx(
                  'bg-[var(--color-primary-light-grey)] text-base font-semibold cursor-pointer px-4 py-2',
                  'snap-start whitespace-nowrap rounded-full',
                  selected && 'bg-black text-white'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
