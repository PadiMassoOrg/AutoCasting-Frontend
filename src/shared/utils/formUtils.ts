import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from 'react';

// ---- wrappers mínimos para eventos ----
export const onInput =
  (fn: (v: string) => void): ChangeEventHandler<HTMLInputElement> =>
  (e) =>
    fn(e.target.value);

export const onSelect =
  (fn: (v: string) => void): ChangeEventHandler<HTMLSelectElement> =>
  (e) =>
    fn(e.target.value);

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

// ---- texto con confirmación (blur/Enter) y anti-doble envío ----
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

// ---- helper fecha ISO con debounce y validación ----
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

// ---- sets toggleables (p. ej. profesiones) ----
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

/* ---------- helpers internos fecha ---------- */
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
