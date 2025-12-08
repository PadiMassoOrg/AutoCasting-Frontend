import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ContinueLaterButton } from '..';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';

import { useProfileMediaPatch } from '../../../../integrations/supabase/media/hooks/useProfileMediaPatch';
import UploadTile from '../../../../shared/components/UploadTile/UploadTile';
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

  const canContinue = !uploadPending && (!!previewUrl || !!effectiveHeadshotUrl);
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
          const msg = err?.response?.data?.message || err?.message || t('state.server_err');
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
    <section className="w-full relative max-w-[400px]">
      <WizardStep>
        <form onSubmit={handleSubmit} className="flex lg:min-h-[70vh] flex-col justify-between gap-2">
          <div>
            <div className="w-full flex flex-col items-center gap-4 mb-4">
              <button className="w-full py-3 rounded-lg bg-[var(--color-primary-white)] text-[14px] font-semibold uppercase text-[var(--color-primary-purple)]">
                {t('onboarding.mode_selector.talent.title')}
              </button>
            </div>

            <div className="flex flex-col gap-1 mb-2">
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

            <div className="w-full flex flex-col">
              <div className="text-center">
                <h1 className="text-2xl font-semibold my-1">{t('onboarding.talent.step2.header')}</h1>
                <p className="text-sm">{t('onboarding.talent.step2.subtitle')}</p>
              </div>

              <div className="max-w-[165px] w-full self-center my-10 lg:max-w-[300px] lg:items-center">
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
                  className="w-full h-full"
                />
              </div>

              {errHeadshot && (
                <Label variant="error" className="pl-1">
                  {errHeadshot}
                </Label>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center gap-4 mb-6">
              <Button variant="outline" type="button" onClick={handleBackClick}>
                {t('buttons.back')}
              </Button>
              <Button variant="primary" type="submit" disabled={!canContinue || isBusy}>
                {isBusy ? t('state.loading') : t('buttons.next')}
              </Button>
            </div>
            <ContinueLaterButton />
          </div>
        </form>
      </WizardStep>
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
