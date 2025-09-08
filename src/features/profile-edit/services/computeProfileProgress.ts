import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { Credit, Education, ProfileResponse } from '../types/profile.types';

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
  basicInfo: 20,
  contact: 7,
  socialMedia: 6,
  media: 25,
  characteristics: 12,
  skills: 12,
  credits: 12,
  education: 6,
};

const SKILLS_FULL = 5;
const CREDITS_FULL = 3;
const EDU_FULL = 1;

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
  if (typeof v === 'boolean') return true; // si existe el boolean, cuenta
  return true; // objetos con id ya vienen no nulos en tus tipos
};

// ==== Cálculo principal ====
export function computeProfileProgress(profile: ProfileResponse): ProfileProgress {
  const sections = {} as Record<SectionKey, SectionProgress>;
  const missing: MissingItem[] = [];

  // --- basicInfo ---
  const bi = profile.basicInfo;
  const basicFields: [keyof typeof bi, string?][] = [
    ['stageName', 'progress.stage_name'],
    ['genderId', 'progress.gender'],
    ['birthDate', 'progress.birth_date'],
    ['professionIds', 'progress.professions'],
  ];
  const basicFilled = basicFields.filter(([k]) => filled(bi?.[k]!)).length;
  basicFields.forEach(([k, i18n]) => {
    if (!filled(bi?.[k]!)) missing.push({ section: 'basicInfo', key: String(k), i18nKey: i18n });
  });
  put('basicInfo', pct(basicFilled, basicFields.length), sections);

  // --- contact ---
  const c = profile.contact;
  const contactFields: [keyof typeof c, string?][] = [
    ['email', 'progress.email'],
    ['phoneNumber', 'progress.phone'],
  ];
  const contactFilled = contactFields.filter(([k]) => filled(c?.[k]!)).length;
  contactFields.forEach(([k, i18n]) => {
    if (!filled(c?.[k]!)) missing.push({ section: 'contact', key: String(k), i18nKey: i18n });
  });
  put('contact', pct(contactFilled, contactFields.length), sections);

  // --- socialMedia (0, 50, 100) ---
  const s = profile.socialMedia;
  const socialsPresent = [s?.instagramUrl, s?.tikTokUrl].filter(filled).length;
  if (socialsPresent === 0) missing.push({ section: 'socialMedia', key: 'any', i18nKey: 'progress.add_social' });
  put('socialMedia', pct(socialsPresent, 2), sections);

  // --- media (25% cada uno) ---
  const m = profile.media;
  const mediaFields: [keyof typeof m, string?][] = [
    ['headshotImageUrl', 'progress.add_headshot'],
    ['fullBodyImageUrl', 'progress.add_fullbody'],
    ['introductionVideoUrl', 'progress.add_intro_video'],
    ['showReelVideoUrl', 'progress.add_showreel'],
  ];
  const mediaFilled = mediaFields.filter(([k]) => filled(m?.[k]!)).length;
  mediaFields.forEach(([k, i18n]) => {
    if (!filled(m?.[k]!)) missing.push({ section: 'media', key: String(k), i18nKey: i18n });
  });
  put('media', pct(mediaFilled, mediaFields.length), sections);

  // --- characteristics (lineal sobre los más útiles) ---
  const ch = profile.characteristics;
  const charFields: [keyof typeof ch, string?][] = [
    ['heightCm', 'progress.height'],
    ['weightKg', 'progress.weight'],
    ['hairColorId', 'progress.hair_color'],
    ['eyeColorId', 'progress.eye_color'],
    ['shirtSize', 'progress.shirt'],
    ['pantSize', 'progress.pant'],
    ['shoeSize', 'progress.shoe'],
  ];
  const charFilled = charFields.filter(([k]) => filled(ch?.[k]!)).length;
  charFields.forEach(([k, i18n]) => {
    if (!filled(ch?.[k]!)) missing.push({ section: 'characteristics', key: String(k), i18nKey: i18n });
  });
  put('characteristics', pct(charFilled, charFields.length), sections);

  // --- skills (lineal hasta SKILLS_FULL) ---
  const skillsCount = (profile.skills as SiteMetadataObject[] | null)?.length ?? 0;
  if (skillsCount === 0) missing.push({ section: 'skills', key: 'skills', i18nKey: 'progress.add_skills' });
  const skillsPercent = Math.min(100, Math.round(Math.min(skillsCount, SKILLS_FULL) * (100 / SKILLS_FULL)));
  put('skills', skillsPercent, sections);

  // --- credits (lineal hasta CREDITS_FULL) ---
  const creditsCount = (profile.credits as Credit[] | null)?.length ?? 0;
  if (creditsCount === 0) missing.push({ section: 'credits', key: 'credits', i18nKey: 'progress.add_credits' });
  const creditsPercent = Math.min(100, Math.round(Math.min(creditsCount, CREDITS_FULL) * (100 / CREDITS_FULL)));
  put('credits', creditsPercent, sections);

  // --- education (lineal hasta EDU_FULL) ---
  const eduCount = (profile.education as Education[] | null)?.length ?? 0;
  if (eduCount === 0) missing.push({ section: 'education', key: 'education', i18nKey: 'progress.add_education' });
  const eduPercent = Math.min(100, Math.round(Math.min(eduCount, EDU_FULL) * (100 / EDU_FULL)));
  put('education', eduPercent, sections);

  // total ponderado
  const total = Math.min(
    100,
    Object.entries(sections).reduce((sum, [_, v]) => sum + v.score, 0)
  );

  return { total, sections, missing };
}

function put(section: SectionKey, percent: number, acc: Record<SectionKey, SectionProgress>) {
  const weight = SECTION_WEIGHTS[section];
  const score = Math.round((percent * weight) / 100);
  acc[section] = { weight, percent, score };
}
