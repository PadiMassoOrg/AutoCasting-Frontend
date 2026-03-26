import { Icon } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from '../../hooks/useDebounceValue';

type Props = {
  value?: string;
  onChange?: (next: string) => void;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function SearchInput({ value, onChange, onCommit, placeholder, className, disabled }: Props) {
  const isControlled = value !== undefined;

  const [inner, setInner] = useState<string>(value ?? '');
  useEffect(() => {
    if (isControlled) setInner(value ?? '');
  }, [isControlled, value]);

  const current = isControlled ? (value ?? '') : inner;

  const debounced = useDebouncedValue(current, 350);
  const committed = useMemo(() => (debounced ?? '').trim(), [debounced]);

  const lastCommittedRef = useRef<string>('');

  useEffect(() => {
    if (committed === lastCommittedRef.current) return;
    lastCommittedRef.current = committed;
    onCommit(committed);
  }, [committed, onCommit]);

  const setValue = (next: string) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const clear = () => setValue('');

  return (
    <div className={['relative w-full', className].filter(Boolean).join(' ')}>
      <input
        type="text"
        value={current}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          'w-full h-10 rounded-full border border-[var(--color-secondary-outline)]',
          'bg-white px-5 text-base outline-none',
          'placeholder:text-[var(--color-secondary-grey-fonts)]',
          'focus:ring-1 focus:ring-[var(--color-primary-purple)]',
          disabled ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') clear();
          if (e.key === 'Enter') {
            const v = current.trim();
            if (v !== lastCommittedRef.current) {
              lastCommittedRef.current = v;
              onCommit(v);
            }
          }
        }}
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Icon name="search" variant="primary" size={18} />
      </div>
    </div>
  );
}
