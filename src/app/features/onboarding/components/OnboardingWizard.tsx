import { Wizard } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useMeData } from '../../auth/hooks/useMeData';
import { EmployerBasicInfoStep, EmployerConfirmationStep, EmployerMediaStep } from './employer';
import ModeSelectorStep from './ModeSelectorStep';
import { TalentBasicInfoStep, TalentConfirmationStep, TalentMediaStep } from './talent';

function OnboardingWizard() {
  const { data: meData, isLoading } = useMeData();
  const [currentFlow, setCurrentFlow] = useState<'MODE' | 'TALENT' | 'EMPLOYER'>('MODE');

  if (isLoading || !meData) return null;

  if (currentFlow === 'MODE') {
    return (
      <Wizard key="mode-selector" className="h-full">
        <ModeSelectorStep
          onModeChosen={(mode) => {
            if (mode === 'TALENT') {
              setCurrentFlow('TALENT');
            } else if (mode === 'EMPLOYER') {
              setCurrentFlow('EMPLOYER');
            }
          }}
        />
      </Wizard>
    );
  }

  if (currentFlow === 'TALENT') {
    return (
      <Wizard key="talent-flow" className="h-full">
        <TalentBasicInfoStep onBackToModeSelector={() => setCurrentFlow('MODE')} />
        <TalentMediaStep />
        <TalentConfirmationStep />
      </Wizard>
    );
  }

  if (currentFlow === 'EMPLOYER') {
    return (
      <Wizard key="employer-flow" className="h-full">
        <EmployerBasicInfoStep onBackToModeSelector={() => setCurrentFlow('MODE')} />
        <EmployerMediaStep />
        <EmployerConfirmationStep />
      </Wizard>
    );
  }

  return null;
}

export default OnboardingWizard;
