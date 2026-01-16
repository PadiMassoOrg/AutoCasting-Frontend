import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { EmployerCastingResponse } from '../types/employerCastings.types';

type SectionKey = 'basic' | 'roles' | 'requirements' | 'remuneration';

type EmployerCastingIds = Pick<
  EmployerCastingResponse,
  | 'id'
  | 'defaultCode'
  | 'castingStatus'
  | 'basicInfoSectionId'
  | 'rolesSectionId'
  | 'requirementsSectionId'
  | 'remunerationSectionId'
  | 'basicInfoSectionStatus'
  | 'rolesSectionStatus'
  | 'requirementsSectionStatus'
  | 'remunerationSectionStatus'
>;

type SectionStatuses = Record<SectionKey, SiteMetadataObject | null>;

type EmployerCastingContextValue = EmployerCastingIds & {
  sectionStatuses: SectionStatuses;
  setSectionStatus: (key: SectionKey, status: SiteMetadataObject) => void;
  publishAllowed: boolean;
};

const COMPLETED_CODE = 'sitemetadata.casting_section_status.completed';

const isCompleted = (s: SiteMetadataObject | null) => s?.stringCode === COMPLETED_CODE;

const EmployerCastingIdsContext = createContext<EmployerCastingContextValue | null>(null);

export const EmployerCastingIdsProvider = ({ value, children }: { value: EmployerCastingIds; children: ReactNode }) => {
  const [sectionStatuses, setSectionStatuses] = useState<SectionStatuses>(() => ({
    basic: value.basicInfoSectionStatus ?? null,
    roles: value.rolesSectionStatus ?? null,
    requirements: value.requirementsSectionStatus ?? null,
    remuneration: value.remunerationSectionStatus ?? null,
  }));

  useEffect(() => {
    setSectionStatuses({
      basic: value.basicInfoSectionStatus ?? null,
      roles: value.rolesSectionStatus ?? null,
      requirements: value.requirementsSectionStatus ?? null,
      remuneration: value.remunerationSectionStatus ?? null,
    });
  }, [value.id]);

  const setSectionStatus = useCallback((key: SectionKey, status: SiteMetadataObject) => {
    setSectionStatuses((prev) => {
      const prevStatus = prev[key];
      if (prevStatus?.id === status.id && prevStatus?.stringCode === status.stringCode) return prev;
      return { ...prev, [key]: status };
    });
  }, []);

  const publishAllowed = useMemo(() => {
    return (
      isCompleted(sectionStatuses.basic) &&
      isCompleted(sectionStatuses.roles) &&
      isCompleted(sectionStatuses.requirements) &&
      isCompleted(sectionStatuses.remuneration)
    );
  }, [sectionStatuses]);

  const ctxValue = useMemo<EmployerCastingContextValue>(
    () => ({
      ...value,
      sectionStatuses,
      setSectionStatus,
      publishAllowed,
    }),
    [value, sectionStatuses, setSectionStatus, publishAllowed]
  );

  return <EmployerCastingIdsContext.Provider value={ctxValue}>{children}</EmployerCastingIdsContext.Provider>;
};

export const useEmployerCastingIds = () => {
  const ctx = useContext(EmployerCastingIdsContext);
  if (!ctx) throw new Error('EmployerCastingIdsProvider is missing');
  return ctx;
};

export const useEmployerCastingPublishAllowed = () => {
  const ctx = useContext(EmployerCastingIdsContext);
  if (!ctx) throw new Error('EmployerCastingIdsProvider is missing');
  return ctx.publishAllowed;
};

export const useEmployerCastingSetSectionStatus = () => {
  const ctx = useContext(EmployerCastingIdsContext);
  if (!ctx) throw new Error('EmployerCastingIdsProvider is missing');
  return ctx.setSectionStatus;
};
