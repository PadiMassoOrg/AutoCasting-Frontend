import { Button, ButtonRow, Icon, WizardStep, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import Logo from '../../../../shared/icons/og-image.svg';
import { useMeData } from '../../../auth/hooks/useMeData';
import { useUpdateOnboardingMutation } from '../../hooks/useUpdateOnboardingMutation';

type Props = WizardStepProps & {
  onGoToProfile: () => void;
};

function EmployerConfirmationStep({ goBack, stepIndex = 2, totalSteps = 3, progress = 100, onGoToProfile }: Props) {
  const { t } = useTranslation();
  const { data: meData } = useMeData();
  const { mutate: updateOnboarding, isPending } = useUpdateOnboardingMutation();

  const handleConfirm = () => {
    updateOnboarding(
      {
        activeMode: 'EMPLOYER',
        talentOnboardingStatus: meData?.talentOnboardingStatus,
        employerOnboardingStatus: 'COMPLETED',
      },
      {
        onSuccess: () => {
          onGoToProfile();
        },
      }
    );
  };

  return (
    <section className="w-full  relative max-w-[400px]">
      <WizardStep>
        <div className="flex flex-col min-h-[90vh] lg:min-h-[65vh] justify-between">
          <div>
            {/* Header */}
            <div className="w-full flex flex-col items-center gap-4">
              <img src={Logo} className="w-14" />
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]"
              >
                {t('onboarding.mode_selector.employer.title')}
              </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1 mb-2">
              <div className="w-full h-[9px] rounded-full bg-[var(--color-secondary-offwhite)] overflow-hidden">
                <div
                  className="h-[9px] bg-[var(--color-primary-purple)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[13px] mt-1 font-semibold">
                {stepIndex + 1} {t('onboarding.common.of')} {totalSteps}
              </p>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-2xl font-semibold">{t('onboarding.employer.confirmation_step.header')}</h1>
              <p className="text-sm">{t('onboarding.employer.confirmation_step.subtitle')}</p>
              <span className="flex flex-row items-center gap-2 ">
                <p className="text-sm"> {t('onboarding.common.edit_profile_label_profile')}</p>
                <ButtonRow items={[<Icon variant="primary" name="profile" className="cursor-default" />]}></ButtonRow>
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center gap-4">
              <Button variant="outline" type="button" onClick={goBack}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="button" onClick={handleConfirm} disabled={isPending}>
                {isPending ? t('state.loading') : t('buttons.to_profile')}
              </Button>
            </div>
            <ContinueLaterButton />
          </div>
        </div>
      </WizardStep>
    </section>
  );
}

export default EmployerConfirmationStep;
