import type { ReactNode } from 'react';

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const SectionCard = ({ children, className = '', contentClassName = '' }: SectionCardProps) => {
  return (
    <article
      className={[
        'lg:flex lg:flex-col lg:gap-6 bg-[var(--color-primary-white)]',
        'rounded-2xl border border-[var(--color-secondary-outline)]',
        className,
      ].join(' ')}
    >
      <div className={['p-6', contentClassName].join(' ')}>{children}</div>
    </article>
  );
};

export default SectionCard;
