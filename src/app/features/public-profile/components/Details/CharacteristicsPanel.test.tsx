import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Characteristics } from '../../../talent/talent-profile-edit/types/talentProfile.types';
import CharacteristicsPanel from './CharacteristicsPanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  TagChip: ({ label }: { label: React.ReactNode }) => <span>{label}</span>,
  Separator: () => <hr />,
}));

vi.mock('../../utils/publicProfileUtils', () => ({
  formatCharacteristicValue: (_key: string, raw: unknown) => String(raw ?? ''),
}));

const baseData = {
  heightCm: 180,
  hairColor: { stringCode: 'sitemetadata.color.black' },
  eyeColor: { stringCode: 'sitemetadata.color.brown' },
  chestCm: 100,
  waistCm: 80,
  hipCm: 100,
  shirtSize: 'M',
  pantSize: '40',
  dressSize: '38',
  shoeSize: '42',
  tattoo: false,
  passport: true,
  drivingLicense: true,
  dietOption: { stringCode: 'sitemetadata.diet.omnivore' },
} as unknown as Characteristics;

describe('CharacteristicsPanel', () => {
  it('does not render a waist ("Cintura") row, even though waistCm exists on the data', () => {
    render(<CharacteristicsPanel data={baseData} />);

    // The label key would be 'profile.characteristics.waist' (mocked t() returns the key itself).
    expect(screen.queryByText('profile.characteristics.waist:')).toBeNull();
    // Guard against the row being present in some other form (e.g. the raw waistCm value leaking).
    expect(screen.queryByText('80')).toBeNull();
  });

  it('still renders chest and hip, the two adjacent measurement rows', () => {
    render(<CharacteristicsPanel data={baseData} />);

    expect(screen.getByText('profile.characteristics.chest:')).toBeTruthy();
    expect(screen.getByText('profile.characteristics.hip:')).toBeTruthy();
  });
});
