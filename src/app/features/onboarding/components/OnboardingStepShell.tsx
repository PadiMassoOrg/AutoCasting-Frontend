import {
  SectionCard,
  Separator,
  WizardBody,
  WizardFooter,
  WizardHeader,
  WizardLayout,
} from 'autocasting-ui-library-padimasso';
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
    <section className={clsx('relative m-auto sm:w-full sm:max-w-[480px]', className)}>
      <SectionCard>
        <WizardLayout className="flex justify-between !h-[580px] sm:min-h-[65vh]">
          <div className="flex min-h-0 flex-1 flex-col">
            {(topSlot || modeLabel || typeof progress === 'number') && (
              <div className="px-6">
                <div className="flex w-full flex-col items-center gap-2">
                  {topSlot}
                  {modeLabel ? (
                    <div className="w-full text-center text-[14px] font-semibold uppercase text-(--color-primary-purple)">
                      {modeLabel}
                    </div>
                  ) : null}
                  {typeof progress === 'number' ? (
                    <WizardHeader
                      title=""
                      stepIndex={stepIndex}
                      totalSteps={totalSteps}
                      progress={progress}
                      className="w-full gap-1"
                      metaClassName="text-[13px] font-semibold"
                      progressTrackClassName="h-[9px] w-full overflow-hidden rounded-full bg-[var(--color-secondary-offwhite)]"
                      progressBarClassName="h-[9px] bg-[var(--color-primary-purple)] transition-all"
                      contentClassName="text-center"
                      titleClassName="hidden"
                      subtitleClassName="hidden"
                    />
                  ) : null}
                </div>
              </div>
            )}
            <Separator className=" opacity-20 my-4" />
            {(title || subtitle) && (
              <div className="px-3 mb-3">
                <WizardHeader
                  title={title}
                  subtitle={subtitle}
                  contentClassName="text-center flex flex-col gap-1"
                  titleClassName="text-lg font-semibold"
                  subtitleClassName="text-sm"
                  showStepCount={false}
                  showProgressBar={false}
                  showProgressPercentage={false}
                />
              </div>
            )}

            <WizardBody
              className={clsx('', alignBody === 'center' ? 'flex items-center justify-center' : '', bodyClassName)}
            >
              {children}
            </WizardBody>
          </div>
          <Separator className=" opacity-20 mt-10 mb-4" />
          {footer ? <WizardFooter>{footer}</WizardFooter> : null}
        </WizardLayout>
      </SectionCard>
    </section>
  );
}

export default OnboardingStepShell;
