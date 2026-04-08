import type { TFunction } from 'i18next';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export type BackendMessageDescriptor = {
  message: string;
  messageArgs: string[];
};

export type BackendErrorPayload = {
  status: number | null;
  message: BackendMessageDescriptor | null;
  errors: Record<string, BackendMessageDescriptor>;
  path: string | null;
  timestamp: string | null;
};

type FieldMap<TFieldKey extends string> = Partial<Record<string, TFieldKey>>;
type MessageFieldMap<TFieldKey extends string> = Partial<Record<string, TFieldKey>>;

type HandleBackendFormErrorOptions<TFieldValues extends FieldValues> = {
  error: unknown;
  t: TFunction;
  setError: UseFormSetError<TFieldValues>;
  setInlineError?: (message: string | null) => void;
  showToast?: (message: string) => void;
  fieldMap?: FieldMap<Path<TFieldValues>>;
  messageFieldMap?: MessageFieldMap<Path<TFieldValues>>;
  toastOnlyMessageKeys?: string[];
  generalFieldFallback?: Path<TFieldValues>;
};

type HandleBackendLocalFieldOrToastErrorOptions<TFieldKey extends string> = {
  error: unknown;
  t: TFunction;
  setFieldError: (field: TFieldKey, message?: string) => void;
  setInlineError?: (message: string | null) => void;
  showToast?: (message: string) => void;
  fieldMap?: FieldMap<TFieldKey>;
  messageFieldMap?: MessageFieldMap<TFieldKey>;
  toastOnlyMessageKeys?: string[];
  generalFieldFallback?: TFieldKey;
};

const TOAST_ONLY_CODES = new Set([
  'server_error.general.invalid_request_body',
  'server_error.general.missing_parameter',
  'server_error.general.invalid_parameter',
  'server_error.general.method_not_allowed',
  'server_error.general.validation_failed',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeArgs = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry ?? ''));
};

const normalizeDescriptor = (message: unknown, messageArgs: unknown): BackendMessageDescriptor | null => {
  if (typeof message !== 'string' || !message.trim()) return null;
  return {
    message,
    messageArgs: normalizeArgs(messageArgs),
  };
};

const normalizeFieldErrors = (value: unknown): Record<string, BackendMessageDescriptor> => {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, BackendMessageDescriptor>>((acc, [field, raw]) => {
    if (typeof raw === 'string') {
      acc[field] = { message: raw, messageArgs: [] };
      return acc;
    }

    if (!isRecord(raw)) return acc;

    const descriptor = normalizeDescriptor(raw.message, raw.messageArgs);
    if (descriptor) acc[field] = descriptor;

    return acc;
  }, {});
};

const interpolateIndexedArgs = (value: string, args: string[]) =>
  args.reduce((acc, arg, index) => acc.replace(new RegExp(`\\{${index}\\}|\\{\\{${index}\\}\\}`, 'g'), arg), value);

export const getBackendErrorPayload = (error: unknown): BackendErrorPayload => {
  const anyError = error as any;
  const data = anyError?.response?.data;

  const status =
    typeof data?.status === 'number'
      ? data.status
      : typeof anyError?.response?.status === 'number'
        ? anyError.response.status
        : null;

  return {
    status,
    message: normalizeDescriptor(data?.message, data?.messageArgs),
    errors: normalizeFieldErrors(data?.errors),
    path: typeof data?.path === 'string' ? data.path : null,
    timestamp: typeof data?.timestamp === 'string' ? data.timestamp : null,
  };
};

export const renderBackendMessageDescriptor = (descriptor: BackendMessageDescriptor | null, t: TFunction) => {
  if (!descriptor) return t('state.server_err');
  const translated = t(descriptor.message, { defaultValue: descriptor.message });
  return interpolateIndexedArgs(translated, descriptor.messageArgs);
};

export const getBackendErrorMessage = (error: unknown, t: TFunction) =>
  renderBackendMessageDescriptor(getBackendErrorPayload(error).message, t);

export const shouldToastBackendError = (payload: BackendErrorPayload) => {
  if (!payload.status) return true;
  if (payload.status >= 500) return true;
  if ([404, 405, 409, 422].includes(payload.status)) return true;
  if (payload.message?.message && TOAST_ONLY_CODES.has(payload.message.message)) return true;
  return false;
};

export const shouldInlineBackendError = (payload: BackendErrorPayload) =>
  payload.status !== null && [400, 401, 403].includes(payload.status);

export const getBackendFieldErrors = <TFieldKey extends string>(
  payload: BackendErrorPayload,
  t: TFunction,
  fieldMap?: FieldMap<TFieldKey>
) =>
  Object.entries(payload.errors).reduce<Partial<Record<TFieldKey, string>>>((acc, [field, descriptor]) => {
    const target = (fieldMap?.[field] ?? field) as TFieldKey;
    acc[target] = renderBackendMessageDescriptor(descriptor, t);
    return acc;
  }, {});

export const handleBackendFormError = <TFieldValues extends FieldValues>({
  error,
  t,
  setError,
  setInlineError,
  showToast,
  fieldMap,
  messageFieldMap,
  toastOnlyMessageKeys,
  generalFieldFallback,
}: HandleBackendFormErrorOptions<TFieldValues>) => {
  const payload = getBackendErrorPayload(error);
  const fieldErrors = getBackendFieldErrors(payload, t, fieldMap);

  if (Object.keys(fieldErrors).length > 0) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (typeof message !== 'string') return;
      setError(field as Path<TFieldValues>, {
        type: 'server',
        message,
      });
    });
    setInlineError?.(null);
    return 'field' as const;
  }

  const toastOnly = payload.message?.message ? toastOnlyMessageKeys?.includes(payload.message.message) : false;
  if (toastOnly && payload.message) {
    setInlineError?.(null);
    showToast?.(renderBackendMessageDescriptor(payload.message, t));
    return 'toast' as const;
  }

  const mappedField = payload.message?.message ? messageFieldMap?.[payload.message.message] : null;
  if (mappedField && payload.message) {
    setError(mappedField, {
      type: 'server',
      message: renderBackendMessageDescriptor(payload.message, t),
    });
    setInlineError?.(null);
    return 'field' as const;
  }

  const message = renderBackendMessageDescriptor(payload.message, t);

  if (shouldToastBackendError(payload)) {
    setInlineError?.(null);
    showToast?.(message);
    return 'toast' as const;
  }

  if (payload.message && generalFieldFallback) {
    setInlineError?.(null);
    setError(generalFieldFallback, {
      type: 'server',
      message,
    });
    return 'field' as const;
  }

  if (payload.message && shouldInlineBackendError(payload)) {
    setInlineError?.(message);
    return 'inline' as const;
  }

  setInlineError?.(null);
  showToast?.(message);
  return 'toast' as const;
};

export const handleBackendLocalFieldOrToastError = <TFieldKey extends string>({
  error,
  t,
  setFieldError,
  setInlineError,
  showToast,
  fieldMap,
  messageFieldMap,
  toastOnlyMessageKeys,
  generalFieldFallback,
}: HandleBackendLocalFieldOrToastErrorOptions<TFieldKey>) => {
  const payload = getBackendErrorPayload(error);
  const fieldErrors = getBackendFieldErrors(payload, t, fieldMap);

  if (Object.keys(fieldErrors).length > 0) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (typeof message !== 'string') return;
      setFieldError(field as TFieldKey, message);
    });
    setInlineError?.(null);
    return 'field' as const;
  }

  const toastOnly = payload.message?.message ? toastOnlyMessageKeys?.includes(payload.message.message) : false;
  if (toastOnly && payload.message) {
    setInlineError?.(null);
    showToast?.(renderBackendMessageDescriptor(payload.message, t));
    return 'toast' as const;
  }

  const mappedField = payload.message?.message ? messageFieldMap?.[payload.message.message] : null;
  if (mappedField && payload.message) {
    setFieldError(mappedField, renderBackendMessageDescriptor(payload.message, t));
    setInlineError?.(null);
    return 'field' as const;
  }

  const message = renderBackendMessageDescriptor(payload.message, t);

  if (shouldToastBackendError(payload)) {
    setInlineError?.(null);
    showToast?.(message);
    return 'toast' as const;
  }

  if (payload.message && generalFieldFallback) {
    setInlineError?.(null);
    setFieldError(generalFieldFallback, message);
    return 'field' as const;
  }

  if (payload.message && shouldInlineBackendError(payload)) {
    showToast?.(message);
    return 'toast' as const;
  }

  setInlineError?.(null);
  showToast?.(message);
  return 'toast' as const;
};

export const handleBackendActionError = ({
  error,
  t,
  showToast,
}: {
  error: unknown;
  t: TFunction;
  showToast?: (message: string) => void;
}) => {
  showToast?.(getBackendErrorMessage(error, t));
};
