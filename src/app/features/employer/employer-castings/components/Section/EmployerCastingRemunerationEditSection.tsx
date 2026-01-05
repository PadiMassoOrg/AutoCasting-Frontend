import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { RadioGroupField } from '../../../../../shared/components/Form';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCastingRemunerationsSectionAutosave } from '../../hooks/autosaves';
import { useSectionRemunerations } from '../../hooks/useSectionRemunerations';

const EmployerCastingRemunerationEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionRemunerations(sectionId);
  const compensationTypeOptions = useCachedSiteMetadataOption('castingCompensationTypeOptions', t);
  const payRateTypeOptions = useCachedSiteMetadataOption('payRateTypeOptions', t);
  const currencyTypeOptions = useCachedSiteMetadataOption('currencyOptions', t);

  const sectionAutosave = useCastingRemunerationsSectionAutosave(sectionId);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  const selectedCompensationTypeId = data.compensationType?.id ?? '';

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.remuneration.remuneration')} />
      <div className="mt-2">
        <RadioGroupField
          value={selectedCompensationTypeId}
          options={compensationTypeOptions}
          optionsWrapperClassName="w-full flex flex-row items-center gap-4 lg:gap-8"
          optionClassName="flex items-center gap-2 text-sm lg:text-base"
          onValueChange={(nextId) => {
            if (!nextId) return;
            if (nextId === selectedCompensationTypeId) return;

            sectionAutosave.immediate({
              id: sectionId,
              castingCompensationTypeId: nextId,
            });
          }}
        />
      </div>
      {data.remunerations.map((r) => {
        return (
          <SectionCard key={r.id}>
            <h2 className="text-base font-semibold">{r.roleName}</h2>
          </SectionCard>
        );
      })}
    </DashboardSection>
  );
};

export default EmployerCastingRemunerationEditSection;
