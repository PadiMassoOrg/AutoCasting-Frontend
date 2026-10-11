import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type EventCardResponse = {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  datesInfo: string | null;
  location: string;
  imageUrl: string;
};

export type EventDetailsResponse = {
  id: string;
  slug: string;
  name: string;
  entryAccess: SiteMetadataObject;
  ticketUrl: string | null;
  startDate: string;
  endDate: string;
  datesInfo: string | null;
  location: string;
  imageUrl: string;
  description: string | null;
};

export type EventFiltersQS = {
  dateFrom?: string;
  dateTo?: string;
};
