import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';
import Logo from '../../../../shared/icons/og-image.svg';
import { usePatchTalentBasicInfoMutation } from '../../../talent/talent-profile-edit/hooks/usePatchTalentBasicInfoMutation';
import { type TalentBasicInfoValues, getTalentBasicInfoSchema } from '../../schemas/talentBasicInfoStepSchema';

type Props = WizardStepProps & {
  onBackToModeSelector: () => void;
};

function TalentBasicInfoStep({ onBackToModeSelector, goNext, stepIndex = 0, totalSteps = 1, progress = 0 }: Props) {
  const { t } = useTranslation();
  const { mutate: patchBasicInfo, isPending } = usePatchTalentBasicInfoMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TalentBasicInfoValues>({
    resolver: zodResolver(getTalentBasicInfoSchema(t)),
    mode: 'onChange',
  });

  const onSubmit = (data: TalentBasicInfoValues) => {
    setServerError(null);

    patchBasicInfo(
      { stageName: data.stageName },
      {
        onSuccess: () => {
          goNext?.();
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
        {/* El FORM envuelve todo: contenido + botones inferiores */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[70vh] flex-col justify-between gap-10">
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

            {/* Campo */}
            <div className="w-full mb-4 flex flex-col gap-4">
              <div className="text-center mb-4">
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
            </div>

            {serverError && (
              <Label variant="error" className="pl-1">
                {serverError}
              </Label>
            )}
          </div>

          {/* Zona inferior: botones + "Salir y continuar más tarde" */}
          <div>
            <div className="flex justify-between items-center gap-4 mb-6">
              <Button variant="outline" type="button" onClick={onBackToModeSelector}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="submit" disabled={isPending}>
                {isPending ? t('state.loading') : t('buttons.next')}
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
