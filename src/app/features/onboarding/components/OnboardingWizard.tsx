import { Wizard } from '../../../shared/components/Wizard';
import { useMeData } from '../../auth/hooks/useMeData';
import { EmployerBasicInfoStep } from './employer/EmployerBasicInfoStep';
import ModeSelectorStep from './ModeSelectorStep';
import { TalentBasicInfoStep } from './talent/TalentBasicInfoStep';

function OnboardingWizard() {
  const { data: meData, isLoading } = useMeData();

  if (isLoading || !meData) return null;

  if (!meData.activeMode) {
    return (
      <Wizard key="mode-selector">
        <ModeSelectorStep />
      </Wizard>
    );
  }

  if (meData.activeMode === 'TALENT') {
    return (
      <Wizard key="talent-flow">
        <TalentBasicInfoStep />
        {/* aquí luego irán TalentMediaStep, TalentConfirmStep */}
      </Wizard>
    );
  }

  if (meData.activeMode === 'EMPLOYER') {
    return (
      <Wizard key="employer-flow">
        <EmployerBasicInfoStep />
        {/* aquí luego irán EmployerMediaStep, EmployerConfirmStep */}
      </Wizard>
    );
  }

  return null;
}

export default OnboardingWizard;
