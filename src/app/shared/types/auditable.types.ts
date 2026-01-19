export type Auditable = {
  createdAt?: string | null;
  createdBy?: string | null;
  modifiedAt?: string | null;
  modifiedBy?: string | null;
  deleted?: boolean;
};

export type WithAuditable<T> = T & Auditable;
