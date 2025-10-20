import { FormInputField, FormSelectField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCommittedBoolean,
  useCommittedInt,
  useCommittedText,
  useCommittedUuid,
} from '../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCharacteristicsAutosave } from '../../hooks/autosaves';
import { getCharacteristicsSchema } from '../../schemas/characteristicsSchema';
import type { Characteristics } from '../../types/talentProfile.types';

export default function CharacteristicsForm({ data }: { data: Characteristics }) {
  const { t } = useTranslation();
  const autosave = useCharacteristicsAutosave();

  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const dietOptions = useCachedSiteMetadataOption('dietOptions', t);
  const booleanOptions = [
    { value: 'true', label: t('general.yes') },
    { value: 'false', label: t('general.no') },
  ];

  const schema = useMemo(() => getCharacteristicsSchema(t), [t]);

  type Errs = Partial<
    Record<
      | 'heightCm'
      | 'weightKg'
      | 'hairColorId'
      | 'eyeColorId'
      | 'dietOptionId'
      | 'chestCm'
      | 'waistCm'
      | 'hipCm'
      | 'shirtSize'
      | 'pantSize'
      | 'dressSize'
      | 'shoeSize',
      string | null
    >
  >;
  const [errors, setErrors] = useState<Errs>({});

  const heightCm = useCommittedInt(
    data.heightCm ?? null,
    (v) => {
      const r = schema.shape.heightCm.safeParse(v ?? '');
      setErrors((e) => ({ ...e, heightCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ heightCm: r.data as number | undefined });
    },
    { allowNull: true }
  );

  const weightKg = useCommittedInt(
    data.weightKg ?? null,
    (v) => {
      const r = schema.shape.weightKg.safeParse(v ?? '');
      setErrors((e) => ({ ...e, weightKg: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ weightKg: r.data as number | undefined });
    },
    { allowNull: true }
  );

  const hair = useCommittedUuid(
    data.hairColor?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.hairColorId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        hairColorId: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ hairColorId: r.data as string | undefined });
    },
    { allowNull: true }
  );

  const eye = useCommittedUuid(
    data.eyeColor?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.eyeColorId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        eyeColorId: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ eyeColorId: r.data as string | undefined });
    },
    { allowNull: true }
  );

  const chestCm = useCommittedText(
    data.chestCm != null ? String(data.chestCm) : ((data as any).chestCm ?? ''),
    (v) => {
      const r = schema.shape.chestCm.safeParse(v);
      setErrors((e) => ({ ...e, chestCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ chestCm: r.data as any }); // number | string | undefined
    },
    { trim: true }
  );

  const waistCm = useCommittedText(
    data.waistCm != null ? String(data.waistCm) : ((data as any).waistCm ?? ''),
    (v) => {
      const r = schema.shape.waistCm.safeParse(v);
      setErrors((e) => ({ ...e, waistCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ waistCm: r.data as any });
    },
    { trim: true }
  );

  const hipCm = useCommittedText(
    data.hipCm != null ? String(data.hipCm) : ((data as any).hipCm ?? ''),
    (v) => {
      const r = schema.shape.hipCm.safeParse(v);
      setErrors((e) => ({ ...e, hipCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ hipCm: r.data as any });
    },
    { trim: true }
  );

  const shirtSize = useCommittedText(
    data.shirtSize ?? '',
    (v) => {
      const r = schema.shape.shirtSize.safeParse(v);
      setErrors((e) => ({ ...e, shirtSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ shirtSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const pantSize = useCommittedText(
    data.pantSize ?? '',
    (v) => {
      const r = schema.shape.pantSize.safeParse(v);
      setErrors((e) => ({ ...e, pantSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ pantSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const dressSize = useCommittedText(
    data.dressSize ?? '',
    (v) => {
      const r = schema.shape.dressSize.safeParse(v);
      setErrors((e) => ({ ...e, dressSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ dressSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const shoeSize = useCommittedText(
    data.shoeSize ?? '',
    (v) => {
      const r = schema.shape.shoeSize.safeParse(v);
      setErrors((e) => ({ ...e, shoeSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid') }));
      if (r.success) autosave.immediate({ shoeSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const tattoo = useCommittedBoolean(data.tattoo, (v) => autosave.immediate({ tattoo: v }));
  const passport = useCommittedBoolean(data.passport, (v) => autosave.immediate({ passport: v }));
  const drivingLicense = useCommittedBoolean(data.drivingLicense, (v) => autosave.immediate({ drivingLicense: v }));

  const diet = useCommittedUuid(
    data.dietOption?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.dietOptionId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        dietOptionId: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ dietOptionId: r.data as string | undefined });
    },
    { allowNull: true }
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-base mb-2">{t('profile.characteristics.characteristics')}</h3>

      <article className="h-full flex flex-row gap-4 items-center">
        <FormInputField
          id="heightCm"
          label={t('profile.characteristics.heightCm')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={heightCm.value}
          onChange={heightCm.onChange}
          onBlur={heightCm.onBlur}
          onKeyDown={heightCm.onKeyDown}
          error={heightCm.error || errors.heightCm || undefined}
        />
        <FormInputField
          id="weightKg"
          label={t('profile.characteristics.weightKg')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={weightKg.value}
          onChange={weightKg.onChange}
          onBlur={weightKg.onBlur}
          onKeyDown={weightKg.onKeyDown}
          error={weightKg.error || errors.weightKg || undefined}
        />
      </article>

      <FormSelectField
        id="hairColorId"
        label={t('profile.characteristics.hairColor')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={hair.value}
        onChange={hair.onChange}
        onBlur={hair.onBlur}
        options={hairOptions}
        error={errors.hairColorId ?? undefined}
      />

      <FormSelectField
        id="eyeColorId"
        label={t('profile.characteristics.eyeColor')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={eye.value}
        onChange={eye.onChange}
        onBlur={eye.onBlur}
        options={eyeOptions}
        error={errors.eyeColorId ?? undefined}
      />

      <article className="flex flex-row gap-4 items-center">
        <FormInputField
          id="chestCm"
          label={t('profile.characteristics.chest')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={chestCm.value}
          onChange={chestCm.onChange}
          onBlur={chestCm.onBlur}
          onKeyDown={chestCm.onKeyDown}
          error={errors.chestCm ?? undefined}
        />
        <FormInputField
          id="waistCm"
          label={t('profile.characteristics.waist')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={waistCm.value}
          onChange={waistCm.onChange}
          onBlur={waistCm.onBlur}
          onKeyDown={waistCm.onKeyDown}
          error={errors.waistCm ?? undefined}
        />
        <FormInputField
          id="hipCm"
          label={t('profile.characteristics.hip')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={hipCm.value}
          onChange={hipCm.onChange}
          onBlur={hipCm.onBlur}
          onKeyDown={hipCm.onKeyDown}
          error={errors.hipCm ?? undefined}
        />
      </article>

      <article className="flex flex-row gap-4 items-center">
        <FormInputField
          id="shirtSize"
          label={t('profile.characteristics.shirt')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={shirtSize.value}
          onChange={shirtSize.onChange}
          onBlur={shirtSize.onBlur}
          onKeyDown={shirtSize.onKeyDown}
          error={errors.shirtSize ?? undefined}
        />
        <FormInputField
          id="pantSize"
          label={t('profile.characteristics.pants')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={pantSize.value}
          onChange={pantSize.onChange}
          onBlur={pantSize.onBlur}
          onKeyDown={pantSize.onKeyDown}
          error={errors.pantSize ?? undefined}
        />
      </article>

      <article className="flex flex-row gap-4 items-center">
        <FormInputField
          id="dressSize"
          label={t('profile.characteristics.dress')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={dressSize.value}
          onChange={dressSize.onChange}
          onBlur={dressSize.onBlur}
          onKeyDown={dressSize.onKeyDown}
          error={errors.dressSize ?? undefined}
        />
        <FormInputField
          id="shoeSize"
          label={t('profile.characteristics.shoes')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.measure')}
          value={shoeSize.value}
          onChange={shoeSize.onChange}
          onBlur={shoeSize.onBlur}
          onKeyDown={shoeSize.onKeyDown}
          error={errors.shoeSize ?? undefined}
        />
      </article>

      <article className="flex flex-row gap-4 items-center">
        <FormSelectField
          id="tattoo"
          label={t('profile.characteristics.tattoo')}
          labelClassName="font-semibold text-base"
          value={tattoo.value}
          onChange={tattoo.onChange}
          options={booleanOptions}
        />

        <FormSelectField
          id="passport"
          label={t('profile.characteristics.passport')}
          labelClassName="font-semibold text-base"
          value={passport.value}
          onChange={passport.onChange}
          options={booleanOptions}
        />
      </article>

      <FormSelectField
        id="drivingLicense"
        label={t('profile.characteristics.drivingLicense')}
        labelClassName="font-semibold text-base"
        value={drivingLicense.value}
        onChange={drivingLicense.onChange}
        options={booleanOptions}
      />

      <FormSelectField
        id="dietOptionId"
        label={t('profile.characteristics.diet')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={diet.value}
        onChange={diet.onChange}
        onBlur={diet.onBlur}
        options={dietOptions}
        error={errors.dietOptionId ?? undefined}
      />
    </div>
  );
}
