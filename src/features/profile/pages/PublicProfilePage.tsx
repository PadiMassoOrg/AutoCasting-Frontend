import { useParams } from 'react-router-dom';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { useTranslation } from 'react-i18next';
import mock from '../MOCK_PROFILE.json';
import { PublicNavbar } from '../../../layouts/components';
import PublicFooterBar from '../components/PublicFooterBar';
import type { JSX } from 'react';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  // const { data, isLoading, error } = usePublicProfile(slug!);

  const error = false;
  const data = mock;
  const isLoading = false;

  const {
    name,
    email,
    roleStringCode,
    planStringCode,
    prof,
    gender,
    age,
    images,
    videos,
    height,
    weight,
    hairColor,
    eyeColor,
    chestWidth,
    waist,
    hips,
    shirtSize,
    pantSize,
    dressSize,
    shoeSize,
    hasTattoos,
    hasPassport,
    hasDrivingLicense,
    diet,
  } = data;

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;
  return (
    <div className="bg-white min-h-dvh pb-48">
      <article className="px-4 mt-6 flex flex-col gap-5">
        {/* Data */}
        <article className="flex flex-col w-full gap-2">
          <span className="flex gap-1 items-center justify-center font-semibold text-sm mb-3">
            {prof.reduce<JSX.Element[]>((acc, curr, index) => {
              if (index === 0) return [<span key={curr}>{curr}</span>];
              return [
                ...acc,
                <span key={`sep-${index}`} className="mx-1">
                  •
                </span>,
                <span key={curr}>{curr}</span>,
              ];
            }, [])}
          </span>
          <h2 className="text-3xl">{name}</h2>
          <span className="flex gap-1 text-gray-400 text-sm font-light">
            <p>{gender}</p>•<p>{age}</p>
          </span>
        </article>
        {/* Imagenes */}
        <ImageCarousel images={images}></ImageCarousel>
      </article>
      <PublicFooterBar></PublicFooterBar>
    </div>
  );
};

export default PublicProfilePage;
