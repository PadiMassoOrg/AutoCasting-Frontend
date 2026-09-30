import { useTranslation } from 'react-i18next';
import heroImg from '../../images/new/hero-banner.png';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full min-h-[92vh] grid place-items-center">
      <div
        className="
      w-[85%] gap-8
      lg:w-[85%] lg:grid lg:grid-cols-2 lg:max-w-[1400px]
      lg:items-center lg:justify-between lg:gap-x-8
    "
      >
        {/* Left Side */}
        <article
          className="
        w-full h-full flex flex-col items-center text-center gap-8
        lg:items-start lg:justify-center lg:text-left lg:mb-2
      "
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">{t('landing.page.header')}</h2>
            <h2 className="text-4xl  lg:text-5xl font-extrabold leading-tight">{t('landing.page.header_hilight')}</h2>
          </div>
          <p className="text-base lg:text-lg font-normal lg:max-w-[500px]">{t('landing.page.text')}</p>
        </article>

        {/* Right Side */}
        <img src={heroImg} alt="" className="block lg:max-w-[500px] ml-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
