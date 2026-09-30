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
  const isSwitcherClick = useRef(false);

  useEffect(() => {
    // Jump past the Hero whenever a view shows up in the URL from outside
    // the switcher itself (a shared link, or browser back/forward landing
    // on one) - a click on the switcher already sits at the section, so it
    // must not re-trigger this scroll.
    if (!requestedView || isSwitcherClick.current) {
      isSwitcherClick.current = false;
      return;
    }

    const timerId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, SCROLL_TO_TOP_SETTLE_MS);

    return () => window.clearTimeout(timerId);
  }, [requestedView]);

  const handleViewChange = (nextView: MainSiteView) => {
    isSwitcherClick.current = true;
    setSearchParams({ view: nextView }, { replace: true });
  };

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
