import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import { useEmployerProfile } from '../../../employer/employer-profile-edit/hooks/useEmployerProfile';
import { usePatchEmployerBasicInfoMutation } from '../../../employer/employer-profile-edit/hooks/usePatchEmployerBasicInfoMutation';
import { type EmployerBasicInfoValues, getEmployerBasicInfoSchema } from '../../schemas/emplyoerBasicInfoStepSchema';

type Props = WizardStepProps & {
  onBackToModeSelector?: () => void;
};

function EmployerBasicInfoStep({ onBackToModeSelector, goNext, stepIndex = 0, totalSteps = 1, progress = 0 }: Props) {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useEmployerProfile();
  const { submit, fieldErrors, clearFieldError, isPending } = usePatchEmployerBasicInfoMutation();

  const savedCompanyName = profile?.basicInfo?.companyName ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<EmployerBasicInfoValues>({
    resolver: zodResolver(getEmployerBasicInfoSchema(t)),
    mode: 'onChange',
    defaultValues: {
      companyName: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        companyName: savedCompanyName,
      });
    }
  }, [profile, savedCompanyName, reset]);

  const companyNameRegister = register('companyName', {
    onChange: () => clearFieldError('companyName'),
  });

  const onSubmit = async (data: EmployerBasicInfoValues) => {
    const result = await submit({
      companyName: data.companyName,
    }).catch(() => null);
    if (!result) return;
    goNext?.();
  };

  if (profilePending && !profile) return null;

  const isNextDisabled = !isValid;

  return (
    <section className="flex flex-col gap-3.5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <OnboardingStepShell
          modeLabel={t('onboarding.mode_selector.employer.title')}
          title={t('onboarding.employer.step_basic_info.header')}
          subtitle={t('onboarding.employer.step_basic_info.subtitle')}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          progress={progress}
          bodyClassName="mb-4"
          footer={
            <>
              <WizardActions
                secondaryAction={
                  onBackToModeSelector && (
                    <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                      {t('buttons.back')}
                    </Button>
                  )
                }
                primaryAction={
                  <Button variant="primary" type="submit" disabled={isNextDisabled} loading={isSubmitting || isPending}>
                    {t('buttons.next')}
                  </Button>
                }
              />
            </>
          }
        >
          <div className="flex w-full flex-col gap-2">
            <FormInputField
              id="companyName"
              type="text"
              placeholder={t('general.placeholder.company_name')}
              className="bg-[var(--color-primary-white)]"
              {...companyNameRegister}
              error={errors.companyName?.message ?? fieldErrors.companyName}
            />
          </div>
        </OnboardingStepShell>
      </form>
      <ContinueLaterButton />
    </section>
  );
}

export default EmployerBasicInfoStep;
