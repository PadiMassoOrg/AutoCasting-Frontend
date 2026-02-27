import { Button, Label, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxField from '../../../../../../shared/components/Form/CheckboxField';
import MultiRadioGroupField from '../../../../../../shared/components/Form/MultiRadioGroupField';
import RadioGroupField, { type RadioOption } from '../../../../../../shared/components/Form/RadioGroupField';
import TextareaField from '../../../../../../shared/components/Form/TextareaField';
import { getCastingRequirementSchema, type CastingRequirementFormKey } from '../../../schemas/formSchema';
import type { EmployerCastingRequirementCardResponse } from '../../../types/employerCastings.types';

export type DraftCastingRequirement =
  | {
      mode: 'create';
      requirementsSectionId: string;
      roleIds: string[];
      requiresAudio: boolean;
      requiresVideo: boolean;
      description?: string;
    }
  | {
      mode: 'edit';
      id: string;
      requirementsSectionId: string;
      roleIds: string[];
      requiresAudio: boolean;
      requiresVideo: boolean;
      description?: string;
    };

type Props = {
  mode: 'create' | 'edit';
  initial?: EmployerCastingRequirementCardResponse;
  onSave: (draft: DraftCastingRequirement) => Promise<void> | void;
  onCancel: () => void;
  sectionId: string;
  roleOptions?: RadioOption[];
  disabledRoleIds?: string[];
};

type FormState = {
  selectedRoleIds: string[];
  lockedRoleId: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
  description: string;
};

const normalize = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const CastingRequirementModal = ({
  mode,
  initial,
  onSave,
  onCancel,
  sectionId,
  roleOptions = [],
  disabledRoleIds = [],
}: Props) => {
  const { t } = useTranslation();
  const requirementSchema = useMemo(() => getCastingRequirementSchema(t), [t]);

  const readInitialRoleId = (r?: EmployerCastingRequirementCardResponse): string => {
    const any = r as any;
    return any?.roleId ?? any?.castingRoleId ?? any?.castingRole?.id ?? any?.role?.id ?? '';
  };

  const readInitialRoleName = (r?: EmployerCastingRequirementCardResponse): string => {
    const any = r as any;
    return (any?.roleName ?? any?.castingRoleName ?? any?.role?.roleName ?? any?.castingRole?.roleName ?? '') as string;
  };

  const lockedRoleIds = useMemo(() => {
    const lockedNorm = new Set((disabledRoleIds ?? []).map(normalize).filter(Boolean));
    if (!lockedNorm.size) return [];
    return (roleOptions ?? []).filter((o) => lockedNorm.has(normalize(o.value))).map((o) => o.value);
  }, [disabledRoleIds, roleOptions]);

  const makeEmpty = (): FormState => ({
    selectedRoleIds: [],
    lockedRoleId: '',
    requiresAudio: false,
    requiresVideo: false,
    description: '',
  });

  const makeFromInitial = (r?: EmployerCastingRequirementCardResponse): FormState => {
    const roleId = readInitialRoleId(r);
    return {
      selectedRoleIds: roleId ? [roleId] : [],
      lockedRoleId: roleId,
      requiresAudio: Boolean((r as any)?.requiresAudio),
      requiresVideo: Boolean((r as any)?.requiresVideo),
      description: ((r as any)?.description as string) ?? '',
    };
  };

  const [form, setForm] = useState<FormState>(() => (mode === 'edit' ? makeFromInitial(initial) : makeEmpty()));
  const [errors, setErrors] = useState<Partial<Record<CastingRequirementFormKey, string>>>({});

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setErrors({});
  }, [mode, (initial as any)?.id, sectionId]);

  const lockedRoleOptions: RadioOption[] = useMemo(() => {
    if (mode !== 'edit') return [];
    const roleId = form.lockedRoleId || readInitialRoleId(initial);
    const roleName = readInitialRoleName(initial) || t('general.placeholder.select');
    const fromOptions = roleOptions.find((o) => o.value === roleId);
    const label = fromOptions?.label ?? roleName;
    if (roleId) return [{ value: roleId, label, disabled: true }];
    return [{ value: 'LOCKED', label, disabled: true }];
  }, [mode, form.lockedRoleId, initial, roleOptions, t]);

  const onChange = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));

    const mapKey = ((): CastingRequirementFormKey | null => {
      if (k === 'selectedRoleIds') return 'roleIds';
      if (k === 'requiresAudio' || k === 'requiresVideo') return 'media';
      if (k === 'description') return 'description';
      return null;
    })();

    if (mapKey) setErrors((e) => ({ ...e, [mapKey]: undefined }));
  };

  const validateAndSave = async () => {
    const roleIds =
      mode === 'create'
        ? (form.selectedRoleIds ?? [])
        : [form.lockedRoleId || readInitialRoleId(initial)].filter(Boolean);

    const schemaValues = {
      requirementsSectionId: sectionId,
      roleIds,
      requiresAudio: Boolean(form.requiresAudio),
      requiresVideo: Boolean(form.requiresVideo),
      description: form.description?.trim() ? form.description.trim() : undefined,
    };

    const parsed = requirementSchema.safeParse(schemaValues);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const flat = flattened.fieldErrors as Partial<Record<CastingRequirementFormKey, string[]>>;
      const fieldErrors: Partial<Record<CastingRequirementFormKey, string>> = {};
      (Object.keys(flat) as CastingRequirementFormKey[]).forEach((k) => {
        const msg = flat[k]?.[0];
        if (msg) fieldErrors[k] = msg;
      });
      setErrors(fieldErrors);
      return;
    }

    if (mode === 'create') {
      const draft: DraftCastingRequirement = {
        mode: 'create',
        requirementsSectionId: sectionId,
        roleIds: parsed.data.roleIds ?? [],
        requiresAudio: parsed.data.requiresAudio,
        requiresVideo: parsed.data.requiresVideo,
        description: parsed.data.description,
      };
      await onSave(draft);
      return;
    }

    const id = ((initial as any)?.id ?? '') as string;
    const roleId = form.lockedRoleId || readInitialRoleId(initial);

    if (!id) {
      setErrors((e) => ({ ...e, roleIds: t('general.error', 'Error') }));
      return;
    }

    const draft: DraftCastingRequirement = {
      mode: 'edit',
      id,
      requirementsSectionId: sectionId,
      roleIds: [roleId].filter(Boolean),
      requiresAudio: parsed.data.requiresAudio,
      requiresVideo: parsed.data.requiresVideo,
      description: parsed.data.description,
    };

    await onSave(draft);
  };

  const isCreateSaveDisabled = useMemo(() => {
    if (mode !== 'create') return false;
    if ((form.selectedRoleIds ?? []).length <= 0) return true;
    if (!form.requiresAudio && !form.requiresVideo) return true;
    return false;
  }, [mode, form.selectedRoleIds, form.requiresAudio, form.requiresVideo]);

  const mediaErrorId = useId();

  return (
    <article className="flex flex-col">
      {mode === 'create' ? (
        <MultiRadioGroupField
          selected={form.selectedRoleIds}
          options={roleOptions}
          lockedValues={lockedRoleIds}
          mustSelectOne
          onChange={(next) => onChange('selectedRoleIds', next ?? [])}
          error={errors.roleIds}
        />
      ) : (
        <RadioGroupField
          value={lockedRoleOptions?.[0]?.value ?? ''}
          options={lockedRoleOptions}
          disabled
          onValueChange={() => {}}
        />
      )}

      <Separator className="opacity-20 mt-2 mb-8.5" />

      <div className="flex items-center gap-6">
        <CheckboxField
          id="requiresVideo"
          label={t('employer_castings.dashboard.requirements.requirement.video_true')}
          checked={form.requiresVideo}
          onCheckedChange={(checked) => onChange('requiresVideo', checked)}
        />
        <CheckboxField
          id="requiresAudio"
          label={t('employer_castings.dashboard.requirements.requirement.audio_true')}
          checked={form.requiresAudio}
          onCheckedChange={(checked) => onChange('requiresAudio', checked)}
        />
      </div>

      {!errors.media ? (
        <div className="min-h-[25px]" />
      ) : (
        <div className="min-h-[25px]">
          <Label id={`${mediaErrorId}-error`} variant="error" className="mt-0.5">
            {errors.media}
          </Label>
        </div>
      )}

      <div className="mt-2">
        <TextareaField
          id="description"
          label={t('employer_castings.dashboard.requirements.requirement.description')}
          placeholder={t('general.placeholder.about')}
          value={form.description}
          onChange={(e) => onChange('description', (e?.target?.value ?? '') as string)}
          error={errors.description}
        />
        <div className="min-h-[25px]" />
      </div>

      <Separator className="opacity-20 mb-7.5 mt-2" />

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>

        <Button
          type="button"
          disabled={mode === 'create' ? isCreateSaveDisabled : false}
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
};

export default CastingRequirementModal;
