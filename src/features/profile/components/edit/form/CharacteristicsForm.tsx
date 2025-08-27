import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useCommittedInt } from '../../../../../shared/utils/formUtils';
import { useCharacteristicsAutosave } from '../../../hooks/autosaves';
import type { Characteristics } from '../../../types/profile.types';

export default function CharacteristicsForm({ data }: { data: Characteristics }) {
  const { t } = useTranslation();
  const autosave = useCharacteristicsAutosave();

  const heightCm = useCommittedInt(data.heightCm ?? null, (v) => autosave.immediate({ heightCm: v ?? undefined }), {
    min: 50,
    max: 300,
    allowNull: true,
  });

  const weightKg = useCommittedInt(data.weightKg ?? null, (v) => autosave.immediate({ weightKg: v ?? undefined }), {
    min: 25,
    max: 250,
    allowNull: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.characteristics.characteristics')}</h3>
      {/* Estatura */}
      <article className="flex flex-row gap-2 items-center">
        <FormInputField
          id="heightCm"
          label={t('profile.characteristics.heightCm')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.stage_name')}
          value={heightCm.value}
          onChange={heightCm.onChange}
          onBlur={heightCm.onBlur}
          onKeyDown={heightCm.onKeyDown}
        />
        <FormInputField
          id="weightKg"
          label={t('profile.characteristics.weightKg')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.stage_name')}
          value={weightKg.value}
          onChange={weightKg.onChange}
          onBlur={weightKg.onBlur}
          onKeyDown={weightKg.onKeyDown}
        />
      </article>
    </div>
  );
}
