import { useEffect } from 'react';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import { useEmployerCastingSetSectionStatus } from '../context/EmployerCastingContext';

type SectionKey = 'basic' | 'roles' | 'requirements' | 'remuneration';

type StatusLike =
  | SiteMetadataObject
  | { id: string; stringCode?: string | null; categoryStringCode?: string | null }
  | null
  | undefined;

export const useSyncCastingSectionStatus = (key: SectionKey, status: StatusLike) => {
  const setSectionStatus = useEmployerCastingSetSectionStatus();

  useEffect(() => {
    if (!status || !status.id) return;
    if (!status.stringCode) return;

    setSectionStatus(key, {
      id: status.id,
      stringCode: status.stringCode,
      categoryStringCode: status.categoryStringCode ?? undefined,
    });
  }, [key, status?.id, status?.stringCode, status?.categoryStringCode, setSectionStatus]);
};
