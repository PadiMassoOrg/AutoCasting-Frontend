import React from 'react';
import type { SelectOption } from '../Select/Select';
import { Label } from 'autocasting-ui-library-padimasso';
import Select from '../Select/Select';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label?: string;
  error?: string;
  placeholder?: string;
  options?: SelectOption[];
};

const FormSelectField = ({ id, label, error, placeholder, options, className, ...props }: Props) => {
  return (
    <div className="w-full flex flex-col">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={className}
        placeholder={placeholder}
        options={options}
        {...props}
      />

      {error && (
        <Label id={`${id}-error`} variant="error" className="mt-0.5 pl-0.5">
          {error}
        </Label>
      )}
    </div>
  );
};

export default FormSelectField;
