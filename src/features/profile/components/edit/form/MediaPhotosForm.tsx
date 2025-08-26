import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'autocasting-ui-library-padimasso';
import { useProfileMediaPatch } from '../../../../supabase/media/hooks/useProfileMediaPatch';
import UploadTile from '../UploadTile/UploadTile';
import type { Media } from '../../../types/profile.types';

type Slot = 'headshot' | 'fullbody' | 'other';
const OTHER_SLOTS = 6;

export default function MediaForm({ media, supabaseId }: { media: Media; supabaseId: string }) {
  const { t } = useTranslation();
  const { mutate: upload } = useProfileMediaPatch(supabaseId);
  const [preview, setPreview] = useState<Partial<Record<Slot, string>>>({});
  const [pending, setPending] = useState<Set<Slot>>(new Set());

  // Cache-busting por slot (incrementa para forzar <img> a refrescar)
  const [bust, setBust] = useState<Partial<Record<Slot, number>>>({});

  // ---- OTRAS FOTOS: estados por índice 0..5 (no toca tu UploadTile) ----
  const [otherPreview, setOtherPreview] = useState<Record<number, string | undefined>>({});
  const [otherPending, setOtherPending] = useState<Set<number>>(new Set());
  const [otherBust, setOtherBust] = useState<Record<number, number | undefined>>({});
  const others = media.otherPicturesUrl ?? [];

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

  const pickOther = (index: number) => (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setOtherPreview((p) => ({ ...p, [index]: localUrl }));
    setOtherPending((p) => new Set(p).add(index));

    upload(
      { file, slot: 'other' },
      {
        onSuccess: () => {
          // fuerza refresco del <img> por si el CDN/navegador cachea
          setOtherBust((b) => ({ ...b, [index]: (b[index] ?? 0) + 1 }));
        },
        onSettled: () => {
          URL.revokeObjectURL(localUrl);
          setOtherPreview((p) => ({ ...p, [index]: undefined }));
          setOtherPending((p) => {
            const n = new Set(p);
            n.delete(index);
            return n;
          });
        },
      }
    );
  };

  return (
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

      {/* Otras fotos: 2 filas x 3 = 6 tiles */}
      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.media.other')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: OTHER_SLOTS }, (_, i) => (
            <UploadTile
              key={i}
              label={`${t('profile.media.other')} ${i + 1}`}
              // si existe en backend, mostrarlo; si estoy subiendo, mostrar preview local
              value={others[i] ?? undefined}
              previewUrl={otherPreview[i] ?? null}
              busy={otherPending.has(i)}
              busyText={t('state.loading')}
              bustKey={otherBust[i]}
              onSelect={pickOther(i)}
              accept="image/*"
              maxSizeMB={8}
              objectFit="cover"
              aspectRatio="3 / 4"
              multiple={false}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
