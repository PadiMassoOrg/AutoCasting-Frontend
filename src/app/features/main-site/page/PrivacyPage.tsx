import { PageLoading } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../context/LanguageContext';
import { ServerErrorPage } from '../../../shared/components/ErrorPage';
import { useLegalDocuments } from '../legal/hooks/useLegalDocuments';

const PrivacyPage = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const { data, isPending, error } = useLegalDocuments('PRIVACY', lang);

  const getBodyHtml = (html: string) => {
    const m = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
    return m ? m[1] : html;
  };

  const bodyHtml = useMemo(() => (data?.contentHtml ? getBodyHtml(data.contentHtml) : ''), [data?.contentHtml]);

  if (isPending) return <PageLoading></PageLoading>;
  if (error) return <ServerErrorPage></ServerErrorPage>;
  return (
    <section className="w-full relative bg-[var(--color-primary-white)] min-h-[70vh] grid place-items-center py-10 px-4">
      <div className="relative max-w-[1450px] z-10 w-[80%] h-full py-5 flex flex-col gap-8 lg:gap-14 items-center">
        {/* Title */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold lg:text-[36px]">{t('legal.privacy')}</h2>
          {data?.pdfDownloadUrl && (
            <a href={data.pdfDownloadUrl} target="_blank" rel="noreferrer" className="text-xs underline font-light">
              {t('legal.download_pdf')}
            </a>
          )}
        </div>
        {/* Content */}
        {bodyHtml && <article className="w-full" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
      </div>
    </section>
  );
};

export default PrivacyPage;
