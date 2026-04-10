import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, WizardStep, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
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

  const isNextDisabled = !isValid || isSubmitting || isPending;

  return (
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[85vh] lg:min-h-[70vh] flex-col justify-between">
          <div className="flex flex-col">
            {/* Header */}
            <div className="w-full flex flex-col items-center gap-4 mb-2">
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]"
              >
                {t('onboarding.mode_selector.talent.title')}
              </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1 mb-4">
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

            <div className="w-full mb-4 flex flex-col gap-2 flex-1">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold mb-3">{t('onboarding.talent.step1.header')}</h1>
                <p className="text-sm">{t('onboarding.talent.step1.subtitle')}</p>
              </div>

              <FormInputField
                id="stageName"
                type="text"
                placeholder={t('general.placeholder.stage_name')}
                className="bg-[var(--color-primary-white)]"
                {...stageNameRegister}
                error={errors.stageName?.message ?? fieldErrors.stageName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-4">
              <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="submit" disabled={isNextDisabled}>
                {isPending || isSubmitting ? t('state.loading') : t('buttons.next')}
              </Button>
            </div>
            <ContinueLaterButton />
          </div>
        </form>
      </WizardStep>
    </section>
  );
}

export default TalentBasicInfoStep;
