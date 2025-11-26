import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField } from 'autocasting-ui-library-padimasso';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';
import Logo from '../../../../shared/icons/og-image.svg';
import { useUpdateOnboardingMutation } from '../../hooks/useUpdateOnboardingMutation';
import { type TalentBasicInfoValues, getTalentBasicInfoSchema } from '../../schemas/talentBasicInfoStepSchema';

type Props = WizardStepProps & {
  onBackToModeSelector: () => void;
};

function TalentBasicInfoStep({
  onBackToModeSelector,
  goNext,
  goBack,
  stepIndex = 0,
  totalSteps = 1,
  progress = 0,
}: Props) {
  const { t } = useTranslation();
  const { mutate: updateOnboarding } = useUpdateOnboardingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TalentBasicInfoValues>({
    resolver: zodResolver(getTalentBasicInfoSchema(t)),
    mode: 'onChange',
  });

  const onSubmit = (data: TalentBasicInfoValues) => {
    // aquí luego irá la mutation al backend con data.stageName
    // por ahora solo avanzamos
    goNext?.();
  };

  return (
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <div className="flex min-h-[70vh] flex-col justify-between gap-10">
          <div>
            {/* Header */}
            <div className="w-full flex flex-col items-center gap-4 mb-6">
              <img src={Logo} className="w-14" />
              <button className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]">
                {t('onboarding.mode_selector.talent.title')}
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

            <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-10 flex flex-col gap-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-3">{t('onboarding.talent.step1.header')}</h1>
                <p className="text-sm">{t('onboarding.talent.step1.subtitle')}</p>
              </div>

              <FormInputField
                id="stageName"
                type="text"
                placeholder={t('onboarding.talent.step1.stage_name_label')}
                className="bg-[var(--color-primary-white)]"
                {...register('stageName')}
                error={errors.stageName?.message}
              />
            </form>
          </div>
          <div>
            <div className="flex justify-between items-center gap-4 mb-6">
              <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? t('state.loading') : t('buttons.next')}
              </Button>
            </div>
            <ContinueLaterButton />
          </div>
        </div>
      </WizardStep>
    </section>
  );
}

export default TalentBasicInfoStep;
