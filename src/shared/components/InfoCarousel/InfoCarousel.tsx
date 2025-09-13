import type { TFunction } from 'i18next';
import React from 'react';
import Pills from '../../../features/public-profile/components/Pills/Pills';
import { useCarouselPills, type CountGetters, type PillKeyBase } from '../../hooks/useCarouselPills';
type Renderers<K extends PillKeyBase, D> = Record<K, (data: D) => React.ReactNode>;

type InfoCarouselProps<K extends PillKeyBase, D> = {
  data: D;
  order: readonly K[];
  renderers: Renderers<K, D>;
  getCount?: CountGetters<K, D>;
  t: TFunction;
  className?: string;
  panelWrapperClassName?: string;
  defaultActive?: K;
  translationPrefix?: string;
};

export default function InfoCarousel<K extends PillKeyBase, D>({
  data,
  order,
  renderers,
  getCount,
  t,
  className,
  panelWrapperClassName = 'rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7',
  defaultActive,
  translationPrefix,
}: InfoCarouselProps<K, D>) {
  const { active, setActive, pills } = useCarouselPills<K, D>({
    order,
    t,
    data,
    getCount,
    defaultActive,
    translationPrefix,
  });

  const ActivePanel = renderers[active];

  return (
    <section className={`w-full min-w-0 min-h-0 h-full flex flex-col gap-0 ${className ?? ''}`}>
      <Pills items={pills} value={active} onChange={setActive} />
      <div className="w-full min-w-0 min-h-0 flex-1 overflow-auto">
        <div className={panelWrapperClassName}>{ActivePanel?.(data)}</div>
      </div>
    </section>
  );
}
