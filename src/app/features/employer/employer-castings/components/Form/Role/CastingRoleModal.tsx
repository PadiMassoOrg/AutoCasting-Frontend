import { Button, FormInputField, FormSelectField, Label, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextareaField } from '../../../../../../shared/components/Form';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import {
  BooleanRadioGroup,
  FilterSection,
  MultiSelectDropdown,
} from '../../../../../talent-database/components/Filter';
import { getCastingRoleSchema, type CastingRoleFormKey, type CastingRoleFormValues } from '../../../schemas/formSchema';
import type { EmployerCastingRoleCardResponse } from '../../../types/employerCastings.types';

type DraftRoleCharacteristicsForm = {
  heightCm: string;
  ethnicityId: string;
  hairColorId: string;
  eyeColorId: string;
  dietOptionId: string;
  tattoo?: boolean | null;
  passport?: boolean | null;
  drivingLicense?: boolean | null;
};

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
  skillIds: string[];
  characteristics?: {
    heightCm?: number | null;
    ethnicityId?: string | null;
    hairColorId?: string | null;
    eyeColorId?: string | null;
    dietOptionId?: string | null;
    tattoo?: boolean | null;
    passport?: boolean | null;
    drivingLicense?: boolean | null;
  } | null;
};

type DraftCastingRoleForm = Omit<DraftCastingRole, 'ageMin' | 'ageMax' | 'characteristics'> & {
  ageMin: string;
  ageMax: string;
  characteristics: DraftRoleCharacteristicsForm;
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

  const ethnicityOptions = useCachedSiteMetadataOption('ethnicityOptions', t);
  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const dietOptions = useCachedSiteMetadataOption('dietOptions', t);

  const skillsRaw = useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined;

  const skillsByCat = useMemo(() => {
    const groups = new Map<string, SiteMetadataObject[]>();
    (skillsRaw ?? []).forEach((s) => {
      const k = s.categoryStringCode ?? 'sitemetadata.category.other';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(s);
    });
    return Array.from(groups.entries());
  }, [skillsRaw]);

  const skillsCats = useMemo(
    () =>
      skillsByCat.map(([catCode, list]) => ({
        catCode,
        list,
        idSet: new Set(list.map((s) => s.id)),
      })),
    [skillsByCat]
  );

  const [errors, setErrors] = useState<Partial<Record<CastingRoleFormKey, string>>>({});

  const pickId = (v: any): string => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && typeof v.id === 'string') return v.id;
    return '';
  };

  const pickAnyId = (obj: any, keys: string[]): string => {
    for (const k of keys) {
      const id = pickId(obj?.[k]);
      if (id) return id;
    }
    return '';
  };

  const toDigitsMax3 = (s: string) => s.replace(/\D/g, '').slice(0, 3);
  const toDigitsMax2 = (s: string) => s.replace(/\D/g, '').slice(0, 2);

  const makeEmptyCharacteristics = (): DraftRoleCharacteristicsForm => ({
    heightCm: '',
    ethnicityId: '',
    hairColorId: '',
    eyeColorId: '',
    dietOptionId: '',
    tattoo: null,
    passport: null,
    drivingLicense: null,
  });

  const makeEmpty = (): DraftCastingRoleForm => ({
    rolesSectionId: sectionId,
    roleName: '',
    roleTypeId: '',
    genderId: '',
    ageMin: '',
    ageMax: '',
    professionIds: [],
    description: '',
    skillIds: [],
    characteristics: makeEmptyCharacteristics(),
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
          skillIds: (r.skills ?? []).map((s) => s.id),
          characteristics: (() => {
            const ch: any = (r as any)?.characteristics;

            const height = ch?.heightCm ?? ch?.height ?? ch?.height_cm ?? ch?.heightCM ?? null;

            return {
              heightCm: height != null ? String(height) : '',
              ethnicityId: pickAnyId(ch, ['ethnicityId', 'ethnicity', 'ethnicityOption']),
              hairColorId: pickAnyId(ch, ['hairColorId', 'hairColor', 'hairColorOption']),
              eyeColorId: pickAnyId(ch, ['eyeColorId', 'eyeColor', 'eyeColorOption']),
              dietOptionId: pickAnyId(ch, ['dietOptionId', 'dietOption']),
              tattoo: ch?.tattoo ?? null,
              passport: ch?.passport ?? null,
              drivingLicense: ch?.drivingLicense ?? null,
            };
          })(),
        }
      : makeEmpty();

  const [form, setForm] = useState<DraftCastingRoleForm>(() =>
    mode === 'edit' ? makeFromInitial(initial) : makeEmpty()
  );

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, initial?.id, sectionId]);

  const onChange = <K extends keyof DraftCastingRoleForm>(k: K, v: DraftCastingRoleForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));

    const mapKey = ((): CastingRoleFormKey | null => {
      if (k === 'roleName') return 'roleName';
      if (k === 'roleTypeId') return 'roleType';
      if (k === 'genderId') return 'gender';
      if (k === 'ageMin') return 'ageMin';
      if (k === 'ageMax') return 'ageMax';
      if (k === 'professionIds') return 'professionIds';
      if (k === 'skillIds') return 'skillIds';
      if (k === 'description') return 'description';
      return null;
    })();

    if (mapKey) setErrors((e) => ({ ...e, [mapKey]: undefined }));
  };

  const onChangeCh = <K extends keyof DraftRoleCharacteristicsForm>(k: K, v: DraftRoleCharacteristicsForm[K]) => {
    setForm((f) => ({ ...f, characteristics: { ...f.characteristics, [k]: v } }));
  };

  const onAgeChange =
    (k: 'ageMin' | 'ageMax'): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const digits = toDigitsMax2(e.target.value);
      onChange(k, digits);
    };

  const onChNumChange =
    (k: 'heightCm'): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const digits = toDigitsMax3(e.target.value);
      onChangeCh(k, digits);
    };

  const toIntOrNaN = (s: string) => Number.parseInt(s, 10);
  const toIntOrNull = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return null;
    const n = Number.parseInt(trimmed, 10);
    return Number.isFinite(n) ? n : null;
  };

  const validateAndSave = async () => {
    const rawForSchema: CastingRoleFormValues = {
      rolesSectionId: sectionId,
      roleName: form.roleName,
      roleType: form.roleTypeId,
      gender: form.genderId,
      ageMin: toIntOrNaN(form.ageMin),
      ageMax: toIntOrNaN(form.ageMax),
      professionIds: form.professionIds,
      skillIds: form.skillIds.length ? form.skillIds : undefined,
      description: form.description?.trim() ? form.description.trim() : undefined,
    };

    const parsed = castingRoleSchema.safeParse(rawForSchema);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const flat = flattened.fieldErrors as Partial<Record<CastingRoleFormKey, string[]>>;
      const fieldErrors: Partial<Record<CastingRoleFormKey, string>> = {};
      (Object.keys(flat) as CastingRoleFormKey[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }

    const ch = form.characteristics;

    const shouldSendCharacteristics =
      mode === 'edit'
        ? true
        : ch.heightCm.trim() !== '' ||
          ch.ethnicityId.trim() !== '' ||
          ch.hairColorId.trim() !== '' ||
          ch.eyeColorId.trim() !== '' ||
          ch.dietOptionId.trim() !== '' ||
          ch.tattoo !== null ||
          ch.passport !== null ||
          ch.drivingLicense !== null;

    const characteristicsPayload = shouldSendCharacteristics
      ? {
          heightCm: toIntOrNull(ch.heightCm),
          ethnicityId: ch.ethnicityId.trim() ? ch.ethnicityId : null,
          hairColorId: ch.hairColorId.trim() ? ch.hairColorId : null,
          eyeColorId: ch.eyeColorId.trim() ? ch.eyeColorId : null,
          dietOptionId: ch.dietOptionId.trim() ? ch.dietOptionId : null,
          tattoo: ch.tattoo,
          passport: ch.passport,
          drivingLicense: ch.drivingLicense,
        }
      : undefined;

    const draft: DraftCastingRole = {
      id: form.id,
      rolesSectionId: sectionId,
      roleName: form.roleName,
      roleTypeId: form.roleTypeId,
      genderId: form.genderId,
      ageMin: parsed.data.ageMin,
      ageMax: parsed.data.ageMax,
      professionIds: form.professionIds,
      skillIds: form.skillIds,
      description: form.description,
      characteristics: characteristicsPayload,
    };

    await onSave(draft);
  };

  const hasAny = (arr?: unknown[]) => (arr?.length ?? 0) > 0;

  const characteristicsCount = useMemo(() => {
    const ch = form.characteristics;
    const isBool = (v: unknown): v is boolean => v === true || v === false;

    return (
      (ch.heightCm.trim() !== '' ? 1 : 0) +
      (ch.ethnicityId.trim() !== '' ? 1 : 0) +
      (ch.hairColorId.trim() !== '' ? 1 : 0) +
      (ch.eyeColorId.trim() !== '' ? 1 : 0) +
      (ch.dietOptionId.trim() !== '' ? 1 : 0) +
      (isBool(ch.tattoo) ? 1 : 0) +
      (isBool(ch.passport) ? 1 : 0) +
      (isBool(ch.drivingLicense) ? 1 : 0)
    );
  }, [form.characteristics]);

  const skillsCount = useMemo(() => {
    const selected = form.skillIds ?? [];
    if (!hasAny(selected)) return 0;
    return new Set(selected).size;
  }, [form.skillIds]);

  return (
    <article className="flex flex-col">
      <FormInputField
        id="roleName"
        label={t('employer_castings.dashboard.roles.role.role_name')}
        labelClassName="font-semibold"
        placeholder={t('general.placeholder.role_name')}
        value={form.roleName}
        onChange={(e) => onChange('roleName', e.target.value)}
        error={errors.roleName}
        required
      />

      <div>
        <div className="flex mb-1.5">
          <Label className="text-sm font-semibold">
            {t('employer_castings.dashboard.roles.role.talent_profession')}
          </Label>
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        </div>
        <MultiSelectDropdown
          options={professionsRaw ?? []}
          getId={(p) => p.id}
          getLabel={(p) => t(p.stringCode)}
          selected={form.professionIds}
          onChange={(next) => onChange('professionIds', next)}
          maxPanelHeight="16rem"
          error={errors.professionIds}
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
        <div className="flex mb-1.5">
          <Label className="text-sm font-semibold">{t('talent.filter.basic_info.age_range')} </Label>
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        </div>

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
        onBlur={() => {}}
        onKeyDown={() => {}}
        error={errors.description}
      />

      <Separator className="opacity-20 mt-6" />

      <FilterSection title={t('profile.pills.characteristics')} count={characteristicsCount}>
        <div className="flex flex-col">
          <label htmlFor="heightCm" className="text-sm font-semibold mb-2">
            {t('talent.filter.characteristics.height')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField
              id="heightCm"
              inputMode="numeric"
              placeholder="cm"
              value={form.characteristics.heightCm}
              onChange={onChNumChange('heightCm')}
            />
          </div>
        </div>

        <FormSelectField
          id="ethnicityId"
          label={t('profile.characteristics.ethnicity')}
          labelClassName="font-semibold"
          placeholder={t('general.placeholder.select')}
          value={form.characteristics.ethnicityId}
          onChange={(e) => onChangeCh('ethnicityId', e.target.value)}
          options={ethnicityOptions}
        />

        <FormSelectField
          id="hairColorId"
          label={t('profile.characteristics.hairColor')}
          labelClassName="font-semibold"
          placeholder={t('general.placeholder.select')}
          value={form.characteristics.hairColorId}
          onChange={(e) => onChangeCh('hairColorId', e.target.value)}
          options={hairOptions}
        />

        <FormSelectField
          id="eyeColorId"
          label={t('profile.characteristics.eyeColor')}
          labelClassName="font-semibold"
          placeholder={t('general.placeholder.select')}
          value={form.characteristics.eyeColorId}
          onChange={(e) => onChangeCh('eyeColorId', e.target.value)}
          options={eyeOptions}
        />

        <FormSelectField
          id="dietOptionId"
          label={t('profile.characteristics.dietOption', 'Dieta')}
          labelClassName="font-semibold"
          placeholder={t('general.placeholder.select')}
          value={form.characteristics.dietOptionId}
          onChange={(e) => onChangeCh('dietOptionId', e.target.value)}
          options={dietOptions}
        />

        <div className="grid grid-cols-1">
          <BooleanRadioGroup
            name="tattoo"
            label={t('profile.characteristics.tattoo')}
            value={form.characteristics.tattoo}
            anyValue="null"
            onChange={(next) => onChangeCh('tattoo', next == null ? null : next)}
          />
          <BooleanRadioGroup
            name="passport"
            label={t('profile.characteristics.passport')}
            value={form.characteristics.passport}
            anyValue="null"
            onChange={(next) => onChangeCh('passport', next == null ? null : next)}
          />
          <BooleanRadioGroup
            name="drivingLicense"
            label={t('profile.characteristics.drivingLicense')}
            value={form.characteristics.drivingLicense}
            anyValue="null"
            onChange={(next) => onChangeCh('drivingLicense', next == null ? null : next)}
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20" />

      <FilterSection title={t('profile.pills.skills')} count={skillsCount}>
        {skillsCats.map(({ catCode, list, idSet }) => {
          const selectedGlobal = form.skillIds ?? [];
          const selectedInCat = selectedGlobal.filter((id) => idSet.has(id));

          const handleCatChange = (nextIds: string[]) => {
            const rest = selectedGlobal.filter((id) => !idSet.has(id));
            const merged = Array.from(new Set([...rest, ...nextIds]));
            onChange('skillIds', merged);
          };

          return (
            <div key={catCode} className="mb-2">
              <h4 className="text-sm font-semibold mb-2">{t(catCode)}</h4>
              <MultiSelectDropdown
                options={list}
                getId={(s) => s.id}
                getLabel={(s) => t(s.stringCode)}
                selected={selectedInCat}
                onChange={handleCatChange}
                maxPanelHeight="16rem"
                error={errors.skillIds}
              />
            </div>
          );
        })}
      </FilterSection>

      <Separator className="opacity-20 mb-6" />

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>

        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void validateAndSave();
          }}
        >
          {t('buttons.save')}
        </Button>
      </div>
    </article>
  );
}
