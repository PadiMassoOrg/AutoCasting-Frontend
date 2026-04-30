import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import {
  collapseTalentCastingApplicationStatusIdsForDisplay,
  expandTalentCastingApplicationStatusIdsForBackend,
  getDisplayableCastingStatuses,
} from '../../../../sitemetadata/utils/siteMetadataUtils';
import { MultiSelectDropdown } from 'autocasting-ui-library-padimasso';
import type { TalentCastingApplicationsFiltersState } from './TalentCastingApplicationFilterBar';

export default function TalentCastingApplicationFilterMenuContent({
  value,
  onChange,
}: {
  value: TalentCastingApplicationsFiltersState;
  onChange: (next: TalentCastingApplicationsFiltersState) => void;
}) {
  const { t } = useTranslation();

  const projectTypesRaw = useCachedSiteMetadataSlice('projectTypeOptions');
  const castingStatusesRaw = useCachedSiteMetadataSlice('castingStatusOptions');
  const castingModalitiesRaw = useCachedSiteMetadataSlice('castingModalityOptions');

  const visibleCastingStatuses = getDisplayableCastingStatuses(castingStatusesRaw);

  const selectedProjectTypes = value.projectTypeIdTokens ?? [];
  const selectedStatusTokens = value.castingStatusIdTokens ?? [];
  const selectedModalityTokens = value.modalityIdTokens ?? [];

  const visibleSelectedStatusIds = collapseTalentCastingApplicationStatusIdsForDisplay({
    selectedBackendIds: selectedStatusTokens,
    visibleStatuses: visibleCastingStatuses,
    allStatuses: castingStatusesRaw,
  });

  const handleCastingStatusChange = (nextVisibleIds: string[]) => {
    const expandedIds = expandTalentCastingApplicationStatusIdsForBackend({
      selectedVisibleIds: nextVisibleIds,
      allStatuses: castingStatusesRaw,
    });

    onChange({
      ...value,
      castingStatusIdTokens: expandedIds.length ? expandedIds : undefined,
    });
  };

  const handleReset = () => {
    onChange({
      projectTypeIdTokens: undefined,
      castingStatusIdTokens: undefined,
      modalityIdTokens: undefined,
      search: value.search,
    });
  };

  return (
    <section className="min-w-[300px]">
      <article className="flex flex-col">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('casting.basic_info.project_type')}</h3>
          <MultiSelectDropdown
            options={projectTypesRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={selectedProjectTypes}
            onChange={(next) =>
              onChange({
                ...value,
                projectTypeIdTokens: next.length ? next : undefined,
              })
            }
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('employer_castings.casting_card.status.status')}</h3>
          <MultiSelectDropdown
            options={visibleCastingStatuses}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={visibleSelectedStatusIds}
            onChange={handleCastingStatusChange}
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('casting.basic_info.casting_modality')}</h3>
          <MultiSelectDropdown
            options={castingModalitiesRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={selectedModalityTokens}
            onChange={(next) =>
              onChange({
                ...value,
                modalityIdTokens: next.length ? next : undefined,
              })
            }
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>
      </article>

      <button
        type="button"
        className="cursor-pointer text-sm underline font-light text-[var(--color-primary-purple)]"
        onClick={handleReset}
      >
        {t('general.filter.reset')}
      </button>
    </section>
  );
}
