import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { OverflowMenuItem } from '../../../../shared/components/OverflowMenu';
import { copyToClipboardGraceful } from '../../../../shared/utils/domUtils';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
} from '../../../sitemetadata/utils/siteMetadataUtils';

type Params = {
  employerCastingDetailsPath: string;
  publicCastingDetailsPath: string;
  editCastingPath?: string;
  onApplicants: () => void;
  onDelete?: () => void | Promise<void>;
  deleteDisabled?: boolean;
  statusCode?: string | null;
};

type Visibility = {
  details: boolean;
  applicants: boolean;
  copyLink: boolean;
  edit: boolean;
  delete: boolean;
};

const VISIBILITY_BY_STATUS: Record<string, Visibility> = {
  [CASTING_STATUS_DRAFT]: { details: false, applicants: false, copyLink: false, edit: true, delete: true },
  [CASTING_STATUS_CLOSED]: { details: true, applicants: true, copyLink: false, edit: false, delete: true },
  [CASTING_STATUS_PAUSED]: { details: true, applicants: true, copyLink: true, edit: true, delete: true },
  [CASTING_STATUS_PUBLISHED]: { details: true, applicants: true, copyLink: true, edit: true, delete: true },
  [CASTING_STATUS_ARCHIVED]: { details: true, applicants: true, copyLink: false, edit: false, delete: true },
};

function resolveVisibility(statusCode?: string | null): Visibility {
  if (!statusCode) return { details: true, applicants: false, copyLink: false, edit: false, delete: true };
  return (
    VISIBILITY_BY_STATUS[statusCode] ?? { details: true, applicants: false, copyLink: false, edit: false, delete: true }
  );
}

export const useCastingOverflowMenuItems = ({
  employerCastingDetailsPath,
  publicCastingDetailsPath,
  editCastingPath,
  onApplicants,
  onDelete,
  deleteDisabled = false,
  statusCode,
}: Params): OverflowMenuItem[] => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMemo(() => {
    const v = resolveVisibility(statusCode);

    const items: OverflowMenuItem[] = [
      {
        key: 'details',
        label: t('employer_castings.actions.view_details'),
        iconName: 'open',
        disabled: !v.details,
        onSelect: () => navigate(employerCastingDetailsPath),
      },
      {
        key: 'applicants',
        label: t('employer_castings.actions.view_applicants'),
        iconName: 'applicants',
        disabled: !v.applicants,
        onSelect: () => onApplicants(),
      },
      {
        key: 'copy_link',
        label: t('employer_castings.actions.copy_link'),
        iconName: 'copyLink',
        disabled: !v.copyLink,
        onSelect: async () => {
          const url = new URL(publicCastingDetailsPath, window.location.origin).toString();
          await copyToClipboardGraceful(url);
          alert(t('general.copied'));
        },
      },
    ];

    items.push({
      key: 'edit',
      label: t('general.edit'),
      iconName: 'edit',
      disabled: !v.edit || !editCastingPath,
      onSelect: () => {
        if (!editCastingPath) return;
        navigate(editCastingPath);
      },
    });

    if (onDelete) {
      items.push({ type: 'separator', key: 'sep-1' } as OverflowMenuItem);
      items.push({
        key: 'delete',
        label: t('general.delete'),
        iconName: 'delete',
        destructive: true,
        disabled: !v.delete || deleteDisabled,
        onSelect: () => onDelete(),
      });
    }

    return items;
  }, [
    t,
    navigate,
    employerCastingDetailsPath,
    publicCastingDetailsPath,
    editCastingPath,
    onApplicants,
    onDelete,
    deleteDisabled,
    statusCode,
  ]);
};
