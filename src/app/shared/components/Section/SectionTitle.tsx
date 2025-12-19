import type { ReactNode } from 'react';
import { useDashboardShell } from '../../../layouts/components/DashboardShell';
import { ChevronLeft } from '../Chevron';

type SectionTitleProps = {
  title: ReactNode;
  action?: ReactNode;
};

export default function SectionTitle({ title, action }: SectionTitleProps) {
  const { isDesktop, goToNav } = useDashboardShell();

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {!isDesktop ? (
          <button type="button" onClick={goToNav} className="cursor-pointer flex items-center gap-1" aria-label="Back">
            <ChevronLeft />
            <h2 className="text-lg font-semibold truncate">{title}</h2>
          </button>
        ) : (
          <h2 className="text-lg font-semibold truncate">{title}</h2>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
