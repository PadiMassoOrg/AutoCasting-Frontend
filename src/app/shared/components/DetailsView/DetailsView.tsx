import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';

import closeIcon from '../../icons/cross-small.svg';

type DetailsViewProps = {
  open: boolean;
  onClose: () => void;
  headerLeft: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DetailsView({
  open,
  onClose,
  headerLeft: navigation,
  headerRight,
  children,
  className,
}: DetailsViewProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Overlay */}
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/60" />

      {/* Panel derecho */}
      <aside
        className={clsx(
          'relative ml-auto h-full w-full max-w-[550px]  bg-[var(--color-secondary-white)] shadow-xl flex flex-col',
          className
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-5 border-b border-[var(--color-secondary-outline)] bg-[var(--color-primary-white)]">
          {navigation}
          <div className="flex items-center gap-5">
            {headerRight}
            <img src={closeIcon} className="w-[15px] cursor-pointer" onClick={onClose}></img>
          </div>
        </header>

        {/* Body scrolleable */}
        <div className="flex-1 min-h-0 overflow-auto p-6">{children}</div>
      </aside>
    </div>
  );
}
