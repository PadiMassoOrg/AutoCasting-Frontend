import {
  LG_SCREEN_SIZE,
  MasterDetailShell,
  SectionCard,
  Separator,
  useMedia,
  useViewportVhVar,
} from 'autocasting-ui-library-padimasso';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CastingDetailsDesktopBody } from '../../../../shared/components/CastingDetails';
import { CastingRolePublicCard } from '../../../casting-database/components';
import type { PublicCastingData } from '../../../public-casting/types/publicCasting.types';
import { mapRoleToCard } from '../../../public-casting/utils/mapRoleToCard';
import ProposalClaimBanner from '../ProposalClaimBanner';

type Props = {
  casting: PublicCastingData;
  onClaim: () => void;
};

export default function CastingProposalOverview({ casting, onClaim }: Props) {
  useViewportVhVar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(casting.roles[0]?.id ?? null);

  const items = useMemo(() => casting.roles.map((role) => mapRoleToCard(role, casting)), [casting]);
  const selectedRole = casting.roles.find((role) => role.id === selectedRoleId) ?? casting.roles[0] ?? null;

  if (isDesktop) {
    const menuHeader = (
      <div className="sticky top-0 z-10 bg-(--color-secondary-white) pb-5">
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-2xl font-semibold">{casting.title}</h2>
          <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{t(casting.projectType.stringCode)}</p>
        </div>
      </div>
    );

    const menuContent = (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CastingRolePublicCard
            key={item.id}
            item={item}
            selected={item.id === selectedRole?.id}
            onSelect={(current) => setSelectedRoleId(current.id)}
          />
        ))}
      </div>
    );

    const contentHeader = (
      <div className="flex min-w-0 flex-col">
        <h2 className="text-xl font-semibold">{selectedRole?.roleName}</h2>
        <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{casting.title}</p>
      </div>
    );

    const content = selectedRole ? (
      <CastingDetailsDesktopBody casting={{ ...casting, roles: [selectedRole] }} hideEmployer />
    ) : null;

    return (
      <section
        className="w-full overflow-hidden bg-(--color-secondary-white) px-[40px] py-[24px]"
        style={{ height: 'calc(var(--app-vh, 1vh) * 100)' }}
      >
        <div className="mx-auto flex h-full w-full max-w-[1500px] min-h-0 flex-col gap-6">
          <ProposalClaimBanner onClaim={onClaim} />
          <div className="min-h-0 flex-1">
            <MasterDetailShell
              menuHeader={menuHeader}
              menuContent={menuContent}
              content={content}
              contentHeader={contentHeader}
              menuContentRef={menuScrollRef}
              desktopPaneHeight="100%"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      <ProposalClaimBanner onClaim={onClaim} />

      <SectionCard className="flex flex-col gap-4">
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-2xl font-semibold">{casting.title}</h1>
          <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{t(casting.projectType.stringCode)}</p>
        </div>
      </SectionCard>

      <Separator className="opacity-0 my-1" />

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <CastingRolePublicCard key={item.id} item={item} onSelect={(current) => navigate(`roles/${current.id}`)} />
        ))}
      </div>
    </div>
  );
}
