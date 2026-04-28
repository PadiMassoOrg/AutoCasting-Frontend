export type SliceResponse<T> = {
  items: T[];
  hasNext: boolean;
  page: number;
  size: number;
  totalCount?: number | null;
};
