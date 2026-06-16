import {
  Button,
  Separator,
  WizardActions,
  WizardBody,
  WizardFooter,
  WizardLayout,
} from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { formatLocalDate } from '../../../../../../shared/utils/formatUtils';
import type { StepSharedProps } from './CastingCheckoutModal';

const CastingCheckoutSummaryStep = ({ summary, onClose, onPublish, isPublishing }: StepSharedProps) => {
  const { t } = useTranslation();
  const { castingTitle, projectType, castingModality, applicationDeadline, roles } = summary;

  return (
    <WizardLayout className="h-full">
      <WizardBody>
        <section className="flex flex-col gap-6 pb-4">
          <article className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{castingTitle || '-'}</h3>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-(--color-secondary-gray)">
                {t('employer_castings.dashboard.basic_info.project_type')}:
              </p>
              <p className="text-sm">{projectType ? t(projectType.stringCode) : '-'}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-(--color-secondary-gray)">
                {t('employer_castings.dashboard.basic_info.casting_modality')}:
              </p>
              <p className="text-sm">{castingModality ? t(castingModality.stringCode) : '-'}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-(--color-secondary-gray)">{t('general.limit_date')}:</p>
              <p className="text-sm">{applicationDeadline ? formatLocalDate(applicationDeadline, 'dayMonth') : '-'}</p>
            </div>
          </article>

          <Separator className="opacity-20" />

          <article className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t('general.roles')}</h3>
            {roles.map((role) => (
              <div className="flex items-center justify-between gap-4" key={role.id}>
                <p className="text-sm">{role.roleName}</p>
                <p className="text-sm text-(--color-secondary-gray)">
                  {role.roleType ? t(role.roleType.stringCode) : '-'}
                </p>
              </div>
            ))}
          </article>

          <Separator className="opacity-20" />

          <article className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">{t('employer_castings.dashboard.checkout.checkout_summary.coupon')}</p>
              <p className="text-lg font-bold">
                {t('employer_castings.dashboard.checkout.checkout_summary.beta_discount')}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">{t('general.total')}</p>
              <p className="text-lg font-bold">{t('employer_castings.dashboard.checkout.beta_total')}</p>
            </div>
          </article>
        </section>
      </WizardBody>

      <Separator className="opacity-20 mb-6"></Separator>
      <WizardFooter className="w-full flex items-center justify-end">
        <WizardActions
          secondaryAction={
            <Button variant="primaryOutline" onClick={onClose}>
              {t('general.cancel')}
            </Button>
          }
          primaryAction={
            <Button variant="primary" onClick={() => void onPublish()} loading={isPublishing}>
              {t('employer_castings.dashboard.checkout.checkout_and_publish')}
            </Button>
          }
        />
      </WizardFooter>
    </WizardLayout>
  );
};

export { CastingCheckoutSummaryStep };
