import { describe, expect, it } from 'vitest';
import { canPublishCasting } from './canPublishCasting';

const base = {
  publishable: true,
  savedRolesCount: 1,
  isBasicInfoValid: true,
  isBasicInfoDirty: false,
  selectedRoleId: 'new' as const,
  isRoleDirty: false,
};

describe('canPublishCasting', () => {
  it('allows publishing with valid saved basic info and at least one saved role', () => {
    expect(canPublishCasting(base)).toBe(true);
  });

  it('ignores a dirty draft for a new role that has not been saved', () => {
    expect(canPublishCasting({ ...base, selectedRoleId: 'new', isRoleDirty: true })).toBe(true);
  });

  it('blocks publishing while an existing role has unsaved changes', () => {
    expect(canPublishCasting({ ...base, selectedRoleId: 'role-1', isRoleDirty: true })).toBe(false);
  });

  it('allows publishing while viewing an existing role without changes', () => {
    expect(canPublishCasting({ ...base, selectedRoleId: 'role-1', isRoleDirty: false })).toBe(true);
  });

  it('blocks publishing without any saved role', () => {
    expect(canPublishCasting({ ...base, savedRolesCount: 0 })).toBe(false);
  });

  it('blocks publishing when the backend reports the casting as not publishable', () => {
    expect(canPublishCasting({ ...base, publishable: false })).toBe(false);
  });

  it('blocks publishing with invalid or unsaved basic info', () => {
    expect(canPublishCasting({ ...base, isBasicInfoValid: false })).toBe(false);
    expect(canPublishCasting({ ...base, isBasicInfoDirty: true })).toBe(false);
  });
});
