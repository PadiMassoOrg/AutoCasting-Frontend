import clsx from 'clsx';
import React from 'react';

type ButtonRowProps = {
  items: React.ReactNode[];
  className?: string;
  innerClassName?: string;
};

export default function ButtonRow({ items, className, innerClassName }: ButtonRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'inline-flex items-center justify-center rounded-lg bg-white shadow-sm h-11 px-4',
          innerClassName
        )}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="w-px h-7 mx-4 bg-[var(--color-secondary-outline)]" />}
            <div className="flex items-center justify-center">{item}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
