import { useTranslation } from 'react-i18next';
import type { CastingRoles } from '../../../employer/employer-castings/types/employerCastings.types';
import PublicRoleCard from '../PublicRoleCard';

const RolesSection = ({ data }: { data: CastingRoles }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      {/* Title */}
      <article className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('casting.role_section.role')}</h2>
      </article>
      <article className="flex flex-col gap-2">
        {data.roles?.map((i) => {
          return <PublicRoleCard data={i} key={i.id} />;
        })}
      </article>
    </section>
  );
};

export default RolesSection;
