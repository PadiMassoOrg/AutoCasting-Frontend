export type LegalDocument = {
  id: string;
  type: 'TERMS' | 'PRIVACY' | 'COOKIES';
  locale: string;
  version: string;
  title: string;
  slug: string;
  effectiveAt: string;
  contentHtml: string;
  contentHash: string;
  pdfDownloadUrl?: string | null;
  pdfObjectKey?: string;
};
