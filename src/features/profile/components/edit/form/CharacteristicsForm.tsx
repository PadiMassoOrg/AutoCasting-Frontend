import { FormInputField, FormSelectField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import {
  useCommittedBoolean,
  useCommittedInt,
  useCommittedText,
  useCommittedUuid,
} from '../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCharacteristicsAutosave } from '../../../hooks/autosaves';
import type { Characteristics } from '../../../types/profile.types';

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

  const heightCm = useCommittedInt(data.heightCm ?? null, (v) => autosave.immediate({ heightCm: v ?? undefined }), {
    min: 20,
    max: 500,
    allowNull: true,
  });
  const weightKg = useCommittedInt(data.weightKg ?? null, (v) => autosave.immediate({ weightKg: v ?? undefined }), {
    min: 20,
    max: 500,
    allowNull: true,
  });
  const hair = useCommittedUuid(
    data.hairColor?.id ?? null,
    (id) => autosave.immediate({ hairColorId: id ?? undefined }),
    { allowNull: true }
  );
  const eye = useCommittedUuid(data.eyeColor?.id ?? null, (id) => autosave.immediate({ eyeColorId: id ?? undefined }), {
    allowNull: true,
  });
  const chestCm = useCommittedInt(data.chestCm ?? null, (v) => autosave.immediate({ chestCm: v ?? undefined }), {
    min: 20,
    max: 500,
    allowNull: true,
  });
  const waistCm = useCommittedInt(data.waistCm ?? null, (v) => autosave.immediate({ waistCm: v ?? undefined }), {
    min: 20,
    max: 500,
    allowNull: true,
  });
  const hipCm = useCommittedInt(data.hipCm ?? null, (v) => autosave.immediate({ hipCm: v ?? undefined }), {
    min: 20,
    max: 500,
    allowNull: true,
  });
  const shirtSize = useCommittedText(data.shirtSize ?? '', (v) => autosave.immediate({ shirtSize: v }), {
    trim: true,
  });
  const pantSize = useCommittedText(data.pantSize ?? '', (v) => autosave.immediate({ pantSize: v }), {
    trim: true,
  });
  const dressSize = useCommittedText(data.dressSize ?? '', (v) => autosave.immediate({ dressSize: v }), {
    trim: true,
  });
  const shoeSize = useCommittedText(data.shoeSize ?? '', (v) => autosave.immediate({ shoeSize: v }), {
    trim: true,
  });
  const tattoo = useCommittedBoolean(data.tattoo, (v) => autosave.immediate({ tattoo: v }));
  const passport = useCommittedBoolean(data.passport, (v) => autosave.immediate({ passport: v }));
  const drivingLicense = useCommittedBoolean(data.drivingLicense, (v) => autosave.immediate({ drivingLicense: v }));
  const diet = useCommittedUuid(
    data.dietOption?.id ?? null,
    (id) => autosave.immediate({ dietOptionId: id ?? undefined }),
    { allowNull: true }
  );

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.characteristics.characteristics')}</h3>

      <article className="flex flex-row gap-2 items-center">
        <FormInputField
          id="heightCm"
          label={t('profile.characteristics.heightCm')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={heightCm.value}
          onChange={heightCm.onChange}
          onBlur={heightCm.onBlur}
          onKeyDown={heightCm.onKeyDown}
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
      />
      <article className="flex flex-row gap-2 items-center">
        <FormInputField
          id="chestCm"
          label={t('profile.characteristics.chest')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={chestCm.value}
          onChange={chestCm.onChange}
          onBlur={chestCm.onBlur}
          onKeyDown={chestCm.onKeyDown}
        />
        <FormInputField
          id="waistCm"
          label={t('profile.characteristics.waist')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={waistCm.value}
          onChange={waistCm.onChange}
          onBlur={waistCm.onBlur}
          onKeyDown={waistCm.onKeyDown}
        />
        <FormInputField
          id="hipCm"
          label={t('profile.characteristics.hip')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={hipCm.value}
          onChange={hipCm.onChange}
          onBlur={hipCm.onBlur}
          onKeyDown={hipCm.onKeyDown}
        />
      </article>
      <article className="flex flex-row gap-2 items-center">
        <FormInputField
          id="shirtSize"
          label={t('profile.characteristics.shirt')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={shirtSize.value}
          onChange={shirtSize.onChange}
          onBlur={shirtSize.onBlur}
          onKeyDown={shirtSize.onKeyDown}
        />
        <FormInputField
          id="pantSize"
          label={t('profile.characteristics.pants')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={pantSize.value}
          onChange={pantSize.onChange}
          onBlur={pantSize.onBlur}
          onKeyDown={pantSize.onKeyDown}
        />
      </article>
      <article className="flex flex-row gap-2 items-center">
        <FormInputField
          id="dressSize"
          label={t('profile.characteristics.dress')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={dressSize.value}
          onChange={dressSize.onChange}
          onBlur={dressSize.onBlur}
          onKeyDown={dressSize.onKeyDown}
        />
        <FormInputField
          id="shoeSize"
          label={t('profile.characteristics.shoes')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.dash')}
          value={shoeSize.value}
          onChange={shoeSize.onChange}
          onBlur={shoeSize.onBlur}
          onKeyDown={shoeSize.onKeyDown}
        />
      </article>
      <article className="flex flex-row gap-2 items-center">
        <FormSelectField
          id="tattoo"
          label={t('profile.characteristics.tattoo')}
          value={tattoo.value}
          onChange={tattoo.onChange}
          options={booleanOptions}
        />

        <FormSelectField
          id="passport"
          label={t('profile.characteristics.passport')}
          value={passport.value}
          onChange={passport.onChange}
          options={booleanOptions}
        />
      </article>
      <FormSelectField
        id="drivingLicense"
        label={t('profile.characteristics.drivingLicense')}
        value={drivingLicense.value}
        onChange={drivingLicense.onChange}
        options={booleanOptions}
      />
      <FormSelectField
        id="dietOptionId"
        label={t('profile.characteristics.diet')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.dash')}
        value={diet.value}
        onChange={diet.onChange}
        onBlur={diet.onBlur}
        options={dietOptions}
      />
    </div>
  );
}
