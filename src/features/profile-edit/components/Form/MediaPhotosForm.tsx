import { useQueryClient } from '@tanstack/react-query';
import { Label } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileMediaDelete } from '../../../supabase/media/hooks/useProfileMediaDelete';
import { useProfileMediaPatch } from '../../../supabase/media/hooks/useProfileMediaPatch';
import { PROFILE_CACHE_KEY } from '../../services/profileService';
import type { Media } from '../../types/profile.types';
import UploadTile from '../UploadTile/UploadTile';

const OTHER_SLOTS = 6;

export default function MediaForm({ media, supabaseId }: { media: Media; supabaseId: string }) {
  const qc = useQueryClient();
  const { t } = useTranslation();
  const { mutate: upload } = useProfileMediaPatch(supabaseId);
  const { mutateAsync: removeMedia } = useProfileMediaDelete();

  const [liveMedia, setLiveMedia] = useState<Media>(media);

  useEffect(() => setLiveMedia(media), [media]);

  const [preview, setPreview] = useState<Partial<Record<'headshot' | 'fullbody', string>>>({});
  const [pending, setPending] = useState<Set<'headshot' | 'fullbody'>>(new Set());
  const [bust, setBust] = useState<Partial<Record<'headshot' | 'fullbody', number>>>({});
  const [otherPreview, setOtherPreview] = useState<Record<number, string | undefined>>({});
  const [otherPending, setOtherPending] = useState<Set<number>>(new Set());
  const [otherBust, setOtherBust] = useState<Record<number, number | undefined>>({});
  const [removedHeadshot, setRemovedHeadshot] = useState(false);
  const [removedFullbody, setRemovedFullbody] = useState(false);
  const [removedOthers, setRemovedOthers] = useState<Set<number>>(new Set());

  const others = liveMedia.otherPicturesUrl ?? [];

  const pick = (slot: 'headshot' | 'fullbody') => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;
    const localUrl = await fileToDataUrl(file);
    setPreview((prev) => ({ ...prev, [slot]: localUrl }));
    setPending((prev) => new Set(prev).add(slot));

    upload(
      { file, slot },
      {
        onSuccess: (updated) => {
          setLiveMedia(updated);
          setPreview((p) => ({ ...p, [slot]: undefined }));
          setBust((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 }));
          if (slot === 'headshot') setRemovedHeadshot(false);
          if (slot === 'fullbody') setRemovedFullbody(false);
          qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
        },
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
        onSuccess: (updated) => {
          setLiveMedia(updated);
          // limpiamos solo el preview del índice subido
          setOtherPreview((p) => ({ ...p, [index]: undefined }));
          setOtherBust((b) => ({ ...b, [index]: (b[index] ?? 0) + 1 }));
          // si lo habíamos marcado como "removed", lo sacamos
          setRemovedOthers((s) => {
            if (!s.has(index)) return s;
            const n = new Set(s);
            n.delete(index);
            return n;
          });
          qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
        },
        onSettled: () =>
          setOtherPending((p) => {
            const n = new Set(p);
            n.delete(index);
            return n;
          }),
      }
    );
  };

  const onDeleteHeadshot = async () => {
    const url = liveMedia.headshotImageUrl ?? undefined;
    setRemovedHeadshot(true);
    try {
      const updated = await removeMedia({ slot: 'headshot', url });
      setLiveMedia(updated);
      setPreview((p) => ({ ...p, headshot: undefined }));
      setRemovedHeadshot(false);
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
    } catch {
      setRemovedHeadshot(false);
    }
  };

  const onDeleteFullbody = async () => {
    const url = liveMedia.fullBodyImageUrl ?? undefined;
    setRemovedFullbody(true);
    try {
      const updated = await removeMedia({ slot: 'fullbody', url });
      setLiveMedia(updated);
      setPreview((p) => ({ ...p, fullbody: undefined }));
      setRemovedFullbody(false);
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
    } catch {
      setRemovedFullbody(false);
    }
  };

  const onDeleteOther = async (index: number) => {
    const url = (liveMedia.otherPicturesUrl ?? [])[index] ?? undefined;
    setRemovedOthers((s) => new Set(s).add(index));
    setOtherPending((s) => new Set(s).add(index));
    try {
      const updated = await removeMedia({ slot: 'other', index, url });
      setLiveMedia(updated);
      setOtherPreview((p) => ({ ...p, [index]: undefined }));
      setRemovedOthers((s) => {
        const n = new Set(s);
        n.delete(index);
        return n;
      });
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
    } finally {
      setOtherPending((s) => {
        const n = new Set(s);
        n.delete(index);
        return n;
      });
    }
  };

  const headshotHasImage = (!removedHeadshot && !!liveMedia.headshotImageUrl) || !!preview.headshot;
  const fullbodyHasImage = (!removedFullbody && !!liveMedia.fullBodyImageUrl) || !!preview.fullbody;
  const otherHasImage = (i: number) =>
    (!removedOthers.has(i) && typeof others[i] === 'string' && (others[i] as string).trim().length > 0) ||
    !!otherPreview[i];

  return (
    <article className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.media.headshot_fullbody')}</Label>
        <div className="flex flex-row items-center gap-2">
          <UploadTile
            label={t('general.placeholder.headshot')}
            value={
              removedHeadshot || pending.has('headshot')
                ? undefined
                : withBust(liveMedia.headshotImageUrl, bust.headshot)
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
            openOnClick={!headshotHasImage}
            onDeleteClick={onDeleteHeadshot}
            className="max-w-64"
          />

          <UploadTile
            label={t('general.placeholder.fullbody')}
            value={
              removedFullbody || pending.has('fullbody')
                ? undefined
                : withBust(liveMedia.fullBodyImageUrl, bust.fullbody)
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
            openOnClick={!fullbodyHasImage}
            onDeleteClick={onDeleteFullbody}
            className="min-w-auto max-w-64"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-base font-semibold">{t('profile.media.other')}</Label>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-[repeat(3,max-content)]">
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
                openOnClick={!hasImg}
                onDeleteClick={() => onDeleteOther(i)}
                className="max-w-51"
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

// TODO - Move Helpers
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
