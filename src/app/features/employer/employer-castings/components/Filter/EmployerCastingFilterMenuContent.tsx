import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { MultiSelectDropdown } from 'autocasting-ui-library-padimasso';
import type { EmployerCastingsFiltersState } from './EmployerCastingsFilterBar';

export default function EmployerCastingsFilterMenuContent({
  value,
  onChange,
}: {
  value: EmployerCastingsFiltersState;
  onChange: (next: EmployerCastingsFiltersState) => void;
}) {
  const { t } = useTranslation();

  const projectTypesRaw = useCachedSiteMetadataSlice('projectTypeOptions');
  const castingStatusesRaw = useCachedSiteMetadataSlice('castingStatusOptions');

  const selectedProjectTypes = value.projectTypeIds ?? [];
  const selectedStatusToken = value.statusIdTokens ?? [];

  const handleReset = () => {
    onChange({
      projectTypeIds: undefined,
      statusIdTokens: undefined,
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
            onChange={(next) => onChange({ ...value, projectTypeIds: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('employer_castings.casting_card.status.status')}</h3>
          <MultiSelectDropdown
            options={castingStatusesRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={selectedStatusToken}
            onChange={(next) => onChange({ ...value, statusIdTokens: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>
      </article>
      <button
        type="button"
        className="cursor-pointer text-sm underline font-light text-[var(--color-primary-purple)]"
        onClick={() => handleReset()}
      >
        {t('general.filter.reset')}
      </button>
    </section>
  );
}
