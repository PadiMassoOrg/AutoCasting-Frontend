import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileBasicInfo } from '../../../types/profile.types';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useBasicInfoAutosave } from '../../../hooks/autosaves';

export default function BasicInfoForm({
  data,
  professionsMeta,
}: {
  data: ProfileBasicInfo;
  professionsMeta: SiteMetadataObject[];
}) {
  const { t, i18n } = useTranslation();

  const [stageName, setStageName] = useState(data.stageName ?? '');
  const [gender, setGender] = useState(data.gender ?? '');
  const [professions, setProfessions] = useState<string[]>((data.professions ?? []).map((p) => p.id));

  const parsed = parseISO(data.birthDate ?? '');
  const [bYear, setBYear] = useState(parsed.year);
  const [bMonth, setBMonth] = useState(parsed.month);
  const [bDay, setBDay] = useState(parsed.day);

  const basicInfoAutosave = useBasicInfoAutosave();

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
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      return { value: String(m).padStart(2, '0'), label: capitalize(fmt.format(new Date(2000, i, 1))) };
    });
  }, [i18n.language]);

  const daysInThisMonth = getDaysInMonth(bYear, bMonth);
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInThisMonth }, (_, i) => {
        const d = i + 1;
        return { value: String(d).padStart(2, '0'), label: String(d) };
      }),
    [daysInThisMonth]
  );

  useEffect(() => {
    if (bDay && Number(bDay) > daysInThisMonth) setBDay('');
  }, [daysInThisMonth, bDay]);

  const onStageNameChange = useCallback(
    (v: string) => {
      setStageName(v);
      basicInfoAutosave.schedule({ stageName: v });
    },
    [basicInfoAutosave]
  );

  const onGenderChange = useCallback(
    (v: string) => {
      setGender(v);
      basicInfoAutosave.immediate({ gender: v });
    },
    [basicInfoAutosave]
  );

  const tryScheduleBirthSave = (y: string, m: string, d: string) => {
    if (y && m && d && isValidDate(y, m, d)) {
      basicInfoAutosave.schedule({ birthDate: `${y}-${m}-${d}` });
    }
  };

  const onYearChange = useCallback(
    (v: string) => {
      setBYear(v);
      tryScheduleBirthSave(v, bMonth, bDay);
    },
    [bMonth, bDay]
  );

  const onMonthChange = useCallback(
    (v: string) => {
      setBMonth(v);
      tryScheduleBirthSave(bYear, v, bDay);
    },
    [bYear, bDay]
  );

  const onDayChange = useCallback(
    (v: string) => {
      setBDay(v);
      tryScheduleBirthSave(bYear, bMonth, v);
    },
    [bYear, bMonth]
  );

  const toggleProfession = (id: string) => {
    setProfessions((curr) => {
      const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
      basicInfoAutosave.immediate({ professionIds: next });
      return next;
    });
  };

  useEffect(() => basicInfoAutosave.flush, [basicInfoAutosave.flush]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base">{t('profile.basic_info.basic_info')}</h3>
      </div>

      <FormInputField
        id="stageName"
        label={t('profile.basic_info.artistic_name')}
        labelClassName="font-semibold text-base"
        value={stageName}
        onChange={(e) => onStageNameChange(e.target.value)}
        onBlur={() => basicInfoAutosave.flush()}
        placeholder={t('general.placeholder.stage_name')}
      />

      <FormSelectField
        id="gender"
        label={t('profile.basic_info.gender')}
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        placeholder={t('general.placeholder.select')}
        options={[
          { value: 'gender.female', label: t('sitemetadata.gender.female') },
          { value: 'gender.male', label: t('sitemetadata.gender.male') },
          { value: 'gender.other', label: t('sitemetadata.gender.other') },
        ]}
      />

      <div className="flex flex-col gap-2">
        <Label className="text-sm mb-2 block">{t('profile.basic_info.birth_date')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <FormSelectField
            id="birth-day"
            value={bDay}
            onChange={(e) => onDayChange(e.target.value)}
            onBlur={() => basicInfoAutosave.flush()}
            placeholder={t('general.placeholder.day')}
            options={dayOptions}
          />
          <FormSelectField
            id="birth-month"
            value={bMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            onBlur={() => basicInfoAutosave.flush()}
            placeholder={t('general.placeholder.month')}
            options={monthOptions}
          />
          <FormSelectField
            id="birth-year"
            value={bYear}
            onChange={(e) => onYearChange(e.target.value)}
            onBlur={() => basicInfoAutosave.flush()}
            placeholder={t('general.placeholder.year')}
            options={yearOptions}
          />
        </div>
      </div>

      {/* Profesión */}
      <div>
        <label className="text-sm mb-2 block">{t('profile.basic_info.profession')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {professionsMeta.map((p) => {
            const active = professions.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProfession(p.id)}
                className={[
                  'w-full px-3 py-2 rounded-xl text-sm text-center',
                  'truncate whitespace-nowrap',
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
