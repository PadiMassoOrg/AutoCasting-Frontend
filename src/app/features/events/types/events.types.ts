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

export type EventFiltersQS = {
  dateFrom?: string;
  dateTo?: string;
};
