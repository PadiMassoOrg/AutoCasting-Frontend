import { Button, FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataOption } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { Credit } from '../../../../types/profile.types';

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

  // años (últimos 60 por ejemplo)
  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 60 }, (_, i) => {
      const yy = String(y - i);
      return { value: yy, label: yy };
    });
  }, []);

  const [form, setForm] = useState<DraftCredit>(() => ({
    id: initial?.id,
    productionTypeId: initial?.productionType?.id ?? '',
    projectName: initial?.projectName ?? '',
    producerName: initial?.producerName ?? '',
    role: initial?.role ?? '',
    year: initial?.year ?? '',
  }));

  const canSave =
    form.productionTypeId.trim() &&
    form.projectName.trim() &&
    form.producerName.trim() &&
    form.role.trim() &&
    form.year.trim();

  const onChange = <K extends keyof DraftCredit>(k: K, v: DraftCredit[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!canSave) return;
    await onSave(form);
  };

  return (
    <article className="flex flex-col gap-6">
      <FormSelectField
        id="productionType"
        label={t('profile.credits.production_type')}
        placeholder={t('profile.credits.production_type_placeholder')}
        value={form.productionTypeId}
        onChange={(e) => onChange('productionTypeId', e.target.value)}
        options={productionTypeOptions}
      />
      <FormInputField
        id="projectName"
        label={t('profile.credits.project')}
        placeholder={t('profile.credits.project_placeholder')}
        value={form.projectName}
        onChange={(e) => onChange('projectName', e.target.value)}
      />
      <FormInputField
        id="producerName"
        label={t('profile.credits.director')}
        placeholder={t('profile.credits.director_placeholder')}
        value={form.producerName}
        onChange={(e) => onChange('producerName', e.target.value)}
      />
      <FormInputField
        id="role"
        label={t('profile.credits.role')}
        placeholder={t('profile.credits.role_placeholder')}
        value={form.role}
        onChange={(e) => onChange('role', e.target.value)}
      />
      <FormSelectField
        id="year"
        label={t('profile.credits.year')}
        placeholder="--"
        value={form.year}
        onChange={(e) => onChange('year', e.target.value)}
        options={yearOptions}
      />
      <Separator className="opacity-20" />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={submit} disabled={!canSave}>
          {t('buttons.save')}
        </Button>
      </div>
    </article>
  );
}
