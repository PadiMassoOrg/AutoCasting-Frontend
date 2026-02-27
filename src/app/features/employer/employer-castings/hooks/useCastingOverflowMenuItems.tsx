import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { OverflowMenuItem } from '../../../../shared/components/OverflowMenu';
import { copyToClipboardGraceful } from '../../../../shared/utils/domUtils';

type Params = {
  employerCastingDetailsPath: string;
  editCastingPath?: string;
  disablePublicActions: boolean;
  onApplicants?: () => void;
  onDelete?: () => void | Promise<void>;
  deleteDisabled?: boolean;
};

export const useCastingOverflowMenuItems = ({
  employerCastingDetailsPath,
  editCastingPath,
  disablePublicActions,
  onApplicants,
  onDelete,
  deleteDisabled = false,
}: Params): OverflowMenuItem[] => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMemo(() => {
    const items: OverflowMenuItem[] = [
      {
        key: 'details',
        label: t('employer_castings.actions.view_details'),
        iconName: 'open',
        disabled: disablePublicActions,
        onSelect: () => navigate(employerCastingDetailsPath),
      },
      {
        key: 'applicants',
        label: t('employer_castings.actions.view_applicants'),
        iconName: 'applicants',
        disabled: disablePublicActions,
        onSelect: () => (onApplicants ? onApplicants() : console.log('view_applicants')),
      },
      {
        key: 'copy_link',
        label: t('employer_castings.actions.copy_link'),
        iconName: 'copyLink',
        disabled: disablePublicActions,
        onSelect: () => {
          const url = new URL(employerCastingDetailsPath, window.location.origin).toString();
          void copyToClipboardGraceful(url);
        },
      },
    ];

    if (editCastingPath) {
      items.push({
        key: 'edit',
        label: t('general.edit'),
        iconName: 'edit',
        onSelect: () => navigate(editCastingPath),
      });
    }

    if (onDelete) {
      items.push({ type: 'separator', key: 'sep-1' } as OverflowMenuItem);
      items.push({
        key: 'delete',
        label: t('general.delete'),
        iconName: 'delete',
        destructive: true,
        disabled: deleteDisabled,
        onSelect: () => onDelete(),
      });
    }

    return items;
  }, [
    t,
    navigate,
    employerCastingDetailsPath,
    editCastingPath,
    disablePublicActions,
    onApplicants,
    onDelete,
    deleteDisabled,
  ]);
};
