import { Button, ChoiceChip, Label, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import { useCachedSiteMetadataSlice } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import { usePatchTalentBasicInfoMutation } from '../../../talent/talent-profile-edit/hooks/usePatchTalentBasicInfoMutation';
import { useTalentProfile } from '../../../talent/talent-profile-edit/hooks/useTalentProfile';

type Props = WizardStepProps & {
  onBackToModeSelector?: () => void;
};

const TalentProfessionStep = ({
  goNext,
  goBack,
  stepIndex = 1,
  totalSteps = 4,
  progress = 0,
  onBackToModeSelector,
}: Props) => {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useTalentProfile();
  const { submit, isPending } = usePatchTalentBasicInfoMutation();

  const professionsMeta = (useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined) ?? [];
  const profileProfessionIds = useMemo(
    () => (profile?.basicInfo?.professions ?? []).map((p) => p.id),
    [profile?.basicInfo?.professions]
  );

  const [selectedProfessionIds, setSelectedProfessionIds] = useState<string[]>(profileProfessionIds);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedProfessionIds(profileProfessionIds);
  }, [profileProfessionIds]);

  const toggleProfession = (id: string) => {
    setSelectedProfessionIds((prev) => {
      if (prev.includes(id)) return prev.filter((current) => current !== id);
      return [...prev, id];
    });
    setError(null);
  };

  const handleBackClick = () => {
    if (onBackToModeSelector) onBackToModeSelector();
    else goBack?.();
  };

  const handleContinue = async () => {
    if (selectedProfessionIds.length < 1) {
      setError(t('validation.required'));
      return;
    }

    const saved = await submit({ professionIds: selectedProfessionIds }).catch(() => null);
    if (!saved) return;
    goNext?.();
  };

  if (profilePending && !profile) return null;

  return (
    <OnboardingStepShell
      modeLabel={t('onboarding.mode_selector.talent.title')}
      title={t('onboarding.talent.step_profession.header')}
      subtitle={t('onboarding.talent.step_profession.subtitle')}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      progress={progress}
      bodyClassName="mb-4"
      footer={
        <>
          <WizardActions
            secondaryAction={
              <Button variant="outline" type="button" onClick={handleBackClick}>
                {t('buttons.back')}
              </Button>
            }
            primaryAction={
              <Button
                variant="primary"
                type="button"
                onClick={handleContinue}
                disabled={selectedProfessionIds.length < 1}
                loading={isPending}
              >
                {t('buttons.next')}
              </Button>
            }
          />
          <ContinueLaterButton />
        </>
      }
    >
      <div className="flex w-full flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.basic_info.profession')}</Label>
        <div className="flex flex-wrap gap-2">
          {professionsMeta.map((profession) => (
            <ChoiceChip
              className="bg-white"
              key={profession.id}
              label={t(profession.stringCode)}
              selected={selectedProfessionIds.includes(profession.id)}
              onClick={() => toggleProfession(profession.id)}
              title={t(profession.stringCode)}
            />
          ))}
        </div>
        {error && (
          <Label variant="error" className="pl-1">
            {error}
          </Label>
        )}
      </div>
    </OnboardingStepShell>
  );
};

export default TalentProfessionStep;
