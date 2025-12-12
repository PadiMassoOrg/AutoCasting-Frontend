import type { CastingResponse } from '../../employer/employer-castings/types/employerCastings.types';

export const CASTING_ROLE_PUBLIC_CARDS_MOCK = [
  {
    id: 'role-id-1',
    name: 'Cantante Femenino',
    employerImageUrl:
      'https://qmtzkcmnmhvmaerqhaex.supabase.co/storage/v1/object/public/profile-media-public/employer/d2d48616-72c1-4984-be34-6dbd293a6133/logo/1765187320706.jpeg',
    employerCompanyName: 'Company =)',
    projectType: {
      id: '0b3f43bf-8052-4866-a8e1-92f90ef9030c1',
      stringCode: 'sitemetadata.project_type.music_video',
      categoryStringCode: 'sitemetadata.project_type',
    },
    castingModality: {
      id: '7b3d100b-786b-40af-a08e-ec733633a52d',
      stringCode: 'sitemetadata.casting_modality.autocasting',
      categoryStringCode: 'sitemetadata.casting_modality',
    },
    location: '123 Avenida Siempre Viva',
    shootingStartDate: '2026-1-31',
    shootingEndDate: '2026-2-31',
    professions: [
      {
        id: '4c48e4fe-e34d-4e18-9940-be64a0cfd21d',
        stringCode: 'sitemetadata.profession.actor',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
      {
        id: '6059b9ad-df1e-4059-81f0-c9a93e165588',
        stringCode: 'sitemetadata.profession.dancer',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
    ],
    roleType: {
      id: '10135975-a6fa-4f0c-9fa7-095a32b3b3d7',
      stringCode: 'sitemetadata.role_type.lead',
      categoryStringCode: 'sitemetadata.role_type',
    },
    gender: {
      id: '70de7d42-7f89-4d98-8484-f236f898c768',
      stringCode: 'sitemetadata.gender.female',
    },
    ageMin: 18,
    ageMax: 32,
    defaultCode: 'C-12345',
  },
  {
    id: 'role-id-2',
    name: 'Guitarrista',
    employerImageUrl:
      'https://qmtzkcmnmhvmaerqhaex.supabase.co/storage/v1/object/public/profile-media-public/employer/d2d48616-72c1-4984-be34-6dbd293a6133/logo/1765187320706.jpeg',
    employerCompanyName: 'Company =)',
    projectType: {
      id: '0b3f43bf-8052-4866-a8e1-92f90ef9030c1',
      stringCode: 'sitemetadata.project_type.music_video',
      categoryStringCode: 'sitemetadata.project_type',
    },
    castingModality: {
      id: '7b3d100b-786b-40af-a08e-ec733633a52d',
      stringCode: 'sitemetadata.casting_modality.autocasting',
      categoryStringCode: 'sitemetadata.casting_modality',
    },
    location: '123 Avenida Siempre Viva',
    shootingStartDate: '2026-1-31',
    shootingEndDate: '2026-2-31',
    professions: [
      {
        id: '4c48e4fe-e34d-4e18-9940-be64a0cfd21d',
        stringCode: 'sitemetadata.profession.actor',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
      {
        id: '6059b9ad-df1e-4059-81f0-c9a93e165588',
        stringCode: 'sitemetadata.profession.dancer',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
    ],
    roleType: {
      id: '10135975-a6fa-4f0c-9fa7-095a32b3b3d7',
      stringCode: 'sitemetadata.role_type.lead',
      categoryStringCode: 'sitemetadata.role_type',
    },
    gender: {
      id: '70de7d42-7f89-4d98-8484-f236f898c768',
      stringCode: 'sitemetadata.gender.female',
    },
    ageMin: 18,
    ageMax: 32,
    defaultCode: 'C-12346',
  },
  {
    id: 'role-id-3',
    name: 'Asiaticas para documental de la China Imperial del siglo XVI',
    employerImageUrl:
      'https://qmtzkcmnmhvmaerqhaex.supabase.co/storage/v1/object/public/profile-media-public/employer/d2d48616-72c1-4984-be34-6dbd293a6133/logo/1765187320706.jpeg',
    employerCompanyName: 'Company =)',
    projectType: {
      id: 'c09b5f1d-f2d0-41b0-885d-6ae0865d8d76',
      stringCode: 'sitemetadata.project_type.documentary',
      categoryStringCode: 'sitemetadata.project_type',
    },
    castingModality: {
      id: '8beb3bc6-e465-46ff-99ba-e7044ff0d238',
      stringCode: 'sitemetadata.casting_modality.on_site',
      categoryStringCode: 'sitemetadata.casting_modality',
    },
    location: 'Olivos',
    shootingStartDate: '2026-1-31',
    shootingEndDate: '2026-2-31',
    professions: [
      {
        id: '4c48e4fe-e34d-4e18-9940-be64a0cfd21d',
        stringCode: 'sitemetadata.profession.actor',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
      {
        id: '6059b9ad-df1e-4059-81f0-c9a93e165588',
        stringCode: 'sitemetadata.profession.dancer',
        categoryStringCode: 'sitemetadata.category.scenic',
      },
    ],
    roleType: {
      id: '10135975-a6fa-4f0c-9fa7-095a32b3b3d7',
      stringCode: 'sitemetadata.role_type.lead',
      categoryStringCode: 'sitemetadata.role_type',
    },
    gender: {
      id: '70de7d42-7f89-4d98-8484-f236f898c768',
      stringCode: 'sitemetadata.gender.female',
    },
    ageMin: 25,
    ageMax: 45,
    defaultCode: 'C-12347',
  },
];

export const PUBLIC_CASTING_MOCK: CastingResponse = {
  id: '648a58e5-4383-4907-83b2-7e78f1d13acb',
  defaultCode: 'C-648A58E5',
  castingStatus: {
    id: 'd025ae16-a0c6-49b4-861e-b657dec9a5ca',
    stringCode: 'sitemetadata.casting_status.draft',
    categoryStringCode: 'sitemetadata.casting_status',
  },
  castingBasicInfo: {
    id: 'a05a10c3-d907-4773-92ca-9c0c89c12865',
    sectionStatus: {
      id: '56dccf06-edc6-498d-99c7-0010fb8755a3',
      stringCode: 'sitemetadata.casting_section_status.not_started',
      categoryStringCode: 'sitemetadata.casting_section_status',
    },
    title: 'Casting Fanta',
    projectType: {
      id: '054145ca-93f5-4f4e-8dd6-b9e7935b6017',
      stringCode: 'sitemetadata.project_type.theatre_play',
      categoryStringCode: 'sitemetadata.project_type',
    },
    location: 'Puente La Noria',
    castingModality: {
      id: '8beb3bc6-e465-46ff-99ba-e7044ff0d238',
      stringCode: 'sitemetadata.casting_modality.on_site',
      categoryStringCode: 'sitemetadata.casting_modality',
    },
    castingModalityText: 'Lo hacemos en el fondo de mi patio',
    applicationDeadline: '2026-1-31',
    hasWardrobeFitting: false,
    wardrobeFittingText: null,
    shootingStartDate: '2026-2-01',
    shootingEndDate: '2026-2-10',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at nisl nec metus feugiat ullamcorper. Nulla facilisi. Sed suscipit, nunc eu tempor aliquet, ex erat rhoncus lorem, vitae tempus lorem ligula non odio. Integer vitae lacus id velit posuere mattis non a arcu.',
  },
  castingRoles: {
    id: '9850e544-cccc-42a2-a7d6-aa0be64896a2',
    sectionStatus: {
      id: '56dccf06-edc6-498d-99c7-0010fb8755a3',
      stringCode: 'sitemetadata.casting_section_status.not_started',
      categoryStringCode: 'sitemetadata.casting_section_status',
    },
    generalNotes: 'Notas generales sobre el casting, que no las utilizamos en Frontend por ahora.',
    roles: [
      {
        id: '123',
        isComplete: true,
        name: 'Hamlet',
        roleType: {
          id: '10135975-a6fa-4f0c-9fa7-095a32b3b3d7',
          stringCode: 'sitemetadata.role_type.lead',
          categoryStringCode: 'sitemetadata.role_type',
        },
        gender: {
          id: 'f2ddae6f-dbd4-4ace-bbc2-dec807c6eb6f',
          stringCode: 'sitemetadata.gender.male',
        },
        ageMin: 18,
        ageMax: 50,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at nisl nec metus feugiat ullamcorper. Nulla facilisi. Sed suscipit, nunc eu tempor aliquet, ex erat rhoncus lorem, vitae tempus lorem ligula non odio. Integer vitae lacus id velit posuere mattis non a arcu.',
        professions: [
          {
            id: '4c48e4fe-e34d-4e18-9940-be64a0cfd21d',
            stringCode: 'sitemetadata.profession.actor',
            categoryStringCode: 'sitemetadata.category.scenic',
          },
          {
            id: 'a2854dee-4eaf-4786-b098-e356387ff3e9',
            stringCode: 'sitemetadata.profession.singer',
            categoryStringCode: 'sitemetadata.category.scenic',
          },
        ],
        characteristics: {
          id: '123',
          heightCm: 170,
          ethnicity: {
            id: 'c51a7430-02ba-4bc5-8f33-7d7ce3761444',
            stringCode: 'sitemetadata.ethnicity.white_caucasian',
          },
          ethnicityId: null,
          weightKg: null,
          hairColor: {
            id: 'e0478be6-36d2-4968-8b42-4b481a2efe1d',
            stringCode: 'sitemetadata.color.light_brown',
            categoryStringCode: 'sitemetadata.category.hair_color',
          },
          hairColorId: null,
          eyeColor: null,
          eyeColorId: null,
          chestCm: null,
          waistCm: null,
          hipCm: null,
          shirtSize: null,
          pantSize: null,
          dressSize: null,
          shoeSize: null,
          tattoo: true,
          passport: true,
          drivingLicense: null,
          dietOption: null,
          dietOptionId: null,
        },
        skills: [
          {
            id: 'e1bc529c-88e9-4221-9413-220de3160145',
            stringCode: 'sitemetadata.skill.athletics',
            categoryStringCode: 'sitemetadata.category.sport',
          },
          {
            id: 'a905d7b8-2409-45ec-8284-51805b785abc',
            stringCode: 'sitemetadata.skill.basketball',
            categoryStringCode: 'sitemetadata.category.sport',
          },
          {
            id: 'badb4d68-9a27-4a84-8cbf-c275786001db',
            stringCode: 'sitemetadata.skill.aerial_acrobatics',
            categoryStringCode: 'sitemetadata.category.physical',
          },
          {
            id: '6de99c85-6d01-4c1f-93fe-c9da13476a44',
            stringCode: 'sitemetadata.skill.russian',
            categoryStringCode: 'sitemetadata.category.language',
          },
          {
            id: '8bd33194-9ce7-4f1b-91b7-9c76eddec7df',
            stringCode: 'sitemetadata.skill.spanish_arg',
            categoryStringCode: 'sitemetadata.category.accent',
          },
        ],
      },
    ],
  },
  castingActing: {
    id: '486e4330-ebaa-418a-819c-b8465691ad22',
    sectionStatus: {
      id: '56dccf06-edc6-498d-99c7-0010fb8755a3',
      stringCode: 'sitemetadata.casting_section_status.not_started',
      categoryStringCode: 'sitemetadata.casting_section_status',
    },
    actingMode: {
      id: '102ddc33-a772-42d1-95e1-416e9538b1f4',
      stringCode: 'sitemetadata.acting_mode.none',
      categoryStringCode: 'sitemetadata.acting_mode',
    },
    requirements: [],
  },

  castingRemuneration: {
    id: '2c9fd8f1-bd08-4aa2-92b4-d52a39e25850',
    sectionStatus: {
      id: '56dccf06-edc6-498d-99c7-0010fb8755a3',
      stringCode: 'sitemetadata.casting_section_status.not_started',
      categoryStringCode: 'sitemetadata.casting_section_status',
    },
    compensationType: {
      id: '387153b3-9995-42f5-b913-52f9dad84a4c',
      stringCode: 'sitemetadata.compensation_type.unpaid',
      categoryStringCode: 'sitemetadata.compensation_type',
    },
    paySameForAllRoles: true,
    remunerations: [],
  },
};
