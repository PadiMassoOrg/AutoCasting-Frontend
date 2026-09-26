import type { CastingRolePublicCardResponse } from '../../casting-database/types/casting-database.types';
import type { PublicCastingData, PublicCastingRole } from '../types/publicCasting.types';

export function mapRoleToCard(role: PublicCastingRole, casting: PublicCastingData): CastingRolePublicCardResponse {
  return {
    id: role.id,
    name: role.roleName,
    castingTitle: casting.title,
    employerImageUrl: casting.employerInfo?.imageUrl || null,
    projectType: casting.projectType,
    shootingStartDate: casting.shootingStartDate,
    shootingEndDate: casting.shootingEndDate,
    roleType: role.roleType ?? { id: '', stringCode: 'general.not_specified' },
    gender: role.gender ?? { id: '', stringCode: 'general.not_specified' },
    ageMin: role.ageMin ?? 0,
    ageMax: role.ageMax ?? 0,
    defaultCode: casting.slug,
  };
}
