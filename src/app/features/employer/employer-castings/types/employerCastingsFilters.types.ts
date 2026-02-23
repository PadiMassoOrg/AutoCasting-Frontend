import type { AuditableOrderBy } from '../../../../shared/types/orderBy.types';

export const EMPLOYER_CASTINGS_ORDER_BY = {
  DEADLINE_ASC: 'DEADLINE_ASC',
  DEADLINE_DESC: 'DEADLINE_DESC',
} as const;

export type EmployerCastingsOrderBy =
  | AuditableOrderBy
  | (typeof EMPLOYER_CASTINGS_ORDER_BY)[keyof typeof EMPLOYER_CASTINGS_ORDER_BY];
