export type OverflowMenuItem =
  | {
      type?: 'action';
      key: string;
      label: string;
      onSelect: () => void | Promise<void>;
      disabled?: boolean;
      destructive?: boolean;
      hidden?: boolean;
    }
  | {
      type: 'separator';
      key: string;
      hidden?: boolean;
    };

export type OverflowMenuAlign = 'start' | 'end';
export type OverflowMenuSide = 'bottom' | 'top';
