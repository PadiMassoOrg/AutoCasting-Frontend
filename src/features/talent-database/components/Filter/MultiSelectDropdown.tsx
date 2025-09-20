import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';

export type MultiSelectDropdownProps<T> = {
  title?: string;
  options: T[];
  getId: (opt: T) => string;
  getLabel: (opt: T) => string;
  selected: string[];
  onChange: (next: string[]) => void;
  i18n?: {
    selected?: string;
    selectAll?: string;
  };
  maxPanelHeight?: string;
  className?: string;
};

export default function MultiSelectDropdown<T>({
  title,
  options,
  getId,
  getLabel,
  selected,
  onChange,
  i18n = { selected: 'Selecciones', selectAll: 'Seleccionar Todas' },
  maxPanelHeight = '16rem',
  className = '',
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ids = useMemo(() => options.map(getId), [options, getId]);
  const count = selected.length;
  const allSelected = count > 0 && count === ids.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : ids);
  };

  const toggleOne = (id: string) => {
    const set = new Set(selected);
    set.has(id) ? set.delete(id) : set.add(id);
    onChange(Array.from(set));
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <button
        type="button"
        className="relative w-full h-14 rounded-xl border border-[var(--color-secondary-outline)] px-6 py-3 text-left bg-white"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            {title && <span className="text-sm font-base text-neutral-600">{title}</span>}
            <span className="text-sm font-base">
              {count} {i18n.selected}
            </span>
          </div>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {/* Panel */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out rounded-xl bg-white ${open ? 'border border-[var(--color-secondary-outline)] grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-3 flex flex-col gap-2" style={{ maxHeight: maxPanelHeight, overflow: 'auto' }}>
            <Separator className="opacity-20 my-2"></Separator>
            {/* Select All */}
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                className="size-6 rounded-lg accent-black"
                checked={allSelected}
                onChange={toggleAll}
              />
              <span>{i18n.selectAll}</span>
            </label>

            {/* Opciones */}
            {options.map((opt) => {
              const id = getId(opt);
              const checked = selected.includes(id);
              return (
                <label key={id} className="flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    className="size-6 rounded-xl accent-black"
                    checked={checked}
                    onChange={() => toggleOne(id)}
                  />
                  <span>{getLabel(opt)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
