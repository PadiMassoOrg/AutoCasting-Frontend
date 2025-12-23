import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommittedText } from '../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCastingBasicInfoAutosave } from '../hooks/autosaves';
import { getCastingBasicInfoSchema } from '../schemas/castingBasicInfoSchema';
import type { CastingBasicInfo } from '../types/employerCastings.types';

type Errors = {
  title?: string | null;
};

const CastingBasicInfoForm = ({ data }: { data?: CastingBasicInfo }) => {
  const { t } = useTranslation();
  const projectTypeOptions = useCachedSiteMetadataOption('projectTypeOptions', t);
  const castingModalityOptions = useCachedSiteMetadataOption('castingModalityOptions', t);
  const autosave = useCastingBasicInfoAutosave();

  const schema = useMemo(() => getCastingBasicInfoSchema(t), [t]);

  const [errors, setErrors] = useState<Errors>({});

  console.log(data);

  const title = useCommittedText(
    data?.title ?? '',
    (v) => {
      const r = schema.shape.title.safeParse(v);
      setErrors((e) => ({
        ...e,
        stageName: r.success ? null : r.error.errors[0]?.message,
      }));
      if (r.success) autosave.immediate({ title: v });
    },
    { trim: true }
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <FormInputField
        id="stageName"
        label={t('employer_castings.dashboard.basic_info.title')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.project_name')}
        value={title.value}
        onChange={title.onChange}
        onBlur={title.onBlur}
        onKeyDown={title.onKeyDown}
        error={errors.title ?? undefined}
      />
    </div>
  );
};

export default CastingBasicInfoForm;
