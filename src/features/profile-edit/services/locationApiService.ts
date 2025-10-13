import type { LocationAPIResponse, LocationInput, LocationValue } from '../types/location.types';

// .env (con Geoapify hoy, pero agnóstico):
// VITE_LOCATION_API_BASE=https://api.geoapify.com/v1/geocode/autocomplete
// VITE_LOCATION_API_KEY=xxxxx

const API_KEY = import.meta.env.VITE_LOCATION_API_KEY as string;
const RAW_BASE =
  (import.meta.env.VITE_LOCATION_API_BASE as string) || 'https://api.geoapify.com/v1/geocode/autocomplete';
const BASE = RAW_BASE.endsWith('/autocomplete') ? RAW_BASE : `${RAW_BASE.replace(/\/$/, '')}/autocomplete`;

/**
 * Autocomplete de localidades/ciudades (sin calles) en **una sola** request.
 * - mínimo texto: 4 chars
 * - por defecto restringe a AR
 */
export async function locationApiCityAutocomplete(
  text: string,
  opts?: {
    signal?: AbortSignal;
    countryCodes?: string[]; // default ['AR']
    lang?: string; // default 'es'
    limit?: number; // default 8
  }
): Promise<LocationInput[]> {
  if (!API_KEY) return [];
  const q = text.trim();
  if (q.length < 4) return [];

  const lang = opts?.lang ?? 'es';
  const limit = String(opts?.limit ?? 8);
  const countries = (opts?.countryCodes ?? ['AR']).map((c) => c.toLowerCase());

  // Una sola request (sin `type`). Filtramos luego.
  const params = new URLSearchParams({
    text: q,
    apiKey: API_KEY,
    lang,
    limit,
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
      // quedarnos solo con “city-like”: si no hay ningún campo de estos, lo descartamos
      .filter((f) => {
        const p = (f?.properties ?? {}) as Record<string, unknown>;
        return Boolean(
          p['city'] ||
            p['town'] ||
            p['village'] ||
            p['locality'] ||
            p['suburb'] ||
            p['neighbourhood'] ||
            p['district'] ||
            p['quarter'] ||
            p['municipality'] ||
            p['name']
        );
      })
      .map((f) => mapProviderToLocationInput(f.properties as Record<string, unknown>))
      .filter((x): x is LocationInput => x != null)
      // Dedupe por suburb|city|countryCode (si no hay suburb, usa vacío)
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

  // Formato para dropdown: "suburb, city, country" (o "city, country" si no hay suburb)
  const formatted = suburb ? `${suburb}, ${cityLike}, ${country}` : `${cityLike}, ${country}`;

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
  const display =
    loc.suburb && loc.suburb !== loc.city
      ? `${loc.suburb}, ${loc.city}, ${loc.country}`
      : `${loc.city}, ${loc.country}`;

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

/* ===== Utils ===== */
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
