import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { ChevronUpDown } from '../../../../shared/components/Chevron';

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
};

export default function FilterSection({ title, children, defaultOpen = false, count = 0 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  return (
    <article className="pt-6 w-full flex flex-col">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold">{title}</h4>
          {count > 0 && (
            <span
              aria-label={`${count} filtros activos`}
              className="opacity-90 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary-black)] px-1.5 text-[10px] font-semibold text-white"
            >
              {count}
            </span>
          )}
        </div>
        <ChevronUpDown open={open} />
      </div>

      <div
        className={clsx(
          'pt-6 grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </article>
  );
}
