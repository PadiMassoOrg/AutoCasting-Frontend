import { FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getBooleanOptions,
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
  const backendFieldErrors = autosave.fieldErrors as Record<string, string | undefined>;

  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const ethnicityOptions = useCachedSiteMetadataOption('ethnicityOptions', t);
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const dietOptions = useCachedSiteMetadataOption('dietOptions', t);

  const schema = useMemo(() => getCharacteristicsSchema(t), [t]);

  type Errs = Partial<
    Record<
      | 'heightCm'
      | 'hairColorId'
      | 'eyeColorId'
      | 'ethnicityId'
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

  // ======================
  // Altura / Peso
  // ======================
  const heightCm = useCommittedInt(
    data.heightCm ?? null,
    (v) => {
      const r = schema.shape.heightCm.safeParse(v ?? '');
      setErrors((e) => ({
        ...e,
        heightCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ heightCm: r.data as number | undefined });
    },
    { allowNull: true }
  );

  // ======================
  // Hair color
  // ======================
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

  // ======================
  // Eye color
  // ======================
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

  // ======================
  // Ethnicity (mismo patrón que gender)
  // ======================
  const ethnicity = useCommittedUuid(
    data.ethnicity?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.ethnicityId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        ethnicityId: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) {
        autosave.immediate({ ethnicityId: r.data as string | undefined });
      }
    },
    { allowNull: true }
  );

  // ======================
  // Medidas
  // ======================
  const chestCm = useCommittedText(
    data.chestCm != null ? String(data.chestCm) : ((data as any).chestCm ?? ''),
    (v) => {
      const r = schema.shape.chestCm.safeParse(v);
      setErrors((e) => ({
        ...e,
        chestCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ chestCm: r.data as any });
    },
    { trim: true }
  );

  const hipCm = useCommittedText(
    data.hipCm != null ? String(data.hipCm) : ((data as any).hipCm ?? ''),
    (v) => {
      const r = schema.shape.hipCm.safeParse(v);
      setErrors((e) => ({
        ...e,
        hipCm: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ hipCm: r.data as any });
    },
    { trim: true }
  );

  const shirtSize = useCommittedText(
    data.shirtSize ?? '',
    (v) => {
      const r = schema.shape.shirtSize.safeParse(v);
      setErrors((e) => ({
        ...e,
        shirtSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ shirtSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const pantSize = useCommittedText(
    data.pantSize ?? '',
    (v) => {
      const r = schema.shape.pantSize.safeParse(v);
      setErrors((e) => ({
        ...e,
        pantSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ pantSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const dressSize = useCommittedText(
    data.dressSize ?? '',
    (v) => {
      const r = schema.shape.dressSize.safeParse(v);
      setErrors((e) => ({
        ...e,
        dressSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ dressSize: r.data as string | undefined });
    },
    { trim: true }
  );

  const shoeSize = useCommittedText(
    data.shoeSize ?? '',
    (v) => {
      const r = schema.shape.shoeSize.safeParse(v);
      setErrors((e) => ({
        ...e,
        shoeSize: r.success ? null : r.error.errors[0]?.message || t('validation.invalid'),
      }));
      if (r.success) autosave.immediate({ shoeSize: r.data as string | undefined });
    },
    { trim: true }
  );

  // ======================
  // Booleanos
  // ======================
  const tattoo = useCommittedBoolean(data.tattoo, (v) => autosave.immediate({ tattoo: v }));
  const passport = useCommittedBoolean(data.passport, (v) => autosave.immediate({ passport: v }));
  const drivingLicense = useCommittedBoolean(data.drivingLicense, (v) => autosave.immediate({ drivingLicense: v }));

  // ======================
  // Diet
  // ======================
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

  const resolveError = (field: string, local?: string | null) => local ?? backendFieldErrors[field] ?? undefined;

  return (
    <main className="flex flex-col">
      <section className="flex flex-col lg:flex-row lg:gap-8">
        {/* Height + Hair Color */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormInputField
              id="heightCm"
              label={t('profile.characteristics.heightCm')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.dash')}
              value={heightCm.value}
              onChange={heightCm.onChange}
              onBlur={heightCm.onBlur}
              onKeyDown={heightCm.onKeyDown}
              error={heightCm.error || resolveError('heightCm', errors.heightCm)}
            />
          </div>
          <div className="flex-1">
            <FormSelectField
              id="hairColorId"
              label={t('profile.characteristics.hairColor')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.select')}
              value={hair.value}
              onChange={hair.onChange}
              onBlur={hair.onBlur}
              options={hairOptions}
              error={resolveError('hairColorId', errors.hairColorId)}
            />
          </div>
        </article>
        {/* Eyes + Ethnicity */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormSelectField
              id="eyeColorId"
              label={t('profile.characteristics.eyeColor')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.select')}
              value={eye.value}
              onChange={eye.onChange}
              onBlur={eye.onBlur}
              options={eyeOptions}
              error={resolveError('eyeColorId', errors.eyeColorId)}
            />
          </div>
          <div className="flex-1">
            <FormSelectField
              id="ethnicityId"
              label={t('profile.characteristics.ethnicity')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.select')}
              value={ethnicity.value}
              onChange={ethnicity.onChange}
              onBlur={ethnicity.onBlur}
              options={ethnicityOptions}
              error={resolveError('ethnicityId', errors.ethnicityId)}
            />
          </div>
        </article>
      </section>

      <Separator className="opacity-20 mt-3 mb-8" />

      <section className="flex flex-col lg:flex-row lg:gap-8">
        {/* Pants + Shoes + Shirt */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormInputField
              id="pantSize"
              label={t('profile.characteristics.pants')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={pantSize.value}
              onChange={pantSize.onChange}
              onBlur={pantSize.onBlur}
              onKeyDown={pantSize.onKeyDown}
              error={resolveError('pantSize', errors.pantSize)}
            />
          </div>
          <div className="flex-1">
            <FormInputField
              id="shoeSize"
              label={t('profile.characteristics.shoes')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={shoeSize.value}
              onChange={shoeSize.onChange}
              onBlur={shoeSize.onBlur}
              onKeyDown={shoeSize.onKeyDown}
              error={resolveError('shoeSize', errors.shoeSize)}
            />
          </div>
          <div className="flex-1">
            <FormInputField
              id="shirtSize"
              label={t('profile.characteristics.shirt')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={shirtSize.value}
              onChange={shirtSize.onChange}
              onBlur={shirtSize.onBlur}
              onKeyDown={shirtSize.onKeyDown}
              error={resolveError('shirtSize', errors.shirtSize)}
            />
          </div>
        </article>
        {/* Chest + Hips + Dress */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormInputField
              id="chestCm"
              label={t('profile.characteristics.chest')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={chestCm.value}
              onChange={chestCm.onChange}
              onBlur={chestCm.onBlur}
              onKeyDown={chestCm.onKeyDown}
              error={resolveError('chestCm', errors.chestCm)}
            />
          </div>
          <div className="flex-1">
            <FormInputField
              id="hipCm"
              label={t('profile.characteristics.hip')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={hipCm.value}
              onChange={hipCm.onChange}
              onBlur={hipCm.onBlur}
              onKeyDown={hipCm.onKeyDown}
              error={resolveError('hipCm', errors.hipCm)}
            />
          </div>
          <div className="flex-1">
            <FormInputField
              id="dressSize"
              label={t('profile.characteristics.dress')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.measure')}
              value={dressSize.value}
              onChange={dressSize.onChange}
              onBlur={dressSize.onBlur}
              onKeyDown={dressSize.onKeyDown}
              error={resolveError('dressSize', errors.dressSize)}
            />
          </div>
        </article>
      </section>

      <Separator className="opacity-20 mt-3 mb-8" />

      <section className="flex flex-col lg:flex-row lg:gap-8">
        {/* Tattoo + License */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormSelectField
              id="tattoo"
              label={t('profile.characteristics.tattoo')}
              labelClassName="font-semibold text-base"
              value={tattoo.value}
              onChange={tattoo.onChange}
              options={getBooleanOptions(t)}
            />
          </div>
          <div className="flex-1">
            <FormSelectField
              id="drivingLicense"
              label={t('profile.characteristics.drivingLicense')}
              labelClassName="font-semibold text-base"
              value={drivingLicense.value}
              onChange={drivingLicense.onChange}
              options={getBooleanOptions(t)}
            />
          </div>
        </article>
        {/* Passport + Diet */}
        <article className="w-full flex flex-col">
          <div className="flex-1">
            <FormSelectField
              id="dietOptionId"
              label={t('profile.characteristics.diet')}
              labelClassName="font-semibold text-base"
              placeholder={t('general.placeholder.select')}
              value={diet.value}
              onChange={diet.onChange}
              onBlur={diet.onBlur}
              options={dietOptions}
              error={resolveError('dietOptionId', errors.dietOptionId)}
            />
          </div>
          <div className="flex-1">
            <FormSelectField
              id="passport"
              label={t('profile.characteristics.passport')}
              labelClassName="font-semibold text-base"
              value={passport.value}
              onChange={passport.onChange}
              options={getBooleanOptions(t)}
            />
          </div>
        </article>
      </section>
    </main>
  );
}
