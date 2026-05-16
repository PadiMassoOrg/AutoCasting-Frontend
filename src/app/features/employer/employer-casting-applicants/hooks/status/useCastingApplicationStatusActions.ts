import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import {
  CASTING_APPLICATION_STATUS_BLANK,
  CASTING_APPLICATION_STATUS_NOT_PROCEEDING,
  CASTING_APPLICATION_STATUS_PRESELECTED,
  CASTING_APPLICATION_STATUS_SELECTED,
  CASTING_APPLICATION_STATUS_VIEWED,
} from '../../../../sitemetadata/utils/siteMetadataUtils';
import {
  useCastingApplicationStatusMutation,
  type CastingApplicationStatusAction,
} from './useCastingApplicationStatusMutation';

type SetStatusParams = {
  applicationId: string;
  castingSlug: string;
};

const actionByStatusCode: Record<string, CastingApplicationStatusAction> = {
  [CASTING_APPLICATION_STATUS_PRESELECTED]: 'preselect',
  [CASTING_APPLICATION_STATUS_SELECTED]: 'select',
  [CASTING_APPLICATION_STATUS_VIEWED]: 'view',
  [CASTING_APPLICATION_STATUS_NOT_PROCEEDING]: 'notProceeding',
  [CASTING_APPLICATION_STATUS_BLANK]: 'blank',
};

const allowedStatusCodes = Object.keys(actionByStatusCode);

export function useCastingApplicationStatusActions() {
  const preselect = useCastingApplicationStatusMutation('preselect');
  const select = useCastingApplicationStatusMutation('select');
  const view = useCastingApplicationStatusMutation('view');
  const notProceeding = useCastingApplicationStatusMutation('notProceeding');
  const blank = useCastingApplicationStatusMutation('blank');
  const bulk = useCastingApplicationStatusMutation('bulk');

  const isPending =
    preselect.isPending ||
    select.isPending ||
    view.isPending ||
    notProceeding.isPending ||
    blank.isPending ||
    bulk.isPending;

  const setStatus = async (next: SiteMetadataObject, params: SetStatusParams) => {
    const action = actionByStatusCode[next.stringCode];
    if (!action) return;

    switch (action) {
      case 'preselect':
        await preselect.mutateAsync({ applicationId: params.applicationId, castingSlug: params.castingSlug });
        return;
      case 'select':
        await select.mutateAsync({ applicationId: params.applicationId, castingSlug: params.castingSlug });
        return;
      case 'view':
        await view.mutateAsync({ applicationId: params.applicationId, castingSlug: params.castingSlug });
        return;
      case 'notProceeding':
        await notProceeding.mutateAsync({ applicationId: params.applicationId, castingSlug: params.castingSlug });
        return;
      case 'blank':
        await blank.mutateAsync({ applicationId: params.applicationId, castingSlug: params.castingSlug });
        return;
      default:
        return;
    }
  };

  const bulkSetStatusByCode = async (stringCode: string, params: { applicationIds: string[]; castingSlug: string }) => {
    if (!allowedStatusCodes.includes(stringCode)) return;
    await bulk.mutateAsync({
      applicationIds: params.applicationIds,
      castingSlug: params.castingSlug,
      applicationStatus: stringCode,
    });
  };

  return {
    setStatus,
    bulkSetStatusByCode,
    isPending,
  };
}
