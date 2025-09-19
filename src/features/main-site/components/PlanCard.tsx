import checkSimple from '@/shared/icons/check_simple.svg';
import { Button, Separator } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import HilighterSvg from '../../../shared/icons/HilighterSvg';

export type PlanKey = 'free' | 'pro' | string;

type Props = {
  planKey: PlanKey;
  benefits?: number;
  recommended?: boolean;
  className?: string;
  ctaVariant?: 'primary' | 'outline' | 'disabled' | undefined;
  onCtaClick?: () => void;
};

export default function PlanCard({
  planKey,
  benefits = 3,
  className,
  ctaVariant = 'primary',
  onCtaClick,
  recommended = false,
}: Props) {
  const { t } = useTranslation();
  const k = (suffix: string) => `page.plan.${planKey}.${suffix}`;

  return (
    <article
      className={clsx(
        `w-full flex flex-col gap-8 bg-[var(--color-primary-white)] rounded-2xl p-10 border ${recommended ? 'border-[var(--color-primary-greenyellow)]' : 'border-[var(--color-secondary-outline)]'}`,
        className
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-semibold text-lg">{t(k('title'))}</h2>
        {recommended && (
          <div className="h-full relative flex flex-col items-center">
            <h2 className="font-semibold text-base z-12">{t('page.plan.recommended')}</h2>
            <HilighterSvg className="absolute top-[-1rem] z-10"></HilighterSvg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[40px] font-bold leading-none">{t(k('price'))}</h3>
        <p className="text-sm font-base">{t(k('subtitle'))}</p>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: benefits }, (_, i) => i + 1).map((n) => (
          <div key={n} className="flex flex-row gap-2 items-center">
            <img src={checkSimple} alt="" />
            <p>{t(k(`benefit${n}`))}</p>
          </div>
        ))}
      </div>
      <Separator className="opacity-20" />
      <div className="flex flex-col gap-2 items-center">
        <Button variant={ctaVariant} onClick={onCtaClick}>
          {t(k('cta'))}
        </Button>
        <p className="text-sm">{t(k('cta_2'))}</p>
      </div>
    </article>
  );
}
