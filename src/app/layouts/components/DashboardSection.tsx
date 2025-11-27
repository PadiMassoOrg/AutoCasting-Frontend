import type { ReactNode } from 'react';

type DashboardSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const DashboardSection = ({ children, className = '', contentClassName = 'p-6' }: DashboardSectionProps) => {
  return (
    <article
      className={
        'lg:flex lg:flex-col lg:gap-6 bg-[var(--color-primary-white)] ' +
        'rounded-2xl border-[var(--color-secondary-outline)] border-1 ' +
        className
      }
    >
      <div className={'p-6 ' + contentClassName}>{children}</div>
    </article>
  );
};

export default DashboardSection;
