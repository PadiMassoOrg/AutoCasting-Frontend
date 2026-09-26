import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';
import CastingRolePublicCard from './CastingRolePublicCard';

vi.mock('autocasting-ui-library-padimasso', () => ({
  Icon: () => null,
  SectionCard: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  Separator: () => null,
  TagChip: ({ label }: { label: string }) => <span>{label}</span>,
}));
vi.mock('../../../shared/components/Chip', () => ({ ProjectTypeTagChip: () => null }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const item = (employerImageUrl: string | null): CastingRolePublicCardResponse => ({
  id: 'role-1',
  name: 'Protagonista',
  castingTitle: 'Comercial',
  employerImageUrl,
  projectType: { id: 'pt-1', stringCode: 'project.type' },
  shootingStartDate: '2026-10-01',
  shootingEndDate: '2026-10-02',
  roleType: { id: 'rt-1', stringCode: 'role.type' },
  gender: { id: 'g-1', stringCode: 'gender.female' },
  ageMin: 20,
  ageMax: 30,
  defaultCode: 'comercial',
});

describe('CastingRolePublicCard', () => {
  it('shows the employer image when present', () => {
    const { container } = render(<CastingRolePublicCard item={item('https://img/employer.png')} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://img/employer.png');
  });

  it('omits the employer image when missing', () => {
    const { container } = render(<CastingRolePublicCard item={item(null)} />);

    expect(container.querySelector('img')).toBeNull();
  });
});
