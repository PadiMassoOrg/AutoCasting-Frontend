import { Button, Input } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';
import Logo from '../../../../shared/icons/og-image.svg';

type Props = WizardStepProps;

export function EmployerBasicInfoStep({ goNext, goBack, stepIndex = 0, totalSteps = 3 }: Props) {
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState('');
  const [cuit, setCuit] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !cuit.trim()) return;
    console.log(companyName, cuit);
  };

  return (
    <section className="w-full">
      <WizardStep>
        {/* Header + badge + progress */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src={Logo} className="w-14" />
          <button className="px-6 py-2 rounded-full bg-[var(--color-primary-white)] text-xs font-semibold text-[var(--color-primary-purple)] shadow-sm">
            {t('onboarding.employer.badge')}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs mb-1">
            {stepIndex + 1} {t('onboarding.common.of')} {totalSteps}
          </p>
          <div className="w-full h-2 rounded-full bg-[#ECE4FF] overflow-hidden">
            <div
              className="h-2 bg-[var(--color-primary-purple)] transition-all"
              style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-3">{t('onboarding.employer.basic_info.title')}</h1>
            <p className="text-sm">{t('onboarding.employer.basic_info.subtitle')}</p>
          </div>

          <Input
            placeholder={t('onboarding.employer.basic_info.company_placeholder')}
            value={companyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
          />

          <Input
            placeholder={t('onboarding.employer.basic_info.cuit_placeholder')}
            value={cuit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCuit(e.target.value)}
          />

          <p className="text-xs text-gray-500">{t('onboarding.employer.basic_info.disclaimer')}</p>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" type="button" onClick={goBack}>
              {t('onboarding.common.back')}
            </Button>
            <Button variant="primary" type="submit">
              {t('onboarding.common.next')}
            </Button>
          </div>

          <button
            type="button"
            className="mt-4 text-xs text-[var(--color-primary-purple)] flex items-center gap-1 justify-center"
          >
            ← {t('onboarding.common.go_back_to_start')}
          </button>
        </form>
      </WizardStep>
    </section>
  );
}
