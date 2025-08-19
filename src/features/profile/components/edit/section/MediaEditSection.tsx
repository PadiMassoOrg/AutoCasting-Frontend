import { useState } from 'react';
import { useProfileMediaPatch } from '../../../../supabase/media/hooks/useProfileMediaPatch';
import type { Media } from '../../../types/profile.types';
import UploadTile from '../UploadTile/UploadTile';
import { useTranslation } from 'react-i18next';
import { Label, Separator } from 'autocasting-ui-library-padimasso';

type Slot = 'headshot' | 'fullbody' | 'other';

const MediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  const { t } = useTranslation();
  const { mutate: upload } = useProfileMediaPatch(supabaseId);
  const [preview, setPreview] = useState<Partial<Record<Slot, string>>>({});
  const [pending, setPending] = useState<Set<Slot>>(new Set());

  // Cache-busting por slot (incrementa para forzar <img> a refrescar)
  const [bust, setBust] = useState<Partial<Record<Slot, number>>>({});

  const pick = (slot: Slot) => (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const localUrl = URL.createObjectURL(file);

    setPreview((prev) => ({ ...prev, [slot]: localUrl }));
    setPending((prev) => new Set(prev).add(slot));

    upload(
      { file, slot },
      {
        onSuccess: () => {
          // incrementa bustKey para evitar servir caché de current.jpg
          setBust((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 }));
        },
        onSettled: () => {
          URL.revokeObjectURL(localUrl);
          setPreview((prev) => ({ ...prev, [slot]: undefined }));
          setPending((prev) => {
            const next = new Set(prev);
            next.delete(slot);
            return next;
          });
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.media.photos')}</h3>
      {/* Head y Full Body */}
      <article className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label className="text-base font-semibold">{t('profile.media.headshot_fullbody')}</Label>
          <div className="flex flex-row items-center gap-2">
            <UploadTile
              label={t('general.placeholder.headshot')}
              previewUrl={preview.headshot ?? null}
              value={media.headshotImageUrl ?? undefined}
              onSelect={pick('headshot')}
              disabled={pending.has('headshot')}
              busy={pending.has('headshot')}
              busyText={t('state.loading')}
              bustKey={bust.headshot}
              accept="image/*"
              maxSizeMB={8}
              objectFit="cover"
            />
            <UploadTile
              label={t('general.placeholder.fullbody')}
              previewUrl={preview.fullbody ?? null}
              value={media.fullBodyImageUrl ?? undefined}
              onSelect={pick('fullbody')}
              disabled={pending.has('fullbody')}
              busy={pending.has('fullbody')}
              busyText={t('state.loading')}
              bustKey={bust.fullbody}
              accept="image/*"
              maxSizeMB={8}
              objectFit="cover"
            />
          </div>
        </div>

        {/* Other */}
        <article className="flex flex-col gap-2">
          <Label className="text-base font-semibold">{t('profile.media.other')}</Label>
          {/* Other: permite múltiples (se envía el primero). 
          Si querés soportar multi real, podés mapear `files` y llamar mutate por cada uno. */}
          <UploadTile
            previewUrl={preview.other ?? null}
            value={undefined} // aquí sólo mostramos la última preview subida
            onSelect={pick('other')}
            disabled={pending.has('other')}
            busy={pending.has('other')}
            busyText={t('state.loading')}
            bustKey={bust.other}
            accept="image/*"
            maxSizeMB={8}
            objectFit="cover"
            multiple={false}
          />
        </article>
      </article>
      <Separator className="opacity-20 my-8" />
    </div>
  );
};

export default MediaEditSection;
