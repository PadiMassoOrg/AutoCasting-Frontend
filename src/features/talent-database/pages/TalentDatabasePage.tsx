import { useTranslation } from 'react-i18next';
import { TalentCard } from '../components/TalentCard';
import { useTalentDatabase } from '../hooks/useTalentDatabase';

const TalentDatabasePage = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useTalentDatabase();
  // TODO - Verify Flow
  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  return (
    <section className="flex flex-col gap-5">
      <article className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
        <span>Menu</span>
      </article>
      <article className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] auto-rows-auto sm:auto-rows-[408px]">
        {data.items.map((it) => (
          <div key={it.id} className="w-full h-full">
            <TalentCard item={it} />
          </div>
        ))}
      </article>
    </section>
  );
};

export default TalentDatabasePage;
