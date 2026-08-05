import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePendingAction } from 'autocasting-ui-library-padimasso';
import { getEducationSchema, type EducationFormKey, type EducationFormValues } from '../../../schemas/formSchema';
import type { Education } from '../../../types/talentProfile.types';

export type DraftEducation = {
  id?: string;
  institution: string;
  courseName: string;
  graduationYear: string;
};

type Props = {
  mode: 'create' | 'edit';
  initial?: Education;
  onSave: (draft: DraftEducation) => Promise<void> | void;
  onCancel: () => void;
};

const SCHEMA_KEYS = ['institution', 'courseName', 'graduationYear'] as const;

const EducationModal = ({ mode, initial, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const educationSchema = useMemo(() => getEducationSchema(t), [t]);
  const { isPending, execute } = usePendingAction();

  const makeEmpty = (): DraftEducation => ({
    institution: '',
    courseName: '',
    graduationYear: '',
  });

  const makeFromInitial = (c?: Education): DraftEducation =>
    c
      ? {
          id: c.id,
          institution: c.institution ?? '',
          courseName: c.courseName ?? '',
          graduationYear: c.graduationYear ?? '',
        }
      : makeEmpty();

  const [form, setForm] = useState<DraftEducation>(() => (mode === 'edit' ? makeFromInitial(initial) : makeEmpty()));
  const [errors, setErrors] = useState<Partial<Record<EducationFormKey, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id]);

  const onChange = <K extends keyof DraftEducation>(k: K, v: DraftEducation[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if ((SCHEMA_KEYS as readonly string[]).includes(k as string)) {
      setErrors((e) => ({ ...e, [k as EducationFormKey]: undefined }));
    }
  };

  const onYearChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    onChange('graduationYear', digits);
  };

  const validateAndSave = async () => {
    const raw: EducationFormValues = {
      institution: form.institution,
      courseName: form.courseName,
      graduationYear: form.graduationYear,
    };

    const parsed = educationSchema.safeParse(raw);

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors as Partial<Record<EducationFormKey, string[]>>;
      const fieldErrors: Partial<Record<EducationFormKey, string>> = {};
      (Object.keys(flat) as EducationFormKey[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }

    await execute(() =>
      onSave({
        ...form,
        institution: parsed.data.institution,
        courseName: parsed.data.courseName,
        graduationYear: parsed.data.graduationYear,
      })
    );
  };

  return (
    <article className="flex flex-col">
      <FormInputField
        id="institution"
        label={t('profile.education.institution')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.education.institution_placeholder')}
        value={form.institution}
        onChange={(e) => onChange('institution', e.target.value)}
        error={errors.institution}
      />

      <FormInputField
        id="courseName"
        label={t('profile.education.courseName')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.education.courseName_placeholder')}
        value={form.courseName}
        onChange={(e) => onChange('courseName', e.target.value)}
        // pattern="[A-Za-zÀ-ÿ0-9 ]*"
        error={errors.courseName}
      />

      <FormInputField
        id="graduationYear"
        label={t('profile.education.graduationYear')}
        labelClassName="font-semibold"
        required
        placeholder={t('general.placeholder.year_example')}
        value={form.graduationYear}
        onChange={onYearChange}
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        error={errors.graduationYear}
      />

      <Separator className="opacity-20 mb-6" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={validateAndSave} loading={isPending}>
          {t('buttons.save')}
        </Button>
      </div>
    </article>
  );
};

export default EducationModal;
