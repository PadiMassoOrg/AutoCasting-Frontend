import { FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BooleanYesNoRadioGroup, RangeCalendar, TextareaField } from '../../../../shared/components/Form';
import { useCommittedNullableBooleanValue } from '../../../../shared/components/Form/hooks/useCommittedBooleanValue';
import { parseLocalISODate, toLocalISO } from '../../../../shared/components/Form/RangeCalendar';
import { capitalize } from '../../../../shared/utils/formatUtils';
import { onSelect, useCommittedText, useCommittedUuid, useIsoDateField } from '../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCastingBasicInfoAutosave } from '../hooks/autosaves';
import { getCastingBasicInfoSchema } from '../schemas/castingBasicInfoSchema';
import type { CastingBasicInfo } from '../types/employerCastings.types';

type Errors = {
  title?: string | null;
  projectTypeId?: string | null;
  castingModalityId?: string | null;
  applicationDeadline?: { year?: string | null; month?: string | null; day?: string | null } | null;
  wardrobeFittingText?: string | null;
  castingModalityText?: string | null;
  description?: string | null;
};

const CastingBasicInfoForm = ({ data }: { data: CastingBasicInfo }) => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const projectTypeOptions = useCachedSiteMetadataOption('projectTypeOptions', t);
  const castingModalityOptions = useCachedSiteMetadataOption('castingModalityOptions', t);
  const autosave = useCastingBasicInfoAutosave(slug!);
  const schema = useMemo(() => getCastingBasicInfoSchema(t), [t]);

  const ON_SITE_CODE = t('sitemetadata.casting_modality.on_site');
  const YEAR_START = new Date().getFullYear();
  const YEAR_END = YEAR_START + 2;

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [errors, setErrors] = useState<Errors>({});

  const savedRange = useMemo(
    () => toRangeFromData(data.shootingStartDate, data.shootingEndDate),
    [data.shootingStartDate, data.shootingEndDate]
  );

  useEffect(() => {
    setRange((prev) => {
      if (!prev?.from && !prev?.to) return savedRange;
      return prev;
    });
  }, [data.id, savedRange?.from?.getTime(), savedRange?.to?.getTime()]);

  const title = useCommittedText(
    data.title ?? '',
    (v) => {
      const r = schema.shape.title.safeParse(v);
      setErrors((e) => ({ ...e, title: r.success ? null : r.error.errors[0]?.message }));
      if (r.success) autosave.immediate({ id: data.id, title: v });
    },
    { trim: true }
  );

  const projectType = useCommittedUuid(data.projectType?.id ?? null, (id) => {
    const raw = id ?? '';
    const r = schema.shape.projectTypeId.safeParse(raw);
    setErrors((e) => ({
      ...e,
      projectTypeId: r.success ? null : r.error.errors[0]?.message || t('validation.uuid_invalid'),
    }));
    if (r.success) autosave.immediate({ id: data.id, projectTypeId: id ?? undefined });
  });

  const castingModality = useCommittedUuid(data.castingModality?.id ?? null, (id) => {
    const raw = id ?? '';
    const r = schema.shape.castingModalityId.safeParse(raw);

    setErrors((e) => ({
      ...e,
      castingModalityId: r.success ? null : r.error.errors[0]?.message || t('validation.uuid_invalid'),
    }));

    if (!r.success) return;

    const nextCode = castingModalityOptions.find((o) => o.value === id)?.label ?? null;

    if (nextCode && nextCode !== ON_SITE_CODE) {
      autosave.immediate({
        id: data.id,
        castingModalityId: id ?? undefined,
        castingModalityText: null,
      });
      setErrors((e) => ({ ...e, castingModalityText: null }));
      return;
    }

    autosave.immediate({ id: data.id, castingModalityId: id ?? undefined });
  });

  const selectedCastingModalityStringCodeTranslation = useMemo(() => {
    if (!castingModality.value) return null;
    const opt = castingModalityOptions.find((o) => o.value === castingModality.value);
    return opt?.label ?? null;
  }, [castingModality.value, castingModalityOptions]);

  const isOnSite = selectedCastingModalityStringCodeTranslation === ON_SITE_CODE;

  const castingModalityText = useCommittedText(data.castingModalityText ?? '', (v) => {
    setErrors((e) => ({ ...e, castingModalityText: null }));
    autosave.immediate({ id: data.id, castingModalityText: v || null });
  });

  const applicationDeadline = useIsoDateField(
    data.applicationDeadline ?? '',
    (iso) => {
      setErrors((e) => ({ ...e, birth: null }));
      autosave.immediate({ id: data.id, applicationDeadline: iso });
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

  const hasWardrobeFitting = useCommittedNullableBooleanValue(data.hasWardrobeFitting, (v) => {
    if (v === false) {
      autosave.immediate({
        id: data.id,
        hasWardrobeFitting: false,
        wardrobeFittingText: null,
      });
      setErrors((e) => ({ ...e, wardrobeFittingText: null }));
      return;
    }

    autosave.immediate({
      id: data.id,
      hasWardrobeFitting: v ?? undefined,
    });
  });

  const wardrobeFittingText = useCommittedText(data.wardrobeFittingText ?? '', (v) => {
    setErrors((e) => ({ ...e, wardrobeFittingText: null }));
    autosave.immediate({ id: data.id, wardrobeFittingText: v || null });
  });

  const description = useCommittedText(data.description ?? '', (v) => {
    setErrors((e) => ({ ...e, description: null }));
    autosave.immediate({ id: data.id, description: v || null });
  });

  const handleRangeCommit = useCallback(
    (from: Date, to: Date) => {
      autosave.immediate({
        id: data.id,
        shootingStartDate: toLocalISO(from),
        shootingEndDate: toLocalISO(to),
      });
    },
    [autosave, data.id]
  );

  const handleRangeClear = useCallback(() => {
    setRange(undefined);

    autosave.immediate({
      id: data.id,
      shootingStartDate: null,
      shootingEndDate: null,
    });
  }, [autosave, data.id]);

  return (
    <div className="w-full flex flex-col">
      <FormInputField
        id="title"
        label={t('employer_castings.dashboard.basic_info.title')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.project_name')}
        value={title.value}
        onChange={title.onChange}
        onBlur={title.onBlur}
        onKeyDown={title.onKeyDown}
        error={errors.title ?? undefined}
      />

      <FormSelectField
        id="projectTypeId"
        label={t('employer_castings.dashboard.basic_info.project_type')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={projectType.value}
        onChange={projectType.onChange}
        onBlur={projectType.onBlur}
        options={projectTypeOptions}
        error={errors.projectTypeId ?? undefined}
      />

      <FormSelectField
        id="castingModalityId"
        label={t('employer_castings.dashboard.basic_info.casting_modality')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={castingModality.value}
        onChange={castingModality.onChange}
        onBlur={castingModality.onBlur}
        options={castingModalityOptions}
        error={errors.castingModalityId ?? undefined}
      />
      {isOnSite && (
        <FormInputField
          id="castingModalityText"
          label={t('employer_castings.dashboard.basic_info.casting_modality_on_site')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.casting_modality')}
          value={castingModalityText.value}
          onChange={castingModalityText.onChange}
          onBlur={castingModalityText.onBlur}
          onKeyDown={castingModalityText.onKeyDown}
          error={errors.castingModalityText ?? undefined}
        />
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold">
          {t('employer_castings.dashboard.basic_info.application_deadline')}
        </Label>

        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="applicationDeadline-day"
            placeholder={t('general.placeholder.day')}
            value={applicationDeadline.day}
            onChange={(e) => onSelect((v) => applicationDeadline.onDay(v))(e)}
            onBlur={(e) => applicationDeadline.onAnyBlur(e)}
            options={applicationDeadline.dayOptions}
            error={errors.applicationDeadline?.day ?? undefined}
          />
          <FormSelectField
            id="applicationDeadline-month"
            placeholder={t('general.placeholder.month')}
            value={applicationDeadline.month}
            onChange={(e) => onSelect((v) => applicationDeadline.onMonth(v))(e)}
            onBlur={(e) => applicationDeadline.onAnyBlur(e)}
            options={monthOptions}
            error={errors.applicationDeadline?.month ?? undefined}
          />
          <FormSelectField
            id="applicationDeadline-year"
            placeholder={t('general.placeholder.year')}
            value={applicationDeadline.year}
            onChange={(e) => onSelect((v) => applicationDeadline.onYear(v))(e)}
            onBlur={(e) => applicationDeadline.onAnyBlur(e)}
            options={yearOptions}
            error={errors.applicationDeadline?.year ?? undefined}
          />
        </div>
      </div>

      <BooleanYesNoRadioGroup
        label={t('employer_castings.dashboard.basic_info.has_wardrobe_fitting')}
        value={hasWardrobeFitting.value}
        onChange={(next) => hasWardrobeFitting.onChange(next)}
        name="hasWardrobeFitting"
      />

      {hasWardrobeFitting.value === true && (
        <FormInputField
          id="wardrobeFittingText"
          label={t('employer_castings.dashboard.basic_info.wardrobe_fitting_details')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.wardrobe_fitting')}
          value={wardrobeFittingText.value}
          onChange={wardrobeFittingText.onChange}
          onBlur={wardrobeFittingText.onBlur}
          onKeyDown={wardrobeFittingText.onKeyDown}
          error={errors.wardrobeFittingText ?? undefined}
        />
      )}

      <RangeCalendar
        label={t('employer_castings.dashboard.basic_info.shooting_dates')}
        value={range}
        onChange={setRange}
        onCommit={handleRangeCommit}
        onClear={handleRangeClear}
      />
      <div className="min-h-[5px]"></div>

      <TextareaField
        id="description"
        label={t('employer_castings.dashboard.basic_info.description')}
        placeholder={t('general.placeholder.about')}
        value={description.value}
        onChange={description.onChange}
        onBlur={description.onBlur}
        onKeyDown={description.onKeyDown}
        error={errors.description}
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
