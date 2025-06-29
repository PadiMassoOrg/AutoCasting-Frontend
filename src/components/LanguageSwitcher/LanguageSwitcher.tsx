import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const { i18n } = useTranslation();

  const changeLang = (newLang: 'en' | 'es') => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLang('en')} className={lang === 'en' ? 'font-bold' : ''}>
        🇬🇧 English
      </button>
      <button onClick={() => changeLang('es')} className={lang === 'es' ? 'font-bold' : ''}>
        🇪🇸 Español
      </button>
    </div>
  );
}
