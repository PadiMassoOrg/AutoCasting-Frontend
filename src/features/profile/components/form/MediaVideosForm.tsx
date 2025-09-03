import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useCommittedText } from '../../../../shared/utils/formUtils';
import { useMediaAutosave } from '../../hooks/autosaves';
import type { Media } from '../../types/profile.types';

const MediaVideosForm = ({ data }: { data: Media }) => {
  const { t } = useTranslation();
  const mediaAutosave = useMediaAutosave();

  const introduction = useCommittedText(
    data.introductionVideoUrl ?? '',
    (v) => mediaAutosave.immediate({ introductionVideoUrl: v }),
    {
      trim: true,
    }
  );

  const videoreel = useCommittedText(
    data.showReelVideoUrl ?? '',
    (v) => mediaAutosave.immediate({ showReelVideoUrl: v }),
    {
      trim: true,
    }
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
      />
    </div>
  );
};

export default MediaVideosForm;
