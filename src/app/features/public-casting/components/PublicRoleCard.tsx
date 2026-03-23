import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUpDown } from '../../../shared/components/Chevron';
import { Chip } from '../../../shared/components/Chip';
import { formatBooleanLabeled, formatCurrencyAmount } from '../../../shared/utils/formatUtils';
import type { CastingRole } from '../types/publicCasting.types';

type ChipConfig = {
  key: string;
  label: string;
  translate?: boolean;
};

type Props = {
  data: CastingRole;
  showApplyButton?: boolean;
  applyDisabled?: boolean;
  onApply?: (role: CastingRole) => void;
};

const PublicRoleCard = ({ data, showApplyButton = false, applyDisabled = false, onApply }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const headerChips = buildHeaderChips(data, t);
  const characteristicsChips = buildCharacteristicsChips(data, t);
  const skillsChips = buildSkillsChips(data, t);

  const amountLabel = formatCurrencyAmount(
    data.remuneration?.amount ?? null,
    data.remuneration?.currency?.stringCode ?? null
  );
  const payRateLabelKey = data.remuneration?.payRateType?.stringCode;
  const payRateLabel = payRateLabelKey ? t(payRateLabelKey) : '';

  const finalAmountAndCurrencyLabel =
    amountLabel && payRateLabel ? `${amountLabel} (${payRateLabel})` : amountLabel || payRateLabel || '';

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="flex flex-row items-center justify-between">
          <h2 className="text-base font-bold">{data.roleName}</h2>
          {data.description || characteristicsChips.length > 0 || skillsChips.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-pointer"
              aria-expanded={open}
            >
              <ChevronUpDown open={open} />
            </button>
          ) : null}
        </span>
        <div className="flex flex-row flex-wrap gap-2">
          {headerChips.map((chip) => (
            <Chip key={chip.key} label={t(chip.label)} />
          ))}
        </div>
      </div>

      {open && (
        <>
          {data.description && (
            <p className="text-sm text-[var(--color-secondary-grey-fonts)] font-light">{data.description}</p>
          )}

          {characteristicsChips.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">
                {t('casting.role_section.role.characteristics.characteristics')}:
              </h2>
              <div className="flex flex-row flex-wrap gap-2">
                {characteristicsChips.map((chip) => (
                  <Chip key={chip.key} label={t(chip.label)} />
                ))}
              </div>
            </div>
          )}

          {skillsChips.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">{t('casting.role_section.role.skills.skills')}:</h2>
              <div className="flex flex-row flex-wrap gap-2">
                {skillsChips.map((chip) => (
                  <Chip key={chip.key} label={t(chip.label)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(finalAmountAndCurrencyLabel || showApplyButton) && (
        <>
          <Separator className="opacity-20 my-1" />
          <div className="flex flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">{finalAmountAndCurrencyLabel}</h2>

            {showApplyButton && (
              <Button variant="primary" className="!w-auto" disabled={applyDisabled} onClick={() => onApply?.(data)}>
                {t('general.apply')}
              </Button>
            )}
          </div>
        </>
      )}
    </article>
  );
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

const buildSkillsChips = (data: CastingRole, t: (k: string) => string): ChipConfig[] => {
  const chips: ChipConfig[] = [];

  data.skills?.forEach((s) => {
    if (!s) return;

    const categoryLabel = s.categoryStringCode ? t(s.categoryStringCode) : '';
    const skillLabel = t(s.stringCode!);
    const finalLabel = categoryLabel ? `${categoryLabel}: ${skillLabel}` : skillLabel;

    chips.push({
      key: s.id,
      label: finalLabel,
      translate: false,
    });
  });

  return chips;
};

export default PublicRoleCard;
