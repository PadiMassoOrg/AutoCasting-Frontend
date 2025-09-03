import { Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileMediaPatch } from '../../../supabase/media/hooks/useProfileMediaPatch';
import type { Media } from '../../types/profile.types';
import UploadTile from '../UploadTile/UploadTile';

const OTHER_SLOTS = 6;

// File -> dataURL para un preview que no “explota”
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Añade bust sólo si hay URL
const withBust = (url?: string, bust?: number) => {
  if (!url) return undefined;
  if (!bust) return url;
  return url.includes('?') ? `${url}&b=${bust}` : `${url}?b=${bust}`;
};

export default function MediaForm({ media, supabaseId }: { media: Media; supabaseId: string }) {
  const { t } = useTranslation();
  const { mutate: upload } = useProfileMediaPatch(supabaseId);

  console.log(media);

  // Headshot/Fullbody
  const [preview, setPreview] = useState<Partial<Record<'headshot' | 'fullbody', string>>>({});
  const [pending, setPending] = useState<Set<'headshot' | 'fullbody'>>(new Set());
  const [bust, setBust] = useState<Partial<Record<'headshot' | 'fullbody', number>>>({});

  // Otras fotos (0..5), estados por índice
  const [otherPreview, setOtherPreview] = useState<Record<number, string | undefined>>({});
  const [otherPending, setOtherPending] = useState<Set<number>>(new Set());
  const [otherBust, setOtherBust] = useState<Record<number, number | undefined>>({});

  const others = media.otherPicturesUrl ?? [];

  // --- HEADSHOT / FULLBODY ---
  const pick = (slot: 'headshot' | 'fullbody') => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const localUrl = await fileToDataUrl(file);
    setPreview((prev) => ({ ...prev, [slot]: localUrl }));
    setPending((prev) => new Set(prev).add(slot));

    upload(
      { file, slot },
      {
        onSuccess: () => {
          setBust((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 }));
        },
        onSettled: () => {
          // quitamos sólo el loading, el preview queda hasta que media traiga la URL remota
          setPending((prev) => {
            const next = new Set(prev);
            next.delete(slot);
            return next;
          });
        },
      }
    );
  };

  // --- OTHER (por índice) ---
  const pickOther = (index: number) => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const localUrl = await fileToDataUrl(file);
    setOtherPreview((p) => ({ ...p, [index]: localUrl }));
    setOtherPending((p) => new Set(p).add(index));

    upload(
      { file, slot: 'other', index },
      {
        onSuccess: () => {
          setOtherBust((b) => ({ ...b, [index]: (b[index] ?? 0) + 1 }));
        },
        onSettled: () => {
          setOtherPending((p) => {
            const n = new Set(p);
            n.delete(index);
            return n;
          });
          // mantenemos el preview; cuando el cache se refresque, value tomará la URL remota
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
            // Mientras está pending, NO pasar value (evita undefined?b=1 y prioriza preview)
            value={pending.has('headshot') ? undefined : withBust(media.headshotImageUrl, bust.headshot)}
            previewUrl={preview.headshot ?? null}
            onSelect={pick('headshot')}
            disabled={pending.has('headshot')}
            busy={pending.has('headshot')}
            busyText={t('state.loading')}
            // Si tu UploadTile agrega bust por su cuenta, puedes quitar bustKey para preview
            bustKey={undefined}
            accept="image/*"
            maxSizeMB={8}
            objectFit="cover"
          />

          <UploadTile
            label={t('general.placeholder.fullbody')}
            value={pending.has('fullbody') ? undefined : withBust(media.fullBodyImageUrl, bust.fullbody)}
            previewUrl={preview.fullbody ?? null}
            onSelect={pick('fullbody')}
            disabled={pending.has('fullbody')}
            busy={pending.has('fullbody')}
            busyText={t('state.loading')}
            bustKey={undefined}
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
              // Independencia por slot: si este está pending, mostramos sólo preview
              value={otherPending.has(i) ? undefined : withBust(others[i], otherBust[i])}
              previewUrl={otherPreview[i] ?? null}
              busy={otherPending.has(i)}
              busyText={t('state.loading')}
              // Evitar que el componente aplique bust sobre preview
              bustKey={undefined}
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
