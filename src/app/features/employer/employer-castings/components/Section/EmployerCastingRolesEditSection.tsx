import { useQueryClient } from '@tanstack/react-query';
import { DashboardLoadingLabel, Label } from 'autocasting-ui-library-padimasso';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useSectionRoles } from '../../hooks/section/useSectionRoles';
import { EMPLOYER_CASTING_CACHE_KEY } from '../../services/employerCastingService';
import { EmployerCastingRoleCard } from '../Card';

const EmployerCastingRolesEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { defaultCode } = useEmployerCastingIds();
  const { data, isLoading, error } = useSectionRoles(sectionId);

  useSyncCastingSectionStatus('roles', data?.sectionStatus);

  const prevCountRef = useRef<number | null>(null);
  const currentCount = data?.roles?.length ?? 0;

  useEffect(() => {
    if (prevCountRef.current === null) {
      prevCountRef.current = currentCount;
      return;
    }

    if (prevCountRef.current !== currentCount) {
      prevCountRef.current = currentCount;
      queryClient.invalidateQueries({
        queryKey: [...EMPLOYER_CASTING_CACHE_KEY, defaultCode],
      });
    }
  }, [currentCount, defaultCode, queryClient]);

  if (isLoading || !data) return <DashboardLoadingLabel />;
  if (error) return <ServerError />;

  return (data.roles?.length ?? 0) > 0 ? (
    <article className="flex flex-col gap-4">
      {data.roles?.map((role) => (
        <EmployerCastingRoleCard data={role} key={role.id} />
      ))}
    </article>
  ) : (
    <Label className="w-full text-center text-(--color-secondary-grey-fonts) pt-10">
      {t('employer_castings.page.empty_roles')}
    </Label>
  );
};

export default EmployerCastingRolesEditSection;
