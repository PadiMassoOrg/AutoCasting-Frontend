import type { ReactNode, Ref } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type FiltersDrawerShellProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  variant: 'mobile' | 'desktop';
  contentRef?: Ref<HTMLDivElement>;
};

export default function FiltersDrawerShell({
  open,
  onClose,
  children,
  footer,
  variant,
  contentRef,
}: FiltersDrawerShellProps) {
  useEffect(() => {
    if (!open) return;
    const { scrollY } = window;
    const prevHtml = document.documentElement.getAttribute('style') || '';
    const prevBody = document.body.getAttribute('style') || '';
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.height = '100%';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.setAttribute('style', prevHtml);
      document.body.setAttribute('style', prevBody);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;

  const rootClassName = variant === 'mobile' ? 'fixed inset-0 z-200 lg:hidden' : 'fixed inset-0 z-200 hidden lg:block';

  const panelClassName =
    variant === 'mobile'
      ? 'fixed inset-[10px] flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
      : 'fixed right-[10px] top-[10px] bottom-[10px] flex w-[400px] flex-col overflow-hidden rounded-xl bg-white';

  const footerClassName =
    variant === 'mobile'
      ? 'shrink-0 bg-white p-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]'
      : 'shrink-0 bg-white p-6';

  return createPortal(
    <div className={rootClassName} style={{ overscrollBehavior: 'contain' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <article className={panelClassName} role="dialog" aria-modal="true">
        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={variant === 'mobile' ? 'p-6' : 'p-6'}>{children}</div>
        </div>
        {footer ? <div className={footerClassName}>{footer}</div> : null}
      </article>
    </div>,
    document.body
  );
}
