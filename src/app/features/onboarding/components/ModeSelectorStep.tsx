import { Button, Icon, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ContinueLaterButton } from '.';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { WizardStep } from '../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../shared/components/Wizard/WizardStep';
import { getAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';
import { useMeData } from '../../auth/hooks/useMeData';
import type { ActiveMode } from '../../auth/types/auth.types';
import { useUpdateOnboardingMutation } from '../hooks/useUpdateOnboardingMutation';

type Props = WizardStepProps & {
  onModeChosen?: (mode: ActiveMode) => void;
};

function ModeSelectorStep({ onModeChosen }: Props) {
  const { t } = useTranslation();
  const { data: meData } = useMeData();
  const { mutate: updateOnboarding } = useUpdateOnboardingMutation();
  const { setMode } = useUserMode();
  const navigate = useNavigate();

  const token = getAuthToken();
  const decoded = token ? jwtDecoder(token) : null;
  const talentProfileSlug = decoded?.talentProfileSlug;

  const handleContinue = (mode: ActiveMode) => {
    if (!meData) return;

    let talentOnboardingStatus = meData.talentOnboardingStatus;
    let employerOnboardingStatus = meData.employerOnboardingStatus;

    if (mode === 'TALENT' && talentOnboardingStatus === 'NOT_STARTED') {
      talentOnboardingStatus = 'IN_PROGRESS';
    }

    if (mode === 'EMPLOYER' && employerOnboardingStatus === 'NOT_STARTED') {
      employerOnboardingStatus = 'IN_PROGRESS';
    }

    const nextActiveMode = mode;

    updateOnboarding(
      {
        activeMode: nextActiveMode,
        talentOnboardingStatus,
        employerOnboardingStatus,
      },
      {
        onSuccess: () => {
          if (nextActiveMode === 'TALENT') {
            setMode(USER_MODE_TALENT);
            if (talentOnboardingStatus === 'COMPLETED') {
              navigate(talentProfileSlug ? `${ROUTES.PUBLIC_PROFILE}/${talentProfileSlug}` : ROUTES.TALENT);
              return;
            }
          } else if (nextActiveMode === 'EMPLOYER') {
            setMode(USER_MODE_EMPLOYER);
            if (employerOnboardingStatus === 'COMPLETED') {
              navigate(ROUTES.EMPLOYER);
              return;
            }
          }

          onModeChosen?.(mode);
        },
      }
    );
  };

  return (
    <section className="w-full pb-6 pt-4">
      <WizardStep>
        <div className="flex min-h-[60vh] flex-col justify-between gap-10">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{t('onboarding.mode_selector.header')}</h1>
              <p className="text-sm">{t('onboarding.mode_selector.subtitle')}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 items-center lg:flex-row lg:justify-center">
            {meData?.talentOnboardingStatus !== 'COMPLETED' && (
              <ModeCard mode="TALENT" onContinue={() => handleContinue('TALENT')} />
            )}
            {meData?.employerOnboardingStatus !== 'COMPLETED' && (
              <ModeCard mode="EMPLOYER" onContinue={() => handleContinue('EMPLOYER')} />
            )}
          </div>
          <ContinueLaterButton />
        </div>
      </WizardStep>
    </section>
  );
}

type ModeCardProps = {
  mode: Exclude<ActiveMode, null>;
  onContinue: () => void;
};

const ModeCard = ({ mode, onContinue }: ModeCardProps) => {
  const { t } = useTranslation();
  const modeKey = mode === 'TALENT' ? USER_MODE_TALENT : USER_MODE_EMPLOYER;

  return (
    <div className="w-full max-w-[380px] bg-[var(--color-primary-white)] p-6 px-8 shadow-sm rounded-xl">
      <p className="mtext-base font-semibold text-[var(--color-primary-purple)] text-center">
        {t(`onboarding.mode_selector.${modeKey}.title`)}
      </p>
      <h2 className="my-5 text-lg font-semibold text-center">{t(`onboarding.mode_selector.${modeKey}.header`)}</h2>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center gap-2">
          <Icon name="tick" variant="primary" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_1`)}</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="tick" variant="primary" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_2`)}</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="tick" variant="primary" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_3`)}</span>
        </li>
      </ul>
      <Separator className="opacity-20 my-6" />
      <Button variant="primary" onClick={onContinue}>
        {t(`onboarding.mode_selector.${modeKey}.cta`)}
      </Button>
    </div>
  );
};

export default ModeSelectorStep;
