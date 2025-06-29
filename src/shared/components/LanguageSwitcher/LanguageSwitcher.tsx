import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const { i18n } = useTranslation();

  const changeLang = (newLang: 'en' | 'es') => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const baseButtonStyle = 'px-4 py-2 rounded-md text-sm cursor-pointer transition hover:bg-slate-100';

  return (
    <div className="w-full flex items-center justify-between max-w-[768px]">
      <button
        onClick={() => changeLang('es')}
        className={`${baseButtonStyle} ${lang === 'es' ? 'font-bold bg-slate-200' : 'text-slate-600'}`}
      >
        🇪🇸 Español
      </button>
      <button
        onClick={() => changeLang('en')}
        className={`${baseButtonStyle} ${lang === 'en' ? 'font-bold bg-slate-200' : 'text-slate-600'}`}
      >
        🇬🇧 English
      </button>
    </div>
  );
}
