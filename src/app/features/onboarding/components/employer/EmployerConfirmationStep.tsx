import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';
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
  const [serverError, setServerError] = useState<string | null>(null);

  const handleConfirm = () => {
    setServerError(null);

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
        onError: (err: any) => {
          const message = err?.response?.data?.message || t('state.server_err');
          setServerError(message);
        },
      }
    );
  };

  return (
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <div className="flex min-h-[85vh] lg:min-h-[70vh] flex-col justify-between gap-10">
          <div>
            {/* Header */}
            <div className="w-full flex flex-col items-center gap-4 mb-6">
              <img src={Logo} className="w-14" />
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]"
              >
                {t('onboarding.mode_selector.employer.title')}
              </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1 mb-8">
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
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-3">{t('onboarding.employer.confirmation_step.header')}</h1>
              <p className="text-sm">{t('onboarding.employer.confirmation_step.subtitle')}</p>
            </div>

            {serverError && (
              <div className="mt-4">
                <Label variant="error" className="pl-1">
                  {serverError}
                </Label>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center gap-4 mb-6">
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
