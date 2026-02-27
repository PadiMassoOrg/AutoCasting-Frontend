import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCastingApplicationSchema, type CastingApplicationFormValues } from '../../schemas/castingApplicationSchema';
import type { CastingRequirement } from '../../types/publicCasting.types';
import type { CastingApplicationRequest } from '../../types/requests';

type Props = {
  requirements: CastingRequirement[];
  onCancel: () => void;
  onApply: (body: CastingApplicationRequest) => Promise<void> | void;
};

type DraftSubmission = {
  castingRequirementId: string;
  audioUrl: string;
  videoUrl: string;
};

type DraftForm = {
  submissions: DraftSubmission[];
};

const makeInitial = (requirements: CastingRequirement[]): DraftForm => ({
  submissions: (requirements ?? [])
    .filter((r): r is CastingRequirement & { id: string } => !!r?.id)
    .map((r) => ({
      castingRequirementId: r.id,
      audioUrl: '',
      videoUrl: '',
    })),
});

const CastingApplicationRequirementsModal = ({ requirements, onCancel, onApply }: Props) => {
  const { t } = useTranslation();
  const schema = useMemo(() => getCastingApplicationSchema(t, requirements), [t, requirements]);

  const [form, setForm] = useState<DraftForm>(() => makeInitial(requirements));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(makeInitial(requirements));
    setErrors({});
  }, [requirements.map((r) => r?.id).join('|')]);

  const setFieldError = (path: string, msg?: string) => {
    setErrors((e) => {
      const next = { ...e };
      if (!msg) delete next[path];
      else next[path] = msg;
      return next;
    });
  };

  const onSubmissionChange = (idx: number, key: keyof DraftSubmission, value: string) => {
    setForm((f) => {
      const next = [...f.submissions];
      next[idx] = { ...next[idx], [key]: value };
      return { ...f, submissions: next };
    });
    setFieldError(`submissions.${idx}.${key}`, undefined);
  };

  const validateAndApply = async () => {
    const raw: CastingApplicationFormValues = {
      message: '',
      submissions: form.submissions.map((s) => ({
        castingRequirementId: s.castingRequirementId,
        audioUrl: s.audioUrl,
        videoUrl: s.videoUrl,
        notes: '',
      })),
    };

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.');
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    const body: CastingApplicationRequest = {
      message: null,
      submissions: parsed.data.submissions.map((s) => ({
        castingRequirementId: s.castingRequirementId,
        audioUrl: s.audioUrl?.trim() ? s.audioUrl.trim() : null,
        videoUrl: s.videoUrl?.trim() ? s.videoUrl.trim() : null,
        notes: null,
      })),
    };

    await onApply(body);
  };

  return (
    <article className="flex flex-col">
      {/* Description */}
      <div className="text-base text-[var(--color-secondary-gray)] font-normal">
        {(requirements ?? [])
          .map((r) => r?.description?.trim())
          .filter(Boolean)
          .map((desc, idx) => (
            <p key={idx} className={idx === 0 ? '' : 'mt-3'}>
              {desc}
            </p>
          ))}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {(requirements ?? []).map((req) => {
          const requiresVideo = !!req?.requiresVideo;
          const requiresAudio = !!req?.requiresAudio;

          const subIdx = form.submissions.findIndex((s) => s.castingRequirementId === req.id);
          if (!req?.id || subIdx < 0) return null;

          return (
            <div key={req.id} className="flex flex-col gap-2">
              {requiresVideo && (
                <FormInputField
                  id={`video-${req.id}`}
                  label={t('application.modal.video')}
                  labelClassName="font-semibold text-black"
                  required
                  placeholder="URL"
                  value={form.submissions[subIdx].videoUrl}
                  onChange={(e) => onSubmissionChange(subIdx, 'videoUrl', e.target.value)}
                  error={errors[`submissions.${subIdx}.videoUrl`]}
                />
              )}

              {requiresAudio && (
                <FormInputField
                  id={`audio-${req.id}`}
                  label={t('application.modal.audio')}
                  labelClassName="font-semibold text-black"
                  required
                  placeholder="URL"
                  value={form.submissions[subIdx].audioUrl}
                  onChange={(e) => onSubmissionChange(subIdx, 'audioUrl', e.target.value)}
                  error={errors[`submissions.${subIdx}.audioUrl`]}
                />
              )}
            </div>
          );
        })}
      </div>

      <Separator className="opacity-20 my-4" />

      <div className="flex gap-4">
        <Button variant="primaryOutline" onClick={onCancel}>
          {t('general.back')}
        </Button>
        <Button onClick={validateAndApply}>{t('general.apply')}</Button>
      </div>
    </article>
  );
};

export default CastingApplicationRequirementsModal;
