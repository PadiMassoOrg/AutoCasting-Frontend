import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, WizardStep, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import { useEmployerProfile } from '../../../employer/employer-profile-edit/hooks/useEmployerProfile';
import { usePatchEmployerBasicInfoMutation } from '../../../employer/employer-profile-edit/hooks/usePatchEmployerBasicInfoMutation';
import { type EmployerBasicInfoValues, getEmployerBasicInfoSchema } from '../../schemas/emplyoerBasicInfoStepSchema';

type Props = WizardStepProps & {
  onBackToModeSelector: () => void;
};

function EmployerBasicInfoStep({ onBackToModeSelector, goNext, stepIndex = 0, totalSteps = 1, progress = 0 }: Props) {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useEmployerProfile();
  const { submit, fieldErrors, clearFieldError, isPending } = usePatchEmployerBasicInfoMutation();

  const savedCompanyName = profile?.basicInfo?.companyName ?? '';
  const savedTaxNumber = profile?.basicInfo?.taxNumber ?? '';

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
      taxNumber: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        companyName: savedCompanyName,
        taxNumber: savedTaxNumber,
      });
    }
  }, [profile, savedCompanyName, savedTaxNumber, reset]);

  const companyNameRegister = register('companyName', {
    onChange: () => clearFieldError('companyName'),
  });
  const taxNumberRegister = register('taxNumber', {
    onChange: () => clearFieldError('taxNumber'),
  });

  const onSubmit = async (data: EmployerBasicInfoValues) => {
    const result = await submit({
      companyName: data.companyName,
      taxNumber: data.taxNumber,
    }).catch(() => null);
    if (!result) return;
    goNext?.();
  };

  if (profilePending && !profile) return null;

  const isNextDisabled = !isValid || isSubmitting || isPending;
  const taxNumberError = errors.taxNumber?.message ?? fieldErrors.taxNumber;

  return (
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[85vh] lg:min-h-[70vh] flex-col justify-between">
          <div className="flex flex-col">
            <div className="w-full flex flex-col items-center gap-4 mb-2">
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]"
              >
                {t('onboarding.mode_selector.employer.title')}
              </button>
            </div>

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
                <h1 className="text-2xl font-semibold mb-1">{t('onboarding.employer.step1.header')}</h1>
                <p className="text-sm">{t('onboarding.employer.step1.subtitle')}</p>
              </div>

              <FormInputField
                id="companyName"
                type="text"
                placeholder={t('general.placeholder.company_name')}
                className="bg-[var(--color-primary-white)]"
                {...companyNameRegister}
                error={errors.companyName?.message ?? fieldErrors.companyName}
              />

              <div className="flex flex-col">
                <FormInputField
                  id="taxNumber"
                  type="text"
                  placeholder={t('general.placeholder.tax_number')}
                  className="bg-[var(--color-primary-white)]"
                  {...taxNumberRegister}
                  error={taxNumberError}
                />
                <p
                  className={`text-[var(--color-secondary-grey-fonts)] text-xs italic pl-2 ${
                    taxNumberError ? 'pt-1' : '-mt-[10px]'
                  }`}
                >
                  {t('onboarding.employer.step1.tax_disclaimer')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-4">
              <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="submit" disabled={isNextDisabled}>
                {isSubmitting || isPending ? t('state.loading') : t('buttons.next')}
              </Button>
            </div>

            <ContinueLaterButton />
          </div>
        </form>
      </WizardStep>
    </section>
  );
}

export default EmployerBasicInfoStep;
