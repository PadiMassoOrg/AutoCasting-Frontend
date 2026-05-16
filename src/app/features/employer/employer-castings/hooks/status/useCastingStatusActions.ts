import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
} from '../../../../sitemetadata/utils/siteMetadataUtils';

import { useCastingStatusMutation, type CastingStatusAction } from '../status/useCastingStatusMutation';

type SetStatusParams = {
  id: string;
  slug?: string;
};

const actionByStatusCode: Record<string, CastingStatusAction> = {
  [CASTING_STATUS_PUBLISHED]: 'publish',
  [CASTING_STATUS_DRAFT]: 'draft',
  [CASTING_STATUS_PAUSED]: 'pause',
  [CASTING_STATUS_CLOSED]: 'close',
  [CASTING_STATUS_ARCHIVED]: 'archive',
};

export function useCastingStatusActions() {
  const publish = useCastingStatusMutation('publish');
  const draft = useCastingStatusMutation('draft');
  const pause = useCastingStatusMutation('pause');
  const close = useCastingStatusMutation('close');
  const archive = useCastingStatusMutation('archive');

  const isPending = publish.isPending || draft.isPending || pause.isPending || close.isPending || archive.isPending;

  const setStatus = async (next: SiteMetadataObject, params: SetStatusParams) => {
    const action = actionByStatusCode[next.stringCode];
    if (!action) return;

    switch (action) {
      case 'publish':
        await publish.mutateAsync({ id: params.id, slug: params.slug });
        return;
      case 'draft':
        await draft.mutateAsync({ id: params.id, slug: params.slug });
        return;
      case 'pause':
        await pause.mutateAsync({ id: params.id, slug: params.slug });
        return;
      case 'close':
        await close.mutateAsync({ id: params.id, slug: params.slug });
        return;
      case 'archive':
        await archive.mutateAsync({ id: params.id, slug: params.slug });
        return;
      default:
        return;
    }
  };

  return {
    setStatus,
    isPending,
  };
}
