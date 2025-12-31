import { Label, Separator } from 'autocasting-ui-library-padimasso';
import React, { useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollExitOnEdge } from '../../../../shared/hooks/useScrollExitOnEdge';

type BaseProps<T> = {
  title?: string;
  options: T[];
  getId: (opt: T) => string;
  getLabel: (opt: T) => string;
  maxPanelHeight?: string;
  className?: string;

  /** error message (si existe, se muestra debajo y marca el borde) */
  error?: string | null;

  /** a qué contenedor scrolleable forwardear cuando el panel llega a su borde */
  forwardScrollToRef?: React.RefObject<HTMLElement | null>;
};

type MultipleSelectProps = {
  mode?: 'multiple';
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
  maxPanelHeight = '16rem',
  className = '',
  error,
  forwardScrollToRef,
  ...rest
}: MultiSelectDropdownProps<T>) {
  const { t } = useTranslation();
  const single = isSingle(rest);
  const selectedIds: string[] = single ? (rest.selected ? [rest.selected] : []) : rest.selected;

  const [open, setOpen] = useState(false);
  const ids = useMemo(() => options.map(getId), [options, getId]);
  const count = selectedIds.length;
  const allSelected = !single && count > 0 && count === ids.length;

  const setSelected = (nextIds: string[]) => {
    if (single) (rest as SingleSelectProps).onChange(nextIds[0] ?? undefined);
    else (rest as MultipleSelectProps).onChange(nextIds);
  };

  const toggleAll = () => setSelected(single ? [] : allSelected ? [] : ids);

  const toggleOne = (optId: string) => {
    if (single) return setSelected(selectedIds.includes(optId) ? [] : [optId]);
    const set = new Set(selectedIds);
    set.has(optId) ? set.delete(optId) : set.add(optId);
    setSelected(Array.from(set));
  };

  const panelRef = useRef<HTMLDivElement>(null);

  // Ref dummy para cumplir tipos cuando forwardScrollToRef viene undefined
  const noopForwardRef = useRef<HTMLElement | null>(null);
  const forwardTo = forwardScrollToRef ?? noopForwardRef;

  // Hook SIEMPRE llamado (no condicional)
  useScrollExitOnEdge(panelRef, { forwardTo });

  const containerBorder = error ? 'border-red-500' : 'border-[var(--color-secondary-outline)]';
  const errorId = useId();
  const describedBy = error ? `${errorId}-error` : undefined;

  return (
    <>
      <div className={`w-full rounded-xl border ${containerBorder} bg-white ${className}`}>
        {/* Header */}
        <button
          type="button"
          className="cursor-pointer relative w-full h-12 rounded-xl px-6 py-3 text-left bg-white"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              {title && <span className="text-sm text-neutral-600">{title}</span>}
              <span className="text-sm">
                {count} {t('general.selections')}
              </span>
            </div>

            <svg
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
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
          className={`grid transition-[grid-template-rows] duration-300 ease-out rounded-xl bg-white ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6">
              <Separator className="opacity-20 mb-4" />
            </div>

            <div
              ref={panelRef}
              style={{ maxHeight: maxPanelHeight, overflow: 'auto' }}
              className="px-6 py-3 flex flex-col gap-2"
            >
              {!single && (
                <label className="flex items-center gap-3 text-sm font-normal cursor-pointer">
                  <span className="relative inline-flex items-center justify-center h-6 w-6">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="
                        peer
                        h-6 w-6
                        rounded-lg
                        border
                        border-[var(--color-secondary-outline)]
                        appearance-none
                        cursor-pointer
                        checked:border-[var(--color-primary-purple)]
                        checked:bg-[var(--color-primary-white)]
                        transition-colors
                      "
                    />
                    <svg
                      viewBox="0 0 16 16"
                      className="
                        pointer-events-none
                        absolute
                        h-3 w-3
                        opacity-0
                        peer-checked:opacity-100
                      "
                    >
                      <path
                        d="M3 8.5L6.5 12L13 4"
                        fill="none"
                        stroke="var(--color-primary-purple)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{t('general.select_all')}</span>
                </label>
              )}

              {options.map((opt) => {
                const optId = getId(opt);
                const checked = selectedIds.includes(optId);
                return (
                  <label key={optId} className="flex items-center gap-3 text-sm font-normal cursor-pointer">
                    <span className="relative inline-flex items-center justify-center h-6 w-6">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(optId)}
                        className="
                          peer
                          h-6 w-6
                          rounded-lg
                          border
                          border-[var(--color-secondary-outline)]
                          appearance-none
                          cursor-pointer
                          checked:border-[var(--color-primary-purple)]
                          checked:bg-[var(--color-primary-white)]
                          transition-colors
                        "
                      />
                      <svg
                        viewBox="0 0 16 16"
                        className="
                          pointer-events-none
                          absolute
                          h-3 w-3
                          opacity-0
                          peer-checked:opacity-100
                        "
                      >
                        <path
                          d="M3 8.5L6.5 12L13 4"
                          fill="none"
                          stroke="var(--color-primary-purple)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{getLabel(opt)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {!error ? (
        <div className="min-h-[25px]" />
      ) : (
        <div className="min-h-[25px]">
          <Label id={`${errorId}-error`} variant="error" className="mt-0.5">
            {error}
          </Label>
        </div>
      )}
    </>
  );
}
