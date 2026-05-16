import { WizardBody, WizardFooter, WizardHeader, WizardLayout } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import type { ReactNode } from 'react';

type OnboardingStepShellProps = {
  modeLabel?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  stepIndex?: number;
  totalSteps?: number;
  progress?: number;
  topSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  alignBody?: 'start' | 'center';
};

function OnboardingStepShell({
  modeLabel,
  title,
  subtitle,
  stepIndex,
  totalSteps,
  progress,
  topSlot,
  children,
  footer,
  className,
  bodyClassName,
  alignBody = 'start',
}: OnboardingStepShellProps) {
  return (
    <section className={clsx('relative w-full max-w-[400px]', className)}>
      <WizardLayout className="min-h-[80vh] justify-between lg:min-h-[65vh]">
        <div className="flex min-h-0 flex-1 flex-col">
          {(topSlot || modeLabel) && (
            <div className="mb-2 flex w-full flex-col items-center gap-4">
              {topSlot}
              {modeLabel ? (
                <div className="w-full rounded-lg bg-(--color-primary-white) py-3 text-center text-[14px] font-semibold uppercase text-(--color-primary-purple)">
                  {modeLabel}
                </div>
              ) : null}
            </div>
          )}

          {(title || subtitle || typeof progress === 'number') && (
            <WizardHeader
              title={title}
              subtitle={subtitle}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              progress={progress}
              className="mb-4 gap-1"
              metaClassName="text-[13px] mt-1 font-semibold"
              progressTrackClassName="mb-1 h-[9px] w-full overflow-hidden rounded-full bg-[var(--color-secondary-offwhite)]"
              progressBarClassName="h-[9px] bg-[var(--color-primary-purple)] transition-all"
              contentClassName="text-center"
              titleClassName="mb-1 text-2xl font-semibold"
              subtitleClassName="text-sm"
            />
          )}

          <WizardBody
            className={clsx('pr-1', alignBody === 'center' ? 'flex items-center justify-center' : '', bodyClassName)}
          >
            {children}
          </WizardBody>
        </div>

        {footer ? <WizardFooter className="mt-6 flex flex-col items-stretch gap-6">{footer}</WizardFooter> : null}
      </WizardLayout>
    </section>
  );
}

export default OnboardingStepShell;
