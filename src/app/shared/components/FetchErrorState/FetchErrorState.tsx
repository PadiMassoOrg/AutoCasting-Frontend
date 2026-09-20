import { Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type FetchErrorStateProps = {
  className?: string;
};

/**
 * Generic inline error state for list/catalog-style pages when a fetch fails (e.g. network error,
 * unhandled backend exception). Mirrors the pattern first established in CastingDatabasePage.
 *
 * Label renders a <label> element (display: inline by default), so `block` is forced here —
 * otherwise `text-center`/`w-full` passed via className would have no effect.
 */
const FetchErrorState = ({ className }: FetchErrorStateProps) => {
  const { t } = useTranslation();

  return (
    <Label className={`block ${className ?? 'py-10 text-center'}`} variant="error">
      {t('state.server_err')}
    </Label>
  );
};

export default FetchErrorState;
