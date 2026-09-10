import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)

  .use(resourcesToBackend((language: any, namespace: any) => import(`../../locales/${language}/${namespace}.json`)))
  .init({
    lng: 'es',
    fallbackLng: 'es',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'datetime' && value) {
          try {
            const d = new Date(value);
            return new Intl.DateTimeFormat(lng ?? 'es', {
              dateStyle: 'full',
              timeStyle: 'short',
            }).format(d);
          } catch {
            return String(value);
          }
        }
        if (format === 'date' && value) {
          try {
            return new Intl.DateTimeFormat(lng ?? 'es', { dateStyle: 'long' }).format(new Date(value));
          } catch {
            return String(value);
          }
        }
        return value;
      },
    },
  });

export default i18n;
