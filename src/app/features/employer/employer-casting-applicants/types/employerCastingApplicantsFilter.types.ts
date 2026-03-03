import type { AuditableOrderBy } from '../../../../shared/types/orderBy.types';

/**
 * =========================
 * ORDER BY
 * =========================
 */
export const EMPLOYER_CASTING_APPLICANTS_ORDER_BY = {
  // ejemplo futuro:
  // STAGE_NAME_ASC: 'STAGE_NAME_ASC',
  // STAGE_NAME_DESC: 'STAGE_NAME_DESC',
} as const;

export type EmployerCastingApplicantsOrderBy =
  | AuditableOrderBy
  | (typeof EMPLOYER_CASTING_APPLICANTS_ORDER_BY)[keyof typeof EMPLOYER_CASTING_APPLICANTS_ORDER_BY];

/**
 * =========================
 * FILTER STATE
 * =========================
 */
export type EmployerCastingApplicantsFiltersState = {
  search?: string;
  roleIds?: string[];
  applicationStatusIdTokens?: string[];
  professionIds?: string[];
};
