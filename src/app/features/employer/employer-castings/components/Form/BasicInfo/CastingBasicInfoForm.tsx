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

  const [errors, setErrors] = useState<Errors>({});
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setRange(toRangeFromData(data.shootingStartDate, data.shootingEndDate));
  }, [data.shootingStartDate, data.shootingEndDate]);

  const selectedCastingModalityStringCodeTranslation = useMemo(() => {
    if (!data.castingModalityId) return null;
    const option = castingModalityOptions.find((item) => item.value === data.castingModalityId);
    return option?.label ?? null;
  }, [data.castingModalityId, castingModalityOptions]);

  const isOnSite = selectedCastingModalityStringCodeTranslation === ON_SITE_CODE;
  const selectedApplicationDeadline = useMemo(
    () => parseLocalISODate(data.applicationDeadline),
    [data.applicationDeadline]
  );
  const applicationDeadlineError = getApplicationDeadlineError(data.applicationDeadline, t);

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
    <article className="flex flex-col">
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-4">
        {/* Title + Disponibilidad */}
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

        <span>
          <RangeCalendar
            selectionMode="range"
            label={t('employer_castings.dashboard.basic_info.shooting_dates')}
            className="lg:max-w-none"
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
            displayMode="dropdown"
            placeholder={t('general.placeholder.select')}
          />
        </span>

        {/* Tipo + Deadline */}
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

        <div className="flex flex-col gap-2">
          <RangeCalendar
            selectionMode="single"
            label={t('employer_castings.dashboard.basic_info.application_deadline')}
            className="lg:max-w-none"
            value={selectedApplicationDeadline}
            onChange={(next) => {
              updateField('applicationDeadline', next ? toLocalISO(next) : '');
              clearError('applicationDeadline');
            }}
            onCommit={(date) => {
              const iso = toLocalISO(date);
              updateField('applicationDeadline', iso);
              clearError('applicationDeadline');
            }}
            language={i18n.language}
            required
            displayMode="dropdown"
            placeholder={t('general.placeholder.select')}
          />

          <div className="min-h-[25px] overflow-visible">
            {resolveError('applicationDeadline', errors.applicationDeadline ?? applicationDeadlineError) ? (
              <Label variant="error" className="mt-0.4 pl-0.7 inline-block whitespace-nowrap">
                {resolveError('applicationDeadline', errors.applicationDeadline ?? applicationDeadlineError)}
              </Label>
            ) : null}
          </div>
        </div>

        {/* Modality */}
        <span>
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
        </span>

        <span>
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
        </span>
      </section>

      <TextareaField
        id="description"
        label={t('employer_castings.dashboard.basic_info.description')}
        placeholder={t('general.placeholder.about')}
        value={data.description}
        maxLength={3000}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const next = e.target.value;
          updateField('description', next);
          setSchemaError('description', schema.shape.description.safeParse(next));
          onClearBackendError?.('description');
        }}
        error={resolveError('description', errors.description)}
      />
    </article>
  );
};

const toRangeFromData = (start?: string | null, end?: string | null): DateRange | undefined => {
  const from = parseLocalISODate(start);
  const to = parseLocalISODate(end);
  if (!from && !to) return undefined;
  return { from: from ?? to, to: to ?? from };
};

export default CastingBasicInfoForm;
