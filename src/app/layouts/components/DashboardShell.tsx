import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from '../../shared/components/Chevron';
import { LG_SCREEN_SIZE, useMedia } from '../../shared/hooks/useMedia';

export type DashboardSection<Key extends string = string> = {
  key: Key;
  label: string;
  icon?: ReactNode;
  render: () => ReactNode;
};

type DashboardLayoutV2Props<Key extends string = string> = {
  title?: string;
  sections?: DashboardSection<Key>[];
  initialKey?: Key;
  children?: ReactNode;
};

function DashboardShell<Key extends string = string>({
  title,
  sections,
  initialKey,
  children,
}: DashboardLayoutV2Props<Key>) {
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

  // No Sections
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

  // Sections
  return (
    <section className="w-full h-full min-h-0 flex flex-col lg:flex-row gap-0 bg-[var(--color-secondary-white)]">
      {/* Desktop */}
      {isDesktop && (
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[var(--color-secondary-outline)] bg-[var(--color-primary-white)]">
          <div className="h-full flex flex-col">
            {title && (
              <div className="px-4 pt-6 pb-4 text-sm font-semibold text-[var(--color-primary-black)]">{title}</div>
            )}

            <nav className="px-3 pb-6 flex flex-col gap-1.5">
              {sections!.map((item) => {
                const selected = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    className={[
                      'flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold cursor-pointer w-full text-left',
                      selected
                        ? 'bg-[var(--color-secondary-)] text-[var(--color-primary-purple)]'
                        : 'text-[var(--color-primary-black)] hover:bg-[var(--color-primary-light-grey)]',
                    ].join(' ')}
                  >
                    {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* Mobile */}
      <article className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <div className="w-full max-w-[1100px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* Sections */}
          {!isDesktop && mobileView === 'nav' && (
            <div className="w-full h-full flex flex-col items-center gap-4">
              {title && <h1 className="text-xl font-semibold text-[var(--color-primary-black)]">{title}</h1>}

              <div className="bg-[var(--color-primary-white)] rounded-3xl border border-[var(--color-secondary-outline)] shadow-sm overflow-hidden">
                {sections!.map((item, index) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    className={[
                      'w-full flex items-center justify-between px-4 py-3 text-sm font-medium',
                      index !== sections!.length - 1 && 'border-b border-[var(--color-secondary-outline)]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span>{item.label}</span>
                    <span className="text-xl leading-none text-[var(--color-secondary-grey-fonts)]">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile - Active Content */}
          {!isDesktop && mobileView === 'content' && currentSection && (
            <div className="flex flex-col gap-6">
              <button
                type="button"
                onClick={() => setMobileView('nav')}
                className="cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft />
                <h2 className="text-lg font-semibold">{currentSection.label}</h2>
              </button>
              <div>{currentSection.render()}</div>
            </div>
          )}

          {/* Desktop - Active Content */}
          {isDesktop && currentSection && <>{currentSection.render()}</>}

          {/* Contenido “extra” opcional debajo de todo */}
          {children}
        </div>
      </article>
    </section>
  );
}

export default DashboardShell;
