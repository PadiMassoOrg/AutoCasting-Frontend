import { Button, SectionCard } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  onClaim: () => void;
};

export default function ProposalClaimBanner({ onClaim }: Props) {
  const { t } = useTranslation();

  return (
    <SectionCard className="flex shrink-0 flex-col gap-4 bg-[var(--color-secondary-offwhite)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{t('proposals.page.title')}</h1>
        <p className="text-sm text-(--color-secondary-grey-fonts)">{t('proposals.page.description')}</p>
      </div>
      <Button variant="primary" className="lg:!w-auto mt-4" onClick={onClaim}>
        {t('proposals.page.claim')}
      </Button>
    </SectionCard>
  );
}
