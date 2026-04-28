import { ChevronUpDown, Icon, OverflowMenu, type OverflowMenuItem } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CastingStatusChip from '../../../../../shared/components/Chip/CastingStatusChip';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';

type Props = {
  selectedCount: number;
  selectedEmails: string[];
  onBulkStatusSelect: (status: SiteMetadataObject) => void | Promise<void>;
  onClearSelection: () => void;
  isPending?: boolean;
};

const triggerClassName =
  'inline-flex items-center gap-1 bg-[var(--color-primary-light-grey)] rounded-full px-1.5 pl-2.5 py-1';

const CastingApplicantsBulkActionsBar = ({
  selectedCount,
  selectedEmails,
  onBulkStatusSelect,
  onClearSelection,
  isPending = false,
}: Props) => {
  const { t } = useTranslation();

  const applicationStatusesRaw = useCachedSiteMetadataSlice('castingApplicationStatusOptions') as
    | SiteMetadataObject[]
    | undefined;

  const statusItems = useMemo<OverflowMenuItem[]>(
    () =>
      (applicationStatusesRaw ?? []).map((status) => ({
        type: 'item',
        key: status.id,
        label: <CastingStatusChip status={status} variant="inline" align="spaced" />,
        onSelect: () => onBulkStatusSelect(status),
      })),
    [applicationStatusesRaw, onBulkStatusSelect]
  );

  const emailHref = useMemo(() => {
    const unique = Array.from(new Set(selectedEmails.filter(Boolean)));
    return `mailto:${unique.join(',')}`;
  }, [selectedEmails]);

  return (
    <section className="flex flex-row items-center justify-between gap-2 rounded-2xl bg-[var(--color-primary-white)] px-6 py-3">
      <article className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <p className="text-sm text-[var(--color-primary-purple)] font-semibold">
            {selectedCount} {t('employer_casting_applicants.bulk.selected')}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{t('employer_casting_applicants.bulk.change_status')}</span>
            <OverflowMenu
              align="start"
              side="bottom"
              items={statusItems}
              menuClassName="min-w-[220px]"
              trigger={({ open, disabled }) => (
                <div
                  className={[
                    triggerClassName,
                    disabled || isPending
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer bg-[var(--color-primary-light-grey)]',
                  ].join(' ')}
                >
                  <span className="text-sm px-1">{t('employer_casting_applicants.bulk.select')}</span>
                  <ChevronUpDown open={open} sizePx={18} className="text-[var(--color-primary-black)]" />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{t('general.actions')}:</span>
            <a
              href={emailHref}
              className="inline-flex items-center justify-center"
              title={t('profile.basic_info.email')}
            >
              <Icon name="mail" variant="primary" />
            </a>
          </div>
        </div>

        <button type="button" onClick={onClearSelection}>
          <Icon name="burgerClose" size={16} />
        </button>
      </article>
    </section>
  );
};

export default CastingApplicantsBulkActionsBar;
