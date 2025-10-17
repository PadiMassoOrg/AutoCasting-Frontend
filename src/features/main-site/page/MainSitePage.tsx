import { LandingSection, PlanSection, ServicesSection, TutorialSection } from './section';

const MainSitePage = () => {
  // Each section handles it's own layout.
  return (
    <main className="relative w-full flex flex-col items-center">
      <LandingSection></LandingSection>
      <ServicesSection></ServicesSection>
      <TutorialSection></TutorialSection>
      {/* Waves */}
      <div className="w-full relative h-[5rem] lg:h-[10rem]">
        {/* Mobile */}
        <div className="absolute inset-x-0 top-0 h-[90px] pointer-events-none lg:hidden">
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none" className="w-full h-full block" aria-hidden="true">
            <path d="M0,0 H1440 V185 Q720,60 0,135 Z" fill="var(--color-secondary-offwhite)" />
          </svg>
        </div>
        {/* Desktop */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-[150px] pointer-events-none">
          <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="w-full h-full block" aria-hidden="true">
            <path
              fill="var(--color-secondary-offwhite)"
              d="M0,32L40,69.3C80,107,160,181,240,224C320,267,400,277,480,256C560,235,640,181,720,138.7C800,96,880,64,960,53.3C1040,43,1120,53,1200,85.3C1280,117,1360,171,1400,197.3L1440,224L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            />
          </svg>
        </div>
      </div>
      <PlanSection></PlanSection>
    </main>
  );
};

export default MainSitePage;
