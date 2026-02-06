export type OverflowMenuItem =
  | {
      type?: 'item';
      key: string;
      label: React.ReactNode;
      onSelect?: () => void | Promise<void>;
      disabled?: boolean;
      destructive?: boolean;
      iconName?: string;
      iconVariant?: string;
      hidden?: boolean;
      closeOnSelect?: boolean;
    }
  | {
      type: 'separator';
      key: string;
    }
  | {
      type: 'content';
      key: string;
      content: React.ReactNode;
      hidden?: boolean;
    };

export type OverflowMenuAlign = 'start' | 'end';
export type OverflowMenuSide = 'top' | 'bottom';
