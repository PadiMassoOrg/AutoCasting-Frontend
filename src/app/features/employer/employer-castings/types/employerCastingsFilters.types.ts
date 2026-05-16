import type { AuditableOrderBy } from '../../../../shared/types/orderBy.types';

export type EmployerCastingsFiltersState = {
  projectTypeIds?: string[];
  statusIdTokens?: string[];
  search?: string;
};

export type EmployerCastingsOrderBy = AuditableOrderBy | 'DEADLINE_ASC' | 'DEADLINE_DESC';
