import { Button, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import Logo from '../../../../shared/icons/og-image.svg';
import { useMeData } from '../../../auth/hooks/useMeData';
import { useUpdateOnboardingMutation } from '../../hooks/useUpdateOnboardingMutation';

type Props = WizardStepProps & {
  onGoToProfile: () => void;
};

function TalentConfirmationStep({ goBack, stepIndex = 2, totalSteps = 3, progress = 100, onGoToProfile }: Props) {
  const { t } = useTranslation();
  const { data: meData } = useMeData();
  const { mutate: updateOnboarding, isPending } = useUpdateOnboardingMutation();

  const handleConfirm = () => {
    updateOnboarding(
      {
        activeMode: 'TALENT',
        talentOnboardingStatus: 'COMPLETED',
        employerOnboardingStatus: meData?.employerOnboardingStatus,
      },
      {
        onSuccess: () => {
          onGoToProfile();
        },
      }
    );
  };

  return (
    <section className="flex flex-col gap-3.5">
      <OnboardingStepShell
        modeLabel={t('onboarding.mode_selector.talent.title')}
        title={t('onboarding.talent.step_confirmation.header')}
        subtitle={t('onboarding.talent.step_confirmation.subtitle')}
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
          </>
        }
      >
        <p></p>
      </OnboardingStepShell>
      <ContinueLaterButton />
    </section>
  );
}

export default TalentConfirmationStep;
