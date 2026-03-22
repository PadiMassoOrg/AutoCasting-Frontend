import { useTranslation } from 'react-i18next';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { MultiSelectDropdown } from '../../../../talent-database/components/Filter';
import type { EmployerCastingApplicantsFiltersState } from './CastingApplicantsFilterBar';

export default function CastingApplicantsFilterMenuContent({
  value,
  onChange,
}: {
  value: EmployerCastingApplicantsFiltersState;
  onChange: (next: EmployerCastingApplicantsFiltersState) => void;
}) {
  const { t } = useTranslation();

  const applicationStatusesRaw = useCachedSiteMetadataSlice('castingApplicationStatusOptions');
  const professionsRaw = useCachedSiteMetadataSlice('professions');

  const selectedApplicationStatuses = value.applicationStatusIdTokens ?? [];
  const selectedProfessions = value.professionIds ?? [];

  const handleReset = () => {
    onChange({
      ...value,
      applicationStatusIdTokens: undefined,
      professionIds: undefined,
    });
  };

  return (
    <section className="min-w-[300px]">
      <article className="flex flex-col">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('general.status')}</h3>
          <MultiSelectDropdown
            options={applicationStatusesRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={selectedApplicationStatuses}
            onChange={(next) => onChange({ ...value, applicationStatusIdTokens: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            hideSelectAll
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('profile.basic_info.profession')}</h3>
          <MultiSelectDropdown
            options={professionsRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={selectedProfessions}
            onChange={(next) => onChange({ ...value, professionIds: next.length ? next : undefined })}
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
