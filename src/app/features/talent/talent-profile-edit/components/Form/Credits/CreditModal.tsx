import { Button, FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataOption } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { usePendingAction } from 'autocasting-ui-library-padimasso';
import { getCreditSchema, type CreditFormKey, type CreditFormValues } from '../../../schemas/formSchema';
import type { Credit } from '../../../types/talentProfile.types';

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
  const creditSchema = useMemo(() => getCreditSchema(t), [t]);
  const productionTypeOptions = useCachedSiteMetadataOption('productionTypeOptions', t);
  const { isPending, execute } = usePendingAction();

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
  const [errors, setErrors] = useState<Partial<Record<CreditFormKey, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id]);

  const onChange = <K extends keyof DraftCredit>(k: K, v: DraftCredit[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    const mapKey = ((): CreditFormKey | null => {
      if (k === 'productionTypeId') return 'productionType';
      if (k === 'projectName') return 'projectName';
      if (k === 'producerName') return 'producerName';
      if (k === 'role') return 'role';
      if (k === 'year') return 'year';
      return null;
    })();
    if (mapKey) setErrors((e) => ({ ...e, [mapKey]: undefined }));
  };

  const onYearChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    onChange('year', digits);
  };

  const validateAndSave = async () => {
    const rawForSchema: CreditFormValues = {
      productionType: form.productionTypeId,
      projectName: form.projectName,
      producerName: form.producerName,
      role: form.role,
      year: form.year,
    };

    const parsed = creditSchema.safeParse(rawForSchema);

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors as Partial<Record<CreditFormKey, string[]>>;
      const fieldErrors: Partial<Record<CreditFormKey, string>> = {};
      (Object.keys(flat) as CreditFormKey[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }

    await execute(() =>
      onSave({
        ...form,
        projectName: parsed.data.projectName,
        producerName: parsed.data.producerName,
        role: parsed.data.role,
        year: parsed.data.year,
      })
    );
  };

  return (
    <article className="flex flex-col">
      <FormSelectField
        id="productionType"
        label={t('profile.credits.production_type')}
        required
        placeholder={t('profile.credits.production_type_placeholder')}
        value={form.productionTypeId}
        onChange={(e) => onChange('productionTypeId', e.target.value)}
        options={productionTypeOptions}
        error={errors.productionType}
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
        placeholder={t('general.placeholder.year_example')}
        value={form.year}
        onChange={onYearChange}
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        error={errors.year}
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
}
