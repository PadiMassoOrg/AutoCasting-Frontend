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
  const backendFieldErrors = autosave.fieldErrors as Record<string, string | undefined>;

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

  const resolveError = (field: string, local?: string | null) => local ?? backendFieldErrors[field] ?? undefined;

  return (
    <div className="w-full flex flex-col">
      <FormInputField
        id="introduction"
        labelClassName="font-semibold text-base"
        label={t('profile.media.introduction')}
        placeholder={t('general.placeholder.url')}
        value={introduction.value}
        onChange={introduction.onChange}
        onBlur={introduction.onBlur}
        onKeyDown={introduction.onKeyDown}
        error={resolveError('introductionVideoUrl', errors.intro)}
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
        error={resolveError('showReelVideoUrl', errors.reel)}
      />
    </div>
  );
};

export default MediaVideosForm;
