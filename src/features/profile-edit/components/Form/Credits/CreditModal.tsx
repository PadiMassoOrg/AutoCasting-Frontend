import { Button, FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { creaditSchema } from '../../../schemas/profileSchema';
import type { Credit } from '../../../types/profile.types';

export type DraftCredit = {
  id?: string;
  productionTypeId: string;
  projectName: string;
  producerName: string;
  role: string;
  year: string;
};

type Props = {
  mode: 'create' | 'edit';
  initial?: Credit;
  onSave: (draft: DraftCredit) => Promise<void> | void;
  onCancel: () => void;
};

export default function CreditModal({ mode, initial, onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const productionTypeOptions = useCachedSiteMetadataOption('productionTypeOptions', t);

  const makeEmpty = (): DraftCredit => ({
    productionTypeId: '',
    projectName: '',
    producerName: '',
    role: '',
    year: '',
  });

  const makeFromInitial = (c?: Credit): DraftCredit =>
    c
      ? {
          id: c.id,
          productionTypeId: c.productionType?.id ?? '',
          projectName: c.projectName ?? '',
          producerName: c.producerName ?? '',
          role: c.role ?? '',
          year: c.year ?? '',
        }
      : makeEmpty();

  const [form, setForm] = useState<DraftCredit>(() => (mode === 'edit' ? makeFromInitial(initial) : makeEmpty()));
  const [errors, setErrors] = useState<Partial<Record<keyof DraftCredit, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id]);

  const onChange = <K extends keyof DraftCredit>(k: K, v: DraftCredit[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onYearChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    onChange('year', digits);
  };

  const validateAndSave = async () => {
    const parsed = creaditSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof DraftCredit, string>> = {};
      const flat = parsed.error.flatten().fieldErrors;
      (Object.keys(flat) as (keyof DraftCredit)[]).forEach((k) => {
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
      <FormSelectField
        id="productionType"
        label={t('profile.credits.production_type')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.credits.production_type_placeholder')}
        value={form.productionTypeId}
        onChange={(e) => onChange('productionTypeId', e.target.value)}
        options={productionTypeOptions}
        error={errors.productionTypeId}
      />
      <FormInputField
        id="projectName"
        label={t('profile.credits.project')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.credits.project_placeholder')}
        value={form.projectName}
        onChange={(e) => onChange('projectName', e.target.value)}
        error={errors.projectName}
      />
      <FormInputField
        id="producerName"
        label={t('profile.credits.director')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.credits.director_placeholder')}
        value={form.producerName}
        onChange={(e) => onChange('producerName', e.target.value)}
        error={errors.producerName}
      />
      <FormInputField
        id="role"
        label={t('profile.credits.role')}
        labelClassName="font-semibold"
        required
        placeholder={t('profile.credits.role_placeholder')}
        value={form.role}
        onChange={(e) => onChange('role', e.target.value)}
        error={errors.role}
      />
      <FormInputField
        id="year"
        label={t('profile.credits.year')}
        labelClassName="font-semibold"
        required
        placeholder="1989"
        value={form.year}
        onChange={onYearChange}
        inputMode="numeric"
        pattern="[0-9]*"
        error={errors.year}
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
}
