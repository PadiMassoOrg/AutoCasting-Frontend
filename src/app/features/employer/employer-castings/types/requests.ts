export type CastingUpsertRequest = {
  title: string;
  projectTypeId?: string | null;
  castingModalityId?: string | null;
  locationText?: string | null;
  applicationDeadline?: string | null;
  hasWardrobeFitting?: boolean | null;
  wardrobeFittingText?: string | null;
  shootingStartDate?: string | null;
  shootingEndDate?: string | null;
  description?: string | null;
};

export type CastingRoleRequest = {
  castingId: string;
  roleName: string;
  roleTypeId: string;
  genderId: string;
  ageMin: number;
  ageMax: number;
  description?: string | null;
  professionIds: string[];
  skillIds?: string[];
  payRateTypeId: string;
  currencyId?: string | null;
  amount?: number | null;
  remunerationNotes?: string | null;
  requiresAudio?: boolean;
  requiresVideo?: boolean;
  requirementDescription?: string | null;
  ethnicityId?: string | null;
  tattoo?: boolean | null;
  passport?: boolean | null;
  drivingLicense?: boolean | null;
};
