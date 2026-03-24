import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '../../../../../../shared/components/Section';
import { formatLocalDate } from '../../../../../../shared/utils/formatUtils';
import type { CastingSectionCheckout } from '../../../types/employerCastings.types';

const CastingCheckoutSummaryForm = ({ data }: { data: CastingSectionCheckout }) => {
  const { t } = useTranslation();

  const { castingTitle, projectType, castingModality, applicationDeadline, roles } = data;

  return (
    <SectionCard className="w-full">
      <h2 className="text-base font-semibold">{t('employer_castings.dashboard.checkout.checkout_summary.title')}</h2>
      <div className="mt-6">
        {/* Casting */}
        <article className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{castingTitle ? castingTitle : t('general.untitled')}</h2>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--color-secondary-gray)]">
              {t('employer_castings.dashboard.basic_info.project_type')}:
            </p>
            {projectType ? <p className="text-sm">{t(projectType.stringCode)}</p> : <p className="text-sm">-</p>}
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--color-secondary-gray)]">
              {t('employer_castings.dashboard.basic_info.casting_modality')}:
            </p>
            {castingModality ? (
              <p className="text-sm">{t(castingModality.stringCode)}</p>
            ) : (
              <p className="text-sm">-</p>
            )}
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--color-secondary-gray)]">{t('general.limit_date')}:</p>
            {applicationDeadline ? (
              <p className="text-sm">{formatLocalDate(applicationDeadline, 'dayMonth')}</p>
            ) : (
              <p className="text-sm">-</p>
            )}
          </div>
        </article>
        <Separator className="opacity-20 my-6"></Separator>
        {/* Roles */}
        <article className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{t('general.roles')}</h2>

          {roles.length > 0 ? (
            roles.map((role) => {
              return (
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm">{role.roleName}</p>
                  <p className="text-sm">{t(role.roleType.stringCode)}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[var(--color-secondary-gray)]">{t('employer_castings.page.empty_roles')}</p>
          )}
        </article>
        <Separator className="opacity-20 my-6"></Separator>
        {/* Coupon */}
        <article className="flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">{t('employer_castings.dashboard.checkout.checkout_summary.coupon')}</p>
            <p className="text-lg font-bold">
              {t('employer_castings.dashboard.checkout.checkout_summary.beta_discount')}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">{t('general.total')}</p>
            <p className="text-lg font-bold">{t('employer_castings.dashboard.checkout.checkout_summary.beta_total')}</p>
          </div>
        </article>
      </div>
    </SectionCard>
  );
};

export default CastingCheckoutSummaryForm;
