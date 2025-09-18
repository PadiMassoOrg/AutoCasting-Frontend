import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { educationSchema } from '../../../schemas/profileSchema';
import type { Education } from '../../../types/profile.types';

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

const EducationModal = ({ mode, initial, onSave, onCancel }: Props) => {
  const { t } = useTranslation();

  const makeEmpty = (): DraftEducation => ({
    institution: '',
    courseName: '',
    graduationYear: '',
  });

  // TODO - Verify Constraints and ZOD usage.
  // Textos - Max 50 chars
  // Año - 4 digits

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
  const [errors, setErrors] = useState<Partial<Record<keyof DraftEducation, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id]);

  const onChange = <K extends keyof DraftEducation>(k: K, v: DraftEducation[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onYearChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    onChange('graduationYear', digits);
  };

  const validateAndSave = async () => {
    const parsed = educationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof DraftEducation, string>> = {};
      const flat = parsed.error.flatten().fieldErrors;
      (Object.keys(flat) as (keyof DraftEducation)[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }
    await onSave(parsed.data);
  };

  return (
    <article className="flex flex-col gap-4">
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
        error={errors.courseName}
      />
      <FormInputField
        id="graduationYear"
        label={t('profile.education.graduationYear')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.education.graduationYear_placeholder')}
        value={form.graduationYear}
        onChange={onYearChange}
        inputMode="numeric"
        pattern="[0-9]*"
        error={errors.graduationYear}
      />
      <Separator className="opacity-20 mb-6" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={validateAndSave}>{t('buttons.save')}</Button>
      </div>
    </article>
  );
};

export default EducationModal;
