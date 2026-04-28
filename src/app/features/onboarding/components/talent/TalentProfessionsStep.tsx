import { Button, Label, ProfessionChip, WizardStep, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
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
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <div className="flex min-h-[85vh] lg:min-h-[70vh] flex-col justify-between">
          <div className="flex flex-col">
            <div className="w-full flex flex-col items-center gap-4 mb-2">
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]"
              >
                {t('onboarding.mode_selector.talent.title')}
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

            <div className="w-full mb-4 flex flex-col gap-4 flex-1">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-semibold mb-3">{t('onboarding.talent.step_profession.header')}</h1>
                <p className="text-sm">{t('onboarding.talent.step_profession.subtitle')}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-base font-semibold">{t('profile.basic_info.profession')}</Label>
                <div className="flex flex-wrap gap-2">
                  {professionsMeta.map((profession) => (
                    <ProfessionChip
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
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-4">
              <Button variant="outline" type="button" onClick={handleBackClick}>
                {t('buttons.back')}
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleContinue}
                disabled={selectedProfessionIds.length < 1 || isPending}
              >
                {isPending ? t('state.loading') : t('buttons.next')}
              </Button>
            </div>
            <ContinueLaterButton />
          </div>
        </div>
      </WizardStep>
    </section>
  );
};

export default TalentProfessionStep;
