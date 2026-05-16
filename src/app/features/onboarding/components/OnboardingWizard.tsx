import { Wizard } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';
import { useMeData } from '../../auth/hooks/useMeData';
import { EmployerBasicInfoStep, EmployerConfirmationStep, EmployerMediaStep } from './employer';
import ModeSelectorStep from './ModeSelectorStep';
import { TalentBasicInfoStep, TalentConfirmationStep, TalentMediaStep } from './talent';
import TalentProfessionStep from './talent/TalentProfessionsStep';

function OnboardingWizard() {
  const navigate = useNavigate();
  const { data: meData, isLoading } = useMeData();
  const jwt = getAuthToken();
  const decoded = jwt ? jwtDecoder(jwt) : null;
  const talentProfileSlug = decoded?.talentProfileSlug;
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
        <TalentProfessionStep></TalentProfessionStep>
        <TalentMediaStep />
        <TalentConfirmationStep
          onGoToProfile={() =>
            navigate(
              talentProfileSlug ? `${ROUTES.PUBLIC_PROFILE}/${talentProfileSlug}` : ROUTES.TALENT_APPLIED_CASTINGS
            )
          }
        />
      </Wizard>
    );
  }

  if (currentFlow === 'EMPLOYER') {
    return (
      <Wizard key="employer-flow" className="h-full">
        <EmployerBasicInfoStep onBackToModeSelector={() => setCurrentFlow('MODE')} />
        <EmployerMediaStep />
        <EmployerConfirmationStep onGoToProfile={() => navigate(ROUTES.EMPLOYER_CASTINGS)} />
      </Wizard>
    );
  }

  return null;
}

export default OnboardingWizard;
