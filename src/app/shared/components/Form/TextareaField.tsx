import { Label } from 'autocasting-ui-library-padimasso';
import type { TextareaHTMLAttributes } from 'react';

type AnyChangeHandler = (e: any) => void;
type AnyFocusHandler = (e: any) => void;
type AnyKeyHandler = (e: any) => void;

export type TextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'onBlur' | 'onKeyDown' | 'required'
> & {
  id: string;
  label?: string;
  value: string;

  /**
   * We intentionally allow "any" handlers to stay compatible with hooks that were typed for <input>.
   * (e.g. useCommittedText returning ChangeEventHandler<HTMLInputElement>).
   */
  onChange: AnyChangeHandler;
  onBlur?: AnyFocusHandler;
  onKeyDown?: AnyKeyHandler;

  error?: string | null;
  labelClassName?: string;
  wrapperClassName?: string;

  textareaClassName?: string;
  minHeightClassName?: string;

  required?: boolean;
};

export default function TextareaField({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  required = false,

  labelClassName = 'text-sm font-semibold',
  wrapperClassName = 'flex flex-col gap-1',
  textareaClassName,
  minHeightClassName = 'min-h-36',

  onBlur,
  onKeyDown,
  ...rest
}: TextareaFieldProps) {
  const base = `
      w-full ${minHeightClassName} px-5 py-2.5 rounded-xl text-base
      placeholder:text-[var(--color-secondary-grey)] placeholder:font-light placeholder:text-sm
      border border-[var(--color-secondary-outline)]
      focus:outline-none focus:ring-0 focus:border-[var(--color-primary-black)]
      disabled:bg-[var(--color-secondary-offwhite)] disabled:cursor-not-allowed
      transition-colors
    `
    .replace(/\s+/g, ' ')
    .trim();

  const cls = [base, textareaClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      {label ? (
        <Label className={labelClassName} htmlFor={id}>
          {label}
          {required ? (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <textarea
        id={id}
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange as any}
        onBlur={onBlur as any}
        onKeyDown={onKeyDown as any}
        {...rest}
      />

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </div>
  );
}
