import { Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../context/LanguageContext';
import { ChevronUpDown } from '../../../shared/components/Chevron';

type Faq = { id: string; q: string; a: string };

const SupportPage = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const faq = useMemo(() => {
    return t('support.faq', { returnObjects: true }) as Faq[];
  }, [t, lang]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    faq?.forEach((item) => {
      initial[item.id] = true;
    });
    setOpenMap(initial);
  }, [faq]);

  return (
    <section className="w-full relative bg-[var(--color-primary-white)] min-h-[70vh] grid place-items-center pb-16 pt-10">
      <div className="relative max-w-[1450px] z-10 w-[80%] h-full py-5 flex flex-col gap-10 lg:gap-14 items-center">
        {/* Title */}
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-2xl font-bold lg:text-[36px]">{t('support.title')}</h2>
        </div>

        {/* Content */}
        <div className="w-full">
          <Separator className="opacity-20 my-2" />
          {faq.map((item, index) => {
            const isOpen = !!openMap[item.id];
            return (
              <div key={item.id}>
                <details
                  id={item.id}
                  className="group py-4"
                  open={isOpen}
                  onToggle={(e) => {
                    const open = (e.currentTarget as HTMLDetailsElement).open;
                    setOpenMap((prev) => ({ ...prev, [item.id]: open }));
                  }}
                >
                  <summary className="cursor-pointer flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {index + 1}. {item.q}
                    </span>
                    <ChevronUpDown open={isOpen} />
                  </summary>
                  <div className="mt-2 text-[16px] font-light">
                    <p>{item.a}</p>
                  </div>
                </details>
                <Separator className="opacity-20 my-2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportPage;
