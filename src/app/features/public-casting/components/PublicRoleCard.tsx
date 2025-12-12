import { useTranslation } from 'react-i18next';
import { ChevronUpDown } from '../../../shared/components/Chevron';
import { Chip } from '../../../shared/components/Chip/Chip';
import { formatBooleanLabeled } from '../../../shared/utils/formatUtils';
import type { CastingRole } from '../../employer/employer-castings/types/employerCastings.types';

type ChipConfig = {
  key: string;
  label: string;
  translate?: boolean;
};

const buildHeaderChips = (data: CastingRole, t: (k: string) => string): ChipConfig[] => {
  const chips: ChipConfig[] = [];

  data.professions?.forEach((p) => {
    if (!p) return;
    chips.push({
      key: p.id,
      label: p.stringCode!,
    });
  });

  if (data.roleType) {
    chips.push({
      key: data.roleType.id,
      label: data.roleType.stringCode!,
    });
  }

  if (data.gender) {
    chips.push({
      key: data.gender.id,
      label: data.gender.stringCode!,
    });
  }

  if (data.ageMin != null || data.ageMax != null) {
    const ageLabel = `${data.ageMin ?? ''} - ${data.ageMax ?? ''} ${t('general.years')}`;
    chips.push({
      key: 'age',
      label: ageLabel,
      translate: false,
    });
  }

  return chips;
};

const buildCharacteristicsChips = (data: CastingRole, t: (k: string) => string): ChipConfig[] => {
  const chips: ChipConfig[] = [];
  const c = data.characteristics;

  if (c?.heightCm != null) {
    const heightLabel = `${c.heightCm} ${t('general.cm')}`;
    chips.push({
      key: 'height',
      label: heightLabel,
      translate: false,
    });
  }

  if (c?.ethnicity) {
    chips.push({
      key: 'ethnicity',
      label: c.ethnicity.stringCode!,
      translate: true,
    });
  }

  if (c?.hairColor) {
    chips.push({
      key: 'hairColor',
      label: c.hairColor.stringCode!,
      translate: true,
    });
  }

  const tattooLabel = formatBooleanLabeled({
    labelKey: 'profile.characteristics.tattoo',
    value: c?.tattoo ?? null,
    t,
  });
  if (tattooLabel) {
    chips.push({
      key: 'tattoo',
      label: tattooLabel,
      translate: false,
    });
  }

  const passportLabel = formatBooleanLabeled({
    labelKey: 'profile.characteristics.passport',
    value: c?.passport ?? null,
    t,
  });
  if (passportLabel) {
    chips.push({
      key: 'passport',
      label: passportLabel,
      translate: false,
    });
  }

  const drivingLicenseLabel = formatBooleanLabeled({
    labelKey: 'profile.characteristics.drivingLicense',
    value: c?.drivingLicense ?? null,
    t,
  });
  if (drivingLicenseLabel) {
    chips.push({
      key: 'drivingLicense',
      label: drivingLicenseLabel,
      translate: false,
    });
  }

  return chips;
};

const PublicRoleCard = ({ data }: { data: CastingRole }) => {
  const { t } = useTranslation();

  const headerChips = buildHeaderChips(data, t);
  const characteristicsChips = buildCharacteristicsChips(data, t);

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="flex flex-row items-center justify-between">
          <h2 className="text-base font-bold">{data.name}</h2>
          <ChevronUpDown open={true} />
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          {headerChips.map((chip) => (
            <Chip key={chip.key} label={chip.label} t={t} translate={chip.translate} />
          ))}
        </div>
      </div>

      {data.description && (
        <p className="text-sm text-[var(--color-secondary-grey-fonts)] font-light">{data.description}</p>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">{t('casting.characteristics.characteristics')}:</h2>
        <div className="flex flex-row flex-wrap gap-1">
          {characteristicsChips.map((chip) => (
            <Chip key={chip.key} label={chip.label} t={t} translate={chip.translate} />
          ))}
        </div>
      </div>
    </article>
  );
};

export default PublicRoleCard;
