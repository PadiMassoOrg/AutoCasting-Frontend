import { createContext, useContext, useState, type ReactNode } from 'react';
import { enUS, es as esLocale, fr as frLocale } from 'date-fns/locale';

export type Language = 'en' | 'es' | 'fr';

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
}>({
  lang: 'es',
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('es');
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export const DATE_FNS_LOCALE_BY_LANG = {
  en: enUS,
  es: esLocale,
  fr: frLocale,
} as const;

export const WEEKDAYS_SHORT_BY_LANG = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
} as const;
