import type { ReactNode } from 'react';

export type WizardInjectedProps = {
  stepIndex: number;
  totalSteps: number;
  progress: number;
  goNext: () => void;
  goBack: () => void;
};

export type WizardStepProps = Partial<WizardInjectedProps> & {
  children?: ReactNode;
};

function WizardStep({ children }: WizardStepProps) {
  return <>{children}</>;
}

export default WizardStep;
