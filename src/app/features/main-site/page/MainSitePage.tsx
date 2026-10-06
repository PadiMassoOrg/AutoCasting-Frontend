import { useChromeBoxHeights } from 'autocasting-ui-library-padimasso';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const { header } = useChromeBoxHeights();

  useEffect(() => {
    // Jump to the top of the selected page (Talent/Employer content, past
    // the Hero and switcher) whenever the requested view changes - on load
    // with a view already in the URL (a shared link, or browser
    // back/forward), and on every switcher click too.
    if (!requestedView) return;

    const timerId = window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, SCROLL_TO_TOP_SETTLE_MS);

    return () => window.clearTimeout(timerId);
  }, [requestedView]);

  const handleViewChange = (nextView: MainSiteView) => setSearchParams({ view: nextView }, { replace: true });

  return (
    <main className="max-w-[1550px] m-auto px-6 lg:px-26 2xl:px-16">
      <HeroSection></HeroSection>
      <div className="w-full flex justify-center py-4 sticky z-70" style={{ top: header }}>
        <ViewSwitcher value={view} onChange={handleViewChange} />
      </div>
      <div ref={contentRef} className="py-20 scroll-mt-20">
        {view === 'talent' ? <TalentPage /> : <EmployerPage />}
      </div>
    </main>
  );
};

export default MainSitePage;
