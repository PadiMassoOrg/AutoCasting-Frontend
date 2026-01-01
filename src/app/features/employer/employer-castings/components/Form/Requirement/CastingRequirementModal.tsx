import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxField from '../../../../../../shared/components/Form/CheckboxField';
import MultiRadioGroupField from '../../../../../../shared/components/Form/MultiRadioGroupField';
import RadioGroupField, { type RadioOption } from '../../../../../../shared/components/Form/RadioGroupField';
import TextareaField from '../../../../../../shared/components/Form/TextareaField';
import type { EmployerCastingRequirementCardResponse } from '../../../types/employerCastings.types';

export type DraftCastingRequirement =
  | {
      mode: 'create';
      requirementsSectionId: string;
      roleIds: string[];
      requiresAudio: boolean;
      requiresVideo: boolean;
      description: string;
    }
  | {
      mode: 'edit';
      id: string;
      requirementsSectionId: string;
      roleId: string;
      requiresAudio: boolean;
      requiresVideo: boolean;
      description: string;
    };

type Props = {
  mode: 'create' | 'edit';
  initial?: EmployerCastingRequirementCardResponse;
  onSave: (draft: DraftCastingRequirement) => Promise<void> | void;
  onCancel: () => void;
  sectionId: string;

  /** en CREATE es obligatorio para poder elegir roles; en EDIT puede omitirse */
  roleOptions?: RadioOption[];
};

type FormState = {
  selectedRoleIds: string[]; // CREATE
  lockedRoleId: string; // EDIT (no editable)

  requiresAudio: boolean;
  requiresVideo: boolean;
  description: string;
};

const CastingRequirementModal = ({ mode, initial, onSave, onCancel, sectionId, roleOptions = [] }: Props) => {
  const { t } = useTranslation();

  const readInitialRoleId = (r?: EmployerCastingRequirementCardResponse): string => {
    const any = r as any;
    return (
      any?.castingRoleId ?? any?.roleId ?? any?.castingRole?.id ?? any?.role?.id ?? '' // fallback
    );
  };

  const readInitialRoleName = (r?: EmployerCastingRequirementCardResponse): string => {
    const any = r as any;
    return (any?.roleName ?? any?.castingRoleName ?? any?.role?.roleName ?? any?.castingRole?.roleName ?? '') as string;
  };

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
      description: (((r as any)?.description ?? '') as string) ?? '',
    };
  };

  const [form, setForm] = useState<FormState>(() => (mode === 'edit' ? makeFromInitial(initial) : makeEmpty()));
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setForm(mode === 'edit' ? makeFromInitial(initial) : makeEmpty());
    setSubmitError(null);
  }, [mode, (initial as any)?.id, sectionId]);

  useEffect(() => {
    if (mode !== 'create') return;
    setForm((f) => ({ ...f }));
  }, [mode, roleOptions]);

  const lockedRoleOptions: RadioOption[] = useMemo(() => {
    if (mode !== 'edit') return [];

    const roleId = form.lockedRoleId || readInitialRoleId(initial);
    const roleName = readInitialRoleName(initial) || t('general.placeholder.select');

    const fromOptions = roleOptions.find((o) => o.value === roleId);
    const label = fromOptions?.label ?? roleName;

    if (roleId) return [{ value: roleId, label, disabled: true }];

    return [{ value: 'LOCKED', label, disabled: true }];
  }, [mode, form.lockedRoleId, initial, roleOptions, t]);

  const validateAndSave = async () => {
    setSubmitError(null);

    const hasAudioOrVideo = Boolean(form.requiresAudio) || Boolean(form.requiresVideo);
    if (!hasAudioOrVideo) {
      setSubmitError(
        t('employer_castings.dashboard.requirements.error_select_audio_or_video', 'Seleccione Audio o Video')
      );
      return;
    }

    if (mode === 'create') {
      if (!form.selectedRoleIds.length) {
        setSubmitError(t('employer_castings.dashboard.requirements.error_select_role', 'Seleccione al menos un rol'));
        return;
      }

      const draft: DraftCastingRequirement = {
        mode: 'create',
        requirementsSectionId: sectionId,
        roleIds: form.selectedRoleIds,
        requiresAudio: form.requiresAudio,
        requiresVideo: form.requiresVideo,
        description: form.description ?? '',
      };

      await onSave(draft);
      return;
    }

    const id = ((initial as any)?.id ?? '') as string;
    const roleId = form.lockedRoleId || readInitialRoleId(initial);

    if (!id) {
      setSubmitError(t('general.error', 'Error'));
      return;
    }

    const draft: DraftCastingRequirement = {
      mode: 'edit',
      id,
      requirementsSectionId: sectionId,
      roleId,
      requiresAudio: form.requiresAudio,
      requiresVideo: form.requiresVideo,
      description: form.description ?? '',
    };

    await onSave(draft);
  };

  return (
    <article className="flex flex-col">
      {mode === 'create' ? (
        <MultiRadioGroupField
          selected={form.selectedRoleIds}
          options={roleOptions}
          onChange={(next) => setForm((f) => ({ ...f, selectedRoleIds: next }))}
          minSelections={1}
        />
      ) : (
        <RadioGroupField
          value={lockedRoleOptions?.[0]?.value ?? ''}
          options={lockedRoleOptions}
          disabled
          onValueChange={() => {}}
        />
      )}

      <Separator className="opacity-20 mt-1 mb-8" />

      <div className="flex items-center gap-6">
        <CheckboxField
          id="requiresVideo"
          label={t('employer_castings.dashboard.requirements.requirement.video_true')}
          checked={form.requiresVideo}
          onCheckedChange={(checked) => setForm((f) => ({ ...f, requiresVideo: checked }))}
        />
        <CheckboxField
          id="requiresAudio"
          label={t('employer_castings.dashboard.requirements.requirement.audio_true')}
          checked={form.requiresAudio}
          onCheckedChange={(checked) => setForm((f) => ({ ...f, requiresAudio: checked }))}
        />
      </div>

      <div className="mt-6">
        <TextareaField
          id="description"
          label={t('employer_castings.dashboard.requirements.description_optional')}
          placeholder={t('general.placeholder.write_something')}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: (e?.target?.value ?? '') as string }))}
        />
      </div>

      {submitError ? <p className="mt-4 text-sm text-red-600">{submitError}</p> : null}

      <Separator className="opacity-20 my-6" />

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
};

export default CastingRequirementModal;
