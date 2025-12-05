import { useQueryClient } from '@tanstack/react-query';
import { Label } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileMediaDelete } from '../../../../../integrations/supabase/media/hooks/useProfileMediaDelete';
import { useProfileMediaPatch } from '../../../../../integrations/supabase/media/hooks/useProfileMediaPatch';
import UploadTile from '../../../../../shared/components/UploadTile/UploadTile';
import { fileSchema, OTHER_SLOTS, otherIndexSchema } from '../../schemas/mediaSchema';
import { TALENT_PROFILE_CACHE_KEY } from '../../services/talentProfileService';
import type { Media } from '../../types/talentProfile.types';

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
  const [errHeadshot, setErrHeadshot] = useState<string | null>(null);
  const [errFullbody, setErrFullbody] = useState<string | null>(null);
  const [errOther, setErrOther] = useState<Record<number, string | null>>({});

  const others = liveMedia.otherPicturesUrl ?? [];

  const pick = (slot: 'headshot' | 'fullbody') => async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      if (slot === 'headshot') setErrHeadshot(msg);
      else setErrFullbody(msg);
      return;
    }

    if (slot === 'headshot') setErrHeadshot(null);
    else setErrFullbody(null);

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
          qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
            prev ? { ...prev, media: updated } : prev
          );
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

    const idxRes = otherIndexSchema(t).safeParse(index);
    if (!idxRes.success) {
      const msg = idxRes.error.errors[0]?.message ?? t('state.server_err');
      setErrOther((m) => ({ ...m, [index]: msg }));
      return;
    }

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      setErrOther((m) => ({ ...m, [index]: msg }));
      return;
    }

    setErrOther((m) => ({ ...m, [index]: null }));

    const localUrl = await fileToDataUrl(file);
    setOtherPreview((p) => ({ ...p, [index]: localUrl }));
    setOtherPending((p) => new Set(p).add(index));

    upload(
      { file, slot: 'other', index },
      {
        onSuccess: (updated) => {
          setLiveMedia(updated);
          setOtherPreview((p) => ({ ...p, [index]: undefined }));
          setOtherBust((b) => ({ ...b, [index]: (b[index] ?? 0) + 1 }));
          setRemovedOthers((s) => {
            if (!s.has(index)) return s;
            const n = new Set(s);
            n.delete(index);
            return n;
          });
          qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
            prev ? { ...prev, media: updated } : prev
          );
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
    setErrHeadshot(null);
    const url = liveMedia.headshotImageUrl ?? undefined;
    setRemovedHeadshot(true);
    try {
      const updated = await removeMedia({ slot: 'headshot', url });
      setLiveMedia(updated);
      setPreview((p) => ({ ...p, headshot: undefined }));
      setRemovedHeadshot(false);
      qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
        prev ? { ...prev, media: updated } : prev
      );
    } catch {
      setRemovedHeadshot(false);
    }
  };

  const onDeleteFullbody = async () => {
    setErrFullbody(null);
    const url = liveMedia.fullBodyImageUrl ?? undefined;
    setRemovedFullbody(true);
    try {
      const updated = await removeMedia({ slot: 'fullbody', url });
      setLiveMedia(updated);
      setPreview((p) => ({ ...p, fullbody: undefined }));
      setRemovedFullbody(false);
      qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
        prev ? { ...prev, media: updated } : prev
      );
    } catch {
      setRemovedFullbody(false);
    }
  };

  const onDeleteOther = async (index: number) => {
    setErrOther((m) => ({ ...m, [index]: null }));
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
      qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
        prev ? { ...prev, media: updated } : prev
      );
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
    <article className="flex flex-col gap-2">
      <Label className="text-base font-semibold">{t('profile.media.photos')}</Label>

      <div className="w-full max-w-[550px] grid grid-cols-2 gap-2 lg:max-w-none lg:grid-cols-4">
        <div className="w-full aspect-[3/4]">
          <UploadTile
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
            className="w-full h-full"
          />
          {errHeadshot && <span className="text-xs text-red-600">{errHeadshot}</span>}
        </div>

        <div className="w-full aspect-[3/4]">
          <UploadTile
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
            className="w-full h-full"
          />
          {errFullbody && <span className="text-xs text-red-600">{errFullbody}</span>}
        </div>

        {Array.from({ length: OTHER_SLOTS }, (_, i) => {
          const isRemoved = removedOthers.has(i);
          const hasImg = otherHasImage(i);

          return (
            <div key={i} className="w-full aspect-[3/4]">
              <UploadTile
                value={
                  isRemoved || otherPending.has(i) ? undefined : withBust(others[i] as string | null, otherBust[i])
                }
                previewUrl={otherPreview[i] ?? null}
                onSelect={pickOther(i)}
                disabled={otherPending.has(i)}
                busy={otherPending.has(i)}
                busyText={t('state.loading')}
                bustKey={undefined}
                accept="image/*"
                maxSizeMB={8}
                objectFit="cover"
                multiple={false}
                openOnClick={!hasImg}
                onDeleteClick={() => onDeleteOther(i)}
                className="w-full h-full"
              />
              {errOther[i] && <span className="text-xs text-red-600 block">{errOther[i]}</span>}
            </div>
          );
        })}
      </div>
    </article>
  );
}

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
