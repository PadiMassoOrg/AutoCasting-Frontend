import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { WizardStep } from '../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../shared/components/Wizard/WizardStep';
import ArrowLeftIconPurple from '../../../shared/icons/arrow-long-left-purple.svg';
import Logo from '../../../shared/icons/og-image.svg';
import TickIconPurple from '../../../shared/icons/tick-2-purple.svg';
import { logout } from '../../auth/services/authService';
import type { ActiveMode } from '../../auth/types/auth.types';
import { useUpdateOnboardingMutation } from '../hooks/useUpdateOnboardingMutation';

type Props = WizardStepProps;

function ModeSelectorStep({ goNext }: Props) {
  const { t } = useTranslation();
  const { mutate: updateOnboarding } = useUpdateOnboardingMutation();

  const handleContinue = (mode: ActiveMode) => {
    updateOnboarding(
      {
        activeMode: mode,
        talentOnboardingStatus: mode === 'TALENT' ? 'IN_PROGRESS' : 'NOT_STARTED',
        employerOnboardingStatus: mode === 'EMPLOYER' ? 'IN_PROGRESS' : 'NOT_STARTED',
      },
      {
        onSuccess: () => goNext?.(),
      }
    );
  };

  return (
    <section className="w-full">
      <WizardStep>
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src={Logo} className="w-14" />
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('onboarding.mode_selector.header')}</h1>
            <p className="text-sm">{t('onboarding.mode_selector.subtitle')}</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 items-center lg:flex-row lg:justify-center">
          <ModeCard mode="TALENT" onContinue={() => handleContinue('TALENT')} />
          <ModeCard mode="EMPLOYER" onContinue={() => handleContinue('EMPLOYER')} />
        </div>
        <button
          onClick={logout}
          className="w-full mb-6 mt-12 cursor-pointer text-base flex flex-row items-center justify-center gap-2 text-[var(--color-primary-purple)]"
        >
          <img src={ArrowLeftIconPurple} className="w-4" />
          <span>{t('onboarding.mode_selector.go_back')}</span>
        </button>
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
  const modeKey = mode === 'TALENT' ? 'talent' : 'employer';

  return (
    <div className="w-full max-w-[380px] bg-[var(--color-primary-white)] p-6 px-8 shadow-sm rounded-lg">
      <p className="mtext-base font-semibold text-[var(--color-primary-purple)] text-center">
        {t(`onboarding.mode_selector.${modeKey}.title`)}
      </p>
      <h2 className="my-5 text-lg font-semibold text-center">{t(`onboarding.mode_selector.${modeKey}.header`)}</h2>
      <ul className="flex flex-col gap-3">
        <li className="flex items-center gap-2">
          <img src={TickIconPurple} className="w-4" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_1`)}</span>
        </li>
        <li className="flex items-center gap-2">
          <img src={TickIconPurple} className="w-4" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_2`)}</span>
        </li>
        <li className="flex items-center gap-2">
          <img src={TickIconPurple} className="w-4" />
          <span>{t(`onboarding.mode_selector.${modeKey}.li_3`)}</span>
        </li>
      </ul>
      <Separator className="opacity-20 my-5" />
      <Button variant="primary" onClick={onContinue}>
        {t(`onboarding.mode_selector.${modeKey}.cta`)}
      </Button>
    </div>
  );
};

export default ModeSelectorStep;
