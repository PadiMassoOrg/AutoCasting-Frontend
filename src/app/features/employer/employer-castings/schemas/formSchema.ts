import type { TFunction } from 'i18next';
import z from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_TEXT_RX = /^[A-Za-zÀ-ÿ0-9 ]+$/;

export const getCastingRoleSchema = (t: TFunction) => z.object({});
