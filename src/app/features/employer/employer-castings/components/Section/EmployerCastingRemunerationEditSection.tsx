import { Label } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { RadioGroupField } from '../../../../../shared/components/Form';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCastingRemunerationsSectionAutosave } from '../../hooks/autosaves';
import { useSectionRemunerations } from '../../hooks/useSectionRemunerations';
import RoleRemunerationEditCard from '../Form/Remuneration/RoleRemunerationEditCard';

const EmployerCastingRemunerationEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionRemunerations(sectionId);
  const compensationTypeOptions = useCachedSiteMetadataOption('castingCompensationTypeOptions', t);
  const sectionAutosave = useCastingRemunerationsSectionAutosave(sectionId);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  const selectedCompensationTypeId = data.compensationType.id;

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.remunerations.title')} />
      {data.remunerations.length > 0 ? (
        <>
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
          {data.remunerations.map((r: any) => {
            return <RoleRemunerationEditCard key={r.id} sectionId={sectionId} data={r} />;
          })}
        </>
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-2 lg:pt-6">
          {t('employer_castings.page.empty_remunerations')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRemunerationEditSection;
