import TalentApplySection from './TalentApplySection';
import TalentCatalogSection from './TalentCatalogSection';
import TalentOnboardingSection from './TalentOnboardingSection';
import TalentProfileSection from './TalentProfileSection';

const TalentPage = () => {
  return (
    <div className="flex flex-col gap-16 lg:gap-30 pb-10">
      <TalentOnboardingSection></TalentOnboardingSection>
      <TalentCatalogSection></TalentCatalogSection>
      <TalentProfileSection></TalentProfileSection>
      <TalentApplySection></TalentApplySection>
    </div>
  );
};

export default TalentPage;
