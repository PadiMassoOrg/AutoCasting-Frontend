import { useTranslation } from 'react-i18next';
import type { CastingRole } from '../../types/publicCasting.types';
import PublicRoleCard from '../PublicRoleCard';

type Props = {
  data: CastingRole[];
  showApplyButton?: boolean;
  isRoleApplied?: (role: CastingRole) => boolean;
  applyDisabled?: boolean;
  onApplyRole?: (role: CastingRole) => void;
};

const RolesSection = ({ data, showApplyButton = false, isRoleApplied, applyDisabled = false, onApplyRole }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      <article className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('casting.role_section.role.role')}</h2>
      </article>

      <article className="flex flex-col gap-6">
        {data?.map((i) => (
          <PublicRoleCard
            key={i.id}
            data={i}
            showApplyButton={showApplyButton}
            applyDisabled={applyDisabled || Boolean(isRoleApplied?.(i))}
            onApply={onApplyRole}
          />
        ))}
      </article>
    </section>
  );
};

export default RolesSection;
