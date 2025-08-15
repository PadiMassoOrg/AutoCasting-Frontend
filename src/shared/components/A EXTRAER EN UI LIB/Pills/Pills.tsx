export type PillItem = { key: string; label: string; count?: number };

export default function Pills({
  items,
  value,
  onChange,
  className,
}: {
  items: PillItem[];
  value: string;
  onChange: (k: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={`flex gap-2 overflow-x-auto no-scrollbar ${className ?? ''}`}>
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className={[
              'h-9 px-3 rounded-full border text-sm whitespace-nowrap',
              active ? 'bg-black text-white border-black' : 'hover:bg-gray-50',
            ].join(' ')}
          >
            <span>{it.label}</span>
            {typeof it.count === 'number' && (
              <span
                className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs
                ${active ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
