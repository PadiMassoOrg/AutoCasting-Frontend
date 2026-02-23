import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
} from '../../../../sitemetadata/utils/siteMetadataUtils';
import { usePublishCastingMutation } from '../status/usePublishCastingMutation';
// cuando existan:
// import { usePauseCastingMutation } from '../status/usePauseCastingMutation';
// import { useCloseCastingMutation } from '../status/useCloseCastingMutation';
// import { useArchiveCastingMutation } from '../status/useArchiveCastingMutation';
// import { useDraftCastingMutation } from '../status/useDraftCastingMutation';

type SetStatusParams = {
  id: string;
  slug?: string;
};

export function useCastingStatusActions() {
  const publish = usePublishCastingMutation();
  // const pause = usePauseCastingMutation();
  // const close = useCloseCastingMutation();
  // const archive = useArchiveCastingMutation();
  // const draft = useDraftCastingMutation();

  const isPending = publish.isPending;
  // || pause.isPending
  // || close.isPending
  // || archive.isPending
  // || draft.isPending
  const setStatus = async (next: SiteMetadataObject, params: SetStatusParams) => {
    switch (next.stringCode) {
      case CASTING_STATUS_PUBLISHED:
        await publish.mutateAsync({ id: params.id, slug: params.slug });
        return;

      case CASTING_STATUS_DRAFT:
        // await draft.mutateAsync({ id: params.id, slug: params.slug });
        return;

      case CASTING_STATUS_PAUSED:
        // await pause.mutateAsync({ id: params.id, slug: params.slug });
        return;

      case CASTING_STATUS_CLOSED:
        // await close.mutateAsync({ id: params.id, slug: params.slug });
        return;

      case CASTING_STATUS_ARCHIVED:
        // await archive.mutateAsync({ id: params.id, slug: params.slug });
        return;

      default:
        return;
    }
  };

  const setStatusByCode = async (stringCode: string, params: SetStatusParams) => {
    await setStatus({ id: stringCode, stringCode }, params);
  };

  return {
    setStatus,
    setStatusByCode,
    isPending,
  };
}
