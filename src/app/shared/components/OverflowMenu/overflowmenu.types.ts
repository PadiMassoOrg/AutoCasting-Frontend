import type { ReactNode } from 'react';
import type { IconName, IconVariant } from '../Icon/Icon';

export type OverflowMenuItem =
  | {
      type?: 'action';
      key: string;
      label: ReactNode;
      onSelect: () => void | Promise<void>;
      disabled?: boolean;
      destructive?: boolean;
      hidden?: boolean;

      iconName?: IconName;
      iconVariant?: IconVariant;
    }
  | {
      type: 'separator';
      key: string;
      hidden?: boolean;
    };

export type OverflowMenuAlign = 'start' | 'end';
export type OverflowMenuSide = 'bottom' | 'top';
