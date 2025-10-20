import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { BaseCharacteristics, Credit, Education, TalentProfileResponse } from '../types/talentProfile.types';

// ==== Config fácil de editar ====
type SectionKey =
  | 'basicInfo'
  | 'contact'
  | 'socialMedia'
  | 'media'
  | 'characteristics'
  | 'skills'
  | 'credits'
  | 'education';

export const SECTION_WEIGHTS: Record<SectionKey, number> = {
  basicInfo: 30,
  contact: 0,
  socialMedia: 0,
  media: 30,
  characteristics: 30,
  skills: 8,
  credits: 1,
  education: 1,
};

const PROFESSIONS_MIN_COUNT = 1;

type CharKey = keyof BaseCharacteristics;
const CHARACTERISTICS_INCLUDED: CharKey[] = [
  'heightCm',
  'weightKg',
  'chestCm',
  'waistCm',
  'hipCm',
  'tattoo',
  'passport',
  'drivingLicense',
];

// ==== Tipos de salida ====
export type SectionProgress = {
  weight: number; // p. ej. 25
  percent: number; // 0..100 dentro de la sección
  score: number; // percent * weight / 100
};

export type MissingItem = {
  section: SectionKey;
  key: string; // para enrutar a la UI/FORM
  i18nKey?: string; // opcional
};

export type ProfileProgress = {
  total: number; // 0..100
  sections: Record<SectionKey, SectionProgress>;
  missing: MissingItem[];
};

// ==== Helpers ====
const pct = (num: number, den: number) => (den > 0 ? Math.round((num * 100) / den) : 0);

const filled = (v: unknown) => {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'number') return !Number.isNaN(v);
  if (typeof v === 'boolean') return true;
  return true;
};

const getProfessionCount = (bi: any) => {
  const idsLen = Array.isArray(bi?.professionIds) ? bi.professionIds.length : undefined;
  const objsLen = Array.isArray(bi?.professions) ? bi.professions.length : undefined;
  return idsLen ?? objsLen ?? 0;
};

// ==================================
//  Main Function
// ==================================
export function computeProfileProgress(profile: TalentProfileResponse): ProfileProgress {
  const sections = {} as Record<SectionKey, SectionProgress>;
  const missing: MissingItem[] = [];

  // --- Basic Info ---
  const bi = profile.basicInfo;
  const professionsCount = getProfessionCount(bi);
  const hasGender = () => filled((bi as any)?.genderId) || (bi as any)?.gender?.id || (bi as any)?.gender?.stringCode;
  const basicFields: Array<{
    key: keyof typeof bi | 'professionIds' | 'genderId';
    i18n?: string;
    test?: () => boolean;
  }> = [
    { key: 'stageName', i18n: 'progress.stage_name' },
    { key: 'genderId', i18n: 'progress.gender', test: hasGender }, // ⬅️ aquí el cambio
    { key: 'birthDate', i18n: 'progress.birth_date' },
    { key: 'professionIds', i18n: 'progress.professions', test: () => professionsCount >= PROFESSIONS_MIN_COUNT },
  ];
  const isFieldFilled = (f: (typeof basicFields)[number]) => (f.test ? f.test() : filled((bi as any)?.[f.key]));
  const basicPercent = pct(basicFields.filter(isFieldFilled).length, basicFields.length);
  put('basicInfo', basicPercent, sections);
  basicFields.forEach((f) => {
    if (!isFieldFilled(f)) missing.push({ section: 'basicInfo', key: String(f.key), i18nKey: f.i18n });
  });

  // --- Media (headshot + fullbody) ---
  const m = profile.media;
  const mediaFields: [keyof typeof m, string?][] = [
    ['headshotImageUrl', 'progress.add_headshot'],
    ['fullBodyImageUrl', 'progress.add_fullbody'],
  ];
  const mediaPercent = pct(mediaFields.filter(([k]) => filled(m?.[k]!)).length, mediaFields.length);
  put('media', mediaPercent, sections);
  mediaFields.forEach(([k, i18n]) => {
    if (!filled(m?.[k]!)) missing.push({ section: 'media', key: String(k), i18nKey: i18n });
  });

  // --- Characteristics (solo incluidas) ---
  const ch = profile.characteristics as Partial<BaseCharacteristics> | undefined;
  const charKeys = CHARACTERISTICS_INCLUDED;
  const charPercent = pct(charKeys.filter((k) => filled(ch?.[k]!)).length, charKeys.length);
  put('characteristics', charPercent, sections);
  charKeys.forEach((k) => {
    if (!filled(ch?.[k]!)) missing.push({ section: 'characteristics', key: String(k) });
  });

  // --- Skills/Credits/Education (>=1 -> 100) ---
  const skillsCount = (profile.skills as SiteMetadataObject[] | null)?.length ?? 0;
  if (skillsCount === 0) missing.push({ section: 'skills', key: 'skills', i18nKey: 'progress.add_skills' });
  put('skills', skillsCount >= 1 ? 100 : 0, sections);

  const creditsCount = (profile.credits as Credit[] | null)?.length ?? 0;
  if (creditsCount === 0) missing.push({ section: 'credits', key: 'credits', i18nKey: 'progress.add_credits' });
  put('credits', creditsCount >= 1 ? 100 : 0, sections);

  const eduCount = (profile.education as Education[] | null)?.length ?? 0;
  if (eduCount === 0) missing.push({ section: 'education', key: 'education', i18nKey: 'progress.add_education' });
  put('education', eduCount >= 1 ? 100 : 0, sections);

  // === Totals === (usa decimales; redondea SOLO al final)
  const sumWeights = Object.values(SECTION_WEIGHTS).reduce((a, b) => a + b, 0);
  const raw = Object.entries(sections).reduce((sum, [, v]) => sum + (v.percent / 100) * v.weight, 0);
  const total = Math.round((raw * 100) / sumWeights);

  return { total, sections, missing };
}

function put(section: SectionKey, percent: number, acc: Record<SectionKey, SectionProgress>) {
  const weight = SECTION_WEIGHTS[section];
  const score = Math.round((percent * weight) / 100);
  acc[section] = { weight, percent, score };
}
