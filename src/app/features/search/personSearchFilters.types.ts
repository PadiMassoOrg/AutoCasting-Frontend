export type MatchMode = 'ANY' | 'ALL';

export type BasePersonSearchFiltersQS = Partial<{
  ageMin: number;
  ageMax: number;
  genderIds: string[];
  ethnicityIds: string[];
  professionId: string[];
  professionsMode: MatchMode;
  heightMinCm: number;
  heightMaxCm: number;
  hairColorIds: string[];
  hairColorIdsMode: MatchMode;
  eyeColorIds: string[];
  eyeColorIdsMode: MatchMode;
  tattoo: boolean | null;
  passport: boolean | null;
  drivingLicense: boolean | null;
  skillId: string[];
  skillsMode: MatchMode;
}>;
