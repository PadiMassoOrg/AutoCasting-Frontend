import EmployerCreateCastingSection from './EmployerCreateCastingSection';
import EmployerManageCastingSection from './EmployerManageCastingSection';

const EmployerPage = () => {
  return (
    <div className="flex flex-col gap-16 lg:gap-30 pb-10">
      <EmployerCreateCastingSection></EmployerCreateCastingSection>
      <EmployerManageCastingSection></EmployerManageCastingSection>
    </div>
  );
};

export default EmployerPage;
