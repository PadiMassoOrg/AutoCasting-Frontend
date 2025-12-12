export function formatNumber(value: number): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export const formatBooleanYesNo = (value: boolean, t: (k: string) => string): string => {
  return value ? t('general.yes') : t('general.no');
};

export const formatBooleanLabeled = (params: {
  labelKey: string;
  value: boolean | null | undefined;
  t: (k: string) => string;
}): string | null => {
  const { labelKey, value, t } = params;
  if (value === null || value === undefined) return null;

  const boolText = formatBooleanYesNo(value, t);
  const fieldLabel = t(labelKey);

  return `${fieldLabel}: ${boolText}`;
};
