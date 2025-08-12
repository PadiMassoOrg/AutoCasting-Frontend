// import { useParams } from 'react-router-dom';
// import { usePublicProfile } from '../hooks/usePublicProfile';
import { useTranslation } from 'react-i18next';
import mock from '../MOCK_PROFILE.json';
import PublicFooterBar from '../components/PublicFooterBar';
import type { JSX } from 'react';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';

const PublicProfilePage = () => {
  // const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  // const { data, isLoading, error } = usePublicProfile(slug!);

  const error = false;
  const data = mock;
  const isLoading = false;

  const {
    id,
    roleStringCode,
    planStringCode,
    publicSlug,
    basicInfo,
    contact,
    socialMedia,
    media,
    characteristics,
    skills,
    credits,
    education,
  } = data;

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  const mergePictures = () => {
    let newArray = [];
    newArray.push(media.headshotImageUrl);
    newArray.push(media.fullBodyImageUrl);
    media.otherPicturesUrl.map((i) => newArray.push(i));
    return newArray;
  };

  return (
    <div className="pb-48 flex flex-col gap-6 justify-center">
      {/* Basic Info */}
      <article className="flex flex-col w-full gap-2">
        <span className="flex gap-1 items-center justify-center font-semibold text-sm mb-3">
          {basicInfo.professions.reduce<JSX.Element[]>((acc, curr, index) => {
            if (index === 0) return [<span key={curr.id}>{t(curr.stringCode)}</span>];
            return [
              ...acc,
              <span key={`sep-${index}`} className="mx-1">
                •
              </span>,
              <span key={curr.id}>{curr.stringCode}</span>,
            ];
          }, [])}
        </span>
        <h2 className="text-3xl">{basicInfo.stageName}</h2>
        <span className="flex gap-1 text-gray-400 text-sm font-light">
          <p>{basicInfo.gender}</p>•<p>{basicInfo.birthDate}</p>
        </span>
      </article>
      {/* Media */}
      <article className="sm:hidden">
        <ImageCarousel images={mergePictures()}></ImageCarousel>
      </article>
      <article>
        <h1 className="font-bold">Profile</h1>
        <p>{t(roleStringCode)}</p>
        <p>{t(planStringCode)}</p>
        <p>{publicSlug}</p>
        <h1 className="font-bold">Contact</h1>
        <p>{contact.email}</p>
        <p>{contact.phoneNumber}</p>
        <h1 className="font-bold">Social Media</h1>
        <p>{socialMedia.instagramUrl}</p>
        <p>{socialMedia.tikTokUrl}</p>
        <h1 className="font-bold">Characteristics</h1>
        <p>{characteristics.heightCm}</p>
        <p>{characteristics.weightKg}</p>
        <p>{t(characteristics.hairColor.stringCode)}</p>
        <p>{t(characteristics.eyeColor.stringCode)}</p>
        <p>{characteristics.chestCm}</p>
        <p>{characteristics.waistCm}</p>
        <p>{characteristics.hipCm}</p>
        <p>{characteristics.shirtSize}</p>
        <p>{characteristics.pantSize}</p>
        <p>{characteristics.dressSize}</p>
        <p>{characteristics.shoeSize}</p>
        <p>tattoo: {characteristics.tattoo ? 'Si' : 'No'}</p>
        <p>passport: {characteristics.passport ? 'Si' : 'No'}</p>
        <p>licencia: {characteristics.drivingLicense ? 'Si' : 'No'}</p>
        <p>{t(characteristics.dietOption.stringCode)}</p>
        <h1 className="font-bold">Skills</h1>
        <h1 className="font-bold">Credits</h1>
        <h1 className="font-bold">Education</h1>
      </article>
      {/* Footer Actions */}
      <article className="sm:hidden">
        <PublicFooterBar></PublicFooterBar>
      </article>
    </div>
  );
};

export default PublicProfilePage;
