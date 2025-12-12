import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

const ApplySection = ({ token }: { token: String }) => {
  const { t } = useTranslation();
  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t('casting-database.page.apply_title')}</h2>
      <Separator className="opacity-20 my-2" />
      <Button variant="primary">{t('general.apply')}</Button>
    </article>
  );
};

export default ApplySection;
