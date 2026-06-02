import { ChoiceChip, FormInputField, FormSelectField, Label, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  onSelect,
  useCommittedText,
  useCommittedUuid,
  useIsoDateField,
  useToggleSet,
} from '../../../../../shared/utils/formUtils';
import { capitalize } from '../../../../../shared/utils/formatUtils';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { getTalentVisibleGenderOptions } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useBasicInfoAutosave } from '../../hooks/autosaves';
import { getBasicInfoSchema } from '../../schemas/basicInfoSchema';
import type { TalentProfileBasicInfo } from '../../types/talentProfile.types';

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
  data: TalentProfileBasicInfo;
  professionsMeta: SiteMetadataObject[];
}) {
  const { t, i18n } = useTranslation();
  const getBirthDateError = (iso: string) => {
    if (!iso) return null;

    const today = new Date();
    const todayIso = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    return iso > todayIso ? t('validation.birth_date_future') : null;
  };

  const genderOptionsRaw = useCachedSiteMetadataSlice('genderOptions');
  const genderOptions = useMemo(
    () =>
      getTalentVisibleGenderOptions(genderOptionsRaw).map((option) => ({
        value: option.id,
        label: t(option.stringCode),
      })),
    [genderOptionsRaw, t]
  );
  const autosave = useBasicInfoAutosave();
  const schema = useMemo(() => getBasicInfoSchema(t), [t]);
  const backendFieldErrors = autosave.fieldErrors as Record<string, string | undefined>;
  const YEAR_END = new Date().getFullYear();
  const YEAR_START = YEAR_END - 80;

  const [profErrors, setProfErrors] = useState<string | null>(null);
  const [birthError, setBirthError] = useState<string | null>(() => getBirthDateError(data.birthDate ?? ''));
  const [errors, setErrors] = useState<Errors>({});
  const [lastSentBirthDate, setLastSentBirthDate] = useState(data.birthDate ?? '');

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
      const nextBirthError = getBirthDateError(iso);
      setBirthError(nextBirthError);
      if (nextBirthError) return;
      if (iso === lastSentBirthDate) return;
      setLastSentBirthDate(iso);
      setErrors((e) => ({ ...e, birth: null }));
      autosave.immediate({ birthDate: iso });
    },
    600
  );

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

  const professions = useToggleSet<string>(
    (data.professions ?? []).map((p) => p.id),
    (next) => {
      const r = schema.shape.professions.safeParse(next);
      setProfErrors(r.success ? null : r.error.errors[0]?.message || t('validation.profession_min'));
      if (r.success) autosave.immediate({ professionIds: next });
    }
  );
  const birthDayError = errors.birth?.day ?? birthError ?? undefined;
  const resolveError = (field: string, local?: string | null) => local ?? backendFieldErrors[field] ?? undefined;

  return (
    <>
      <section className="flex flex-col lg:flex-row lg:gap-4">
        <FormInputField
          id="stageName"
          label={t('profile.basic_info.artistic_name')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.stage_name')}
          value={stageName.value}
          onChange={stageName.onChange}
          onBlur={stageName.onBlur}
          onKeyDown={stageName.onKeyDown}
          error={resolveError('stageName', errors.stageName)}
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
          error={resolveError('genderId', errors.genderId)}
        />
      </section>
      <div className="flex flex-col gap-2 lg:flex-1">
        <Label className="text-sm font-semibold">{t('profile.basic_info.birth_date')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="birth-day"
            placeholder={t('general.placeholder.day')}
            value={birth.day}
            onChange={(e) => {
              setBirthError(null);
              onSelect((v) => birth.onDay(v))(e);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
            }}
            options={birth.dayOptions}
            error={resolveError('birthDate', birthDayError)}
          />
          <FormSelectField
            id="birth-month"
            placeholder={t('general.placeholder.month')}
            value={birth.month}
            onChange={(e) => {
              setBirthError(null);
              onSelect((v) => birth.onMonth(v))(e);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
            }}
            options={monthOptions}
            error={resolveError('birthDate', errors.birth?.month)}
          />
          <FormSelectField
            id="birth-year"
            placeholder={t('general.placeholder.year')}
            value={birth.year}
            onChange={(e) => {
              setBirthError(null);
              onSelect((v) => birth.onYear(v))(e);
            }}
            onBlur={(e) => {
              birth.onAnyBlur(e);
            }}
            options={yearOptions}
            error={resolveError('birthDate', errors.birth?.year)}
          />
        </div>
      </div>

      <Separator className="opacity-20 mt-2 mb-6" />

      {/* Profesión */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold">{t('profile.basic_info.profession')}</Label>
        <div className="flex flex-wrap gap-2">
          {professionsMeta.map((p) => {
            const active = professions.values.includes(p.id);
            return (
              <ChoiceChip
                key={p.id}
                label={t(p.stringCode)}
                selected={active}
                onClick={() => professions.toggle(p.id)}
                title={t(p.stringCode)}
              />
            );
          })}
        </div>
        {(profErrors || resolveError('professions')) && (
          <span className="text-sm text-red-600">{profErrors ?? resolveError('professions')}</span>
        )}
      </div>
    </>
  );
}
