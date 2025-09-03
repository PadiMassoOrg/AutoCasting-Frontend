import { Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileMediaDelete } from '../../../supabase/media/hooks/useProfileMediaDelete';
import { useProfileMediaPatch } from '../../../supabase/media/hooks/useProfileMediaPatch';
import type { Media } from '../../types/profile.types';
import UploadTile from '../UploadTile/UploadTile';

const OTHER_SLOTS = 6;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const withBust = (url: string | null | undefined, bust?: number): string | undefined => {
  if (!url) return undefined;
  if (!bust) return url;
  return url.includes('?') ? `${url}&b=${bust}` : `${url}?b=${bust}`;
};

export default function MediaForm({ media, supabaseId }: { media: Media; supabaseId: string }) {
  const { t } = useTranslation();
  const { mutate: upload } = useProfileMediaPatch(supabaseId);
  const { mutateAsync: removeMedia } = useProfileMediaDelete();

  // previews y estados
  const [preview, setPreview] = useState<Partial<Record<'headshot' | 'fullbody', string>>>({});
  const [pending, setPending] = useState<Set<'headshot' | 'fullbody'>>(new Set());
  const [bust, setBust] = useState<Partial<Record<'headshot' | 'fullbody', number>>>({});
  const [otherPreview, setOtherPreview] = useState<Record<number, string | undefined>>({});
  const [otherPending, setOtherPending] = useState<Set<number>>(new Set());
  const [otherBust, setOtherBust] = useState<Record<number, number | undefined>>({});

  // flags locales para ocultar inmediatamente el borrado
  const [removedHeadshot, setRemovedHeadshot] = useState(false);
  const [removedFullbody, setRemovedFullbody] = useState(false);
  const [removedOthers, setRemovedOthers] = useState<Set<number>>(new Set());

  const others = media.otherPicturesUrl ?? [];

  // subir/editar
  const pick = (slot: 'headshot' | 'fullbody') => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;
    const localUrl = await fileToDataUrl(file);
    setPreview((prev) => ({ ...prev, [slot]: localUrl }));
    setPending((prev) => new Set(prev).add(slot));

    upload(
      { file, slot },
      {
        onSuccess: () => setBust((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 })),
        onSettled: () =>
          setPending((prev) => {
            const n = new Set(prev);
            n.delete(slot);
            return n;
          }),
      }
    );
  };

  const pickOther = (index: number) => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;
    const localUrl = await fileToDataUrl(file);
    setOtherPreview((p) => ({ ...p, [index]: localUrl }));
    setOtherPending((p) => new Set(p).add(index));

    upload(
      { file, slot: 'other', index },
      {
        onSuccess: () => setOtherBust((b) => ({ ...b, [index]: (b[index] ?? 0) + 1 })),
        onSettled: () =>
          setOtherPending((p) => {
            const n = new Set(p);
            n.delete(index);
            return n;
          }),
      }
    );
  };

  // borrar (usa hook) — le pasamos la URL explícita
  const onDeleteHeadshot = async () => {
    const url = media.headshotImageUrl ?? undefined;
    if (!url) return;
    setRemovedHeadshot(true);
    try {
      await removeMedia({ slot: 'headshot', url });
    } catch {
      setRemovedHeadshot(false);
    }
  };

  const onDeleteFullbody = async () => {
    const url = media.fullBodyImageUrl ?? undefined;
    if (!url) return;
    setRemovedFullbody(true);
    try {
      await removeMedia({ slot: 'fullbody', url });
    } catch {
      setRemovedFullbody(false);
    }
  };

  const onDeleteOther = async (index: number) => {
    const url = (media.otherPicturesUrl ?? [])[index] ?? undefined;
    if (!url) return;
    setRemovedOthers((s) => new Set(s).add(index));
    setOtherPending((s) => new Set(s).add(index));
    try {
      await removeMedia({ slot: 'other', index, url });
    } finally {
      setOtherPending((s) => {
        const n = new Set(s);
        n.delete(index);
        return n;
      });
    }
  };

  // ----- HAS IMAGE? -> decide openOnClick dinámico -----
  const headshotHasImage = (!removedHeadshot && !!media.headshotImageUrl) || !!preview.headshot;
  const fullbodyHasImage = (!removedFullbody && !!media.fullBodyImageUrl) || !!preview.fullbody;

  const otherHasImage = (i: number) =>
    (!removedOthers.has(i) && typeof others[i] === 'string' && (others[i] as string).trim().length > 0) ||
    !!otherPreview[i];

  return (
    <article className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.media.headshot_fullbody')}</Label>
        <div className="flex flex-row items-center gap-2">
          <UploadTile
            label={t('general.placeholder.headshot')}
            value={
              removedHeadshot || pending.has('headshot') ? undefined : withBust(media.headshotImageUrl, bust.headshot)
            }
            previewUrl={preview.headshot ?? null}
            onSelect={pick('headshot')}
            disabled={pending.has('headshot')}
            busy={pending.has('headshot')}
            busyText={t('state.loading')}
            bustKey={undefined}
            accept="image/*"
            maxSizeMB={8}
            objectFit="cover"
            openOnClick={!headshotHasImage} // ⬅️ click en tile solo si está vacío
            onDeleteClick={onDeleteHeadshot}
          />

          <UploadTile
            label={t('general.placeholder.fullbody')}
            value={
              removedFullbody || pending.has('fullbody') ? undefined : withBust(media.fullBodyImageUrl, bust.fullbody)
            }
            previewUrl={preview.fullbody ?? null}
            onSelect={pick('fullbody')}
            disabled={pending.has('fullbody')}
            busy={pending.has('fullbody')}
            busyText={t('state.loading')}
            bustKey={undefined}
            accept="image/*"
            maxSizeMB={8}
            objectFit="cover"
            openOnClick={!fullbodyHasImage} // ⬅️ click en tile solo si está vacío
            onDeleteClick={onDeleteFullbody}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.media.other')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: OTHER_SLOTS }, (_, i) => {
            const isRemoved = removedOthers.has(i);
            const hasImg = otherHasImage(i);
            return (
              <UploadTile
                key={i}
                value={
                  isRemoved || otherPending.has(i) ? undefined : withBust(others[i] as string | null, otherBust[i])
                }
                previewUrl={otherPreview[i] ?? null}
                busy={otherPending.has(i)}
                busyText={t('state.loading')}
                bustKey={undefined}
                onSelect={pickOther(i)}
                accept="image/*"
                maxSizeMB={8}
                objectFit="cover"
                aspectRatio="3 / 4"
                multiple={false}
                openOnClick={!hasImg} // ⬅️ click en tile solo si está vacío
                onDeleteClick={() => onDeleteOther(i)}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}
