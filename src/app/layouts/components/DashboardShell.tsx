// layouts/components/DashboardShell.tsx
import { Separator } from 'autocasting-ui-library-padimasso';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../../shared/components/Chevron';
import { LG_SCREEN_SIZE, useMedia } from '../../shared/hooks/useMedia';

export type DashboardSection<Key extends string = string> = {
  key: Key;
  label: string;
  icon?: ReactNode;
  render: () => ReactNode;
};

type DashboardShellProps<Key extends string = string> = {
  title?: string;
  sections?: DashboardSection<Key>[];
  initialKey?: Key;
  children?: ReactNode;
  /** Slot para contenido fijo al fondo de la sidebar / menú (links, logout, etc.) */
  bottomSection?: ReactNode;
};

function DashboardShell<Key extends string = string>({
  title,
  sections,
  initialKey,
  children,
  bottomSection,
}: DashboardShellProps<Key>) {
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const hasSections = !!(sections && sections.length > 0);

  const [activeKey, setActiveKey] = useState<Key | null>((initialKey as Key) ?? sections?.[0]?.key ?? null);
  const [mobileView, setMobileView] = useState<'nav' | 'content'>('nav');

  useEffect(() => {
    if (!hasSections) {
      setActiveKey(null);
      return;
    }
    if (!activeKey || !sections!.some((s) => s.key === activeKey)) {
      setActiveKey(sections![0].key);
    }
  }, [hasSections, sections, activeKey]);

  useEffect(() => {
    if (isDesktop && hasSections) {
      setMobileView('content');
    } else if (!isDesktop && hasSections) {
      setMobileView('nav');
    }
  }, [isDesktop, hasSections]);

  const currentSection = useMemo(() => sections?.find((s) => s.key === activeKey) ?? null, [sections, activeKey]);

  const handleSelect = (key: Key) => {
    setActiveKey(key);
    if (!isDesktop) {
      setMobileView('content');
    }
  };

  // Sin secciones: layout simple
  if (!hasSections) {
    return (
      <section className="w-full h-full min-h-0 flex flex-col">
        <article className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          <div className="w-full max-w-[1100px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
            {title && (
              <h1 className="text-lg lg:text-2xl font-semibold text-[var(--color-primary-black)] mb-4">{title}</h1>
            )}
            {children}
          </div>
        </article>
      </section>
    );
  }

  // Mobile – vista de navegación
  if (!isDesktop && mobileView === 'nav') {
    return (
      <section className="w-full h-full bg-[var(--color-secondary-white)]">
        <div className="w-full max-w-[500px] mx-auto h-full pt-2 px-6">
          {title && (
            <h1 className="my-6 text-2xl font-semibold text-[var(--color-primary-black)] text-center">{title}</h1>
          )}

          <div className="w-full bg-[var(--color-primary-white)] rounded-2xl border border-[var(--color-secondary-outline)] shadow-sm overflow-hidden">
            {sections!.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item.key)}
                className={[
                  'cursor-pointer w-full flex items-center justify-between px-6 py-4 text-sm font-medium',
                  index !== sections!.length - 1 && 'border-b border-[var(--color-secondary-outline)]',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{item.label}</span>
                <ChevronRight />
              </button>
            ))}
          </div>

          {/* TODO: arreglar esto */}
          <Separator className="opacity-0 my-20"></Separator>

          {bottomSection && <footer className="mt-10">{bottomSection}</footer>}
        </div>
      </section>
    );
  }

  // Desktop + mobile content
  return (
    <section className="w-full h-full min-h-0 flex flex-col lg:flex-row gap-0 bg-[var(--color-secondary-white)]">
      {isDesktop && (
        <aside className="hidden lg:block w-[265px] shrink-0 border-r border-[var(--color-secondary-outline)] bg-[var(--color-primary-white)]">
          <div className="h-full flex flex-col py-2">
            {title && <h2 className="px-4 pt-6 pb-4 text-lg font-bold text-[var(--color-primary-black)]">{title}</h2>}

            <nav className="px-3 pb-4 flex flex-col gap-1.5">
              {sections!.map((item) => {
                const selected = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    className={[
                      'flex items-center gap-2 rounded-lg px-4 py-4 text-sm font-semibold cursor-pointer w-full text-left',
                      selected
                        ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)]'
                        : 'text-[var(--color-primary-black)] hover:bg-[var(--color-secondary-white)] hover:text-[var(--color-primary-purple)]',
                    ].join(' ')}
                  >
                    {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {bottomSection && <footer className="mt-auto p-4">{bottomSection}</footer>}
          </div>
        </aside>
      )}

      <article className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <div className="w-full max-w-[1100px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {!isDesktop && mobileView === 'content' && currentSection && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setMobileView('nav')}
                className="cursor-pointer flex items-center gap-2"
              >
                <span className="ml-[-6px]">
                  <ChevronLeft />
                </span>
                <h2 className="text-lg font-semibold">{currentSection.label}</h2>
              </button>
              <div>{currentSection.render()}</div>
            </div>
          )}

          {isDesktop && currentSection && (
            <div className="flex flex-col gap-4 max-w-[790px] m-auto">
              <h2 className="text-lg font-semibold">{currentSection.label}</h2>
              {currentSection.render()}
            </div>
          )}

          {children}
        </div>
      </article>
    </section>
  );
}

export default DashboardShell;
