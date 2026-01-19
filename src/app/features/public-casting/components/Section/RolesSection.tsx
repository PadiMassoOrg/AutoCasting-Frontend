import { useTranslation } from 'react-i18next';
import type { CastingRolesSection } from '../../types/publicCasting.types';
import PublicRoleCard from '../PublicRoleCard';

const RolesSection = ({ data }: { data: CastingRolesSection }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      {/* Title */}
      <article className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('casting.role_section.role.role')}</h2>
      </article>
      <article className="flex flex-col gap-6">
        {data.roles?.map((i) => {
          return <PublicRoleCard data={i} key={i.id} />;
        })}
      </article>
    </section>
  );
};

export default RolesSection;
