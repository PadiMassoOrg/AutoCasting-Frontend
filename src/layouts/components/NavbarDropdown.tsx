import { Separator } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export type MenuItem =
  | { type: 'link'; to: string; label: React.ReactNode; className?: string }
  | { type: 'external'; href: string; label: React.ReactNode; className?: string }
  | { type: 'button'; onClick: () => void; label: React.ReactNode; className?: string }
  | { type: 'separator' };

type Props = {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  className?: string;
  itemClassName?: string;
  closeOnItemClick?: boolean;
};

export default function NavbarDropdown({
  trigger,
  items,
  align = 'center',
  width,
  className,
  itemClassName = 'px-5 py-3 text-xl font-extrabold hover:bg-black/5 rounded-2xl whitespace-nowrap',
  closeOnItemClick = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const alignClass = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  const style: React.CSSProperties =
    width !== undefined
      ? { width }
      : {
          width: 'max-content',
          maxWidth: 'calc(100vw - 2rem)',
        };

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)} className="outline-none">
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            'absolute mt-3 z-50',
            alignClass,
            'rounded-3xl bg-white shadow-md border border-black/5 px-7 py-4',
            className
          )}
          style={style}
        >
          <ul className="flex flex-col gap-2">
            {items.map((it, i) => {
              if (it.type === 'separator') {
                return <Separator key={`sep-${i}`} className="opacity-20 my-1" />;
              }
              if (it.type === 'external') {
                return (
                  <li key={`ext-${i}`}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(itemClassName, it.className)}
                      onClick={() => closeOnItemClick && setOpen(false)}
                    >
                      {it.label}
                    </a>
                  </li>
                );
              }
              if (it.type === 'button') {
                return (
                  <li key={`btn-${i}`}>
                    <button
                      type="button"
                      className={clsx('cursor-pointer text-left w-full', itemClassName, it.className)}
                      onClick={() => {
                        if (closeOnItemClick) setOpen(false);
                        it.onClick();
                      }}
                    >
                      {it.label}
                    </button>
                  </li>
                );
              }
              return (
                <li key={`lnk-${i}`}>
                  <Link
                    to={it.to}
                    className={clsx(itemClassName, it.className)}
                    onClick={() => closeOnItemClick && setOpen(false)}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
