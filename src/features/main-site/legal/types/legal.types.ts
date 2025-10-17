export type LegalDocument = {
  id: string;
  type: 'TERMS' | 'POLICY';
  locale: string;
  version: string;
  title: string;
  slug: string;
  effectiveAt: string;
  contentHtml: string;
  contentHash: string;
};
