import type { QueryClient } from '@tanstack/react-query';
import { CASTING_DATABASE_CACHE_KEY } from '../services/castingDatabaseService';

/**
 * Invalida el listado público (cards). Úsalo SOLO en eventos finales:
 * - publish / pause / close
 * - otros requerimientos de negocio similares (Ej: un admin cambia algo que afecta a todo el mundo)
 */
export function invalidateCastingDatabase(qc: QueryClient) {
  return qc.invalidateQueries({
    queryKey: CASTING_DATABASE_CACHE_KEY,
    exact: false,
    refetchType: 'active',
  });
}
