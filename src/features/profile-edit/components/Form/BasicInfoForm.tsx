import { Button, FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
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
import { getBasicInfoSchema } from '../../schemas/basicInfoSchema';
import type { ProfileBasicInfo } from '../../types/profile.types';

type Errors = {
  stageName?: string | null;
  genderId?: string | null;
  birth?: { year?: string | null; month?: string | null; day?: string | null } | null;
  professions?: string | null;
};

export default function BasicInfoForm({
  data,
  professionsMeta,
}: {
  data: ProfileBasicInfo;
  professionsMeta: SiteMetadataObject[];
}) {
  const { t, i18n } = useTranslation();
  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const autosave = useBasicInfoAutosave();
  const YEAR_END = new Date().getFullYear();
  const YEAR_START = YEAR_END - 80;
  const schema = useMemo(() => getBasicInfoSchema(t, YEAR_START, YEAR_END), [t, YEAR_START, YEAR_END]);

  const [errors, setErrors] = useState<Errors>({});

  const stageName = useCommittedText(
    data.stageName ?? '',
    (v) => {
      const r = schema.shape.stageName.safeParse(v);
      setErrors((e) => ({
        ...e,
        stageName: r.success ? null : r.error.errors[0]?.message || t('validation.stage_name_required'),
      }));
      if (r.success) autosave.immediate({ stageName: v });
    },
    { trim: true }
  );

  const gender = useCommittedUuid(
    data.gender?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.genderId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        genderId: r.success ? null : r.error.errors[0]?.message || t('validation.uuid_invalid'),
      }));
      if (r.success) autosave.immediate({ genderId: id ?? undefined });
    },
    { allowNull: true }
  );

  const birth = useIsoDateField(
    data.birthDate ?? '',
    (iso) => {
      setErrors((e) => ({ ...e, birth: null }));
      autosave.immediate({ birthDate: iso });
    },
    600
  );

  const validateBirth = (Y: string, M: string, D: string) => {
    const r = schema.shape.birth.safeParse({ year: Y, month: M, day: D });
    if (r.success) {
      setErrors((e) => ({ ...e, birth: null }));
    } else {
      const msg = r.error.errors[0]?.message || t('validation.date_invalid');
      setErrors((e) => ({ ...e, birth: { year: msg, month: msg, day: msg } }));
    }
  };

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

  const [profErrors, setProfErrors] = useState<string | null>(null);
  const professions = useToggleSet<string>(
    (data.professions ?? []).map((p) => p.id),
    (next) => {
      const r = schema.shape.professions.safeParse(next);
      setProfErrors(r.success ? null : r.error.errors[0]?.message || t('validation.profession_min'));
      if (r.success) autosave.immediate({ professionIds: next });
    }
  );

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
        error={errors.stageName ?? undefined}
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
        error={errors.genderId ?? undefined}
      />

      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.basic_info.birth_date')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="birth-day"
            placeholder={t('general.placeholder.day')}
            value={birth.day}
            onChange={(e) => {
              onSelect((v) => birth.onDay(v))(e);
              validateBirth(birth.year, birth.month, e.target.value);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
              validateBirth(birth.year, birth.month, birth.day);
            }}
            options={birth.dayOptions}
            error={errors.birth?.day ?? undefined}
          />
          <FormSelectField
            id="birth-month"
            placeholder={t('general.placeholder.month')}
            value={birth.month}
            onChange={(e) => {
              onSelect((v) => birth.onMonth(v))(e);
              validateBirth(birth.year, e.target.value, birth.day);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
              validateBirth(birth.year, birth.month, birth.day);
            }}
            options={monthOptions}
            error={errors.birth?.month ?? undefined}
          />
          <FormSelectField
            id="birth-year"
            placeholder={t('general.placeholder.year')}
            value={birth.year}
            onChange={(e) => {
              onSelect((v) => birth.onYear(v))(e);
              validateBirth(e.target.value, birth.month, birth.day);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
              validateBirth(birth.year, birth.month, birth.day);
            }}
            options={yearOptions}
            error={errors.birth?.year ?? undefined}
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
                className={['whitespace-nowrap cursor-pointer', active ? 'bg-black text-white' : 'bg-gray-100'].join(
                  ' '
                )}
                title={t(p.stringCode)}
              >
                {t(p.stringCode)}
              </Button>
            );
          })}
        </div>
        {profErrors && <span className="text-sm text-red-600">{profErrors}</span>}
      </div>
    </div>
  );
}
