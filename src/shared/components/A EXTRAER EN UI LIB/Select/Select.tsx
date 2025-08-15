import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string;
  label: string; // ya traducido
  disabled?: boolean;
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'multiple' | 'size'> & {
  options?: SelectOption[];
  placeholder?: string; // se muestra cuando value === '' (y hay opción con value="")
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            // mismo “look & feel” que tu Input
            'w-full h-14 rounded-xl px-6 pr-10 text-base',
            'bg-[var(--color-secondary-offwhite)]',
            'placeholder:text-gray-400 placeholder:font-light',
            'border-0 focus:outline-none focus:ring-2 focus:ring-black/10',
            'appearance-none', // esconde la flecha nativa
            className
          )}
          {...props}
        >
          {placeholder && (
            // value="" permite que actúe como placeholder controlado
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            : children}
        </select>

        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
