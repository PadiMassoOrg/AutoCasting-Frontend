import { Children, cloneElement, isValidElement, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import type { WizardInjectedProps, WizardStepProps } from './WizardStep';

type WizardProps = {
  children: ReactNode;
};

function Wizard({ children }: WizardProps) {
  const steps = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<WizardStepProps>[],
    [children]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const totalSteps = steps.length;
  const progress = totalSteps === 0 ? 0 : ((activeIndex + 1) / totalSteps) * 100;

  const goNext = () => setActiveIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  const goBack = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const injectedProps: WizardInjectedProps = {
    stepIndex: activeIndex,
    totalSteps,
    progress,
    goNext,
    goBack,
  };

  const CurrentStep = steps[activeIndex];

  return cloneElement(CurrentStep, injectedProps);
}

export default Wizard;
