import { Button, Input } from 'autocasting-ui-library-padimasso';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { WizardStep } from '../../../../shared/components/Wizard';
import type { WizardStepProps } from '../../../../shared/components/Wizard/WizardStep';
import Logo from '../../../../shared/icons/og-image.svg';

type Props = WizardStepProps;

export function TalentBasicInfoStep({ goNext, goBack, stepIndex = 0, totalSteps = 3 }: Props) {
  const { t } = useTranslation();
  const [stageName, setStageName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) return;
    console.log(stageName);
  };

  return (
    <section className="w-full">
      <WizardStep>
        {/* Header + badge + progress */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src={Logo} className="w-14" />
          <button className="px-6 py-2 rounded-full bg-[var(--color-primary-white)] text-xs font-semibold text-[var(--color-primary-purple)] shadow-sm">
            {t('onboarding.talent.badge')}
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-3">{t('onboarding.talent.basic_info.title')}</h1>
            <p className="text-sm">{t('onboarding.talent.basic_info.subtitle')}</p>
          </div>

          <Input
            placeholder={t('onboarding.talent.basic_info.stage_name_placeholder')}
            value={stageName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStageName(e.target.value)}
          />

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
            ← {t('onboarding.common.exit_and_continue_later')}
          </button>
        </form>
      </WizardStep>
    </section>
  );
}
