import { Pills } from 'autocasting-ui-library-padimasso';
import { type TFunction } from 'i18next';
import React from 'react';
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
  fixedHeight?: boolean;
};

export default function InfoCarousel<K extends PillKeyBase, D>({
  data,
  order,
  renderers,
  getCount,
  t,
  className,
  panelWrapperClassName,
  defaultActive,
  translationPrefix,
  fixedHeight = false,
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
    <section className={`w-full min-w-0 h-full min-h-0 flex flex-col gap-3 ${className ?? ''}`}>
      <Pills items={pills} value={active} onChange={setActive} listClassName="pb-1" />

      <div className={`w-full flex-1 min-h-0 overflow-hidden rounded-xl ${panelWrapperClassName ?? ''}`}>
        <div
          className={`h-full ${fixedHeight ? 'min-h-[645px]' : 'min-h-[min(645px,100%)]'} rounded-xl ring-1 ring-inset ring-[var(--color-secondary-outline)] bg-white`}
        >
          <div className="h-full min-h-0 overflow-auto py-6 px-7">{ActivePanel?.(data)}</div>
        </div>
      </div>
    </section>
  );
}
