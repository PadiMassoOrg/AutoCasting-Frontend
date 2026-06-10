import { Button, Label, UploadTile, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';

import { useProfileMediaDelete } from '../../../../integrations/supabase/media/hooks/useProfileMediaDelete';
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
  const currentFullbodyUrl = profile?.media?.fullBodyImageUrl ?? null;
  const { mutate: uploadMedia, isPending: uploadPending } = useProfileMediaPatch(profileId);
  const { mutateAsync: removeMedia } = useProfileMediaDelete();

  const [preview, setPreview] = useState<Partial<Record<'headshot' | 'fullbody', string>>>({});
  const [errHeadshot, setErrHeadshot] = useState<string | null>(null);
  const [bust, setBust] = useState<Partial<Record<'headshot' | 'fullbody', number>>>({});
  const [isDeleted, setIsDeleted] = useState(false);
  const [isFullbodyDeleted, setIsFullbodyDeleted] = useState(false);

  const effectiveHeadshotUrl = isDeleted ? null : currentHeadshotUrl;
  const effectiveFullbodyUrl = isFullbodyDeleted ? null : currentFullbodyUrl;

  const isBusy = uploadPending || profilePending || !profileId;

  const handleSelect = (slot: 'headshot' | 'fullbody') => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      setErrHeadshot(msg);
      return;
    }
    setErrHeadshot(null);
    if (slot === 'headshot') setIsDeleted(false);
    else setIsFullbodyDeleted(false);

    const localUrl = await fileToDataUrl(file);
    setPreview((prev) => ({ ...prev, [slot]: localUrl }));

    const previousUrl = slot === 'headshot' ? (currentHeadshotUrl ?? undefined) : (currentFullbodyUrl ?? undefined);

    uploadMedia(
      { file, slot, previousUrl },
      {
        onSuccess: () => {
          setPreview((prev) => ({ ...prev, [slot]: undefined }));
          setBust((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 }));
        },
        onError: (err: any) => {
          const msg = getBackendErrorMessage(err, t);
          setErrHeadshot(msg);
        },
      }
    );
  };

  const handleDelete = async (slot: 'headshot' | 'fullbody') => {
    setPreview((prev) => ({ ...prev, [slot]: undefined }));
    setErrHeadshot(null);
    if (slot === 'headshot') setIsDeleted(true);
    else setIsFullbodyDeleted(true);

    try {
      await removeMedia({
        slot,
        url: slot === 'headshot' ? currentHeadshotUrl : currentFullbodyUrl,
      });
    } catch (error) {
      if (slot === 'headshot') setIsDeleted(false);
      else setIsFullbodyDeleted(false);
      setErrHeadshot(getBackendErrorMessage(error, t));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goNext?.();
  };

  const handleBackClick = () => {
    if (onBackToModeSelector) onBackToModeSelector();
    else goBack?.();
  };

  if (profilePending || !profileId) return null;

  const headshotUrl =
    uploadPending || !effectiveHeadshotUrl ? undefined : withBust(effectiveHeadshotUrl, bust.headshot);
  const fullbodyUrl =
    uploadPending || !effectiveFullbodyUrl ? undefined : withBust(effectiveFullbodyUrl, bust.fullbody);
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
                  <Button variant="primary" type="submit" loading={isBusy}>
                    {t('buttons.next')}
                  </Button>
                }
              />
            </>
          }
        >
          <div className="grid w-full h-full grid-cols-2 gap-2 sm:items-center">
            {/* Foto 1 */}
            <div className="flex w-full flex-col gap-1">
              <Label className="text-base font-semibold">{t('profile.media.headshot_slot')}</Label>
              <div className="h-[200px] w-full sm:h-auto sm:aspect-[4/5]">
                <UploadTile
                  value={headshotUrl}
                  previewUrl={preview.headshot ?? null}
                  onSelect={handleSelect('headshot')}
                  onDeleteClick={() => void handleDelete('headshot')}
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
            </div>
            {/* Foto 2 */}
            <div className="flex w-full flex-col gap-1">
              <Label className="text-base font-semibold">{t('profile.media.fullbody_slot')}</Label>
              <div className="h-[200px] w-full sm:h-auto sm:aspect-[4/5]">
                <UploadTile
                  value={fullbodyUrl}
                  previewUrl={preview.fullbody ?? null}
                  onSelect={handleSelect('fullbody')}
                  onDeleteClick={() => void handleDelete('fullbody')}
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
            </div>
          </div>

          {errHeadshot && (
            <Label variant="error" className="pl-1">
              {errHeadshot}
            </Label>
          )}
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
