import type { QueryClient } from '@tanstack/react-query';
import { TALENT_DATABASE_CACHE_KEY } from '../services/talentDatabaseService';

/**
 * Invalida el listado público (cards). Úsalo SOLO en eventos finales:
 * - cambios que afecten cards públicas (stageName/headshot/public flags/etc.)
 * - cambios masivos (ej: bulk upload)
 * - u otros casos similares.
 */
export function invalidateTalentDatabase(qc: QueryClient) {
  return qc.invalidateQueries({
    queryKey: TALENT_DATABASE_CACHE_KEY,
    exact: false,
    refetchType: 'active',
  });
}
