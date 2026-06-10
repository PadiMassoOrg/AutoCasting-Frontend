import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  ChoiceChip,
  FormInputField,
  Label,
  WizardActions,
  type WizardStepProps,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import { useCachedSiteMetadataSlice } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import { MAX_TALENT_PROFESSIONS } from '../../../talent/talent-profile-edit/constants';
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
  const professionsMeta = (useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined) ?? [];
  const profileProfessionIds = useMemo(
    () => (profile?.basicInfo?.professions ?? []).map((profession) => profession.id),
    [profile?.basicInfo?.professions]
  );
  const [selectedProfessionIds, setSelectedProfessionIds] = useState<string[]>(profileProfessionIds);
  const [professionError, setProfessionError] = useState<string | null>(null);

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
    reset({ stageName: savedStageName });
  }, [savedStageName, reset]);

  useEffect(() => {
    setSelectedProfessionIds(profileProfessionIds);
  }, [profileProfessionIds]);

  const stageNameRegister = register('stageName', {
    onChange: () => clearFieldError('stageName'),
  });

  const toggleProfession = (id: string) => {
    setSelectedProfessionIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((current) => current !== id)
        : prev.length >= MAX_TALENT_PROFESSIONS
          ? prev
          : [...prev, id];
      if (next.length > 0) setProfessionError(null);
      return next;
    });
  };

  const onSubmit = async (data: TalentBasicInfoValues) => {
    if (selectedProfessionIds.length < 1) {
      setProfessionError(t('validation.required'));
      return;
    }

    const result = await submit({ stageName: data.stageName, professionIds: selectedProfessionIds }).catch(() => null);
    if (!result) return;
    goNext?.();
  };

  if (profilePending && !profile) return null;

  const isNextDisabled = !isValid || selectedProfessionIds.length < 1;

  return (
    <section className="flex flex-col gap-3.5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <OnboardingStepShell
          modeLabel={t('onboarding.mode_selector.talent.title')}
          title={t('onboarding.talent.step_basic_info.combined_header')}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          progress={progress}
          bodyClassName=""
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
            </>
          }
        >
          <div className="flex flex-col">
            <FormInputField
              id="stageName"
              label={t('onboarding.talent.step_basic_info.stage_name_label')}
              labelClassName="text-base font-semibold"
              type="text"
              placeholder={t('general.placeholder.stage_name')}
              className="bg-[var(--color-primary-white)]"
              {...stageNameRegister}
              error={errors.stageName?.message ?? fieldErrors.stageName}
            />

            <div className="mt-1 flex flex-col gap-2">
              <Label className="text-base font-semibold">
                {t('profile.basic_info.profession_count', {
                  selected: selectedProfessionIds.length,
                  total: MAX_TALENT_PROFESSIONS,
                })}
              </Label>

              <div className="flex flex-wrap gap-2">
                {professionsMeta.map((profession) => {
                  const active = selectedProfessionIds.includes(profession.id);
                  const disabled = !active && selectedProfessionIds.length >= MAX_TALENT_PROFESSIONS;

                  return (
                    <ChoiceChip
                      key={profession.id}
                      label={t(profession.stringCode)}
                      selected={active}
                      disabled={disabled}
                      className={disabled ? 'bg-white cursor-not-allowed opacity-50' : 'bg-white'}
                      onClick={() => toggleProfession(profession.id)}
                      title={t(profession.stringCode)}
                    />
                  );
                })}
              </div>

              {professionError && (
                <Label variant="error" className="pl-1">
                  {professionError}
                </Label>
              )}
            </div>
          </div>
        </OnboardingStepShell>
      </form>
      <ContinueLaterButton />
    </section>
  );
}

export default TalentBasicInfoStep;
