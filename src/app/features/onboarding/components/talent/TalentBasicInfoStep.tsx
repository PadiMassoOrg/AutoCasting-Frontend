import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import { usePatchTalentBasicInfoMutation } from '../../../talent/talent-profile-edit/hooks/usePatchTalentBasicInfoMutation';
import { useTalentProfile } from '../../../talent/talent-profile-edit/hooks/useTalentProfile';
import { type TalentBasicInfoValues, getTalentBasicInfoSchema } from '../../schemas/talentBasicInfoStepSchema';

type Props = WizardStepProps & {
  onBackToModeSelector: () => void;
};

function TalentBasicInfoStep({ onBackToModeSelector, goNext, stepIndex = 0, totalSteps = 1, progress = 0 }: Props) {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useTalentProfile();
  const { submit, fieldErrors, clearFieldError, isPending } = usePatchTalentBasicInfoMutation();
  const savedStageName = profile?.basicInfo?.stageName ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<TalentBasicInfoValues>({
    resolver: zodResolver(getTalentBasicInfoSchema(t)),
    mode: 'onChange',
    defaultValues: {
      stageName: '',
    },
  });

  useEffect(() => {
    if (savedStageName) {
      reset({ stageName: savedStageName });
    }
  }, [savedStageName, reset]);

  const stageNameRegister = register('stageName', {
    onChange: () => clearFieldError('stageName'),
  });

  const onSubmit = async (data: TalentBasicInfoValues) => {
    const result = await submit({ stageName: data.stageName }).catch(() => null);
    if (!result) return;
    goNext?.();
  };

  if (profilePending && !profile) return null;

  const isNextDisabled = !isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OnboardingStepShell
        modeLabel={t('onboarding.mode_selector.talent.title')}
        title={t('onboarding.talent.step_basic_info.header')}
        subtitle={t('onboarding.talent.step_basic_info.subtitle')}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        progress={progress}
        bodyClassName="mb-4"
        footer={
          <>
            <WizardActions
              secondaryAction={
                <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                  {t('buttons.back')}
                </Button>
              }
              primaryAction={
                <Button variant="primary" type="submit" disabled={isNextDisabled} loading={isPending || isSubmitting}>
                  {t('buttons.next')}
                </Button>
              }
            />
            <ContinueLaterButton />
          </>
        }
      >
        <div className="flex w-full flex-col gap-2">
          <FormInputField
            id="stageName"
            type="text"
            placeholder={t('general.placeholder.stage_name')}
            className="bg-[var(--color-primary-white)]"
            {...stageNameRegister}
            error={errors.stageName?.message ?? fieldErrors.stageName}
          />
        </div>
      </OnboardingStepShell>
    </form>
  );
}

export default TalentBasicInfoStep;
