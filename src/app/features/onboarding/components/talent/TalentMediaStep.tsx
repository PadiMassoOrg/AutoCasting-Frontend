import { Button, Label, UploadTile, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';

import { useProfileMediaPatch } from '../../../../integrations/supabase/media/hooks/useProfileMediaPatch';
import { getBackendErrorMessage } from '../../../../shared/utils/backendErrorHandling';
import { useTalentProfile } from '../../../talent/talent-profile-edit/hooks/useTalentProfile';
import { fileSchema } from '../../../talent/talent-profile-edit/schemas/mediaSchema';

type Props = WizardStepProps & {
  onBackToModeSelector?: () => void;
};

function TalentMediaStep({ goNext, goBack, stepIndex = 1, totalSteps = 3, progress = 0, onBackToModeSelector }: Props) {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useTalentProfile();
  const profileId = profile?.id!;
  const currentHeadshotUrl = profile?.media?.headshotImageUrl ?? null;
  const { mutate: uploadHeadshot, isPending: uploadPending } = useProfileMediaPatch(profileId);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errHeadshot, setErrHeadshot] = useState<string | null>(null);
  const [bust, setBust] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);

  const effectiveHeadshotUrl = isDeleted ? null : currentHeadshotUrl;

  const canContinue = !!previewUrl || !!effectiveHeadshotUrl;
  const isBusy = uploadPending || profilePending || !profileId;

  const handleSelect = async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      setErrHeadshot(msg);
      return;
    }
    setErrHeadshot(null);
    setIsDeleted(false);

    const localUrl = await fileToDataUrl(file);
    setPreviewUrl(localUrl);

    uploadHeadshot(
      { file, slot: 'headshot', previousUrl: currentHeadshotUrl ?? undefined },
      {
        onSuccess: () => {
          setPreviewUrl(null);
          setBust((prev) => prev + 1);
        },
        onError: (err: any) => {
          const msg = getBackendErrorMessage(err, t);
          setErrHeadshot(msg);
        },
      }
    );
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    setErrHeadshot(null);
    setIsDeleted(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    goNext?.();
  };

  const handleBackClick = () => {
    if (onBackToModeSelector) onBackToModeSelector();
    else goBack?.();
  };

  if (profilePending || !profileId) return null;

  const valueUrl = uploadPending || !effectiveHeadshotUrl ? undefined : withBust(effectiveHeadshotUrl, bust);
  const tileBusy = uploadPending || profilePending;

  return (
    <section className="flex flex-col gap-3.5">
      <form onSubmit={handleSubmit}>
        <OnboardingStepShell
          modeLabel={t('onboarding.mode_selector.talent.title')}
          title={t('onboarding.talent.step_media.header')}
          subtitle={t('onboarding.talent.step_media.subtitle')}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          progress={progress}
          alignBody="center"
          footer={
            <>
              <WizardActions
                secondaryAction={
                  <Button variant="outline" type="button" onClick={handleBackClick}>
                    {t('buttons.back')}
                  </Button>
                }
                primaryAction={
                  <Button variant="primary" type="submit" disabled={!canContinue} loading={isBusy}>
                    {t('buttons.next')}
                  </Button>
                }
              />
            </>
          }
        >
          <div className="flex w-full flex-col">
            <div className="w-full max-w-[160px] self-center sm:my-8 sm:max-w-[200px] sm:items-center">
              <UploadTile
                value={valueUrl}
                previewUrl={previewUrl}
                onSelect={handleSelect}
                onDeleteClick={handleDelete}
                disabled={isBusy}
                busy={tileBusy}
                busyText={t('state.loading')}
                bustKey={undefined}
                accept="image/*"
                maxSizeMB={8}
                objectFit="cover"
                aspectRatio="3 / 4"
                multiple={false}
                openOnClick={!tileBusy}
                className="h-full w-full"
              />
            </div>

            {errHeadshot && (
              <Label variant="error" className="pl-1">
                {errHeadshot}
              </Label>
            )}
          </div>
        </OnboardingStepShell>
      </form>
      <ContinueLaterButton />
    </section>
  );
}

export default TalentMediaStep;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const withBust = (url: string | null | undefined, bust?: number): string | undefined => {
  if (!url) return undefined;
  if (!bust) return url;
  return url.includes('?') ? `${url}&b=${bust}` : `${url}?b=${bust}`;
};
