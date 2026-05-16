import { Button, ButtonRow, Icon, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
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
    <OnboardingStepShell
      modeLabel={t('onboarding.mode_selector.employer.title')}
      title={t('onboarding.employer.step_confirmation.header')}
      subtitle={t('onboarding.employer.step_confirmation.subtitle')}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      progress={progress}
      topSlot={<img src={Logo} className="w-14" />}
      bodyClassName="text-center"
      footer={
        <>
          <WizardActions
            secondaryAction={
              <Button variant="outline" type="button" onClick={goBack}>
                {t('buttons.back')}
              </Button>
            }
            primaryAction={
              <Button variant="primary" type="button" onClick={handleConfirm} loading={isPending}>
                {t('buttons.to_profile')}
              </Button>
            }
          />
          <ContinueLaterButton />
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm">
        <span className="flex flex-row items-center justify-center gap-2">
          <p className="text-sm">{t('onboarding.common.edit_profile_label_profile')}</p>
          <ButtonRow items={[<Icon variant="primary" name="profile" className="cursor-default" />]}></ButtonRow>
        </span>
      </div>
    </OnboardingStepShell>
  );
}

export default EmployerConfirmationStep;
