export type CastingApplicationRequest = {
  message?: string | null;
  submissions: Array<{
    castingRequirementId: string;
    audioUrl?: string | null;
    videoUrl?: string | null;
    notes?: string | null;
  }>;
};
