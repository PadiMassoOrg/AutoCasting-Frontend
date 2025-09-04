import { Button, FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  onSelect,
  useCommittedText,
  useCommittedUuid,
  useIsoDateField,
  useToggleSet,
} from '../../../../shared/utils/formUtils';
import { capitalize } from '../../../../shared/utils/textUtils';
import { useCachedSiteMetadataOption } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import { useBasicInfoAutosave } from '../../hooks/autosaves';
import type { ProfileBasicInfo } from '../../types/profile.types';

export default function BasicInfoForm({
  data,
  professionsMeta,
}: {
  data: ProfileBasicInfo;
  professionsMeta: SiteMetadataObject[];
}) {
  const { t, i18n } = useTranslation();
  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const basicInfoAutosave = useBasicInfoAutosave();

  const stageName = useCommittedText(data.stageName ?? '', (v) => basicInfoAutosave.immediate({ stageName: v }), {
    trim: true,
  });

  // Género
  const gender = useCommittedUuid(
    data.gender?.id ?? null,
    (id) => basicInfoAutosave.immediate({ genderId: id ?? undefined }),
    { allowNull: true }
  );

  // Fecha (usa el hook)
  const birth = useIsoDateField(data.birthDate ?? '', (iso) => basicInfoAutosave.immediate({ birthDate: iso }), 600);

  // Profesiones
  const professions = useToggleSet<string>(
    (data.professions ?? []).map((p) => p.id),
    (next) => basicInfoAutosave.immediate({ professionIds: next })
  );

  // Opciones año/mes/día
  const YEAR_END = new Date().getFullYear();
  const YEAR_START = YEAR_END - 80;

  const yearOptions = useMemo(
    () =>
      Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => {
        const y = String(YEAR_END - i);
        return { value: y, label: y };
      }),
    []
  );

  const monthOptions = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(i18n.language, { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: capitalize(fmt.format(new Date(2000, i, 1))),
    }));
  }, [i18n.language]);

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.basic_info')}</h3>
      <FormInputField
        id="stageName"
        label={t('profile.basic_info.artistic_name')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.stage_name')}
        value={stageName.value}
        onChange={stageName.onChange}
        onBlur={stageName.onBlur}
        onKeyDown={stageName.onKeyDown}
      />
      <FormSelectField
        id="genderId"
        label={t('profile.basic_info.gender')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={gender.value}
        onChange={gender.onChange}
        onBlur={gender.onBlur}
        options={genderOptions}
      />
      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.basic_info.birth_date')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="birth-day"
            placeholder={t('general.placeholder.day')}
            value={birth.day}
            onChange={onSelect(birth.onDay)}
            onBlur={birth.onAnyBlur}
            options={birth.dayOptions}
          />
          <FormSelectField
            id="birth-month"
            placeholder={t('general.placeholder.month')}
            value={birth.month}
            onChange={onSelect(birth.onMonth)}
            onBlur={birth.onAnyBlur}
            options={monthOptions}
          />
          <FormSelectField
            id="birth-year"
            placeholder={t('general.placeholder.year')}
            value={birth.year}
            onChange={onSelect(birth.onYear)}
            onBlur={birth.onAnyBlur}
            options={yearOptions}
          />
        </div>
      </div>

      {/* Profesión */}
      <div className="flex flex-col gap-2">
        <Label className="text-base font-bold">{t('profile.basic_info.profession')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 place-items-start">
          {professionsMeta.map((p) => {
            const active = professions.values.includes(p.id);
            return (
              <Button
                key={p.id}
                onClick={() => professions.toggle(p.id)}
                className={['whitespace-nowrap', active ? 'bg-black text-white' : 'bg-gray-100'].join(' ')}
                title={t(p.stringCode)}
              >
                {t(p.stringCode)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
