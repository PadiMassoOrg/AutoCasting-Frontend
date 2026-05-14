import {
  BooleanRadioGroup,
  FormInputField,
  FormSelectField,
  Label,
  parseLocalISODate,
  RangeCalendar,
  TextareaField,
  toLocalISO,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { capitalize } from '../../../../../../shared/utils/formatUtils';
import { buildISODate, getDayOptions, onSelect, parseISODateParts } from '../../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { getCastingBasicInfoSchema } from '../../../schemas/castingBasicInfoSchema';
import type { CastingBasicInfoFieldKey, CastingBasicInfoFormData } from '../../../types/employerCastings.types';

type Errors = Partial<Record<CastingBasicInfoFieldKey, string | null>>;

const getApplicationDeadlineError = (iso: string, t: ReturnType<typeof useTranslation>['t']) => {
  if (!iso) return null;

  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  return iso < todayIso ? t('validation.application_deadline_past') : null;
};

const toDateParts = (iso: string) => {
  const parts = parseISODateParts(iso);

  return {
    ...parts,
    dayOptions: getDayOptions(parts.month, parts.year),
  };
};

const CastingBasicInfoForm = ({
  data,
  backendErrors,
  onChange,
  onClearBackendError,
}: {
  data: CastingBasicInfoFormData;
  backendErrors?: Partial<Record<CastingBasicInfoFieldKey, string>>;
  onChange: (patch: Partial<CastingBasicInfoFormData>) => void;
  onClearBackendError?: (field: CastingBasicInfoFieldKey) => void;
}) => {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => getCastingBasicInfoSchema(t), [t]);
  const projectTypeOptions = useCachedSiteMetadataOption('projectTypeOptions', t);
  const castingModalityOptions = useCachedSiteMetadataOption('castingModalityOptions', t);
  const ON_SITE_CODE = t('sitemetadata.casting_modality.on_site');
  const YEAR_START = new Date().getFullYear();
  const YEAR_END = YEAR_START + 2;

  const [errors, setErrors] = useState<Errors>({});
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setRange(toRangeFromData(data.shootingStartDate, data.shootingEndDate));
  }, [data.shootingStartDate, data.shootingEndDate]);

  const selectedCastingModalityStringCodeTranslation = useMemo(() => {
    if (!data.castingModalityId) return null;
    const opt = castingModalityOptions.find((option) => option.value === data.castingModalityId);
    return opt?.label ?? null;
  }, [data.castingModalityId, castingModalityOptions]);

  const isOnSite = selectedCastingModalityStringCodeTranslation === ON_SITE_CODE;

  const applicationDeadline = useMemo(() => toDateParts(data.applicationDeadline), [data.applicationDeadline]);

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

  const applicationDeadlineError = getApplicationDeadlineError(data.applicationDeadline, t);
  const shouldShowApplicationDeadlineHint =
    !data.applicationDeadline && !!(applicationDeadline.day || applicationDeadline.month || applicationDeadline.year);

  const setLocalError = (field: CastingBasicInfoFieldKey, message: string | null) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const setSchemaError = (
    field: CastingBasicInfoFieldKey,
    result: { success: boolean; error?: { errors: Array<{ message?: string }> } }
  ) => {
    setLocalError(field, result.success ? null : (result.error?.errors[0]?.message ?? null));
  };

  const clearError = (field: CastingBasicInfoFieldKey) => {
    setLocalError(field, null);
    onClearBackendError?.(field);
  };

  const resolveError = (field: CastingBasicInfoFieldKey, local?: string | null) => local ?? backendErrors?.[field];

  const updateField = <K extends keyof CastingBasicInfoFormData>(field: K, value: CastingBasicInfoFormData[K]) => {
    onChange({ [field]: value } as Partial<CastingBasicInfoFormData>);
  };

  return (
    <div className="w-full flex flex-col">
      <FormInputField
        id="title"
        label={t('employer_castings.dashboard.basic_info.title')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.project_name')}
        value={data.title}
        onChange={(e) => {
          const next = e.target.value;
          updateField('title', next);
          setSchemaError('title', schema.shape.title.safeParse(next));
          onClearBackendError?.('title');
        }}
        error={resolveError('title', errors.title)}
        required
      />

      <FormSelectField
        id="projectTypeId"
        label={t('employer_castings.dashboard.basic_info.project_type')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={data.projectTypeId ?? ''}
        onChange={(e) => {
          const nextValue = e.target.value || null;
          updateField('projectTypeId', nextValue);
          setSchemaError('projectTypeId', schema.shape.projectTypeId.safeParse(nextValue ?? ''));
          onClearBackendError?.('projectTypeId');
        }}
        options={projectTypeOptions}
        error={resolveError('projectTypeId', errors.projectTypeId)}
        required
      />

      <FormSelectField
        id="castingModalityId"
        label={t('employer_castings.dashboard.basic_info.casting_modality')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={data.castingModalityId ?? ''}
        onChange={(e) => {
          const nextValue = e.target.value || null;
          const nextLabel = castingModalityOptions.find((option) => option.value === nextValue)?.label ?? null;

          setSchemaError('castingModalityId', schema.shape.castingModalityId.safeParse(nextValue ?? ''));
          onClearBackendError?.('castingModalityId');

          if (nextLabel && nextLabel !== ON_SITE_CODE) {
            onChange({
              castingModalityId: nextValue,
              locationText: '',
            });
            clearError('locationText');
            return;
          }

          updateField('castingModalityId', nextValue);
        }}
        options={castingModalityOptions}
        error={resolveError('castingModalityId', errors.castingModalityId)}
        required
      />

      {isOnSite && (
        <FormInputField
          id="locationText"
          label={t('employer_castings.dashboard.basic_info.casting_modality_on_site')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.casting_modality')}
          value={data.locationText}
          onChange={(e) => {
            const next = e.target.value;
            updateField('locationText', next);
            setSchemaError('locationText', schema.shape.locationText.safeParse(next));
            onClearBackendError?.('locationText');
          }}
          error={resolveError('locationText', errors.locationText)}
          required
        />
      )}

      <BooleanRadioGroup
        label={t('employer_castings.dashboard.basic_info.has_wardrobe_fitting')}
        value={data.hasWardrobeFitting}
        onChange={(next) => {
          if (next === false) {
            onChange({
              hasWardrobeFitting: false,
              wardrobeFittingText: '',
            });
            clearError('wardrobeFittingText');
            return;
          }

          updateField('hasWardrobeFitting', next ?? null);
        }}
        yesLabel={t('general.yes')}
        noLabel={t('general.no')}
        includeAnyOption={false}
        name="hasWardrobeFitting"
        required
      />

      {data.hasWardrobeFitting === true && (
        <FormInputField
          id="wardrobeFittingText"
          label={t('employer_castings.dashboard.basic_info.wardrobe_fitting_details')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.wardrobe_fitting')}
          value={data.wardrobeFittingText}
          onChange={(e) => {
            const next = e.target.value;
            updateField('wardrobeFittingText', next);
            setSchemaError('wardrobeFittingText', schema.shape.wardrobeFittingText.safeParse(next));
            onClearBackendError?.('wardrobeFittingText');
          }}
          error={resolveError('wardrobeFittingText', errors.wardrobeFittingText)}
          required
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex">
          <Label className="text-sm font-semibold">
            {t('employer_castings.dashboard.basic_info.application_deadline')}
          </Label>
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="applicationDeadline-day"
            placeholder={t('general.placeholder.day')}
            value={applicationDeadline.day}
            onChange={onSelect((day) => {
              const nextIso = buildISODate(applicationDeadline.year, applicationDeadline.month, day);
              updateField('applicationDeadline', nextIso);
              clearError('applicationDeadline');
            })}
            options={applicationDeadline.dayOptions}
            error={resolveError(
              'applicationDeadline',
              errors.applicationDeadline ??
                applicationDeadlineError ??
                (shouldShowApplicationDeadlineHint
                  ? t('employer_castings.dashboard.basic_info.application_deadline_incomplete')
                  : null)
            )}
          />
          <FormSelectField
            id="applicationDeadline-month"
            placeholder={t('general.placeholder.month')}
            value={applicationDeadline.month}
            onChange={onSelect((month) => {
              const nextIso = buildISODate(applicationDeadline.year, month, applicationDeadline.day);
              updateField('applicationDeadline', nextIso);
              clearError('applicationDeadline');
            })}
            options={monthOptions}
            error={resolveError('applicationDeadline', errors.applicationDeadline)}
          />
          <FormSelectField
            id="applicationDeadline-year"
            placeholder={t('general.placeholder.year')}
            value={applicationDeadline.year}
            onChange={onSelect((year) => {
              const nextIso = buildISODate(year, applicationDeadline.month, applicationDeadline.day);
              updateField('applicationDeadline', nextIso);
              clearError('applicationDeadline');
            })}
            options={yearOptions}
            error={resolveError('applicationDeadline', errors.applicationDeadline)}
          />
        </div>
      </div>

      <RangeCalendar
        label={t('employer_castings.dashboard.basic_info.shooting_dates')}
        value={range}
        onChange={setRange}
        onCommit={(from, to) => {
          onChange({
            shootingStartDate: toLocalISO(from),
            shootingEndDate: toLocalISO(to),
          });
        }}
        language={i18n.language}
        required
      />

      <div className="min-h-[25px]"></div>

      <TextareaField
        id="description"
        label={t('employer_castings.dashboard.basic_info.description')}
        placeholder={t('general.placeholder.about')}
        value={data.description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const next = e.target.value;
          updateField('description', next);
          setSchemaError('description', schema.shape.description.safeParse(next));
          onClearBackendError?.('description');
        }}
        error={resolveError('description', errors.description)}
      />
    </div>
  );
};

const toRangeFromData = (start?: string | null, end?: string | null): DateRange | undefined => {
  const from = parseLocalISODate(start);
  const to = parseLocalISODate(end);
  if (!from && !to) return undefined;
  return { from: from ?? to, to: to ?? from };
};

export default CastingBasicInfoForm;
