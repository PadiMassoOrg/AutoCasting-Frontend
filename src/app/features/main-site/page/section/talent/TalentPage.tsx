import TalentCatalogSection from './TalentCatalogSection';
import TalentOnboardingSection from './TalentOnboardingSection';

const TalentPage = () => {
  return (
    <div className="flex flex-col gap-30">
      <TalentOnboardingSection></TalentOnboardingSection>
      <TalentCatalogSection></TalentCatalogSection>
    </div>
  );
};

export default TalentPage;
