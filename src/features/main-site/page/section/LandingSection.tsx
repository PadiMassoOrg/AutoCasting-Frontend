import { Button } from 'autocasting-ui-library-padimasso';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HilighterSvg from '../../../../shared/icons/HilighterSvg';
import { ROUTES } from '../../../../shared/lib/routes';
import heroImg from '../../images/landing-hero.png';

const LandingSection = () => {
  const { t } = useTranslation();

  const wordRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    if (!wordRef.current) return;
    const el = wordRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const padXFactor = 0.1;
  const yScale = 1.3;
  const yOffsetPct = 55;
  const targetHeight = Math.max(1, box.h * yScale);
  const targetWidth = Math.max(1, box.w + box.h * padXFactor * 2);
  const viewBoxRatio = 126 / 56;
  const baseWidth = targetHeight * viewBoxRatio;
  const scaleX = targetWidth / baseWidth;
  const xShiftPx = box.h * 0;

  return (
    <section className="relative max-w-[1450px] min-h-[85vh] grid place-items-center">
      <div
        className="
      w-[85%] gap-8
      lg:w-[90%] lg:grid lg:grid-cols-2
      lg:items-start lg:gap-x-8
    "
      >
        {/* Left Side */}
        <article
          className="
        w-full h-full flex flex-col items-center gap-20
        lg:items-start lg:justify-center
      "
        >
          <div
            className="
          flex flex-col items-center text-center gap-5
          lg:items-start lg:text-left lg:max-w-[720px]
        "
          >
            <div className="w-full font-extrabold leading-tight">
              <h2 className="text-[32px] lg:text-[40px]">
                <span className="block lg:inline">{t('landing.page.header')} </span>
                <span className="relative inline-block align-baseline">
                  <span ref={wordRef} className="relative z-10 whitespace-nowrap">
                    {t('landing.page.header_hilight')}
                  </span>
                  <span
                    className="pointer-events-none absolute left-1/2 -z-10"
                    style={{
                      top: `${yOffsetPct}%`,
                      transform: `translate(calc(-50% + ${xShiftPx}px), -50%) scaleX(${scaleX || 1})`,
                      transformOrigin: '50% 50%',
                    }}
                  >
                    <HilighterSvg width={baseWidth || undefined} height={targetHeight || 56} />
                  </span>
                </span>
              </h2>
            </div>

            <p className="text-base lg:text-sm font-normal lg:max-w-[500px]">{t('landing.page.text')}</p>
          </div>

          <div
            className="
          w-full flex flex-col items-center gap-4
          lg:w-auto lg:flex-row lg:items-center lg:justify-start lg:gap-4
        "
          >
            <Button variant="primary" asChild className="lg:w-auto">
              <a href={ROUTES.AUTH} rel="noopener noreferrer">
                {t('routes.register')}
              </a>
            </Button>
            <Button variant="outline" asChild className="lg:w-auto">
              <a href={ROUTES.TALENT_DATABASE} rel="noopener noreferrer">
                {t('routes.talent-database')}
              </a>
            </Button>
          </div>
        </article>

        {/* Right Side */}
        <article className="hidden lg:block w-full justify-self-end">
          <img src={heroImg} alt="" className="block max-w-[560px] w-full ml-auto" />
        </article>
      </div>
      {/* WAVES */}
      <div className="hidden lg:block z-[-5] pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[100vw] max-w-[3000px]">
        {/* Onda inferior (100%) */}
        <div className="w-full z-[-5] absolute bottom-0 left-0">
          <svg
            viewBox="0 0 1366 717"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full max-w-[3000px] h-auto mx-auto"
            aria-hidden="true"
          >
            <path
              d="M592.955 475.426C209.529 606.076 265.598 274.187 -159 487.666L-159 716.707L1487.46 716.705L1487.46 245.299C1460.15 192.308 1366.52 -104.595 1141.76 38.6967C917.004 181.988 1052.42 318.866 592.955 475.426Z"
              fill="#EBEDFD"
              fillOpacity="0.5"
            />
          </svg>
        </div>
        <div className="w-full z-[-4] absolute bottom-[-60px] left-0">
          <svg
            viewBox="0 0 1366 717"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full max-w-[3000px] h-auto mx-auto"
            aria-hidden="true"
          >
            <path
              d="M592.955 475.426C209.529 606.076 265.598 274.187 -159 487.666L-159 716.707L1487.46 716.705L1487.46 245.299C1460.15 192.308 1366.52 -104.595 1141.76 38.6967C917.004 181.988 1052.42 318.866 592.955 475.426Z"
              fill="var(--color-secondary-offwhite)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
