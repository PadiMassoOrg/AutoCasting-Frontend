import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type BaseProps<T> = {
  title?: string;
  options: T[];
  getId: (opt: T) => string;
  getLabel: (opt: T) => string;
  i18n?: { selected?: string; selectAll?: string; clear?: string };
  maxPanelHeight?: string;
  className?: string;
};

type MultipleSelectProps = {
  mode?: 'multiple'; // default
  selected: string[];
  onChange: (next: string[]) => void;
};

type SingleSelectProps = {
  mode: 'single';
  selected: string | undefined;
  onChange: (next: string | undefined) => void;
};

export type MultiSelectDropdownProps<T> = BaseProps<T> & (MultipleSelectProps | SingleSelectProps);

function isSingle(p: MultipleSelectProps | SingleSelectProps): p is SingleSelectProps {
  return (p as SingleSelectProps).mode === 'single';
}

export default function MultiSelectDropdown<T>({
  title,
  options,
  getId,
  getLabel,
  i18n = { selected: 'Selecciones', selectAll: 'Seleccionar Todas', clear: 'Limpiar' },
  maxPanelHeight = '16rem',
  className = '',
  ...rest
}: MultiSelectDropdownProps<T>) {
  const { t } = useTranslation();
  const single = isSingle(rest);
  const selectedIds: string[] = single ? (rest.selected ? [rest.selected] : []) : rest.selected;

  const setSelected = (ids: string[]) => {
    if (single) {
      (rest as SingleSelectProps).onChange(ids[0] ?? undefined);
    } else {
      (rest as MultipleSelectProps).onChange(ids);
    }
  };

  const [open, setOpen] = useState(false);
  const ids = useMemo(() => options.map(getId), [options, getId]);
  const count = selectedIds.length;
  const allSelected = !single && count > 0 && count === ids.length;

  const toggleAll = () => {
    if (single) {
      // en single actuamos como "Limpiar"
      setSelected([]);
    } else {
      setSelected(allSelected ? [] : ids);
    }
  };

  const toggleOne = (id: string) => {
    if (single) {
      setSelected(selectedIds.includes(id) ? [] : [id]);
    } else {
      const set = new Set(selectedIds);
      set.has(id) ? set.delete(id) : set.add(id);
      setSelected(Array.from(set));
    }
  };

  return (
    <>
      <div className={`w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white ${className}`}>
        {/* Header */}
        <button
          type="button"
          className="relative w-full h-14 rounded-xl px-6 py-3 text-left bg-white"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              {title && <span className="text-sm text-neutral-600">{title}</span>}
              <span className="text-sm">
                {count} {i18n.selected}
              </span>
            </div>
            <svg
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
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
          className={`grid transition-[grid-template-rows] duration-300 ease-out rounded-xl bg-white ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="px-6">
              <Separator className="opacity-20 mb-4" />
            </div>

            <div className="px-6 py-3 flex flex-col gap-2" style={{ maxHeight: maxPanelHeight, overflow: 'auto' }}>
              {/* Select All / Clear */}
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  className="size-6 rounded-lg accent-[var(--color-primary-black)]"
                  checked={!single && allSelected}
                  onChange={toggleAll}
                />
                <span>{single ? t('general.clear') : (i18n.selectAll ?? 'Seleccionar Todas')}</span>
              </label>

              {/* Opciones */}
              {options.map((opt) => {
                const id = getId(opt);
                const checked = selectedIds.includes(id);
                return (
                  <label key={id} className="flex items-center gap-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      className="size-6 rounded-xl accent-[var(--color-primary-black)]"
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
      <div className="min-h-[25px]"></div>
    </>
  );
}
