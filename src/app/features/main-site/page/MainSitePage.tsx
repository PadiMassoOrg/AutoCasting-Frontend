import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ViewSwitcher, type MainSiteView } from '../components/UI';
import { EmployerPage, HeroSection, TalentPage } from './section';

// ScrollToTop (mounted globally in AppRoutes) forces the window back to
// top for up to 180ms after any route/search change - scrolling to the
// section must happen after that window closes, not on mount directly.
const SCROLL_TO_TOP_SETTLE_MS = 200;

const MainSitePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get('view');
  const view: MainSiteView = requestedView === 'employer' ? 'employer' : 'talent';
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only jump past the Hero for a view already present in the URL on
    // load (e.g. a shared link) - the switcher itself must not scroll.
    if (!requestedView) return;

    const timerId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, SCROLL_TO_TOP_SETTLE_MS);

    return () => window.clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only, not on every switcher click
  }, []);

  const handleViewChange = (nextView: MainSiteView) => setSearchParams({ view: nextView }, { replace: true });

  return (
    <main className="max-w-[1500px] m-auto px-6 lg:px-12">
      <HeroSection></HeroSection>
      <div ref={sectionRef} className="w-full flex justify-center scroll-mt-20">
        <ViewSwitcher value={view} onChange={handleViewChange} />
      </div>
      <div className="py-20">{view === 'talent' ? <TalentPage /> : <EmployerPage />}</div>
    </main>
  );
};

export default MainSitePage;
