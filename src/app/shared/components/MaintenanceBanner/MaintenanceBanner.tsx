import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maintenanceDateToLocalMidnight, useAppConfig } from '../../lib/appConfig';

// "Maintenance is coming" warning banner. State comes from the shared Supabase
// app_config row (see src/app/shared/lib/appConfig.ts) — the single source of
// truth shared with the Mobile app. Operators flip `maintenance_warning` and set
// `maintenance_at` in the Supabase Table Editor; this updates live. The message
// text is fixed and translated here — only the date is data.

export function MaintenanceBanner() {
  const { t } = useTranslation();
  const { maintenanceWarning, maintenanceAt } = useAppConfig();
  const [hidden, setHidden] = useState(false);

  if (!maintenanceWarning || hidden) return null;

  const text = t('maintenance.scheduled', { date: maintenanceDateToLocalMidnight(maintenanceAt) });

  return (
    <div className="flex items-center justify-center gap-4 p-4 border-b border-b-[#ffe08a] bg-[#fff3cd] text-(--color-primary-black) text-sm text-center w-full">
      <span aria-live="polite">{text}</span>
      <button
        onClick={() => setHidden(true)}
        aria-label={t('general.close')}
        className="border-0 bg-transparent cursor-pointer font-semibold text-lg"
      >
        ×
      </button>
    </div>
  );
}
