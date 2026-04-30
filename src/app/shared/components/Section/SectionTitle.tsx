import { ChevronLeft } from 'autocasting-ui-library-padimasso';
import type { ReactNode } from 'react';
import { useDashboardShell } from 'autocasting-ui-library-padimasso';

type SectionTitleProps = {
  title: ReactNode;
  action?: ReactNode;
};

export default function SectionTitle({ title, action }: SectionTitleProps) {
  const { isDesktop, hasSections, goToNav } = useDashboardShell();

  const showBack = !isDesktop && hasSections;
  const stackActionOnMobile = !isDesktop && Boolean(action);

  return (
    <div className={stackActionOnMobile ? 'flex flex-col gap-3' : 'flex flex-row gap-4 items-center justify-between'}>
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <button type="button" onClick={goToNav} className="cursor-pointer flex items-center gap-1">
            <ChevronLeft />
            <h2 className="text-lg font-semibold truncate">{title}</h2>
          </button>
        ) : (
          <h2 className="text-lg font-semibold truncate">{title}</h2>
        )}
      </div>

      {action ? <div className={stackActionOnMobile ? 'w-full [&>*]:w-full' : 'shrink-0'}>{action}</div> : null}
    </div>
  );
}
