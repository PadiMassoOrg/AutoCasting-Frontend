// ==============================================
// Strings
// ==============================================
export const capitalize = (s: string) => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
};

// ==============================================
// Numbers
// ==============================================
export function formatNumber(value: number): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function formatAgeRange(min: number, max: number, t: (k: string) => string): string {
  if (min == null && max == null) return '';
  const minStr = min != null ? String(min) : '';
  const maxStr = max != null ? String(max) : '';
  return `${minStr} - ${maxStr} ${t('general.years')}`;
}

// ==============================================
// Dates
// ==============================================

// ==============================================
// Booleans
// ==============================================
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

// ==============================================
// Currency - For now always show $
// ==============================================
export function formatCurrencyAmount(amount: number | null | undefined, currencyStringCode?: string | null): string {
  if (amount === null || amount === undefined) return '';

  const formattedAmount = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (!currencyStringCode) {
    return `$${formattedAmount}`;
  }

  const parts = currencyStringCode.split('.');
  const isoCodeRaw = parts[parts.length - 1] || '';
  const isoCode = isoCodeRaw.toUpperCase();

  return `$${formattedAmount} ${isoCode}`;
}

// ==============================================
// URLs
// ==============================================
export function normalizeExternalUrl(raw?: string | null): string | null {
  if (!raw) return null;
  let url = raw.trim();

  if (!/^https?:\/\//i.test(url)) {
    if (/^[\w.-]+\.[a-z]{2,}([\/?#].*)?$/i.test(url)) {
      url = `https://${url}`;
    } else {
      return null;
    }
  }

  const lower = url.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return null;

  return url;
}

// ==============================================
// Phone Numbers
// ==============================================
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let p = raw.trim().replace(/[^\d+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p) return null;
  if (!/^\+\d{6,15}$/.test(p)) return null;
  return p;
}

export function whatsappLink(phone: string, text: string) {
  const norm = normalizePhone(phone);
  if (!norm) return null;
  const num = norm.slice(1);
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
