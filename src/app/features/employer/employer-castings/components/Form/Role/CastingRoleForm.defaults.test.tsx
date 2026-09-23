import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { CastingRoleFormData } from '../../../types/employerCastings.types';
import CastingRoleForm from './CastingRoleForm';

const PAY_RATE_TYPE_UNPAID_ID = 'pay-rate-unpaid';
const PAY_RATE_TYPE_TO_BE_AGREED_ID = 'pay-rate-to-be-agreed';
const PAY_RATE_TYPE_FIXED_ID = 'pay-rate-fixed';
const CURRENCY_ARS_ID = 'currency-ars';
const CURRENCY_USD_ID = 'currency-usd';

const siteMetadata: Record<string, { id: string; stringCode: string }[]> = {
  payRateTypeOptions: [
    { id: PAY_RATE_TYPE_UNPAID_ID, stringCode: 'sitemetadata.pay_rate_type.unpaid' },
    { id: PAY_RATE_TYPE_TO_BE_AGREED_ID, stringCode: 'sitemetadata.pay_rate_type.to_be_agreed' },
    { id: PAY_RATE_TYPE_FIXED_ID, stringCode: 'sitemetadata.pay_rate_type.fixed' },
  ],
  currencyOptions: [
    { id: CURRENCY_ARS_ID, stringCode: 'sitemetadata.currency.ars' },
    { id: CURRENCY_USD_ID, stringCode: 'sitemetadata.currency.usd' },
  ],
  genderOptions: [],
  roleTypeOptions: [],
  ethnicityOptions: [],
  professions: [],
  skills: [],
};

vi.mock('../../../../../../integrations/supabase/media/hooks/useCastingRolePhotoUpload', () => ({
  useCastingRolePhotoUpload: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('../../../../../../integrations/supabase/media/lib/profile-media', () => ({
  removeByPublicUrl: vi.fn(),
}));

vi.mock('../../../../../../shared/utils/backendErrorHandling', () => ({
  getBackendErrorMessage: () => 'error',
}));

vi.mock('../../../../../../context/ModalContext', () => ({
  useModal: () => ({ openModal: vi.fn(), closeModal: vi.fn() }),
}));

vi.mock('../../../../../sitemetadata/hooks/useCachedSiteMetadata', () => ({
  useCachedSiteMetadataOption: (key: string, _t: unknown, _category: unknown, opts?: { raw?: boolean }) => {
    const list = siteMetadata[key] ?? [];
    if (opts?.raw) return list;
    return list.map((item) => ({ value: item.id, label: item.stringCode }));
  },
  useCachedSiteMetadataSlice: (key: string) => siteMetadata[key] ?? [],
}));

vi.mock('../../../schemas/castingRoleSchema', () => ({
  getCastingRoleSchema: () => z.any(),
}));

vi.mock('../../../../../talent/talent-profile-edit/components/Form/Skills/GroupedSkills', () => ({
  default: () => <div>grouped-skills</div>,
}));

vi.mock('../../../../../talent/talent-profile-edit/components/Form/Skills/NewSkillModal', () => ({
  NewSkillModal: () => <div>new-skill-modal</div>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  BooleanRadioGroup: () => <div>boolean-radio-group</div>,
  Button: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  CheckboxField: () => <div>checkbox-field</div>,
  FormCurrencyField: () => <div>form-currency-field</div>,
  FormInputField: () => <div>form-input-field</div>,
  FormSelectField: ({ id, value }: { id: string; value?: string }) => (
    <div data-testid={`select-${id}`} data-value={value ?? ''} />
  ),
  Icon: () => <span>icon</span>,
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  MultiSelectDropdown: () => <div>multi-select-dropdown</div>,
  Separator: () => <hr />,
  TextareaField: () => <textarea aria-label="requirementDescription" />,
  UploadTile: () => <div>upload-tile</div>,
  useMedia: () => false,
  XL_SCREEN_SIZE: 0,
}));

const baseData: CastingRoleFormData = {
  id: 'role-1',
  castingId: 'casting-1',
  roleName: 'Lead role',
  roleTypeId: 'role-type-1',
  genderId: 'gender-1',
  ageMin: '18',
  ageMax: '30',
  description: '',
  professionIds: [],
  skillIds: [],
  payRateTypeId: PAY_RATE_TYPE_FIXED_ID,
  currencyId: CURRENCY_USD_ID,
  amount: '500',
  remunerationNotes: '',
  requiresAudio: false,
  requiresVideo: false,
  requirementDescription: '',
  ethnicityId: null,
  tattoo: null,
  passport: null,
  drivingLicense: null,
  referencePhotoUrl: null,
};

const renderForm = (data: CastingRoleFormData) => {
  const onChange = vi.fn();

  const view = render(
    <CastingRoleForm
      data={data}
      employerProfileId="employer-1"
      onChange={onChange}
      onRegisterCommitReferencePhoto={vi.fn()}
      onPendingReferencePhotoDirtyChange={vi.fn()}
    />
  );

  return { onChange, view };
};

describe('CastingRoleForm pay-rate/currency defaulting on open', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps an existing paid role's saved (non-ARS) currency preselected and never patches it", async () => {
    const { onChange, view } = renderForm(baseData);

    await vi.waitFor(() => {
      expect(view.getByTestId('select-currencyId').getAttribute('data-value')).toBe(CURRENCY_USD_ID);
    });

    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ currencyId: expect.anything() }));
  });

  // The backend now persists ARS for unpaid-like roles (see CastingRoleServiceImpl.validateRole),
  // so an existing unpaid/to_be_agreed role always arrives with a real currencyId — this only
  // covers the defensive fallback if one ever arrives with currencyId null regardless.
  it('defaults an existing unpaid role with no currencyId to ARS', async () => {
    const data = { ...baseData, payRateTypeId: PAY_RATE_TYPE_UNPAID_ID, currencyId: null, amount: '' };
    const { view } = renderForm(data);

    await vi.waitFor(() => {
      expect(view.getByTestId('select-currencyId').getAttribute('data-value')).toBe(CURRENCY_ARS_ID);
    });
  });

  it('defaults an existing "to be agreed" role with no currencyId to ARS', async () => {
    const data = { ...baseData, payRateTypeId: PAY_RATE_TYPE_TO_BE_AGREED_ID, currencyId: null, amount: '' };
    const { view } = renderForm(data);

    await vi.waitFor(() => {
      expect(view.getByTestId('select-currencyId').getAttribute('data-value')).toBe(CURRENCY_ARS_ID);
    });
  });

  it('defaults a brand-new draft to unpaid + ARS currency (legitimate initial seeding)', async () => {
    const newDraft: CastingRoleFormData = {
      ...baseData,
      id: null,
      payRateTypeId: null,
      currencyId: null,
      amount: '',
      genderId: null,
    };
    const { view } = renderForm(newDraft);

    await vi.waitFor(() => {
      expect(view.getByTestId('select-payRateTypeId').getAttribute('data-value')).toBe(PAY_RATE_TYPE_UNPAID_ID);
      expect(view.getByTestId('select-currencyId').getAttribute('data-value')).toBe(CURRENCY_ARS_ID);
    });
  });
});
