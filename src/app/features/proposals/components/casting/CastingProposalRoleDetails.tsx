import { Button, LG_SCREEN_SIZE, SectionCard, Separator, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { CastingDetailsDesktopBody, CastingDetailsMobileBody } from '../../../../shared/components/CastingDetails';
import type { PublicCastingData } from '../../../public-casting/types/publicCasting.types';
import ProposalClaimBanner from '../ProposalClaimBanner';

type Props = {
  casting: PublicCastingData;
  onClaim: () => void;
};

export default function CastingProposalRoleDetails({ casting, onClaim }: Props) {
  const { t } = useTranslation();
  const { roleId } = useParams<{ roleId: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const role = casting.roles.find((current) => current.id === roleId);
  if (!role) return <Navigate to=".." replace />;

  const roleCasting = { ...casting, roles: [role] };

  if (isDesktop) {
    return (
      <div className="px-[40px] py-[24px]">
        <SectionCard className="mx-auto flex max-w-[1500px] flex-col gap-6">
          <section className="flex items-start justify-between">
            <div className="w-full">
              <h2 className="text-3xl font-semibold">{role.roleName}</h2>
              <p className="text-base font-light text-(--color-secondary-grey-fonts)">{casting.title}</p>
            </div>
            <Button variant="primary" className="lg:!w-auto lg:shrink-0 lg:px-10" onClick={onClaim}>
              {t('proposals.page.claim')}
            </Button>
          </section>

          <Separator className="opacity-0 my-4" />

          <CastingDetailsDesktopBody casting={roleCasting} hideEmployer />
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProposalClaimBanner onClaim={onClaim} />

      <SectionCard>
        <CastingDetailsMobileBody casting={roleCasting} hideEmployer />
      </SectionCard>
    </div>
  );
}
