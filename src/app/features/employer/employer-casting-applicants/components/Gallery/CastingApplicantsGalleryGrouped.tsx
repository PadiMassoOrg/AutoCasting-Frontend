import type { EmployerCastingApplicantsRoleSliceResponse } from '../../types/employerCastingApplicants.types';
import CastingApplicantGalleryCard from '../Card/CastingApplicantGalleryCard';

type Props = {
  roles: EmployerCastingApplicantsRoleSliceResponse[];
  onReachRoleEnd?: (roleId: string) => void;
  loadingRoleIds?: Record<string, boolean>;
};

const CastingApplicantsGalleryGrouped = ({ roles, onReachRoleEnd, loadingRoleIds = {} }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {roles.map((role) => (
        <section key={role.roleId} className="w-full flex flex-col gap-2">
          <h3 className="text-base font-semibold">{role.roleName}</h3>

          {role.items.length > 0 ? (
            <div
              className="w-full overflow-x-auto overflow-y-hidden pb-1"
              onScroll={(e) => {
                if (!onReachRoleEnd || !role.hasNext) return;
                const el = e.currentTarget;
                const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 80;
                if (nearEnd) onReachRoleEnd(role.roleId);
              }}
            >
              <div className="inline-flex gap-4">
                {role.items.map((applicant) => (
                  <div key={applicant.applicationId} className="w-[315px] min-w-[315px] shrink-0">
                    <CastingApplicantGalleryCard data={applicant} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm font-light text-(--color-secondary-grey-fonts)">Sin postulantes en este rol.</p>
          )}
          {loadingRoleIds[role.roleId] && (
            <p className="text-xs font-light text-(--color-secondary-grey-fonts)">Cargando más...</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default CastingApplicantsGalleryGrouped;
