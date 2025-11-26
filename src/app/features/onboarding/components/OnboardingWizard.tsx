import { useState } from 'react';
import { Wizard } from '../../../shared/components/Wizard';
import { useMeData } from '../../auth/hooks/useMeData';
import { EmployerBasicInfoStep } from './employer';
import ModeSelectorStep from './ModeSelectorStep';
import { TalentBasicInfoStep, TalentMediaStep } from './talent';

function OnboardingWizard() {
  const { data: meData, isLoading } = useMeData();
  const [showModeSelector, setShowModeSelector] = useState(false);

  if (isLoading || !meData) return null;

  if (!meData.activeMode || showModeSelector) {
    return (
      <Wizard key="mode-selector">
        <ModeSelectorStep onModeChosen={() => setShowModeSelector(false)} />
      </Wizard>
    );
  }

  if (meData.activeMode === 'TALENT') {
    return (
      <Wizard key="talent-flow">
        <TalentBasicInfoStep onBackToModeSelector={() => setShowModeSelector(true)} />
        <TalentMediaStep></TalentMediaStep>
      </Wizard>
    );
  }

  if (meData.activeMode === 'EMPLOYER') {
    return (
      <Wizard key="employer-flow">
        <EmployerBasicInfoStep onBackToModeSelector={() => setShowModeSelector(true)} />
        {/* aquí luego irán EmployerMediaStep, EmployerConfirmStep */}
      </Wizard>
    );
  }

  return null;
}

export default OnboardingWizard;
