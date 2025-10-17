// services/locationApiService.ts
import type { LocationAPIResponse, LocationInput, LocationValue } from '../types/location.types';

const API_KEY = import.meta.env.VITE_LOCATION_API_KEY as string;
const RAW_BASE =
  (import.meta.env.VITE_LOCATION_API_BASE as string) || 'https://api.geoapify.com/v1/geocode/autocomplete';
const BASE = RAW_BASE.endsWith('/autocomplete') ? RAW_BASE : `${RAW_BASE.replace(/\/$/, '')}/autocomplete`;

/**
 * Autocomplete de localidades/ciudades.
 * - 1 sola request (type=locality) → evita el 400 por tipos no permitidos
 * - minLength recomendado: 4 (lo controla el componente)
 * - countryCodes por defecto: ['AR']
 */
export async function locationApiCityAutocomplete(
  text: string,
  opts?: {
    signal?: AbortSignal;
    countryCodes?: string[];
    lang?: string;
    limit?: number;
  }
): Promise<LocationInput[]> {
  if (!API_KEY) return [];
  const q = text.trim();
  if (q.length < 4) return [];

  const lang = opts?.lang ?? 'es';
  const limit = String(opts?.limit ?? 8);
  const countries = (opts?.countryCodes ?? ['AR']).map((c) => c.toLowerCase());

  const params = new URLSearchParams({
    text: q,
    apiKey: API_KEY,
    lang,
    limit,
    type: 'locality', // <-- ÚNICA request, tipo permitido por Geoapify
    filter: `countrycode:${countries.join(',')}`,
  });

  const res = await fetch(`${BASE}?${params.toString()}`, {
    method: 'GET',
    signal: opts?.signal,
    headers: { 'Cache-Control': 'no-store' },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as LocationAPIResponse;

  return (
    (data.features ?? [])
      .map((f) => mapProviderToLocationInput(f?.properties as Record<string, unknown>))
      .filter((x): x is LocationInput => x != null)
      // Dedupe por suburb|city|countryCode
      .filter(uniqueBy((x) => `${(x.suburb ?? '').toLowerCase()}|${x.city.toLowerCase()}|${x.countryCode}`))
  );
}

/** Mapper: proveedor → modelo interno (city-like + suburb). */
function mapProviderToLocationInput(props: Record<string, unknown> | undefined): LocationInput | null {
  if (!props) return null;

  const cityLike =
    str(props['city']) ||
    str(props['town']) ||
    str(props['village']) ||
    str(props['locality']) ||
    str(props['suburb']) ||
    str(props['neighbourhood']) ||
    str(props['district']) ||
    str(props['quarter']) ||
    str(props['municipality']) ||
    str(props['name']) ||
    '';
  if (!cityLike) return null;

  const suburbCandidate =
    str(props['suburb']) ||
    str(props['neighbourhood']) ||
    str(props['quarter']) ||
    str(props['locality']) ||
    str(props['district']) ||
    undefined;
  const suburb = suburbCandidate && suburbCandidate !== cityLike ? suburbCandidate : '';

  const state = str(props['state']) || '';
  const country = str(props['country']) || '';
  const countryCode = (str(props['country_code']) || '').toUpperCase();
  const lat = num(props['lat']);
  const lon = num(props['lon']);
  const placeId = str(props['place_id']);

  // Formato para dropdown y para pintar en input: "suburb, city, country" o "city, country"
  const formatted = suburb ? `${suburb}, ${cityLike}, ${country}` : `${cityLike}, ${state}, ${country}`;

  return {
    suburb,
    city: cityLike,
    state,
    country,
    countryCode,
    formatted,
    lat,
    lon,
    provider: 'LOCATION_API',
    providerPlaceId: placeId || undefined,
  };
}

/** Normaliza a valor listo para guardar/mostrar. */
export function toLocationValue(loc: LocationInput): LocationValue {
  const partsWhenNoSuburb = [loc.city, loc.state, loc.country].filter(Boolean).join(', ');
  const display =
    loc.suburb && loc.suburb !== loc.city ? `${loc.suburb}, ${loc.city}, ${loc.country}` : partsWhenNoSuburb;

  return {
    display,
    suburb: loc.suburb ?? '',
    city: loc.city ?? '',
    state: loc.state ?? '',
    country: loc.country ?? '',
    countryCode: (loc.countryCode ?? '').toUpperCase(),
    lat: loc.lat,
    lon: loc.lon,
    provider: loc.provider,
    providerPlaceId: loc.providerPlaceId,
  };
}

/* Utils */
function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}
function num(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(+v)) return +v;
  return undefined;
}
function uniqueBy<T>(keyFn: (t: T) => string) {
  const seen = new Set<string>();
  return (x: T) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  };
}
