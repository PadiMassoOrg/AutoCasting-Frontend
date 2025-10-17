import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type { LegalDocument } from '../types/legal.types';

export const LEGAL_CACHE_KEY = ['cache-legal'] as const;

export const fetchLegalDocuments = async (type: string, locale: string): Promise<LegalDocument> => {
  const response = await api.get(API_ROUTES.CURRENT_LEGAL_DOCUMENT + `?type=${type}&locale=${locale}`);
  return response.data;
};
