import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { ChevronUpDown } from '../../../shared/components/Chevron';

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function FilterSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  const toggleOpen = () => setOpen((v) => !v);

  return (
    <article className="w-full flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
      >
        <h4 className="text-sm font-bold">{title}</h4>
        <ChevronUpDown open={open} />
      </div>

      <div
        className={clsx(
          'mt-3 grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </article>
  );
}
