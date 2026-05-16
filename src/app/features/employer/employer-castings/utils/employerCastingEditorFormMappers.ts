import type {
  CastingBasicInfoFormData,
  CastingRoleFormData,
  CastingRoleResponse,
  EmployerCastingEditorResponse,
} from '../types/employerCastings.types';
import type { CastingRoleRequest, CastingUpsertRequest } from '../types/requests';

export const createEmptyRoleDraft = (castingId: string | null): CastingRoleFormData => ({
  id: null,
  castingId,
  roleName: '',
  roleTypeId: null,
  genderId: null,
  ageMin: '',
  ageMax: '',
  description: '',
  professionIds: [],
  skillIds: [],
  payRateTypeId: null,
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
});

export const toBasicInfoFormData = (data: EmployerCastingEditorResponse): CastingBasicInfoFormData => ({
  title: data.title ?? '',
  projectTypeId: data.projectType?.id ?? null,
  castingModalityId: data.castingModality?.id ?? null,
  locationText: data.locationText ?? '',
  applicationDeadline: data.applicationDeadline ?? '',
  hasWardrobeFitting: data.hasWardrobeFitting ?? null,
  wardrobeFittingText: data.wardrobeFittingText ?? '',
  shootingStartDate: data.shootingStartDate ?? '',
  shootingEndDate: data.shootingEndDate ?? '',
  description: data.description ?? '',
});

export const toRoleFormData = (data: CastingRoleResponse): CastingRoleFormData => ({
  id: data.id,
  castingId: data.castingId,
  roleName: data.roleName ?? '',
  roleTypeId: data.roleType?.id ?? null,
  genderId: data.gender?.id ?? null,
  ageMin: data.ageMin != null ? String(data.ageMin) : '',
  ageMax: data.ageMax != null ? String(data.ageMax) : '',
  description: data.description ?? '',
  professionIds: (data.professions ?? []).map((profession) => profession.id),
  skillIds: (data.skills ?? []).map((skill) => skill.id),
  payRateTypeId: data.remuneration?.payRateType?.id ?? null,
  currencyId: data.remuneration?.currency?.id ?? null,
  amount: data.remuneration?.amount != null ? String(data.remuneration.amount) : '',
  remunerationNotes: data.remuneration?.notes ?? '',
  requiresAudio: !!data.requiresAudio,
  requiresVideo: !!data.requiresVideo,
  requirementDescription: data.requirementDescription ?? '',
  ethnicityId: data.ethnicity?.id ?? null,
  tattoo: data.tattoo ?? null,
  passport: data.passport ?? null,
  drivingLicense: data.drivingLicense ?? null,
});

const toNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const toNullableNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.length) return null;
  return Number(trimmed);
};

export const toCastingUpsertRequest = (draft: CastingBasicInfoFormData): CastingUpsertRequest => ({
  title: draft.title.trim(),
  projectTypeId: draft.projectTypeId ?? null,
  castingModalityId: draft.castingModalityId ?? null,
  locationText: toNullableString(draft.locationText),
  applicationDeadline: draft.applicationDeadline || null,
  hasWardrobeFitting: draft.hasWardrobeFitting,
  wardrobeFittingText: toNullableString(draft.wardrobeFittingText),
  shootingStartDate: draft.shootingStartDate || null,
  shootingEndDate: draft.shootingEndDate || null,
  description: toNullableString(draft.description),
});

export const toCastingRoleRequest = (draft: CastingRoleFormData, castingId: string): CastingRoleRequest => ({
  castingId,
  roleName: draft.roleName.trim(),
  roleTypeId: draft.roleTypeId!,
  genderId: draft.genderId!,
  ageMin: Number(draft.ageMin),
  ageMax: Number(draft.ageMax),
  description: toNullableString(draft.description),
  professionIds: draft.professionIds,
  skillIds: draft.skillIds,
  payRateTypeId: draft.payRateTypeId!,
  currencyId: draft.currencyId ?? null,
  amount: toNullableNumber(draft.amount),
  remunerationNotes: toNullableString(draft.remunerationNotes),
  requiresAudio: draft.requiresAudio,
  requiresVideo: draft.requiresVideo,
  requirementDescription: toNullableString(draft.requirementDescription),
  ethnicityId: draft.ethnicityId ?? null,
  tattoo: draft.tattoo,
  passport: draft.passport,
  drivingLicense: draft.drivingLicense,
});
