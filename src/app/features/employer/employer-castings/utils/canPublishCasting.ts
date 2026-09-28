type CanPublishCastingArgs = {
  publishable: boolean;
  savedRolesCount: number;
  isBasicInfoValid: boolean;
  isBasicInfoDirty: boolean;
  selectedRoleId: string | 'new' | null;
  isRoleDirty: boolean;
};

// Publishing uses the saved casting: a draft for a role that doesn't exist yet is never
// published, so only unsaved edits to an existing role block it.
export const canPublishCasting = ({
  publishable,
  savedRolesCount,
  isBasicInfoValid,
  isBasicInfoDirty,
  selectedRoleId,
  isRoleDirty,
}: CanPublishCastingArgs): boolean => {
  const hasUnsavedExistingRoleChanges = selectedRoleId !== 'new' && isRoleDirty;
  return publishable && savedRolesCount > 0 && isBasicInfoValid && !isBasicInfoDirty && !hasUnsavedExistingRoleChanges;
};
