import {
  CheckboxField,
  ChevronUpDown,
  OverflowMenu,
  SearchInput,
  type OverflowMenuItem,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CastingStatusChip from '../../../../../shared/components/Chip/CastingStatusChip';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import type { EmployerCastingApplicantsFiltersState } from '../../types/employerCastingApplicantsFilter.types';

type RoleOption = {
  value: string;
  label: string;
};

type Props = {
  filters: EmployerCastingApplicantsFiltersState;
  onFiltersChange: (next: EmployerCastingApplicantsFiltersState) => void;
  roleOptions: RoleOption[];
  isGalleryMode: boolean;
  separateByRoles: boolean;
  onSeparateByRolesChange: (next: boolean) => void;
};

const triggerClassName =
  'inline-flex items-center gap-1 bg-[var(--color-primary-light-grey)] rounded-full px-1.5 pl-2.5 py-1';

const CastingApplicantsFilterBar = ({
  filters,
  onFiltersChange,
  roleOptions,
  isGalleryMode,
  separateByRoles,
  onSeparateByRolesChange,
}: Props) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  const applicationStatusesRaw = useCachedSiteMetadataSlice('castingApplicationStatusOptions') as
    | SiteMetadataObject[]
    | undefined;

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const selectedStatusId = filters.applicationStatusIdTokens?.[0];

  const selectedStatus = useMemo(
    () => (applicationStatusesRaw ?? []).find((status) => status.id === selectedStatusId),
    [applicationStatusesRaw, selectedStatusId]
  );

  const selectedRoleId = filters.roleId;
  const isRoleFiltered = !!selectedRoleId;
  const isSeparateByRolesChecked = isRoleFiltered || separateByRoles;
  const selectedRole = useMemo(
    () => roleOptions.find((role) => role.value === selectedRoleId),
    [roleOptions, selectedRoleId]
  );

  const statusItems = useMemo<OverflowMenuItem[]>(() => {
    const items: OverflowMenuItem[] = [
      {
        type: 'item',
        key: 'all-status',
        label: <span>{t('general.all')}</span>,
        onSelect: () => onFiltersChange({ ...filters, applicationStatusIdTokens: undefined }),
      },
    ];

    (applicationStatusesRaw ?? []).forEach((status) => {
      items.push({
        type: 'item',
        key: status.id,
        label: <CastingStatusChip status={status} variant="inline" align="spaced" />,
        onSelect: () => onFiltersChange({ ...filters, applicationStatusIdTokens: [status.id] }),
      });
    });

    return items;
  }, [applicationStatusesRaw, filters, onFiltersChange, t]);

  const roleItems = useMemo<OverflowMenuItem[]>(() => {
    const items: OverflowMenuItem[] = [
      {
        type: 'item',
        key: 'all-roles',
        label: <span>{t('general.all')}</span>,
        onSelect: () => onFiltersChange({ ...filters, roleId: undefined }),
      },
    ];

    roleOptions.forEach((role) => {
      items.push({
        type: 'item',
        key: role.value,
        label: <span>{role.label}</span>,
        onSelect: () => onFiltersChange({ ...filters, roleId: role.value }),
      });
    });

    return items;
  }, [filters, onFiltersChange, roleOptions, t]);

  return (
    <section className="flex flex-row items-center justify-between gap-2">
      <article className="w-full flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="w-full lg:w-[250px]">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onCommit={(v) => {
              const next = v.trim();
              const current = (filters.search ?? '').trim();

              if (next === current) return;

              onFiltersChange({
                ...filters,
                search: next.length ? next : undefined,
              });
            }}
            placeholder={t('general.search')}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm">{t('general.status')}:</span>
            <OverflowMenu
              align="start"
              side="bottom"
              items={statusItems}
              trigger={({ open, disabled }) => (
                <div
                  className={[
                    triggerClassName,
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-[var(--color-primary-white)]',
                  ].join(' ')}
                >
                  {selectedStatus ? (
                    <CastingStatusChip status={selectedStatus} variant="inline" />
                  ) : (
                    <span className="text-sm px-1">{t('general.all')}</span>
                  )}
                  {!selectedStatus && (
                    <span
                      className="inline-block h-5 w-5 rounded-full"
                      style={{ backgroundColor: 'var(--color-secondary-outline)' }}
                    />
                  )}
                  <ChevronUpDown open={open} sizePx={18} className="text-[var(--color-primary-black)]" />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm">{t('general.role')}:</span>
            <OverflowMenu
              align="start"
              side="bottom"
              items={roleItems}
              menuClassName="min-w-[220px]"
              trigger={({ open, disabled }) => (
                <div
                  className={[
                    triggerClassName,
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-[var(--color-primary-white)]',
                  ].join(' ')}
                >
                  <span className="text-sm px-1">{selectedRole?.label ?? t('general.all')}</span>
                  <ChevronUpDown open={open} sizePx={18} className="text-[var(--color-primary-black)]" />
                </div>
              )}
            />
          </div>

          {isGalleryMode && (
            <CheckboxField
              id="separate-by-roles"
              label={t('general.group.byRole')}
              checked={isSeparateByRolesChecked}
              disabled={isRoleFiltered}
              onCheckedChange={onSeparateByRolesChange}
            />
          )}
        </div>
      </article>
    </section>
  );
};

export default CastingApplicantsFilterBar;
