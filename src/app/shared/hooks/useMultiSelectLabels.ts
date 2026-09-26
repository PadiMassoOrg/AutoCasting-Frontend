import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useMultiSelectLabels = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      selectAllLabel: t('general.select_all'),
      selectionsLabel: (count: number) => `${count} ${t('general.selections')}`,
    }),
    [t]
  );
};
