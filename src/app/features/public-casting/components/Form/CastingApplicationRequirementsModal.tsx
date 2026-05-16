import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePendingAction } from 'autocasting-ui-library-padimasso';
import { getCastingApplicationSchema, type CastingApplicationFormValues } from '../../schemas/castingApplicationSchema';
import type { CastingRequirement } from '../../types/publicCasting.types';
import type { CastingApplicationRequest } from '../../types/requests';

type Props = {
  requirements: CastingRequirement[];
  onCancel: () => void;
  onApply: (body: CastingApplicationRequest) => void | Promise<void>;
};

type DraftForm = {
  audioUrl: string;
  videoUrl: string;
  message: string;
  notes: string;
};

const makeInitial = (_requirements: CastingRequirement[]): DraftForm => ({
  audioUrl: '',
  videoUrl: '',
  message: '',
  notes: '',
});

const CastingApplicationRequirementsModal = ({ requirements, onCancel, onApply }: Props) => {
  const { t } = useTranslation();
  const schema = useMemo(() => getCastingApplicationSchema(t, requirements), [t, requirements]);
  const { isPending, execute } = usePendingAction();

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

  const onFieldChange = (key: keyof DraftForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldError(key, undefined);
  };

  const validateAndApply = async () => {
    const raw: CastingApplicationFormValues = {
      message: form.message,
      audioUrl: form.audioUrl,
      videoUrl: form.videoUrl,
      notes: form.notes,
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
      message: parsed.data.message?.trim() ? parsed.data.message.trim() : null,
      audioUrl: parsed.data.audioUrl?.trim() ? parsed.data.audioUrl.trim() : null,
      videoUrl: parsed.data.videoUrl?.trim() ? parsed.data.videoUrl.trim() : null,
      notes: parsed.data.notes?.trim() ? parsed.data.notes.trim() : null,
    };

    await execute(() => onApply(body));
  };

  const requiresVideo = requirements.some((req) => req?.requiresVideo);
  const requiresAudio = requirements.some((req) => req?.requiresAudio);

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
        <div className="flex flex-col gap-2">
          {requiresVideo && (
            <FormInputField
              id="video-url"
              label={t('application.modal.video')}
              labelClassName="font-semibold text-black"
              required
              placeholder="URL"
              value={form.videoUrl}
              onChange={(e) => onFieldChange('videoUrl', e.target.value)}
              error={errors.videoUrl}
            />
          )}

          {requiresAudio && (
            <FormInputField
              id="audio-url"
              label={t('application.modal.audio')}
              labelClassName="font-semibold text-black"
              required
              placeholder="URL"
              value={form.audioUrl}
              onChange={(e) => onFieldChange('audioUrl', e.target.value)}
              error={errors.audioUrl}
            />
          )}
        </div>
      </div>

      <Separator className="opacity-20 my-4" />

      <div className="flex gap-4">
        <Button variant="primaryOutline" onClick={onCancel}>
          {t('general.back')}
        </Button>
        <Button onClick={validateAndApply} loading={isPending}>
          {t('general.apply')}
        </Button>
      </div>
    </article>
  );
};

export default CastingApplicationRequirementsModal;
