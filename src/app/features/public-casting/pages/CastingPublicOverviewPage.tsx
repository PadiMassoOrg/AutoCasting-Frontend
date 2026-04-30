import { Label, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { getAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import CastingApplicationConfirmationModal from '../components/Form/CastingApplicationConfirmationModal';
import CastingApplicationRequirementsModal from '../components/Form/CastingApplicationRequirementsModal';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { useCastingApplicationMutation } from '../hooks/useCastingApplicationMutation';
import { usePublicCastingOverview } from '../hooks/usePublicCastingOverview';
import type { CastingRequirement, CastingRole } from '../types/publicCasting.types';
import type { CastingApplicationRequest } from '../types/requests';

const PublicCastingOverviewPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { mode } = useUserMode();
  const isAuth = getAuthToken();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const apply = useCastingApplicationMutation();

  const publicOverviewQuery = usePublicCastingOverview({ slug: slug! }, { enabled: !!slug });

  const data = publicOverviewQuery.data;
  const casting = data?.casting;
  const appliedRoleIds = data?.appliedRoleIds ?? [];
  const appliedIdsSet = new Set(appliedRoleIds);

  const isTalentLogged = Boolean(isAuth) && mode === USER_MODE_TALENT;

  const allRoles = casting?.rolesSection.roles ?? [];
  const hasRoles = allRoles.length > 0;
  const hasAppliedAnyRole = appliedIdsSet.size > 0;
  const appliedAllRoles = hasRoles && allRoles.every((role) => appliedIdsSet.has(role.id));

  const showApplyInfoSection = !isTalentLogged || hasAppliedAnyRole;
  const showApplyButton = true;

  const handleConfirmation = () => {
    closeModal();
    navigate(ROUTES.CASTING_DATABASE);
  };

  const openConfirmationModal = () => {
    openModal(
      <CastingApplicationConfirmationModal onConfirm={handleConfirmation} />,
      t('application.confirmation_modal.title'),
      'lg'
    );
  };

  const callBackendDirect = (roleId: string) => {
    apply.mutate(
      { roleId, slug: slug! },
      {
        onSuccess: () => {
          openConfirmationModal();
        },
      }
    );
  };

  const callBackendWithBody = (roleId: string, body: CastingApplicationRequest) => {
    apply.mutate(
      { roleId, slug: slug!, request: body },
      {
        onSuccess: () => {
          closeModal();
          openConfirmationModal();
        },
      }
    );
  };

  const handleApplyRole = (role: CastingRole) => {
    if (!isTalentLogged) return;
    if (apply.isPending) return;
    if (!slug) return;
    if (appliedIdsSet.has(role.id)) return;
    if (!casting) return;

    const requirements: CastingRequirement[] = (casting.requirementsSection.requirements ?? []).filter(
      (r) => r.roleId === role.id
    );

    const hasRequirements = requirements.length > 0;

    if (!hasRequirements) {
      callBackendDirect(role.id);
      return;
    }

    openModal(
      <CastingApplicationRequirementsModal
        requirements={requirements}
        onCancel={closeModal}
        onApply={(body) => {
          callBackendWithBody(role.id, body);
        }}
      />,
      t('application.modal.title'),
      'lg'
    );
  };

  const isRoleApplied = (role: CastingRole) => appliedIdsSet.has(role.id);

  if (publicOverviewQuery.isError) return <ServerError />;
  if (publicOverviewQuery.isLoading || !casting) {
    return (
      <Label className="w-full pt-10 flex items-center justify-center text-center text-[var(--color-secondary-grey-fonts)]">
        {t('state.loading')}
      </Label>
    );
  }

  const right = (
    <>
      <EmployerInfoSection data={casting.employerInfo} />

      {showApplyInfoSection && (
        <ApplySection
          employer={casting.employerInfo.companyName!}
          requirements={[]}
          roleId=""
          alreadyApplied={appliedAllRoles}
          multipleAlreadyApplied={hasAppliedAnyRole && !appliedAllRoles}
          shouldShowApplyAction={false}
        />
      )}
    </>
  );

  if (isDesktop) {
    return (
      <main className="flex flex-row gap-10">
        <section className="flex-1">
          <BasicInfoSection data={casting.basicInfoSection} />
          <Separator className="opacity-0 my-2" />
          <RolesSection
            data={casting.rolesSection}
            showApplyButton={showApplyButton}
            applyDisabled={!isTalentLogged || apply.isPending}
            isRoleApplied={isRoleApplied}
            onApplyRole={handleApplyRole}
          />
        </section>
        <section className="flex flex-col gap-6 w-[350px]">{right}</section>
      </main>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={casting.basicInfoSection} />
      <Separator className="opacity-0 my-1" />
      <RolesSection
        data={casting.rolesSection}
        showApplyButton={showApplyButton}
        applyDisabled={!isTalentLogged || apply.isPending}
        isRoleApplied={isRoleApplied}
        onApplyRole={handleApplyRole}
      />
      <Separator className="opacity-20 my-4" />
      {right}
    </div>
  );
};

export default PublicCastingOverviewPage;
