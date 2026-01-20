import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import type { OverflowMenuAlign, OverflowMenuItem, OverflowMenuSide } from './overflowmenu.types';

type Props = {
  items: OverflowMenuItem[];
  align?: OverflowMenuAlign;
  side?: OverflowMenuSide;
  offset?: number;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  disabled?: boolean;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

const OverflowMenu = ({
  items,
  align = 'end',
  side = 'bottom',
  offset = 8,
  triggerClassName,
  menuClassName,
  itemClassName,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  const visibleItems = useMemo(() => (items ?? []).filter((it) => (it as any)?.hidden !== true), [items]);

  const close = useCallback(() => setOpen(false), []);
  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((v) => !v);
  }, [disabled]);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    if (side === 'bottom') {
      setAnchor({
        x: align === 'end' ? r.right : r.left,
        y: r.bottom + offset,
      });
    } else {
      setAnchor({
        x: align === 'end' ? r.right : r.left,
        y: r.top - offset,
      });
    }
  }, [align, side, offset]);

  useEffect(() => {
    if (!open) return;
    measure();
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;

    const onResize = () => close();
    const onScroll = () => close();

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, close]);

  // Cerrar con Escape + click/touch afuera
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      const inTrigger = !!triggerRef.current?.contains(t);
      const inMenu = !!menuRef.current?.contains(t);

      if (!inTrigger && !inMenu) close();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('touchstart', onPointerDown, true);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      const inTrigger = !!triggerRef.current?.contains(t);
      const inMenu = !!menuRef.current?.contains(t);

      if (!inTrigger && !inMenu) close();
    };

    document.addEventListener('focusin', onFocusIn, true);

    return () => {
      document.removeEventListener('focusin', onFocusIn, true);
    };
  }, [open, close]);

  const onSelectItem = async (it: OverflowMenuItem) => {
    if (it.type === 'separator') return;
    if (it.disabled) return;

    try {
      await it.onSelect?.();
    } finally {
      close();
    }
  };

  const MenuRenderer =
    !open || !anchor
      ? null
      : createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={cx(
              'fixed z-[999] min-w-[210px] rounded-2xl shadow-lg',
              'bg-[var(--color-primary-white)] border border-[var(--color-secondary-outline)]',
              'p-2',
              menuClassName
            )}
            style={{
              left: anchor.x,
              top: anchor.y,
              transform:
                align === 'end'
                  ? side === 'bottom'
                    ? 'translateX(-100%) translateY(0)'
                    : 'translateX(-100%) translateY(-100%)'
                  : side === 'bottom'
                    ? 'translateX(0) translateY(0)'
                    : 'translateX(0) translateY(-100%)',
            }}
          >
            {visibleItems.map((it) => {
              if (it.type === 'separator') {
                return <div key={it.key} className="my-2 h-px w-full bg-[var(--color-secondary-outline)] opacity-60" />;
              }

              const isDestructive = !!it.destructive;

              return (
                <button
                  key={it.key}
                  type="button"
                  role="menuitem"
                  data-menuitem="true"
                  disabled={!!it.disabled}
                  onClick={() => void onSelectItem(it)}
                  className={cx(
                    'w-full text-left px-3 py-2 rounded-xl',
                    'flex items-center gap-3',
                    'text-sm font-normal',
                    'cursor-pointer disabled:cursor-not-allowed',
                    isDestructive
                      ? 'text-[var(--color-alert-error)] hover:bg-red-50'
                      : 'text-[var(--color-primary-black)] hover:text-[var(--color-primary-purple)] hover:bg-[var(--color-secondary-white)]',
                    'transition-colors',
                    'disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit',
                    itemClassName
                  )}
                >
                  <span className="select-none">{it.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        className={cx(
          'inline-flex items-center justify-center rounded-lg h-10 w-10',
          'hover:bg-[var(--color-secondary-white)] transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          triggerClassName
        )}
      >
        <Icon name="overflowmenu" variant="default" />
      </button>
      {MenuRenderer}
    </>
  );
};

export default OverflowMenu;
