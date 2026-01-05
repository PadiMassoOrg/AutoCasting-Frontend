import { createContext, useContext, type ReactNode } from 'react';
import type { EmployerCastingResponse } from '../types/employerCastings.types';

type EmployerCastingIds = Pick<
  EmployerCastingResponse,
  | 'id'
  | 'defaultCode'
  | 'castingStatus'
  | 'basicInfoSectionId'
  | 'rolesSectionId'
  | 'requirementsSectionId'
  | 'remunerationSectionId'
>;

const EmployerCastingIdsContext = createContext<EmployerCastingIds | null>(null);

export const EmployerCastingIdsProvider = ({ value, children }: { value: EmployerCastingIds; children: ReactNode }) => {
  return <EmployerCastingIdsContext.Provider value={value}>{children}</EmployerCastingIdsContext.Provider>;
};

export const useEmployerCastingIds = () => {
  const ctx = useContext(EmployerCastingIdsContext);
  if (!ctx) throw new Error('EmployerCastingIdsProvider is missing');
  return ctx;
};
