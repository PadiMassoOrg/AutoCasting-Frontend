import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wizard } from '../../../shared/components/Wizard';
import { getAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';
import { useMeData } from '../../auth/hooks/useMeData';
import { EmployerBasicInfoStep } from './employer';
import ModeSelectorStep from './ModeSelectorStep';
import { TalentBasicInfoStep, TalentConfirmationStep, TalentMediaStep } from './talent';

function OnboardingWizard() {
  const navigate = useNavigate();
  const { data: meData, isLoading } = useMeData();
  const jwt = getAuthToken();
  const [showModeSelector, setShowModeSelector] = useState(false);
  const decoded = jwtDecoder(jwt!);

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
        <TalentConfirmationStep
          onGoToProfile={() => navigate(`${ROUTES.PUBLIC_PROFILE}/${decoded?.publicSlug}`)}
        ></TalentConfirmationStep>
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
