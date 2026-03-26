import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { ROUTES } from '../../../../shared/lib/routes';
import { isCastingEditable } from '../../../sitemetadata/utils/siteMetadataUtils';
import {
  EmployerCastingBasicInfoEditSection,
  EmployerCastingCheckoutEditSection,
  EmployerCastingRemunerationEditSection,
  EmployerCastingRequirementsEditSection,
  EmployerCastingRolesEditSection,
} from '../components/Section';
import { EmployerCastingIdsProvider } from '../context/EmployerCastingContext';
import { useEmployerCastingEditorBySlug } from '../hooks/useEmployerCastingDetailsBySlug';

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useEmployerCastingEditorBySlug(slug);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  if (!isCastingEditable(data.castingStatus)) {
    return <Navigate to={ROUTES.EMPLOYER_CASTINGS} replace />;
  }

  const { basicInfoSectionId, rolesSectionId, requirementsSectionId, remunerationSectionId } = data;

  const sections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      render: () => <EmployerCastingBasicInfoEditSection sectionId={basicInfoSectionId} />,
    },
    {
      key: 'roles',
      label: t('employer_castings.dashboard.roles.roles'),
      render: () => <EmployerCastingRolesEditSection sectionId={rolesSectionId} />,
    },
    {
      key: 'requirements',
      label: t('employer_castings.dashboard.requirements.requirements'),
      render: () => <EmployerCastingRequirementsEditSection sectionId={requirementsSectionId} />,
    },
    {
      key: 'remuneration',
      label: t('employer_castings.dashboard.remunerations.title'),
      render: () => <EmployerCastingRemunerationEditSection sectionId={remunerationSectionId} />,
    },
    {
      key: 'checkout',
      label: t('employer_castings.dashboard.checkout.checkout_and_publish'),
      render: () => <EmployerCastingCheckoutEditSection />,
    },
  ];

  return (
    <EmployerCastingIdsProvider value={data}>
      <DashboardShell title={t('employer_castings.dashboard.title_edit')} sections={sections} />
    </EmployerCastingIdsProvider>
  );
};

export default EmployerCastingPage;
