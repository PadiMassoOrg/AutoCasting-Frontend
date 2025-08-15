import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileBasicInfo } from '../../../types/profile.types';
import { FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useBasicInfoAutosave } from '../../../hooks/autosaves';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';

export default function BasicInfoForm({
  data,
  professionsMeta,
}: {
  data: ProfileBasicInfo;
  professionsMeta: SiteMetadataObject[];
}) {
  const { t, i18n } = useTranslation();
  const basicInfoAutosave = useBasicInfoAutosave();

  // Local State
  const [stageName, setStageName] = useState(data.stageName ?? '');

  const [gender, setGender] = useState(data.gender ?? '');

  const parsed = parseISO(data.birthDate ?? '');
  const [bYear, setBYear] = useState(parsed.year);
  const [bMonth, setBMonth] = useState(parsed.month);
  const [bDay, setBDay] = useState(parsed.day);

  const [professions, setProfessions] = useState<string[]>((data.professions ?? []).map((p) => p.id));

  const lastCommittedStageName = useRef<string>(data.stageName ?? '');
  const lastCommittedBirth = useRef<string>(data.birthDate ?? '');

  // Stage Name
  const commitStageName = useCallback(() => {
    const trimmed = stageName.trim();
    if (trimmed && trimmed !== lastCommittedStageName.current) {
      lastCommittedStageName.current = trimmed; // evita doble envío
      basicInfoAutosave.immediate({ stageName: trimmed });
    }
  }, [stageName, basicInfoAutosave]);

  const onStageNameChange = useCallback((v: string) => {
    setStageName(v);
  }, []);

  // Gender
  const onGenderChange = useCallback(
    (v: string) => {
      setGender(v);
      basicInfoAutosave.immediate({ gender: v });
    },
    [basicInfoAutosave]
  );

  // Date
  const daysInThisMonth = getDaysInMonth(bYear, bMonth);
  if (bDay && Number(bDay) > daysInThisMonth) {
    setBDay('');
  }

  const birthDebounce = useRef<number | null>(null);
  const clearBirthDebounce = () => {
    if (birthDebounce.current) {
      window.clearTimeout(birthDebounce.current);
      birthDebounce.current = null;
    }
  };

  const commitBirth = useCallback(
    (y: string, m: string, d: string) => {
      if (y && m && d && isValidDate(y, m, d)) {
        const iso = `${y}-${m}-${d}`;
        if (iso !== lastCommittedBirth.current) {
          lastCommittedBirth.current = iso;
          basicInfoAutosave.immediate({ birthDate: iso });
        }
      }
    },
    [basicInfoAutosave]
  );

  const scheduleBirth = useCallback(
    (y: string, m: string, d: string) => {
      clearBirthDebounce();
      birthDebounce.current = window.setTimeout(() => commitBirth(y, m, d), 600);
    },
    [commitBirth]
  );

  const onYearChange = useCallback(
    (v: string) => {
      setBYear(v);
      scheduleBirth(v, bMonth, bDay);
    },
    [bMonth, bDay, scheduleBirth]
  );
  const onMonthChange = useCallback(
    (v: string) => {
      setBMonth(v);
      scheduleBirth(bYear, v, bDay);
    },
    [bYear, bDay, scheduleBirth]
  );
  const onDayChange = useCallback(
    (v: string) => {
      setBDay(v);
      scheduleBirth(bYear, bMonth, v);
    },
    [bYear, bMonth, scheduleBirth]
  );

  const onAnyBirthBlur = () => {
    clearBirthDebounce();
    commitBirth(bYear, bMonth, bDay);
  };

  // Profession
  const toggleProfession = (id: string) => {
    setProfessions((curr) => {
      const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
      basicInfoAutosave.immediate({ professionIds: next });
      return next;
    });
  };

  // Selects
  const YEAR_START = 1900;
  const YEAR_END = new Date().getFullYear();

  const yearOptions = useMemo(
    () =>
      Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => {
        const y = String(YEAR_END - i);
        return { value: y, label: y };
      }),
    []
  );

  const monthOptions = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(i18n.language, { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: capitalize(fmt.format(new Date(2000, i, 1))),
    }));
  }, [i18n.language]);

  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInThisMonth }, (_, i) => {
        const d = i + 1;
        return { value: String(d).padStart(2, '0'), label: String(d) };
      }),
    [daysInThisMonth]
  );

  // Handlers del nombre artístico
  const handleStageNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onStageNameChange(e.target.value);
  };

  const handleStageNameKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitStageName();
    }
  };

  const handleStageNameBlur: FocusEventHandler<HTMLInputElement> = () => {
    commitStageName();
  };

  // Handlers de selects
  const handleGenderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    onGenderChange(e.target.value);
  };

  const handleDayChange: ChangeEventHandler<HTMLSelectElement> = (e) => onDayChange(e.target.value);
  const handleMonthChange: ChangeEventHandler<HTMLSelectElement> = (e) => onMonthChange(e.target.value);
  const handleYearChange: ChangeEventHandler<HTMLSelectElement> = (e) => onYearChange(e.target.value);

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.basic_info')}</h3>

      <FormInputField
        id="stageName"
        label={t('profile.basic_info.artistic_name')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.stage_name')}
        value={stageName}
        onChange={handleStageNameChange}
        onBlur={handleStageNameBlur}
        onKeyDown={handleStageNameKeyDown}
      />

      <FormSelectField
        id="gender"
        label={t('profile.basic_info.gender')}
        labelClassName="font-semibold text-base"
        value={gender}
        onChange={handleGenderChange}
        placeholder={t('general.placeholder.select')}
        options={[
          { value: 'gender.female', label: t('sitemetadata.gender.female') },
          { value: 'gender.male', label: t('sitemetadata.gender.male') },
          { value: 'gender.other', label: t('sitemetadata.gender.other') },
        ]}
      />

      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.basic_info.birth_date')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="birth-day"
            value={bDay}
            onChange={handleDayChange}
            onBlur={onAnyBirthBlur}
            placeholder={t('general.placeholder.day')}
            options={dayOptions}
          />
          <FormSelectField
            id="birth-month"
            value={bMonth}
            onChange={handleMonthChange}
            onBlur={onAnyBirthBlur}
            placeholder={t('general.placeholder.month')}
            options={monthOptions}
          />
          <FormSelectField
            id="birth-year"
            value={bYear}
            onChange={handleYearChange}
            onBlur={onAnyBirthBlur}
            placeholder={t('general.placeholder.year')}
            options={yearOptions}
          />
        </div>
      </div>

      {/* Profesión */}
      <div className="flex flex-col gap-2">
        <Label className="text-base font-bold">{t('profile.basic_info.profession')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 place-items-start">
          {professionsMeta.map((p) => {
            const active = professions.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProfession(p.id)}
                className={[
                  'w-full inline-flex items-center justify-center px-6 py-3 rounded-full text-sm text-center cursor-pointer',
                  'whitespace-nowrap',
                  active ? 'bg-black text-white' : 'bg-gray-100',
                ].join(' ')}
                title={t(p.stringCode)}
              >
                {t(p.stringCode)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------- helpers fecha -------------------------- */

function parseISO(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return { year: '', month: '', day: '' };
  return { year: m[1], month: m[2], day: m[3] };
}

function getDaysInMonth(year: string, month: string) {
  const y = Number(year || '2000');
  const m = Number(month || '1'); // 1..12
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

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
