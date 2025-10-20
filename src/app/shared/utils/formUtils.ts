import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from 'react';

export const onInput =
  (fn: (v: string) => void): ChangeEventHandler<HTMLInputElement> =>
  (e) =>
    fn(e.target.value);

export const onSelect =
  (fn: (v: string) => void): ChangeEventHandler<HTMLSelectElement> =>
  (e) =>
    fn(e.target.value);

export const onCheckbox =
  (fn: (v: boolean) => void): React.ChangeEventHandler<HTMLInputElement> =>
  (e) =>
    fn(e.target.checked);

export const onNumberText =
  (fn: (v: string) => void): React.ChangeEventHandler<HTMLInputElement> =>
  (e) =>
    fn(e.target.value);

export const onUuidSelect =
  (fn: (v: string | null) => void): React.ChangeEventHandler<HTMLSelectElement> =>
  (e) => {
    const raw = e.target.value;
    fn(raw && raw.trim().length > 0 ? raw : null);
  };

export const commitOnEnter =
  (commit: () => void): KeyboardEventHandler<HTMLInputElement> =>
  (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  };

export const commitOnBlur =
  (commit: () => void): FocusEventHandler<any> =>
  () =>
    commit();

export function useCommittedText(initial: string, commitFn: (v: string) => void, opts?: { trim?: boolean }) {
  const [value, setValue] = useState(initial ?? '');
  const last = useRef(initial ?? '');
  const commit = useCallback(() => {
    const v = opts?.trim ? value.trim() : value;
    if (v !== last.current) {
      last.current = v;
      commitFn(v);
    }
  }, [value, commitFn, opts?.trim]);

  return {
    value,
    setValue,
    onChange: onInput(setValue),
    onBlur: commitOnBlur(commit),
    onKeyDown: commitOnEnter(commit),
    commit, // por si lo necesitas manual
  };
}

export function useIsoDateField(
  initialISO: string | null | undefined,
  commitFn: (iso: string) => void,
  debounceMs = 600
) {
  const { year: y0, month: m0, day: d0 } = parseISO(initialISO ?? '');
  const [year, setYear] = useState(y0);
  const [month, setMonth] = useState(m0);
  const [day, setDay] = useState(d0);

  const debounce = useRef<number | null>(null);
  const clear = () => {
    if (debounce.current) {
      window.clearTimeout(debounce.current);
      debounce.current = null;
    }
  };

  const commit = useCallback(
    (Y: string, M: string, D: string) => {
      if (Y && M && D && isValidDate(Y, M, D)) commitFn(`${Y}-${M}-${D}`);
    },
    [commitFn]
  );

  const schedule = useCallback(
    (Y: string, M: string, D: string) => {
      clear();
      debounce.current = window.setTimeout(() => commit(Y, M, D), debounceMs);
    },
    [commit, debounceMs]
  );

  const onYear = useCallback(
    (v: string) => {
      setYear(v);
      schedule(v, month, day);
    },
    [month, day, schedule]
  );
  const onMonth = useCallback(
    (v: string) => {
      setMonth(v);
      schedule(year, v, day);
    },
    [year, day, schedule]
  );
  const onDay = useCallback(
    (v: string) => {
      setDay(v);
      schedule(year, month, v);
    },
    [year, month, schedule]
  );

  const onAnyBlur: FocusEventHandler<HTMLSelectElement> = () => {
    clear();
    commit(year, month, day);
  };

  const daysInThisMonth = getDaysInMonth(year, month);
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInThisMonth }, (_, i) => {
        const d = i + 1;
        return { value: String(d).padStart(2, '0'), label: String(d) };
      }),
    [daysInThisMonth]
  );

  return {
    year,
    month,
    day,
    setYear,
    setMonth,
    setDay,
    onYear,
    onMonth,
    onDay,
    onAnyBlur,
    dayOptions,
  };
}

export function useToggleSet<T>(initial: T[], onChange?: (next: T[]) => void) {
  const [set, setSet] = useState<T[]>(initial ?? []);
  const toggle = useCallback(
    (item: T) => {
      const has = set.includes(item);
      const next = has ? set.filter((x) => x !== item) : [...set, item];
      setSet(next);
      onChange?.(next);
    },
    [set, onChange]
  );
  return { values: set, toggle, setValues: setSet };
}

type UseCommittedIntOpts = {
  min?: number;
  max?: number;
  allowNull?: boolean;
  debounceMs?: number;
};

export function useCommittedInt(
  initial: number | null | undefined,
  commitFn: (v: number | null) => void,
  opts?: UseCommittedIntOpts
) {
  const [value, setValue] = useState(initial == null ? '' : String(Math.trunc(initial)));
  const last = useRef<number | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<number | null>(null);

  const clearDebounce = () => {
    if (debounce.current) {
      window.clearTimeout(debounce.current);
      debounce.current = null;
    }
  };

  const parseCommitValue = useCallback((): { ok: boolean; value: number | null; err?: string } => {
    const s = value.trim();

    if (s === '') {
      if (opts?.allowNull) return { ok: true, value: null };
      return { ok: false, value: null, err: 'Requerido' };
    }

    if (!/^[+-]?\d+$/.test(s)) return { ok: false, value: null, err: 'Número inválido' };

    let n = Number(s);
    if (!Number.isFinite(n)) return { ok: false, value: null, err: 'Número inválido' };

    n = Math.trunc(n);

    if (opts?.min != null && n < opts.min) return { ok: false, value: null, err: `Min ${opts.min}` };
    if (opts?.max != null && n > opts.max) return { ok: false, value: null, err: `Max ${opts.max}` };

    return { ok: true, value: n };
  }, [value, opts?.allowNull, opts?.min, opts?.max]);

  const doCommit = useCallback(() => {
    const { ok, value, err } = parseCommitValue();
    setError(err ?? null);
    if (!ok) return;

    const same = value === last.current || (value == null && last.current == null);

    if (!same) {
      last.current = value;
      commitFn(value);
    }
  }, [commitFn, parseCommitValue]);

  const commit = useCallback(() => {
    clearDebounce();
    doCommit();
  }, [doCommit]);

  const schedule = useCallback(() => {
    clearDebounce();
    if (opts?.debounceMs && opts.debounceMs > 0) {
      debounce.current = window.setTimeout(doCommit, opts.debounceMs);
    }
  }, [doCommit, opts?.debounceMs]);

  return {
    value,
    setValue,
    error,
    onChange: onNumberText((s) => {
      setValue(s);
      if (opts?.debounceMs) schedule();
    }),
    onBlur: commitOnBlur(commit),
    onKeyDown: commitOnEnter(commit),
    commit,
  };
}

export function useCommittedBoolean(initial: boolean | null | undefined, commitFn: (v: boolean) => void) {
  const safeInitial = initial ?? false;
  const [value, setValue] = useState<string>(String(safeInitial));
  const last = useRef<boolean>(safeInitial);

  useEffect(() => {
    const next = initial ?? false;
    if (next !== last.current) {
      last.current = next;
      setValue(String(next));
    }
  }, [initial]);

  const commitIfChanged = useCallback(
    (raw: string) => {
      const out = raw === 'true';
      if (out !== last.current) {
        last.current = out;
        commitFn(out);
      }
    },
    [commitFn]
  );

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      setValue(v);
      commitIfChanged(v);
    },
    onBlur: () => {
      // Blank on purpose
      // no-op para evitar la doble llamada
    },
  };
}

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type UseCommittedUuidOpts = { allowNull?: boolean };

export function useCommittedUuid(
  initial: string | null | undefined,
  commitFn: (v: string | null) => void,
  opts?: UseCommittedUuidOpts
) {
  const [value, setValue] = useState<string>(initial ?? '');
  const last = useRef<string | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);

  const commit = useCallback(
    (raw?: string) => {
      const v = (raw ?? value).trim();
      const out = v === '' ? null : v;

      if (out === null && !opts?.allowNull) {
        setError('Requerido');
        return;
      }
      if (out !== null && !UUID_RX.test(out)) {
        setError('UUID inválido');
        return;
      }
      setError(null);

      const same = out === last.current;
      if (!same) {
        last.current = out;
        commitFn(out);
      }
    },
    [value, commitFn, opts?.allowNull]
  );

  return {
    value,
    setValue,
    error,
    onChange: onUuidSelect((v) => {
      setValue(v ?? '');
      commit(v ?? '');
    }),
    onBlur: commitOnBlur(() => commit()),
  };
}

// TODO - Move Helpers
function parseISO(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return { year: '', month: '', day: '' };
  return { year: m[1], month: m[2], day: m[3] };
}
function getDaysInMonth(year: string, month: string) {
  const y = Number(year || '2000');
  const m = Number(month || '1');
  return new Date(y, m, 0).getDate();
}
function isValidDate(y: string, m: string, d: string) {
  const yy = Number(y),
    mm = Number(m),
    dd = Number(d);
  if (!yy || !mm || !dd) return false;
  const dt = new Date(yy, mm - 1, dd);
  return dt.getFullYear() === yy && dt.getMonth() + 1 === mm && dt.getDate() === dd;
}
