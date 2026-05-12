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
