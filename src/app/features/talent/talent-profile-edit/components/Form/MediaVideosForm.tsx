import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommittedText } from '../../../../../shared/utils/formUtils';
import { useMediaAutosave } from '../../hooks/autosaves';
import { getMediaVideosSchema } from '../../schemas/mediaSchema';
import type { Media } from '../../types/talentProfile.types';

const MediaVideosForm = ({ data }: { data: Media }) => {
  const { t } = useTranslation();
  const autosave = useMediaAutosave();

  const schema = useMemo(() => getMediaVideosSchema(t), [t]);

  type Errs = { intro?: string | null; reel?: string | null };
  const [errors, setErrors] = useState<Errs>({});

  const introduction = useCommittedText(
    data.introductionVideoUrl ?? '',
    (v) => {
      const r = schema.shape.introductionVideoUrl.safeParse(v);
      setErrors((e) => ({
        ...e,
        intro: r.success ? null : (r.error.errors[0]?.message ?? t('validation.url_invalid')),
      }));
      if (r.success) autosave.immediate({ introductionVideoUrl: v.trim() || null });
    },
    { trim: true }
  );

  const videoreel = useCommittedText(
    data.showReelVideoUrl ?? '',
    (v) => {
      const r = schema.shape.showReelVideoUrl.safeParse(v);
      setErrors((e) => ({
        ...e,
        reel: r.success ? null : (r.error.errors[0]?.message ?? t('validation.url_invalid')),
      }));
      if (r.success) autosave.immediate({ showReelVideoUrl: v.trim() || null });
    },
    { trim: true }
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.media.videos')}</h3>

      <FormInputField
        id="introduction"
        label={t('profile.media.introduction')}
        placeholder={t('general.placeholder.url')}
        value={introduction.value}
        onChange={introduction.onChange}
        onBlur={introduction.onBlur}
        onKeyDown={introduction.onKeyDown}
        error={errors.intro ?? undefined}
      />

      <FormInputField
        id="videoreel"
        label={t('profile.media.videoreel')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={videoreel.value}
        onChange={videoreel.onChange}
        onBlur={videoreel.onBlur}
        onKeyDown={videoreel.onKeyDown}
        error={errors.reel ?? undefined}
      />
    </div>
  );
};

export default MediaVideosForm;
