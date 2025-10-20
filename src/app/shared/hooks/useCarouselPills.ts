import type { TFunction } from 'i18next';
import { useMemo, useState } from 'react';

export type PillKeyBase = string;

export type CountGetters<K extends PillKeyBase, D> = Partial<Record<K, (data: D) => number | undefined>>;

export function useCarouselPills<K extends PillKeyBase, D>(params: {
  order: readonly K[];
  t: TFunction;
  data: D;
  getCount?: CountGetters<K, D>;
  defaultActive?: K;
  translationPrefix?: string;
}) {
  const { order, t, data, getCount, defaultActive = order[0], translationPrefix } = params;

  const [active, setActive] = useState<K>(defaultActive);

  const pills = useMemo(
    () =>
      order.map((key) => ({
        key,
        label: t(`${translationPrefix}.${key}`),
        count: getCount?.[key]?.(data),
      })),
    [order, t, data, getCount, translationPrefix]
  );

  return { active, setActive, pills };
}
