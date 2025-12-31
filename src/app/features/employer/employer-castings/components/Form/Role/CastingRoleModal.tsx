import { Button, FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextareaField } from '../../../../../../shared/components/Form';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { MultiSelectDropdown } from '../../../../../talent-database/components/Filter';
import { getCastingRoleSchema, type CastingRoleFormKey, type CastingRoleFormValues } from '../../../schemas/formSchema';
import type { EmployerCastingRoleCardResponse } from '../../../types/employerCastings.types';

export type DraftCastingRole = {
  id?: string;
  rolesSectionId: string;
  roleName: string;
  roleTypeId: string;
  genderId: string;
  ageMin: number;
  ageMax: number;
  description: string;
  professionIds: string[];
};

type DraftCastingRoleForm = Omit<DraftCastingRole, 'ageMin' | 'ageMax'> & {
  ageMin: string;
  ageMax: string;
};

type Props = {
  mode: 'create' | 'edit';
  initial?: EmployerCastingRoleCardResponse;
  onSave: (draft: DraftCastingRole) => Promise<void> | void;
  onCancel: () => void;
  sectionId: string;
};

export default function CastingRoleModal({ mode, initial, onSave, onCancel, sectionId }: Props) {
  const { t } = useTranslation();
  const castingRoleSchema = useMemo(() => getCastingRoleSchema(t), [t]);

  const roleTypeOptions = useCachedSiteMetadataOption('roleTypeOptions', t);
  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const professionsRaw = useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined;

  const makeEmpty = (): DraftCastingRoleForm => ({
    rolesSectionId: sectionId,
    roleName: '',
    roleTypeId: '',
    genderId: '',
    ageMin: '',
    ageMax: '',
    professionIds: [],
    description: '',
  });

  const makeFromInitial = (r?: EmployerCastingRoleCardResponse): DraftCastingRoleForm =>
    r
      ? {
          id: r.id,
          rolesSectionId: sectionId,
          roleName: r.roleName ?? '',
          roleTypeId: r.roleType?.id ?? '',
          genderId: r.gender?.id ?? '',
          ageMin: r.ageMin != null ? String(r.ageMin) : '',
          ageMax: r.ageMax != null ? String(r.ageMax) : '',
          description: r.description ?? '',
          professionIds: (r.professions ?? []).map((p) => p.id),
        }
      : makeEmpty();

  const [form, setForm] = useState<DraftCastingRoleForm>(() =>
    mode === 'edit' ? makeFromInitial(initial) : makeEmpty()
  );
  const [errors, setErrors] = useState<Partial<Record<CastingRoleFormKey, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id, sectionId]);

  const onChange = <K extends keyof DraftCastingRoleForm>(k: K, v: DraftCastingRoleForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));

    const mapKey = ((): CastingRoleFormKey | null => {
      if (k === 'rolesSectionId') return 'rolesSectionId';
      if (k === 'roleName') return 'roleName';
      if (k === 'roleTypeId') return 'roleType';
      if (k === 'genderId') return 'gender';
      if (k === 'ageMin') return 'ageMin';
      if (k === 'ageMax') return 'ageMax';
      if (k === 'professionIds') return 'professionIds';
      if (k === 'description') return 'description';
      return null;
    })();

    if (mapKey) setErrors((e) => ({ ...e, [mapKey]: undefined }));
  };

  const onAgeChange =
    (k: 'ageMin' | 'ageMax'): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
      onChange(k, digits);
    };

  const toIntOrNaN = (s: string) => Number.parseInt(s, 10);

  const validateAndSave = async () => {
    const rawForSchema: CastingRoleFormValues = {
      rolesSectionId: form.rolesSectionId,
      roleName: form.roleName,
      roleType: form.roleTypeId,
      gender: form.genderId,
      ageMin: toIntOrNaN(form.ageMin),
      ageMax: toIntOrNaN(form.ageMax),
      professionIds: form.professionIds,
      description: form.description,
    };

    const parsed = castingRoleSchema.safeParse(rawForSchema);

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors as Partial<Record<CastingRoleFormKey, string[]>>;
      const fieldErrors: Partial<Record<CastingRoleFormKey, string>> = {};
      (Object.keys(flat) as CastingRoleFormKey[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }

    await onSave({
      ...form,
      ageMin: parsed.data.ageMin,
      ageMax: parsed.data.ageMax,
    });
  };

  return (
    <article className="flex flex-col">
      <FormInputField
        id="roleName"
        label={t('employer_castings.dashboard.roles.role.role_name')}
        labelClassName="font-semibold"
        required
        placeholder={t('general.placeholder.role_name')}
        value={form.roleName}
        onChange={(e) => onChange('roleName', e.target.value)}
        error={errors.roleName}
      />

      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-semibold">{t('talent.filter.basic_info.profession')}</label>
        <MultiSelectDropdown
          options={professionsRaw ?? []}
          getId={(p) => p.id}
          getLabel={(p) => t(p.stringCode)}
          selected={form.professionIds}
          onChange={(next) => onChange('professionIds', next)}
          maxPanelHeight="16rem"
        />
      </div>

      <FormSelectField
        id="roleTypeId"
        label={t('casting-database.filter.role_type')}
        labelClassName="font-semibold"
        required
        placeholder={t('general.placeholder.select')}
        value={form.roleTypeId}
        onChange={(e) => onChange('roleTypeId', e.target.value)}
        options={roleTypeOptions}
        error={errors.roleType}
      />

      <FormSelectField
        id="genderId"
        label={t('profile.basic_info.gender')}
        labelClassName="font-semibold"
        required
        placeholder={t('general.placeholder.select')}
        value={form.genderId}
        onChange={(e) => onChange('genderId', e.target.value)}
        options={genderOptions}
        error={errors.gender}
      />

      <div className="flex flex-col">
        <label htmlFor="ageMin" className="text-sm font-semibold mb-2">
          {t('talent.filter.basic_info.age_range')}
        </label>
        <div className="flex flex-row gap-4">
          <FormInputField
            id="ageMin"
            inputMode="numeric"
            placeholder={t('general.placeholder.min')}
            value={form.ageMin}
            onChange={onAgeChange('ageMin')}
            error={errors.ageMin}
          />
          <FormInputField
            id="ageMax"
            inputMode="numeric"
            placeholder={t('general.placeholder.max')}
            value={form.ageMax}
            onChange={onAgeChange('ageMax')}
            error={errors.ageMax}
          />
        </div>
      </div>

      <TextareaField
        id="description"
        label={t('general.placeholder.description')}
        placeholder={t('general.placeholder.about')}
        value={form.description}
        onChange={(e) => onChange('description', e.target.value)}
        onBlur={() => null}
        onKeyDown={() => null}
        error={errors.description}
      />

      <Separator className="opacity-20 my-6" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={validateAndSave}>{t('buttons.save')}</Button>
      </div>
    </article>
  );
}
