import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { CastingRoleFormData } from '../../../types/employerCastings.types';
import CastingRoleForm from './CastingRoleForm';

const uploadReferencePhotoMock = vi.fn();
const removeByPublicUrlMock = vi.fn();

vi.mock('../../../../../../integrations/supabase/media/hooks/useCastingRolePhotoUpload', () => ({
  useCastingRolePhotoUpload: () => ({
    mutateAsync: uploadReferencePhotoMock,
    isPending: false,
  }),
}));

vi.mock('../../../../../../integrations/supabase/media/lib/profile-media', () => ({
  removeByPublicUrl: (...args: unknown[]) => removeByPublicUrlMock(...args),
}));

vi.mock('../../../../../../shared/utils/backendErrorHandling', () => ({
  getBackendErrorMessage: (err: unknown) => (err instanceof Error ? err.message : 'error'),
}));

vi.mock('../../../../../../context/ModalContext', () => ({
  useModal: () => ({ openModal: vi.fn(), closeModal: vi.fn() }),
}));

vi.mock('../../../../../sitemetadata/hooks/useCachedSiteMetadata', () => ({
  useCachedSiteMetadataOption: () => [],
  useCachedSiteMetadataSlice: () => [],
}));

vi.mock('../../../schemas/castingRoleSchema', () => ({
  // A real, permissive Zod schema (zodResolver requires an actual ZodType, not a duck-typed
  // stand-in) that accepts anything, so isValid never blocks the assertions this test file
  // cares about (reference-photo dirty tracking) — role-field validation itself is covered
  // by castingRoleSchema.test.ts.
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
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  CheckboxField: () => <div>checkbox-field</div>,
  FormCurrencyField: () => <div>form-currency-field</div>,
  FormInputField: ({
    id,
    value,
    onChange,
  }: {
    id: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => <input aria-label={id} value={value ?? ''} onChange={onChange} />,
  FormSelectField: () => <div>form-select-field</div>,
  Icon: () => <span>icon</span>,
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  MultiSelectDropdown: () => <div>multi-select-dropdown</div>,
  Separator: () => <hr />,
  TextareaField: () => <textarea aria-label="requirementDescription" />,
  UploadTile: ({
    value,
    onSelect,
    onDeleteClick,
  }: {
    value?: string;
    onSelect: (file: File) => void;
    onDeleteClick: () => void;
  }) => (
    <div>
      <span data-testid="upload-tile-value">{value ?? ''}</span>
      <button type="button" onClick={() => onSelect(new File(['content'], 'photo.jpg', { type: 'image/jpeg' }))}>
        select-photo
      </button>
      <button type="button" onClick={onDeleteClick}>
        delete-photo
      </button>
    </div>
  ),
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
  payRateTypeId: 'pay-rate-1',
  currencyId: null,
  amount: '',
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

const renderForm = (
  data: CastingRoleFormData,
  overrides: Partial<React.ComponentProps<typeof CastingRoleForm>> = {}
) => {
  const onChange = vi.fn();
  const onRegisterCommitReferencePhoto = vi.fn();
  const onPendingReferencePhotoDirtyChange = vi.fn();

  render(
    <CastingRoleForm
      data={data}
      employerProfileId="employer-1"
      onChange={onChange}
      onRegisterCommitReferencePhoto={onRegisterCommitReferencePhoto}
      onPendingReferencePhotoDirtyChange={onPendingReferencePhotoDirtyChange}
      {...overrides}
    />
  );

  return { onChange, onRegisterCommitReferencePhoto, onPendingReferencePhotoDirtyChange };
};

const getLatestCommit = (onRegisterCommitReferencePhoto: ReturnType<typeof vi.fn>) => {
  const calls = onRegisterCommitReferencePhoto.mock.calls;
  return calls[calls.length - 1][0] as () => Promise<string | null>;
};

const getLatestDirty = (onPendingReferencePhotoDirtyChange: ReturnType<typeof vi.fn>) => {
  const calls = onPendingReferencePhotoDirtyChange.mock.calls;
  return calls.length ? calls[calls.length - 1][0] : undefined;
};

describe('CastingRoleForm reference photo', () => {
  beforeEach(() => {
    uploadReferencePhotoMock.mockReset();
    removeByPublicUrlMock.mockReset();
    removeByPublicUrlMock.mockResolvedValue(undefined);
  });

  it('reports not dirty on initial mount with no persisted photo', () => {
    const { onPendingReferencePhotoDirtyChange } = renderForm(baseData);

    expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(false);
  });

  it('picking a photo reports dirty and shows a local preview, without uploading', async () => {
    const { onPendingReferencePhotoDirtyChange } = renderForm(baseData);

    fireEvent.click(screen.getByText('select-photo'));

    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));
    expect(uploadReferencePhotoMock).not.toHaveBeenCalled();
  });

  it('deleting a photo that was never persisted (just picked) does not report dirty', async () => {
    const { onPendingReferencePhotoDirtyChange } = renderForm(baseData);

    fireEvent.click(screen.getByText('select-photo'));
    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));

    fireEvent.click(screen.getByText('delete-photo'));

    expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(false);
  });

  it('deleting a persisted photo reports dirty', () => {
    const data = { ...baseData, referencePhotoUrl: 'https://example.com/old.jpg' };
    const { onPendingReferencePhotoDirtyChange } = renderForm(data);

    fireEvent.click(screen.getByText('delete-photo'));

    expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true);
  });

  it('commit with nothing pending resolves to the current persisted url without calling upload or delete', async () => {
    const data = { ...baseData, referencePhotoUrl: 'https://example.com/existing.jpg' };
    const { onRegisterCommitReferencePhoto } = renderForm(data);

    const result = await getLatestCommit(onRegisterCommitReferencePhoto)();

    expect(result).toBe('https://example.com/existing.jpg');
    expect(uploadReferencePhotoMock).not.toHaveBeenCalled();
    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
  });

  it('commit with a pending file uploads it, deletes the previous photo, and returns the new url', async () => {
    uploadReferencePhotoMock.mockResolvedValue('https://example.com/new.jpg');
    const data = { ...baseData, referencePhotoUrl: 'https://example.com/old.jpg' };
    const { onPendingReferencePhotoDirtyChange, onRegisterCommitReferencePhoto } = renderForm(data);

    fireEvent.click(screen.getByText('select-photo'));
    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));

    const result = await getLatestCommit(onRegisterCommitReferencePhoto)();

    expect(uploadReferencePhotoMock).toHaveBeenCalledWith({ file: expect.any(File) });
    expect(removeByPublicUrlMock).toHaveBeenCalledWith('https://example.com/old.jpg');
    expect(result).toBe('https://example.com/new.jpg');
  });

  it('commit with a pending file on a role with no previous photo uploads without attempting a delete', async () => {
    uploadReferencePhotoMock.mockResolvedValue('https://example.com/new.jpg');
    const { onPendingReferencePhotoDirtyChange, onRegisterCommitReferencePhoto } = renderForm(baseData);

    fireEvent.click(screen.getByText('select-photo'));
    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));

    await getLatestCommit(onRegisterCommitReferencePhoto)();

    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
  });

  it('commit with a pending removal deletes the persisted photo and returns null', async () => {
    const data = { ...baseData, referencePhotoUrl: 'https://example.com/old.jpg' };
    const { onRegisterCommitReferencePhoto } = renderForm(data);

    fireEvent.click(screen.getByText('delete-photo'));
    const result = await getLatestCommit(onRegisterCommitReferencePhoto)();

    expect(removeByPublicUrlMock).toHaveBeenCalledWith('https://example.com/old.jpg');
    expect(result).toBeNull();
  });

  it('a failed upload during commit rejects and does not clear the pending state', async () => {
    uploadReferencePhotoMock.mockRejectedValue(new Error('upload failed'));
    const { onPendingReferencePhotoDirtyChange, onRegisterCommitReferencePhoto } = renderForm(baseData);

    fireEvent.click(screen.getByText('select-photo'));
    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));

    await expect(getLatestCommit(onRegisterCommitReferencePhoto)()).rejects.toThrow('upload failed');
    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
  });

  it('a failure to delete the previous photo after a successful upload does not fail the commit', async () => {
    uploadReferencePhotoMock.mockResolvedValue('https://example.com/new.jpg');
    removeByPublicUrlMock.mockRejectedValue(new Error('delete failed'));
    const data = { ...baseData, referencePhotoUrl: 'https://example.com/old.jpg' };
    const { onPendingReferencePhotoDirtyChange, onRegisterCommitReferencePhoto } = renderForm(data);

    fireEvent.click(screen.getByText('select-photo'));
    await vi.waitFor(() => expect(getLatestDirty(onPendingReferencePhotoDirtyChange)).toBe(true));

    await expect(getLatestCommit(onRegisterCommitReferencePhoto)()).resolves.toBe('https://example.com/new.jpg');
  });
});
