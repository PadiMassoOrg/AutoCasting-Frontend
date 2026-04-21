// ==============================================
// Strings
// ==============================================
export const capitalize = (s: string) => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
};

function capitalizeDateLabel(text: string): string {
  const exceptions = new Set(['de', 'del']);

  return text
    .split(' ')
    .map((word) => {
      const hasLetter = /[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/.test(word);
      if (!hasLetter) return word;

      const base = word.toLowerCase().replace(/[.,]/g, '');
      if (exceptions.has(base)) return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function formatMemberSince(date: string | Date | null | undefined, t: (k: string) => string): string {
  if (!date) return '';

  let formatted = formatLocalDate(date, 'long', 'es-AR');
  if (!formatted) return '';

  // Quita el último " de " antes del año: "15 de Mayo de 2020" -> "15 de Mayo 2020"
  formatted = formatted.replace(/\s+de\s+(\d{4})$/, ' $1');

  return `${t('casting-database.page.member_since')} ${formatted}`;
}

export function formatCastingModalityText(modality: string, t: (k: string) => string): string {
  return t('sitemetadata.casting_modality.casting') + ': ' + t(modality);
}
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
type DateFormatVariant = 'numeric' | 'short' | 'long' | 'dayMonth';
type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

function parseIsoDate(raw?: string | null): Date | null {
  if (!raw) return null;
  const normalized = raw.replace(/(\.\d{3})\d+/, '$1');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function formatLocalDate(
  value: string | Date | null | undefined,
  variant: DateFormatVariant,
  locale = 'es-AR'
): string {
  if (!value) return '';

  const date = typeof value === 'string' ? parseIsoDate(value) : value;
  if (!date || Number.isNaN(date.getTime())) return '';

  let options: Intl.DateTimeFormatOptions;

  switch (variant) {
    case 'numeric':
      options = { day: '2-digit', month: '2-digit', year: 'numeric' }; // 20/09/2025
      break;
    case 'short':
      options = { day: '2-digit', month: 'short', year: 'numeric' }; // 20 sept. 2025
      break;
    case 'dayMonth':
      options = { day: 'numeric', month: 'long' }; // 20 de septiembre
      break;
    case 'long':
    default:
      options = { day: 'numeric', month: 'long', year: 'numeric' }; // 20 de septiembre de 2025
      break;
  }

  const raw = new Intl.DateTimeFormat(locale, options).format(date);
  return capitalizeDateLabel(raw);
}

export function formatLastSavedDateTime(value: string | Date | null | undefined, t?: TranslateFn): string {
  if (!value) return '';

  const date = typeof value === 'string' ? parseIsoDate(value) : value;
  if (!date || Number.isNaN(date.getTime())) return '';

  const monthKey = MONTH_KEYS[date.getMonth()];
  const monthLabel = t
    ? t(`general.datetime.months.${monthKey}`)
    : capitalizeDateLabel(new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(date));
  const hour24 = date.getHours();
  const hour12 = hour24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const periodLabel = t ? t(hour24 >= 12 ? 'general.datetime.pm' : 'general.datetime.am') : hour24 >= 12 ? 'PM' : 'AM';
  const timeLabel = `${hour12}:${minutes} ${periodLabel}`;

  if (t) {
    return t('general.datetime.last_saved_formatted', {
      day: date.getDate(),
      month: monthLabel,
      year: date.getFullYear(),
      time: timeLabel,
    });
  }

  return `${date.getDate()} de ${monthLabel}, ${date.getFullYear()} ${timeLabel}`;
}

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
