import { Button, Label, UploadTile, WizardActions, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import OnboardingStepShell from '../OnboardingStepShell';
import { useEmployerLogoPatch } from '../../../../integrations/supabase/media/hooks/useEmployerLogoPatch';
import { getBackendErrorMessage } from '../../../../shared/utils/backendErrorHandling';
import { useEmployerProfile } from '../../../employer/employer-profile-edit/hooks/useEmployerProfile';
import { fileSchema } from '../../../talent/talent-profile-edit/schemas/mediaSchema';

type Props = WizardStepProps & {
  onBackToModeSelector?: () => void;
};

function EmployerMediaStep({
  goNext,
  goBack,
  stepIndex = 1,
  totalSteps = 3,
  progress = 0,
  onBackToModeSelector,
}: Props) {
  const { t } = useTranslation();
  const { data: profile, isPending: profilePending } = useEmployerProfile();
  const profileId = profile?.id!;
  const currentImageUrl = profile?.basicInfo?.imageUrl ?? null;
  const { mutate: uploadLogo, isPending: uploadPending } = useEmployerLogoPatch(profileId);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errImage, setErrImage] = useState<string | null>(null);
  const [bust, setBust] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);

  const effectiveImageUrl = isDeleted ? null : currentImageUrl;

  const canContinue = !!previewUrl || !!effectiveImageUrl;
  const isBusy = uploadPending || profilePending || !profileId;

  const handleSelect = async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      setErrImage(msg);
      return;
    }
    setErrImage(null);
    setIsDeleted(false);

    const localUrl = await fileToDataUrl(file);
    setPreviewUrl(localUrl);

    uploadLogo(
      { file, previousUrl: currentImageUrl ?? undefined },
      {
        onSuccess: () => {
          setPreviewUrl(null);
          setBust((prev) => prev + 1);
        },
        onError: (err: any) => {
          const msg = getBackendErrorMessage(err, t);
          setErrImage(msg);
        },
      }
    );
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    setErrImage(null);
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

  const valueUrl = uploadPending || !effectiveImageUrl ? undefined : withBust(effectiveImageUrl, bust);
  const tileBusy = uploadPending || profilePending;

  return (
    <form onSubmit={handleSubmit}>
      <OnboardingStepShell
        modeLabel={t('onboarding.mode_selector.employer.title')}
        title={t('onboarding.employer.step_media.header')}
        subtitle={t('onboarding.employer.step_media.subtitle')}
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
            <ContinueLaterButton />
          </>
        }
      >
        <div className="flex w-full flex-col">
          <div className="my-4 w-full max-w-[165px] self-center lg:my-8 lg:max-w-[195px] lg:items-center">
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

          {errImage && (
            <Label variant="error" className="pl-1">
              {errImage}
            </Label>
          )}
        </div>
      </OnboardingStepShell>
    </form>
  );
}

export default EmployerMediaStep;

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
