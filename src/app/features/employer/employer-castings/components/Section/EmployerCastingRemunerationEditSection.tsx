import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSectionRemunerations } from '../../hooks/useSectionRemunerations';

const EmployerCastingRemunerationEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionRemunerations(sectionId);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.remuneration.remuneration')} />
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
