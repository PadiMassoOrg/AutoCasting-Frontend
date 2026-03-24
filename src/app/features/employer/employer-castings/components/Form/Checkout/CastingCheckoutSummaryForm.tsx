import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '../../../../../../shared/components/Section';
import { formatLocalDate } from '../../../../../../shared/utils/formatUtils';
import type { CastingSectionCheckout } from '../../../types/employerCastings.types';

const CastingCheckoutSummaryForm = ({ data }: { data: CastingSectionCheckout }) => {
  const { t } = useTranslation();
  return (
    <SectionCard className="w-full">
      <h2 className="text-base font-semibold">{t('employer_castings.dashboard.checkout.checkout_summary.title')}</h2>
      <div className="mt-6">
        {/* Casting */}
        <article className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{data.castingTitle}</h2>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--secondary-color-gray)]">
              {t('employer_castings.dashboard.basic_info.project_type')}:
            </p>
            <p className="text-sm">{t(data.projectType.stringCode)}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--secondary-color-gray)]">
              {t('employer_castings.dashboard.basic_info.casting_modality')}:
            </p>
            <p className="text-sm">{t(data.castingModality.stringCode)}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--secondary-color-gray)]">{t('general.limit_date')}:</p>
            <p className="text-sm">{formatLocalDate(data.applicationDeadline, 'dayMonth')}</p>
          </div>
        </article>
        <Separator className="opacity-20 my-6"></Separator>
        {/* Roles */}
        <article className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{t('general.roles')}</h2>
          <div className="flex flex-row items-center justify-between">
            {data.roles.map((role) => {
              return (
                <>
                  <p className="text-sm">{role.roleName}</p>
                  <p className="text-sm">{t(role.roleType.stringCode)}</p>
                </>
              );
            })}
          </div>
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
